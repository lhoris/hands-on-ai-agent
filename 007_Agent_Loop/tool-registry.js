export const tools = [
  {
    name: 'current_time',
    description: '현재 로컬 시간을 확인할 때 사용합니다.'
  },
  {
    name: 'count_text',
    description: '사용자 입력의 글자 수와 단어 수를 셀 때 사용합니다.'
  },
  {
    name: 'uppercase_text',
    description: '사용자 입력을 대문자로 변환할 때 사용합니다.'
  }
];

export function formatToolList() {
  // LLM에게 보여줄 tool 목록을 prompt에 넣기 좋은 텍스트로 바꿉니다.
  return tools.map((tool) => `- ${tool.name}: ${tool.description}`).join('\n');
}

export function hasTool(toolName) {
  return tools.some((tool) => tool.name === toolName);
}

export async function executeTool(toolName, input) {
  // 실제 tool 실행은 반드시 코드가 담당합니다.
  // LLM은 action JSON으로 "무엇을 실행할지"만 제안합니다.
  if (toolName === 'current_time') {
    return {
      toolName,
      output: new Date().toLocaleString()
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
