import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const settled = (page: import('@playwright/test').Page) =>
  page
    .getByTestId('reflow')
    .evaluate((el) =>
      Array.from(el.children).every((li) =>
        ['none', 'matrix(1, 0, 0, 1, 0, 0)'].includes(getComputedStyle(li).transform),
      ),
    );

test('L3 layout: real position animation, stable DOM/input and focus interruption', async ({
  page,
}) => {
  await page.goto('/layout.html');
  await page.getByLabel('Nota a').fill('preserved');
  await page.getByLabel('Nota a').evaluate((el) => {
    Object.assign(window, { __savedInput: el });
  });
  await page.getByRole('button', { name: 'Reverse', exact: true }).click();
  await expect(page.getByTestId('reflow').locator('li').first()).toContainText('Nota c');
  await expect.poll(() => settled(page)).toBe(false);
  const matrices = await page
    .getByTestId('reflow')
    .locator('li')
    .evaluateAll((nodes) =>
      nodes.map((n) => new DOMMatrix(getComputedStyle(n).transform)).map((m) => [m.a, m.d]),
    );
  expect(matrices.every(([x, y]) => x === 1 && y === 1)).toBe(true);
  expect(
    await page
      .getByLabel('Nota a')
      .evaluate((el) => el === (window as unknown as { __savedInput: Element }).__savedInput),
  ).toBe(true);
  await page.getByLabel('Nota a').focus();
  await expect.poll(() => settled(page)).toBe(true);
  await expect(page.getByLabel('Nota a')).toBeFocused();
  await expect(page.getByLabel('Nota a')).toHaveValue('preserved');
  await page.waitForTimeout(900);
  expect(await settled(page)).toBe(true);
});

test('L3 layout: rapid intent, live duration, resize without intent and cleanup', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/layout.html');
  await page.getByRole('button', { name: 'Reverse', exact: true }).click();
  await expect.poll(() => settled(page)).toBe(false);
  await page.getByRole('button', { name: 'Duration', exact: true }).click();
  await expect.poll(() => settled(page)).toBe(true);
  for (let i = 0; i < 3; i++)
    await page.getByRole('button', { name: 'Reverse', exact: true }).click();
  expect(await settled(page)).toBe(true);
  await page.getByRole('button', { name: 'Items', exact: true }).click();
  await expect(page.getByTestId('reflow').locator('li')).toHaveCount(4);
  await page.setViewportSize({ width: 390, height: 900 });
  expect(await settled(page)).toBe(true);
  await page.getByRole('button', { name: 'Duration', exact: true }).click();
  await page.getByRole('button', { name: 'Reverse', exact: true }).click();
  await page.getByRole('button', { name: 'Mount', exact: true }).click();
  await expect(page.getByTestId('reflow')).toHaveCount(0);
  await page.getByRole('button', { name: 'Mount', exact: true }).click();
  await expect(page.getByTestId('reflow')).toBeVisible();
  expect(errors).toEqual([]);
});

test('L3 skeleton: inert initial placeholder, immediate real controls and focus-preserving reload', async ({
  page,
}) => {
  await page.goto('/layout.html');
  const falseControl = page.locator('button').filter({ hasText: 'False control' });
  await falseControl.evaluate((el) => {
    if (!(el instanceof HTMLElement)) throw new Error('Expected HTML control');
    el.focus();
  });
  expect(await falseControl.evaluate((el) => document.activeElement === el)).toBe(false);
  await expect(page.getByTestId('skeleton')).toHaveAttribute('aria-busy', 'true');
  await page.getByRole('button', { name: 'Loading', exact: true }).click();
  const input = page.getByLabel('Loaded input');
  await expect(input).toBeVisible();
  await expect(input).toBeEnabled();
  await input.fill('kept');
  await page.getByRole('button', { name: 'Loading', exact: true }).evaluate((el) => {
    if (!(el instanceof HTMLElement)) throw new Error('Expected HTML control');
    el.click();
  });
  await expect(input).toBeFocused();
  await expect(input).toHaveValue('kept');
  await expect(page.getByTestId('skeleton')).toHaveAttribute('aria-busy', 'true');
  await expect(falseControl).toHaveCount(0);
  await page.getByRole('button', { name: 'Loading', exact: true }).evaluate((el) => {
    if (!(el instanceof HTMLElement)) throw new Error('Expected HTML control');
    el.click();
  });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect
    .poll(() =>
      page.getByTestId('skeleton').evaluate((el) => el.getAnimations({ subtree: true }).length),
    )
    .toBe(0);
  await expect(input).toHaveValue('kept');
});

