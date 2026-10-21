import { beforeEach, expect, it, vi } from 'vitest';
import { createSectionPresentation } from './sectionPresentation';
const records = vi.hoisted(
  () =>
    [] as {
      node: HTMLElement;
      cancel: ReturnType<typeof vi.fn>;
      complete: (() => void) | undefined;
    }[],
);
vi.mock('motion/mini', () => ({
  animate: vi.fn((node) => {
    const row = { node, cancel: vi.fn(), complete: undefined as (() => void) | undefined };
    records.push(row);
    return {
      cancel: row.cancel,
      then: (done: () => void) => {
        row.complete = done;
      },
    };
  }),
}));
let emit: IntersectionObserverCallback;
let position: number;
function fixture() {
  document.body.innerHTML =
    '<main><section><div data-narrative="concept" aria-hidden="true"></div><a href="#second">Read</a></section><section id="second"><div data-narrative="closing" aria-hidden="true"></div><button>Action</button></section></main>';
  const root = document.querySelector<HTMLElement>('main')!;
  for (const n of root.querySelectorAll<HTMLElement>('[data-narrative]'))
    vi.spyOn(n, 'getBoundingClientRect').mockImplementation(() => ({
      top: position,
      bottom: position + 100,
      left: 0,
      right: 100,
      width: 100,
      height: 100,
      x: 0,
      y: position,
      toJSON: () => ({}),
    }));
  return root;
}
beforeEach(() => {
  records.length = 0;
  position = 1200;
  vi.stubGlobal('innerHeight', 900);
  history.replaceState(null, '', '/');
  Object.defineProperty(document, 'hidden', { configurable: true, value: false });
  Element.prototype.animate = vi.fn();
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(cb: IntersectionObserverCallback) {
        emit = cb;
      }
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    },
  );
});
it('animates only decorative targets once and keeps interactive children mounted', () => {
  const r = fixture(),
    s = new Set<HTMLElement>(),
    controller = createSectionPresentation(r, false, s);
  const a = r.querySelector('a'),
    node = r.querySelector<HTMLElement>('[data-narrative]')!;
  position = 600;
  emit(
    [{ isIntersecting: true, target: node } as unknown as IntersectionObserverEntry],
    {} as IntersectionObserver,
  );
  expect(records).toHaveLength(1);
  expect(records[0]!.node).toBe(node);
  records[0]!.complete?.();
  expect(node.style.transform).toBe('');
  expect(r.querySelector('a')).toBe(a);
  emit(
    [{ isIntersecting: true, target: node } as unknown as IntersectionObserverEntry],
    {} as IntersectionObserver,
  );
  expect(records).toHaveLength(1);
  controller.dispose();
});
it('ends the region on focus and rejects stale completion', () => {
  const r = fixture(),
    controller = createSectionPresentation(r, false, new Set());
  const node = r.querySelector<HTMLElement>('[data-narrative]')!;
  position = 600;
  emit(
    [{ isIntersecting: true, target: node } as unknown as IntersectionObserverEntry],
    {} as IntersectionObserver,
  );
  r.querySelector('a')!.focus();
  expect(records[0]!.cancel).toHaveBeenCalled();
  records[0]!.complete?.();
  expect(node.dataset.narrativeReason).toBe('interaction');
  controller.dispose();
});
it('stays static with reduced motion and consumes the visit', () => {
  const r = fixture(),
    s = new Set<HTMLElement>(),
    a = createSectionPresentation(r, true, s);
  expect(records).toHaveLength(0);
  expect(s.size).toBe(2);
  a.dispose();
  const b = createSectionPresentation(r, false, s);
  expect(records).toHaveLength(0);
  b.dispose();
});
it('does not prepare visible content or a hash visit', () => {
  const r = fixture();
  position = 100;
  const a = createSectionPresentation(r, false, new Set());
  expect(r.querySelector<HTMLElement>('[data-narrative]')!.dataset.narrativeState).toBe('static');
  a.dispose();
  position = 1200;
  history.replaceState(null, '', '/#second');
  const b = createSectionPresentation(r, false, new Set());
  expect(records).toHaveLength(0);
  b.dispose();
});
it('cancels and cleans on resize and unmount without touching content', () => {
  const r = fixture(),
    controller = createSectionPresentation(r, false, new Set());
  const node = r.querySelector<HTMLElement>('[data-narrative]')!;
  position = 600;
  emit(
    [{ isIntersecting: true, target: node } as unknown as IntersectionObserverEntry],
    {} as IntersectionObserver,
  );
  window.dispatchEvent(new Event('resize'));
  expect(records[0]!.cancel).toHaveBeenCalled();
  expect(node.style.opacity).toBe('');
  expect(r.querySelector('button')?.textContent).toBe('Action');
  controller.dispose();
  records[0]!.complete?.();
  expect(node.style.transform).toBe('');
});
it('uses static fallback without observation support', () => {
  const r = fixture();
  vi.stubGlobal('IntersectionObserver', undefined);
  const a = createSectionPresentation(r, false, new Set());
  expect(records).toHaveLength(0);
  expect(r.querySelector<HTMLElement>('[data-narrative]')!.dataset.narrativeState).toBe('static');
  a.dispose();
});
