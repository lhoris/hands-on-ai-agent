import { callLlm } from './llm-client.js';
import { loadPromptTemplate } from './prompt-loader.js';

const ROUTES = new Set(['code', 'docs', 'general']);

export async function runRoutingWorkflow(userInput, onStep) {
  onStep({ role: 'route', prefix: 'route:', text: 'classifying request...' });

  // 첫 번째 LLM 호출:
  // 사용자 요청을 미리 정해둔 route 중 하나로 분류하게 합니다.
  const routePrompt = await loadPromptTemplate('01_route.txt', {
    userInput
  });
  const rawRoute = await callLlm(routePrompt);

  // LLM 출력에는 불필요한 문장, 대소문자 차이, 문장부호가 섞일 수 있습니다.
  // 파일명이나 분기 조건으로 쓰기 전에 반드시 정규화합니다.
  const route = normalizeRoute(rawRoute);

  onStep({ role: 'route', prefix: 'route:', text: `selected "${route}" from raw output: ${rawRoute}` });
  onStep({ role: 'workflow', prefix: 'workflow:', text: `loading prompts/routes/${route}.txt` });

  // 두 번째 LLM 호출:
  // 선택된 route에 맞는 prompt를 사용해서 최종 응답을 생성합니다.
  const answerPrompt = await loadPromptTemplate(`routes/${route}.txt`, {
    userInput,
    route
  });
  const answer = await callLlm(answerPrompt);

  return {
    route,
    rawRoute,
    answer
  };
}

export function normalizeRoute(rawRoute) {
  const normalized = rawRoute.trim().toLowerCase();

  // 가장 좋은 경우: 모델이 지시를 잘 따라 "code", "docs", "general" 중 하나만 반환합니다.
  if (ROUTES.has(normalized)) {
    return normalized;
  }

  // 관대한 처리: 모델이 "The best route is docs."처럼 문장으로 반환해도 처리합니다.
  for (const route of ROUTES) {
    if (normalized.includes(route)) {
      return route;
    }
  }

  // 안전한 fallback: 알 수 없는 분류 결과가 나와도 workflow는 계속 진행되게 합니다.
  return 'general';
}
