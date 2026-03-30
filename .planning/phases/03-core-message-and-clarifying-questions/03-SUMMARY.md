# Phase 3 Summary

## Goal

글 생성 전에 핵심 메시지와 보완 질문으로 재구성 방향을 먼저 고정한다.

## Delivered

- `src/lib/reconstruction-engine.ts`에서 핵심 메시지, 3-5개 supporting points, 최대 4개의 follow-up questions를 생성하도록 했다.
- `src/app/api/reconstruct/analyze/route.ts`와 `src/lib/reconstruct-contracts.ts`로 분석 요청과 응답 계약을 고정했다.
- 워크스페이스에서 분석 결과와 질문 입력 UI를 연결해, 초안 생성 전 사용자가 방향을 확인하고 보완하게 했다.

## Verification

- `npm test`
- `npm run typecheck`
- `npm run lint`
- `npm run build`

## Result

사용자는 초안이 나오기 전에 시스템이 무엇을 글의 핵심으로 이해했는지 확인할 수 있고, 필요한 질문에만 답하면 된다.
