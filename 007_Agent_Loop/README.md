# 007 Agent Loop

LLM이 다음 행동을 반복적으로 선택하는 agent loop 미니 프로젝트입니다.

앞 단계들은 코드가 workflow 순서를 고정했습니다. 이번 예제는 매 step마다 LLM이 `tool` 또는 `final` action을 선택하고, 코드는 그 결정을 검증한 뒤 실행합니다. 무한 반복을 막기 위해 최대 step 수를 제한합니다.

## 실행 방법

Node.js 18 이상이 필요합니다.

```bash
npm install
npm start
```

실행 후 터미널에 요청을 입력하고 `Enter`를 누르면 agent loop가 실행됩니다. 종료는 `Ctrl+C`를 사용합니다.

## 실제 API 호출

기본값은 mock LLM 모드입니다. 실제 Anthropic API를 호출하려면 `config.js`에 API 키를 넣습니다.

```js
export const ANTHROPIC_API_KEY = 'your-api-key';
export const ANTHROPIC_MODEL = 'claude-sonnet-4-20250514';
```

API 키가 비어 있으면 자동으로 mock LLM 모드로 실행됩니다.

## 프로젝트 구조

```text
007_Agent_Loop/
├── README.md
├── agent-loop.js
├── config.js
├── index.js
├── llm-client.js
├── mock-llm.js
├── package.json
├── prompt-loader.js
├── tool-registry.js
└── prompts/
    └── 01_agent_step.txt
```

| 파일 | 설명 |
| --- | --- |
| `index.js` | Ink 기반 CLI UI와 사용자 입력 처리를 담당합니다. |
| `agent-loop.js` | LLM action 선택, tool 실행, observation 누적, 반복 종료를 관리합니다. |
| `tool-registry.js` | agent가 사용할 수 있는 tool 목록과 실행 함수를 정의합니다. |
| `prompts/01_agent_step.txt` | 현재 상태를 보고 다음 action을 JSON으로 선택하게 하는 prompt입니다. |
| `prompt-loader.js` | txt prompt template을 읽고 `{{value}}` placeholder를 치환합니다. |
| `llm-client.js` | API 키가 있으면 Anthropic API를 호출하고, 없으면 mock LLM으로 fallback합니다. |
| `mock-llm.js` | agent step별 action 선택을 흉내 냅니다. |
| `config.js` | 실습용 API 키와 모델명을 설정합니다. |

## 코드 흐름

```text
terminal input
  -> agent loop 시작
  -> 01_agent_step.txt
  -> callLlm()
  -> action JSON 파싱
  -> action.type === "tool" 이면 tool 실행 후 observation 저장
  -> action.type === "final" 이면 종료
```

## 바꿔볼 것

- `MAX_STEPS` 값을 바꿔보기
- `tool-registry.js`에 새 tool 추가하기
- `01_agent_step.txt`의 action 선택 규칙을 수정해보기
