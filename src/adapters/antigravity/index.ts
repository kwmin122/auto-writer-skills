import path from "node:path";

import { renderRuleArtifact } from "../shared";
import type { ResolveInstallPlanInput, RuntimeManifest } from "../../installer/types";

export function resolveAntigravityTargetDir({
  scope,
  cwd = process.cwd(),
  homeDir = process.env.HOME ?? "",
  targetRoot
}: ResolveInstallPlanInput) {
  if (scope === "global") {
    const baseDir = targetRoot ?? homeDir;
    return path.join(baseDir, ".gemini");
  }

  const baseDir = targetRoot ?? cwd;
  return path.join(baseDir, ".agent", "rules");
}

export function renderAntigravityArtifacts(
  manifest: RuntimeManifest,
  input: ResolveInstallPlanInput
) {
  if (input.scope === "global") {
    return [
      {
        relativePath: "AGENTS.md",
        content: renderAntigravityAgentsContent(manifest)
      }
    ];
  }

  return renderRuleArtifact(
    manifest,
    "Source-aware writing workflow for Antigravity",
    "auto-writer-skills.md"
  );
}

export function getAntigravityVerifyCommand(
  targetDir: string,
  input: ResolveInstallPlanInput
) {
  const filename = input.scope === "global" ? "AGENTS.md" : "auto-writer-skills.md";
  return `test -f "${path.join(targetDir, filename)}"`;
}

function renderAntigravityAgentsContent(manifest: RuntimeManifest) {
  return [
    "# AGENTS.md",
    "",
    "## Auto Writer Skills",
    `- Treat ${manifest.skillName} as the source-aware writing workflow for this environment.`,
    "- Turn loose notes, links, drafts, GitHub repositories, YouTube videos, and papers into structured writing.",
    "- Keep explicit source lines in the final output whenever outside references matter.",
    "- Do not use markdown emphasis markers in generated prose.",
    "- Do not use emoji in generated prose.",
    "- Ask only the minimum number of follow-up questions needed to fill missing context.",
    "- Support quick rewrite requests such as shorter, sharper, or more like me."
  ].join("\n");
}
