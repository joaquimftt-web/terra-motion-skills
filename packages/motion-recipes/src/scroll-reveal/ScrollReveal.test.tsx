import { act, fireEvent, render, screen } from '@testing-library/react';
import { createRef, StrictMode, useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ScrollReveal } from './index';

const animations = vi.hoisted(
  () =>
    [] as {
      frames: { transform: string[] };
      options: { duration: number; times?: number[] };
      stop: ReturnType<typeof vi.fn>;
      cancel: ReturnType<typeof vi.fn>;
      complete: () => void;
    }[],
);
function animation(index: number) {
  const value = animations[index];
  if (!value) throw new Error('Expected animation was not created');
  return value;
}
vi.mock('motion/mini', () => ({
  animate: (
    _target: Element,
    frames: { transform: string[] },
    options: { duration: number; times?: number[] },
  ) => {
    const stop = vi.fn();
    const cancel = vi.fn();
    let done = () => {};
    animations.push({ frames, options, stop, cancel, complete: () => done() });
    return {
      stop,
      cancel,
      then: (resolve: () => void) => {
        done = resolve;
      },
    };
  },
}));

let top = 1400;
let reduced = false;
let mediaChange: () => void;
let observer: IntersectionObserverCallback;
const disconnect = vi.fn();
function intersect(visible: boolean) {
  act(() =>
    observer(
      [
        {
          isIntersecting: visible,
          intersectionRect: { width: visible ? 500 : 0, height: visible ? 80 : 0 },
        } as IntersectionObserverEntry,
      ],
      {} as IntersectionObserver,
    ),
  );
}
beforeEach(() => {
  top = 1400;
  reduced = false;
  animations.length = 0;
  disconnect.mockClear();
  document.body.style.textShadow = 'none';
  vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('visible');
  vi.stubGlobal(
    'PointerEvent',
    class extends MouseEvent {
      pointerId: number;
      constructor(type: string, init: PointerEventInit = {}) {
        super(type, init);
        this.pointerId = init.pointerId ?? 1;
      }
    },
  );
  // jsdom 30 reports the absent text shadow as a transparent color, not browser "none".
  const computed = window.getComputedStyle.bind(window);
  vi.spyOn(window, 'getComputedStyle').mockImplementation((element) => {
    const css = computed(element);
    if (css.textShadow === 'rgba(0, 0, 0, 0)')
      Object.defineProperty(css, 'textShadow', { value: 'none' });
    return css;
  });
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(cb: IntersectionObserverCallback) {
        observer = cb;
      }
      observe() {}
      disconnect = disconnect;
    },
  );
  vi.stubGlobal('matchMedia', () => ({
    get matches() {
      return reduced;
    },
    addEventListener: (_: string, cb: () => void) => {
      mediaChange = cb;
    },
    removeEventListener: vi.fn(),
  }));
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(() => ({
    top,
    bottom: top + 80,
    left: 0,
    right: 500,
    width: 500,
    height: 80,
    x: 0,
    y: top,
    toJSON() {},
  }));
});
afterEach(() => vi.unstubAllGlobals());
const target = () => screen.getByTestId('root').firstElementChild as HTMLDivElement;
const mount = (props = {}) =>
  render(
    <ScrollReveal data-testid="root" {...props}>
      <p>Informação</p>
    </ScrollReveal>,
  );

