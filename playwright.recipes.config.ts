import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './packages/motion-recipes/e2e',
  fullyParallel: false,
  workers: 1,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  reporter: [['list'], ['html', { outputFolder: 'playwright-report/recipes', open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:4175',
    ...devices['Desktop Chrome'],
    trace: 'retain-on-failure',
    video: 'on',
  },
  webServer: {
    command:
      'node packages/motion-recipes/e2e/prepare-ssr.mjs && pnpm exec vite --config packages/motion-recipes/e2e/fixture/vite.config.ts',
    url: 'http://127.0.0.1:4175',
    reuseExistingServer: false,
    timeout: 30000,
  },
});
