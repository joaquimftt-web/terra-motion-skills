import { animate } from 'motion/mini';

/** P2.1 throwaway presentation only. No recipe API or content animation. */
export function createMineralFold(
  plane: HTMLElement,
  region: HTMLElement,
  reduced: boolean,
  session: { consumed: boolean },
  materialUrl: string,
) {
  const slot = plane.parentElement!;
  let disposed = false;
  let terminal = false;
  let observer: IntersectionObserver | undefined;
  let active: ReturnType<typeof animate> | undefined;
  let lastScroll = window.scrollY;
  let generation = 0;
  const removers: (() => void)[] = [];
  const history: { state: string; reason: string; time: number; top: number }[] = [];
  const record = (state: string, reason: string) => {
    plane.dataset.foldState = state;
    plane.dataset.foldReason = reason;
    history.push({
      state,
      reason,
      time: Math.round(performance.now()),
      top: Math.round(slot.getBoundingClientRect().top),
    });
    plane.dataset.foldHistory = JSON.stringify(history.slice(-12));
  };
  const clear = () => {
    active?.cancel();
    active = undefined;
    plane.style.removeProperty('transform');
    plane.style.removeProperty('opacity');
    observer?.disconnect();
    observer = undefined;
    removers.splice(0).forEach((remove) => remove());
  };
  const finish = (reason: string, consume = true) => {
    if (terminal || disposed) return;
    terminal = true;
    generation++;
    if (consume) session.consumed = true;
    clear();
    record('static', reason);
  };
  function listen(target: EventTarget, name: string, callback: EventListener) {
    target.addEventListener(name, callback, { passive: true });
    removers.push(() => target.removeEventListener(name, callback));
  }
  function play() {
    if (terminal || disposed || session.consumed) return;
    const box = slot.getBoundingClientRect();
    if (
      document.hidden ||
      box.width <= 0 ||
      box.height <= 0 ||
      box.top < innerHeight * 0.35 ||
      box.top > innerHeight
    ) {
      finish('missed-window');
      return;
    }
    session.consumed = true;
    observer?.disconnect();
    observer = undefined;
    const mobile = innerWidth <= 700;
    const run = ++generation;
    record('playing', 'viewport');
    plane.dataset.foldRuns = '1';
    try {
      active = animate(
        plane,
        {
          transform: mobile
            ? ['translate3d(-5%, 6px, 0)', 'translate3d(0%, 0px, 0)', 'translate3d(5%, -6px, 0)']
            : [
                'translate3d(-9%, 12px, 0)',
                'translate3d(0%, -4px, 0)',
                'translate3d(7%, -12px, 0)',
              ],
          opacity: [0, 0.94, 0],
        },
        { duration: mobile ? 0.42 : 0.62, ease: [0.22, 1, 0.36, 1], times: [0, 0.42, 1] },
      );
      active.then(() => {
        if (!disposed && !terminal && generation === run) finish('complete');
      });
    } catch {
      finish('animation-error');
    }
  }
  plane.dataset.foldRuns = '0';
  record('static', 'initial');
  const dispose = () => {
    if (disposed) return;
    if (!terminal) finish('dispose', session.consumed);
    disposed = true;
    generation++;
    clear();
  };
  if (session.consumed) finish('consumed');
  else if (reduced) finish('reduced');
  else if (new URLSearchParams(location.search).get('p21') === 'off') finish('comparison-off');
  else if (location.hash) finish('anchor');
  else if (document.hidden || document.readyState === 'complete' || scrollY !== 0)
    finish('late-entry');
  else if (innerHeight < 480) finish('short-viewport');
  else if (
    typeof IntersectionObserver === 'undefined' ||
    typeof Element.prototype.animate !== 'function' ||
    typeof Image.prototype.decode !== 'function'
  )
    finish('unsupported');
  if (terminal) return { dispose };

  listen(region, 'focusin', () => finish('interaction'));
  listen(region, 'pointerdown', () => finish('interaction'));
  listen(window, 'resize', () => finish('resize'));
  listen(window, 'orientationchange', () => finish('orientation'));
  listen(window, 'hashchange', () => finish('anchor'));
  listen(window, 'popstate', () => finish('history'));
  listen(document, 'visibilitychange', () => {
    if (document.hidden) finish('hidden');
  });
  listen(window, 'pageshow', (event) => {
    if ((event as PageTransitionEvent).persisted) finish('restored');
  });
  listen(document, 'click', (event) => {
    const anchor =
      event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null;
    if (!anchor) return;
    const url = new URL(anchor.href, location.href);
    if (url.origin === location.origin && url.pathname === location.pathname && url.hash)
      finish('anchor');
  });
  listen(window, 'scroll', () => {
    const current = window.scrollY;
    const box = slot.getBoundingClientRect();
    if (current < lastScroll - 2) finish('reverse-scroll');
    else if (box.bottom < 0 || (!session.consumed && box.top < innerHeight * 0.35))
      finish('fast-scroll');
    lastScroll = current;
  });
  const image = new Image();
  image.src = materialUrl;
  try {
    void image.decode().then(
      () => {
        if (disposed || terminal) return;
        const box = slot.getBoundingClientRect();
        if (
          document.hidden ||
          location.hash ||
          window.scrollY !== 0 ||
          !Number.isFinite(box.top) ||
          box.top < innerHeight + 24 ||
          box.width <= 0 ||
          box.height <= 0
        ) {
          finish('unsafe-preparation');
          return;
        }
        record('prepared', 'offscreen');
        try {
          observer = new IntersectionObserver(
            (entries) => {
              if (!disposed && !terminal && entries.some((entry) => entry.isIntersecting)) play();
            },
            { rootMargin: `0px 0px -${Math.round(innerHeight * 0.32)}px 0px`, threshold: 0 },
          );
          observer.observe(slot);
        } catch {
          finish('observer-error');
        }
      },
      () => {
        if (!disposed) finish('image-error');
      },
    );
  } catch {
    finish('image-error');
  }
  return { dispose };
}
