import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
const base = process.env.SHOWCASE_BASE_PATH ?? '/';

test('optimized material is lossless WebP with the exact original decoded pixels', async ({
  page,
}) => {
  await page.goto(base);
  const background = await page
    .locator('.lp-material-base')
    .evaluate((node) => getComputedStyle(node).backgroundImage);
  expect(background).toContain('.webp');
  const url = /url\("?([^")]+)/.exec(background)![1]!;
  const original = readFileSync(
    'apps/showcase/src/prototype/assets/terra-material-reference.png',
  ).toString('base64');
  const comparison = await page.evaluate(
    async ({ url, original }) => {
      async function pixels(src: string) {
        const image = new Image();
        image.src = src;
        await image.decode();
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(image, 0, 0);
        return {
          width: image.width,
          height: image.height,
          pixels: ctx.getImageData(0, 0, image.width, image.height).data,
        };
      }
      const [a, b] = await Promise.all([pixels(url), pixels('data:image/png;base64,' + original)]);
      return {
        width: a.width,
        height: a.height,
        equal:
          a.width === b.width &&
          a.height === b.height &&
          a.pixels.every((value, index) => value === b.pixels[index]),
      };
    },
    { url, original },
  );
  expect(comparison).toEqual({ width: 1672, height: 941, equal: true });
});
for (const [route, heading] of [
  ['', 'Movimento.'],
  ['lab/', 'Experimente o gesto.'],
  ['referencias/', 'O que sustenta'],
]) {
  test(`direct navigation and refresh retain ${route || 'landing'} route`, async ({ page }) => {
    const failures: string[] = [];
    page.on('pageerror', (error) => failures.push(error.message));
    page.on('response', (response) => {
      if (response.status() >= 400) failures.push(response.url());
    });
    const response = await page.goto(base + route);
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toContainText(heading!);
    await page.reload();
    await expect(page.locator('h1')).toContainText(heading!);
    expect(new URL(page.url()).pathname).toBe(base + route);
    expect(failures).toEqual([]);
  });
}
test('all legal notices and exported references are real resources, not SPA fallbacks', async ({
  page,
  request,
}) => {
  await page.goto(base + 'referencias/');
  const links = await page
    .locator('a[href*="/reference/"]')
    .evaluateAll((nodes) => nodes.map((node) => (node as HTMLAnchorElement).pathname));
  expect(links).toHaveLength(18);
  for (const file of [
    'scroll-reveal.tsx',
    'staggered-entrance.tsx',
    'scroll-progress.tsx',
    'scroll-motion.md',
    'layout-transitions.md',
    'expandable-cards.tsx',
    'layout-reflow.tsx',
    'skeleton-to-content.tsx',
    'data-change-feedback.tsx',
  ])
    expect(links).toContain(base + 'reference/' + file);
  for (const path of [
    ...links,
    base + 'LICENSE',
    base + 'THIRD_PARTY_NOTICES.md',
    base + 'ASSET_NOTICES.md',
  ]) {
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    const text = await response.text();
    expect(text.length).toBeGreaterThan(100);
    expect(text.toLowerCase()).not.toContain('<!doctype html>');
  }
});
test('legacy recipe anchor redirects to the lab and retains the target', async ({ page }) => {
  await page.goto(base + '#accordion-transition');
  await expect(page).toHaveURL(new RegExp('/lab/#accordion-transition$'));
  await expect(page.locator('#accordion-title')).toBeVisible();
});
test('reference provenance distinguishes raster support from original interface graphics', async ({
  page,
}) => {
  await page.goto(base + 'referencias/');
  const section = page.locator('.lp-inspirations');
  await expect(section).toContainText('imagem raster fornecida pelo usuário');
  await expect(section).toContainText('não é uma geometria SVG procedural');
  await expect(section).toContainText('não herdam a licença MIT');
  await expect(section).toContainText('Uso público neste projeto autorizado pelo titular');
  await expect(section).toContainText('sem licença geral de reutilização');
  await expect(section).not.toContainText('foi desenhada em SVG original');
});
