# Hands-on AI Agent

AI agent를 직접 만들어보는 작은 예제들을 모아두는 저장소입니다.

각 폴더는 독립적인 미니 프로젝트입니다. 번호 순서대로 실행하면서 CLI UI, agent loop, tool 호출, 모델 연동 같은 구성 요소를 하나씩 실습합니다.

## 미니 프로젝트

| 폴더 | 주제 |
| --- | --- |
| `001_UI_Ink` | Ink를 활용한 CLI UI 구성 |
| `002_Single_LLM_Call` | 사용자 입력을 단일 LLM 호출로 처리 |
| `003_Prompt_Chaining` | 여러 prompt를 순서대로 연결하는 workflow 구성 |
| `004_Routing` | 입력 유형에 따라 다른 prompt로 분기하는 workflow 구성 |
| `005_Tool_Use` | LLM이 선택한 tool을 코드에서 실행하는 workflow 구성 |
| `006_Tool_Result_Context` | tool 실행 결과를 LLM context에 넣어 최종 응답 생성 |
| `007_Agent_Loop` | LLM이 다음 action을 반복 선택하는 agent loop 구성 |
| `008_Evals` | agent workflow의 기대 동작을 자동 검증하는 eval 구성 |
| `009_Memory` | 이전 interaction을 저장하고 다음 요청의 context로 활용 |
| `010_File_Agent` | sample workspace를 읽고 검색하는 read-only file agent 구성 |

각 미니 프로젝트의 실행 방법은 해당 폴더의 `README.md`를 확인합니다.
