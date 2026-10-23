import { act, fireEvent, render, screen } from '@testing-library/react';
import { createRef, StrictMode } from 'react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { ScrollProgress } from './index';

let top = 0,
  height = 2000,
  viewport = 500,
  sectionTop = 500,
  sectionHeight = 500;
let frames = new Map<number, FrameRequestCallback>();
let id = 0;
let resized: ResizeObserverCallback;
const observed: Element[] = [];
const disconnected = vi.fn();
function flush() {
  act(() => {
    const batch = [...frames.values()];
    frames.clear();
    batch.forEach((fn) => fn(0));
  });
}
function update() {
  fireEvent.scroll(window);
  flush();
}
function fill() {
  return screen.getByTestId('bar').firstElementChild as HTMLElement;
}
beforeEach(() => {
  top = 0;
  height = 2000;
  viewport = 500;
  sectionTop = 500;
  sectionHeight = 500;
  frames = new Map();
  observed.length = 0;
  disconnected.mockClear();
  Object.defineProperty(document, 'scrollingElement', {
    configurable: true,
    get: () => document.documentElement,
  });
  Object.defineProperties(document.documentElement, {
    scrollTop: { configurable: true, get: () => top },
    scrollHeight: { configurable: true, get: () => height },
    clientHeight: { configurable: true, get: () => viewport },
  });
  Object.defineProperty(window, 'innerHeight', { configurable: true, get: () => viewport });
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    frames.set(++id, cb);
    return id;
  });
  vi.stubGlobal('cancelAnimationFrame', (token: number) => frames.delete(token));
  vi.stubGlobal(
    'ResizeObserver',
    class {
      constructor(cb: ResizeObserverCallback) {
        resized = cb;
      }
      observe(el: Element) {
        observed.push(el);
      }
      disconnect = disconnected;
    },
  );
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(() => ({
    top: sectionTop,
    bottom: sectionTop + sectionHeight,
    height: sectionHeight,
    width: 300,
    left: 0,
    right: 300,
    x: 0,
    y: sectionTop,
    toJSON() {},
  }));
});
afterEach(() => vi.unstubAllGlobals());
it('is decorative, ref-native, neutral and has no focus/live semantics', () => {
  const ref = createRef<HTMLDivElement>();
  render(<ScrollProgress data-testid="bar" ref={ref} className="consumer" />);
  flush();
  expect(ref.current).toBe(screen.getByTestId('bar'));
  expect(ref.current).toHaveAttribute('aria-hidden', 'true');
  expect(ref.current).not.toHaveAttribute('role');
  expect(ref.current).not.toHaveAttribute('tabindex');
  expect(ref.current).not.toHaveAttribute('aria-live');
  expect(fill().style.backgroundColor).toBe('currentcolor');
});
it('uses actual clamped document position, reverse and no interpolation', () => {
  render(<ScrollProgress data-testid="bar" />);
  flush();
  expect(fill().style.transform).toBe('scaleX(0)');
  top = 750;
  update();
  expect(fill().style.transform).toBe('scaleX(0.5)');
  top = 1500;
  update();
  expect(fill().style.transform).toBe('scaleX(1)');
  top = 300;
  update();
  expect(fill().style.transform).toBe('scaleX(0.2)');
  top = -40;
  update();
  expect(fill().style.transform).toBe('scaleX(0)');
});
it('has no rolling range safely inactive, becomes active on resize', () => {
  height = viewport;
  render(<ScrollProgress data-testid="bar" />);
  flush();
  expect(fill().style.visibility).toBe('hidden');
  height = 1000;
  top = 250;
  act(() => resized([], {} as ResizeObserver));
  flush();
  expect(fill().style.visibility).toBe('visible');
  expect(fill().style.transform).toBe('scaleX(0.5)');
});
it('measures restored position at mount and pageshow without a zero tween', () => {
  top = 900;
  render(<ScrollProgress data-testid="bar" />);
  flush();
  expect(fill().style.transform).toBe('scaleX(0.6)');
  top = 1500;
  fireEvent(window, new Event('pageshow'));
  flush();
  expect(fill().style.transform).toBe('scaleX(1)');
});
it('measures passage of a section through window including shorter sections', () => {
  const target = document.createElement('section');
  document.body.append(target);
  const targetRef = { current: target };
  const v = render(<ScrollProgress data-testid="bar" source={{ type: 'section', targetRef }} />);
  flush();
  expect(fill().style.transform).toBe('scaleX(0)');
  sectionTop = 0;
  update();
  expect(fill().style.transform).toBe('scaleX(0.5)');
  sectionTop = -500;
  update();
  expect(fill().style.transform).toBe('scaleX(1)');
  sectionHeight = 100;
  sectionTop = 200;
  update();
  expect(fill().style.transform).toBe('scaleX(0.5)');
  v.unmount();
  target.remove();
});
it('observes container and content, measuring root scrollHeight and dynamic growth', () => {
  const container = document.createElement('div'),
    content = document.createElement('div');
  container.append(content);
  document.body.append(container);
  let extent = 1000;
  Object.defineProperties(container, {
    scrollTop: { get: () => 250 },
    scrollHeight: { get: () => extent },
    clientHeight: { get: () => 500 },
  });
  const source = {
    type: 'container' as const,
    containerRef: { current: container },
    contentRef: { current: content },
  };
  const v = render(<ScrollProgress data-testid="bar" source={source} />);
  flush();
  expect(fill().style.transform).toBe('scaleX(0.5)');
  expect(observed).toContain(content);
  expect(observed).toContain(container);
  extent = 1500;
  act(() => resized([], {} as ResizeObserver));
  flush();
  expect(fill().style.transform).toBe('scaleX(0.25)');
  v.rerender(<ScrollProgress data-testid="bar" source={{ ...source }} />);
  expect(fill().style.transform).toBe('scaleX(0.25)');
  v.unmount();
  container.remove();
});
it('null, foreign or disconnected refs never fall back to window', () => {
  top = 1500;
  const v = render(
    <ScrollProgress
      data-testid="bar"
      source={{ type: 'container', containerRef: { current: null }, contentRef: { current: null } }}
    />,
  );
  flush();
  expect(fill().style.visibility).toBe('hidden');
  const detached = document.createElement('section');
  v.rerender(
    <ScrollProgress
      data-testid="bar"
      source={{ type: 'section', targetRef: { current: detached } }}
    />,
  );
  flush();
  expect(fill().style.visibility).toBe('hidden');
});
it('degrades without or failing ResizeObserver; never installs size polling', () => {
  vi.stubGlobal('ResizeObserver', undefined);
  render(<ScrollProgress data-testid="bar" />);
  flush();
  expect(frames.size).toBe(0);
  top = 750;
  update();
  expect(fill().style.transform).toBe('scaleX(0.5)');
  expect(frames.size).toBe(0);
});
it('non-finite geometry is inactive rather than NaN', () => {
  height = NaN;
  render(<ScrollProgress data-testid="bar" />);
  flush();
  expect(fill().style.visibility).toBe('hidden');
  expect(fill().style.transform).toBe('scaleX(0)');
});
it('StrictMode/source changes/unmount cancel frames and disconnect observers', () => {
  const v = render(
    <StrictMode>
      <ScrollProgress data-testid="bar" />
    </StrictMode>,
  );
  flush();
  fireEvent.scroll(window);
  expect(frames.size).toBe(1);
  const node = fill();
  v.unmount();
  expect(frames.size).toBe(0);
  expect(disconnected).toHaveBeenCalled();
  top = 750;
  update();
  expect(node.style.transform).toBe('scaleX(0)');
});

