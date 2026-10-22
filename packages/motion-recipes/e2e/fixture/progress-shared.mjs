import { createElement as h } from 'react';
import { ScrollProgress } from '@motion-skills-lab/motion-recipes/scroll-progress';
// Stable SSR geometry gives the browser a real range before native restoration.
export function ProgressFixture() {
  return h(
    'main',
    { style: { minHeight: '400vh' } },
    h('h1', null, 'Posição com SSR e restauração nativa'),
    h(ScrollProgress, { 'data-testid': 'doc' }),
    h('p', null, 'Conteúdo integral antes do JavaScript; a recipe não altera scrollRestoration.'),
  );
}