test('L3 value: immediate exact data, no rerender feedback, reduced information retained', async ({
  page,
}) => {
  await page.goto('/layout.html');
  const value = page.getByTestId('value');
  await expect(value).toContainText('R$ 1.234,56');
  await expect(value).not.toContainText('Valor atualizado');
  await page.getByRole('button', { name: 'Rerender', exact: true }).click();
  await expect(value).not.toContainText('Valor atualizado');
  await page.getByRole('button', { name: 'Value', exact: true }).click();
  await expect(value).toContainText('R$ 9.876,54');
  await expect(value).not.toContainText('R$ 1.234,56');
  await expect(value).toContainText('Valor atualizado');
  await expect
    .poll(() => value.evaluate((el) => el.getAnimations({ subtree: true }).length))
    .toBeGreaterThan(0);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect
    .poll(() => value.evaluate((el) => el.getAnimations({ subtree: true }).length))
    .toBe(0);
  await expect(value).toContainText('Valor atualizado');
  await expect(value.locator('[aria-live]')).toHaveCount(0);
  for (let i = 0; i < 3; i++)
    await page.getByRole('button', { name: 'Value', exact: true }).click();
  await expect(value).toContainText('R$ 1.234,56');
});

test('L3 real SSR hydration stays clean after operations', async ({ page }) => {
  await page.goto('/layout-ssr.html');
  await expect
    .poll(() =>
      page.evaluate(() => (window as unknown as { __l3: { hydrated: boolean } }).__l3.hydrated),
    )
    .toBe(true);
  await page.getByRole('button', { name: 'Reverse', exact: true }).click();
  await page.getByRole('button', { name: 'Loading', exact: true }).click();
  await page.getByRole('button', { name: 'Value', exact: true }).click();
  await expect(page.getByLabel('Loaded input')).toBeVisible();
  expect(
    await page.evaluate(() => (window as unknown as { __l3: { errors: string[] } }).__l3.errors),
  ).toEqual([]);
});

test('L3 negative SSR control detects a genuine React recoverable mismatch', async ({ page }) => {
  await page.goto('/layout-ssr.html?mismatch=1');
  await expect
    .poll(() =>
      page.evaluate(() =>
        (window as unknown as { __l3: { errors: string[] } }).__l3.errors.join('\n'),
      ),
    )
    .toMatch(/hydration|hydrated/i);
  await expect(page.getByRole('heading', { name: 'Layout independente L3' })).toBeVisible();
});

test('L3 server HTML remains readable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/layout-ssr.html');
  await expect(page.getByRole('heading', { name: 'Layout independente L3' })).toBeVisible();
  await expect(page.getByLabel('Nota a')).toBeVisible();
  await expect(page.getByTestId('value')).toContainText('R$ 1.234,56');
  await expect(page.getByTestId('skeleton')).toHaveAttribute('aria-busy', 'true');
  await context.close();
});

for (const width of [1440, 1024, 390, 320])
  test(`L3 independent responsive keyboard and axe at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/layout.html');
    await page.getByRole('button', { name: 'Reverse', exact: true }).focus();
    await page.keyboard.press('Enter');
    await page.getByRole('button', { name: 'Loading', exact: true }).click();
    await page.getByLabel('Loaded input').fill('Keyboard');
    await page.keyboard.press('Tab');
    await page.getByRole('button', { name: 'Value', exact: true }).click();
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.getByRole('button', { name: 'Reverse', exact: true }).click();
    expect(await settled(page)).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    const audit = await new AxeBuilder({ page }).analyze();
    expect(audit.violations).toEqual([]);
  });
