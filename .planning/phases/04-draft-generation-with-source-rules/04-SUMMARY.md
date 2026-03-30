# Phase 4 Summary

## Goal

LinkedIn과 블로그 출력 형식에 맞는 초안을 만들고, 출처와 문체 규칙을 일관되게 지킨다.

## Delivered

- `buildDraft`에 LinkedIn/Blog 구조 템플릿, 톤별 오프너, rewrite instruction 해석을 추가했다.
- 마크다운 강조 기호와 이모티콘 제거, 출처 라인 강제 포함, 사람이 읽는 문장 중심의 guardrail을 넣었다.
- 워크스페이스에서 `shorter`, `sharper`, `more like me` 같은 짧은 rewrite request를 받아 같은 흐름 안에서 다시 초안을 만들 수 있게 했다.

## Verification

- `npm test`
- `npm run typecheck`
- `npm run lint`
- `npm run build`

## Result

초안은 형식과 톤을 반영해 생성되고, 외부 자료 기반 내용은 항상 출처와 함께 남는다.
