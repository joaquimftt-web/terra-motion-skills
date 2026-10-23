import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('presence transfers focus and removes DOM before its completion report', async ({ page }) => {
  await page.goto('');
  const demo = page.locator('#presence-transition');
  await demo.getByLabel('Nota preservada').fill('Keep this value');
  await demo.getByRole('button', { name: 'Dispensar bloco', exact: true }).click();
  await expect(demo.getByRole('button', { name: 'Alternar presença', exact: true })).toBeFocused();
  await expect(demo.locator('.msl-presence-transition')).toHaveCount(0);
  await expect(demo.getByText('Saídas concluídas: 1', { exact: true })).toBeVisible();
});

test('presence rapid reversal retains children and invalidates old completion', async ({
  page,
}) => {
  await page.goto('');
  const demo = page.locator('#presence-transition');
  await demo.getByLabel('Nota preservada').fill('Unchanged');
  const toggle = demo.getByRole('button', { name: 'Alternar presença', exact: true });
  // Playwright actionability may wait beyond the exit; schedule both requests in
  // the browser and prove that reversal precedes removal instead of racing workers.
  const reversedBeforeRemoval = await toggle.evaluate(async (button) => {
    (button as HTMLButtonElement).click();
    await new Promise((resolve) => setTimeout(resolve, 35));
    const retained = document.querySelector('#presence-transition .msl-presence-transition');
    const exiting = Boolean(retained?.hasAttribute('aria-hidden'));
    (button as HTMLButtonElement).click();
    return exiting;
  });
  expect(reversedBeforeRemoval).toBe(true);
  await page.waitForTimeout(300);
  await expect(demo.getByLabel('Nota preservada')).toHaveValue('Unchanged');
  await expect(demo.getByText('Saídas concluídas: 0', { exact: true })).toBeVisible();
  await expect(demo.locator('.msl-presence-transition')).not.toHaveAttribute('inert');
});

test('async fixture reports cancellation, failure, retry, immediate and obsolete results truthfully', async ({
  page,
}) => {
  await page.goto('');
  const demo = page.locator('#async-state-feedback');
  await expect(
    demo.getByText('Simulação controlada para demonstração; nenhuma gravação de dados.', {
      exact: true,
    }),
  ).toBeVisible();
  await demo.getByRole('button', { name: 'Iniciar operação', exact: true }).click();
  await expect(demo.locator('.msl-async-state-feedback')).toHaveAttribute('data-state', 'pending');
  await demo.getByRole('button', { name: 'Cancelar operação', exact: true }).click();
  await expect(demo.locator('.msl-async-state-feedback')).toHaveAttribute(
    'data-state',
    'cancelled',
  );
  await demo.getByRole('button', { name: 'Iniciar operação', exact: true }).click();
  await demo.getByRole('button', { name: 'Simular falha', exact: true }).click();
  await expect(demo.locator('.msl-async-state-feedback')).toHaveAttribute('data-state', 'error');
  await demo.getByRole('button', { name: 'Resultado imediato', exact: true }).click();
  await expect(demo.locator('.msl-async-state-feedback')).toHaveAttribute('data-state', 'success');
  await demo.getByRole('button', { name: 'Testar resposta vencida', exact: true }).click();
  await expect(demo.locator('.msl-async-state-feedback')).toHaveAttribute('data-state', 'success');
  await expect(demo.getByText(/Retornos ignorados: [1-9]/)).toBeVisible();
});

test('async off keeps its node and text while delegating announcement', async ({ page }) => {
  await page.goto('');
  const demo = page.locator('#async-state-feedback');
  await demo.locator('.msl-async-state-feedback').evaluate((node) => {
    (window as unknown as { originalFeedback: Element }).originalFeedback = node;
  });
  await demo.getByLabel('Delegar anúncio ao produto').check();
  const status = demo.locator('.msl-async-state-feedback');
  for (const attribute of ['role', 'aria-live', 'aria-atomic', 'aria-hidden'])
    await expect(status).not.toHaveAttribute(attribute);
  expect(
    await status.evaluate(
      (node) => node === (window as unknown as { originalFeedback: Element }).originalFeedback,
    ),
  ).toBe(true);
  await expect(status).toBeVisible();
});

