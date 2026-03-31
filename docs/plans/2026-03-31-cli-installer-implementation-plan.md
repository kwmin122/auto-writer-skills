# Runtime Installer Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a single npm CLI installer that can install the writing system into selected AI runtimes through a shared core and runtime adapters.

**Architecture:** Extract the reusable writing system into a shared core, then add an installer shell that selects runtime adapters and writes runtime-specific artifacts into global or local targets. Keep the existing Next app as a consumer of the shared core instead of the system of record.

**Tech Stack:** Node.js, TypeScript, npm CLI, fs/promises, zod, Vitest, existing Next.js app for shared-core reuse

---

### Task 1: Create installer domain types and shared manifest

**Files:**
- Create: `src/installer/types.ts`
- Create: `src/installer/manifest.ts`
- Create: `src/core/runtime-manifest.ts`
- Test: `tests/installer/manifest.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { buildRuntimeManifest } from "@/core/runtime-manifest";

describe("buildRuntimeManifest", () => {
  it("returns shared writing rules and supported runtimes", () => {
    const manifest = buildRuntimeManifest();

    expect(manifest.supportedRuntimes).toContain("codex");
    expect(manifest.supportedRuntimes).toContain("claude-code");
    expect(manifest.rules.requireSources).toBe(true);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/installer/manifest.test.ts`
Expected: FAIL because the manifest module does not exist yet

**Step 3: Write minimal implementation**

```ts
export type SupportedRuntime =
  | "claude-code"
  | "codex"
  | "cursor"
  | "antigravity";

export function buildRuntimeManifest() {
  return {
    supportedRuntimes: ["claude-code", "codex", "cursor", "antigravity"],
    rules: {
      requireSources: true,
      banMarkdownEmphasis: true,
      banEmoji: true
    }
  };
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/installer/manifest.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/installer/types.ts src/installer/manifest.ts src/core/runtime-manifest.ts tests/installer/manifest.test.ts
git commit -m "feat: add installer manifest types"
```

### Task 2: Extract reusable writing core out of the app-only path

**Files:**
- Create: `src/core/profile/index.ts`
- Create: `src/core/writing/index.ts`
- Create: `src/core/attribution/index.ts`
- Modify: `src/lib/writer-profile-schema.ts`
- Modify: `src/lib/edit-memory.ts`
- Modify: `src/lib/reconstruction-engine.ts`
- Test: `tests/core/writing-core.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { applyWritingGuardrails } from "@/core/writing";

describe("applyWritingGuardrails", () => {
  it("removes markdown emphasis and emoji while preserving source lines", () => {
    const result = applyWritingGuardrails("Hello **world** 😄\n\nSources\n\n1. Ref");
    expect(result).not.toContain("**");
    expect(result).toContain("Sources");
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/core/writing-core.test.ts`
Expected: FAIL because the core module does not exist yet

**Step 3: Write minimal implementation**

Move the existing reusable logic into `src/core/*` modules and have `src/lib/*` re-export or delegate to them.

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/core/writing-core.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/core src/lib tests/core/writing-core.test.ts
git commit -m "refactor: extract shared writing core"
```

### Task 3: Build installer runtime registry and target resolution

**Files:**
- Create: `src/installer/runtime-registry.ts`
- Create: `src/installer/targets.ts`
- Test: `tests/installer/runtime-registry.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { resolveInstallPlan } from "@/installer/runtime-registry";

