# 008 Evals

agent workflow가 기대한 대로 동작하는지 자동으로 확인하는 eval 미니 프로젝트입니다.

이번 예제는 실제 LLM API를 호출하지 않습니다. eval은 반복 실행 가능하고 결과가 안정적이어야 하므로, deterministic mock LLM을 사용합니다. 목표는 모델 품질 평가가 아니라 `agent가 올바른 tool을 선택하는지`, `최종 답변을 생성하는지`, `불필요한 tool을 쓰지 않는지`를 확인하는 것입니다.

## 실행 방법

Node.js 18 이상이 필요합니다.

```bash
npm install
npm start
```

또는 아래 명령을 사용할 수 있습니다.

```bash
npm run eval
```

## 프로젝트 구조

```text
008_Evals/
├── README.md
├── agent-under-test.js
├── eval-cases.js
├── eval-runner.js
├── mock-llm.js
├── package.json
└── tool-registry.js
```

| 파일 | 설명 |
| --- | --- |
| `eval-cases.js` | eval 입력과 기대 결과를 정의합니다. |
| `eval-runner.js` | eval case를 실행하고 pass/fail 결과를 출력합니다. |
| `agent-under-test.js` | eval 대상 agent loop입니다. |
| `mock-llm.js` | 안정적인 eval을 위해 deterministic LLM 응답을 제공합니다. |
| `tool-registry.js` | agent가 사용할 수 있는 tool 목록과 실행 함수를 정의합니다. |

## 코드 흐름

```text
eval-cases.js
  -> eval-runner.js
  -> runAgent()
  -> mock LLM action
  -> tool 실행
  -> assertion
  -> pass/fail 출력
```

## 바꿔볼 것

- `eval-cases.js`에 새 case 추가하기
- 실패하는 case를 일부러 만들어 fail 출력 확인하기
- `agent-under-test.js`의 로직을 바꾼 뒤 eval로 회귀 확인하기
