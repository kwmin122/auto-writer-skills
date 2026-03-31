# Auto Writer Skills

Auto Writer Skills is a GSD-style single CLI installer for a source-aware writing workflow.

The installer sets up runtime-specific rules or skills so you can send rough notes, URLs, YouTube links, GitHub repositories, and paper links to your coding agent and get back human-sounding LinkedIn posts or blog drafts with sources preserved.

## Install

Run the installer with `npx`:

```bash
npx auto-writer-skills@latest
```

You can also skip prompts:

```bash
npx auto-writer-skills@latest --runtime codex,claude-code --local
```

Available flags:

- `--runtime codex,claude-code,cursor,antigravity`
- `--runtime all`
- `--global`
- `--local`
- `--dry-run`
- `--force`
- `--target-root /some/path`

## Runtime targets

- Codex
  - local: `.codex/skills/auto-writer-skills/SKILL.md`
  - global: `~/.codex/skills/auto-writer-skills/SKILL.md`
- Claude Code
  - local: `.claude/skills/auto-writer-skills/SKILL.md`
  - global: `~/.claude/skills/auto-writer-skills/SKILL.md`
- Cursor
  - local: `.cursor/rules/auto-writer-skills.mdc`
  - global: `~/.cursor/rules/auto-writer-skills.mdc`
- Antigravity
  - local: `.agent/rules/auto-writer-skills.md`
  - global: `~/.gemini/AGENTS.md`

## Writing rules

- Keep explicit source lines when outside references matter.
- Do not use markdown emphasis markers in generated prose.
- Do not use emoji in generated prose.
- Ask only the minimum missing follow-up questions.
- Prefer direct, human-sounding writing over generic summary output.
- Existing files are not overwritten unless you pass `--force`.

## Development

```bash
npm install
npm run build:installer
npm test -- tests/installer
node ./bin/auto-writer-skills.js --runtime codex --local --dry-run
```
