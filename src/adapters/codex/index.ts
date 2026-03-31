import path from "node:path";

import { renderSkillArtifact } from "../shared";
import type { ResolveInstallPlanInput, RuntimeManifest } from "../../installer/types";

export function resolveCodexTargetDir({
  scope,
  cwd = process.cwd(),
  homeDir = process.env.HOME ?? "",
  targetRoot
}: ResolveInstallPlanInput) {
  const baseDir = targetRoot ?? (scope === "global" ? homeDir : cwd);
  return path.join(baseDir, ".codex", "skills", "auto-writer-skills");
}

export function renderCodexArtifacts(manifest: RuntimeManifest) {
  return renderSkillArtifact(manifest, "Codex");
}

export function getCodexVerifyCommand(targetDir: string) {
  return `test -f "${path.join(targetDir, "SKILL.md")}"`;
}
