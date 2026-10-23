import { strict as assert } from 'node:assert';
import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { createServer } from 'node:http';
import { build } from 'vite';
import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const fixture = mkdtempSync(join(tmpdir(), 'terra-l1-'));
const modules = join(fixture, 'node_modules');
mkdirSync(join(modules, '@motion-skills-lab'), { recursive: true });
for (const name of ['motion-tokens', 'motion-recipes']) {
  const dest = join(modules, '@motion-skills-lab', name);
  mkdirSync(dest, { recursive: true });
  cpSync(resolve('packages', name, 'package.json'), join(dest, 'package.json'));
  cpSync(resolve('packages', name, 'dist'), join(dest, 'dist'), { recursive: true });
}
for (const name of ['react', 'react-dom'])
  symlinkSync(
    realpathSync(resolve('packages/motion-recipes/node_modules', name)),
    join(modules, name),
    'junction',
  );
writeFileSync(join(fixture, 'package.json'), JSON.stringify({ type: 'module', private: true }));
writeFileSync(
  join(fixture, 'without-motion.mjs'),
  `
import { strict as assert } from 'node:assert';
import { createElement as h } from 'react'; import { renderToString } from 'react-dom/server';
import { ButtonFeedback } from '@motion-skills-lab/motion-recipes/button-feedback';
import { AsyncStateFeedback } from '@motion-skills-lab/motion-recipes/async-state-feedback';
assert.throws(()=>import.meta.resolve('motion/react'));
assert.ok(renderToString(h(ButtonFeedback,null,'Button')).includes('Button'));
const messages={idle:'Ready',pending:'Pending',success:'Done',error:'Error',cancelled:'Cancelled'};
assert.ok(renderToString(h(AsyncStateFeedback,{state:'idle',messages})).includes('Ready'));
console.log('PASS Button + Async without resolvable Motion in an OS temporary consumer');`,
);
execFileSync(process.execPath, [join(fixture, 'without-motion.mjs')], { stdio: 'inherit' });
symlinkSync(
  realpathSync(resolve('packages/motion-recipes/node_modules/motion')),
  join(modules, 'motion'),
  'junction',
);
cpSync(resolve('scripts/fixtures/l1-consumer'), fixture, { recursive: true });
writeFileSync(
  join(fixture, 'ssr.mjs'),
  `import {createElement} from 'react';import {renderToString} from 'react-dom/server';import {ConsumerRoot} from './hydration-probe.mjs';console.log(renderToString(createElement(ConsumerRoot)));`,
);
const markup = execFileSync(process.execPath, [join(fixture, 'ssr.mjs')], {
  encoding: 'utf8',
}).trim();
assert.ok(markup.includes('SSR input'));
assert.ok(markup.includes('aria-current="page"'));
writeFileSync(
  join(fixture, 'index.html'),
  `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>L1 independent</title><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:16px;font:16px/1.5 sans-serif}*{box-sizing:border-box}button,input{font:inherit;min-height:44px;margin:4px}nav{max-width:260px}main{max-width:800px}input{max-width:100%}</style></head><body><div id="root">${markup}</div><script type="module" src="/client.mjs"></script></body></html>`,
);
await build({
  root: fixture,
  configFile: false,
  logLevel: 'warn',
  define: { 'process.env.NODE_ENV': JSON.stringify('development') },
  build: { outDir: 'build', minify: false },
});
const server = createServer((req, res) => {
  const pathname = new URL(req.url, 'http://localhost').pathname;
  const path = resolve(fixture, 'build', '.' + (pathname === '/' ? '/index.html' : pathname));
  if (
    !path.startsWith(resolve(fixture, 'build') + '/') &&
    !path.startsWith(resolve(fixture, 'build') + '\\')
  ) {
    res.writeHead(403);
    res.end();
    return;
  }
  try {
    res.setHeader(
      'Content-Type',
      path.endsWith('.html') ? 'text/html' : path.endsWith('.css') ? 'text/css' : 'text/javascript',
    );
    res.end(readFileSync(path));
  } catch {
    res.writeHead(404);
    res.end();
  }
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const url = 'http://127.0.0.1:' + server.address().port;
const injectLateMismatch = process.argv.includes('--inject-late-recoverable');
const browser = await chromium.launch();
const results = [];
const hydrationCheckpoints = [];
async function assertHydrationClean(page, checkpoint) {
  const observation = await page.evaluate(() => ({
    committed: window.hydrationCommitted === true,
    errors: window.hydrationErrors,
  }));
  hydrationCheckpoints.push({ checkpoint, ...observation });
  assert.equal(observation.committed, true, `Hydration commit missing: ${checkpoint}`);
  assert.deepEqual(observation.errors, [], `RECOVERABLE_HYDRATION_ERROR: ${checkpoint}`);
}
try {
  const nojs = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await nojs.newPage();
  await staticPage.goto(url);
  assert.equal(await staticPage.getByLabel('Preserved note').inputValue(), 'SSR input');
  assert.equal(await staticPage.locator('[aria-current]').innerText(), 'Overview');
  await nojs.close();
  results.push('SSR readable with JavaScript disabled');
  const context = await browser.newContext({
    viewport: { width: 320, height: 900 },
    reducedMotion: 'no-preference',
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(url + (injectLateMismatch ? '/?probe=late-mismatch' : ''));
  await page.waitForFunction(() => window.hydrationCommitted === true);
  await assertHydrationClean(page, 'initial committed application');
  await page.getByLabel('Preserved note').fill('Keep');
  await page.getByRole('button', { name: 'Toggle', exact: true }).evaluate(async (button) => {
    button.click();
    await new Promise((r) => setTimeout(r, 30));
    if (!document.querySelector('.msl-presence-transition[aria-hidden]'))
      throw Error('Not an exit');
    button.click();
  });
  await page.waitForTimeout(700);
  assert.equal(await page.getByLabel('Preserved note').inputValue(), 'Keep');
  assert.equal(await page.locator('#done').innerText(), 'Exits: 0');
  results.push('Hydration, StrictMode and reversal preserve child state');
  await assertHydrationClean(page, 'after presence reversal');
  await page.getByRole('button', { name: 'Dismiss', exact: true }).click();
  assert.equal(
    await page
      .getByRole('button', { name: 'Toggle', exact: true })
      .evaluate((n) => n === document.activeElement),
    true,
  );
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForFunction(() => !document.querySelector('.msl-presence-transition'));
  assert.equal(await page.locator('#done').innerText(), 'Exits: 1');
  results.push('Focus before exit, live reduction, callback after DOM removal');
  await page.getByRole('button', { name: 'Toggle', exact: true }).click();
  await page.getByRole('button', { name: 'Invalid target', exact: true }).click();
  await page.getByRole('button', { name: 'Dismiss', exact: true }).focus();
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('.msl-presence-transition').count(), 0);
  results.push('Focused close without target uses immediate safe removal');
  await assertHydrationClean(page, 'after focus, reduction and removal');
  const geometry = [];
  for (const state of ['idle', 'pending', 'success', 'error', 'cancelled']) {
    await page.getByRole('button', { name: state, exact: true }).click();
    geometry.push(await page.locator('.msl-async-state-feedback').boundingBox());
  }
  assert.ok(
    geometry.every(
      (g) =>
        Math.abs(g.height - geometry[0].height) < 1 && Math.abs(g.width - geometry[0].width) < 1,
    ),
  );
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 320);
  results.push('Five-state geometry reserved at 320 px');
  await page.getByRole('button', { name: 'Announcement', exact: true }).click();
  assert.equal(await page.locator('.msl-async-state-feedback').getAttribute('role'), null);
  await page.addStyleTag({ content: 'body {font-family: Georgia,serif}' });
  for (const state of ['error', 'pending'])
    await page.getByRole('button', { name: state, exact: true }).click();
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 320);
  results.push('Long Portuguese messages and alternate font, off semantics');
  await page.getByRole('button', { name: 'Select c', exact: true }).click();
  assert.equal(await page.locator('[aria-current]').innerText(), 'Examples');
  await assertHydrationClean(page, 'after async, font and navigation interactions');
  assert.equal(await page.getByTestId('independent-reveal').innerText(), 'Reveal SSR legível');
  assert.equal(await page.getByTestId('independent-group').locator('li').count(), 3);
  await page.getByLabel('Independent group a', { exact: true }).fill('L2 state preserved');
  assert.equal(
    await page.getByLabel('Independent group a', { exact: true }).inputValue(),
    'L2 state preserved',
  );
  assert.equal(await page.getByTestId('independent-progress').getAttribute('aria-hidden'), 'true');
  await assertHydrationClean(page, 'after three independent scroll recipes and native interaction');
  results.push('L2 independent subpaths SSR, hydration, native state and decorative progress');
  const violations = (await new AxeBuilder({ page }).analyze()).violations;
  assert.deepEqual(violations, []);
  await page.waitForFunction(() => window.hydrationCommitted === true);
  assert.equal(await page.evaluate(() => window.hydrationBoundaryCommitted === true), false);
  await page.evaluate(() => window.releaseHydrationProbe());
  await page.waitForFunction(() => window.hydrationBoundaryCommitted === true);
  const lateObservation = await page.evaluate(() => ({
    phase: 'after all application interactions and real delayed boundary commit',
    errors: window.hydrationErrors,
    rootCommitted: window.hydrationCommitted,
    boundaryCommitted: window.hydrationBoundaryCommitted,
  }));
  mkdirSync('.validation', { recursive: true });
  writeFileSync(
    injectLateMismatch
      ? '.validation/l1-hydration-negative-observation.json'
      : '.validation/l1-hydration-positive-observation.json',
    JSON.stringify(lateObservation, null, 2),
  );
  await assertHydrationClean(page, 'after explicitly released late SSR boundary commit');
  assert.deepEqual(errors, []);
  results.push('Independent consumer axe and no browser/hydration errors');
  await context.close();
  const cssless = await browser.newContext();
  const plain = await cssless.newPage();
  await plain.route('**/*.css', (route) => route.abort());
  await plain.goto(url);
  assert.equal(await plain.locator('.msl-async-state-feedback').innerText(), 'Ready');
  assert.equal(
    await plain.getByRole('link', { name: 'Overview', exact: true }).getAttribute('aria-current'),
    'page',
  );
  await plain.waitForFunction(() => window.hydrationCommitted === true);
  await plain.evaluate(() => window.releaseHydrationProbe());
  await plain.waitForFunction(() => window.hydrationBoundaryCommitted === true);
  await assertHydrationClean(plain, 'CSS unavailable, late boundary committed');
  results.push('No CSS: current text only and native current link');
  await cssless.close();
  console.log('PASS', JSON.stringify(results, null, 2));
  mkdirSync('.validation', { recursive: true });
  writeFileSync(
    '.validation/l1-consumer.json',
    JSON.stringify(
      {
        fixture,
        results,
        hydrationCheckpoints,
        passed: true,
        limit:
          'Checks cover explicit commits and the interactions exercised; no finite observation proves absence for arbitrary future asynchronous work.',
      },
      null,
      2,
    ),
  );
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
