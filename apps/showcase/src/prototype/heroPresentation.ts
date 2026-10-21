import { animate } from 'motion/mini';

/** Private P1 score, not a recipe or reusable public timeline API. */
export function createHeroPresentation(root: HTMLElement, reduced: boolean) {
  const media = window.matchMedia('(max-width: 700px)');
  const active = new Map<HTMLElement, ReturnType<typeof animate>>();
  const owned = new Set<HTMLElement>();
  let disposed = false;
  const clear = (node: HTMLElement) => {
    active.get(node)?.cancel();
    active.delete(node);
    for (const property of ['transform', 'opacity', 'clip-path'])
      node.style.removeProperty(property);
  };
  const finish = () => owned.forEach(clear);
  const resize = () => finish();
  media.addEventListener('change', resize);

  function play(replay: boolean) {
    if (disposed || reduced || document.hidden || typeof Element.prototype.animate !== 'function') {
      finish();
      return;
    }
    const mobile = media.matches;
    const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];
    const score = [
      {
        selector: '.lp-p1-underlay',
        delay: 0,
        duration: mobile ? 0.84 : 1.1,
        opacity: 0.68,
        endOpacity: 0,
      },
      {
        selector: '.lp-material-base',
        delay: 0,
        duration: mobile ? 0.84 : 1.1,
        opacity: 0.86,
        material: true,
      },
      {
        selector: '.lp-material-light',
        delay: 0.08,
        duration: mobile ? 0.55 : 0.8,
        opacity: 0.4,
        y: mobile ? 8 : 20,
      },
      {
        selector: '.lp-hero-coordinate',
        delay: mobile ? 0.06 : 0.12,
        duration: 0.4,
        opacity: 0.72,
        y: 6,
      },
      {
        selector: '.lp-hero .lp-kicker',
        delay: mobile ? 0.08 : 0.16,
        duration: mobile ? 0.36 : 0.48,
        opacity: 0.66,
        y: mobile ? 6 : 10,
      },
      {
        selector: '.lp-hero-line:nth-child(1)',
        delay: mobile ? 0.12 : 0.22,
        duration: mobile ? 0.56 : 0.76,
        opacity: mobile ? 0.68 : 0.56,
        y: mobile ? 16 : 32,
        rotate: mobile ? 0 : 0.4,
      },
      {
        selector: '.lp-hero-line:nth-child(2)',
        delay: mobile ? 0.19 : 0.31,
        duration: mobile ? 0.62 : 0.84,
        opacity: mobile ? 0.68 : 0.58,
        y: mobile ? 20 : 40,
        rotate: mobile ? 0 : 0.6,
      },
      {
        selector: '.lp-hero-description',
        delay: mobile ? 0.3 : 0.46,
        duration: mobile ? 0.44 : 0.62,
        opacity: 0.68,
        y: mobile ? 8 : 14,
      },
      {
        selector: '.lp-actions',
        delay: mobile ? 0.33 : 0.54,
        duration: mobile ? 0.3 : 0.42,
        opacity: mobile ? 0.86 : 0.78,
      },
      {
        selector: '.lp-hero-foot',
        delay: mobile ? 0.38 : 0.6,
        duration: mobile ? 0.3 : 0.4,
        opacity: 0.8,
      },
      {
        selector: '.lp-material-key',
        delay: mobile ? 0.34 : 0.5,
        duration: mobile ? 0.38 : 0.5,
        opacity: 0.76,
        y: 6,
      },
    ];
    // Snapshot before cancellation keeps rapid replay continuous.
    const entries = score.flatMap((item) => {
      const node = root.querySelector<HTMLElement>(item.selector);
      if (!node) return [];
      const css = getComputedStyle(node);
      return [
        {
          item,
          node,
          from: {
            opacity: Number(css.opacity),
            transform: css.transform === 'none' ? 'translateY(0px)' : css.transform,
            clipPath:
              css.clipPath === 'none' || !css.clipPath ? 'inset(0% 0% 0% 0%)' : css.clipPath,
          },
        },
      ];
    });
    finish();
    try {
      for (const { item, node, from } of entries) {
        owned.add(node);
        const targetOpacity = item.endOpacity ?? 1;
        const startTransform = item.material
          ? `scale(${mobile ? 1.015 : 1.035})`
          : `translateY(${item.y ?? 0}px) rotate(${item.rotate ?? 0}deg)`;
        const finalTransform = item.material ? 'scale(1)' : 'translateY(0px) rotate(0deg)';
        const clip = `inset(0% 0% 0% ${mobile ? 8 : 18}%)`;
        const frames = {
          opacity: replay
            ? [from.opacity, item.endOpacity === 0 ? 0.35 : 0.9, targetOpacity]
            : [item.opacity, targetOpacity],
          ...(item.y || item.material
            ? {
                transform: replay
                  ? [
                      from.transform,
                      item.material
                        ? `scale(${mobile ? 1.008 : 1.018})`
                        : `translateY(${Math.min(item.y ?? 0, mobile ? 6 : 12)}px)`,
                      finalTransform,
                    ]
                  : [startTransform, finalTransform],
              }
            : {}),
          ...(item.material
            ? {
                clipPath: replay
                  ? [from.clipPath, `inset(0% 0% 0% ${mobile ? 3 : 6}%)`, 'inset(0% 0% 0% 0%)']
                  : [clip, 'inset(0% 0% 0% 0%)'],
              }
            : {}),
        };
        if (!replay) {
          node.style.opacity = String(item.opacity);
          if (frames.transform) node.style.transform = startTransform;
          if (item.material) node.style.clipPath = clip;
        }
        const control = animate(node, frames, {
          duration: item.duration,
          delay: replay ? item.delay * 0.6 : item.delay,
          ease,
          ...(replay ? { times: [0, 0.28, 1] } : {}),
        });
        active.set(node, control);
        control.then(() => {
          if (!disposed && active.get(node) === control) clear(node);
        });
      }
    } catch {
      finish();
    }
  }
  return {
    play,
    finish,
    dispose() {
      disposed = true;
      finish();
      media.removeEventListener('change', resize);
    },
  };
}
