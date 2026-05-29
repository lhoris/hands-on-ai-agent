export async function mockLlm(prompt) {
  await delay(600);

  const userInput = extractSection(prompt, 'User request:');

  if (prompt.includes('Step: analyze')) {
    return [
      'The user wants help with:',
      `- ${userInput}`,
      'The request should be clarified into a small, practical answer.'
    ].join('\n');
  }

  if (prompt.includes('Step: plan')) {
    return [
      '1. Restate the request briefly.',
      '2. Explain the main idea in simple terms.',
      '3. Suggest one concrete next action.'
    ].join('\n');
  }

  if (prompt.includes('Step: answer')) {
    const plan = extractSection(prompt, 'Plan:');

    return [
      `Here is a concise answer for: ${userInput}`,
      '',
      plan,
      '',
      'This response was produced by chaining multiple mock LLM calls.'
    ].join('\n');
  }

  return `Mock response for: ${userInput || prompt.trim()}`;
}

function extractSection(prompt, label) {
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
