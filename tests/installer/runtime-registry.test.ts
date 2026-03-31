import path from "node:path";
import { describe, expect, it } from "vitest";

import { resolveInstallPlan } from "@/installer/runtime-registry";

describe("resolveInstallPlan", () => {
  it("builds an install plan for multiple runtimes and local scope", () => {
    const cwd = "/tmp/writer-skills-project";
    const homeDir = "/tmp/home";
    const plan = resolveInstallPlan({
      runtimes: ["codex", "claude-code"],
      scope: "local",
      cwd,
      homeDir
    });

    expect(plan.entries).toHaveLength(2);
    expect(plan.entries[0]?.runtime).toBe("codex");
    expect(plan.entries[0]?.targetDir).toBe(
      path.join(cwd, ".codex", "skills", "auto-writer-skills")
    );
    expect(plan.entries[1]?.targetDir).toBe(
      path.join(cwd, ".claude", "skills", "auto-writer-skills")
    );
  });

  it("uses Antigravity's documented paths for local and global installs", () => {
    const cwd = "/tmp/writer-skills-project";
    const homeDir = "/tmp/home";
    const localPlan = resolveInstallPlan({
      runtimes: ["antigravity"],
      scope: "local",
      cwd,
      homeDir
    });
    const globalPlan = resolveInstallPlan({
      runtimes: ["antigravity"],
      scope: "global",
      cwd,
      homeDir
    });

    expect(localPlan.entries[0]?.targetDir).toBe(path.join(cwd, ".agent", "rules"));
    expect(localPlan.entries[0]?.verifyCommand).toContain("auto-writer-skills.md");
    expect(globalPlan.entries[0]?.targetDir).toBe(path.join(homeDir, ".gemini"));
    expect(globalPlan.entries[0]?.verifyCommand).toContain("AGENTS.md");
  });
});
