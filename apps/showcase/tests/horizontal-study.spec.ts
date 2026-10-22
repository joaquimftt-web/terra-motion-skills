import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const base = process.env.SHOWCASE_BASE_PATH ?? '/';
test('editorial Reveal and Stagger prepare outside the transformed rail', async ({ page }) => {
  await page.goto(`${base}?variant=A`);
  await expect(page.locator('.hx-study-heading > div > div')).toHaveCSS(
    'transform',
    'matrix(1, 0, 0, 1, 0, 8)',
  );
  for (const item of await page.locator('.hx-principles > li').all())
    await expect(item).not.toHaveCSS('transform', 'none');
});
for (const width of [1440, 1024, 390, 320])
  for (const variant of ['A', 'B']) {
    test(`${variant} horizontal comparison remains usable at ${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`${base}?variant=${variant}`);
      const stage = page.getByTestId('horizontal-stage');
      await stage.scrollIntoViewIfNeeded();
      await expect(stage).toHaveAttribute(
        'data-mode',
        variant === 'A' && width >= 1000 ? 'linked' : 'native',
      );
      await expect
        .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
        .toBe(true);
      const region = page.getByRole('region', { name: 'Exploração horizontal de quatro motions' });
      await region.focus();
      await region.press('End');
      await expect.poll(() => stage.getAttribute('data-position')).toBe('1');
      const notes = page.getByRole('region', { name: 'Notas roláveis do painel de progresso' });
      await notes.focus();
      await notes.press('End');
      await expect.poll(() => notes.evaluate((el) => el.scrollTop)).toBeGreaterThan(0);
      await region.focus();
      await region.press('Home');
      await expect.poll(() => stage.getAttribute('data-position')).toBe('0');
      await page.getByRole('button', { name: 'Confirmar interação ↗', exact: true }).last().click();
      await expect(stage.getByText('1 ação confirmada')).toBeVisible();
      const audit = await new AxeBuilder({ page }).include('#motion-exploration').analyze();
      expect(audit.violations).toEqual([]);
      await page.getByRole('link', { name: 'Pular a sequência ↘' }).click();
      await expect(page.locator('#hx-after')).toBeInViewport();
      await expect(page.locator('.lp-p2-plane')).toHaveCSS('opacity', '0');
    });
  }
test('linked passage goes forward, reverse and exits without canceling wheel', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${base}?variant=A`);
  const stage = page.getByTestId('horizontal-stage');
  await expect(stage).toHaveAttribute('data-mode', 'linked');
  const geometry = await stage.evaluate((el) => ({
    top: el.getBoundingClientRect().top + scrollY,
    travel: Number.parseFloat(getComputedStyle(el).getPropertyValue('--hx-travel')),
  }));
  await page.evaluate((y) => scrollTo({ top: y, behavior: 'instant' }), geometry.top - 24);
  await page.mouse.move(900, 450);
  await page.mouse.wheel(0, 600);
  await expect
    .poll(async () => Number(await stage.getAttribute('data-position')))
    .toBeGreaterThan(0.1);
  await page.mouse.wheel(0, -400);
  await expect
    .poll(async () => Number(await stage.getAttribute('data-position')))
    .toBeLessThan(0.1);
  await page.mouse.wheel(0, geometry.travel + 1000);
  await expect(page.locator('#hx-after')).toBeInViewport();
  await page.mouse.wheel(0, -geometry.travel - 1000);
  await expect.poll(async () => Number(await stage.getAttribute('data-position'))).toBe(0);
});
test('reduction live, manual native fallback, resize and focus keep panels usable', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${base}?variant=A`);
  const stage = page.getByTestId('horizontal-stage');
  await expect(stage).toHaveAttribute('data-mode', 'linked');
  await stage.scrollIntoViewIfNeeded();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(stage).toHaveAttribute('data-mode', 'native');
  await page.getByRole('region', { name: 'Exploração horizontal de quatro motions' }).focus();
  await page.keyboard.press('End');
  await expect.poll(() => stage.getAttribute('data-position')).toBe('1');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(stage).toHaveAttribute('data-mode', 'linked');
  await page.getByRole('button', { name: 'Preferir versão nativa' }).click();
  await expect(stage).toHaveAttribute('data-mode', 'native');
  await page.setViewportSize({ width: 390, height: 900 });
  await expect(stage).toHaveAttribute('data-mode', 'native');
  await page.getByRole('region', { name: 'Exploração horizontal de quatro motions' }).focus();
  await page.keyboard.press('Home');
  await page.getByRole('button', { name: 'Próximo painel' }).click();
  await page.getByRole('button', { name: 'Como uma recipe preserva o contexto?' }).click();
  await expect(stage.getByText('O estado pertence ao React.', { exact: false })).toBeVisible();
});
test('keyboard can traverse all panel links and Presence returns focus', async ({ page }) => {
  await page.goto(`${base}?variant=A`);
  await page.setViewportSize({ width: 1440, height: 900 });
  const stage = page.getByTestId('horizontal-stage');
  const targets = stage.locator('.hx-panel-links a');
  for (const target of await targets.all()) {
    await target.focus();
    await expect(target).toBeInViewport();
  }
  await expect.poll(() => page.locator('.hx-viewport').evaluate((el) => el.scrollLeft)).toBe(0);
  await expect.poll(() => stage.getAttribute('data-position')).toBe('1');
  const button = page.getByRole('button', { name: 'Retirar conteúdo', exact: true });
  await button.focus();
  await expect(button).toBeInViewport();
  await page.getByRole('button', { name: 'Fechar por dentro e devolver foco ↗' }).click();
  await expect(page.getByRole('button', { name: 'Trazer conteúdo', exact: true })).toBeFocused();
});
test('first-contact proposal is optional and does not edit the hero', async ({ page }) => {
  await page.goto(`${base}?variant=B`);
  await expect(page.locator('.hx-first')).toHaveCount(0);
  const original = await page.locator('.lp-hero').innerHTML();
  await page.goto(`${base}?variant=B&first=1`);
  await expect(page.locator('.lp-hero')).toHaveCount(1);
  expect((await page.locator('.lp-hero').innerHTML()).replace(/style="[^"]*"/g, '')).toBe(
    original.replace(/style="[^"]*"/g, ''),
  );
  const open = page.getByRole('button', { name: 'Ver uma resposta real ↗' });
  await open.click();
  await expect(page.getByText('O gesto tem consequência.')).toBeVisible();
  await page.getByRole('button', { name: 'Fechar resposta ↗' }).click();
  await expect(page.getByText('O gesto tem consequência.')).toHaveCount(0);
});
test('no-JS retains a real read-only description of every new panel', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`http://127.0.0.1:4173${base}?variant=A`);
  for (const title of [
    'Confirme uma intenção.',
    'Abra espaço para entender.',
    'Mude sem perder o contexto.',
    'Encontre sua posição.',
  ])
    await expect(page.getByRole('heading', { name: title })).toBeVisible();
  await context.close();
});

