import { callLlm } from './llm-client.js';
import { loadPromptTemplate } from './prompt-loader.js';

export async function runPromptChain(userInput, onStep) {
  onStep({ role: 'chain', prefix: 'chain:', text: '1/3 analyzing request...' });
  const analyzePrompt = await loadPromptTemplate('01_analyze.txt', {
    userInput
  });
  const analysis = await callLlm(analyzePrompt);

  onStep({ role: 'analysis', prefix: 'analysis:', text: analysis });
  onStep({ role: 'chain', prefix: 'chain:', text: '2/3 creating plan...' });
  const planPrompt = await loadPromptTemplate('02_plan.txt', {
    userInput,
    analysis
  });
  const plan = await callLlm(planPrompt);

  onStep({ role: 'plan', prefix: 'plan:', text: plan });
  onStep({ role: 'chain', prefix: 'chain:', text: '3/3 writing final answer...' });
  const answerPrompt = await loadPromptTemplate('03_answer.txt', {
    userInput,
    analysis,
    plan
  });
  const answer = await callLlm(answerPrompt);

  return {
    analysis,
    plan,
    answer
  };
}
