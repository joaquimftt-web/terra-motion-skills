import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const width of [1440, 1024, 390, 320]) {
  test(`M13 lab public controls and composition ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('');
    const section = page.locator('#expandable-cards');
    await section.scrollIntoViewIfNeeded();
    const cards = section.getByRole('list', { name: 'Cards expansíveis' });
    const slider = section.getByLabel('Duração de Expandable Cards', { exact: true });
    await expect(slider).toHaveValue('280');
    for (const value of ['0', '800', '280']) {
      await slider.fill(value);
      await expect(section.locator('pre code')).toContainText(`duration={${value}}`);
      await section.getByRole('button', { name: 'Selecionar B', exact: true }).click();
      await expect(cards.locator('[data-card-id="B"]')).toHaveAttribute('data-expanded', 'true');
      await section.getByRole('button', { name: 'Fechar cards' }).click();
    }
    await section.getByLabel('Nota B', { exact: true }).fill('Preservada');
    for (const id of ['A', 'B', 'C', 'D', 'B']) {
      await section.getByRole('button', { name: `Selecionar ${id}`, exact: true }).click();
    }
    await expect(section.getByLabel('Nota B', { exact: true })).toHaveValue('Preservada');
    await section.getByLabel('Detalhe B', { exact: true }).focus();
    await page.keyboard.press('Escape');
    await expect(cards.getByRole('button', { name: 'Card B' })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(section.getByLabel('Nota B', { exact: true })).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(cards.getByRole('button', { name: 'Card B' })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(cards.getByRole('button', { name: 'Card B' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    await section.getByLabel('Fallback estático').check();
    await section.getByRole('button', { name: 'Selecionar C', exact: true }).click();
    await expect(cards.locator('[data-card-id="C"]')).toHaveCSS('transform', 'none');
    await section.getByLabel('Fallback estático').uncheck();
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await section.getByRole('button', { name: 'Selecionar B', exact: true }).click();
    await expect(cards.locator('[data-card-id="B"]')).toHaveCSS('transform', 'none');
    expect(
      (await new AxeBuilder({ page }).include('#expandable-cards').analyze()).violations,
    ).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  });
}
test('M13 current code uses native clipboard exactly', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('');
  const section = page.locator('#expandable-cards');
  await section.locator('input[type=range]').fill('800');
  const code = await section.locator('pre code').innerText();
  await section.getByRole('button', { name: /Copiar exemplo/ }).click();
  await expect(section.locator('.copy-status')).toHaveText('Código copiado.');
  expect((await page.evaluate(() => navigator.clipboard.readText())).replaceAll('\r\n', '\n')).toBe(
    code.replaceAll('\r\n', '\n'),
  );
});
