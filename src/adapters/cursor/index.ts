import path from "node:path";

import { renderRuleArtifact } from "../shared";
import type { ResolveInstallPlanInput, RuntimeManifest } from "../../installer/types";

export function resolveCursorTargetDir({
  scope,
  cwd = process.cwd(),
  homeDir = process.env.HOME ?? "",
  targetRoot
}: ResolveInstallPlanInput) {
  const baseDir = targetRoot ?? (scope === "global" ? homeDir : cwd);
  return path.join(baseDir, ".cursor", "rules");
}

export function renderCursorArtifacts(manifest: RuntimeManifest) {
  return renderRuleArtifact(
    manifest,
    "Source-aware writing workflow for Cursor",
    "auto-writer-skills.mdc"
  );
}

export function getCursorVerifyCommand(targetDir: string) {
  return `test -f "${path.join(targetDir, "auto-writer-skills.mdc")}"`;
}
