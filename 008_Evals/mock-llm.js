export async function mockLlm(state) {
  // 이 mock은 prompt 문자열이 아니라 agent state를 직접 받습니다.
  // eval에서는 LLM 응답을 안정적으로 재현하는 것이 더 중요하기 때문입니다.
  if (state.observations.length > 0) {
    const lastObservation = state.observations.at(-1);

    return {
      type: 'final',
      answer: [
        'Final answer from eval mock:',
        `used tool: ${lastObservation.toolName}`,
        `observation: ${lastObservation.output}`
      ].join('\n'),
      reason: 'The required tool observation is available.'
    };
  }

  const lowerInput = state.userInput.toLowerCase();

  if (includesAny(lowerInput, ['time', 'date', 'now', '시간', '날짜', '지금'])) {
    return {
      type: 'tool',
      toolName: 'current_time',
      input: state.userInput,
      reason: 'The request needs current time.'
    };
  }

  if (includesAny(lowerInput, ['count', 'word', 'character', '글자', '단어', '몇 자'])) {
    return {
      type: 'tool',
      toolName: 'count_text',
      input: state.userInput,
      reason: 'The request needs text counting.'
    };
  }

  if (includesAny(lowerInput, ['uppercase', 'capital', '대문자'])) {
    return {
      type: 'tool',
      toolName: 'uppercase_text',
      input: state.userInput,
      reason: 'The request needs uppercase conversion.'
    };
  }

  return {
    type: 'final',
    answer: `Final answer from eval mock: no tool is needed for "${state.userInput}".`,
    reason: 'No available tool is useful for this request.'
  };
}

function includesAny(value, keywords) {
  return keywords.some((keyword) => value.includes(keyword));
}
