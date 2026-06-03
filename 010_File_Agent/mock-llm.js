export async function mockLlm(prompt) {
  await delay(600);

  if (prompt.includes('Step: file_agent')) {
    return JSON.stringify(selectFileAction(prompt), null, 2);
  }

  return `Mock response for: ${prompt.trim()}`;
}

function selectFileAction(prompt) {
  const userInput = extractSection(prompt, 'User request:');
  const scratchpad = extractSection(prompt, 'Scratchpad:');

  // observation이 있으면 그 결과를 바탕으로 final 답변을 냅니다.
  if (!scratchpad.includes('No previous file observations.')) {
    return {
      type: 'final',
      answer: [
        'Final answer from mock file agent:',
        `Request: ${userInput}`,
        '',
        'Observed file context:',
        scratchpad.split('\n').slice(0, 10).join('\n')
      ].join('\n'),
      reason: 'The file observation is available, so the agent can answer.'
    };
  }

  const lowerInput = userInput.toLowerCase();

  // 첫 step에서는 요청에 맞는 file tool을 선택합니다.
  // 실제 API 모드에서는 LLM이 file tool 목록과 scratchpad를 보고 action을 선택합니다.
  if (includesAny(lowerInput, ['목록', 'list', 'files', '파일들'])) {
    return {
      type: 'tool',
      toolName: 'list_files',
      input: '',
      reason: 'The user wants to see available files.'
    };
  }

  if (includesAny(lowerInput, ['todo', '찾아', '검색', 'search'])) {
    return {
      type: 'tool',
      toolName: 'search_files',
      input: extractSearchQuery(userInput),
      reason: 'The user wants to search file contents.'
    };
  }

  if (includesAny(lowerInput, ['config', '설정'])) {
    return {
      type: 'tool',
      toolName: 'read_file',
      input: 'config.json',
      reason: 'The user is asking about the config file.'
    };
  }

  if (includesAny(lowerInput, ['readme', '요약', '내용', '읽어'])) {
    return {
      type: 'tool',
      toolName: 'read_file',
      input: 'README.md',
      reason: 'The user is asking to read or summarize README.'
    };
  }

  return {
    type: 'final',
    answer: `Final answer from mock file agent: no file read is needed for "${userInput}".`,
    reason: 'No file tool is needed.'
  };
}

function extractSearchQuery(userInput) {
  if (userInput.toLowerCase().includes('todo')) {
    return 'TODO';
  }

  return userInput.trim();
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
