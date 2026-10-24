import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const width of [1440, 1024, 390, 320]) {
  test(`L3 laboratory controls, duration, code and axe at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('');
    await expect(page.locator('.lab-summary strong')).toHaveText(['12', '04']);
    await expect(page.locator('.recipe-section')).toHaveCount(12);
    for (const [id, title, defaultDuration] of [
      ['layout-reflow', 'Layout Reflow', 240],
      ['skeleton-to-content', 'Skeleton-to-Content', 180],
      ['data-change-feedback', 'Data Change Feedback', 220],
    ] as const) {
      const section = page.locator('#' + id);
      await section.scrollIntoViewIfNeeded();
      const slider = section.getByLabel('Duração de ' + title, { exact: true });
      await expect(slider).toHaveValue(String(defaultDuration));
      await slider.focus();
      await slider.press('Home');
      await expect(slider).toHaveValue('0');
      await expect(section.locator('pre code')).toContainText('duration={0}');
      await slider.press('End');
      await expect(slider).toHaveValue('800');
      await expect(section.locator('pre code')).toContainText('duration={800}');
      await section
        .getByRole('button', { name: `Restaurar padrão (${defaultDuration} ms)`, exact: true })
        .click();
      await expect(slider).toHaveValue(String(defaultDuration));
      expect((await new AxeBuilder({ page }).include('#' + id).analyze()).violations).toEqual([]);
    }
    const layout = page.locator('#layout-reflow');
    await layout.getByLabel('Nota do layout A').fill('Preservada');
    await layout.getByRole('button', { name: 'Reordenar / replay', exact: true }).click();
    await expect(layout.locator('li').first()).toContainText('Nota C');
    await expect(layout.getByLabel('Nota do layout A')).toHaveValue('Preservada');
    const skeleton = page.locator('#skeleton-to-content');
    await skeleton.getByRole('button', { name: 'Disponibilizar conteúdo', exact: true }).click();
    await skeleton.getByLabel('Nota do conteúdo').fill('Mantida');
    await skeleton
      .getByRole('button', { name: 'Revalidar conteúdo', exact: true })
      .evaluate((el) => {
        if (!(el instanceof HTMLElement)) throw new Error('Expected HTML control');
        el.click();
      });
    await expect(skeleton.getByLabel('Nota do conteúdo')).toBeFocused();
    await expect(skeleton.getByLabel('Nota do conteúdo')).toHaveValue('Mantida');
    const data = page.locator('#data-change-feedback');
    await data.getByRole('button', { name: 'Renderizar mesmo valor', exact: true }).click();
    await expect(data.locator('.l3-data')).not.toContainText('Valor atualizado');
    await data.getByRole('button', { name: 'Alterar valor / replay', exact: true }).click();
    await expect(data.locator('.l3-data')).toContainText('9.876,54');
    await expect(data.locator('pre code')).toContainText('9.876,54');
    await data.getByLabel('Formatar como unidades').check();
    await expect(data.locator('.l3-data')).toContainText('9.876,54 unidades');
    await expect(data.locator('pre code')).toContainText('formatValue=');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await data.getByRole('button', { name: 'Alterar valor / replay', exact: true }).click();
    await expect(data.locator('.l3-data')).toContainText('12,4% unidades');
    await expect(data.locator('.l3-data')).toContainText('Valor atualizado');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  });
}

test('L3 clipboard uses the exact currently selected code and native clipboard', async ({
  page,
}) => {
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('');
  for (const id of ['layout-reflow', 'skeleton-to-content', 'data-change-feedback']) {
    const section = page.locator('#' + id);
    const slider = section.locator('input[type=range]');
    await slider.focus();
    await slider.press('End');
    const expected = await section.locator('pre code').innerText();
    await section.getByRole('button', { name: /Copiar exemplo/ }).click();
    await expect(section.locator('.copy-status')).toHaveText('Código copiado.');
    // Native Windows clipboard normalizes LF to CRLF; compare all content after that OS-only conversion.
    expect(
      (await page.evaluate(() => navigator.clipboard.readText())).replaceAll('\r\n', '\n'),
    ).toBe(expected);
  }
});
