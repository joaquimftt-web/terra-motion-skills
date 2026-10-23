import { ProgressFixture } from './fixture/progress-shared.mjs';
import { createElement as h } from 'react';
import { renderToString } from 'react-dom/server';
import { ScrollReveal } from '@motion-skills-lab/motion-recipes/scroll-reveal';
import { LayoutFixture } from './fixture/layout-shared.mjs';
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
// Identical initial tree to the CSR App. Generated files are ignored and never shipped.
const markup = renderToString(
  h(
    'div',
    null,
    h(
      ScrollReveal,
      { id: 'ssr-content' },
      h('h1', null, 'SSR legível'),
      h('p', null, 'HTML real antes da hidratação.'),
    ),
  ),
);
const out = fileURLToPath(new URL('../../../.validation/recipe-e2e/', import.meta.url));
mkdirSync(out, { recursive: true });
writeFileSync(
  join(out, 'layout-ssr.html'),
  `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>L3 SSR</title></head><body><div id="layout-root">${renderToString(h(LayoutFixture))}</div><script type="module" src="/layout.tsx"></script></body></html>`,
);
writeFileSync(
  join(out, 'ssr.html'),
  `<!doctype html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>SSR Scroll Reveal</title></head><body><main id="ssr-root">${markup}</main><script type="module" src="/ssr-client.tsx"></script></body></html>`,
);

writeFileSync(
  join(out, 'progress-ssr.html'),
  `<!doctype html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Progress SSR</title></head><body><div id="progress-ssr-root">${renderToString(h(ProgressFixture))}</div><script type="module" src="/progress-ssr-client.tsx"></script></body></html>`,
);
