import path from "node:path";

import { renderRuleArtifact } from "../shared";
import type { ResolveInstallPlanInput, RuntimeManifest } from "../../installer/types";

export function resolveCursorTargetDir({
  scope,
  cwd = process.cwd(),
  targetRoot
}: ResolveInstallPlanInput) {
  if (scope === "global") {
    throw new Error(
      "Cursor global rules live in Cursor settings and are not file-installable. Use --local instead."
    );
  }

  const baseDir = targetRoot ?? cwd;
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
