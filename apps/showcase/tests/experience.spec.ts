import { expect, test } from '@playwright/test';

test('Shared theme preserves the accepted P1 muted text value', async ({ page }) => {
  await page.goto(process.env.SHOWCASE_BASE_PATH ?? '/');
  expect(
    await page
      .locator('.prototype-shell')
      .evaluate((node) => getComputedStyle(node).getPropertyValue('--lp-muted').trim()),
  ).toBe('#c5c4b6');
});

test('Local preview label fits on one line at 320px without shifting P1', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto(process.env.SHOWCASE_BASE_PATH ?? '/');
  const height = await page
    .locator('.lp-preview')
    .evaluate((node) => node.getBoundingClientRect().height);
  expect(height).toBeLessThan(40);
});

test('Closing accent stays outside the content grid and completes on native scroll', async ({
  page,
}) => {
  await page.goto(process.env.SHOWCASE_BASE_PATH ?? '/');
  const light = page.locator('.lp-closing-light');
  await expect(light).toHaveCSS('position', 'absolute');
  expect(await light.evaluate((node) => getComputedStyle(node).backgroundImage)).not.toBe('none');
  await page.waitForTimeout(1300);
  for (let i = 0; i < 70; i++) {
    await page.mouse.wheel(0, 90);
    await page.waitForTimeout(45);
  }
  await expect(light).toHaveAttribute('data-narrative-state', 'static');
  await expect(light).toHaveAttribute('data-narrative-reason', 'complete');
  await expect(light).toHaveCSS('opacity', '0');
});

test('Mineral técnico keeps demo instances, values and focus across responsive layout changes', async ({
  page,
}) => {
  await page.goto('./');
  const button = page.getByRole('button', { name: 'Confirmar interação' });
  await button.click();
  await expect(page.locator('.activation-output')).toContainText('1 ativação');
  await page.locator('#accordion-duration').fill('220');
  const trigger = page.locator('#demo-accordion-trigger');
  await trigger.click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await page.evaluate(() => {
    const element = document.querySelector('#demo-accordion-trigger');
    Object.defineProperty(window, '__labOriginalTrigger', { value: element, configurable: true });
  });
  await trigger.focus();
  for (const width of [1024, 390, 320, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await expect(trigger).toBeFocused();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('#accordion-duration')).toHaveValue('220');
    await expect(page.locator('.activation-output')).toContainText('1 ativação');
    expect(
      await page.evaluate(
        () =>
          document.querySelector('#demo-accordion-trigger') ===
          Reflect.get(window, '__labOriginalTrigger'),
      ),
    ).toBe(true);
  }
  await page.getByRole('button', { name: 'Reiniciar exemplo' }).click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#accordion-duration')).toHaveValue('220');
  expect(
    await page.evaluate(
      () =>
        document.querySelector('#demo-accordion-trigger') !==
        Reflect.get(window, '__labOriginalTrigger'),
    ),
  ).toBe(true);
});
