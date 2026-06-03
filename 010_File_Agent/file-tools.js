import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const WORKSPACE_DIR = path.join(process.cwd(), 'sample-workspace');

export const fileTools = [
  {
    name: 'list_files',
    description: 'sample-workspace 안의 파일 목록을 확인합니다.'
  },
  {
    name: 'read_file',
    description: 'sample-workspace 안의 특정 파일 내용을 읽습니다.'
  },
  {
    name: 'search_files',
    description: 'sample-workspace 안의 파일에서 텍스트를 검색합니다.'
  }
];

export function formatFileToolList() {
  // LLM에게 보여줄 file tool 목록을 prompt에 넣기 좋은 텍스트로 바꿉니다.
  return fileTools.map((tool) => `- ${tool.name}: ${tool.description}`).join('\n');
}

export function hasFileTool(toolName) {
  return fileTools.some((tool) => tool.name === toolName);
}

export async function executeFileTool(toolName, input) {
  // 이 예제는 read-only file agent입니다.
  // 모든 tool은 sample-workspace 내부에서만 동작합니다.
  if (toolName === 'list_files') {
    const files = await listWorkspaceFiles();

    return {
      toolName,
      output: files.join('\n')
    };
  }

  if (toolName === 'read_file') {
    const content = await readWorkspaceFile(input);

    return {
      toolName,
      output: content
    };
  }

  if (toolName === 'search_files') {
    const result = await searchWorkspaceFiles(input);

    return {
      toolName,
      output: result
    };
  }

  throw new Error(`Unknown file tool: ${toolName}`);
}

async function listWorkspaceFiles() {
  const entries = await readdir(WORKSPACE_DIR, {
    withFileTypes: true
  });

  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .sort();
}

async function readWorkspaceFile(fileName) {
  const safePath = resolveWorkspaceFile(fileName);

  return readFile(safePath, 'utf8');
}

async function searchWorkspaceFiles(query) {
  const files = await listWorkspaceFiles();
  const matches = [];

  for (const fileName of files) {
    const content = await readWorkspaceFile(fileName);
    const lines = content.split(/\r?\n/);

    lines.forEach((line, index) => {
      if (line.toLowerCase().includes(query.toLowerCase())) {
        matches.push(`${fileName}:${index + 1}: ${line}`);
      }
    });
  }

  return matches.length > 0 ? matches.join('\n') : `No matches for "${query}".`;
}

function resolveWorkspaceFile(fileName) {
  // path traversal을 막기 위해 resolve 후 workspace 내부인지 확인합니다.
  const resolvedPath = path.resolve(WORKSPACE_DIR, fileName);
  const workspacePath = path.resolve(WORKSPACE_DIR);

  if (!resolvedPath.startsWith(`${workspacePath}${path.sep}`)) {
    throw new Error(`File is outside sample-workspace: ${fileName}`);
  }

  return resolvedPath;
}
