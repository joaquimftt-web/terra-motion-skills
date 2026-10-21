import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const base = process.env.SHOWCASE_BASE_PATH ?? '/';
if (!['/', '/terra-motion-skills/'].includes(base)) {
  throw new Error('SHOWCASE_BASE_PATH must be / or /terra-motion-skills/');
}

export default defineConfig({
  base,
  plugins: [
    react(),
    {
      name: 'local-prototype-static-pages',
      apply: 'build',
      closeBundle() {
        const html = readFileSync(resolve('dist/index.html'), 'utf8');
        for (const route of ['lab', 'referencias']) {
          mkdirSync(resolve('dist', route), { recursive: true });
          writeFileSync(resolve('dist', route, 'index.html'), html);
        }
      },
    },
  ],
  server: { host: '127.0.0.1' },
  preview: { host: '127.0.0.1', port: 4173, strictPort: true },
});
