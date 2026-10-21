import { defineConfig, devices } from '@playwright/test';

const base = process.env.SHOWCASE_BASE_PATH ?? '/';
if (!['/', '/terra-motion-skills/'].includes(base)) {
  throw new Error('SHOWCASE_BASE_PATH must be / or /terra-motion-skills/');
}
// Recipe regression tests target the lab; landing/reference tests use explicit routes.
const baseURL = `http://127.0.0.1:4173${base}lab/`;

export default defineConfig({
  testDir: './apps/showcase/tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    ...devices['Desktop Chrome'],
  },
  webServer: {
    command: 'pnpm --filter @motion-skills-lab/showcase preview --host 127.0.0.1',
    url: baseURL,
    reuseExistingServer: false,
    timeout: 30_000,
  },
});
