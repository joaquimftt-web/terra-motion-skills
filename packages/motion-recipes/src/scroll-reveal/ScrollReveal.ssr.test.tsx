// @vitest-environment node
import { renderToString } from 'react-dom/server';
import { expect, it } from 'vitest';
import { ScrollReveal } from './index';
it('renders complete static HTML without browser globals', () => {
  const html = renderToString(
    <ScrollReveal id="server">
      <p>Servidor legível</p>
    </ScrollReveal>,
  );
  expect(html).toContain('Servidor legível');
  expect(html).not.toContain('transform');
  expect(html).not.toContain('opacity');
  expect(html).not.toContain('aria-hidden');
});
