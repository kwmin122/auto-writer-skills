import { spawnSync } from "node:child_process";

const rawArgs = process.argv.slice(2);
const filteredArgs = rawArgs.filter((arg) => arg !== "--runInBand");

const result = spawnSync(
  process.platform === "win32" ? "npx.cmd" : "npx",
  ["vitest", "run", ...filteredArgs],
  {
    stdio: "inherit",
    env: process.env
  }
);

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 1);
