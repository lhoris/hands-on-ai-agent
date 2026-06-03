import { callLlm } from './llm-client.js';
import { loadPromptTemplate } from './prompt-loader.js';
import { executeTool, formatToolList, hasTool } from './tool-registry.js';

export async function runToolWorkflow(userInput, onStep) {
  onStep({ role: 'tool', prefix: 'tool:', text: 'asking LLM to select a tool...' });

  const selectToolPrompt = await loadPromptTemplate('01_select_tool.txt', {
    tools: formatToolList(),
    userInput
  });

  const rawToolCall = await callLlm(selectToolPrompt);
  const toolCall = parseToolCall(rawToolCall, userInput);

  onStep({
    role: 'tool',
    prefix: 'tool:',
    text: `selected "${toolCall.toolName}" with input: ${toolCall.input}`
  });

  const toolResult = await executeTool(toolCall.toolName, toolCall.input);

  return {
    rawToolCall,
    toolCall,
    toolResult,
    answer: formatAnswer(toolCall, toolResult)
  };
}

function parseToolCall(rawToolCall, fallbackInput) {
  // LLM에게 JSON만 반환하라고 지시해도 실제로는 앞뒤 문장이 붙을 수 있습니다.
  // 그래서 응답 안에서 첫 번째 JSON object를 찾아 파싱합니다.
  const jsonText = extractJsonObject(rawToolCall);
  const parsed = jsonText ? JSON.parse(jsonText) : {};
  const toolName = normalizeToolName(parsed.toolName);

  return {
    toolName,
    input: typeof parsed.input === 'string' ? parsed.input : fallbackInput,
    reason: typeof parsed.reason === 'string' ? parsed.reason : 'No reason provided.'
  };
}

function normalizeToolName(toolName) {
  // 알 수 없는 tool 이름은 no_tool로 바꿔 안전하게 처리합니다.
  if (typeof toolName !== 'string') {
    return 'no_tool';
  }

  const normalized = toolName.trim();

  if (hasTool(normalized)) {
    return normalized;
  }

  return 'no_tool';
}

function extractJsonObject(text) {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');

  if (start === -1 || end === -1 || end <= start) {
    return '';
  }

  return text.slice(start, end + 1);
}

function formatAnswer(toolCall, toolResult) {
  // 005 단계에서는 tool 결과를 다시 LLM에 넘기지 않습니다.
  // tool 실행 결과를 그대로 보여주는 것까지만 학습합니다.
  return [
    `Tool: ${toolResult.toolName}`,
    `Reason: ${toolCall.reason}`,
    `Result: ${toolResult.output}`
  ].join('\n');
}
