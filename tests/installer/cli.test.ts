import { describe, expect, it } from "vitest";

import { parseInstallerArgs } from "@/installer/cli";

describe("parseInstallerArgs", () => {
  it("parses runtime and scope flags", () => {
    const parsed = parseInstallerArgs(["--runtime", "codex,claude-code", "--global"]);

    expect(parsed.runtimes).toEqual(["codex", "claude-code"]);
    expect(parsed.scope).toBe("global");
  });

  it("supports the all shortcut, dry-run, and force", () => {
    const parsed = parseInstallerArgs([
      "--runtime",
      "all",
      "--local",
      "--dry-run",
      "--force"
    ]);

    expect(parsed.runtimes).toEqual([
      "claude-code",
      "codex",
      "cursor",
      "antigravity"
    ]);
    expect(parsed.scope).toBe("local");
    expect(parsed.dryRun).toBe(true);
    expect(parsed.force).toBe(true);
  });
});
