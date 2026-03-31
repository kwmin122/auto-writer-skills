# Runtime Installer Design

## One-Line Definition

한 줄 설치 명령으로 Claude Code, Codex, Cursor, Antigravity 중 원하는 런타임에 이 글쓰기 시스템을 붙여 바로 쓸 수 있게 하는 단일 CLI 설치기.

## Why This Changes the Product

지금 v1은 웹앱으로는 성립하지만, 사용자가 원하는 실제 경험은 "레포에 들어와서 웹에서 쓰는 것"보다 "도구를 내려받고 내가 쓰는 AI 런타임에 바로 붙여 쓰는 것"에 가깝다.

그래서 다음 마일스톤의 중심은 초안 생성 로직이 아니라 배포 방식이다. 제품의 핵심 가치는 유지하되, 전달 형태를 `웹앱 중심`에서 `설치기 중심`으로 옮겨야 한다.

## Reference Model

참고 모델은 GSD다. GSD는 하나의 설치 명령으로 시작하고, 설치 중에 런타임과 설치 위치를 선택하게 만든다. README 기준으로 지원 런타임은 Claude Code, Codex, Cursor, Antigravity 등을 포함하며, Codex는 skills 방식으로 설치된다.

Source:
- https://github.com/gsd-build/get-shit-done

## Approaches Considered

### Option 1: Keep the web app as the main product

- 장점: 지금 코드베이스를 그대로 이어가기 쉽다
- 단점: 사용자가 원하는 "설치해서 내 도구에 붙이는 경험"과 어긋난다
- 판단: 배포 문제를 해결하지 못하므로 부적합

### Option 2: Separate package per runtime

- 장점: 런타임별 구현을 단순하게 쪼갤 수 있다
- 단점: 문서, 배포, 업데이트, 버전 관리가 빠르게 분산된다
- 판단: 내부 구현은 쉬워질 수 있지만 사용자 경험이 나빠진다

### Option 3: Single CLI installer with runtime adapters

- 장점: 설치 진입점이 하나고, 내부는 런타임별 차이만 어댑터로 숨길 수 있다
- 단점: 초기 설계가 조금 더 필요하다
- 판단: 추천안

## Recommended Architecture

### Product Shape

- 배포 단위는 하나의 npm CLI 패키지다
- 사용자는 `npx auto-writer-skills@latest` 같은 한 줄로 설치를 시작한다
- 설치기는 `runtime`, `location`, `mode`를 받아 적절한 산출물을 배치한다
- 웹앱은 사라지는 것이 아니라, 공통 core를 검증하거나 미리보기할 수 있는 보조 실행 환경으로 내려간다

### Internal Layers

#### 1. Installer Shell

역할:
- 설치 세션 시작
- 런타임 선택
- global/local 선택
- dry-run/overwrite/update 처리
- 설치 결과 요약 및 검증 명령 출력

#### 2. Shared Core

역할:
- 글쓰기 규칙
- 출처 보존 규칙
- 금지 표현 규칙
- 개인화 메모리 형식
- 공통 prompt/skill 템플릿
- 공통 manifest

원칙:
- 글쓰기 시스템의 내용은 한 곳에서 관리한다
- 런타임별 차이는 core가 아니라 adapter가 책임진다

#### 3. Runtime Adapters

초기 대상:
- Claude Code
- Codex
- Cursor
- Antigravity

역할:
- 설치 대상 경로 결정
- 필요한 파일 형식 결정
- global/local 배치 규칙 처리
- 설치 후 검증 명령 제공

## Installation UX

### Interactive Install

1. 사용자가 `npx auto-writer-skills@latest` 실행
2. 설치기가 지원 런타임 목록을 보여줌
3. 사용자가 하나 이상 선택
4. 설치 위치를 선택
   - global
   - local
5. 설치기가 preview를 보여줌
6. 사용자가 확인
7. 파일 생성
8. 런타임별 검증 명령 출력

### Non-Interactive Install

예상 플래그:

```bash
npx auto-writer-skills@latest --runtime codex --global
npx auto-writer-skills@latest --runtime claude-code,cursor --local
npx auto-writer-skills@latest --runtime all --global --yes
npx auto-writer-skills@latest --runtime codex --local --dry-run
```

필수 요구:
- CI/스크립트에서 돌아가야 한다
- 기존 파일 overwrite 여부를 제어해야 한다
- dry-run으로 실제 쓰기 없이 preview가 가능해야 한다

## Runtime Contract

각 adapter는 최소한 아래 계약을 구현한다.

- `detect()`: 런타임 사용 가능 여부 판단
- `resolveInstallTarget(scope)`: global/local 설치 경로 계산
- `buildArtifacts(coreManifest)`: 해당 런타임용 파일 집합 생성
- `install(artifacts, target)`: 파일 배치
- `verify(target)`: 설치 후 확인 방법 반환

이 구조를 쓰면 Codex는 skills 기반으로 설치하고, 다른 런타임은 각자 prompt/rules/command 포맷으로 변환할 수 있다.

## Recommended Repo Direction

다음 구조로 가는 것을 권장한다.

```text
src/
  installer/
    cli.ts
    prompts.ts
    manifest.ts
    types.ts
    runtime-registry.ts
  core/
    profile/
    writing/
    attribution/
    templates/
  adapters/
    codex/
    claude-code/
    cursor/
    antigravity/
```

현재 웹앱의 재사용 대상:
- writer profile schema
- edit memory rules
- reconstruction rules
- source attribution constraints

즉, 지금 만든 v1 웹 로직은 버리는 게 아니라 `shared core`로 추출하는 방향이 맞다.

## Scope for the Next Milestone

### Must Have

- 단일 CLI 설치 진입점
- runtime 선택형 설치
- global/local 설치
- Codex adapter
- Claude Code adapter
- 공통 core manifest
- dry-run
- 업데이트 재실행 안전성

### Should Have

- Cursor adapter
- Antigravity adapter
- 설치 후 verify command
- uninstall or clean overwrite path

### Could Have

- interactive TUI polish
- 설치 통계나 telemetry 없음
- release doctor command

## Risks

### Risk 1: Runtime-specific path assumptions break

대응:
- path resolution은 adapter 책임으로 고립
- dry-run과 verify command를 반드시 둔다

### Risk 2: Core content drifts per runtime

대응:
- core manifest를 단일 소스로 유지
- generated artifacts는 adapter output으로만 본다

### Risk 3: Web app and installer diverge

대응:
- 웹앱은 core consumer로 취급
- prompt/rule source는 core에만 둔다

## Success Criteria

다음이 되면 이 마일스톤은 성공이다.

1. 사용자가 한 줄 설치 명령으로 설치를 시작할 수 있다
2. 설치 중 런타임과 범위를 고를 수 있다
3. Codex와 Claude Code에 같은 글쓰기 시스템을 서로 다른 형식으로 설치할 수 있다
4. 설치 후 사용자는 각 런타임에서 바로 호출 가능한 검증 명령을 확인할 수 있다
5. core 변경이 adapter를 통해 여러 런타임에 일관되게 반영된다

## Recommendation

다음 구현은 `웹앱 확장`이 아니라 `shared core 추출 + installer shell + Codex/Claude adapter` 순서로 간다.

Cursor와 Antigravity는 같은 마일스톤 안에 설계하되, 구현 순서는 Codex와 Claude Code 뒤에 둔다.
