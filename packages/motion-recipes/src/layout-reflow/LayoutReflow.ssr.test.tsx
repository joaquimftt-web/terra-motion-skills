// @vitest-environment node
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { LayoutReflow } from './index';

describe('LayoutReflow server fallback', () => {
  it('renders readable ordered native elements without DOM or animation APIs', () => {
    expect(typeof window).toBe('undefined');
    const html = renderToString(
      <LayoutReflow
        items={[
          { id: 'server-b', content: 'Bravo' },
          { id: 'server-a', content: <input defaultValue="Alpha" /> },
        ]}
        reflowKey={0}
      />,
    );
    expect(html).toContain('<ul>');
    expect(html.indexOf('server-b')).toBeLessThan(html.indexOf('server-a'));
    expect(html).toContain('value="Alpha"');
    expect(html).not.toContain('translate');
    expect(html).not.toContain('opacity:0');
  });
});
