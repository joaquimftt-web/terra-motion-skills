import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, posix, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const destination = resolve(root, 'apps/showcase/public/reference');
mkdirSync(destination, { recursive: true });
const revision = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root }).toString().trim();
const repository = `https://github.com/joaquimftt-web/terra-motion-skills/blob/${revision}/`;
const sources = {
  'motion-foundations.md': 'skills/motion-foundations/SKILL.md',
  'microinteraction-design.md': 'skills/microinteraction-design/SKILL.md',
  'motion-contract.md': 'docs/MOTION_CONTRACT.md',
  'references-and-licenses.md': 'docs/REFERENCES_AND_LICENSES.md',
  'button-feedback.tsx': 'packages/motion-recipes/src/button-feedback/ButtonFeedback.tsx',
  'accordion-transition.tsx':
    'packages/motion-recipes/src/accordion-transition/AccordionTransition.tsx',
};
for (const [name, source] of Object.entries(sources)) {
  if (name.endsWith('.md')) {
    // Transform links only in generated copies. Original skills/docs remain untouched.
    const text = readFileSync(resolve(root, source), 'utf8').replace(
      /\]\(([^)]+)\)/g,
      (match, target) => {
        if (/^(?:https?:|mailto:|#)/.test(target)) return match;
        const relative = posix.normalize(posix.join(posix.dirname(source), target));
        if (relative.startsWith('../')) throw new Error(`Reference escapes repository: ${target}`);
        return `](${repository}${relative})`;
      },
    );
    writeFileSync(resolve(destination, name), text);
  } else {
    copyFileSync(resolve(root, source), resolve(destination, name));
  }
}
for (const name of ['LICENSE', 'THIRD_PARTY_NOTICES.md']) {
  copyFileSync(resolve(root, name), resolve(destination, '..', name));
}
console.log(`Reference documents and license notices exported; source revision ${revision}.`);
