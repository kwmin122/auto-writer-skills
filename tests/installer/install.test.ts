import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";

import { runInstall } from "@/installer/install";

describe("runInstall", () => {
  let tempDir: string | null = null;

  afterEach(async () => {
    if (tempDir) {
      await fs.rm(tempDir, { force: true, recursive: true });
      tempDir = null;
    }
  });

  it("returns a preview report in dry-run mode without writing files", async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "writer-skills-installer-"));

    const result = await runInstall({
      runtimes: ["codex"],
      scope: "local",
      cwd: tempDir,
      homeDir: tempDir,
      dryRun: true
    });

    expect(result.dryRun).toBe(true);
    expect(result.entries[0]?.written).toBe(false);

    const targetDir = path.join(tempDir, ".codex", "skills", "auto-writer-skills");
    await expect(fs.access(targetDir)).rejects.toThrow();
  });

  it("refuses to overwrite existing files unless force is enabled", async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "writer-skills-installer-"));

    await runInstall({
      runtimes: ["codex"],
      scope: "local",
      cwd: tempDir,
      homeDir: tempDir,
      overwrite: false
    });

    await expect(
      runInstall({
        runtimes: ["codex"],
        scope: "local",
        cwd: tempDir,
        homeDir: tempDir,
        overwrite: false
      })
    ).rejects.toThrow(/Refusing to overwrite existing file/);
  });
});
