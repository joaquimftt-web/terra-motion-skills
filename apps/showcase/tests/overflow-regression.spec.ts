import { expect, test } from '@playwright/test';
import { writeFile } from 'node:fs/promises';

test('laboratory fits viewport before and after focus with diagnostic geometry', async ({
  page,
}, testInfo) => {
  const measurements = [];
  for (const width of [320, 390, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('./');
    for (const state of ['initial', 'stable', 'focused']) {
      if (state === 'stable') {
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(500);
      }
      if (state === 'focused') {
        await page.getByRole('button', { name: 'Confirmar interação' }).focus();
        await page.keyboard.press('Space');
      }
      const geometry = await page.evaluate(() => {
        function describe(el: Element) {
          const rect = el.getBoundingClientRect();
          const style = getComputedStyle(el);
          return {
            tag: el.tagName,
            class: el.className,
            text: el.textContent?.trim().slice(0, 100),
            left: rect.left,
            right: rect.right,
            width: rect.width,
            clientWidth: el.clientWidth,
            scrollWidth: el.scrollWidth,
            display: style.display,
            minWidth: style.minWidth,
            maxWidth: style.maxWidth,
            grid: style.gridTemplateColumns,
            flex: style.flex,
            flexWrap: style.flexWrap,
            whiteSpace: style.whiteSpace,
            overflowX: style.overflowX,
            font: style.font,
          };
        }
        const offenders = [...document.querySelectorAll('body *')]
          .filter((el) => {
            const r = el.getBoundingClientRect();
            return el.getClientRects().length && (r.right > innerWidth || r.left < 0);
          })
          .slice(0, 60)
          .map((el) => {
            const parents = [];
            let ancestor = el.parentElement;
            for (let i = 0; ancestor && i < 5; i++, ancestor = ancestor.parentElement)
              parents.push(describe(ancestor));
            return { element: describe(el), parents };
          });
        const canvas = document.createElement('canvas').getContext('2d');
        const font = getComputedStyle(document.body).font;
        if (canvas) canvas.font = font;
        return {
          innerWidth,
          scrollWidth: document.documentElement.scrollWidth,
          fontsStatus: document.fonts.status,
          font,
          sampleWidth: canvas?.measureText('Repetir transição').width,
          summary: [...document.querySelectorAll('.lab-summary,.lab-summary > div')].map(describe),
          offenders,
          code: [...document.querySelectorAll('.code-example pre')].map(describe),
        };
      });
      measurements.push({ width, state, ...geometry });
      console.log(
        'OVERFLOW_GEOMETRY ' +
          JSON.stringify({
            width,
            state,
            innerWidth: geometry.innerWidth,
            scrollWidth: geometry.scrollWidth,
            summary: geometry.summary,
          }),
      );
    }
    const summaryImage = await page.locator('.lab-summary').screenshot();
    console.log(`OVERFLOW_SUMMARY_PNG ${width} ${summaryImage.toString('base64')}`);
    await page.screenshot({ path: testInfo.outputPath(`laboratory-${width}.png`), fullPage: true });
  }
  await writeFile(
    testInfo.outputPath('overflow-diagnostics.json'),
    JSON.stringify({ platform: process.platform, measurements }, null, 2),
  );
  await testInfo.attach('geometry', {
    path: testInfo.outputPath('overflow-diagnostics.json'),
    contentType: 'application/json',
  });
  expect(measurements.filter((m) => m.scrollWidth > m.innerWidth)).toEqual([]);
});
