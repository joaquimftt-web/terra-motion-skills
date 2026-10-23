import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { resolve, join } from 'node:path';
import { execFileSync } from 'node:child_process';

// An output-only local consumer: no showcase, source aliases or package source files.
const scratch = resolve('.validation');
mkdirSync(scratch, { recursive: true });
const fixture = mkdtempSync(join(scratch, 'consumer-'));
const modules = join(fixture, 'node_modules');
mkdirSync(join(modules, '@motion-skills-lab'), { recursive: true });
for (const name of ['motion-tokens', 'motion-recipes']) {
  const destination = join(modules, '@motion-skills-lab', name);
  mkdirSync(destination, { recursive: true });
  cpSync(resolve('packages', name, 'package.json'), join(destination, 'package.json'));
  cpSync(resolve('packages', name, 'dist'), join(destination, 'dist'), { recursive: true });
}
for (const name of ['react', 'react-dom', 'motion']) {
  symlinkSync(
    realpathSync(resolve('packages/motion-recipes/node_modules', name)),
    join(modules, name),
    'junction',
  );
}
mkdirSync(join(modules, '@types'), { recursive: true });
for (const name of ['react', 'react-dom']) {
  symlinkSync(
    realpathSync(resolve('node_modules/@types', name)),
    join(modules, '@types', name),
    'junction',
  );
}
writeFileSync(join(fixture, 'package.json'), JSON.stringify({ type: 'module', private: true }));
writeFileSync(
  join(fixture, 'runtime.mjs'),
  `
import { strict as assert } from 'node:assert';
import { existsSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ButtonFeedback } from '@motion-skills-lab/motion-recipes/button-feedback';
import { AccordionTransition } from '@motion-skills-lab/motion-recipes/accordion-transition';
import { motionTokens } from '@motion-skills-lab/motion-tokens';
import {LayoutReflow} from '@motion-skills-lab/motion-recipes/layout-reflow';
import {SkeletonToContent} from '@motion-skills-lab/motion-recipes/skeleton-to-content';
import {DataChangeFeedback} from '@motion-skills-lab/motion-recipes/data-change-feedback';
assert.ok(renderToStaticMarkup(createElement(LayoutReflow,{items:[{id:'a',content:'Stable'}],reflowKey:0})).includes('Stable'));
assert.ok(renderToStaticMarkup(createElement(SkeletonToContent,{loading:false,skeleton:'Loading'},'Real')).includes('Real'));
assert.ok(renderToStaticMarkup(createElement(DataChangeFeedback,{value:'R$ 1.234,56'})).includes('R$ 1.234,56'));
assert.equal(motionTokens.duration.accordionTransition, 180);
assert.ok(renderToStaticMarkup(createElement(ButtonFeedback,{type:'button'},'Real')).includes('Real'));
assert.ok(renderToStaticMarkup(createElement(AccordionTransition,{open:true,onOpenChange:()=>{},trigger:'Details'},'Content')).includes('Content'));
for (const path of ['button-feedback.css','accordion-transition.css']) assert.ok(existsSync(new URL(import.meta.resolve('@motion-skills-lab/motion-recipes/'+path))));
console.log('PASS output-only consumer: public ESM exports, SSR and CSS resolution');
`,
);
cpSync(resolve('scripts/fixtures/l2-consumer-types.tsx'), join(fixture, 'l2-consumer-types.tsx'));
cpSync(resolve('scripts/fixtures/l3-consumer-types.tsx'), join(fixture, 'l3-consumer-types.tsx'));
for (const name of [
  'motion-foundations',
  'microinteraction-design',
  'scroll-motion',
  'layout-transitions',
]) {
  const skill = readFileSync(resolve('skills', name, 'SKILL.md'), 'utf8');
  const examples = [...skill.matchAll(/```tsx\r?\n([\s\S]*?)```/g)];
  if (!examples.length) throw new Error(`No TSX example: ${name}`);
  examples.forEach((match, index) =>
    writeFileSync(join(fixture, `${name}-${index}.tsx`), match[1]),
  );
}
writeFileSync(
  join(fixture, 'tsconfig.json'),
  JSON.stringify({
    compilerOptions: {
      target: 'ES2022',
      module: 'NodeNext',
      moduleResolution: 'NodeNext',
      jsx: 'react-jsx',
      strict: true,
      noEmit: true,
      skipLibCheck: true,
      types: ['react', 'react-dom'],
      lib: ['ES2022', 'DOM'],
    },
    include: ['*.tsx'],
  }),
);
execFileSync(process.execPath, [join(fixture, 'runtime.mjs')], { stdio: 'inherit' });
execFileSync(
  process.execPath,
  [resolve('node_modules/typescript/lib/tsc.js'), '-p', join(fixture, 'tsconfig.json')],
  { stdio: 'inherit' },
);
console.log('PASS four skill examples: strict TypeScript against copied public declarations');
execFileSync(process.execPath, [resolve('scripts/check-l1-hydration-audit.mjs')], {
  stdio: 'inherit',
});
