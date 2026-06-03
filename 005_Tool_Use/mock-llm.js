export async function mockLlm(prompt) {
  await delay(600);

  const userInput = extractSection(prompt, 'User request:');

  if (prompt.includes('Step: select_tool')) {
    return JSON.stringify(selectTool(userInput), null, 2);
  }

  return `Mock response for: ${userInput || prompt.trim()}`;
}

function selectTool(userInput) {
  const lowerInput = userInput.toLowerCase();

  // 이 선택 로직은 mock 모드 전용입니다.
  // 실제 API 모드에서는 LLM이 prompt의 tool 목록을 보고 JSON tool call을 반환합니다.
  if (includesAny(lowerInput, ['time', 'date', 'now', '시간', '날짜', '지금'])) {
    return {
      toolName: 'current_time',
      input: userInput,
      reason: 'The user is asking about the current time or date.'
    };
  }

  if (includesAny(lowerInput, ['count', 'word', 'character', '글자', '단어', '몇 자'])) {
    return {
      toolName: 'count_text',
      input: userInput,
      reason: 'The user is asking to count text.'
    };
  }

  if (includesAny(lowerInput, ['uppercase', 'capital', '대문자'])) {
    return {
      toolName: 'uppercase_text',
      input: userInput,
      reason: 'The user is asking to transform text to uppercase.'
    };
  }

  return {
    toolName: 'no_tool',
    input: userInput,
    reason: 'No available tool is useful for this request.'
  };
}

function includesAny(value, keywords) {
  return keywords.some((keyword) => value.includes(keyword));
}

function extractSection(prompt, label) {
  // mock 응답을 만들기 위해 렌더링된 prompt에서 사용자 요청 부분만 다시 꺼냅니다.
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
