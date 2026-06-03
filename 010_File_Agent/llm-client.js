import { mockLlm } from './mock-llm.js';
import { ANTHROPIC_API_KEY, ANTHROPIC_MODEL } from './config.js';

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';

export function getLlmMode() {
  return getApiKey() ? 'Anthropic API' : 'mock LLM';
}

export async function callLlm(prompt) {
  // 앱의 나머지 코드는 callLlm()만 사용합니다.
  // API 키가 비어 있으면 mock 모드로 실행해 실습 비용을 줄입니다.
  if (!getApiKey()) {
    return mockLlm(prompt);
  }

  return callAnthropic(prompt);
}

async function callAnthropic(prompt) {
  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': getApiKey(),
      'anthropic-version': ANTHROPIC_VERSION
    },
    body: JSON.stringify({
      model: getModel(),
      max_tokens: 900,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    })
  });

  const data = await response.json();

  if (!response.ok) {
    const message = data?.error?.message || `Anthropic API request failed with ${response.status}`;
    throw new Error(message);
  }

  return data.content
    .filter((part) => part.type === 'text')
    .map((part) => part.text)
    .join('\n');
}

function getApiKey() {
  return ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY;
}

function getModel() {
  return process.env.ANTHROPIC_MODEL || ANTHROPIC_MODEL;
}
