import { describe, expect, it } from "vitest";

import { renderAntigravityArtifacts } from "@/adapters/antigravity";
import { renderClaudeCodeArtifacts } from "@/adapters/claude-code";
import { renderCodexArtifacts } from "@/adapters/codex";
import { renderCursorArtifacts } from "@/adapters/cursor";
import { buildRuntimeManifest } from "@/core/runtime-manifest";

describe("runtime adapters", () => {
  const manifest = buildRuntimeManifest();

  it("renders codex skill artifacts", () => {
    const artifacts = renderCodexArtifacts(manifest);

    expect(artifacts.some((item) => item.relativePath.endsWith("SKILL.md"))).toBe(true);
  });

  it("renders claude code skill artifacts", () => {
    const artifacts = renderClaudeCodeArtifacts(manifest);

    expect(artifacts.some((item) => item.relativePath.endsWith("SKILL.md"))).toBe(true);
  });

  it("renders cursor rule artifacts", () => {
    const artifacts = renderCursorArtifacts(manifest);

    expect(artifacts.some((item) => item.relativePath.endsWith(".mdc"))).toBe(true);
  });

  it("renders antigravity rule artifacts", () => {
    const artifacts = renderAntigravityArtifacts(manifest, { runtimes: ["antigravity"], scope: "local" });

    expect(artifacts.some((item) => item.relativePath.endsWith(".md"))).toBe(true);
  });

  it("renders antigravity global agents artifact", () => {
    const artifacts = renderAntigravityArtifacts(manifest, {
      runtimes: ["antigravity"],
      scope: "global"
    });

    expect(artifacts.some((item) => item.relativePath === "AGENTS.md")).toBe(true);
  });
});
