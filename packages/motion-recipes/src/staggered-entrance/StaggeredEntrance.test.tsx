import { act, fireEvent, render, screen } from '@testing-library/react';
import { createRef, StrictMode } from 'react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { StaggeredEntrance } from './index';

const animations = vi.hoisted(
  () =>
    [] as {
      frames: { transform: string[] };
      options: { duration: number; times?: number[]; delay?: number };
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
    options: { duration: number; times?: number[]; delay?: number },
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

const items = Array.from({ length: 6 }, (_, i) => ({ id: String(i) }));
const props = {
  items,
  getKey: (item: { id: string }) => item.id,
  renderItem: (item: { id: string }) => (
    <input aria-label={'Item ' + item.id} defaultValue={item.id} />
  ),
};
const mount = (extra = {}) =>
  render(<StaggeredEntrance data-testid="group" {...props} {...extra} />);
const targets = () => Array.from(screen.getByTestId('group').children) as HTMLLIElement[];
it.each([1, 6, 20])('bounds delay for %i items and observes only one root', (n) => {
  const observe = vi.fn();
  const Base = IntersectionObserver;
  vi.stubGlobal(
    'IntersectionObserver',
    class extends Base {
      override observe = observe;
    },
  );
  mount({ items: Array.from({ length: n }, (_, i) => ({ id: String(i) })) });
  expect(observe).toHaveBeenCalledTimes(1);
  expect(targets().every((t) => t.style.transform === 'translateY(8px)')).toBe(true);
  top = 200;
  intersect(true);
  expect(animations).toHaveLength(n);
  expect(animations.map((a) => a.options.delay ?? 0)).toEqual(
    Array.from({ length: n }, (_, i) => Math.min(i * 50, 200) / 1000),
  );
  expect(animations.every((a) => a.options.duration === 0.26)).toBe(true);
  for (const a of animations) act(() => a.complete());
  expect(targets().every((t) => t.style.transform === '')).toBe(true);
});
it('keeps ul/li semantics, native refs, key-preserved child state and opaque content', () => {
  const ref = createRef<HTMLUListElement>();
  const view = mount({ ref });
  expect(ref.current?.tagName).toBe('UL');
  expect(targets().every((t) => t.tagName === 'LI')).toBe(true);
  fireEvent.change(screen.getByLabelText('Item 0'), { target: { value: 'preserved' } });
  view.rerender(<StaggeredEntrance data-testid="group" {...props} items={[...items]} ref={ref} />);
  expect(screen.getByLabelText('Item 0')).toHaveValue('preserved');
  expect(targets().every((t) => !t.style.opacity && !t.hasAttribute('inert'))).toBe(true);
});
it.each([
  { duration: -1 },
  { offset: 25 },
  { stagger: -1 },
  { stagger: 201 },
  { stagger: NaN },
  { replayKey: Infinity },
])('rejects invalid %o', (extra) => expect(() => mount(extra)).toThrow(RangeError));
it('rejects empty and duplicate keys before running effects', () => {
  expect(() => mount({ getKey: () => '' })).toThrow(/key/i);
  expect(() => mount({ getKey: () => 'same' })).toThrow(/key/i);
});
it.each([{ duration: 0 }, { offset: 0 }])('settles all without waiting at %o', (extra) => {
  mount(extra);
  expect(animations).toHaveLength(0);
  expect(targets().every((t) => !t.style.transform)).toBe(true);
});
it('stagger0 starts together', () => {
  mount({ stagger: 0 });
  top = 200;
  intersect(true);
  expect(animations.every((a) => !a.options.delay)).toBe(true);
});
it('initially visible remains static and explicit replay is continuous', () => {
  top = 200;
  const v = mount();
  expect(animations).toHaveLength(0);
  v.rerender(<StaggeredEntrance data-testid="group" {...props} replayKey={1} />);
  expect(animations).toHaveLength(6);
  expect(animation(0).frames.transform).toEqual([
    'translateY(0px)',
    'translateY(8px)',
    'translateY(0px)',
  ]);
  v.rerender(<StaggeredEntrance data-testid="group" {...props} replayKey={2} />);
  expect(animation(0).stop).toHaveBeenCalled();
  act(() => animation(0).complete());
  expect(targets()[0]?.style.transform).not.toBe('');
});
it('focus or pointer concludes the whole group before consumer handler and stops pending callbacks', () => {
  const handler = vi.fn(() => expect(targets().every((t) => !t.style.transform)).toBe(true));
  mount({ onFocusCapture: handler, onPointerDownCapture: handler });
  top = 200;
  intersect(true);
  fireEvent.focus(screen.getByLabelText('Item 5'));
  expect(handler).toHaveBeenCalled();
  expect(animations.every((a) => a.stop.mock.calls.length > 0)).toBe(true);
  for (const a of animations) act(() => a.complete());
  expect(targets().every((t) => !t.style.transform)).toBe(true);
});
it('changes of keys cancel instead of replaying; empty->filled is static', () => {
  const v = mount();
  top = 200;
  intersect(true);
  v.rerender(<StaggeredEntrance data-testid="group" {...props} items={items.slice(1)} />);
  expect(animations.every((a) => a.stop.mock.calls.length > 0)).toBe(true);
  expect(targets().every((t) => !t.style.transform)).toBe(true);
  v.rerender(<StaggeredEntrance data-testid="group" {...props} items={[]} />);
  top = 1400;
  v.rerender(<StaggeredEntrance data-testid="group" {...props} />);
  expect(targets().every((t) => !t.style.transform)).toBe(true);
});
it('reduction during waits, duration changes and unmount cancel all', () => {
  const v = mount();
  top = 200;
  intersect(true);
  reduced = true;
  act(() => mediaChange());
  expect(targets().every((t) => !t.style.transform)).toBe(true);
  reduced = false;
  act(() => mediaChange());
  expect(animations).toHaveLength(6);
  v.rerender(<StaggeredEntrance data-testid="group" {...props} duration={0} />);
  v.unmount();
  expect(disconnect).toHaveBeenCalled();
  for (const a of animations) act(() => a.complete());
});
it('StrictMode disposes stale generation and leaves no transforms on unmount', () => {
  const v = render(
    <StrictMode>
      <StaggeredEntrance data-testid="group" {...props} />
    </StrictMode>,
  );
  top = 200;
  intersect(true);
  const nodes = targets();
  v.unmount();
  expect(nodes.every((n) => !n.style.transform)).toBe(true);
});
it.each([true, false])('empty lists allocate no observation with once=%s', (once) => {
  const observe = vi.fn();
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      observe = observe;
      disconnect = vi.fn();
    },
  );
  mount({ items: [], once });
  expect(observe).not.toHaveBeenCalled();
});