test('initial reduction and missing ResizeObserver keep real native content', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(() => {
    Object.defineProperty(window, 'ResizeObserver', { value: undefined, configurable: true });
  });
  await page.goto(`${base}?variant=A`);
  await expect(page.getByTestId('horizontal-stage')).toHaveAttribute('data-mode', 'native');
  await expect(page.locator('.hx-principles > li').first()).toHaveCSS('transform', 'none');
  await page.getByRole('region', { name: 'Exploração horizontal de quatro motions' }).focus();
  await page.keyboard.press('End');
  await expect
    .poll(() => page.getByTestId('horizontal-stage').getAttribute('data-position'))
    .toBe('1');
});

test('horizontal wheel and real Tab preserve native scroll and input ownership', async ({
  page,
}) => {
  await page.goto(`${base}?variant=B`);
  const view = page.getByRole('region', { name: 'Exploração horizontal de quatro motions' });
  await view.scrollIntoViewIfNeeded();
  const box = await view.boundingBox();
  await page.mouse.move(box!.x + box!.width / 2, box!.y + 100);
  await page.mouse.wheel(500, 0);
  await expect.poll(() => view.evaluate((el) => el.scrollLeft)).toBeGreaterThan(100);
  await view.focus();
  await view.press('Home');
  await expect.poll(() => view.evaluate((el) => el.scrollLeft)).toBeLessThan(2);
  const skill = page.locator('.hx-panel').first().getByRole('link', { name: 'Ler a skill ↗' });
  await skill.focus();
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('button', { name: 'Como uma recipe preserva o contexto?' }),
  ).toBeFocused();
  await expect(
    page.getByRole('button', { name: 'Como uma recipe preserva o contexto?' }),
  ).toBeInViewport();
});

