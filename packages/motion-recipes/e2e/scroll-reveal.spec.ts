import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { writeFile } from 'node:fs/promises';
import type { Page } from '@playwright/test';

async function activeReplay(page: Page) {
  await page.getByRole('button', { name: 'Replay', exact: true }).click();
  await expect
    .poll(() =>
      page
        .getByTestId('target')
        .evaluate((element) =>
          element
            .firstElementChild!.getAnimations()
            .some((animation) => animation.playState === 'running'),
        ),
    )
    .toBe(true);
}

test('prepared entry, continuous rapid replay and retained child state', async ({ page }, info) => {
  await page.goto('/');
  const root = page.getByTestId('target');
  const target = root.locator(':scope > div');
  await expect(target).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 8)');
  await expect(page.getByTestId('initial').locator(':scope > div')).toHaveCSS('transform', 'none');
  await page.screenshot({ path: info.outputPath('prepared.png'), fullPage: true });
  await root.evaluate((element) => window.scrollBy(0, element.getBoundingClientRect().top - 250));
  await expect(target).toHaveCSS('transform', 'none');
  await page.getByRole('textbox').fill('Estado preservado');
  await page.getByRole('button', { name: 'Duration', exact: true }).click();
  await activeReplay(page);
  await page.getByRole('button', { name: 'Replay', exact: true }).click();
  await expect(target).toHaveCSS('transform', 'none');
  await expect(page.getByRole('textbox')).toHaveValue('Estado preservado');
  await expect(target).toHaveCSS('opacity', '1');
  await page.screenshot({ path: info.outputPath('settled.png') });
});

test('focus, pointer, live reduced motion, props and unmount cancel without residual animation', async ({
  page,
}) => {
  await page.goto('/');
  const root = page.getByTestId('target');
  const target = root.locator(':scope > div');
  await root.evaluate((element) => window.scrollBy(0, element.getBoundingClientRect().top - 250));
  await page.getByRole('button', { name: 'Duration', exact: true }).click();
  await activeReplay(page);
  await page.getByRole('textbox').focus();
  await expect(target).toHaveCSS('transform', 'none');
  await expect(root).toHaveAttribute('data-focus-transform', 'none');
  await activeReplay(page);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(target).toHaveCSS('transform', 'none');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(target).toHaveCSS('transform', 'none');
  await activeReplay(page);
  await page.getByRole('textbox').click();
  await expect(target).toHaveCSS('transform', 'none');
  await expect(root).toHaveAttribute('data-pointer-transform', 'none');
  await activeReplay(page);
  await page.getByRole('button', { name: 'Duration', exact: true }).click();
  await expect(target).toHaveCSS('transform', 'none');
  await activeReplay(page);
  await page.getByRole('button', { name: 'Mount', exact: true }).click();
  await expect(root).toHaveCount(0);
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
});

test('late initialization and missing observer keep visible HTML static', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'IntersectionObserver', { value: undefined });
  });
  await page.goto('/');
  const target = page.getByTestId('target').locator(':scope > div');
  await expect(target).toHaveCSS('transform', 'none');
  await page.getByTestId('target').evaluate((element) => element.scrollIntoView());
  await expect(target).toHaveCSS('transform', 'none');
});

test('native hidden changes during playback leave no residual animation or page error', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  const root = page.getByTestId('target');
  const target = root.locator(':scope > div');
  await root.evaluate((element) => window.scrollBy(0, element.getBoundingClientRect().top - 250));
  await page.getByRole('button', { name: 'Duration', exact: true }).click();
  await activeReplay(page);
  await root.evaluate((element) => {
    element.setAttribute('hidden', '');
  });
  await expect.poll(() => target.evaluate((element) => element.style.transform)).toBe('');
  await root.evaluate((element) => {
    element.removeAttribute('hidden');
  });
  await expect(target).toHaveCSS('transform', 'none');
  expect(await target.evaluate((element) => element.getAnimations().length)).toBe(0);
  expect(errors).toEqual([]);
});

test('real SSR hydration has no mismatch and static visible content', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.goto('/ssr.html');
  await expect(page.getByRole('heading', { name: 'SSR legível' })).toBeVisible();
  await expect(page.locator('#ssr-content > div')).toHaveCSS('transform', 'none');
  expect(errors).toEqual([]);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

for (const width of [1440, 1024, 390, 320])
  test(`responsive, keyboard and axe ${width}`, async ({ page }, info) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await page
      .getByTestId('target')
      .evaluate((element) => window.scrollBy(0, element.getBoundingClientRect().top - 250));
    await page.getByRole('textbox').focus();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Continuar leitura' })).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await page.screenshot({ path: info.outputPath(`viewport-${width}.png`) });
  });

