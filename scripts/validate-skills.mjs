import { readFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const names = process.argv.slice(2);
const selected = names.length ? names : ['motion-foundations', 'microinteraction-design'];
for (const name of selected) {
  const file = resolve('skills', name, 'SKILL.md');
  const text = readFileSync(file, 'utf8');
  const frontmatter = text.match(
    /^---\r?\nname: ([a-z0-9-]+)\r?\ndescription: ("[^\r\n]*"|'[^\r\n]*')\r?\n---/,
  );
  if (!frontmatter || frontmatter[1] !== name) throw new Error(`Invalid name/frontmatter: ${file}`);
  const scalar = frontmatter[2];
  const description = scalar.startsWith('"')
    ? JSON.parse(scalar)
    : scalar.slice(1, -1).replace(/''/g, "'");
  if (!description.startsWith('Use when ') || description.length > 1024)
    throw new Error(`Invalid description: ${name}`);
  for (const section of [
    'Aplicação',
    'Parâmetros',
    'Exemplo',
    'Restrições',
    'Acessibilidade',
    'Validação',
  ]) {
    if (!text.includes(`## ${section}`)) throw new Error(`Missing ${section}: ${name}`);
  }
  for (const [, target] of text.matchAll(/\]\(([^)]+)\)/g)) {
    if (!target.startsWith('https:') && !existsSync(resolve(dirname(file), target.split('#')[0]))) {
      throw new Error(`Broken link ${target} in ${name}`);
    }
  }
  console.log(`PASS ${name}: minimal YAML schema, operational sections and local links`);
}
