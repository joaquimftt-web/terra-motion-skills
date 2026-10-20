import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const workspaceRoot = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: workspaceRoot,
  test: {
    include: ['packages/**/*.test.{ts,tsx}', 'apps/**/*.test.{ts,tsx}'],
    environment: 'jsdom',
    setupFiles: [resolve(workspaceRoot, 'vitest.setup.ts')],
    restoreMocks: true,
    clearMocks: true,
  },
});
