import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const MEMORY_FILE = path.join(process.cwd(), '.memory.json');
const MAX_MEMORY_ITEMS = 8;

export async function loadMemory() {
  try {
    const content = await readFile(MEMORY_FILE, 'utf8');
    const parsed = JSON.parse(content);

    if (!Array.isArray(parsed.items)) {
      return [];
    }

    return parsed.items;
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }

    throw error;
  }
}

export async function saveInteraction(userInput, assistantAnswer) {
  const currentMemory = await loadMemory();
  const nextMemory = [
    ...currentMemory,
    {
      at: new Date().toISOString(),
      userInput,
      assistantAnswer,
      summary: buildSimpleSummary(userInput, assistantAnswer)
    }
  ].slice(-MAX_MEMORY_ITEMS);

  await writeFile(MEMORY_FILE, JSON.stringify({ items: nextMemory }, null, 2), 'utf8');

  return nextMemory;
}

export function formatMemoryContext(items) {
  // LLM prompt에 넣기 좋은 형태로 최근 memory를 정리합니다.
  // 실제 서비스라면 검색/요약/벡터 DB 등을 붙일 수 있지만, 여기서는 파일 기반으로 단순화합니다.
  if (items.length === 0) {
    return 'No saved memory yet.';
  }

  return items
    .map((item, index) => [
      `Memory ${index + 1}`,
      `User: ${item.userInput}`,
      `Assistant: ${item.assistantAnswer}`,
      `Summary: ${item.summary}`
    ].join('\n'))
    .join('\n\n');
}

function buildSimpleSummary(userInput, assistantAnswer) {
  // 학습용 요약입니다.
  // 010 이후 단계에서 더 정교한 요약 LLM 호출로 바꿔볼 수 있습니다.
  return `${userInput} -> ${assistantAnswer.split('\n')[0]}`;
}
