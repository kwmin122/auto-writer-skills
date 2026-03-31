import { buildRuntimeManifest } from "../core/runtime-manifest";
import {
  getAntigravityVerifyCommand,
  renderAntigravityArtifacts,
  resolveAntigravityTargetDir
} from "../adapters/antigravity";
import {
  getClaudeCodeVerifyCommand,
  renderClaudeCodeArtifacts,
  resolveClaudeCodeTargetDir
} from "../adapters/claude-code";
import {
  getCodexVerifyCommand,
  renderCodexArtifacts,
  resolveCodexTargetDir
} from "../adapters/codex";
import {
  getCursorVerifyCommand,
  renderCursorArtifacts,
  resolveCursorTargetDir
} from "../adapters/cursor";
import type { InstallPlan, ResolveInstallPlanInput, RuntimeAdapter } from "./types";

const runtimeRegistry: Record<RuntimeAdapter["runtime"], RuntimeAdapter> = {
  "claude-code": {
    runtime: "claude-code",
    displayName: "Claude Code",
    resolveTargetDir: resolveClaudeCodeTargetDir,
    renderArtifacts: renderClaudeCodeArtifacts,
    verifyCommand: getClaudeCodeVerifyCommand
  },
  codex: {
    runtime: "codex",
    displayName: "Codex",
    resolveTargetDir: resolveCodexTargetDir,
    renderArtifacts: renderCodexArtifacts,
    verifyCommand: getCodexVerifyCommand
  },
  cursor: {
    runtime: "cursor",
    displayName: "Cursor",
    resolveTargetDir: resolveCursorTargetDir,
    renderArtifacts: renderCursorArtifacts,
    verifyCommand: getCursorVerifyCommand
  },
  antigravity: {
    runtime: "antigravity",
    displayName: "Antigravity",
    resolveTargetDir: resolveAntigravityTargetDir,
    renderArtifacts: renderAntigravityArtifacts,
    verifyCommand: getAntigravityVerifyCommand
  }
};

export function resolveInstallPlan(input: ResolveInstallPlanInput): InstallPlan {
  const manifest = buildRuntimeManifest();
  const entries = input.runtimes.map((runtime) => {
    const adapter = runtimeRegistry[runtime];
    const targetDir = adapter.resolveTargetDir(input);

    return {
      runtime,
      displayName: adapter.displayName,
      targetDir,
      verifyCommand: adapter.verifyCommand(targetDir, input),
      artifacts: adapter.renderArtifacts(manifest, input)
    };
  });

  return { entries };
}
