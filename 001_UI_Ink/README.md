# 001 UI Ink

Ink와 React를 사용해 간단한 AI agent 형태의 CLI 화면을 만들어보는 미니 프로젝트입니다.

실제 LLM API나 tool을 호출하지는 않고, 사용자 입력을 받은 뒤 agent가 판단하고 tool을 실행하는 것처럼 보이는 흐름을 흉내 냅니다.

## 실행 방법

Node.js 18 이상이 필요합니다.

```bash
npm install
npm start
```

실행 후 터미널에 작업 내용을 입력하고 `Enter`를 누르면 simulated agent loop가 실행됩니다. 종료는 `Ctrl+C`를 사용합니다.

## 프로젝트 구조

```text
001_UI_Ink/
├── README.md
├── index.js
├── package.json
└── package-lock.json
```

| 파일 | 설명 |
| --- | --- |
| `index.js` | Ink 앱의 UI, 입력 처리, 상태 관리, 가짜 agent 실행 흐름을 담고 있습니다. |
| `package.json` | 실행 스크립트와 의존성을 정의합니다. |
| `package-lock.json` | 설치된 npm 패키지 버전을 고정합니다. |

## 코드 흐름

```text
terminal input
  -> submit handler
  -> simulated LLM decision
  -> simulated tool execution
  -> history update
```

주요 Ink 요소는 다음과 같습니다.

- `render()`: 터미널에 앱을 렌더링합니다.
- `Box`: 레이아웃과 테두리를 구성합니다.
- `Text`: 터미널 텍스트를 출력합니다.
- `useState()`: 입력값, 메시지 기록, 실행 상태를 관리합니다.
- `useInput()`: 키보드 입력을 처리합니다.