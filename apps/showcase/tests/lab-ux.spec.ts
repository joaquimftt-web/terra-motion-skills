import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
function clickNative(node: HTMLElement | SVGElement) {
  if (!(node instanceof HTMLElement)) throw new Error('Expected a native HTML control');
  node.click();
}

for (const width of [320, 390, 1024, 1440])
  test(`foundations have consistent inner space and aligned actions at ${width}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1200 });
    await page.goto('');
    const section = page.locator('#fundamentos');
    const result = await section.evaluate((node) => {
      const s = getComputedStyle(node),
        r = node.getBoundingClientRect();
      return {
        padding: [s.paddingTop, s.paddingRight, s.paddingBottom, s.paddingLeft],
        lefts: [...node.children].map((n) => n.getBoundingClientRect().left - r.left),
        scroll: document.documentElement.scrollWidth,
      };
    });
    const pad = width <= 600 ? 16 : 24;
    expect(result.padding).toEqual(Array(4).fill(pad + 'px'));
    for (const left of result.lefts) expect(left).toBeGreaterThanOrEqual(pad);
    expect(result.scroll).toBe(width);
    expect((await new AxeBuilder({ page }).include('#fundamentos').analyze()).violations).toEqual(
      [],
    );
  });

test.use({ permissions: ['clipboard-read', 'clipboard-write'] });
const recipes = [
  ['button-feedback', 'Duração do Button Feedback', 'Button Feedback', 140],
  ['accordion-transition', 'Duração do Accordion', 'Accordion Transition', 180],
  ['presence-transition', 'Duração da presença', 'Presence Transition', 180],
  ['async-state-feedback', 'Duração do feedback', 'Async State Feedback', 160],
  ['navigation-indicator', 'Duração do indicador', 'Navigation Indicator', 180],
] as const;
for (const [id, label, name, defaultValue] of recipes)
  test(`${name}: accessible real duration, keyboard, reset and clipboard agree`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('');
    const demo = page.locator('#' + id),
      slider = demo.getByRole('slider', { name: label });
    await expect(slider).toHaveValue(String(defaultValue));
    for (const value of [0, defaultValue, 800]) {
      await slider.fill(String(value));
      await expect(demo.locator('.duration-control output')).toHaveText(value + ' ms');
      await demo.getByRole('button', { name: 'Copiar exemplo ' + name, exact: true }).click();
      expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
        id === 'button-feedback' ? `${value}ms` : `duration={${value}}`,
      );
    }
    await slider.focus();
    await slider.press('Home');
    await expect(slider).toHaveValue('0');
    await slider.press('ArrowRight');
    await expect(slider).toHaveValue('10');
    await slider.press('End');
    await expect(slider).toHaveValue('800');
    await expect(slider).toHaveAttribute('aria-valuetext', '800 milissegundos');
    await demo
      .getByRole('button', { name: 'Restaurar padrão (' + defaultValue + ' ms)', exact: true })
      .click();
    await expect(slider).toHaveValue(String(defaultValue));
  });

test('Button uses real 800ms color transitions, live updates and immediate zero', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('');
  const demo = page.locator('#button-feedback'),
    button = demo.getByRole('button', { name: 'Confirmar interação' }),
    slider = demo.getByLabel('Duração do Button Feedback');
  await slider.fill('800');
  await page.mouse.move(1, 1);
  await page.waitForTimeout(200);
  await button.hover();
  await expect(button).toHaveCSS('transition-duration', '0.8s');
  const timings = await button.evaluate((n) =>
    n
      .getAnimations()
      .map((a) => ({ duration: a.effect?.getTiming().duration, time: a.currentTime })),
  );
  expect(timings.some((a) => a.duration === 800 && Number(a.time) < 800)).toBe(true);
  await slider.fill('0');
  await page.mouse.move(1, 1);
  await button.hover();
  await expect(button).toHaveCSS('transition-duration', '0s');
  expect(await button.evaluate((n) => n.getAnimations().length)).toBe(0);
});

test('Presence exits over 800ms, retimes immediately to zero and never repeats old completion', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('');
  const demo = page.locator('#presence-transition'),
    slider = demo.getByLabel('Duração da presença');
  await slider.fill('800');
  await demo.getByRole('button', { name: 'Alternar presença', exact: true }).evaluate(clickNative);
  await page.waitForTimeout(70);
  const root = demo.locator('.msl-presence-transition');
  await expect(root).toHaveAttribute('aria-hidden', 'true');
  const opacity = await root.evaluate((n) => Number(getComputedStyle(n).opacity));
  expect(opacity).toBeGreaterThan(0);
  expect(opacity).toBeLessThan(1);
  await slider.fill('0');
  await expect(root).toHaveCount(0);
  await expect(demo.getByText('Saídas concluídas: 1', { exact: true })).toBeVisible();
  await page.waitForTimeout(850);
  await expect(demo.getByText('Saídas concluídas: 1', { exact: true })).toBeVisible();
});

test('Async immediately reports real result while only its marker takes 800ms', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('');
  const demo = page.locator('#async-state-feedback');
  await demo.getByLabel('Duração do feedback').fill('800');
  await demo.getByRole('button', { name: 'Resultado imediato', exact: true }).click();
  await expect(demo.locator('.msl-async-state-feedback')).toHaveAttribute('data-state', 'success');
  await expect(demo.locator('.msl-async-state-feedback__message')).toHaveText(
    'Operação de demonstração concluída.',
  );
  const marker = demo.locator('.msl-async-state-feedback__marker');
  await expect(marker).toHaveCSS('transition-duration', '0.8s');
  const opacity = await marker.evaluate((n) => Number(getComputedStyle(n).opacity));
  expect(opacity).toBeLessThan(1);
  expect(opacity).toBeGreaterThanOrEqual(0.65);
  await demo.getByLabel('Duração do feedback').fill('0');
  await expect(marker).toHaveCSS('transition-duration', '0s');
  await expect(marker).toHaveCSS('opacity', '1');
});

test('Navigation follows true selection during an 800ms move, and zero snaps remaining travel', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('');
  const demo = page.locator('#navigation-indicator'),
    nav = demo.locator('nav');
  await nav.getByRole('link', { name: 'Visão geral', exact: true }).click();
  await page.waitForTimeout(220);
  await demo.getByLabel('Duração do indicador').fill('800');
  await nav.getByRole('link', { name: 'Exemplos', exact: true }).evaluate(clickNative);
  await page.waitForTimeout(60);
  await expect(nav.getByRole('link', { name: 'Exemplos', exact: true })).toHaveAttribute(
    'aria-current',
    'location',
  );
  const distance = () =>
    nav.evaluate((n) =>
      Math.abs(
        n.querySelector('[aria-current]')!.getBoundingClientRect().left -
          n.querySelector('.msl-navigation-indicator__line')!.getBoundingClientRect().left,
      ),
    );
  expect(await distance()).toBeGreaterThan(2);
  await demo.getByLabel('Duração do indicador').fill('0');
  expect(await distance()).toBeLessThan(1);
  await page.waitForTimeout(850);
  expect(await distance()).toBeLessThan(1);
});

test('Accordion cancels pending replay on retiming and height settles immediately at zero', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('');
  const demo = page.locator('#accordion-transition'),
    slider = demo.getByLabel('Duração do Accordion'),
    panel = page.locator('#demo-accordion-panel');
  await slider.fill('800');
  await demo.getByRole('button', { name: 'Repetir transição' }).click();
  await page.waitForTimeout(40);
  expect(await panel.evaluate((n) => n.getBoundingClientRect().height)).toBeGreaterThan(0);
  await slider.fill('0');
  await expect(panel).toHaveCSS('height', '0px');
  await page.waitForTimeout(850);
  await expect(page.locator('#demo-accordion-trigger')).toHaveAttribute('aria-expanded', 'false');
  await expect(demo.locator('.replay-status')).toHaveText('Repetições: 0');
  await demo.getByRole('button', { name: 'Repetir transição' }).click();
  await expect(page.locator('#demo-accordion-trigger')).toHaveAttribute('aria-expanded', 'true');
});

test('rapid slider changes retain the selected value and system reduction overrides all five at 800ms', async ({
  page,
}) => {
  await page.goto('');
  for (const [id, label] of recipes) {
    const slider = page.locator('#' + id).getByLabel(label);
    for (const value of [800, 0, 370, 10, 800]) await slider.fill(String(value));
    await expect(slider).toHaveValue('800');
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const [id] of recipes)
    await expect(page.locator('#' + id + ' .duration-reduced')).toContainText('0 ms');
  await expect(page.getByRole('button', { name: 'Confirmar interação' })).toHaveCSS(
    'transition-duration',
    '0s',
  );
  await expect(page.locator('.msl-async-state-feedback__marker')).toHaveCSS(
    'transition-duration',
    '0s',
  );
  const presence = page.locator('#presence-transition');
  await presence.getByRole('button', { name: 'Alternar presença', exact: true }).click();
  await expect(presence.locator('.msl-presence-transition')).toHaveCount(0);
  await page.locator('#demo-accordion-trigger').click();
  await expect(page.locator('#demo-accordion-panel')).toHaveCSS('height', '0px');
  const nav = page.locator('#navigation-indicator nav');
  await nav.getByRole('link', { name: 'Exemplos', exact: true }).click();
  const difference = await nav.evaluate((n) =>
    Math.abs(
      n.querySelector('[aria-current]')!.getBoundingClientRect().left -
        n.querySelector('.msl-navigation-indicator__line')!.getBoundingClientRect().left,
    ),
  );
  expect(difference).toBeLessThan(1);
});

test('a live system preference interrupts all five demonstrations selected at 800ms', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('');
  for (const [id, label] of recipes)
    await page
      .locator('#' + id)
      .getByRole('slider', { name: label })
      .fill('800');
  const nav = page.locator('#navigation-indicator nav');
  await nav.getByRole('link', { name: 'Visão geral', exact: true }).click();
  await page.waitForTimeout(100);
  await page.getByRole('button', { name: 'Confirmar interação' }).hover();
  await nav.getByRole('link', { name: 'Exemplos', exact: true }).evaluate(clickNative);
  await page
    .locator('#presence-transition')
    .getByRole('button', { name: 'Alternar presença', exact: true })
    .evaluate(clickNative);
  await page.locator('#demo-accordion-trigger').evaluate(clickNative);
  await page
    .locator('#async-state-feedback')
    .getByRole('button', { name: 'Resultado imediato', exact: true })
    .evaluate(clickNative);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('#presence-transition .msl-presence-transition')).toHaveCount(0);
  await expect(page.locator('#demo-accordion-panel')).toHaveCSS('height', '0px');
  await expect(page.getByRole('button', { name: 'Confirmar interação' })).toHaveCSS(
    'transition-duration',
    '0s',
  );
  await expect(page.locator('.msl-async-state-feedback__marker')).toHaveCSS(
    'transition-duration',
    '0s',
  );
  await expect(page.locator('.msl-async-state-feedback__marker')).toHaveCSS('opacity', '1');
  await expect
    .poll(() =>
      nav.evaluate((n) =>
        Math.abs(
          n.querySelector('[aria-current]')!.getBoundingClientRect().left -
            n.querySelector('.msl-navigation-indicator__line')!.getBoundingClientRect().left,
        ),
      ),
    )
    .toBeLessThan(1);
  await page.waitForTimeout(850);
  await expect(
    page.locator('#presence-transition').getByText('Saídas concluídas: 1', { exact: true }),
  ).toBeVisible();
});
