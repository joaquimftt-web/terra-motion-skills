import { render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { LayoutReflow } from './index';
afterEach(() => vi.unstubAllGlobals());
it('keeps native content static without requestAnimationFrame', () => {
  vi.stubGlobal('requestAnimationFrame', undefined);
  const view = render(<LayoutReflow items={[{ id: 'a', content: 'Alpha' }]} reflowKey={0} />);
  view.rerender(<LayoutReflow items={[{ id: 'b', content: 'Bravo' }]} reflowKey={1} />);
  expect(screen.getByText('Bravo')).toBeVisible();
  expect(screen.getByRole('listitem').style.transform).toBe('none');
});
