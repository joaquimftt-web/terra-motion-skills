import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const runtimeErrors = new WeakMap<Page, string[]>();
test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  runtimeErrors.set(page, errors);
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.goto('/');
});

test.afterEach(async ({ page }) => {
  expect(runtimeErrors.get(page)).toEqual([]);
});

test('catalog links navigate and every local reference resolves', async ({ page, request }) => {
  await page.getByRole('link', { name: /01.*Button Feedback/ }).click();
  await expect(page).toHaveURL(/#button-feedback$/);
  await page.getByRole('link', { name: /02.*Accordion Transition/ }).click();
  await expect(page).toHaveURL(/#accordion-transition$/);
  const links = await page
    .locator('a[href^="/reference/"]')
    .evaluateAll((elements) => [...new Set(elements.map((el) => el.getAttribute('href')!))]);
  expect(links.length).toBe(6);
  for (const href of links) {
    const response = await request.get(href);
    expect(response.ok(), href).toBe(true);
    expect((await response.text()).length).toBeGreaterThan(100);
  }
});

test('button keyboard, focus, press and disabled state are real', async ({ page }) => {
  const button = page.getByRole('button', { name: 'Confirmar interação' });
  await button.focus();
  await page.keyboard.press('Space');
  await page.keyboard.press('Enter');
  await expect(page.getByText('2 ativações nesta sessão')).toBeVisible();
  await expect(button).toHaveCSS('outline-style', 'solid');
  await expect(button).toHaveCSS('transform', 'none');
  await page.keyboard.press('Tab');
  await expect(page.getByLabel('Desabilitar botão')).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(button).toBeFocused();
  await button.hover();
  await page.mouse.down();
  await expect(button).toHaveCSS('background-color', 'rgb(20, 44, 30)');
  await page.mouse.up();
  await page.getByLabel('Desabilitar botão').check();
  await expect(button).toBeDisabled();
  const previous = await page.locator('.activation-output').textContent();
  await button.dispatchEvent('pointerdown');
  await expect(page.locator('.activation-output')).toHaveText(previous!);
});

test('accordion keyboard excludes closed content from tab order', async ({ page }) => {
  const trigger = page.getByRole('button', { name: 'O que torna uma transição útil?' });
  const panel = page.locator('#demo-accordion-panel');
  await trigger.focus();
  await page.keyboard.press('Space');
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(panel).toHaveAttribute('inert', '');
  await expect(panel).toHaveAttribute('aria-hidden', 'true');
  await page.keyboard.press('Tab');
  await expect(page.getByLabel('Duração do Accordion')).toBeFocused();
  await trigger.focus();
  await page.keyboard.press('Enter');
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect(panel).not.toHaveAttribute('inert');
  await expect(panel).toHaveCSS('height', /^[1-9]/);
  await page.keyboard.press('Tab');
  await expect(panel.getByRole('link')).toBeFocused();
  await page.getByRole('button', { name: '↻ Repetir transição' }).dispatchEvent('click');
  await expect(trigger).toBeFocused();
  await expect(page.locator('.replay-status')).toHaveText('Repetições: 1');
});

test('duration, reversal, replay and remount use live state with cancellation', async ({
  page,
}) => {
  const trigger = page.getByRole('button', { name: 'O que torna uma transição útil?' });
  await page.getByLabel('Duração do Accordion').fill('220');
  await expect(page.locator('.duration-control output')).toHaveText('220 ms');
  await expect(page.locator('#accordion-transition code')).toContainText('duration={220}');
  for (let i = 0; i < 7; i++) await trigger.click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await page.getByRole('button', { name: '↻ Repetir transição' }).click();
  await expect(page.locator('.replay-status')).toHaveText('Repetições: 1');
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await page.getByRole('button', { name: '↻ Repetir transição' }).click();
  for (let i = 1; i <= 3; i++) {
    await page.getByRole('button', { name: 'Reiniciar exemplo' }).click();
    await expect(page.locator('.accordion-stage')).toHaveAttribute('data-instance', String(i));
  }
  // Wait beyond the maximum scheduled replay deadline to detect an orphan callback after reset.
  await page.waitForTimeout(350);
  await expect(page.locator('.replay-status')).toHaveText('Repetições: 0');
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
});

test('live OS preference wins over the demo reduction control', async ({ page }) => {
  const panel = page.locator('#demo-accordion-panel');
  const button = page.getByRole('button', { name: 'Confirmar interação' });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(panel).toHaveAttribute('data-reduce-motion', 'false');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(panel).toHaveAttribute('data-reduce-motion', 'true');
  await expect(button).toHaveCSS('transition-duration', '0s');
  await page.getByLabel('Reduzir movimento nas demonstrações').check();
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(panel).toHaveAttribute('data-reduce-motion', 'true');
  await page.getByLabel('Reduzir movimento nas demonstrações').uncheck();
  await expect(panel).toHaveAttribute('data-reduce-motion', 'false');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(panel).toHaveAttribute('data-reduce-motion', 'true');
  await page.getByRole('button', { name: 'O que torna uma transição útil?' }).click();
  await expect(panel).toHaveCSS('height', '0px');
});

test('clipboard success copies the exact displayed snippet', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  const example = page.locator('#button-feedback .code-example');
  const code = await example.locator('code').textContent();
  await example.getByRole('button').click();
  await expect(example.getByRole('status')).toHaveText('Código copiado.');
  // Windows normalizes clipboard line endings to CRLF; content must otherwise match exactly.
  expect((await page.evaluate(() => navigator.clipboard.readText())).replace(/\r\n/g, '\n')).toBe(
    code,
  );
});

test('clipboard failure reports a manual alternative without false success', async ({ page }) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: () => Promise.reject(new Error('Denied')) },
    }),
  );
  await page.reload();
  const example = page.locator('#button-feedback .code-example');
  await example.getByRole('button').click();
  await expect(example.getByRole('status')).toHaveText(
    'Selecione o código para copiar manualmente.',
  );
  await expect(example.locator('pre')).toHaveCSS('user-select', 'auto');
});

for (const width of [1440, 1024, 390, 320]) {
  test(`responsive layout and axe audit at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await page.getByRole('button', { name: 'O que torna uma transição útil?' }).click();
    const closed = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(closed.violations).toEqual([]);
    await page.getByRole('button', { name: 'O que torna uma transição útil?' }).click();
    const open = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(open.violations).toEqual([]);
  });
}

test.describe('touch emulation', () => {
  test.use({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } });
  test('activates Button and Accordion without hover', async ({ page }) => {
    const button = page.getByRole('button', { name: 'Confirmar interação' });
    await button.tap();
    await expect(page.getByText('1 ativação nesta sessão')).toBeVisible();
    await expect(button).toHaveCSS('transform', 'none');
    await page.getByLabel('Desabilitar botão').check();
    await expect(button).toBeDisabled();
    const trigger = page.getByRole('button', { name: 'O que torna uma transição útil?' });
    await trigger.tap();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await trigger.tap();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });
});

test.describe('initial OS reduction', () => {
  test.use({ reducedMotion: 'reduce' });
  test('starts conservative without requiring a demo override', async ({ page }) => {
    await expect(page.getByLabel('Reduzir movimento nas demonstrações')).not.toBeChecked();
    await expect(page.locator('#demo-accordion-panel')).toHaveAttribute(
      'data-reduce-motion',
      'true',
    );
    await expect(page.getByRole('button', { name: 'Confirmar interação' })).toHaveCSS(
      'transition-duration',
      '0s',
    );
  });
});