test('navigation follows real hashes and back/forward without selecting focused links', async ({
  page,
}) => {
  await page.goto('');
  const demo = page.locator('#navigation-indicator');
  const nav = demo.getByRole('navigation', { name: 'Destinos da demonstração' });
  await nav.getByRole('link', { name: 'Visão geral', exact: true }).click();
  await expect(page).toHaveURL(/#m05-demo-overview$/);
  await expect(nav.getByRole('link', { name: 'Visão geral', exact: true })).toHaveAttribute(
    'aria-current',
    'location',
  );
  await nav.getByRole('link', { name: 'Detalhes', exact: true }).focus();
  await expect(nav.getByRole('link', { name: 'Visão geral', exact: true })).toHaveAttribute(
    'aria-current',
    'location',
  );
  await nav.getByRole('link', { name: 'Detalhes', exact: true }).press('Enter');
  await expect(page).toHaveURL(/#m05-demo-details$/);
  await page.goBack();
  await expect(nav.getByRole('link', { name: 'Visão geral', exact: true })).toHaveAttribute(
    'aria-current',
    'location',
  );
  await page.goForward();
  await expect(nav.getByRole('link', { name: 'Detalhes', exact: true })).toHaveAttribute(
    'aria-current',
    'location',
  );
  await page.reload();
  await expect(nav.getByRole('link', { name: 'Detalhes', exact: true })).toHaveAttribute(
    'aria-current',
    'location',
  );
});

test('navigation remains aligned inside a scrolled rail and retargets the current selection', async ({
  page,
}) => {
  await page.goto('');
  const demo = page.locator('#navigation-indicator');
  await demo.getByLabel('Largura da navegação').fill('180');
  await demo.getByLabel('Rótulos longos').check();
  const nav = demo.getByRole('navigation', { name: 'Destinos da demonstração' });
  const links = nav.getByRole('link');
  for (const index of [0, 1, 2]) {
    await links.nth(index).click();
    await page.waitForTimeout(25);
  }
  await page.waitForTimeout(280);
  await nav.locator('.msl-navigation-indicator__viewport').evaluate((node) => {
    node.scrollLeft = 125;
  });
  const geometry = await nav.evaluate((node) => {
    const link = node.querySelector('[aria-current]')!.getBoundingClientRect();
    const marker = node.querySelector('.msl-navigation-indicator__line')!.getBoundingClientRect();
    return {
      left: Math.abs(link.left - marker.left),
      width: Math.abs(link.width - marker.width),
      ready: node.hasAttribute('data-indicator-ready'),
    };
  });
  expect(geometry.ready).toBe(true);
  expect(geometry.left).toBeLessThan(1);
  expect(geometry.width).toBeLessThan(1);
});

for (const width of [320, 390, 1024, 1440]) {
  test(`state recipes remain operable without overflow and axe violations at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('');
    for (const id of ['presence-transition', 'async-state-feedback', 'navigation-indicator']) {
      const demo = page.locator('#' + id);
      await demo.scrollIntoViewIfNeeded();
      expect((await new AxeBuilder({ page }).include('#' + id).analyze()).violations).toEqual([]);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
  });
}

test('live reduction interrupts presence, navigation and CSS feedback without stale work', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('');
  const presence = page.locator('#presence-transition');
  await presence.getByRole('button', { name: 'Alternar presença', exact: true }).click();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(presence.locator('.msl-presence-transition')).toHaveCount(0);
  await expect(presence.getByText('Saídas concluídas: 1', { exact: true })).toBeVisible();
  const nav = page.locator('#navigation-indicator nav');
  await nav.getByRole('link', { name: 'Detalhes', exact: true }).click();
  const transform = await nav
    .locator('.msl-navigation-indicator__line')
    .evaluate((n) => getComputedStyle(n).transform);
  await page.waitForTimeout(280);
  expect(
    await nav
      .locator('.msl-navigation-indicator__line')
      .evaluate((n) => getComputedStyle(n).transform),
  ).toBe(transform);
  expect(
    await page
      .locator('.msl-async-state-feedback__marker')
      .evaluate((n) => getComputedStyle(n).transitionDuration),
  ).toBe('0s');
});

test('manual navigation replay creates one history entry and native touch links work', async ({
  browser,
}) => {
  const context = await browser.newContext({
    hasTouch: true,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto(test.info().project.use.baseURL!);
  const demo = page.locator('#navigation-indicator');
  const before = await page.evaluate(() => history.length);
  await demo.getByRole('button', { name: 'Próximo destino / replay', exact: true }).tap();
  await expect(page).toHaveURL(/#m05-demo-overview$/);
  expect(await page.evaluate(() => history.length)).toBe(before + 1);
  await demo.getByRole('link', { name: 'Detalhes', exact: true }).tap();
  await expect(page).toHaveURL(/#m05-demo-details$/);
  await context.close();
});

for (const failure of ['missing', 'throws'] as const) {
  test(`native navigation remains usable when ResizeObserver ${failure}`, async ({ page }) => {
    await page.addInitScript((mode) => {
      Object.defineProperty(window, 'ResizeObserver', {
        configurable: true,
        value:
          mode === 'missing'
            ? undefined
            : class {
                observe() {
                  throw Error('Observer unavailable');
                }
                disconnect() {}
              },
      });
    }, failure);
    await page.goto('');
    const nav = page.locator('#navigation-indicator nav');
    await nav.getByRole('link', { name: 'Exemplos', exact: true }).click();
    await expect(page).toHaveURL(/#m05-demo-examples$/);
    await expect(nav.getByRole('link', { name: 'Exemplos', exact: true })).toHaveAttribute(
      'aria-current',
      'location',
    );
    await expect(nav.locator('.msl-navigation-indicator__line')).toBeHidden();
    expect(
      await nav
        .getByRole('link', { name: 'Exemplos', exact: true })
        .evaluate((n) => getComputedStyle(n).borderBottomColor),
    ).not.toBe('rgba(0, 0, 0, 0)');
  });
}

test('navigation geometry recovers from hidden layout, resize and font changes', async ({
  page,
}) => {
  await page.goto('');
  const demo = page.locator('#navigation-indicator'),
    nav = demo.locator('nav');
  await nav.getByRole('link', { name: 'Detalhes', exact: true }).click();
  await nav.evaluate((n) => (n.style.display = 'none'));
  await expect(nav.locator('.msl-navigation-indicator__line')).toBeHidden();
  await nav.evaluate((n) => (n.style.display = ''));
  await page.setViewportSize({ width: 390, height: 900 });
  await page.addStyleTag({
    content: '#navigation-indicator nav {font-family:Georgia,serif;font-size:20px}',
  });
  await expect
    .poll(() =>
      nav.evaluate((n) => {
        const a = n.querySelector('[aria-current]')!.getBoundingClientRect(),
          b = n.querySelector('.msl-navigation-indicator__line')!.getBoundingClientRect();
        return Math.abs(a.left - b.left) + Math.abs(a.width - b.width);
      }),
    )
    .toBeLessThan(1);
  await expect(nav.locator('.msl-navigation-indicator__line')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
});