describe("resolveInstallPlan", () => {
  it("builds an install plan for multiple runtimes and local scope", () => {
    const plan = resolveInstallPlan({
      runtimes: ["codex", "claude-code"],
      scope: "local"
    });

    expect(plan.entries).toHaveLength(2);
    expect(plan.entries[0]?.runtime).toBeDefined();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/installer/runtime-registry.test.ts`
Expected: FAIL because the registry module does not exist yet

**Step 3: Write minimal implementation**

Define a runtime registry that returns adapter metadata plus resolved targets for `global` and `local` scopes.

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/installer/runtime-registry.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/installer/runtime-registry.ts src/installer/targets.ts tests/installer/runtime-registry.test.ts
git commit -m "feat: add installer runtime registry"
```

### Task 4: Implement the Codex adapter

**Files:**
- Create: `src/adapters/codex/index.ts`
- Create: `src/adapters/codex/render.ts`
- Test: `tests/adapters/codex-adapter.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { renderCodexArtifacts } from "@/adapters/codex/render";

describe("renderCodexArtifacts", () => {
  it("renders skill artifacts for Codex installs", () => {
    const artifacts = renderCodexArtifacts();
    expect(artifacts.some((item) => item.path.includes("SKILL.md"))).toBe(true);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/adapters/codex-adapter.test.ts`
Expected: FAIL because the adapter does not exist yet

**Step 3: Write minimal implementation**

Render Codex-compatible skills and supporting files from the shared core manifest.

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/adapters/codex-adapter.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/adapters/codex tests/adapters/codex-adapter.test.ts
git commit -m "feat: add codex adapter"
```

### Task 5: Implement the Claude Code adapter

**Files:**
- Create: `src/adapters/claude-code/index.ts`
- Create: `src/adapters/claude-code/render.ts`
- Test: `tests/adapters/claude-code-adapter.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { renderClaudeArtifacts } from "@/adapters/claude-code/render";

describe("renderClaudeArtifacts", () => {
  it("renders Claude Code command artifacts", () => {
    const artifacts = renderClaudeArtifacts();
    expect(artifacts.length).toBeGreaterThan(0);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/adapters/claude-code-adapter.test.ts`
Expected: FAIL because the adapter does not exist yet

**Step 3: Write minimal implementation**

Render Claude Code-compatible prompts or command files from the shared core manifest.

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/adapters/claude-code-adapter.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/adapters/claude-code tests/adapters/claude-code-adapter.test.ts
git commit -m "feat: add claude code adapter"
```

### Task 6: Add the installer CLI entrypoint and interactive flow

**Files:**
- Create: `src/installer/cli.ts`
- Create: `src/installer/prompts.ts`
- Create: `bin/auto-writer-skills.js`
- Modify: `package.json`
- Test: `tests/installer/cli.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { parseInstallerArgs } from "@/installer/cli";

describe("parseInstallerArgs", () => {
  it("parses runtime and scope flags", () => {
    const parsed = parseInstallerArgs(["--runtime", "codex", "--global"]);
    expect(parsed.runtimes).toEqual(["codex"]);
    expect(parsed.scope).toBe("global");
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/installer/cli.test.ts`
Expected: FAIL because the installer CLI does not exist yet

**Step 3: Write minimal implementation**

Support:
- interactive runtime selection when flags are absent
- `--runtime`
- `--global`
- `--local`
- `--yes`
- `--dry-run`

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/installer/cli.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/installer bin/auto-writer-skills.js package.json tests/installer/cli.test.ts
git commit -m "feat: add installer cli"
```

### Task 7: Add file writing, dry-run preview, and verification output

**Files:**
- Create: `src/installer/install.ts`
- Create: `src/installer/report.ts`
- Test: `tests/installer/install.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { runInstall } from "@/installer/install";

describe("runInstall", () => {
  it("returns a preview report in dry-run mode without writing files", async () => {
    const result = await runInstall({
      runtimes: ["codex"],
      scope: "local",
      dryRun: true
    });

    expect(result.dryRun).toBe(true);
    expect(result.entries[0]?.written).toBe(false);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/installer/install.test.ts`
Expected: FAIL because the install executor does not exist yet

**Step 3: Write minimal implementation**

Implement:
- dry-run preview
- actual file writing
- overwrite safety
- runtime-specific verify commands in the final report

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/installer/install.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/installer/install.ts src/installer/report.ts tests/installer/install.test.ts
git commit -m "feat: add installer execution flow"
```

### Task 8: Add Cursor and Antigravity adapters

**Files:**
- Create: `src/adapters/cursor/index.ts`
- Create: `src/adapters/antigravity/index.ts`
- Test: `tests/adapters/cursor-adapter.test.ts`
- Test: `tests/adapters/antigravity-adapter.test.ts`

**Step 1: Write the failing tests**

Create one rendering test per adapter that asserts artifacts are produced and verify commands are attached.

**Step 2: Run tests to verify they fail**

Run: `npm test -- tests/adapters/cursor-adapter.test.ts tests/adapters/antigravity-adapter.test.ts`
Expected: FAIL because the adapters do not exist yet

**Step 3: Write minimal implementation**

Implement adapter renderers and runtime verification metadata using the same core manifest.

**Step 4: Run tests to verify they pass**

Run: `npm test -- tests/adapters/cursor-adapter.test.ts tests/adapters/antigravity-adapter.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/adapters/cursor src/adapters/antigravity tests/adapters/cursor-adapter.test.ts tests/adapters/antigravity-adapter.test.ts
git commit -m "feat: add cursor and antigravity adapters"
```

### Task 9: Update docs and release-facing install instructions

**Files:**
- Modify: `README.md`
- Modify: `.planning/PROJECT.md`
- Modify: `.planning/REQUIREMENTS.md`
- Modify: `.planning/ROADMAP.md`
- Test: manual verification notes in `docs/plans/2026-03-31-cli-installer-design.md`

**Step 1: Write the missing docs assertions**

List the exact install commands, supported runtimes, and runtime verification commands.

**Step 2: Run docs review**

Run: `rg -n "auto-writer-skills|codex|claude|cursor|antigravity" README.md .planning docs/plans`
Expected: all runtime names and install command are documented

**Step 3: Write minimal implementation**

Update README and planning docs to reflect installer-first distribution.

**Step 4: Run review again**

Run: `rg -n "auto-writer-skills|codex|claude|cursor|antigravity" README.md .planning docs/plans`
Expected: PASS with all required strings present

**Step 5: Commit**

```bash
git add README.md .planning docs/plans
git commit -m "docs: add installer distribution guidance"
```

### Task 10: Full verification

**Files:**
- Verify: `src/installer/**`
- Verify: `src/adapters/**`
- Verify: `src/core/**`
- Verify: `tests/**`

**Step 1: Run tests**

Run: `npm test`
Expected: PASS

**Step 2: Run typecheck**

Run: `npm run typecheck`
Expected: PASS

**Step 3: Run lint**

Run: `npm run lint`
Expected: PASS

**Step 4: Run build**

Run: `npm run build`
Expected: PASS

**Step 5: Commit**

```bash
git add .
git commit -m "chore: verify cli installer milestone"
```

Plan complete and saved to `docs/plans/2026-03-31-cli-installer-implementation-plan.md`. Two execution options:

1. Subagent-Driven (this session) - I dispatch fresh subagent per task, review between tasks, fast iteration
2. Parallel Session (separate) - Open new session with executing-plans, batch execution with checkpoints

Which approach?
