import { describe, expect, it } from "vitest";

import { buildRuntimeManifest } from "@/core/runtime-manifest";
import { applyWritingGuardrails } from "@/core/writing";

describe("runtime manifest", () => {
  it("returns shared writing rules and supported runtimes", () => {
    const manifest = buildRuntimeManifest();

    expect(manifest.supportedRuntimes).toContain("codex");
    expect(manifest.supportedRuntimes).toContain("claude-code");
    expect(manifest.rules.requireSources).toBe(true);
    expect(manifest.rules.banMarkdownEmphasis).toBe(true);
  });

  it("applies shared writing guardrails to reusable content", () => {
    const result = applyWritingGuardrails("Hello **world** 😄\n\nSources\n\n1. Ref");

    expect(result).not.toContain("**");
    expect(result).not.toContain("😄");
    expect(result).toContain("Sources");
  });
});
