import { mockLlm } from './mock-llm.js';
import { executeTool, hasTool } from './tool-registry.js';

const MAX_STEPS = 4;

export async function runAgent(userInput) {
  const observations = [];
  const trace = [];

  for (let step = 1; step <= MAX_STEPS; step += 1) {
    const action = await mockLlm({
      userInput,
      observations
    });

    trace.push({
      step,
      action
    });

    if (action.type === 'final') {
      return {
        answer: action.answer,
        observations,
        trace
      };
    }

    if (action.type === 'tool') {
      // eval에서도 실제 agent와 마찬가지로 tool 이름을 검증합니다.
      // LLM이 잘못된 tool을 선택하면 바로 실패해야 합니다.
      if (!hasTool(action.toolName)) {
        throw new Error(`Unknown tool selected: ${action.toolName}`);
      }

      const result = await executeTool(action.toolName, action.input);
      observations.push({
        step,
        toolName: result.toolName,
        input: action.input,
        output: result.output
      });

      continue;
    }

    throw new Error(`Unsupported action type: ${action.type}`);
  }

  return {
    answer: 'Agent stopped because it reached the maximum step count.',
    observations,
    trace
  };
}
