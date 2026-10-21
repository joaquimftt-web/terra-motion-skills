import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createHeroPresentation } from './heroPresentation';
const records = vi.hoisted(
  () =>
    [] as {
      node: HTMLElement;
      frames: Record<string, unknown>;
      options: { duration: number; delay: number };
      cancel: ReturnType<typeof vi.fn>;
      complete: (() => void) | undefined;
    }[],
);
vi.mock('motion/mini', () => ({
  animate: vi.fn((node, frames, options) => {
    const row = {
      node,
      frames,
      options,
      cancel: vi.fn(),
      complete: undefined as (() => void) | undefined,
    };
    records.push(row);
    return {
      cancel: row.cancel,
      then: (done: () => void) => {
        row.complete = done;
      },
    };
  }),
}));
function fixture() {
  document.body.innerHTML =
    '<div id="scope"><section class="lp-hero"><div class="lp-material-scene"><div class="lp-p1-underlay"></div><div class="lp-material-base"></div><div class="lp-material-light"></div><div class="lp-material-contour"></div></div><div class="lp-hero-coordinate">Índice</div><p class="lp-kicker">Terra</p><h1><span class="lp-hero-line">Movimento.</span><em class="lp-hero-line">Com intenção.</em></h1><p class="lp-hero-description">Descrição</p><div class="lp-actions"><a href="#lab">Laboratório</a></div><div class="lp-hero-foot"><button>Replay</button></div><div class="lp-material-key">Mineral</div></section></div>';
  return document.querySelector<HTMLElement>('#scope')!;
}
beforeEach(() => {
  records.length = 0;
  Object.defineProperty(document, 'hidden', { configurable: true, value: false });
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })),
  );
  Element.prototype.animate = vi.fn();
});
describe('private P1 hero choreography', () => {
  it('reveals material, keeps essential text visible and actions stationary', () => {
    const root = fixture(),
      hero = createHeroPresentation(root, false);
    hero.play(false);
    expect(records.length).toBeGreaterThan(6);
    const image = records.find((r) => r.node.className === 'lp-material-base')!;
    expect(image.frames.clipPath).toBeDefined();
    const titles = records.filter((r) => r.node.className === 'lp-hero-line');
    expect(titles).toHaveLength(2);
    expect(titles.every((r) => !r.frames.clipPath)).toBe(true);
    expect(titles[0]!.options.delay).toBeLessThan(titles[1]!.options.delay);
    const actions = records.find((r) => r.node.className === 'lp-actions')!;
    expect(actions.frames.transform).toBeUndefined();
    expect(root.querySelector('a')?.hasAttribute('inert')).toBe(false);
    hero.dispose();
  });
  it('uses a shorter mobile score with smaller title travel', () => {
    const a = createHeroPresentation(fixture(), false);
    a.play(false);
    const desktop = records.find((r) => r.node.className === 'lp-hero-line')!;
    a.dispose();
    records.length = 0;
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })),
    );
    const b = createHeroPresentation(fixture(), false);
    b.play(false);
    const mobile = records.find((r) => r.node.className === 'lp-hero-line')!;
    expect(mobile.options.duration).toBeLessThan(desktop.options.duration);
    expect(JSON.stringify(mobile.frames.transform)).toContain('16px');
    b.dispose();
  });
  it('cancels replay and ignores callbacks from superseded runs', () => {
    const root = fixture(),
      child = root.querySelector('a');
    const hero = createHeroPresentation(root, false);
    hero.play(false);
    const old = [...records];
    hero.play(true);
    expect(old.every((r) => r.cancel.mock.calls.length > 0)).toBe(true);
    const title = root.querySelector<HTMLElement>('.lp-hero-line')!;
    title.style.opacity = '.9';
    old.forEach((r) => r.complete?.());
    expect(title.style.opacity).toBe('0.9');
    expect(root.querySelector('a')).toBe(child);
    hero.dispose();
  });
  it('finishes and disposes without residual inline animation styles', () => {
    const root = fixture(),
      hero = createHeroPresentation(root, false);
    hero.play(false);
    hero.finish();
    expect(
      [...root.querySelectorAll<HTMLElement>('*')].every(
        (n) => !n.style.transform && !n.style.opacity && !n.style.clipPath,
      ),
    ).toBe(true);
    hero.dispose();
    const count = records.length;
    hero.play(true);
    expect(records.length).toBe(count);
  });
  it('stays static with reduced motion', () => {
    const root = fixture(),
      hero = createHeroPresentation(root, true);
    hero.play(false);
    hero.play(true);
    expect(records).toHaveLength(0);
    expect(root.querySelector('h1')?.textContent).toContain('Movimento');
    hero.dispose();
  });
  it('stays static without WAAPI or in a hidden document', () => {
    const root = fixture();
    Element.prototype.animate = undefined as unknown as typeof Element.prototype.animate;
    const hero = createHeroPresentation(root, false);
    hero.play(false);
    expect(records).toHaveLength(0);
    hero.dispose();
    Element.prototype.animate = vi.fn();
    Object.defineProperty(document, 'hidden', { configurable: true, value: true });
    const hidden = createHeroPresentation(root, false);
    hidden.play(true);
    expect(records).toHaveLength(0);
    hidden.dispose();
  });
});
