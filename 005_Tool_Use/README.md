# 005 Tool Use

LLM이 사용할 tool을 선택하고, 코드는 선택된 tool을 실행하는 미니 프로젝트입니다.

이 예제는 아직 tool 실행 결과를 다시 LLM에게 넘겨 최종 답변을 생성하지 않습니다. 이번 단계의 핵심은 `사용자 입력 -> tool 선택 -> tool 실행 -> 결과 출력` 흐름을 이해하는 것입니다.

## 실행 방법

Node.js 18 이상이 필요합니다.

```bash
npm install
npm start
```

실행 후 터미널에 요청을 입력하고 `Enter`를 누르면 tool use workflow가 실행됩니다. 종료는 `Ctrl+C`를 사용합니다.

## 실제 API 호출

기본값은 mock LLM 모드입니다. 실제 Anthropic API를 호출하려면 `config.js`에 API 키를 넣습니다.

```js
export const ANTHROPIC_API_KEY = 'your-api-key';
export const ANTHROPIC_MODEL = 'claude-sonnet-4-20250514';
```

API 키가 비어 있으면 자동으로 mock LLM 모드로 실행됩니다.

## 프로젝트 구조

```text
005_Tool_Use/
├── README.md
├── config.js
├── index.js
├── llm-client.js
├── mock-llm.js
├── package.json
├── prompt-loader.js
├── tool-registry.js
├── tool-workflow.js
└── prompts/
    └── 01_select_tool.txt
```

| 파일 | 설명 |
| --- | --- |
| `index.js` | Ink 기반 CLI UI와 사용자 입력 처리를 담당합니다. |
| `tool-workflow.js` | LLM에게 tool 선택을 요청하고, 선택된 tool을 실행합니다. |
| `tool-registry.js` | 사용할 수 있는 tool 목록과 실제 실행 함수를 정의합니다. |
| `prompts/01_select_tool.txt` | 사용자 요청에 맞는 tool을 JSON 형식으로 선택하게 하는 prompt입니다. |
| `prompt-loader.js` | txt prompt template을 읽고 `{{value}}` placeholder를 치환합니다. |
| `llm-client.js` | API 키가 있으면 Anthropic API를 호출하고, 없으면 mock LLM으로 fallback합니다. |
| `mock-llm.js` | tool 선택 응답을 흉내 냅니다. |
| `config.js` | 실습용 API 키와 모델명을 설정합니다. |

## 코드 흐름

```text
terminal input
  -> 01_select_tool.txt
  -> callLlm()
  -> JSON tool call 파싱
  -> tool-registry.js에서 tool 실행
  -> tool result 출력
```

## 바꿔볼 것

- `tool-registry.js`에 새 tool 추가하기
- `mock-llm.js`의 tool 선택 규칙 바꾸기
- `01_select_tool.txt`의 JSON 출력 지시를 바꿔보기
