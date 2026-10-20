import { expect, test } from '@playwright/test';

for (const width of [1440, 1024, 390, 320]) {
  test(`A1 legibility and control sizing at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page).toHaveTitle('Terra Motion Skills — Interações com intenção');
    const brand = page.getByRole('link', { name: 'Terra Motion Skills início' });
    await expect(brand).toBeVisible();
    expect(await brand.evaluate((el) => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
    for (const pre of await page.locator('.code-example pre').all()) {
      await expect(pre).toHaveCSS('font-size', '14px');
      await expect(pre).toHaveCSS('white-space', 'pre');
      await pre.focus();
      await expect(pre).toBeFocused();
      if (await pre.evaluate((el) => el.scrollWidth > el.clientWidth)) {
        await page.keyboard.press('ArrowRight');
        await expect.poll(() => pre.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0);
      }
    }
    const audit = await page.evaluate(() => {
      const selectors =
        '.eyebrow,.nav-caption,.nav-index,.recipe-nav a,.topbar,.topbar a,.lab-summary span:not(.summary-mark),.recipe-title .eyebrow,.technology-tag,.panel-bar,.mono,.stage-hint,.activation-output,.checkbox-label,.code-example__bar,.copy-status,.resource-links,.dependency-note,.stage-caption,.state-tag,.duration-control,.replay-status,.principles article > span,.foundation-links,footer p,.footer-version';
      return {
        undersized: [...document.querySelectorAll(selectors)]
          .filter(
            (el) => el.getClientRects().length && parseFloat(getComputedStyle(el).fontSize) < 12,
          )
          .map((el) => ({ class: el.className, size: getComputedStyle(el).fontSize })),
        overflow: document.documentElement.scrollWidth > innerWidth,
        clippedBars: [
          ...document.querySelectorAll(
            '.topbar,.panel-bar,.code-example__bar,.demo-controls,.lab-summary,.motion-preference',
          ),
        ]
          .filter((el) => el.scrollWidth > el.clientWidth + 1)
          .map((el) => el.className),
      };
    });
    expect(audit.undersized).toEqual([]);
    expect(audit.overflow).toBe(false);
    expect(audit.clippedBars).toEqual([]);
    for (const button of await page.locator('.copy-button,.replay-controls button').all()) {
      await expect(button).toHaveCSS('font-size', '14px');
      expect((await button.boundingBox())!.height).toBeGreaterThanOrEqual(width <= 760 ? 44 : 40);
    }
  });
}