test('entry filmstrip samples have no late offset jump; replay converges continuously', async ({
  page,
}, info) => {
  await page.goto('/');
  const root = page.getByTestId('target');
  await expect(root.locator(':scope > div')).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 8)');
  const entry = await root.evaluate(async (element) => {
    const target = element.firstElementChild!;
    const frames: { time: number; y: number; opacity: string }[] = [];
    const start = performance.now();
    window.scrollBy(0, element.getBoundingClientRect().top - 250);
    for (let i = 0; i < 40; i++) {
      await new Promise(requestAnimationFrame);
      const css = getComputedStyle(target);
      frames.push({
        time: performance.now() - start,
        y: css.transform === 'none' ? 0 : new DOMMatrixReadOnly(css.transform).m42,
        opacity: css.opacity,
      });
    }
    return frames;
  });
  expect(entry.some((frame) => frame.y > 0 && frame.y < 8)).toBe(true);
  expect(entry.every((frame) => frame.y >= -0.01 && frame.y <= 8.01 && frame.opacity === '1')).toBe(
    true,
  );
  for (let i = 1; i < entry.length; i++)
    expect(entry[i]!.y).toBeLessThanOrEqual(entry[i - 1]!.y + 0.05);
  expect(entry.at(-1)!.y).toBe(0);
  await page.getByRole('button', { name: 'Replay', exact: true }).click();
  const replay = await root.evaluate(async (element) => {
    const frames: number[] = [];
    for (let i = 0; i < 30; i++) {
      await new Promise(requestAnimationFrame);
      const css = getComputedStyle(element.firstElementChild!);
      frames.push(css.transform === 'none' ? 0 : new DOMMatrixReadOnly(css.transform).m42);
    }
    return frames;
  });
  expect(replay.some((y) => y > 0 && y < 8)).toBe(true);
  expect(replay.at(-1)).toBe(0);
  await writeFile(info.outputPath('trajectories.json'), JSON.stringify({ entry, replay }, null, 2));
});

test('visible-at-mount and uncertain clipping remain static', async ({ page }) => {
  for (const mode of ['near', 'clipped', 'pseudo']) {
    await page.goto(`/?${mode}`);
    await expect(page.getByTestId('target').locator(':scope > div')).toHaveCSS('transform', 'none');
    await page.getByTestId('target').evaluate((element) => element.scrollIntoView());
    await expect(page.getByTestId('target').locator(':scope > div')).toHaveCSS('transform', 'none');
  }
});

test('animation failure falls back without a residual prepared transform', async ({ page }) => {
  await page.addInitScript(() => {
    Element.prototype.animate = () => {
      throw new Error('Intentional animation failure');
    };
  });
  await page.goto('/');
  const root = page.getByTestId('target');
  await expect(root.locator(':scope > div')).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 8)');
  await root.evaluate((element) => window.scrollBy(0, element.getBoundingClientRect().top - 250));
  await expect(root.locator(':scope > div')).toHaveCSS('transform', 'none');
});

test('touch interaction ends presentation and permits later explicit replay', async ({
  browser,
}) => {
  const context = await browser.newContext({
    hasTouch: true,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4175/');
  const root = page.getByTestId('target');
  await root.evaluate((element) => window.scrollBy(0, element.getBoundingClientRect().top - 250));
  await page.getByRole('button', { name: 'Duration', exact: true }).tap();
  await page.getByRole('button', { name: 'Replay', exact: true }).tap();
  await root.getByRole('heading').tap();
  await expect(root.locator(':scope > div')).toHaveCSS('transform', 'none');
  await page.getByRole('button', { name: 'Replay', exact: true }).tap();
  await expect(root.locator(':scope > div')).toHaveCSS('transform', 'none');
  await context.close();
});

test('server HTML is complete with JavaScript disabled', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4175/ssr.html');
  await expect(page.getByRole('heading', { name: 'SSR legível' })).toBeVisible();
  await expect(page.locator('#ssr-content > div')).toHaveCSS('transform', 'none');
  await context.close();
});

test('real reverse scroll rearms only below viewport, and fast entry does not reset the offset', async ({
  page,
}) => {
  await page.goto('/');
  const root = page.getByTestId('target');
  const target = root.locator(':scope > div');
  await expect(target).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 8)');
  const enterBy = await root.evaluate((element) => element.getBoundingClientRect().top - 200);
  await page.mouse.wheel(0, enterBy);
  await expect(target).toHaveCSS('transform', 'none');
  await page.mouse.wheel(0, 1400);
  await expect
    .poll(() => root.evaluate((element) => element.getBoundingClientRect().bottom))
    .toBeLessThan(0);
  await expect(target).toHaveCSS('transform', 'none');
  await page.mouse.wheel(0, -10000);
  await expect(target).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 8)');
  await page.mouse.wheel(0, enterBy);
  await expect(target).toHaveCSS('transform', 'none');
});
