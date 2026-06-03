export function hasTool(toolName) {
  return ['current_time', 'count_text', 'uppercase_text'].includes(toolName);
}

export async function executeTool(toolName, input) {
  // eval에서는 시간도 고정값으로 반환합니다.
  // 그래야 실행할 때마다 같은 결과를 검증할 수 있습니다.
  if (toolName === 'current_time') {
    return {
      toolName,
      output: '2026-06-03T12:00:00+09:00'
    };
  }

  if (toolName === 'count_text') {
    const words = input.trim().length === 0 ? [] : input.trim().split(/\s+/);

    return {
      toolName,
      output: `characters: ${input.length}, words: ${words.length}`
    };
  }

  if (toolName === 'uppercase_text') {
    return {
      toolName,
      output: input.toUpperCase()
    };
  }

  throw new Error(`Unknown tool: ${toolName}`);
}
