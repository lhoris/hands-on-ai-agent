import { callLlm } from './llm-client.js';
import { loadMemory, formatMemoryContext, saveInteraction } from './memory-store.js';
import { loadPromptTemplate } from './prompt-loader.js';

export async function runMemoryWorkflow(userInput, onStep) {
  onStep({ role: 'memory', prefix: 'memory:', text: 'loading saved memory...' });

  const memoryItems = await loadMemory();
  const memoryContext = formatMemoryContext(memoryItems);

  onStep({
    role: 'memory',
    prefix: 'memory:',
    text: `${memoryItems.length} memory item(s) loaded`
  });

  const prompt = await loadPromptTemplate('01_answer_with_memory.txt', {
    userInput,
    memoryContext
  });
  const answer = await callLlm(prompt);

  // 응답이 끝난 뒤 이번 interaction을 memory에 저장합니다.
  // 다음 사용자 요청부터 이 정보가 context로 들어갑니다.
  const nextMemory = await saveInteraction(userInput, answer);

  onStep({
    role: 'memory',
    prefix: 'memory:',
    text: `saved interaction. total memory item(s): ${nextMemory.length}`
  });

  return {
    answer,
    memoryItems,
    nextMemory
  };
}
