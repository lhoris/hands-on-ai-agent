# 003 Prompt Chaining

사용자 입력을 여러 개의 고정된 LLM 호출 단계로 나누는 미니 프로젝트입니다.

이 예제는 agent가 자유롭게 다음 행동을 고르는 구조가 아닙니다. 코드가 `analyze -> plan -> answer` 순서를 정하고, 각 단계의 prompt template을 `prompts/*.txt` 파일에서 읽어 LLM을 호출합니다.

## 실행 방법

Node.js 18 이상이 필요합니다.

```bash
npm install
npm start
```

실행 후 터미널에 요청을 입력하고 `Enter`를 누르면 prompt chain이 실행됩니다. 종료는 `Ctrl+C`를 사용합니다.

## 실제 API 호출

기본값은 mock LLM 모드입니다. 실제 Anthropic API를 호출하려면 `config.js`에 API 키를 넣습니다.

```js
export const ANTHROPIC_API_KEY = 'your-api-key';
export const ANTHROPIC_MODEL = 'claude-sonnet-4-20250514';
```

API 키가 비어 있으면 자동으로 mock LLM 모드로 실행됩니다.

## 프로젝트 구조

```text
003_Prompt_Chaining/
├── README.md
├── chain.js
├── config.js
├── index.js
├── llm-client.js
├── mock-llm.js
├── package.json
├── prompt-loader.js
└── prompts/
    ├── 01_analyze.txt
    ├── 02_plan.txt
    └── 03_answer.txt
```

| 파일 | 설명 |
| --- | --- |
| `index.js` | Ink 기반 CLI UI와 사용자 입력 처리를 담당합니다. |
| `chain.js` | `analyze -> plan -> answer` 순서로 LLM 호출을 실행합니다. |
| `prompt-loader.js` | txt prompt template을 읽고 `{{value}}` placeholder를 치환합니다. |
| `prompts/*.txt` | 각 단계에서 사용할 prompt template입니다. |
| `llm-client.js` | API 키가 있으면 Anthropic API를 호출하고, 없으면 mock LLM으로 fallback합니다. |
| `mock-llm.js` | 단계별 mock 응답을 반환합니다. |
| `config.js` | 실습용 API 키와 모델명을 설정합니다. |

## 코드 흐름

```text
terminal input
  -> 01_analyze.txt
  -> callLlm()
  -> 02_plan.txt
  -> callLlm()
  -> 03_answer.txt
  -> callLlm()
  -> final answer
```

## 바꿔볼 것

- `prompts/*.txt` 문구를 바꿔 결과 비교하기
- `chain.js`에 새로운 중간 단계를 추가하기
- mock LLM 모드와 실제 API 모드의 출력 차이를 비교하기
