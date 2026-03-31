import type { ArtifactFile, RuntimeManifest } from "../installer/types";

export function renderSkillArtifact(
  manifest: RuntimeManifest,
  runtimeLabel: string
): ArtifactFile[] {
  const body = [
    "---",
    `name: ${manifest.skillName}`,
    `description: ${manifest.description}`,
    "---",
    "",
    `Use this in ${runtimeLabel} when the user wants to turn notes, drafts, or links into a LinkedIn post or blog draft.`,
    "",
    "Core rules:",
    "- Always preserve explicit source lines when outside references matter.",
    "- Never use markdown emphasis markers in generated writing.",
    "- Never use emoji in generated writing.",
    "- Ask only the minimum missing follow-up questions.",
    "",
    "Accepted inputs:",
    `- ${manifest.usage.acceptedInputs.join(", ")}`,
    "",
    "Output formats:",
    `- ${manifest.usage.outputs.join(", ")}`,
    "",
    "Tone presets:",
    `- ${manifest.usage.tones.join(", ")}`,
    "",
    "Invocation examples:",
    ...manifest.usage.invocationExamples.map((item) => `- ${item}`),
    "",
    "Prompt policy:",
    manifest.templates.systemPrompt,
    "",
    "Follow-up policy:",
    manifest.templates.followUpPolicy,
    "",
    "Rewrite policy:",
    manifest.templates.rewritePolicy
  ].join("\n");

  return [
    {
      relativePath: "SKILL.md",
      content: body
    }
  ];
}

export function renderRuleArtifact(
  manifest: RuntimeManifest,
  description: string,
  relativePath: string
): ArtifactFile[] {
  const body = [
    "---",
    `description: ${description}`,
    "alwaysApply: false",
    "---",
    "",
    `When the user asks for source-aware writing, apply the ${manifest.skillName} rules.`,
    "",
    "- Turn messy notes and links into a clear draft.",
    "- Keep source lines visible at the end.",
    "- Avoid markdown emphasis and emoji.",
    "- Prefer human, direct prose.",
    "- Support shorter, sharper, and more like me rewrite requests."
  ].join("\n");

  return [
    {
      relativePath,
      content: body
    }
  ];
}