it('key replacement plus replay cannot forget an active pointer gesture', () => {
  top = 200;
  const next = items.slice(1);
  const view = mount({
    onPointerDownCapture: () =>
      view.rerender(
        <StaggeredEntrance data-testid="group" {...props} items={next} replayKey={1} />,
      ),
  });
  fireEvent.pointerDown(screen.getByLabelText('Item 0'), { pointerId: 8 });
  expect(animations).toHaveLength(0);
  fireEvent.pointerUp(window, { pointerId: 8 });
  view.rerender(<StaggeredEntrance data-testid="group" {...props} items={next} replayKey={2} />);
  expect(animations).toHaveLength(5);
});

it.each([{ duration: 0 }, { stagger: 0 }, { offset: 0 }])(
  'parameter update %o cancels the running and waiting group',
  (change) => {
    const v = mount();
    top = 200;
    intersect(true);
    expect(animations).toHaveLength(6);
    v.rerender(<StaggeredEntrance data-testid="group" {...props} {...change} />);
    expect(animations.every((a) => a.stop.mock.calls.length > 0)).toBe(true);
    expect(targets().every((t) => !t.style.transform)).toBe(true);
    for (const a of animations) act(() => a.complete());
    expect(targets().every((t) => !t.style.transform)).toBe(true);
  },
);
