import { callLlm } from './llm-client.js';
import { loadPromptTemplate } from './prompt-loader.js';
import { executeTool, formatToolList, hasTool } from './tool-registry.js';

const MAX_STEPS = 4;

export async function runAgentLoop(userInput, onStep) {
  const scratchpad = [];

  for (let step = 1; step <= MAX_STEPS; step += 1) {
    onStep({ role: 'agent', prefix: 'agent:', text: `step ${step}/${MAX_STEPS}: deciding next action...` });

    const prompt = await loadPromptTemplate('01_agent_step.txt', {
      userInput,
      tools: formatToolList(),
      scratchpad: formatScratchpad(scratchpad)
    });
    const rawAction = await callLlm(prompt);
    const action = parseAction(rawAction);

    onStep({
      role: 'agent',
      prefix: 'action:',
      text: `${action.type}${action.toolName ? `:${action.toolName}` : ''} - ${action.reason}`
    });

    if (action.type === 'final') {
      return {
        answer: action.answer,
        steps: scratchpad
      };
    }

    if (action.type === 'tool') {
      validateToolAction(action);

      const toolResult = await executeTool(action.toolName, action.input);
      const observation = {
        step,
        toolName: toolResult.toolName,
        input: action.input,
        output: toolResult.output,
        reason: action.reason
      };

      // observation은 다음 loop의 context가 됩니다.
      // agent는 이 기록을 보고 tool을 더 쓸지, 최종 답변을 낼지 결정합니다.
      scratchpad.push(observation);

      onStep({
        role: 'toolResult',
        prefix: 'result:',
        text: `${toolResult.toolName} returned: ${toolResult.output}`
      });

      continue;
    }

    throw new Error(`Unsupported action type: ${action.type}`);
  }

  // agent가 final을 내지 못해도 무한 반복하지 않도록 최대 step에서 멈춥니다.
  return {
    answer: 'Agent stopped because it reached the maximum step count.',
    steps: scratchpad
  };
}

function parseAction(rawAction) {
  // LLM에게 JSON만 반환하라고 지시해도 앞뒤 문장이 붙을 수 있습니다.
  // 그래서 응답 안에서 첫 번째 JSON object를 찾아 파싱합니다.
  const jsonText = extractJsonObject(rawAction);
  const parsed = jsonText ? JSON.parse(jsonText) : {};

  return {
    type: normalizeActionType(parsed.type),
    toolName: typeof parsed.toolName === 'string' ? parsed.toolName.trim() : '',
    input: typeof parsed.input === 'string' ? parsed.input : '',
    reason: typeof parsed.reason === 'string' ? parsed.reason : 'No reason provided.',
    answer: typeof parsed.answer === 'string' ? parsed.answer : ''
  };
}

function normalizeActionType(type) {
  if (type === 'tool' || type === 'final') {
    return type;
  }

  return 'final';
}

function validateToolAction(action) {
  // LLM이 잘못된 tool 이름을 반환할 수 있으므로 실행 전에 반드시 검증합니다.
  if (!hasTool(action.toolName)) {
    throw new Error(`Unknown tool selected by LLM: ${action.toolName}`);
  }
}

function extractJsonObject(text) {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');

  if (start === -1 || end === -1 || end <= start) {
    return '';
  }

  return text.slice(start, end + 1);
}

function formatScratchpad(scratchpad) {
  if (scratchpad.length === 0) {
    return 'No previous tool observations.';
  }

  return scratchpad
    .map((item) => [
      `Step ${item.step}`,
      `Tool: ${item.toolName}`,
      `Input: ${item.input}`,
      `Observation: ${item.output}`,
      `Reason: ${item.reason}`
    ].join('\n'))
    .join('\n\n');
}
