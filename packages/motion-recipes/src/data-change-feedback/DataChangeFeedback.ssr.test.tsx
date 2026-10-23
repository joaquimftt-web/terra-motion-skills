// @vitest-environment node
import { renderToString } from 'react-dom/server';
import { expect, it } from 'vitest';
import { DataChangeFeedback } from './index';

it('renders static current text without DOM, browser geometry or animation APIs', () => {
  expect(typeof window).toBe('undefined');
  const html = renderToString(<DataChangeFeedback value="01,25 unidades" />);
  expect(html).toContain('01,25 unidades');
  expect(html).not.toContain('Valor atualizado');
  expect(html).not.toContain('aria-live');
  expect(html).not.toContain('role=');
});

it('keeps only one formatted current value in polite server markup', () => {
  const html = renderToString(
    <DataChangeFeedback
      value={5}
      announcement="polite"
      formatValue={(value) => `Quantidade: ${value}`}
    />,
  );
  expect(html.match(/Quantidade: 5/g)).toHaveLength(1);
  expect(html).toContain('aria-live="polite"');
  expect(html).not.toContain('Valor atualizado');
});
