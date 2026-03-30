import {
  outputTargets,
  toneOptions,
  type WriterProfile
} from "@/lib/writer-profile-schema";
import { type NormalizedSourceItem } from "@/lib/source-normalization";

type OutputTarget = (typeof outputTargets)[number];
type ToneOption = (typeof toneOptions)[number];

type AnalysisInput = {
  items: NormalizedSourceItem[];
  profile: WriterProfile;
  requestedOutput: OutputTarget;
  requestedTone: ToneOption;
};

type DraftInput = {
  analysis: ReconstructionAnalysis;
  profile: WriterProfile;
  requestedOutput: OutputTarget;
  requestedTone: ToneOption;
  answers: string[];
  rewriteInstruction?: string;
};

export type ReconstructionAnalysis = {
  items: NormalizedSourceItem[];
  requestedOutput: OutputTarget;
  requestedTone: ToneOption;
  coreMessage: string;
  supportingPoints: string[];
  followUpQuestions: string[];
  missingContext: string[];
};

export type DraftResult = {
  content: string;
  sourceLines: string[];
  mode: "heuristic";
};

export function buildReconstructionAnalysis({
  items,
  profile,
  requestedOutput,
  requestedTone
}: AnalysisInput): ReconstructionAnalysis {
  const readyItems = items.filter((item) => item.status === "ready");
  const missingContext = items
    .filter((item) => item.status === "needs_context")
    .map((item) => `Add context for ${item.title}.`);
  const textItems = readyItems.filter((item) => item.kind === "text");
  const firstText = textItems[0]?.excerpt;
  const leadIdea =
    firstText ??
    readyItems[0]?.excerpt ??
    "Several saved sources are pointing at the same idea.";
  const coreMessage = buildCoreMessage(leadIdea, requestedTone);

  const supportingPoints = readyItems
    .slice(0, 5)
    .map((item) => {
      const basis = item.kind === "text" ? item.excerpt : `${item.title}: ${item.excerpt}`;
      return trimSentence(basis, 140);
    });

  const followUpQuestions = [
    textItems.length === 0
      ? "What do you want the reader to understand after reading this?"
      : null,
    missingContext.length > 0
      ? "One or more links could not be read. Can you add one or two lines for those sources?"
      : null,
    !containsFirstPersonSignal(textItems.map((item) => item.raw).join(" "))
      ? "Why does this matter to you personally or professionally?"
      : null,
    requestedOutput === "blog"
      ? "Who is the intended blog reader, and what should they take away?"
      : "Who is the LinkedIn post really for?"
  ]
    .filter(Boolean)
    .slice(0, 4) as string[];

  return {
    items,
    requestedOutput,
    requestedTone,
    coreMessage: applyProfileGuardrails(coreMessage, profile),
    supportingPoints: supportingPoints.map((point) =>
      applyProfileGuardrails(point, profile)
    ),
    followUpQuestions,
    missingContext
  };
}

export function buildDraft({
  analysis,
  profile,
  requestedOutput,
  requestedTone,
  answers,
  rewriteInstruction = ""
}: DraftInput): DraftResult {
  const shortPreference = profile.editPreferences.some((item) =>
    item.toLowerCase().includes("shorter")
  );
  const avoidQuestionEnding = profile.editPreferences.some((item) =>
    item.toLowerCase().includes("avoid ending drafts with a question")
  );
  const firstPersonPreferred =
    profile.editPreferences.some((item) =>
      item.toLowerCase().includes("first-person")
    ) || containsFirstPersonSignal(analysis.items.map((item) => item.raw).join(" "));
  const rewriteMode = parseRewriteInstruction(rewriteInstruction);

  const perspective = firstPersonPreferred ? "I" : profile.displayName;
  const answerBlock = answers.filter(Boolean).join(" ");
  const sourceLines = buildSourceLines(analysis.items);

  const body =
    requestedOutput === "blog"
      ? buildBlogDraft({
          analysis,
          requestedTone,
          perspective,
          answerBlock,
          shortPreference: shortPreference || rewriteMode.shorter,
          avoidQuestionEnding,
          sourceLines
        })
      : buildLinkedInDraft({
          analysis,
          requestedTone,
          perspective,
          answerBlock,
          shortPreference: shortPreference || rewriteMode.shorter,
          avoidQuestionEnding,
          sourceLines
        });

  return {
    content: applyProfileGuardrails(
      applyRewriteInstruction(body, rewriteMode, analysis.coreMessage),
      profile
    ),
    sourceLines,
    mode: "heuristic"
  };
}

function buildCoreMessage(leadIdea: string, tone: ToneOption) {
  const toneLead: Record<ToneOption, string> = {
    professional: "The clearest message in this material is this",
    "insight-driven": "One pattern keeps surfacing across these materials",
    "story-driven": "When these notes and links are read together, one story emerges",
    casual: "After looking through this pile of notes, one thing stands out",
    persuasive: "If there is one point worth paying attention to here, it is this"
  };

  return `${toneLead[tone]}: ${trimSentence(leadIdea, 180)}.`;
}

