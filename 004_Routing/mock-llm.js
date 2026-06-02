export async function mockLlm(prompt) {
  await delay(600);

  const userInput = extractSection(prompt, 'User request:');

  // routing prompt는 route 이름만 반환하라고 요청합니다.
  // 실제 API 모드에서는 Claude가 이 분류를 수행합니다.
  if (prompt.includes('Step: route')) {
    return classify(userInput);
  }

  // route별 prompt는 각 분기에 맞는 최종 응답 스타일을 만듭니다.
  if (prompt.includes('Route: code')) {
    return [
      'Code route response:',
      `- Request: ${userInput}`,
      '- Focus on implementation details, files, and concrete code changes.',
      '- Keep the next action small enough to test.'
    ].join('\n');
  }

  if (prompt.includes('Route: docs')) {
    return [
      'Docs route response:',
      `- Request: ${userInput}`,
      '- Focus on structure, wording, examples, and reader flow.',
      '- Keep the explanation concise and easy to scan.'
    ].join('\n');
  }

  if (prompt.includes('Route: general')) {
    return [
      'General route response:',
      `- Request: ${userInput}`,
      '- Answer directly.',
      '- Avoid adding workflow complexity unless the user asks for it.'
    ].join('\n');
  }

  return `Mock response for: ${userInput || prompt.trim()}`;
}

function classify(userInput) {
  const lowerInput = userInput.toLowerCase();

  // 이 키워드 분류 로직은 mock 모드 전용입니다.
  // API 크레딧을 쓰지 않고도 routing 동작을 눈으로 확인하기 위한 코드입니다.
  if (includesAny(lowerInput, ['code', 'bug', 'function', 'api', '구현', '코드', '버그', '함수'])) {
    return 'code';
  }

  if (includesAny(lowerInput, ['readme', 'docs', 'document', '문서', '설명', '가이드'])) {
    return 'docs';
  }

  return 'general';
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
