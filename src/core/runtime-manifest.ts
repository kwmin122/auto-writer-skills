import { outputTargets, toneOptions } from "../lib/writer-profile-schema";
import type { RuntimeManifest, SupportedRuntime } from "../installer/types";

const supportedRuntimes: SupportedRuntime[] = [
  "claude-code",
  "codex",
  "cursor",
  "antigravity"
];

export function buildRuntimeManifest(): RuntimeManifest {
  return {
    skillName: "auto-writer-skills",
    title: "Source-aware writing agent",
    description:
      "Turns notes and links into source-aware writing that stays close to the user's voice.",
    supportedRuntimes,
    rules: {
      requireSources: true,
      banMarkdownEmphasis: true,
      banEmoji: true,
      keepHumanTone: true
    },
    usage: {
      acceptedInputs: ["text", "url", "youtube", "github", "paper"],
      outputs: [...outputTargets],
      tones: [...toneOptions],
      invocationExamples: [
        "Use this material to draft a LinkedIn post and keep the sources visible.",
        "Rewrite these notes into a blog draft in my tone and preserve attribution."
      ]
    },
    templates: {
      systemPrompt:
        "Reconstruct the user's material into natural writing. Keep attribution, avoid markdown emphasis, avoid emoji, and ask only the minimum missing questions.",
      followUpPolicy:
        "Ask at most four targeted follow-up questions, only when context is actually missing.",
      rewritePolicy:
        "Support short rewrite requests like shorter, sharper, and more like me without restarting the full flow."
    }
  };
}