function buildLinkedInDraft({
  analysis,
  requestedTone,
  perspective,
  answerBlock,
  shortPreference,
  avoidQuestionEnding,
  sourceLines
}: {
  analysis: ReconstructionAnalysis;
  requestedTone: ToneOption;
  perspective: string;
  answerBlock: string;
  shortPreference: boolean;
  avoidQuestionEnding: boolean;
  sourceLines: string[];
}) {
  const opener = getToneOpener(requestedTone, perspective);
  const supporting = analysis.supportingPoints
    .slice(0, shortPreference ? 2 : 3)
    .map((point) => `${point}.`)
    .join("\n\n");
  const personalLine = answerBlock
    ? `${perspective} would frame it this way: ${trimSentence(answerBlock, 180)}.`
    : `${perspective} would rather publish a grounded point with real attribution than a polished summary with no traceable source.`;
  const closing = avoidQuestionEnding
    ? "The point is simple: if the source matters, the attribution should stay in the draft."
    : "If the source matters to the argument, it should still be visible in the final draft.";

  return [
    `${opener} ${analysis.coreMessage}`,
    personalLine,
    supporting,
    closing,
    "Sources",
    ...sourceLines
  ]
    .filter(Boolean)
    .join("\n\n");
}

function buildBlogDraft({
  analysis,
  requestedTone,
  perspective,
  answerBlock,
  shortPreference,
  avoidQuestionEnding,
  sourceLines
}: {
  analysis: ReconstructionAnalysis;
  requestedTone: ToneOption;
  perspective: string;
  answerBlock: string;
  shortPreference: boolean;
  avoidQuestionEnding: boolean;
  sourceLines: string[];
}) {
  const title = trimSentence(analysis.coreMessage, 72).replace(/\.$/, "");
  const intro = `${getToneOpener(requestedTone, perspective)} ${analysis.coreMessage}`;
  const whyItMatters = answerBlock
    ? `${perspective} would position the piece around this angle: ${trimSentence(answerBlock, 220)}.`
    : `${perspective} wants the piece to stay specific, source-aware, and close to the original thinking instead of flattening everything into a generic summary.`;
  const evidenceBlock = analysis.supportingPoints
    .slice(0, shortPreference ? 2 : 4)
    .map((point) => `${point}.`)
    .join("\n\n");
  const close = avoidQuestionEnding
    ? "The finish should stay direct: keep the attribution, keep the real point, and let the writing sound like a person."
    : "The finish should stay direct: keep the attribution, keep the real point, and let the writing sound like a person.";

  return [
    title,
    intro,
    "What the material points to",
    whyItMatters,
    "Where the support comes from",
    evidenceBlock,
    close,
    "Sources",
    ...sourceLines
  ]
    .filter(Boolean)
    .join("\n\n");
}

function buildSourceLines(items: NormalizedSourceItem[]) {
  return items.map((item, index) => {
    if (item.sourceUrl) {
      return `${index + 1}. ${item.title} — ${item.sourceUrl}`;
    }

    return `${index + 1}. ${item.title} — personal note`;
  });
}

function parseRewriteInstruction(value: string) {
  const normalized = value.toLowerCase();

  return {
    shorter: /\b(shorter|tighter|more concise)\b/.test(normalized),
    sharper: /\b(sharper|stronger|punchier)\b/.test(normalized),
    moreLikeMe: /\b(more like me|my voice|my style)\b/.test(normalized)
  };
}

function applyRewriteInstruction(
  content: string,
  rewriteMode: ReturnType<typeof parseRewriteInstruction>,
  coreMessage: string
) {
  let next = content;

  if (rewriteMode.sharper) {
    const paragraphs = next.split("\n\n");

    if (paragraphs[0]) {
      paragraphs[0] = `${paragraphs[0]} The point is straightforward: ${coreMessage}`;
    }

    next = paragraphs.join("\n\n");
  }

  if (rewriteMode.moreLikeMe) {
    next = next.replace(
      /^([^.\n]+)\./,
      "$1. This stays close to the original phrasing and lived context."
    );
  }

  if (rewriteMode.shorter) {
    next = next
      .split("\n\n")
      .filter((paragraph, index) => {
        if (paragraph === "Sources" || /^\d+\./.test(paragraph)) {
          return true;
        }

        return index < 6;
      })
      .join("\n\n");
  }

  return next;
}

function getToneOpener(tone: ToneOption, perspective: string) {
  const opener: Record<ToneOption, string> = {
    professional: `${perspective} reviewed these materials and one argument held up cleanly.`,
    "insight-driven": `${perspective} kept coming back to the same pattern while reviewing these notes and sources.`,
    "story-driven": `${perspective} started with scattered material, but it all leaned toward the same story.`,
    casual: `${perspective} threw a few notes and links together, and one idea refused to go away.`,
    persuasive: `${perspective} came away with a point that is hard to ignore.`
  };

  return opener[tone];
}

function containsFirstPersonSignal(value: string) {
  return /\b(I|my|me|mine)\b/i.test(value);
}

function trimSentence(value: string, maxLength: number) {
  const normalized = value.replace(/\s+/g, " ").trim().replace(/[.]+$/, "");
  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength - 1).trimEnd()}…`;
}

export function applyProfileGuardrails(text: string, profile: WriterProfile) {
  let next = text;

  for (const marker of profile.bannedMarkers) {
    if (!marker) {
      continue;
    }

    next = next.split(marker).join("");
  }

  next = next.replace(/\p{Extended_Pictographic}/gu, "");
  next = next.replace(/[ \t]+\n/g, "\n");
  next = next.replace(/\n{3,}/g, "\n\n");

  return next.trim();
}
