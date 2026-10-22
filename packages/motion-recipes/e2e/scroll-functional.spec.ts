import { expect, test } from '@playwright/test';

for (const n of [1, 6, 20])
  test(`group${n}: offscreen preparation, real automatic entry and concurrent cancellation`, async ({
    page,
  }, info) => {
    await page.goto(`/functional.html?n=${n}`);
    const root = page.getByTestId('target');
    expect(await root.locator(':scope > li').count()).toBe(n);
    expect(
      await root.evaluate((el) =>
        Array.from(el.children).every(
          (n) => getComputedStyle(n).transform === 'matrix(1, 0, 0, 1, 0, 8)',
        ),
      ),
    ).toBe(true);
    await root.evaluate((el) => window.scrollBy(0, el.getBoundingClientRect().top - 200));
    await expect
      .poll(() =>
        root.evaluate(
          (el) => Array.from(el.children).filter((n) => n.getAnimations().length > 0).length,
        ),
      )
      .toBe(n);
    const timings = await root.evaluate((el) =>
      Array.from(el.children).map((n) => n.getAnimations()[0]!.effect!.getTiming()),
    );
    expect(timings.map((t) => t.delay)).toEqual(
      Array.from({ length: n }, (_, i) => Math.min(i * 50, 200)),
    );
    await info.attach('automatic-delays', {
      body: JSON.stringify(timings),
      contentType: 'application/json',
    });
    await page.getByLabel('Nota ' + (n - 1), { exact: true }).focus();
    expect(
      await root.evaluate((el) =>
        Array.from(el.children).every(
          (n) => getComputedStyle(n).transform === 'none' && n.getAnimations().length === 0,
        ),
      ),
    ).toBe(true);
    await page.getByLabel('Nota 0', { exact: true }).fill('preserved');
    await page.getByRole('button', { name: 'Replay', exact: true }).evaluate((el) => {
      if (el instanceof HTMLElement) el.click();
    });
    expect(
      await root.evaluate((el) =>
        Array.from(el.children).every((n) => n.getAnimations().length === 0),
      ),
    ).toBe(true);
    await page.getByRole('button', { name: 'Replay', exact: true }).focus();
    await page.getByRole('button', { name: 'Replay', exact: true }).evaluate((el) => {
      if (el instanceof HTMLElement) el.click();
    });
    await expect
      .poll(() =>
        root.evaluate((el) => Array.from(el.children).some((n) => n.getAnimations().length > 0)),
      )
      .toBe(true);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect
      .poll(() =>
        root.evaluate((el) =>
          Array.from(el.children).every(
            (n) => getComputedStyle(n).transform === 'none' && n.getAnimations().length === 0,
          ),
        ),
      )
      .toBe(true);
    await expect(page.getByLabel('Nota 0', { exact: true })).toHaveValue('preserved');
    await page.getByRole('button', { name: 'Mount', exact: true }).evaluate((el) => {
      if (el instanceof HTMLElement) el.click();
    });
    await expect(root).toHaveCount(0);
  });
for (const kind of ['group', 'reveal'])
  for (const reason of ['visible', 'shadow', 'clip', 'transform'])
    test(`${kind} static fallback:${reason}`, async ({ page }, info) => {
      await page.goto(`/functional.html?kind=${kind}&${reason}`);
      const root = page.getByTestId('target');
      expect(
        await root.evaluate((el) =>
          Array.from(el.children).every((n) => getComputedStyle(n).transform === 'none'),
        ),
      ).toBe(true);
      await root.scrollIntoViewIfNeeded();
      expect(
        await root.evaluate((el) =>
          Array.from(el.children).every((n) => n.getAnimations().length === 0),
        ),
      ).toBe(true);
      await info.attach('fallback', {
        body: JSON.stringify({ kind, reason, static: true }),
        contentType: 'application/json',
      });
    });
test('contentRef invalidates CSS-only growth without polling or content mutation', async ({
  page,
}) => {
  await page.goto('/functional.html');
  const viewport = page.getByTestId('container'),
    fill = page.getByTestId('container-bar').locator('span');
  await viewport.evaluate((el) => (el.scrollTop = (el.scrollHeight - el.clientHeight) / 2));
  const shown = () =>
    fill.evaluate((el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).a);
  await expect.poll(shown).toBeCloseTo(0.5, 2);
  await page.getByTestId('content').evaluate((el) => (el.style.paddingBottom = '700px'));
  const expected = await viewport.evaluate(
    (el) => el.scrollTop / (el.scrollHeight - el.clientHeight),
  );
  expect(expected).toBeLessThan(0.5);
  await expect.poll(shown).toBeCloseTo(expected, 3);
});
test('document position is measured after real reload restoration and reverse scroll', async ({
  page,
}) => {
  await page.goto('/progress-ssr.html');
  await page.evaluate(() => scrollTo(0, 900));
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(500);
  await page.reload();
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(500);
  const actual = () =>
    page.evaluate(() => {
      const el = document.scrollingElement!;
      return el.scrollTop / (el.scrollHeight - el.clientHeight);
    });
  const shown = () =>
    page
      .getByTestId('doc')
      .locator('span')
      .evaluate((el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).a);
  await expect.poll(shown).toBeCloseTo(await actual(), 3);
  await page.evaluate(() => scrollTo(0, 200));
  await expect.poll(shown).toBeCloseTo(await actual(), 3);
});

test('switching from nonzero document to zero container clears previous paint', async ({
  page,
}) => {
  await page.goto('/functional.html');
  await page.evaluate(() => scrollTo(0, 500));
  const fill = page.getByTestId('switchable').locator('span');
  const shown = () =>
    fill.evaluate((el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).a);
  await expect.poll(shown).toBeGreaterThan(0);
  await page.getByRole('button', { name: 'Source', exact: true }).evaluate((el) => {
    if (el instanceof HTMLElement) el.click();
  });
  await expect.poll(shown).toBe(0);
  await expect(fill).toHaveCSS('visibility', 'visible');
});

test('actual touch pointer interrupts the whole active group and keeps the input usable', async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    reducedMotion: 'no-preference',
  });
  try {
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4175/functional.html');
    const root = page.getByTestId('target');
    await root.evaluate((el) => window.scrollBy(0, el.getBoundingClientRect().top - 160));
    await expect
      .poll(() =>
        root.evaluate((el) => Array.from(el.children).some((n) => n.getAnimations().length > 0)),
      )
      .toBe(true);
    const input = page.getByLabel('Nota 0', { exact: true });
    const box = await input.boundingBox();
    expect(box).not.toBeNull();
    await page.touchscreen.tap(box!.x + box!.width / 2, box!.y + box!.height / 2);
    await expect(input).toBeFocused();
    expect(
      await root.evaluate((el) =>
        Array.from(el.children).every(
          (n) => n.getAnimations().length === 0 && getComputedStyle(n).transform === 'none',
        ),
      ),
    ).toBe(true);
    await input.fill('touch preserved');
    await expect(input).toHaveValue('touch preserved');
  } finally {
    await context.close();
  }
});
