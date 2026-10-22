// @vitest-environment node
import { renderToString } from 'react-dom/server';
import { expect, it } from 'vitest';
import { StaggeredEntrance } from '../staggered-entrance/index';
import { ScrollProgress } from './index';

it('SSR renders the entire semantic group, without hidden content or a browser', () => {
  expect(typeof window).toBe('undefined');
  const html = renderToString(
    <StaggeredEntrance
      items={[{ id: 'a' }, { id: 'b' }]}
      getKey={(item) => item.id}
      renderItem={(item) => <button>{item.id}</button>}
    />,
  );
  expect(html).toContain('<ul>');
  expect(html.match(/<li>/g)).toHaveLength(2);
  expect(html).not.toMatch(/transform|inert|aria-hidden/);
});
it('SSR progress is decorative and inactive with null refs; no DOM is consulted', () => {
  const html = renderToString(
    <ScrollProgress
      source={{ type: 'container', containerRef: { current: null }, contentRef: { current: null } }}
    />,
  );
  expect(html).toContain('aria-hidden="true"');
  expect(html).toContain('scaleX(0)');
  expect(html).toContain('visibility:hidden');
  expect(html).not.toMatch(/role=|tabindex=|aria-live=/);
});
