export const evalCases = [
  {
    name: 'time request uses current_time tool',
    input: '지금 시간을 알려줘',
    expected: {
      toolName: 'current_time',
      answerIncludes: 'current_time',
      maxSteps: 2
    }
  },
  {
    name: 'count request uses count_text tool',
    input: '이 문장의 단어 수를 세줘',
    expected: {
      toolName: 'count_text',
      answerIncludes: 'characters',
      maxSteps: 2
    }
  },
  {
    name: 'uppercase request uses uppercase_text tool',
    input: 'hello를 대문자로 바꿔줘',
    expected: {
      toolName: 'uppercase_text',
      answerIncludes: 'HELLO',
      maxSteps: 2
    }
  },
  {
    name: 'general request does not use a tool',
    input: '좋은 학습 순서를 추천해줘',
    expected: {
      toolName: null,
      answerIncludes: 'no tool',
      maxSteps: 1
    }
  }
];
