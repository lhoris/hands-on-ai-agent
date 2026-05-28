# 002 Single LLM Call

사용자 입력을 하나의 LLM 호출로 처리하는 흐름을 연습하는 미니 프로젝트입니다.

기본값은 실제 LLM API를 호출하지 않고 `mockLlm()` 함수를 사용합니다. `config.js`에 API 키를 넣으면 Anthropic Messages API를 호출합니다.

## 실행 방법

Node.js 18 이상이 필요합니다.

```bash
npm install
npm start
```

실행 후 터미널에 요청을 입력하고 `Enter`를 누르면 LLM 응답이 출력됩니다. API 키가 없으면 mock LLM 응답이 출력됩니다. 종료는 `Ctrl+C`를 사용합니다.

## 실제 API 호출

핸즈온 실습에서는 `config.js`에 API 키를 직접 넣을 수 있습니다.

```js
export const ANTHROPIC_API_KEY = 'your-api-key';
export const ANTHROPIC_MODEL = 'claude-sonnet-4-20250514';
```

API 키가 비어 있으면 자동으로 mock LLM 모드로 실행됩니다.

실제 키가 들어간 파일은 공개 저장소에 커밋하지 않도록 주의합니다.

## 환경 변수로 실행하기

소스코드에 키를 넣고 싶지 않다면 환경 변수로도 실행할 수 있습니다.

PowerShell:

```powershell
$env:ANTHROPIC_API_KEY="your-api-key"
npm start
```

macOS/Linux:

```bash
ANTHROPIC_API_KEY="your-api-key" npm start
```

모델을 바꾸고 싶으면 `ANTHROPIC_MODEL`도 설정할 수 있습니다.

```powershell
$env:ANTHROPIC_MODEL="claude-sonnet-4-20250514"
```

참고 문서: [Anthropic Messages API](https://platform.claude.com/docs/en/build-with-claude/working-with-messages)

## 프로젝트 구조

```text
002_Single_LLM_Call/
├── README.md
├── config.js
├── index.js
├── llm-client.js
├── mock-llm.js
└── package.json
```

| 파일 | 설명 |
| --- | --- |
| `config.js` | 실습용 API 키와 모델명을 설정합니다. |
| `index.js` | Ink 기반 CLI UI와 사용자 입력 처리 흐름을 담고 있습니다. |
| `llm-client.js` | API 키가 있으면 Anthropic API를 호출하고, 없으면 mock LLM으로 fallback합니다. |
| `mock-llm.js` | 실제 LLM API 대신 사용할 가짜 LLM 함수를 정의합니다. |
| `package.json` | 실행 스크립트와 의존성을 정의합니다. |

## 코드 흐름

```text
terminal input
  -> build prompt
  -> callLlm(prompt)
  -> Anthropic API or mockLlm(prompt)
  -> assistant output
  -> history update
```

## 다음에 바꿔볼 것

- `mockLlm()`의 응답 규칙 바꿔보기
- prompt에 system message 역할을 하는 instruction 추가하기
- `ANTHROPIC_MODEL`을 바꿔 다른 모델로 실행해보기
