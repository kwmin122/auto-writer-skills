# Roadmap: Source-Aware Personal Writing Agent

## Overview

이 로드맵은 "아무렇게나 넣은 메모와 링크를 사용자다운 글로 재구성한다"는 핵심 가치를 가장 빨리 검증하는 순서로 구성한다. 먼저 개인 사용자 기준의 최소 제품 껍데기와 프로필을 잡고, 그 다음 소스 입력과 정리, 질문형 재구성, 플랫폼 맞춤 생성, 수정 학습 순으로 확장한다.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [x] **Phase 1: Product Shell and Writer Profile** - 첫 사용자가 즉시 써볼 수 있는 기본 흐름과 개인 프로필 토대를 만든다
- [x] **Phase 2: Source Intake and Normalization** - 메모와 여러 링크를 글 재료로 정리하는 입력 계층을 만든다
- [x] **Phase 3: Core Message and Clarifying Questions** - 글쓰기 전에 방향을 잡는 재구성 흐름을 만든다
- [x] **Phase 4: Draft Generation with Source Rules** - 플랫폼별 출력과 인간다운 문체 규칙, 출처 표기를 완성한다
- [x] **Phase 5: Personal Memory and Rewrite Loop** - 수정 습관을 학습해 다음 초안에 반영하는 개인화 루프를 만든다

## Phase Details

### Phase 1: Product Shell and Writer Profile
**Goal**: 첫 사용자가 서비스 목적을 이해하고 자신의 기본 글쓰기 취향을 저장한 뒤 첫 세션을 시작할 수 있게 한다
**Depends on**: Nothing (first phase)
**Requirements**: [PERS-01, INPT-02]
**Success Criteria** (what must be TRUE):
  1. User can create or edit a basic writer profile with name, preferred tone, and writing preferences
  2. User can start from a single entry screen that clearly explains what inputs are accepted
  3. Examples make it obvious how to provide notes, URLs, YouTube links, GitHub links, and paper links
**Plans**: 2 plans

Plans:
- [x] 01-01: Define the core session model, onboarding copy, and writer profile fields
- [x] 01-02: Build the first-screen flow with input examples and basic state handling

### Phase 2: Source Intake and Normalization
**Goal**: 다양한 입력을 받아 읽을 수 있는 글 재료로 정리하고, 실패 시 보완 경로를 제공한다
**Depends on**: Phase 1
**Requirements**: [INPT-01, INPT-03, INPT-04]
**Success Criteria** (what must be TRUE):
  1. User can submit mixed notes and links in a single request
  2. System classifies each item by type and shows whether it was successfully parsed
  3. If a source cannot be processed, user sees a clear fallback asking for manual context
**Plans**: 3 plans

Plans:
- [x] 02-01: Implement mixed-input capture and source item classification
- [x] 02-02: Normalize extracted material into a shared internal writing-material structure
- [x] 02-03: Add graceful fallback for unreadable or unsupported sources

### Phase 3: Core Message and Clarifying Questions
**Goal**: 글 생성 전에 핵심 메시지와 보완 질문 흐름을 통해 재구성 방향을 잡는다
**Depends on**: Phase 2
**Requirements**: [RECO-01, RECO-02, RECO-03]
**Success Criteria** (what must be TRUE):
  1. User sees one proposed core message and supporting points before final drafting
  2. System asks only the minimum targeted questions needed to complete the material
  3. User can confirm or adjust the direction before generation
**Plans**: 2 plans

Plans:
- [x] 03-01: Design the material-to-message summarization step for reconstruction planning
- [x] 03-02: Implement the follow-up question policy and confirmation step

### Phase 4: Draft Generation with Source Rules
**Goal**: LinkedIn과 블로그 형식에 맞는 결과를 생성하고, 출처와 문체 규칙을 일관되게 지킨다
**Depends on**: Phase 3
**Requirements**: [OUTP-01, OUTP-02, OUTP-03, OUTP-04, OUTP-05]
**Success Criteria** (what must be TRUE):
  1. User can choose LinkedIn or blog output and get an appropriately structured draft
  2. Generated text follows the selected tone while avoiding markdown emphasis markers, emojis, and obvious AI phrasing
  3. External-source-based content includes clear attribution that the user can review
  4. User can request a simple rewrite without restarting the whole flow
**Plans**: 3 plans

Plans:
- [x] 04-01: Build prompt and template logic for LinkedIn and blog outputs
- [x] 04-02: Enforce style constraints for human-like prose and banned output patterns
- [x] 04-03: Add source attribution formatting and lightweight rewrite controls

### Phase 5: Personal Memory and Rewrite Loop
**Goal**: 사용자의 수정 패턴을 저장하고 다음 결과에 반영하는 가벼운 개인화 루프를 완성한다
**Depends on**: Phase 4
**Requirements**: [PERS-02, PERS-03]
**Success Criteria** (what must be TRUE):
  1. System records recurring edits as reusable writing preferences
  2. Future drafts reflect stored style preferences by default
  3. User can understand or edit what the system remembers about their writing style
**Plans**: 2 plans

Plans:
- [x] 05-01: Define edit-memory rules for capturing useful personalization signals
- [x] 05-02: Apply stored memory to future generations and expose simple memory controls

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Product Shell and Writer Profile | 2/2 | Complete | 2026-03-30 |
| 2. Source Intake and Normalization | 3/3 | Complete | 2026-03-30 |
| 3. Core Message and Clarifying Questions | 2/2 | Complete | 2026-03-30 |
| 4. Draft Generation with Source Rules | 3/3 | Complete | 2026-03-30 |
| 5. Personal Memory and Rewrite Loop | 2/2 | Complete | 2026-03-30 |
