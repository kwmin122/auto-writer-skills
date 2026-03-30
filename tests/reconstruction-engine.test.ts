import { describe, expect, it } from "vitest";

import { buildDraft, buildReconstructionAnalysis } from "@/lib/reconstruction-engine";
import type { NormalizedSourceItem } from "@/lib/source-normalization";
import { getDefaultWriterProfile } from "@/lib/writer-profile-schema";

function makeItem(overrides: Partial<NormalizedSourceItem>): NormalizedSourceItem {
  return {
    id: crypto.randomUUID(),
    raw: "raw",
    kind: "text",
    label: "Text note",
    title: "Text note",
    excerpt: "Source attribution keeps generated writing trustworthy.",
    status: "ready",
    needsManualContext: false,
    ...overrides
  };
}

describe("reconstruction engine", () => {
  it("creates a focused analysis and a source-aware draft without markdown emphasis or emoji", () => {
    const profile = getDefaultWriterProfile();
    const items = [
      makeItem({
        raw: "I want to explain why I refuse to post unattributed AI summaries.",
        excerpt: "I want to explain why I refuse to post unattributed AI summaries."
      }),
      makeItem({
        kind: "github",
        label: "GitHub repository",
        title: "kwmin122/auto-writer-skills",
        sourceUrl: "https://github.com/kwmin122/auto-writer-skills",
        excerpt: "A repository for source-aware writing workflows."
      }),
      makeItem({
        kind: "url",
        label: "Reference article",
        title: "Example Article",
        sourceUrl: "https://example.com/article",
        excerpt: "An article about source context and trust."
      })
    ];

    const analysis = buildReconstructionAnalysis({
      items,
      profile,
      requestedOutput: "linkedin",
      requestedTone: "insight-driven"
    });

    expect(analysis.coreMessage.length).toBeGreaterThan(20);
    expect(analysis.followUpQuestions.length).toBeLessThanOrEqual(4);

    const draft = buildDraft({
      analysis,
      profile,
      requestedOutput: "linkedin",
      requestedTone: "insight-driven",
      answers: [
        "The readers are builders who publish online.",
        "The key point is that attribution is part of credibility."
      ]
    });

    expect(draft.content).toContain("Sources");
    expect(draft.content).toContain("Example Article");
    expect(draft.content).toContain("kwmin122/auto-writer-skills");
    expect(draft.content).not.toContain("**");
    expect(draft.content).not.toMatch(/\p{Extended_Pictographic}/gu);
  });
});
