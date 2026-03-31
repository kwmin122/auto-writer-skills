import fs from "node:fs/promises";
import path from "node:path";

import { resolveInstallPlan } from "./runtime-registry";
import type { RunInstallInput, RunInstallResult } from "./types";

export async function runInstall(input: RunInstallInput): Promise<RunInstallResult> {
  const plan = resolveInstallPlan(input);
  const dryRun = input.dryRun ?? false;
  const overwrite = input.overwrite ?? false;
  const entries = [];

  for (const entry of plan.entries) {
    const writtenFiles = entry.artifacts.map((artifact) =>
      path.join(entry.targetDir, artifact.relativePath)
    );

    if (!dryRun) {
      await fs.mkdir(entry.targetDir, { recursive: true });

      for (let index = 0; index < entry.artifacts.length; index += 1) {
        const artifact = entry.artifacts[index];

        if (!artifact) {
          continue;
        }

        const targetPath = writtenFiles[index];

        if (!targetPath) {
          continue;
        }

        if (!overwrite) {
          await assertWritableTarget(targetPath);
        }

        await fs.mkdir(path.dirname(targetPath), { recursive: true });
        await fs.writeFile(targetPath, artifact.content, "utf8");
      }
    }

    entries.push({
      ...entry,
      written: !dryRun,
      writtenFiles
    });
  }

  return {
    dryRun,
    entries
  };
}

async function assertWritableTarget(targetPath: string) {
  try {
    await fs.access(targetPath);
    throw new Error(`Refusing to overwrite existing file: ${targetPath}`);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return;
    }

    throw error;
  }
}
