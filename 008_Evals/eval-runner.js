import { runAgent } from './agent-under-test.js';
import { evalCases } from './eval-cases.js';

async function main() {
  const results = [];

  for (const evalCase of evalCases) {
    const result = await runOneEval(evalCase);
    results.push(result);
    printResult(result);
  }

  const passed = results.filter((result) => result.passed).length;
  const failed = results.length - passed;

  console.log('');
  console.log(`Summary: ${passed}/${results.length} passed, ${failed} failed`);

  if (failed > 0) {
    process.exitCode = 1;
  }
}

async function runOneEval(evalCase) {
  try {
    const actual = await runAgent(evalCase.input);
    const checks = [
      checkToolName(actual, evalCase.expected.toolName),
      checkAnswerIncludes(actual, evalCase.expected.answerIncludes),
      checkMaxSteps(actual, evalCase.expected.maxSteps)
    ];

    return {
      name: evalCase.name,
      passed: checks.every((check) => check.passed),
      checks,
      actual
    };
  } catch (error) {
    return {
      name: evalCase.name,
      passed: false,
      checks: [
        {
          name: 'no runtime error',
          passed: false,
          message: error.message
        }
      ],
      actual: null
    };
  }
}

function checkToolName(actual, expectedToolName) {
  // 첫 번째 observation의 toolName이 기대와 일치하는지 확인합니다.
  // expectedToolName이 null이면 tool을 쓰지 않아야 한다는 의미입니다.
  const actualToolName = actual.observations[0]?.toolName ?? null;

  return {
    name: 'expected tool',
    passed: actualToolName === expectedToolName,
    message: `expected ${expectedToolName}, got ${actualToolName}`
  };
}

function checkAnswerIncludes(actual, expectedText) {
  return {
    name: 'answer includes text',
    passed: actual.answer.includes(expectedText),
    message: `expected answer to include "${expectedText}"`
  };
}

function checkMaxSteps(actual, maxSteps) {
  return {
    name: 'step count',
    passed: actual.trace.length <= maxSteps,
    message: `expected <= ${maxSteps}, got ${actual.trace.length}`
  };
}

function printResult(result) {
  const status = result.passed ? 'PASS' : 'FAIL';
  console.log(`${status} ${result.name}`);

  for (const check of result.checks) {
    const checkStatus = check.passed ? '  ok' : '  no';
    console.log(`${checkStatus} - ${check.name}: ${check.message}`);
  }
}

main();