describe('ScrollReveal', () => {
  it('forwards native props and object refs to a stable div, without hiding content', () => {
    const ref = createRef<HTMLDivElement>();
    mount({ ref, id: 'example', className: 'consumer' });
    expect(ref.current).toBe(screen.getByTestId('root'));
    expect(ref.current?.tagName).toBe('DIV');
    expect(target().tagName).toBe('DIV');
    expect(ref.current).toHaveAttribute('id', 'example');
    expect(ref.current).not.toHaveAttribute('duration');
    expect(target().style.opacity).toBe('');
    expect(ref.current?.querySelector('[inert],[aria-hidden]')).toBeNull();
  });
  it.each([
    { duration: -1 },
    { duration: Infinity },
    { offset: -1 },
    { offset: 25 },
    { replayKey: NaN },
  ])('rejects invalid numbers: %o', (props) => expect(() => mount(props)).toThrow(RangeError));
  it('prepares below the viewport before entry and never reapplies offset on entry', () => {
    mount();
    expect(target().style.transform).toBe('translateY(8px)');
    top = 200;
    intersect(true);
    expect(animations).toHaveLength(1);
    expect(animation(0).frames.transform).toEqual(['translateY(8px)', 'translateY(0px)']);
    act(() => animation(0).complete());
    expect(target().style.transform).toBe('');
    expect(disconnect).toHaveBeenCalled();
  });
  it.each([200, 780])('keeps initially visible or too-near content static at y=%s', (y) => {
    top = y;
    mount();
    intersect(true);
    expect(target().style.transform).toBe('');
    expect(animations).toHaveLength(0);
  });
  it('keeps uncertain positioned descendants static', () => {
    render(
      <ScrollReveal data-testid="root">
        <span style={{ position: 'absolute' }}>Uncertain</span>
      </ScrollReveal>,
    );
    expect(target().style.transform).toBe('');
  });
  it('permits the bounded native clipping of input controls without relaxing container overflow', () => {
    render(
      <ScrollReveal data-testid="root">
        <input aria-label="Native" style={{ overflow: 'clip' }} />
      </ScrollReveal>,
    );
    expect(target().style.transform).toBe('translateY(8px)');
  });
  it('uses continuous replay, invalidates old completion and preserves child state', () => {
    top = 200;
    const view = render(
      <ScrollReveal data-testid="root" replayKey={0}>
        <input defaultValue="kept" />
      </ScrollReveal>,
    );
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'changed' } });
    view.rerender(
      <ScrollReveal data-testid="root" replayKey={1}>
        <input defaultValue="kept" />
      </ScrollReveal>,
    );
    expect(animation(0).frames.transform).toEqual([
      'translateY(0px)',
      'translateY(8px)',
      'translateY(0px)',
    ]);
    expect(animation(0).options.times).toEqual([0, 0.25, 1]);
    target().style.transform = 'translateY(3px)';
    view.rerender(
      <ScrollReveal data-testid="root" replayKey={2}>
        <input defaultValue="kept" />
      </ScrollReveal>,
    );
    expect(animation(0).stop).toHaveBeenCalled();
    expect(animation(1).frames.transform[0]).toBe('translateY(3px)');
    act(() => animation(0).complete());
    expect(target().style.transform).toBe('translateY(3px)');
    expect(screen.getByRole('textbox')).toBe(input);
    expect(input).toHaveValue('changed');
  });
  it('finishes before focus/pointer handlers and blocks replay during a pointer gesture', () => {
    const handler = vi.fn(() => expect(target().style.transform).toBe(''));
    const view = mount({ onFocusCapture: handler, onPointerDownCapture: handler, replayKey: 0 });
    fireEvent.pointerDown(target(), { pointerId: 1 });
    expect(handler).toHaveBeenCalledOnce();
    view.rerender(
      <ScrollReveal data-testid="root" replayKey={1}>
        <button>Action</button>
      </ScrollReveal>,
    );
    expect(animations).toHaveLength(0);
    fireEvent.pointerUp(window, { pointerId: 1 });
    fireEvent.focus(screen.getByRole('button'));
    expect(target().style.transform).toBe('');
  });
  it('ends immediately on live reduced motion without resuming when it clears', () => {
    mount();
    top = 200;
    intersect(true);
    reduced = true;
    act(() => mediaChange());
    expect(target().style.transform).toBe('');
    expect(animation(0).stop).toHaveBeenCalled();
    reduced = false;
    act(() => mediaChange());
    expect(animations).toHaveLength(1);
    act(() => animation(0).complete());
    expect(target().style.transform).toBe('');
  });
  it.each([{ reduceMotion: true }, { offset: 0 }, { duration: 0 }])('is static for %o', (props) => {
    mount(props);
    expect(target().style.transform).toBe('');
    expect(animations).toHaveLength(0);
  });
  it('is static without observer or matchMedia', () => {
    vi.stubGlobal('IntersectionObserver', undefined);
    mount();
    expect(target().style.transform).toBe('');
  });
  it('cancels on prop changes, unmount and StrictMode, including callback ref cleanup', () => {
    const detach = vi.fn();
    const ref = vi.fn(() => detach);
    const view = render(
      <StrictMode>
        <ScrollReveal data-testid="root" ref={ref}>
          Text
        </ScrollReveal>
      </StrictMode>,
    );
    top = 200;
    intersect(true);
    view.rerender(
      <StrictMode>
        <ScrollReveal data-testid="root" duration={300}>
          Text
        </ScrollReveal>
      </StrictMode>,
    );
    expect(target().style.transform).toBe('');
    view.unmount();
    expect(detach).toHaveBeenCalled();
    expect(disconnect).toHaveBeenCalled();
  });
  it('does not replay when a child updates its own state', () => {
    function Child() {
      const [n, set] = useState(0);
      return <button onClick={() => set(n + 1)}>{n}</button>;
    }
    render(
      <ScrollReveal data-testid="root">
        <Child />
      </ScrollReveal>,
    );
    fireEvent.click(screen.getByRole('button'));
    expect(animations).toHaveLength(0);
  });
  it('does not introduce an offset after an unsafe or late first measurement', () => {
    top = 780;
    mount();
    top = 100;
    intersect(true);
    expect(animations).toHaveLength(0);
    expect(target().style.transform).toBe('');
  });
  it('rearms once=false only after safe exit below, not above the viewport', () => {
    mount({ once: false });
    top = 100;
    intersect(true);
    act(() => animation(0).complete());
    top = -200;
    intersect(false);
    expect(target().style.transform).toBe('');
    top = 1400;
    intersect(false);
    expect(target().style.transform).toBe('translateY(8px)');
    top = 100;
    intersect(true);
    expect(animations).toHaveLength(2);
  });
  it('discards a prepared generation when its content changes', async () => {
    const view = mount();
    expect(target().style.transform).toBe('translateY(8px)');
    await act(async () => {
      view.rerender(
        <ScrollReveal data-testid="root">
          <p>New content</p>
        </ScrollReveal>,
      );
    });
    expect(target().style.transform).toBe('');
    top = 100;
    intersect(true);
    expect(animations).toHaveLength(0);
  });
  it('discards preparation when the tab is suspended', () => {
    mount();
    vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden');
    fireEvent(document, new Event('visibilitychange'));
    expect(target().style.transform).toBe('');
    vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('visible');
    fireEvent(document, new Event('visibilitychange'));
    top = 100;
    intersect(true);
    expect(animations).toHaveLength(0);
  });
  it('never prepares without matchMedia', () => {
    vi.stubGlobal('matchMedia', undefined);
    mount();
    expect(target().style.transform).toBe('');
  });
  it('ignores viewport callbacks queued by a disconnected observation generation', () => {
    const view = mount();
    const oldObserver = observer;
    top = 100;
    intersect(true);
    act(() => animation(0).complete());
    view.rerender(
      <ScrollReveal data-testid="root" replayKey={1}>
        <p>Informação</p>
      </ScrollReveal>,
    );
    act(() =>
      oldObserver(
        [
          {
            isIntersecting: false,
            intersectionRect: { width: 0, height: 0 },
          } as IntersectionObserverEntry,
        ],
        {} as IntersectionObserver,
      ),
    );
    expect(animation(1).stop).not.toHaveBeenCalled();
  });
  it('keeps initially focused descendants static', () => {
    render(
      <ScrollReveal data-testid="root">
        <input aria-label="Focused" autoFocus />
      </ScrollReveal>,
    );
    expect(target().style.transform).toBe('');
    expect(screen.getByRole('textbox')).toHaveFocus();
  });
  it('revalidates ancestor geometry before starting a prepared entry', () => {
    const view = mount();
    expect(target().style.transform).toBe('translateY(8px)');
    screen.getByTestId('root').parentElement!.style.transform = 'translateX(1px)';
    top = 100;
    intersect(true);
    expect(animations).toHaveLength(0);
    expect(target().style.transform).toBe('');
    view.rerender(
      <ScrollReveal data-testid="root" replayKey={1}>
        Text
      </ScrollReveal>,
    );
    expect(animations).toHaveLength(0);
  });
  it('does not release an active gesture when a different pointer ends elsewhere', () => {
    top = 100;
    const view = mount({ replayKey: 0 });
    fireEvent.pointerDown(target(), { pointerId: 1 });
    fireEvent.pointerUp(window, { pointerId: 2 });
    view.rerender(
      <ScrollReveal data-testid="root" replayKey={1}>
        Text
      </ScrollReveal>,
    );
    expect(animations).toHaveLength(0);
    fireEvent.pointerUp(window, { pointerId: 1 });
    view.rerender(
      <ScrollReveal data-testid="root" replayKey={2}>
        Text
      </ScrollReveal>,
    );
    expect(animations).toHaveLength(1);
  });
  it('rearms after a large reverse scroll that skips an intersection notification', () => {
    mount({ once: false });
    top = 100;
    intersect(true);
    act(() => animation(0).complete());
    top = -200;
    intersect(false);
    top = 1400;
    fireEvent(document, new Event('scrollend'));
    expect(target().style.transform).toBe('translateY(8px)');
  });
  it('does not rearm a cancelled preparation without another actual exit', () => {
    mount({ once: false });
    top = 100;
    intersect(true);
    act(() => animation(0).complete());
    top = -200;
    intersect(false);
    top = 1400;
    fireEvent(document, new Event('scrollend'));
    expect(target().style.transform).toBe('translateY(8px)');
    fireEvent.focus(target());
    expect(target().style.transform).toBe('');
    fireEvent(document, new Event('scrollend'));
    expect(target().style.transform).toBe('');
  });
  it('cancels playback and cleans styles when native stop rejects a hidden element', () => {
    mount();
    top = 100;
    intersect(true);
    animation(0).stop.mockImplementation(() => {
      throw new DOMException('Element is not rendered', 'InvalidStateError');
    });
    expect(() => fireEvent.focus(target())).not.toThrow();
    expect(animation(0).cancel).toHaveBeenCalledOnce();
    expect(target().style.transform).toBe('');
    expect(target().style.willChange).toBe('');
    act(() => animation(0).complete());
    expect(target().style.transform).toBe('');
  });
});
