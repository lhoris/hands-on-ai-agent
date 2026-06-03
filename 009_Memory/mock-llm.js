export async function mockLlm(prompt) {
  await delay(600);

  const userInput = extractUserRequest(prompt);
  const memoryContext = extractMemoryContext(prompt);

  const rememberedName = findRememberedName(memoryContext);
  const newName = findNameInUserInput(userInput);

  if (newName) {
    return `알겠습니다. 앞으로 이름을 ${newName}(으)로 기억하겠습니다.`;
  }

  if (asksForName(userInput)) {
    if (rememberedName) {
      return `기억하고 있는 이름은 ${rememberedName}입니다.`;
    }

    return '아직 이름을 기억하고 있지 않습니다.';
  }

  if (memoryContext.includes('No saved memory yet.')) {
    return `Memory가 아직 없어서 현재 요청만 보고 답변합니다: ${userInput}`;
  }

  return [
    `이전 memory를 참고해서 답변합니다: ${userInput}`,
    '',
    '참고한 memory:',
    memoryContext.split('\n').slice(0, 4).join('\n')
  ].join('\n');
}

function findNameInUserInput(userInput) {
  // 학습용으로 매우 단순한 이름 추출 규칙만 둡니다.
  // 예: "내 이름은 민수야", "내 이름은 지훈입니다"
  const match = userInput.match(/내 이름은\s*([^\s.,!?]+)/);

  return removeKoreanNameSuffix(match?.[1] || '');
}

function findRememberedName(memoryContext) {
  // memory는 오래된 항목부터 최신 항목 순서로 들어옵니다.
  // 같은 정보가 여러 번 저장되면 가장 최근 값을 우선해야 합니다.
  const matches = [...memoryContext.matchAll(/이름을\s*([^\s()]+)\(으\)로 기억/g)];
  const match = matches.at(-1);

  return match?.[1] || '';
}

function asksForName(userInput) {
  return userInput.includes('내 이름') && (
    userInput.includes('뭐') ||
    userInput.includes('기억') ||
    userInput.includes('알고')
  );
}

function removeKoreanNameSuffix(name) {
  return name
    .replace(/이야$/, '')
    .replace(/입니다$/, '')
    .replace(/이에요$/, '')
    .replace(/예요$/, '')
    .replace(/야$/, '');
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

function extractMemoryContext(prompt) {
  // memory context 안에는 여러 memory가 들어가며, memory 사이에 빈 줄이 포함될 수 있습니다.
  // 그래서 단순히 첫 빈 줄에서 자르면 뒤쪽 memory를 읽지 못합니다.
  // 명확한 다음 label인 "User request:" 전까지를 memory context로 봅니다.
  return extractBetween(prompt, 'Memory context:', '\n\nUser request:');
}

function extractUserRequest(prompt) {
  return extractBetween(prompt, 'User request:', '');
}

function extractBetween(prompt, startLabel, endLabel) {
  const startIndex = prompt.indexOf(startLabel);

  if (startIndex === -1) {
    return '';
  }

  const sectionStart = startIndex + startLabel.length;

  if (!endLabel) {
    return prompt.slice(sectionStart).trim();
  }

  const endIndex = prompt.indexOf(endLabel, sectionStart);

  if (endIndex === -1) {
    return prompt.slice(sectionStart).trim();
  }

  return prompt.slice(sectionStart, endIndex).trim();
}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
