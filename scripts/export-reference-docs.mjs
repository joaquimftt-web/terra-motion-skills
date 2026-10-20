import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const destination = resolve(root, 'apps/showcase/public/reference');
mkdirSync(destination, { recursive: true });
const sources = {
  'motion-foundations.md': 'skills/motion-foundations/SKILL.md',
  'microinteraction-design.md': 'skills/microinteraction-design/SKILL.md',
  'motion-contract.md': 'docs/MOTION_CONTRACT.md',
  'references-and-licenses.md': 'docs/REFERENCES_AND_LICENSES.md',
  'button-feedback.tsx': 'packages/motion-recipes/src/button-feedback/ButtonFeedback.tsx',
  'accordion-transition.tsx':
    'packages/motion-recipes/src/accordion-transition/AccordionTransition.tsx',
};
for (const [name, source] of Object.entries(sources))
  copyFileSync(resolve(root, source), resolve(destination, name));
console.log('Reference documents exported as static text assets; no skill runtime imports.');
