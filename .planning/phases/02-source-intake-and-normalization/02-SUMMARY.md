# Phase 2 Summary

## Goal

메모와 여러 링크를 공통 글 재료 구조로 정리하고, 읽지 못한 소스가 있으면 조용히 실패하지 않고 보완 질문 경로를 제공한다.

## Delivered

- `src/lib/source-normalization.ts`로 텍스트, URL, YouTube, GitHub, 논문 링크를 분류하고 공통 `NormalizedSourceItem` 구조로 정규화했다.
- 일반 URL은 HTML title과 본문 스냅샷을 읽고, 실패하면 `needs_context` 상태와 보완 안내 문구를 반환하도록 했다.
- 홈 화면 워크스페이스에서 소스 목록과 파싱 상태를 시각적으로 보여주도록 연결했다.

## Verification

- `npm test`
- `npm run typecheck`
- `npm run lint`
- `npm run build`

## Result

사용자는 두서없는 메모와 링크를 한 번에 넣을 수 있고, 시스템은 각 입력이 어떻게 읽혔는지 즉시 보여준다.