it('source replacement from nonzero document to zero container never retains old fill', () => {
  top = 750;
  const v = render(<ScrollProgress data-testid="bar" />);
  flush();
  expect(fill().style.transform).toBe('scaleX(0.5)');
  const container = document.createElement('div'),
    content = document.createElement('div');
  container.append(content);
  document.body.append(container);
  Object.defineProperties(container, {
    scrollTop: { get: () => 0 },
    scrollHeight: { get: () => 1000 },
    clientHeight: { get: () => 500 },
  });
  const source = {
    type: 'container' as const,
    containerRef: { current: container },
    contentRef: { current: content },
  };
  v.rerender(<ScrollProgress data-testid="bar" source={source} />);
  flush();
  expect(fill().style.transform).toBe('scaleX(0)');
  expect(fill().style.visibility).toBe('visible');
  v.rerender(
    <ScrollProgress
      data-testid="bar"
      source={{ type: 'container', containerRef: { current: null }, contentRef: { current: null } }}
    />,
  );
  flush();
  expect(fill().style.visibility).toBe('hidden');
  v.rerender(<ScrollProgress data-testid="bar" source={source} />);
  flush();
  expect(fill().style.transform).toBe('scaleX(0)');
  v.unmount();
  container.remove();
});

it('a throwing ResizeObserver preserves event-based progress and cleanup', () => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      constructor() {
        throw new Error('RO unavailable');
      }
    },
  );
  const v = render(<ScrollProgress data-testid="bar" />);
  flush();
  top = 750;
  update();
  expect(fill().style.transform).toBe('scaleX(0.5)');
  v.unmount();
  expect(frames.size).toBe(0);
});
