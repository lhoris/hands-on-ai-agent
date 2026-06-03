# 009 Memory

agent가 이전 요청과 답변을 memory에 저장하고, 다음 요청에서 그 memory를 context로 다시 사용하는 미니 프로젝트입니다.

이번 예제의 핵심은 장기 기억을 복잡하게 구현하는 것이 아닙니다. 파일 기반의 작은 memory store를 사용해서 `저장 -> 조회 -> context 주입 -> 응답 생성` 흐름을 이해하는 것이 목표입니다.

## 실행 방법

Node.js 18 이상이 필요합니다.

```bash
npm install
npm start
```

실행 후 터미널에 요청을 입력하고 `Enter`를 누르면 memory workflow가 실행됩니다. 종료는 `Ctrl+C`를 사용합니다.

## 실제 API 호출

기본값은 mock LLM 모드입니다. 실제 Anthropic API를 호출하려면 `config.js`에 API 키를 넣습니다.

```js
export const ANTHROPIC_API_KEY = 'your-api-key';
export const ANTHROPIC_MODEL = 'claude-sonnet-4-20250514';
```

API 키가 비어 있으면 자동으로 mock LLM 모드로 실행됩니다.

## 프로젝트 구조

```text
009_Memory/
├── README.md
├── config.js
├── index.js
├── llm-client.js
├── memory-store.js
├── memory-workflow.js
├── mock-llm.js
├── package.json
├── prompt-loader.js
└── prompts/
    └── 01_answer_with_memory.txt
```

| 파일 | 설명 |
| --- | --- |
| `index.js` | Ink 기반 CLI UI와 사용자 입력 처리를 담당합니다. |
| `memory-workflow.js` | memory 조회, prompt 구성, LLM 호출, memory 저장 흐름을 연결합니다. |
| `memory-store.js` | `.memory.json` 파일에 memory를 읽고 씁니다. |
| `prompts/01_answer_with_memory.txt` | memory context를 포함해 답변을 생성하는 prompt입니다. |
| `prompt-loader.js` | txt prompt template을 읽고 `{{value}}` placeholder를 치환합니다. |
| `llm-client.js` | API 키가 있으면 Anthropic API를 호출하고, 없으면 mock LLM으로 fallback합니다. |
| `mock-llm.js` | memory context를 읽는 LLM 응답을 흉내 냅니다. |
| `config.js` | 실습용 API 키와 모델명을 설정합니다. |

## 코드 흐름

```text
terminal input
  -> memory-store.js에서 기존 memory 조회
  -> 01_answer_with_memory.txt
  -> callLlm()
  -> answer 출력
  -> 새 interaction을 .memory.json에 저장
```

## 바꿔볼 것

- `.memory.json`을 삭제하고 처음부터 다시 실행해보기
- `memory-store.js`에서 저장 개수 제한 바꿔보기
- `mock-llm.js`의 이름 기억 규칙을 바꿔보기
