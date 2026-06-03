export async function mockLlm(prompt) {
  await delay(600);

  if (prompt.includes('Step: agent_loop')) {
    return JSON.stringify(selectAgentAction(prompt), null, 2);
  }

  return `Mock response for: ${prompt.trim()}`;
}

function selectAgentAction(prompt) {
  const userInput = extractSection(prompt, 'User request:');
  const scratchpad = extractSection(prompt, 'Scratchpad:');

  // observation이 이미 있다면 tool 결과를 바탕으로 final 답변을 냅니다.
  // 이것이 006과 달리 loop가 종료 조건을 직접 판단하는 부분입니다.
  if (!scratchpad.includes('No previous tool observations.')) {
    const observation = extractLastObservation(scratchpad);

    return {
      type: 'final',
      answer: [
        'Final answer from mock agent:',
        `I used the tool result to answer: ${userInput}`,
        `Observation: ${observation}`
      ].join('\n'),
      reason: 'The needed tool result is available, so the agent can finish.'
    };
  }

  const lowerInput = userInput.toLowerCase();

  // 첫 step에서는 요청에 맞는 tool을 고릅니다.
  // 실제 API 모드에서는 LLM이 prompt의 tool 목록과 scratchpad를 보고 action을 선택합니다.
  if (includesAny(lowerInput, ['time', 'date', 'now', '시간', '날짜', '지금'])) {
    return {
      type: 'tool',
      toolName: 'current_time',
      input: userInput,
      reason: 'The user needs current time information.'
    };
  }

  if (includesAny(lowerInput, ['count', 'word', 'character', '글자', '단어', '몇 자'])) {
    return {
      type: 'tool',
      toolName: 'count_text',
      input: userInput,
      reason: 'The user wants text counting.'
    };
  }

  if (includesAny(lowerInput, ['uppercase', 'capital', '대문자'])) {
    return {
      type: 'tool',
      toolName: 'uppercase_text',
      input: userInput,
      reason: 'The user wants uppercase conversion.'
    };
  }

  return {
    type: 'final',
    answer: `Final answer from mock agent: no tool is needed for "${userInput}".`,
    reason: 'No available tool is useful for this request.'
  };
}

function extractLastObservation(scratchpad) {
  const marker = 'Observation:';
  const index = scratchpad.lastIndexOf(marker);

  if (index === -1) {
    return scratchpad.trim();
  }

  return scratchpad.slice(index + marker.length).trim();
}

function includesAny(value, keywords) {
  return keywords.some((keyword) => value.includes(keyword));
}

function extractSection(prompt, label) {
  // mock 응답을 만들기 위해 렌더링된 prompt에서 필요한 section만 다시 꺼냅니다.
  const startIndex = prompt.indexOf(label);

  if (startIndex === -1) {
    return '';
  }

  const sectionStart = startIndex + label.length;
  const nextSectionIndex = prompt.indexOf('\n\n', sectionStart);

  if (nextSectionIndex === -1) {
    return prompt.slice(sectionStart).trim();
  }

  return prompt.slice(sectionStart, nextSectionIndex).trim();
}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
