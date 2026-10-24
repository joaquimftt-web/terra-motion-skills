import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
for (const width of [1440, 1024, 390, 320]) {
  test(`M13 independent geometry, motion, focus, duration and axe ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/expandable.html');
    const cards = page.getByRole('list', { name: 'Independent cards' }),
      b = cards.locator('[data-card-id="B"]'),
      c = cards.locator('[data-card-id="C"]');
    await expect(b).toHaveAttribute('data-expanded', 'true');
    const note = b.getByLabel('Preview B');
    await note.fill('stable');
    await note.evaluate((el) => {
      el.setAttribute('data-original', 'true');
    });
    await page.getByRole('button', { name: 'Select none', exact: true }).click();
    await page.getByLabel('Duration', { exact: true }).fill('800');
    await page.getByRole('button', { name: 'Card B', exact: true }).click();
    // Require actual intermediate projection; final dimensions alone do not prove motion.
    await expect
      .poll(async () =>
        cards
          .locator('li')
          .evaluateAll((nodes) =>
            nodes.some(
              (n) =>
                getComputedStyle(n).transform !== 'none' &&
                !['matrix(1, 0, 0, 1, 0, 0)', 'matrix(1, 0, 0, 1, 0, 0)'].includes(
                  getComputedStyle(n).transform,
                ),
            ),
          ),
      )
      .toBe(true);
    await page.waitForTimeout(850);
    const boxes = await cards.locator('li').evaluateAll((nodes) =>
      nodes.map((n) => {
        const r = n.getBoundingClientRect();
        return { width: r.width, top: r.top };
      }),
    );
    if (width > 640) {
      expect(boxes[1]!.width).toBeGreaterThan(boxes[0]!.width * 1.8);
      expect(Math.abs(boxes[1]!.top - boxes[0]!.top)).toBeLessThan(2);
    } else expect(Math.abs(boxes[1]!.width - boxes[0]!.width)).toBeLessThan(2);
    const detail = b.getByLabel('Detail B');
    await detail.fill('detail value');
    const sequence = await detail.evaluate((el) => {
      const trigger = el.closest('article')!.querySelector('button')!;
      const log: string[] = [];
      trigger.addEventListener(
        'focus',
        () => log.push(el.closest('[hidden]') ? 'hidden' : 'visible'),
        { once: true },
      );
      Object.assign(window, { focusOrder: log });
      return true;
    });
    expect(sequence).toBe(true);
    await page
      .getByRole('button', { name: 'Select C', exact: true })
      .evaluate((el: HTMLButtonElement) => el.click());
    await expect(b.getByRole('button')).toBeFocused();
    expect(await page.evaluate(() => Reflect.get(window, 'focusOrder'))).toEqual(['visible']);
    await expect(c).toHaveAttribute('data-expanded', 'true');
    await page.getByRole('button', { name: 'Select B', exact: true }).click();
    await expect(note).toHaveValue('stable');
    await expect(note).toHaveAttribute('data-original', 'true');
    await expect(detail).toHaveValue('detail value');
    await detail.focus();
    await detail.press('Escape');
    await expect(b).toHaveAttribute('data-expanded', 'false');
    await expect(b.getByRole('button')).toBeFocused();
    await page.getByLabel('Duration', { exact: true }).fill('0');
    await page.getByRole('button', { name: 'Select C', exact: true }).click();
    await expect(c).toHaveCSS('transform', 'none');
    await page.getByLabel('Duration', { exact: true }).fill('800');
    await page.getByRole('button', { name: 'Select B', exact: true }).click();
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(b).toHaveCSS('transform', 'none');
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await expect(b).toHaveCSS('transform', 'none');
    await page.getByRole('button', { name: 'Late image' }).click();
    await expect(cards.locator('img').first()).toHaveAttribute('src', '/late.svg');
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  });
  test(`M13 real SSR late hydration preserves edited input ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    let release!: () => void;
    const barrier = new Promise<void>((r) => (release = r));
    await page.route('**/expandable.tsx', async (route) => {
      await barrier;
      await route.continue();
    });
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    page.on('console', (m) => {
      if (m.type() === 'error') errors.push(m.text());
    });
    await page.goto('/expandable-ssr.html', { waitUntil: 'commit' });
    const input = page.getByLabel('Preview B');
    await input.fill('before hydration');
    await input.evaluate((el) => Object.assign(el, { beforeHydration: true }));
    release();
    await expect.poll(() => page.evaluate(() => Boolean(Reflect.get(window, '__m13')))).toBe(true);
    await page.getByRole('button', { name: 'Select C', exact: true }).click();
    await expect(input).toHaveValue('before hydration');
    expect(await input.evaluate((el) => Reflect.get(el, 'beforeHydration'))).toBe(true);
    expect(await page.evaluate(() => Reflect.get(window, '__m13').errors)).toEqual([]);
    expect(errors).toEqual([]);
  });
}
test('M13 focus failure retains details; empty fallback and input identity', async ({ page }) => {
  await page.goto('/expandable.html');
  const detail = page.getByLabel('Detail B');
  await detail.focus();
  await page.getByRole('button', { name: 'Card B' }).evaluate((el) => {
    Object.assign(el, { focus: () => {} });
  });
  await page
    .getByRole('button', { name: 'Select C', exact: true })
    .evaluate((el: HTMLButtonElement) => el.click());
  await expect(detail).toBeVisible();
  await expect(detail).toBeFocused();
  await expect(page.locator('.cards')).toHaveAttribute('data-update-blocked', 'true');
  await page
    .getByRole('button', { name: 'Card B' })
    .evaluate((el) => Reflect.deleteProperty(el, 'focus'));
  await page
    .getByRole('button', { name: 'Select none', exact: true })
    .evaluate((el: HTMLButtonElement) => el.click());
  await expect(page.getByRole('button', { name: 'Card B' })).toBeFocused();
  await page.getByRole('button', { name: 'Select B', exact: true }).click();
  await page.getByLabel('Detail B').focus();
  await page
    .getByRole('button', { name: 'Remove selected' })
    .evaluate((el: HTMLButtonElement) => el.click());
  await expect(page.getByRole('button', { name: 'Card C' })).toBeFocused();
  await page
    .getByRole('button', { name: 'Empty', exact: true })
    .evaluate((el: HTMLButtonElement) => el.click());
  await expect(page.getByRole('list')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'After collection' })).toBeFocused();
});
for (const mode of ['twins', 'roots'])
  test(`M13 ${mode} namespace, StrictMode and repeated cleanup`, async ({ page }) => {
    await page.addInitScript(() => {
      const callbacks = new Set<EventListenerOrEventListenerObject>();
      const add = window.addEventListener.bind(window),
        remove = window.removeEventListener.bind(window);
      window.addEventListener = (
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | AddEventListenerOptions,
      ) => {
        if (type === 'resize') callbacks.add(listener);
        add(type, listener, options);
      };
      window.removeEventListener = (
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | EventListenerOptions,
      ) => {
        if (type === 'resize') callbacks.delete(listener);
        remove(type, listener, options);
      };
      Object.assign(window, { __resizeCallbacks: callbacks });
    });
    await page.goto('/expandable-' + mode + '.html');
    await expect(page.getByRole('list')).toHaveCount(2);
    const lists = page.getByRole('list');
    await lists.nth(0).getByRole('button', { name: 'Card A' }).click();
    await expect(lists.nth(1).getByRole('button', { name: 'Card B' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    const ids = await page.locator('[id]').evaluateAll((nodes) => nodes.map((n) => n.id));
    expect(new Set(ids).size).toBe(ids.length);
    expect(await page.evaluate(() => Reflect.get(window, '__m13').errors)).toEqual([]);
    const mountedCount = await page.evaluate(() => Reflect.get(window, '__resizeCallbacks').size);
    expect(mountedCount).toBeGreaterThanOrEqual(2);
    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => Reflect.get(window, '__m13unmount')());
      await expect(page.getByRole('list')).toHaveCount(0);
      const remaining = await page.evaluate(() =>
        Array.from(Reflect.get(window, '__resizeCallbacks') as Set<EventListener>).map((fn) =>
          fn.toString(),
        ),
      );
      expect(remaining.length).toBe(mountedCount - 2);
      for (const source of remaining) expect(source).toContain('updateBlockedByResize');
      await page.evaluate(() => Reflect.get(window, '__m13mount')());
      await expect(page.getByRole('list')).toHaveCount(2);
      expect(await page.evaluate(() => Reflect.get(window, '__resizeCallbacks').size)).toBe(
        mountedCount,
      );
    }
  });
test('M13 real hydration mismatch negative', async ({ page }) => {
  await page.goto('/expandable-ssr.html?mismatch=1');
  await expect
    .poll(() => page.evaluate(() => Reflect.get(window, '__m13')?.errors.length ?? 0))
    .toBeGreaterThan(0);
});
test('M13 SSR remains readable with JavaScript disabled', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4175/expandable-ssr.html');
  await expect(page.getByLabel('Detail B')).toBeVisible();
  await expect(page.getByLabel('Detail A')).toBeHidden();
  await context.close();
});
test('M13 static fallback without matchMedia retains native selection', async ({ page }) => {
  await page.addInitScript(() =>
    Object.defineProperty(window, 'matchMedia', { value: undefined, configurable: true }),
  );
  await page.goto('/expandable.html');
  await page.getByRole('button', { name: 'Card C' }).click();
  await expect(page.getByRole('button', { name: 'Card C' })).toHaveAttribute(
    'aria-expanded',
    'true',
  );
  await expect(page.locator('[data-card-id="C"]')).toHaveCSS('transform', 'none');
});

