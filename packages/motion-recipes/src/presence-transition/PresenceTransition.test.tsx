import { createRef, StrictMode, useState } from 'react';
import { act, render, screen } from '@testing-library/react';
import { describe, expect, it, vi, afterEach } from 'vitest';
import { PresenceTransition } from './PresenceTransition.js';

afterEach(() => vi.unstubAllGlobals());

describe('PresenceTransition', () => {
  it('keeps a notice reopened synchronously by the focus destination', () => {
    vi.stubGlobal('matchMedia', () => ({
      matches: false,
      addEventListener() {},
      removeEventListener() {},
    }));
    const done = vi.fn();
    function Example() {
      const [present, setPresent] = useState(true);
      const target = createRef<HTMLButtonElement>();
      return (
        <>
          <button ref={target} onFocus={() => setPresent(true)}>
            Reopen target
          </button>
          <PresenceTransition
            present={present}
            duration={0}
            returnFocusRef={target}
            onExitComplete={done}
          >
            <button onClick={() => setPresent(false)}>Close reentrant</button>
          </PresenceTransition>
        </>
      );
    }
    render(<Example />);
    const inside = screen.getByRole('button', { name: 'Close reentrant' });
    inside.focus();
    act(() => inside.click());
    expect(screen.getByRole('button', { name: 'Close reentrant' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reopen target' })).toHaveFocus();
    expect(done).not.toHaveBeenCalled();
  });
  it.each(['disconnected', 'hidden', 'inert', 'disabled', 'unfocusable'])(
    'safely removes a focused tree with %s target',
    (kind) => {
      const target = document.createElement(kind === 'unfocusable' ? 'div' : 'button');
      if (kind !== 'disconnected') document.body.append(target);
      if (kind === 'hidden') target.hidden = true;
      if (kind === 'inert') target.setAttribute('inert', '');
      if (kind === 'disabled') target.setAttribute('disabled', '');
      const ref = { current: target };
      const done = vi.fn();
      const view = render(
        <PresenceTransition present returnFocusRef={ref} duration={500} onExitComplete={done}>
          <button>Inside invalid</button>
        </PresenceTransition>,
      );
      screen.getByRole('button', { name: 'Inside invalid' }).focus();
      view.rerender(
        <PresenceTransition
          present={false}
          returnFocusRef={ref}
          duration={500}
          onExitComplete={done}
        >
          <button>Inside invalid</button>
        </PresenceTransition>,
      );
      expect(screen.queryByText('Inside invalid')).toBeNull();
      expect(done).toHaveBeenCalledTimes(1);
      target.remove();
    },
  );
  it('cancels an exit and its callback when unmounted', async () => {
    vi.stubGlobal('matchMedia', () => ({
      matches: false,
      addEventListener() {},
      removeEventListener() {},
    }));
    const done = vi.fn();
    const view = render(
      <PresenceTransition present duration={50} onExitComplete={done}>
        Unmount
      </PresenceTransition>,
    );
    view.rerender(
      <PresenceTransition present={false} duration={50} onExitComplete={done}>
        Unmount
      </PresenceTransition>,
    );
    view.unmount();
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(done).not.toHaveBeenCalled();
  });
  it('does not fabricate an exit on an initially absent tree', () => {
    const done = vi.fn();
    render(
      <PresenceTransition present={false} onExitComplete={done}>
        Absent
      </PresenceTransition>,
    );
    expect(screen.queryByText('Absent')).toBeNull();
    expect(done).not.toHaveBeenCalled();
  });

  it('shows initial content without an introduction and forwards the native ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <PresenceTransition present ref={ref} id="notice" title="Context">
        Readable
      </PresenceTransition>,
    );
    expect(ref.current).toHaveTextContent('Readable');
    expect(ref.current).toHaveAttribute('id', 'notice');
    expect(ref.current).toHaveAttribute('title', 'Context');
    expect(ref.current).not.toHaveAttribute('inert');
    expect(ref.current?.style.opacity).toBe('1');
    expect(ref.current?.style.transform).toBe('translateY(0px)');
  });

  it.each([-1, NaN, Infinity])('rejects invalid duration %s', (duration) => {
    expect(() =>
      render(
        <PresenceTransition present duration={duration}>
          Invalid
        </PresenceTransition>,
      ),
    ).toThrow(RangeError);
  });

  it('moves focus before inert and notifies only after the DOM and ref have cleared', () => {
    const target = createRef<HTMLButtonElement>();
    const ref = createRef<HTMLDivElement>();
    const order: string[] = [];
    const done = vi.fn(() => {
      expect(ref.current).toBeNull();
      expect(screen.queryByText('Inside')).toBeNull();
      order.push('removed');
    });
    function Example({ present }: { present: boolean }) {
      return (
        <>
          <button
            ref={target}
            onFocus={() => {
              expect(ref.current).not.toHaveAttribute('inert');
              expect(ref.current).not.toHaveAttribute('aria-hidden', 'true');
              order.push('focus');
            }}
          >
            Return
          </button>
          <PresenceTransition
            present={present}
            ref={ref}
            duration={0}
            returnFocusRef={target}
            onExitComplete={done}
          >
            <button>Inside</button>
          </PresenceTransition>
        </>
      );
    }
    const view = render(<Example present />);
    screen.getByRole('button', { name: 'Inside' }).focus();
    view.rerender(<Example present={false} />);
    expect(target.current).toHaveFocus();
    expect(order).toEqual(['focus', 'removed']);
    view.rerender(<Example present={false} />);
    expect(done).toHaveBeenCalledTimes(1);
  });

  it('removes immediately rather than fading a focused tree without a valid return target', () => {
    const done = vi.fn();
    const view = render(
      <PresenceTransition present duration={500} onExitComplete={done}>
        <button>Close without target</button>
      </PresenceTransition>,
    );
    const inside = screen.getByRole('button');
    inside.focus();
    view.rerender(
      <PresenceTransition present={false} duration={500} onExitComplete={done}>
        <button>Close without target</button>
      </PresenceTransition>,
    );
    expect(inside.isConnected).toBe(false);
    expect(document.activeElement).not.toBe(inside);
    expect(done).toHaveBeenCalledTimes(1);
  });

  it('does not steal unrelated focus when the return reference is null', () => {
    const invalid = createRef<HTMLElement>();
    function Example({ present }: { present: boolean }) {
      return (
        <>
          <button>Outside</button>
          <PresenceTransition present={present} duration={0} returnFocusRef={invalid}>
            Notice
          </PresenceTransition>
        </>
      );
    }
    const view = render(<Example present />);
    screen.getByRole('button').focus();
    view.rerender(<Example present={false} />);
    expect(screen.getByRole('button')).toHaveFocus();
  });

  it('preserves child state on reversal and resets only after real removal', () => {
    vi.stubGlobal('matchMedia', () => ({
      matches: false,
      addEventListener() {},
      removeEventListener() {},
    }));
    function Child() {
      const [count, setCount] = useState(0);
      return <button onClick={() => setCount((v) => v + 1)}>Count {count}</button>;
    }
    const done = vi.fn();
    const child = <Child />;
    const view = render(
      <PresenceTransition present duration={1000} onExitComplete={done}>
        {child}
      </PresenceTransition>,
    );
    act(() => screen.getByRole('button').click());
    view.rerender(
      <PresenceTransition present={false} duration={1000} onExitComplete={done}>
        {child}
      </PresenceTransition>,
    );
    expect(screen.getByText('Count 1')).toBeInTheDocument();
    view.rerender(
      <PresenceTransition present duration={1000} onExitComplete={done}>
        {child}
      </PresenceTransition>,
    );
    expect(screen.getByRole('button')).toHaveTextContent('Count 1');
    expect(done).not.toHaveBeenCalled();
    view.rerender(
      <PresenceTransition present={false} duration={0} onExitComplete={done}>
        {child}
      </PresenceTransition>,
    );
    view.rerender(
      <PresenceTransition present duration={0} onExitComplete={done}>
        {child}
      </PresenceTransition>,
    );
    expect(screen.getByRole('button')).toHaveTextContent('Count 0');
  });

  it('tracks live preference and releases listeners under StrictMode', () => {
    let reduced = false;
    const listeners = new Set<() => void>();
    vi.stubGlobal('matchMedia', () => ({
      get matches() {
        return reduced;
      },
      addEventListener: (_: string, cb: () => void) => listeners.add(cb),
      removeEventListener: (_: string, cb: () => void) => listeners.delete(cb),
    }));
    const done = vi.fn();
    const view = render(
      <StrictMode>
        <PresenceTransition present onExitComplete={done}>
          Content
        </PresenceTransition>
      </StrictMode>,
    );
    view.rerender(
      <StrictMode>
        <PresenceTransition present={false} onExitComplete={done}>
          Content
        </PresenceTransition>
      </StrictMode>,
    );
    act(() => {
      reduced = true;
      listeners.forEach((cb) => cb());
    });
    expect(screen.queryByText('Content')).toBeNull();
    expect(done).toHaveBeenCalledTimes(1);
    view.unmount();
    expect(listeners.size).toBe(0);
  });
});
