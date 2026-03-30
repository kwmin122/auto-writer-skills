# Source-Aware Personal Writing Agent Design

## One-Line Definition

메모, 초안, URL, 유튜브, GitHub, 논문을 넣으면 AI가 핵심 메시지를 정리하고 필요한 질문으로 빈칸을 메운 뒤, 사용자의 스타일과 출처 규칙을 반영해 LinkedIn 글이나 블로그 글로 재구성해주는 개인 글쓰기 도구.

## Target User

첫 사용자는 본인 같은 1인 개발자이자 지식 노동자다.

이 사용자는 글을 처음부터 쓰는 데 시간을 많이 쓰기보다, 평소 쌓인 메모와 공부 자료를 바탕으로 자기다운 글을 빠르게 만들고 싶어 한다.

## Core Product Principles

1. 입력은 지저분해도 된다.
2. 제품은 요약기가 아니라 재구성 도구여야 한다.
3. 질문은 짧고 필요할 때만 해야 한다.
4. 외부 자료 기반 글은 항상 출처가 남아야 한다.
5. 결과물은 AI 티가 아니라 사람의 글처럼 읽혀야 한다.
6. 개인화는 나중이 아니라 처음부터 들어가야 한다.

## Recommended UX Flow

1. 사용자가 메모, 초안, 링크를 한 화면에 넣는다.
2. 시스템이 입력을 유형별로 정리하고 읽은 결과를 보여준다.
3. 시스템이 핵심 메시지와 주요 포인트를 먼저 제안한다.
4. 부족한 정보가 있으면 2-4개의 보완 질문을 한다.
5. 사용자가 플랫폼과 톤을 선택한다.
6. 시스템이 출처가 남는 초안을 생성한다.
7. 사용자의 수정 내용을 기억해 다음 결과에 반영한다.

## MVP Scope

- 멀티 입력 지원: 텍스트, URL, YouTube, GitHub, 논문 링크
- 출력 형식: LinkedIn 글, 블로그 글
- 톤 선택: 전문적, 인사이트형, 스토리형, 캐주얼, 설득형
- 핵심 메시지 제안
- 최소 질문 기반 보완
- 출처 표기
- Writer Profile
- Edit Memory

## Deferred Scope

- 팀 협업
- 자동 게시
- 복잡한 장기 메모리 시스템
- SEO 분석
- 외부 지식 저장소 대규모 연동

## Non-Negotiable Writing Rules

- 생성된 글에는 마크다운 강조 기호를 사용하지 않는다.
- 생성된 글에는 이모티콘을 사용하지 않는다.
- 과장된 AI식 표현보다 자연스럽고 담백한 문장을 우선한다.
- 외부 자료에서 가져온 사실, 주장, 인용에는 출처를 남긴다.

## Next Step

Phase 1 planning should define the first usable writing session, the writer profile structure, and the input example UX before any deeper source-processing work begins.
