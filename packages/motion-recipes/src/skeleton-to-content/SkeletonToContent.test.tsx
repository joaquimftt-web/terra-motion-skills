import { StrictMode, createRef } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SkeletonToContent } from './SkeletonToContent.js';

afterEach(() => vi.unstubAllGlobals());

describe('SkeletonToContent', () => {
  it('keeps initial skeleton inert and outside announcements, then exposes usable content immediately', () => {
    const click = vi.fn();
    const child = <button onClick={click}>Real action</button>;
    const view = render(
      <SkeletonToContent
        loading
        skeleton={<button>Placeholder</button>}
        data-testid="region"
        minBlockSize={140}
      >
        {child}
      </SkeletonToContent>,
    );
    const region = screen.getByTestId('region');
    expect(region).toHaveAttribute('aria-busy', 'true');
    expect(region).toHaveStyle({ minBlockSize: '140px' });
    expect(screen.getByText('Placeholder').closest('[inert]')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
    expect(screen.queryByRole('button')).toBeNull();
    const status = screen.getByRole('status');
    expect(region.contains(status)).toBe(false);
    expect(status).toHaveTextContent('Carregando conteúdo.');
    view.rerender(
      <SkeletonToContent loading={false} skeleton="Placeholder" data-testid="region">
        {child}
      </SkeletonToContent>,
    );
    const button = screen.getByRole('button');
    expect(button).toBeVisible();
    expect(button.closest('[inert], [aria-hidden="true"]')).toBeNull();
    expect(screen.queryByText('Placeholder')).toBeNull();
    fireEvent.click(button);
    expect(click).toHaveBeenCalledOnce();
    expect(region).toHaveAttribute('aria-busy', 'false');
    expect(status).toHaveTextContent('Conteúdo disponível.');
  });

  it('preserves the same content DOM, input value and focus through rapid reloading', () => {
    const tree = (loading: boolean) => (
      <SkeletonToContent loading={loading} skeleton="Skeleton">
        <input aria-label="Name" defaultValue="Ana" />
      </SkeletonToContent>
    );
    const view = render(tree(false));
    const input = screen.getByRole('textbox');
    input.focus();
    fireEvent.change(input, { target: { value: 'Bia' } });
    for (const loading of [true, false, true, false, true]) {
      view.rerender(tree(loading));
      expect(screen.getByRole('textbox')).toBe(input);
      expect(input).toHaveFocus();
      expect(input).toHaveValue('Bia');
      expect(screen.queryByText('Skeleton')).toBeNull();
      expect(input.parentElement).toHaveAttribute('aria-busy', String(loading));
    }
  });

  it('supports custom labels and removes implicit live regions when announcements are off', () => {
    const view = render(
      <SkeletonToContent
        loading
        skeleton="Wait"
        loadingLabel="Loading data"
        readyLabel="Ready data"
      >
        Content
      </SkeletonToContent>,
    );
    expect(screen.getByRole('status')).toHaveTextContent('Loading data');
    view.rerender(
      <SkeletonToContent
        loading={false}
        skeleton="Wait"
        loadingLabel="Loading data"
        readyLabel="Ready data"
      >
        Content
      </SkeletonToContent>,
    );
    const status = screen.getByRole('status');
    const observer = vi.fn();
    const mutations = new MutationObserver(observer);
    mutations.observe(status, { childList: true, characterData: true, subtree: true });
    view.rerender(
      <SkeletonToContent
        loading={false}
        duration={20}
        skeleton="Wait"
        loadingLabel="Loading data"
        readyLabel="Ready data"
      >
        Content
      </SkeletonToContent>,
    );
    expect(mutations.takeRecords()).toHaveLength(0);
    mutations.disconnect();
    expect(status).toHaveTextContent('Ready data');
    view.rerender(
      <SkeletonToContent loading={false} skeleton="Wait" announcement="off">
        Content
      </SkeletonToContent>,
    );
    expect(screen.queryByRole('status')).toBeNull();
    expect(view.container.querySelector('[aria-live]')).toBeNull();
  });

  it.each([-1, NaN, Infinity, -Infinity])('rejects invalid duration %s', (duration) => {
    expect(() =>
      renderToString(
        <SkeletonToContent loading skeleton="Wait" duration={duration}>
          Content
        </SkeletonToContent>,
      ),
    ).toThrow(RangeError);
  });

  it.each([-1, NaN, Infinity, -Infinity])(
    'rejects invalid numeric minBlockSize %s',
    (minBlockSize) => {
      expect(() =>
        renderToString(
          <SkeletonToContent loading skeleton="Wait" minBlockSize={minBlockSize}>
            Content
          </SkeletonToContent>,
        ),
      ).toThrow(RangeError);
    },
  );

  it('forwards native div props, object refs, consumer styles and CSS minBlockSize', () => {
    const ref = createRef<HTMLDivElement>();
    const view = render(
      <SkeletonToContent
        ref={ref}
        loading={false}
        skeleton="Wait"
        id="content"
        className="custom"
        title="Details"
        minBlockSize="12rem"
        style={{ color: 'red' }}
      >
        Content
      </SkeletonToContent>,
    );
    expect(ref.current?.tagName).toBe('DIV');
    expect(ref.current).toHaveAttribute('title', 'Details');
    expect(ref.current).toHaveClass('custom');
    expect(ref.current?.style.minBlockSize).toBe('12rem');
    expect(ref.current).toHaveStyle({ color: 'rgb(255, 0, 0)' });
    view.unmount();
    expect(ref.current).toBeNull();
  });

  it('honors React 19 callback cleanup on ref replacement and StrictMode unmount', () => {
    let resources = 0;
    const makeRef = () => (node: HTMLDivElement | null) => {
      if (!node) throw new Error('cleanup must replace the legacy null callback');
      resources++;
      return () => {
        resources--;
      };
    };
    const first = makeRef();
    const second = makeRef();
    const tree = (ref: typeof first) => (
      <StrictMode>
        <SkeletonToContent ref={ref} loading={false} skeleton="Wait">
          Content
        </SkeletonToContent>
      </StrictMode>
    );
    const view = render(tree(first));
    expect(resources).toBe(1);
    view.rerender(tree(second));
    expect(resources).toBe(1);
    view.unmount();
    expect(resources).toBe(0);
  });

  it.each([true, false])(
    'hydrates deterministic initial loading=%s without recoverable errors',
    async (loading) => {
      const tree = (
        <SkeletonToContent loading={loading} skeleton="Wait">
          Content
        </SkeletonToContent>
      );
      const container = document.createElement('div');
      container.innerHTML = renderToString(tree);
      document.body.append(container);
      const original = container.innerHTML;
      expect(container.querySelector('[aria-busy]')).toHaveAttribute('aria-busy', String(loading));
      expect(container.textContent).toContain(loading ? 'Wait' : 'Content');
      const errors = vi.fn();
      const root = hydrateRoot(container, tree, { onRecoverableError: errors });
      await act(async () => {});
      expect(errors).not.toHaveBeenCalled();
      expect(container.innerHTML).toBe(original);
      act(() => root.unmount());
      container.remove();
    },
  );

  it('animates only decoration and cancels it on duration, loading, reduced motion and unmount', () => {
    let matches = false;
    const listeners = new Set<() => void>();
    vi.stubGlobal('matchMedia', () => ({
      matches,
      addEventListener: (_: string, fn: () => void) => listeners.add(fn),
      removeEventListener: (_: string, fn: () => void) => listeners.delete(fn),
    }));
    const cancellations: ReturnType<typeof vi.fn>[] = [];
    const targets: HTMLElement[] = [];
    const animate = vi.fn(function (
      this: HTMLElement,
      frames: Keyframe[],
      options: KeyframeAnimationOptions,
    ) {
      targets.push(this);
      expect(frames.every((frame) => !('opacity' in frame) && !('transform' in frame))).toBe(true);
      expect(options.duration).toBe(180);
      const cancel = vi.fn();
      cancellations.push(cancel);
      return { cancel };
    });
    Object.defineProperty(HTMLElement.prototype, 'animate', { configurable: true, value: animate });
    try {
      const tree = (loading: boolean, duration = 180, reduceMotion = false) => (
        <StrictMode>
          <SkeletonToContent
            loading={loading}
            duration={duration}
            reduceMotion={reduceMotion}
            skeleton="Wait"
          >
            <button>Real</button>
          </SkeletonToContent>
        </StrictMode>
      );
      const view = render(tree(true));
      expect(animate).not.toHaveBeenCalled();
      view.rerender(tree(false));
      expect(animate).toHaveBeenCalledOnce();
      expect(targets[0]).toHaveAttribute('aria-hidden', 'true');
      expect(targets[0]?.textContent).toBe('');
      expect(targets[0]).toHaveStyle({ pointerEvents: 'none' });
      expect(screen.getByRole('button')).toBeVisible();
      view.rerender(tree(false, 90));
      expect(cancellations[0]).toHaveBeenCalledOnce();
      expect(animate).toHaveBeenCalledOnce();
      view.rerender(tree(true));
      view.rerender(tree(false));
      expect(animate).toHaveBeenCalledTimes(2);
      act(() => {
        matches = true;
        listeners.forEach((fn) => fn());
      });
      expect(cancellations[1]).toHaveBeenCalledOnce();
      view.rerender(tree(true));
      view.rerender(tree(false));
      expect(animate).toHaveBeenCalledTimes(2);
      act(() => {
        matches = false;
        listeners.forEach((fn) => fn());
      });
      expect(animate).toHaveBeenCalledTimes(2);
      view.rerender(tree(true));
      view.rerender(tree(false, 180, true));
      expect(animate).toHaveBeenCalledTimes(2);
      view.rerender(tree(true));
      view.rerender(tree(false));
      expect(animate).toHaveBeenCalledTimes(3);
      view.rerender(tree(true));
      expect(cancellations[2]).toHaveBeenCalledOnce();
      view.rerender(tree(false));
      expect(animate).toHaveBeenCalledTimes(4);
      view.unmount();
      expect(cancellations[3]).toHaveBeenCalledOnce();
    } finally {
      Reflect.deleteProperty(HTMLElement.prototype, 'animate');
    }
  });

  it('accepts zero duration and minBlockSize and stays usable without animation APIs', () => {
    const view = render(
      <SkeletonToContent loading skeleton="Wait" duration={0} minBlockSize={0}>
        Content
      </SkeletonToContent>,
    );
    view.rerender(
      <SkeletonToContent loading={false} skeleton="Wait" duration={0} minBlockSize={0}>
        Content
      </SkeletonToContent>,
    );
    expect(screen.getByText('Content')).toBeVisible();
    expect(screen.queryByText('Wait')).toBeNull();
  });

  it.each(['missing', 'throwing'])(
    'falls back to immediate content for %s animation APIs',
    (support) => {
      vi.stubGlobal('matchMedia', () => ({
        matches: false,
        addEventListener() {},
        removeEventListener() {},
      }));
      if (support === 'throwing')
        Object.defineProperty(HTMLElement.prototype, 'animate', {
          configurable: true,
          value: () => {
            throw new Error('Unavailable');
          },
        });
      try {
        const view = render(
          <SkeletonToContent loading skeleton="Wait">
            <button>Real</button>
          </SkeletonToContent>,
        );
        view.rerender(
          <SkeletonToContent loading={false} skeleton="Wait">
            <button>Real</button>
          </SkeletonToContent>,
        );
        expect(screen.getByRole('button')).toBeVisible();
        expect(screen.queryByText('Wait')).toBeNull();
      } finally {
        Reflect.deleteProperty(HTMLElement.prototype, 'animate');
      }
    },
  );
});
