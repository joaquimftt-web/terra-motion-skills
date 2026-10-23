// @vitest-environment node
import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('public state recipe consumption', () => {
  it('installs the browser before the independent hydration gate in a clean runner', () => {
    const workflow = readFileSync('.github/workflows/pages.yml', 'utf8');
    expect(workflow.indexOf('pnpm exec playwright install --with-deps chromium')).toBeLessThan(
      workflow.indexOf('pnpm check:consumer'),
    );
  });
  for (const name of ['presence-transition', 'async-state-feedback', 'navigation-indicator']) {
    it(`resolves the independent ${name} ESM and CSS subpaths`, async () => {
      const module = await import(`@motion-skills-lab/motion-recipes/${name}`);
      expect(Object.values(module).some((value) => typeof value === 'object')).toBe(true);
      expect(
        existsSync(new URL(import.meta.resolve(`@motion-skills-lab/motion-recipes/${name}.css`))),
      ).toBe(true);
    });
  }
});

for (const name of [
  'scroll-reveal',
  'staggered-entrance',
  'scroll-progress',
  'layout-reflow',
  'skeleton-to-content',
  'data-change-feedback',
]) {
  it(`resolves the independent ${name} ESM subpath without required CSS`, async () => {
    const module = await import(`@motion-skills-lab/motion-recipes/${name}`);
    expect(Object.values(module).some((value) => typeof value === 'function')).toBe(true);
  });
}
