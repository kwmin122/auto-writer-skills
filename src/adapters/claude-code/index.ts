import path from "node:path";

import { renderSkillArtifact } from "../shared";
import type { ResolveInstallPlanInput, RuntimeManifest } from "../../installer/types";

export function resolveClaudeCodeTargetDir({
  scope,
  cwd = process.cwd(),
  homeDir = process.env.HOME ?? "",
  targetRoot
}: ResolveInstallPlanInput) {
  const baseDir = targetRoot ?? (scope === "global" ? homeDir : cwd);
  return path.join(baseDir, ".claude", "skills", "auto-writer-skills");
}

export function renderClaudeCodeArtifacts(manifest: RuntimeManifest) {
  return renderSkillArtifact(manifest, "Claude Code");
}

export function getClaudeCodeVerifyCommand(targetDir: string) {
  return `test -f "${path.join(targetDir, "SKILL.md")}"`;
}