test('M13 rapid selection, duration interruption, resize and late image do not replay stale motion', async ({
  page,
}) => {
  await page.goto('/expandable.html');
  await page.getByLabel('Duration', { exact: true }).fill('800');
  const select = (id: string) =>
    page
      .getByRole('button', { name: 'Select ' + id, exact: true })
      .evaluate((el: HTMLButtonElement) => el.click());
  await select('A');
  await select('B');
  await select('C');
  await expect(page.locator('[data-card-id="C"]')).toHaveAttribute('data-expanded', 'true');
  await page.getByLabel('Duration', { exact: true }).evaluate((el: HTMLInputElement) => {
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!;
    setter.call(el, '200');
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await expect(page.locator('[data-card-id="C"]')).toHaveCSS('transform', 'none');
  await page.waitForTimeout(850);
  await expect(page.locator('[data-card-id="C"]')).toHaveCSS('transform', 'none');
  await select('B');
  await page.setViewportSize({ width: 320, height: 900 });
  await expect(page.locator('[data-card-id="B"]')).toHaveCSS('transform', 'none');
  await page.route('**/late.svg', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 700));
    await route.continue();
  });
  const before = await page.locator('[data-card-media]').first().boundingBox();
  await page.getByRole('button', { name: 'Late image' }).click();
  await expect
    .poll(() =>
      page
        .locator('img')
        .first()
        .evaluate((el: HTMLImageElement) => el.complete),
    )
    .toBe(true);
  const after = await page.locator('[data-card-media]').first().boundingBox();
  expect(after!.height).toBe(before!.height);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('M13 touch selection and live reduced motion', async ({ browser }) => {
  const context = await browser.newContext({
    hasTouch: true,
    isMobile: true,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4175/expandable.html');
  await page.getByRole('button', { name: 'Card C' }).tap();
  await expect(page.getByLabel('Detail C')).toBeVisible();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.getByRole('button', { name: 'Card B' }).tap();
  await expect(page.locator('[data-card-id="B"]')).toHaveCSS('transform', 'none');
  await context.close();
});
