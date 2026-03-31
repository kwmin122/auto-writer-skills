import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

import { runInstall } from "./install";
import { formatInstallReport } from "./report";
import {
  supportedRuntimes,
  type InstallScope,
  type ParsedInstallerArgs,
  type SupportedRuntime
} from "./types";

export function parseInstallerArgs(argv: string[]): ParsedInstallerArgs {
  const parsed: ParsedInstallerArgs = {
    runtimes: [],
    scope: null,
    dryRun: false,
    force: false,
    yes: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (!arg) {
      continue;
    }

    switch (arg) {
      case "--runtime":
        parsed.runtimes = parseRuntimeList(argv[index + 1] ?? "");
        index += 1;
        break;
      case "--global":
        parsed.scope = "global";
        break;
      case "--local":
        parsed.scope = "local";
        break;
      case "--dry-run":
        parsed.dryRun = true;
        break;
      case "--force":
        parsed.force = true;
        break;
      case "--yes":
        parsed.yes = true;
        break;
      case "--target-root":
        parsed.targetRoot = argv[index + 1] ?? "";
        index += 1;
        break;
      default:
        throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return parsed;
}

export async function runInstallerCli(argv: string[] = process.argv.slice(2)) {
  const parsed = parseInstallerArgs(argv);
  const resolved = await promptForMissingOptions(parsed);

  if (!resolved.scope || resolved.runtimes.length === 0) {
    throw new Error("Runtime and install scope are required.");
  }

  const result = await runInstall({
    runtimes: resolved.runtimes,
    scope: resolved.scope,
    dryRun: resolved.dryRun,
    overwrite: resolved.force,
    targetRoot: resolved.targetRoot
  });

  output.write(`${formatInstallReport(result)}\n`);
}

function parseRuntimeList(value: string): SupportedRuntime[] {
  const normalized = value.trim().toLowerCase();

  if (normalized === "all") {
    return [...supportedRuntimes];
  }

  const items = normalized
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  for (const item of items) {
    if (!supportedRuntimes.includes(item as SupportedRuntime)) {
      throw new Error(`Unsupported runtime: ${item}`);
    }
  }

  return items as SupportedRuntime[];
}

async function promptForMissingOptions(parsed: ParsedInstallerArgs) {
  if (parsed.runtimes.length > 0 && parsed.scope) {
    return parsed;
  }

  const rl = createInterface({ input, output });

  try {
    if (parsed.runtimes.length === 0) {
      const runtimeAnswer = await rl.question(
        `Select runtimes (${supportedRuntimes.join(", ")} or all): `
      );
      parsed.runtimes = parseRuntimeList(runtimeAnswer);
    }

    if (!parsed.scope) {
      const scopeAnswer = await rl.question("Install scope (global/local): ");
      const normalizedScope = normalizeInstallScope(scopeAnswer);
      if (!normalizedScope) {
        throw new Error("Install scope must be global or local.");
      }
      parsed.scope = normalizedScope;
    }

    return parsed;
  } finally {
    rl.close();
  }
}

function normalizeInstallScope(value: string): InstallScope | null {
  const normalized = value.trim().toLowerCase();

  if (normalized === "global" || normalized === "local") {
    return normalized;
  }

  return null;
}
