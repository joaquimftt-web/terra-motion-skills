import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  publicDir: fileURLToPath(new URL('../../../../.validation/recipe-e2e', import.meta.url)),
  plugins: [
    react(),
    {
      name: 'recipe-ssr-fixture',
      configureServer(server) {
        for (const filename of [
          'ssr.html',
          'progress-ssr.html',
          'layout-ssr.html',
          'expandable-ssr.html',
          'expandable-twins.html',
          'expandable-roots.html',
        ])
          server.middlewares.use('/' + filename, async (_req, res, next) => {
            try {
              const source = readFileSync(
                fileURLToPath(
                  new URL('../../../../.validation/recipe-e2e/' + filename, import.meta.url),
                ),
                'utf8',
              );
              const html = await server.transformIndexHtml('/' + filename, source);
              res.setHeader('Content-Type', 'text/html');
              res.end(html);
            } catch (error) {
              next(error);
            }
          });
      },
    },
  ],
  server: {
    host: '127.0.0.1',
    port: 4175,
    strictPort: true,
    fs: { allow: [fileURLToPath(new URL('../../../../', import.meta.url))] },
  },
});
