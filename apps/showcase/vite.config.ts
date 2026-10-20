import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const base = process.env.SHOWCASE_BASE_PATH ?? '/';
if (!['/', '/terra-motion-skills/'].includes(base)) {
  throw new Error('SHOWCASE_BASE_PATH must be / or /terra-motion-skills/');
}

export default defineConfig({
  base,
  plugins: [react()],
  server: { host: '127.0.0.1' },
  preview: { host: '127.0.0.1', port: 4173, strictPort: true },
});
