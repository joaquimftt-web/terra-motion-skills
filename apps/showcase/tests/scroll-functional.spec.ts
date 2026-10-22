import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const width of [320, 390, 1024, 1440])
  test(`scroll demos are usable, responsive and axe clean at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('');
    for (const id of ['scroll-reveal', 'staggered-entrance', 'scroll-progress']) {
      const section = page.locator('#' + id);
      await section.scrollIntoViewIfNeeded();
      await expect(section.getByRole('heading', { level: 2 })).toBeVisible();
      const panel = await section.locator('.demo-panel').boundingBox();
      const bar = await section.locator('.panel-bar').boundingBox();
      expect(bar!.width).toBeGreaterThanOrEqual(panel!.width - 3);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      expect((await new AxeBuilder({ page }).include('#' + id).analyze()).violations).toEqual([]);
    }
  });
for (const [id, name, target] of [
  ['scroll-reveal', 'Scroll Reveal', 'reveal-demo-target'],
  ['staggered-entrance', 'Staggered Entrance', 'stagger-demo-target'],
])
  test(`${name} duration, replay, copy, focus and reduction are real`, async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('');
    const section = page.locator('#' + id);
    const slider = section.getByLabel('Duração ' + name, { exact: true });
    await slider.focus();
    await slider.press('End');
    await expect(slider).toHaveValue('800');
    const root = page.getByTestId(target!);
    await root.scrollIntoViewIfNeeded();
    await section.getByRole('button', { name: 'Repetir ' + name, exact: true }).evaluate((el) => {
      if (!(el instanceof HTMLElement)) throw Error('Expected button');
      el.click();
    });
    await expect
      .poll(() =>
        root.evaluate((el) =>
          Array.from(el.children).some((node) =>
            node.getAnimations().some((a) => a.playState === 'running'),
          ),
        ),
      )
      .toBe(true);
    await section.getByRole('button', { name: 'Repetir ' + name, exact: true }).evaluate((el) => {
      if (!(el instanceof HTMLElement)) throw Error('Expected button');
      el.click();
      el.click();
    });
    const note = section.getByRole('textbox').first();
    await note.fill('preservar');
    expect(
      await root.evaluate((el) =>
        Array.from(el.children).every((node) => getComputedStyle(node).transform === 'none'),
      ),
    ).toBe(true);
    await section.getByRole('button', { name: 'Copiar exemplo ' + name, exact: true }).click();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('duration={800}');
    await slider.focus();
    await slider.press('Home');
    await expect(slider).toHaveValue('0');
    await expect(note).toHaveValue('preservar');
    await section.getByRole('button', { name: 'Restaurar padrão (260 ms)', exact: true }).click();
    await expect(slider).toHaveValue('260');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await root.scrollIntoViewIfNeeded();
    await section.getByRole('button', { name: 'Repetir ' + name, exact: true }).evaluate((el) => {
      if (!(el instanceof HTMLElement)) throw Error('Expected button');
      el.click();
    });
    expect(
      await root.evaluate((el) =>
        Array.from(el.children).every(
          (node) =>
            node.getAnimations().length === 0 && getComputedStyle(node).transform === 'none',
        ),
      ),
    ).toBe(true);
  });
for (const n of [1, 6, 20])
  test(`stagger actual WAAPI delays cap at200 for ${n} items`, async ({ page }, info) => {
    await page.goto('');
    const section = page.locator('#staggered-entrance');
    await section.getByLabel('Quantidade no grupo').selectOption(String(n));
    const slider = section.getByLabel('Duração Staggered Entrance', { exact: true });
    await slider.focus();
    await slider.press('End');
    const root = page.getByTestId('stagger-demo-target');
    await root.scrollIntoViewIfNeeded();
    await section
      .getByRole('button', { name: 'Repetir Staggered Entrance', exact: true })
      .evaluate((button) => {
        if (!(button instanceof HTMLElement)) throw Error('Expected button');
        button.click();
      });
    await expect
      .poll(() =>
        root.evaluate(
          (el) => Array.from(el.children).filter((node) => node.getAnimations().length > 0).length,
        ),
      )
      .toBe(n);
    const timings = await root.evaluate((root) =>
      Array.from(root.children).map((el) => el.getAnimations().map((a) => a.effect!.getTiming())),
    );
    expect(timings).toHaveLength(n);
    expect(timings.map((a) => a[0]?.delay)).toEqual(
      Array.from({ length: n }, (_, i) => Math.min(i * 50, 200)),
    );
    expect(timings.every((a) => a[0]?.duration === 800)).toBe(true);
    await info.attach('timings', {
      body: JSON.stringify(timings, null, 2),
      contentType: 'application/json',
    });
    await expect
      .poll(() =>
        root.evaluate((el) =>
          Array.from(el.children).every((node) => getComputedStyle(node).transform === 'none'),
        ),
      )
      .toBe(true);
  });
test('progress reflects real container position, dynamic content, resize, reverse, zero range and keyboard', async ({
  page,
}) => {
  await page.goto('');
  const section = page.locator('#scroll-progress'),
    viewport = page.getByTestId('progress-viewport'),
    fill = page.getByTestId('progress-container').locator('span');
  await viewport.scrollIntoViewIfNeeded();
  await viewport.evaluate((el) => {
    el.scrollTop = (el.scrollHeight - el.clientHeight) / 2;
  });
  const actual = () =>
    viewport.evaluate((el) => el.scrollTop / (el.scrollHeight - el.clientHeight));
  const shown = () =>
    fill.evaluate((el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).a);
  await expect.poll(shown).toBeCloseTo(await actual(), 3);
  await section.getByRole('button', { name: 'Adicionar conteúdo', exact: true }).click();
  await expect.poll(shown).toBeCloseTo(await actual(), 3);
  await section.getByLabel('Altura do container').selectOption('400');
  await expect.poll(shown).toBeCloseTo(await actual(), 3);
  await viewport.focus();
  await viewport.press('Home');
  await expect.poll(shown).toBeCloseTo(0, 3);
  await viewport.press('End');
  await expect.poll(shown).toBeCloseTo(1, 3);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await viewport.evaluate((el) => (el.scrollTop = 0));
  await expect.poll(shown).toBeCloseTo(0, 3);
  await section.getByRole('button', { name: 'Testar sem rolagem', exact: true }).click();
  await expect(fill).toHaveCSS('visibility', 'hidden');
  await expect(section.getByRole('slider')).toHaveCount(0);
  await expect(section.locator('[role="progressbar"],[aria-live]')).toHaveCount(0);
});

test('compiled showcase restores document position on reload and progress stays truthful', async ({
  page,
}) => {
  await page.goto('');
  await page.getByTestId('progress-document').waitFor();
  await page.evaluate(() => scrollTo(0, 1000));
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(500);
  await page.reload();
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(500);
  const actual = await page.evaluate(() => {
    const root = document.scrollingElement!;
    return root.scrollTop / (root.scrollHeight - root.clientHeight);
  });
  await expect
    .poll(() =>
      page
        .getByTestId('progress-document')
        .locator('span')
        .evaluate((el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).a),
    )
    .toBeCloseTo(actual, 3);
});
