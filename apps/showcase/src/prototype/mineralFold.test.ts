import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createMineralFold } from './mineralFold';

const records = vi.hoisted(
  () =>
    [] as {
      node: HTMLElement;
      frames: Record<string, unknown>;
      cancel: ReturnType<typeof vi.fn>;
      complete: (() => void) | undefined;
    }[],
);
vi.mock('motion/mini', () => ({
  animate: vi.fn((node, frames) => {
    const row = { node, frames, cancel: vi.fn(), complete: undefined as (() => void) | undefined };
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
let top: number;
let disconnect: ReturnType<typeof vi.fn>;
function fixture() {
  document.body.innerHTML =
    '<section id="biblioteca"><div class="lp-p2-slot" aria-hidden="true"><div class="lp-p2-plane"></div></div><button>Recipe</button></section>';
  const region = document.querySelector<HTMLElement>('section')!;
  const plane = region.querySelector<HTMLElement>('.lp-p2-plane')!;
  vi.spyOn(plane.parentElement!, 'getBoundingClientRect').mockImplementation(() => ({
    top,
    bottom: top + 128,
    left: 0,
    right: 1000,
    width: 1000,
    height: 128,
    x: 0,
    y: top,
    toJSON: () => ({}),
  }));
  return { region, plane };
}
async function ready() {
  await Promise.resolve();
  await Promise.resolve();
}
function enter() {
  top = 680;
  emit([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
}
beforeEach(() => {
  records.length = 0;
  top = 1200;
  disconnect = vi.fn();
  vi.stubGlobal('innerHeight', 900);
  vi.stubGlobal('innerWidth', 1440);
  vi.stubGlobal('scrollY', 0);
  history.replaceState(null, '', '/');
  Object.defineProperty(document, 'hidden', { configurable: true, value: false });
  Object.defineProperty(document, 'readyState', { configurable: true, value: 'interactive' });
  Object.defineProperty(HTMLImageElement.prototype, 'decode', {
    configurable: true,
    writable: true,
    value: vi.fn().mockResolvedValue(undefined),
  });
  Element.prototype.animate = vi.fn();
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(callback: IntersectionObserverCallback) {
        emit = callback;
      }
      observe = vi.fn();
      disconnect = disconnect;
    },
  );
});
describe('private P2.1 mineral fold', () => {
  it('prepares only outside viewport, animates only decoration once, and returns to static V4', async () => {
    const { region, plane } = fixture(),
      session = { consumed: false };
    const fold = createMineralFold(plane, region, false, session, '/material.png');
    await ready();
    expect(plane.dataset.foldState).toBe('prepared');
    const button = region.querySelector('button');
    enter();
    expect(plane.dataset.foldState).toBe('playing');
    expect(records).toHaveLength(1);
    expect(records[0]!.node).toBe(plane);
    expect(records[0]!.frames.clipPath).toBeUndefined();
    records[0]!.complete?.();
    expect(plane.dataset.foldState).toBe('static');
    expect(plane.style.transform).toBe('');
    expect(plane.style.opacity).toBe('');
    expect(region.querySelector('button')).toBe(button);
    enter();
    expect(records).toHaveLength(1);
    expect(session.consumed).toBe(true);
    fold.dispose();
  });
  it('never prepares content already visible or a direct anchor visit', async () => {
    const f = fixture();
    top = 600;
    const a = createMineralFold(f.plane, f.region, false, { consumed: false }, '/material.png');
    await ready();
    expect(f.plane.dataset.foldState).toBe('static');
    expect(records).toHaveLength(0);
    a.dispose();
    top = 1200;
    history.replaceState(null, '', '/#biblioteca');
    const b = createMineralFold(f.plane, f.region, false, { consumed: false }, '/material.png');
    await ready();
    expect(f.plane.dataset.foldReason).toBe('anchor');
    b.dispose();
  });
  it('prioritizes focus and ignores stale completion after cancellation', async () => {
    const f = fixture();
    const a = createMineralFold(f.plane, f.region, false, { consumed: false }, '/material.png');
    await ready();
    enter();
    f.region.querySelector('button')!.focus();
    expect(f.plane.dataset.foldReason).toBe('interaction');
    expect(records[0]!.cancel).toHaveBeenCalled();
    records[0]!.complete?.();
    expect(f.plane.dataset.foldReason).toBe('interaction');
    expect(disconnect).toHaveBeenCalled();
    a.dispose();
  });
  it('stays static for reduced motion and does not rearm a consumed session', async () => {
    const f = fixture(),
      session = { consumed: false };
    const a = createMineralFold(f.plane, f.region, true, session, '/material.png');
    await ready();
    expect(records).toHaveLength(0);
    expect(session.consumed).toBe(true);
    a.dispose();
    const b = createMineralFold(f.plane, f.region, false, session, '/material.png');
    await ready();
    expect(f.plane.dataset.foldReason).toBe('consumed');
    expect(records).toHaveLength(0);
    b.dispose();
  });
  it('uses a safe static state on fast scroll, reverse, resize and cleanup', async () => {
    for (const event of ['scroll', 'resize', 'dispose']) {
      const f = fixture(),
        a = createMineralFold(f.plane, f.region, false, { consumed: false }, '/material.png');
      top = 1200;
      await ready();
      if (event === 'scroll') {
        top = -500;
        window.dispatchEvent(new Event('scroll'));
      } else if (event === 'resize') window.dispatchEvent(new Event('resize'));
      else a.dispose();
      expect(f.plane.dataset.foldState).toBe('static');
      a.dispose();
    }
    expect(records).toHaveLength(0);
  });
  it('ignores a late image result after dispose and handles missing APIs', async () => {
    let resolveDecode: () => void = () => {};
    vi.spyOn(HTMLImageElement.prototype, 'decode').mockReturnValue(
      new Promise<void>((resolve) => {
        resolveDecode = resolve;
      }),
    );
    const f = fixture(),
      a = createMineralFold(f.plane, f.region, false, { consumed: false }, '/material.png');
    a.dispose();
    resolveDecode();
    await ready();
    expect(f.plane.dataset.foldState).toBe('static');
    expect(records).toHaveLength(0);
    vi.stubGlobal('IntersectionObserver', undefined);
    const b = createMineralFold(f.plane, f.region, false, { consumed: false }, '/material.png');
    expect(f.plane.dataset.foldReason).toBe('unsupported');
    b.dispose();
  });
  it('cancels a running passage on reverse scroll without restarting it', async () => {
    const f = fixture();
    const a = createMineralFold(f.plane, f.region, false, { consumed: false }, '/material.png');
    await ready();
    enter();
    vi.stubGlobal('scrollY', 40);
    window.dispatchEvent(new Event('scroll'));
    vi.stubGlobal('scrollY', 20);
    window.dispatchEvent(new Event('scroll'));
    expect(f.plane.dataset.foldReason).toBe('reverse-scroll');
    expect(records[0]!.cancel).toHaveBeenCalled();
    enter();
    expect(records).toHaveLength(1);
    a.dispose();
  });
  it('allows StrictMode setup cleanup before preparation without consuming a fresh session', async () => {
    const f = fixture(),
      session = { consumed: false };
    const first = createMineralFold(f.plane, f.region, false, session, '/material.png');
    first.dispose();
    expect(session.consumed).toBe(false);
    const second = createMineralFold(f.plane, f.region, false, session, '/material.png');
    await ready();
    expect(f.plane.dataset.foldState).toBe('prepared');
    enter();
    expect(records).toHaveLength(1);
    second.dispose();
    expect(session.consumed).toBe(true);
  });
  it('finishes safely when image decoding or the observer fails', async () => {
    vi.spyOn(HTMLImageElement.prototype, 'decode').mockRejectedValue(
      new Error('image unavailable'),
    );
    const f = fixture();
    const a = createMineralFold(f.plane, f.region, false, { consumed: false }, '/material.png');
    await ready();
    expect(f.plane.dataset.foldReason).toBe('image-error');
    a.dispose();
    vi.spyOn(HTMLImageElement.prototype, 'decode').mockResolvedValue(undefined);
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor() {
          throw new Error('observer unavailable');
        }
      },
    );
    const b = createMineralFold(f.plane, f.region, false, { consumed: false }, '/material.png');
    await ready();
    expect(f.plane.dataset.foldReason).toBe('observer-error');
    b.dispose();
    expect(records).toHaveLength(0);
  });
});