test('native touch swipe moves the horizontal container', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 900 },
    hasTouch: true,
    isMobile: true,
  });
  const page = await context.newPage();
  await page.goto(`http://127.0.0.1:4173${base}?variant=B`);
  const view = page.getByRole('region', { name: 'Exploração horizontal de quatro motions' });
  await view.scrollIntoViewIfNeeded();
  const box = await view.boundingBox();
  const cdp = await context.newCDPSession(page),
    y = Math.max(100, Math.min(700, box!.y + 100));
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 320, y }] });
  for (let x = 300; x >= 70; x -= 23) {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y }] });
    await page.waitForTimeout(20);
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await expect.poll(() => view.evaluate((el) => el.scrollLeft)).toBeGreaterThan(40);
  await context.close();
});

test('mode changes clean scoped observers and viewport listeners', async ({ page }) => {
  await page.addInitScript(() => {
    const live = new Set<ResizeObserver>(),
      Native = window.ResizeObserver;
    const listeners = new Map<EventListenerOrEventListenerObject, string>();
    const add = EventTarget.prototype.addEventListener,
      remove = EventTarget.prototype.removeEventListener;
    Object.assign(window, {
      horizontalResourceCounts: () => ({ observers: live.size, listeners: listeners.size }),
    });
    window.ResizeObserver = class extends Native {
      override observe(target: Element, options?: ResizeObserverOptions) {
        super.observe(target, options);
        if (target.matches('.hx-pin,.hx-rail,.hx-viewport')) live.add(this);
      }
      override disconnect() {
        super.disconnect();
        live.delete(this);
      }
    };
    EventTarget.prototype.addEventListener = function (type, listener, options) {
      if (this instanceof Element && this.matches('.hx-viewport') && listener)
        listeners.set(listener, type);
      return add.call(this, type, listener, options);
    };
    EventTarget.prototype.removeEventListener = function (type, listener, options) {
      if (this instanceof Element && this.matches('.hx-viewport') && listener)
        listeners.delete(listener);
      return remove.call(this, type, listener, options);
    };
  });
  await page.goto(`${base}?variant=A`);
  await page.getByTestId('horizontal-stage').scrollIntoViewIfNeeded();
  const counts = () =>
    page.evaluate(() =>
      (
        window as typeof window & {
          horizontalResourceCounts: () => { observers: number; listeners: number };
        }
      ).horizontalResourceCounts(),
    );
  await expect.poll(counts).toEqual({ observers: 1, listeners: 2 });
  for (let i = 0; i < 12; i++)
    await page
      .getByRole('button', {
        name: i % 2 === 0 ? 'Preferir versão nativa' : 'Permitir versão sticky',
      })
      .click();
  await expect.poll(counts).toEqual({ observers: 1, listeners: 2 });
});

test('live reduction preserves a focused panel instead of dropping below the stage', async ({
  page,
}) => {
  await page.goto(`${base}?variant=A`);
  await page.setViewportSize({ width: 1440, height: 900 });
  const button = page.getByRole('button', { name: 'Retirar conteúdo', exact: true });
  await button.focus();
  await expect(button).toBeInViewport();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(button).toBeFocused();
  await expect(button).toBeInViewport();
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(button).toBeFocused();
  await expect(button).toBeInViewport();
});

