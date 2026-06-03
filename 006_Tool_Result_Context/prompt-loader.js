import { readFile } from 'node:fs/promises';
import path from 'node:path';

const PROMPTS_DIR = path.join(process.cwd(), 'prompts');

export async function loadPromptTemplate(fileName, values) {
  // prompt 문구는 txt 파일에 둡니다.
  // JS 로직을 바꾸지 않고 prompt만 수정해 실험하기 위함입니다.
  const templatePath = path.join(PROMPTS_DIR, fileName);
  const template = await readFile(templatePath, 'utf8');

  return renderTemplate(template, values);
}

function renderTemplate(template, values) {
  // {{toolResult}} 같은 placeholder를 실행 시점의 값으로 치환합니다.
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    if (!(key in values)) {
      return match;
    }

    return values[key];
  });
}
