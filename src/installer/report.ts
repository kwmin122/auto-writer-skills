import type { RunInstallResult } from "./types";

export function formatInstallReport(result: RunInstallResult) {
  const lines = [
    result.dryRun ? "Dry run complete." : "Install complete."
  ];

  for (const entry of result.entries) {
    lines.push("");
    lines.push(`${entry.displayName} -> ${entry.targetDir}`);
    lines.push(`Verify: ${entry.verifyCommand}`);
    lines.push(...entry.writtenFiles.map((item) => `- ${item}`));
  }

  return lines.join("\n");
}
