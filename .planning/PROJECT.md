# Source-Aware Personal Writing Agent

## What This Is

이 제품은 1인 개발자이자 지식 노동자인 사용자가 평소 남기는 메모, 초안, URL, 유튜브 링크, GitHub 링크, 논문 링크를 글 재료로 모아 LinkedIn 글이나 블로그 글로 다시 써주는 개인 글쓰기 에이전트다.

배포 형태는 점점 더 중요해졌다. 사용자는 웹사이트에 들어와 쓰는 것보다, Claude Code, Codex, Cursor, Antigravity 같은 자신이 쓰는 AI 런타임에 이 시스템을 바로 설치해서 쓰길 원한다.

핵심은 요약이 아니라 재구성이다. 시스템은 먼저 핵심 메시지를 정리하고, 부족한 정보를 짧게 질문한 뒤, 사용자의 톤과 수정 습관을 반영해 점점 더 사용자다운 문체로 글을 완성한다.

## Core Value

링크 몇 개와 짧은 메모만으로도 출처가 남고 사용자다운 플랫폼 맞춤 글을 빠르게 완성하고, 이를 한 줄 설치로 내 런타임에 붙여 바로 쓸 수 있게 한다.

## Requirements

### Validated

- [x] 사용자는 메모, 초안, 링크를 섞어서 넣고 글 재료로 정리된 결과를 볼 수 있다
- [x] 시스템은 글 작성 전에 핵심 메시지와 글의 방향을 먼저 제안한다
- [x] 시스템은 정보가 비었을 때만 짧고 정확한 보완 질문을 한다
- [x] 사용자는 LinkedIn 글과 블로그 글 중 결과 형식을 선택할 수 있다
- [x] 결과물은 항상 출처를 남기고 사람처럼 자연스럽게 작성된다
- [x] 시스템은 사용자 프로필과 수정 습관을 기억해 다음 결과에 반영한다

### Active

- [ ] 사용자는 단일 CLI 설치기로 이 시스템을 내려받고 설치할 수 있다
- [ ] 사용자는 설치 중 Claude Code, Codex, Cursor, Antigravity 중 원하는 런타임을 고를 수 있다
- [ ] 사용자는 global 또는 local 설치를 선택할 수 있다
- [ ] 공통 글쓰기 시스템은 하나의 core에서 관리되고 런타임별 차이는 adapter가 처리한다
- [ ] 라이브 모델 제공자를 연결해 휴리스틱 초안 대신 실제 생성 모델 기반 작성으로 확장한다
- [ ] 외부 스킬 호출로 링크만 보내도 개인화된 글을 생성하는 진입점을 추가한다

### Out of Scope

- 팀 협업과 승인 워크플로 — 첫 사용자는 개인 사용자이며 초기 제품의 핵심 가치와 거리가 멀다
- 자동 게시와 외부 플랫폼 직접 발행 — 먼저 초안 품질과 개인화가 맞아야 한다
- 범용 장기 메모리 플랫폼 — 초반에는 글쓰기 개인화에 필요한 정보만 얕게 저장한다
- SEO 점수화와 콘텐츠 성과 대시보드 — 글을 잘 쓰는 경험보다 후순위다

## Context

첫 사용자는 본인과 같은 1인 개발자이자 지식 노동자다.

이 사용자는 일상에서 쌓이는 메모, 공부 중 저장한 유튜브 링크, GitHub 저장소, 논문, 초안 글을 나중에 다시 꺼내 글로 정리하고 싶어 한다. 사용 방식은 복잡한 편집보다 "이거 글 써줘"에 가깝고, 입력이 두서없어도 시스템이 글 재료를 정리해줘야 한다.

제품은 처음부터 개인화를 포함한다. 이름, 선호 톤, 싫어하는 표현, 자주 수정하는 문장 습관을 저장하고, 다음 생성부터 기본 반영한다.

신뢰도도 중요하다. 외부 자료를 바탕으로 작성한 내용에는 항상 출처가 남아야 하며, 사용자가 어떤 자료를 바탕으로 쓴 글인지 확인할 수 있어야 한다.

문체 규칙도 분명하다. 생성된 글은 AI가 쓴 티가 나지 않아야 하고, 마크다운 강조 기호나 이모티콘을 남발하지 않아야 하며, 실제 사람이 쓴 것처럼 자연스럽고 담백해야 한다.

이제 제품 성공 조건에는 설치 경험도 포함된다. GSD처럼 한 줄 설치 명령으로 시작하고, 설치 중 런타임과 범위를 고른 뒤 바로 쓸 수 있어야 한다.

## Constraints

- **Product scope**: 빠르게 만들 수 있는 구조로 시작 — 과한 멀티 에이전트 구조나 복잡한 지식 그래프는 초기 범위에서 제외
- **Source trust**: 외부 자료 기반 내용은 항상 출처를 남겨야 함 — 사용자가 근거를 확인할 수 있어야 함
- **Writing style**: 생성 결과에 마크다운 강조 기호, 이모티콘, 과한 AI식 문구를 사용하지 않음 — 사람처럼 자연스럽게 읽혀야 함
- **Personalization**: 개인화는 Writer Profile과 Edit Memory 중심으로 시작 — 별도 모델 학습 없이도 작동해야 함
- **UX friction**: 입력 장벽이 낮아야 함 — 사용자는 정리된 입력보다 지저분한 메모와 링크를 그대로 넣을 가능성이 높음
- **Distribution**: 설치 경험은 단일 CLI 진입점이어야 함 — 클라이언트별 패키지를 따로 찾게 만들지 않음

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| 제품의 중심 가치를 "요약"이 아니라 "재구성"으로 둔다 | 사용자가 원하는 것은 정보 압축이 아니라 자기 생각이 살아 있는 결과물이다 | Completed in v1 workspace flow |
| v1부터 가벼운 개인화를 포함한다 | 이 제품의 차별점은 사용자다움이며, 이를 뒤로 미루면 일반 글쓰기 도구와 차별이 약해진다 | Completed with Writer Profile and edit memory |
| 결과물에는 항상 출처를 남긴다 | 링크와 외부 자료 기반 글쓰기는 신뢰와 추적 가능성이 중요하다 | Completed with required source lines in generated draft |
| 생성 결과는 사람처럼 자연스럽게 쓰고, 이모티콘과 마크다운 강조를 금지한다 | 사용자는 AI 티 나는 결과를 원하지 않는다 | Completed with output guardrails and banned marker stripping |
| 질문 수는 최소화하고 필요한 경우에만 2-4개 수준으로 제한한다 | 질문이 많아지면 글쓰기 도구가 아니라 설문 흐름이 된다 | Completed with targeted follow-up question policy |
| 배포는 단일 CLI 설치기 중심으로 간다 | 사용자는 웹앱보다 자신의 AI 런타임에 바로 붙여 쓰는 경험을 원한다 | Approved for next milestone |

## Evolution

This document evolves at phase transitions and milestone boundaries.

After each phase transition:
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

After each milestone:
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-03-31 after installer-milestone design*