test('missing ResizeObserver uses safe native presentation even without reduction', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.addInitScript(() => {
    Object.defineProperty(window, 'ResizeObserver', { value: undefined, configurable: true });
  });
  await page.goto(`${base}?variant=A`);
  await expect(page.getByTestId('horizontal-stage')).toHaveAttribute('data-mode', 'native');
});

test('small horizontal wheel impulses accumulate instead of snapping back', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${base}?variant=B`);
  const view = page.locator('.hx-viewport');
  await view.scrollIntoViewIfNeeded();
  const box = await view.boundingBox();
  await page.mouse.move(box!.x + box!.width * 0.75, box!.y + 350);
  for (let i = 0; i < 8; i++) {
    await page.mouse.wheel(118, 0);
    await page.waitForTimeout(100);
  }
  await expect.poll(() => view.evaluate((el) => el.scrollLeft)).toBeGreaterThan(400);
});

// Refinement regressions: preserve existing coverage and exercise the reported defects.
test('refinement keeps the current panel when native geometry becomes sticky', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto(`${base}?variant=A`);
  const region = page.getByRole('region', { name: 'Exploração horizontal de quatro motions' });
  await region.focus();
  await region.press('End');
  const stage = page.getByTestId('horizontal-stage');
  await expect.poll(() => stage.getAttribute('data-position')).toBe('1');
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(stage).toHaveAttribute('data-mode', 'linked');
  await expect.poll(() => stage.getAttribute('data-position')).toBe('1');
  await expect.poll(() => region.evaluate((el) => el.scrollLeft)).toBe(0);
  await expect(region).toBeFocused();
});
for (const placement of ['after', 'hero']) {
  test(`refinement ${placement} widget has opaque readable button states`, async ({ page }) => {
    await page.goto(`${base}?variant=A&first=${placement}`);
    const widget = page.locator('.hx-first');
    await expect(widget).toHaveAttribute('data-placement', placement);
    const trigger = widget.getByRole('button');
    for (const open of [false, true]) {
      if (open) await trigger.click();
      await page.mouse.move(1, 1);
      await page.waitForTimeout(180);
      const check = async () => {
        await expect(trigger).toHaveCSS('background-color', /rgb\(/);
        const audit = await new AxeBuilder({ page }).include('.hx-first').analyze();
        expect(audit.violations).toEqual([]);
      };
      await check();
      await trigger.hover();
      await page.waitForTimeout(180);
      await check();
      await page.mouse.down();
      await page.waitForTimeout(180);
      await check();
      await page.mouse.move(1, 1);
      await page.mouse.up();
    }
    await trigger.focus();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Shift+Tab');
    await expect(trigger).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(trigger).toHaveCSS('transition-duration', '0s');
  });
}
for (const width of [1440, 1024, 390, 320])
  for (const placement of ['after', 'hero'])
    test(`refinement ${placement} composition preserves navigation at ${width}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`${base}?variant=A&first=${placement}`);
      const widget = page.locator('.hx-first');
      await expect(widget).toHaveAttribute('data-placement', placement);
      await page.getByRole('link', { name: 'Explorar a biblioteca', exact: false }).focus();
      await expect(
        page.getByRole('link', { name: 'Explorar a biblioteca', exact: false }),
      ).toBeInViewport();
      const trigger = widget.getByRole('button');
      await trigger.focus();
      await trigger.press('Enter');
      await expect(trigger).toHaveAttribute('aria-expanded', 'true');
      await page.keyboard.press('Tab');
      await expect(widget.getByRole('link')).toBeFocused();
      await expect(widget.getByRole('link')).toBeInViewport();
      await page.keyboard.press('Shift+Tab');
      await expect(trigger).toBeFocused();
      const box = await widget.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(width);
      await expect
        .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
        .toBe(true);
      if (placement === 'hero') {
        const cta = await page.locator('.lp-actions').boundingBox();
        expect(cta).not.toBeNull();
        expect(box!.x >= cta!.x + cta!.width || box!.y >= cta!.y + cta!.height).toBe(true);
      }
      const audit = await new AxeBuilder({ page }).include('.hx-first').analyze();
      expect(audit.violations).toEqual([]);
    });
