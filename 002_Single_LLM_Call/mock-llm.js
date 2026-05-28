export async function mockLlm(prompt) {
  await delay(700);

  const userInput = extractUserInput(prompt);

  return [
    'Mock LLM response:',
    `I received your request: "${userInput}"`,
    'Next step: replace mockLlm() with a real LLM API call.'
  ].join('\n');
}

function extractUserInput(prompt) {
  const marker = 'User request:';
  const markerIndex = prompt.indexOf(marker);

  if (markerIndex === -1) {
    return prompt.trim();
  }

  return prompt.slice(markerIndex + marker.length).trim();
}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
