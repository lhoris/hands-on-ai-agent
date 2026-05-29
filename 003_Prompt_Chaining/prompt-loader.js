import { readFile } from 'node:fs/promises';
import path from 'node:path';

const PROMPTS_DIR = path.join(process.cwd(), 'prompts');

export async function loadPromptTemplate(fileName, values) {
  const templatePath = path.join(PROMPTS_DIR, fileName);
  const template = await readFile(templatePath, 'utf8');

  return renderTemplate(template, values);
}

function renderTemplate(template, values) {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    if (!(key in values)) {
      return match;
    }

    return values[key];
  });
}
