# Phase 1: Product Shell and Writer Profile - Context

**Gathered:** 2026-03-30
**Status:** Ready for planning
**Source:** Project initialization, approved design, and user clarifications

<domain>
## Phase Boundary

Phase 1 creates the first usable shell of the product. The result should let the user understand what the app is for, see what kinds of source inputs are supported, and save a basic writer profile that future phases can reuse.

This phase does not parse links, ask AI follow-up questions, or generate finished writing. Those behaviors begin in later phases.

</domain>

<decisions>
## Implementation Decisions

### Product boundary
- Treat this as a single-user web app for the first milestone.
- Phase 1 ends when the app has a visible first screen and a persisted writer profile, not when mixed-input generation works.

### Stack
- Use a Next.js App Router web app with TypeScript.
- Keep persistence lightweight in Phase 1 by storing the writer profile locally through an app-owned store, not a hosted backend.
- Add testable seams early so later phases can extend the same code paths instead of rewriting them.

### UX priorities
- The home screen should immediately communicate "paste anything" without overwhelming the user.
- Input examples must be visible before the user types anything.
- The writer profile should store only the fields needed by later phases: name, default tone, preferred output, banned style markers, and notes about preferred writing habits.

### Writing rules
- Product-generated writing later must always keep source attribution for external material.
- Product-generated writing must avoid markdown emphasis markers, emojis, and obvious AI filler phrasing.
- Phase 1 UI copy can explain those rules so they become visible constraints, not hidden implementation details.

### the agent's Discretion
- Exact visual language, spacing, and component composition may vary as long as the first screen stays simple and source-oriented.
- Test tooling can be lightweight, but at minimum there should be one automated test around writer profile persistence and one around the home-screen example rendering.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Product definition
- `.planning/PROJECT.md` — product scope, constraints, and key decisions
- `.planning/REQUIREMENTS.md` — requirement IDs and v1 boundaries
- `.planning/ROADMAP.md` — phase goal and success criteria
- `.planning/STATE.md` — current project status

### Design intent
- `docs/plans/2026-03-30-source-aware-writing-agent-design.md` — approved product framing and MVP boundaries

</canonical_refs>

<specifics>
## Specific Ideas

- Writer profile fields should include:
  - display name
  - default output target
  - default tone
  - banned output markers
  - personal writing notes
- Supported input examples should explicitly mention:
  - short note
  - URL
  - YouTube link
  - GitHub repo
  - paper link
- The home screen should preview the future session flow without implementing AI generation yet.

</specifics>

<deferred>
## Deferred Ideas

- Mixed-source parsing and normalization
- Clarifying question generation
- Final LinkedIn and blog draft generation
- Source attribution formatting in final outputs
- Edit-memory learning beyond a basic profile

</deferred>

---

*Phase: 01-product-shell-and-writer-profile*
*Context gathered: 2026-03-30 via manual planning context*
