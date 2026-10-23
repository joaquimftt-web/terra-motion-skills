import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import { LayoutReflow } from './index';

afterEach(() => vi.unstubAllGlobals());
it.each(['query', 'subscribe', 'cleanup', 'matches', 'motion-query'] as const)(
  'keeps a cold hostile %s preference API static with real Motion imported',
  (failure) => {
    vi.stubGlobal('matchMedia', (queryText: string) => {
      if (
        failure === 'query' ||
        (failure === 'motion-query' && queryText === '(prefers-reduced-motion)')
      )
        throw new Error('Unavailable query');
      return {
        get matches() {
          if (failure === 'matches') throw new Error('Unavailable preference');
          return false;
        },
        addEventListener() {
          if (failure === 'subscribe') throw new Error('Unavailable listener');
        },
        removeEventListener() {
          if (failure === 'cleanup') throw new Error('Unavailable cleanup');
        },
      };
    });
    const first = { id: 'a', content: <input aria-label="Preserved" defaultValue="Alpha" /> };
    const second = { id: 'b', content: 'Bravo' };
    const view = render(<LayoutReflow items={[first, second]} reflowKey={0} />);
    const input = screen.getByRole('textbox');
    const item = input.parentElement;
    fireEvent.change(input, { target: { value: 'Edited' } });
    act(() => input.focus());
    view.rerender(<LayoutReflow items={[second, first]} reflowKey={1} />);
    expect(screen.getByRole('textbox')).toBe(input);
    expect(input.parentElement).toBe(item);
    expect(input).toHaveFocus();
    expect(input).toHaveValue('Edited');
    for (const node of screen.getAllByRole('listitem')) expect(node.style.transform).toBe('none');
    vi.stubGlobal('matchMedia', () => ({
      matches: false,
      addEventListener() {},
      removeEventListener() {},
    }));
    view.rerender(<LayoutReflow items={[first, second]} reflowKey={2} />);
    expect(screen.getByRole('textbox')).toBe(input);
    expect(input.parentElement).toBe(item);
    expect(item?.style.transform).toBe('none');
    expect(() => view.unmount()).not.toThrow();
  },
);

it.each([true, false])(
  'hydrates a static server list with hostile API=%s without replacing pre-hydration inputs',
  async (hostile) => {
    const tree = (
      <LayoutReflow
        items={[
          { id: 'hydrate', content: <input aria-label="Hydrated" defaultValue="Original" /> },
        ]}
        reflowKey={0}
      />
    );
    vi.stubGlobal('matchMedia', () => {
      throw new Error('Server-side DOM shim API unavailable');
    });
    const container = document.createElement('div');
    container.innerHTML = renderToString(tree);
    document.body.append(container);
    const input = container.querySelector('input')!;
    const item = input.parentElement;
    input.value = 'Edited before hydration';
    if (!hostile)
      vi.stubGlobal('matchMedia', () => ({
        matches: false,
        addEventListener() {},
        removeEventListener() {},
      }));
    const recoverable = vi.fn();
    const consoleError = vi.spyOn(console, 'error');
    let root: ReturnType<typeof hydrateRoot>;
    await act(async () => {
      root = hydrateRoot(container, tree, { onRecoverableError: recoverable });
    });
    expect(recoverable).not.toHaveBeenCalled();
    expect(consoleError).not.toHaveBeenCalled();
    expect(container.querySelector('input')).toBe(input);
    expect(input.parentElement).toBe(item);
    expect(input.value).toBe('Edited before hydration');
    act(() => root.unmount());
    container.remove();
  },
);
