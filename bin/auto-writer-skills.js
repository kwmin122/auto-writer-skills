#!/usr/bin/env node

const path = require("node:path");
const fs = require("node:fs");
const { spawnSync } = require("node:child_process");

const compiledCliPath = path.join(__dirname, "..", "dist-installer", "installer", "cli.js");

if (fs.existsSync(compiledCliPath)) {
  Promise.resolve()
    .then(() => require(compiledCliPath))
    .then(({ runInstallerCli }) => runInstallerCli(process.argv.slice(2)))
    .catch((error) => {
      const message = error instanceof Error ? error.message : "Installer failed";
      process.stderr.write(`${message}\n`);
      process.exit(1);
    });
} else {
  const sourceCliPath = path.join(__dirname, "..", "src", "installer", "cli.ts");
  const result = spawnSync(
    process.execPath,
    ["--experimental-strip-types", sourceCliPath, ...process.argv.slice(2)],
    {
      stdio: "inherit"
    }
  );

  if (result.error) {
    throw result.error;
  }

  process.exit(result.status ?? 1);
}
