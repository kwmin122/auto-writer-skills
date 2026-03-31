# Requirements: Source-Aware Personal Writing Agent

**Defined:** 2026-03-30
**Core Value:** 링크 몇 개와 짧은 메모만으로도 출처가 남고 사용자다운 플랫폼 맞춤 글을 빠르게 완성한다.

## v1 Requirements

### Intake

- [x] **INPT-01**: User can start a writing session by mixing freeform text, notes, drafts, and links in one request
- [x] **INPT-02**: User sees example inputs for text, URL, YouTube, GitHub, and paper links before submitting
- [x] **INPT-03**: System identifies each input item type and indicates whether it was parsed successfully
- [x] **INPT-04**: If a source cannot be read, system asks the user for missing context instead of failing silently

### Reconstruction

- [x] **RECO-01**: System proposes one core message and 3-5 supporting points before writing the final draft
- [x] **RECO-02**: System asks at most four targeted follow-up questions only when the provided material is insufficient
- [x] **RECO-03**: User can confirm or adjust the proposed direction before final generation

### Output

- [x] **OUTP-01**: User can choose LinkedIn post or blog post as the target format
- [x] **OUTP-02**: User can choose a tone from a predefined list including professional, insight-driven, story-driven, casual, and persuasive
- [x] **OUTP-03**: Generated draft reads like natural human writing and does not use markdown emphasis markers, emojis, or obvious AI filler language
- [x] **OUTP-04**: Generated draft preserves source attribution for external facts, references, and quoted ideas
- [x] **OUTP-05**: User can request a rewrite with short instructions such as "shorter", "sharper", or "more like me"

### Personalization

- [x] **PERS-01**: User can save a basic writer profile including name, preferred tone, and writing preferences
- [x] **PERS-02**: System stores recurring edit preferences from the user's revisions
- [x] **PERS-03**: Future drafts reflect the saved profile and edit memory by default

## v2 Requirements

### Integrations

- **INTG-01**: User can import saved materials from personal knowledge sources such as notes apps or read-later tools
- **INTG-02**: User can generate multiple output formats from the same source set in one action
- **INTG-03**: User can call the writing flow from an external skill or command with links only

### Distribution

- **DIST-01**: User can install the system with a single CLI entrypoint such as `npx auto-writer-skills@latest`
- **DIST-02**: Installer lets the user choose one or more target runtimes during setup
- **DIST-03**: Installer supports both global and local installation scopes
- **DIST-04**: Installer provides dry-run output and a post-install verification command for each selected runtime

### Runtime Support

- **RT-01**: Codex runtime can receive the system through a runtime adapter that emits Codex-compatible skill artifacts
- **RT-02**: Claude Code runtime can receive the system through a runtime adapter that emits Claude-compatible artifacts
- **RT-03**: Cursor runtime can receive the system through a runtime adapter
- **RT-04**: Antigravity runtime can receive the system through a runtime adapter
- **RT-05**: Shared writing rules are defined once in a common core and reused across all runtime adapters

### Personal Agent

- **AGNT-01**: System maintains a richer long-term voice profile across sessions
- **AGNT-02**: System summarizes what it learned from accepted edits and lets the user approve memory updates
- **AGNT-03**: System can suggest content opportunities from recently saved materials

## Out of Scope

| Feature | Reason |
|---------|--------|
| Team collaboration and approvals | Initial product is for a single user and should stay lightweight |
| Direct publishing to LinkedIn or blog CMS | Draft quality and trust come first |
| SEO scoring dashboard | Not core to the first user's problem |
| Fine-tuned custom model training | Too heavy for the first usable version |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| PERS-01 | Phase 1 | Complete |
| INPT-02 | Phase 1 | Complete |
| INPT-01 | Phase 2 | Complete |
| INPT-03 | Phase 2 | Complete |
| INPT-04 | Phase 2 | Complete |
| RECO-01 | Phase 3 | Complete |
| RECO-02 | Phase 3 | Complete |
| RECO-03 | Phase 3 | Complete |
| OUTP-01 | Phase 4 | Complete |
| OUTP-02 | Phase 4 | Complete |
| OUTP-03 | Phase 4 | Complete |
| OUTP-04 | Phase 4 | Complete |
| OUTP-05 | Phase 4 | Complete |
| PERS-02 | Phase 5 | Complete |
| PERS-03 | Phase 5 | Complete |
| DIST-01 | Phase 7 | Planned |
| DIST-02 | Phase 7 | Planned |
| DIST-03 | Phase 7 | Planned |
| DIST-04 | Phase 10 | Planned |
| RT-05 | Phase 6 | Planned |
| RT-01 | Phase 8 | Planned |
| RT-02 | Phase 8 | Planned |
| RT-03 | Phase 9 | Planned |
| RT-04 | Phase 9 | Planned |
| INTG-03 | Phase 10 | Planned |

**Coverage:**
- v1 requirements: 15 total
- Mapped to phases: 15
- Unmapped: 0

---
*Requirements defined: 2026-03-30*
*Last updated: 2026-03-31 after installer-milestone design*
