# 010 File Agent

작은 workspace 안의 파일을 읽고 검색하는 read-only file agent 미니 프로젝트입니다.

이번 예제는 지금까지 배운 agent loop, tool use, tool result context를 합친 최종 실습입니다. agent가 사용자 요청을 보고 `list_files`, `read_file`, `search_files` 중 필요한 tool을 선택하고, tool observation을 바탕으로 최종 답변을 생성합니다.

안전을 위해 이 예제는 `sample-workspace/` 안의 파일만 읽습니다. 파일 쓰기나 삭제 tool은 포함하지 않습니다.

## 실행 방법

Node.js 18 이상이 필요합니다.

```bash
npm install
npm start
```

실행 후 터미널에 요청을 입력하고 `Enter`를 누르면 file agent loop가 실행됩니다. 종료는 `Ctrl+C`를 사용합니다.

예시 요청:

```text
파일 목록 보여줘
README 내용을 요약해줘
TODO가 있는 파일 찾아줘
config 파일 읽어줘
```

## 실제 API 호출

기본값은 mock LLM 모드입니다. 실제 Anthropic API를 호출하려면 `config.js`에 API 키를 넣습니다.

```js
export const ANTHROPIC_API_KEY = 'your-api-key';
export const ANTHROPIC_MODEL = 'claude-sonnet-4-20250514';
```

API 키가 비어 있으면 자동으로 mock LLM 모드로 실행됩니다.

## 프로젝트 구조

```text
010_File_Agent/
├── README.md
├── config.js
├── file-agent.js
├── file-tools.js
├── index.js
├── llm-client.js
├── mock-llm.js
├── package.json
├── prompt-loader.js
├── prompts/
│   └── 01_file_agent_step.txt
└── sample-workspace/
    ├── README.md
    ├── app.js
    └── config.json
```

| 파일 | 설명 |
| --- | --- |
| `index.js` | Ink 기반 CLI UI와 사용자 입력 처리를 담당합니다. |
| `file-agent.js` | file agent loop, action 파싱, tool 실행, 종료 조건을 관리합니다. |
| `file-tools.js` | `sample-workspace` 안에서만 파일 목록/읽기/검색을 수행합니다. |
| `prompts/01_file_agent_step.txt` | 다음 file action을 JSON으로 선택하게 하는 prompt입니다. |
| `mock-llm.js` | file agent action 선택을 흉내 냅니다. |
| `sample-workspace/` | file agent가 읽고 검색할 수 있는 예제 파일들입니다. |

## 코드 흐름

```text
terminal input
  -> file agent loop 시작
  -> LLM이 file action 선택
  -> file-tools.js에서 read-only tool 실행
  -> observation을 scratchpad에 저장
  -> LLM이 final을 반환하면 종료
```

## 바꿔볼 것

- `sample-workspace`에 파일을 추가하고 검색해보기
- `file-tools.js`에 새 read-only tool 추가하기
- `MAX_STEPS`를 줄이거나 늘려 agent loop 동작 비교하기
