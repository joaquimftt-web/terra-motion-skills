import { animate } from 'motion/mini';

/** Showcase-owned decorative chapter accents, never a recipe or content reveal. */
export function createSectionPresentation(
  root: HTMLElement,
  reduced: boolean,
  consumed: Set<HTMLElement>,
) {
  const nodes = [...root.querySelectorAll<HTMLElement>('[data-narrative]')];
  const active = new Map<HTMLElement, ReturnType<typeof animate>>();
  const pending = new Set<HTMLElement>();
  const removers: (() => void)[] = [];
  let disposed = false;
  let observer: IntersectionObserver | undefined;
  const settle = (node: HTMLElement, reason: string, consume = true) => {
    active.get(node)?.cancel();
    active.delete(node);
    pending.delete(node);
    observer?.unobserve(node);
    if (consume) consumed.add(node);
    node.style.removeProperty('transform');
    node.style.removeProperty('opacity');
    node.dataset.narrativeState = 'static';
    node.dataset.narrativeReason = reason;
  };
  function finishAll(reason: string) {
    nodes.forEach((n) => settle(n, reason));
    observer?.disconnect();
  }
  function listen(target: EventTarget, event: string, handler: EventListener) {
    target.addEventListener(event, handler, { passive: true });
    removers.push(() => target.removeEventListener(event, handler));
  }
  const dispose = () => {
    disposed = true;
    for (const node of nodes) settle(node, 'dispose', consumed.has(node));
    observer?.disconnect();
    removers.splice(0).forEach((remove) => remove());
  };
  if (
    reduced ||
    location.hash ||
    document.hidden ||
    typeof IntersectionObserver === 'undefined' ||
    typeof Element.prototype.animate !== 'function'
  ) {
    finishAll(reduced ? 'reduced' : 'fallback');
    return { dispose };
  }
  try {
    observer = new IntersectionObserver(
      (entries) => {
        if (disposed) return;
        for (const entry of entries) {
          const node = entry.target as HTMLElement;
          if (!entry.isIntersecting || !pending.has(node) || consumed.has(node)) continue;
          const box = node.getBoundingClientRect();
          if (box.bottom <= 0 || box.top < 0 || document.hidden) {
            settle(node, 'missed-window');
            continue;
          }
          consumed.add(node);
          pending.delete(node);
          observer?.unobserve(node);
          const kind = node.dataset.narrative;
          const frames =
            kind === 'method'
              ? { transform: ['scaleY(0.15)', 'scaleY(1)', 'scaleY(1)'], opacity: [0.2, 0.8, 0.2] }
              : kind === 'closing'
                ? {
                    transform: ['translateX(-60px)', 'translateX(0)', 'translateX(60px)'],
                    opacity: [0, 0.6, 0],
                  }
                : {
                    transform: [
                      'translateY(18px) scaleY(0.3)',
                      'translateY(0) scaleY(1)',
                      'translateY(0) scaleY(1)',
                    ],
                    opacity: [0, 0.65, 0],
                  };
          node.dataset.narrativeState = 'playing';
          try {
            const control = animate(node, frames, {
              duration: kind === 'method' ? 0.56 : kind === 'closing' ? 0.46 : 0.38,
              ease: [0.22, 1, 0.36, 1],
              times: [0, 0.6, 1],
            });
            active.set(node, control);
            control.then(() => {
              if (!disposed && active.get(node) === control) settle(node, 'complete');
            });
          } catch {
            settle(node, 'error');
          }
        }
      },
      { rootMargin: `0px 0px -${Math.round(innerHeight * 0.12)}px 0px` },
    );
    for (const node of nodes) {
      const box = node.getBoundingClientRect();
      if (!consumed.has(node) && box.top >= innerHeight + 24 && box.width > 0 && box.height > 0) {
        pending.add(node);
        node.dataset.narrativeState = 'prepared';
        observer.observe(node);
      } else settle(node, 'visible-or-consumed');
    }
  } catch {
    finishAll('observer-error');
  }
  const interaction = (event: Event) => {
    const section = event.target instanceof Element ? event.target.closest('section') : null;
    if (section)
      nodes
        .filter((n) => n.closest('section') === section)
        .forEach((n) => settle(n, 'interaction'));
  };
  listen(root, 'focusin', interaction);
  listen(root, 'pointerdown', interaction);
  listen(window, 'resize', () => finishAll('resize'));
  listen(window, 'hashchange', () => finishAll('anchor'));
  listen(document, 'visibilitychange', () => {
    if (document.hidden) finishAll('hidden');
  });
  return { dispose };
}
