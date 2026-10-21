import { useLayoutEffect, useRef } from 'react';
import { animate } from 'motion/mini';
import { createHeroPresentation } from './heroPresentation';

/** Throwaway app presentation, not a recipe or a public API. Visible HTML is the baseline. */
export function usePresentation(reduced: boolean) {
  const scope = useRef<HTMLDivElement>(null);
  const replay = useRef<() => void>(() => {});
  useLayoutEffect(() => {
    const root = scope.current;
    if (!root) return;
    const heroController = createHeroPresentation(root, reduced);
    let disposed = false;
    const active = new Map<HTMLElement, ReturnType<typeof animate>>();
    const owned = new Set<HTMLElement>();
    const clean = (node: HTMLElement) => {
      active.get(node)?.cancel();
      active.delete(node);
      node.style.removeProperty('transform');
      node.style.removeProperty('opacity');
    };
    const finish = () => {
      heroController.finish();
      owned.forEach(clean);
    };
    function play(node: HTMLElement, delay = 0, intro = false, explicit = false) {
      if (disposed || reduced || document.hidden) return clean(node);
      const css = getComputedStyle(node);
      const from = css.transform === 'none' ? 'translateY(0px)' : css.transform;
      const floor = node.dataset.travel ? 0.82 : 0.48;
      const opacity = Math.max(floor, Number(css.opacity));
      const travel = node.dataset.travel ?? (node.classList.contains('lp-hero-line') ? '28' : '14');
      clean(node);
      owned.add(node);
      try {
        const control = animate(
          node,
          {
            transform: explicit
              ? [from, 'translateY(' + travel + 'px)', 'translateY(0px)']
              : [from, 'translateY(0px)'],
            ...(intro ? { opacity: explicit ? [opacity, floor, 1] : [opacity, 1] } : {}),
          },
          {
            duration: intro ? (node.dataset.travel ? 1.15 : 0.9) : 0.6,
            delay,
            ease: [0.2, 0, 0, 1],
            ...(explicit ? { times: [0, 0.25, 1] } : {}),
          },
        );
        active.set(node, control);
        control.then(() => {
          if (!disposed && active.get(node) === control) clean(node);
        });
      } catch {
        clean(node);
      }
    }
    replay.current = () => heroController.play(true);
    if (!reduced && document.readyState !== 'complete') heroController.play(false);
    let observer: IntersectionObserver | undefined;
    if (!reduced && typeof IntersectionObserver !== 'undefined') {
      try {
        observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const node = entry.target as HTMLElement;
            observer?.unobserve(node);
            if (owned.has(node)) play(node);
          });
        });
        root.querySelectorAll<HTMLElement>('[data-arrive]').forEach((node) => {
          const box = node.getBoundingClientRect();
          if (box.top >= innerHeight + 24 && box.width > 0 && box.height > 0) {
            owned.add(node);
            node.style.transform = 'translateY(24px)';
            observer?.observe(node);
          }
        });
      } catch {
        finish();
        observer?.disconnect();
      }
    }
    const interaction = (event: Event) => {
      // A repeated press on replay must snapshot the running score, not finish it first.
      if (
        event.type === 'pointerdown' &&
        event.target instanceof Element &&
        event.target.closest('.lp-hero-foot button')
      ) {
        owned.forEach(clean);
        observer?.disconnect();
        return;
      }
      if (event.type === 'visibilitychange' && !document.hidden) return;
      finish();
      observer?.disconnect();
    };
    root.addEventListener('focusin', interaction);
    root.addEventListener('pointerdown', interaction);
    document.addEventListener('visibilitychange', interaction);
    return () => {
      disposed = true;
      heroController.dispose();
      finish();
      observer?.disconnect();
      root.removeEventListener('focusin', interaction);
      root.removeEventListener('pointerdown', interaction);
      document.removeEventListener('visibilitychange', interaction);
      replay.current = () => {};
    };
  }, [reduced]);
  return { scope, replayIntro: () => replay.current() };
}
