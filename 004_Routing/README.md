# 004 Routing

사용자 입력을 분류한 뒤, 분류 결과에 따라 다른 prompt로 보내는 routing workflow 미니 프로젝트입니다.

이 예제는 agent가 자유롭게 행동을 고르는 구조가 아닙니다. 먼저 LLM이 요청 유형을 `code`, `docs`, `general` 중 하나로 분류하고, 코드는 그 route에 맞는 prompt template을 선택해 두 번째 LLM 호출을 실행합니다.

## 실행 방법

Node.js 18 이상이 필요합니다.

```bash
npm install
npm start
```

실행 후 터미널에 요청을 입력하고 `Enter`를 누르면 routing workflow가 실행됩니다. 종료는 `Ctrl+C`를 사용합니다.

## 실제 API 호출

기본값은 mock LLM 모드입니다. 실제 Anthropic API를 호출하려면 `config.js`에 API 키를 넣습니다.

```js
export const ANTHROPIC_API_KEY = 'your-api-key';
export const ANTHROPIC_MODEL = 'claude-sonnet-4-20250514';
```

API 키가 비어 있으면 자동으로 mock LLM 모드로 실행됩니다.

## 프로젝트 구조

```text
004_Routing/
├── README.md
├── config.js
├── index.js
├── llm-client.js
├── mock-llm.js
├── package.json
├── prompt-loader.js
├── router.js
└── prompts/
    ├── 01_route.txt
    └── routes/
        ├── code.txt
        ├── docs.txt
        └── general.txt
```

| 파일 | 설명 |
| --- | --- |
| `index.js` | Ink 기반 CLI UI와 사용자 입력 처리를 담당합니다. |
| `router.js` | route 분류 prompt를 실행하고, 분류 결과에 맞는 prompt를 선택합니다. |
| `prompt-loader.js` | txt prompt template을 읽고 `{{value}}` placeholder를 치환합니다. |
| `prompts/01_route.txt` | 사용자 요청을 route로 분류하는 prompt입니다. |
| `prompts/routes/*.txt` | route별 응답 생성 prompt입니다. |
| `llm-client.js` | API 키가 있으면 Anthropic API를 호출하고, 없으면 mock LLM으로 fallback합니다. |
| `mock-llm.js` | route 분류와 route별 응답을 흉내 냅니다. |
| `config.js` | 실습용 API 키와 모델명을 설정합니다. |

## 코드 흐름

```text
terminal input
  -> 01_route.txt
  -> callLlm()
  -> normalize route
  -> routes/{route}.txt
  -> callLlm()
  -> final answer
```

## 바꿔볼 것

- route 후보를 추가하기
- `normalizeRoute()`의 fallback 규칙 바꿔보기
- route별 prompt 문구를 수정해 응답 스타일 비교하기
