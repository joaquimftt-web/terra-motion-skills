import { animate } from 'motion/mini';
import { motionTokens } from '@motion-skills-lab/motion-tokens';

export type EntranceOptions = {
  duration: number;
  offset: number;
  once: boolean;
  replayKey?: string | number | undefined;
  reduceMotion: boolean;
  stagger?: number;
};

/** Private, single-root lifecycle. No state/frame, public controller or app dependency. */
export function createEntranceLifecycle(
  root: HTMLElement,
  targets: readonly HTMLElement[],
  initial: EntranceOptions,
) {
  let options = initial;
  let state: 'settled' | 'prepared' | 'running' = 'settled';
  let generation = 0;
  let disposed = false;
  const pointers = new Set<number>();
  let preparedSize: { width: number; height: number } | undefined;
  let consumed = false;
  let playback: ReturnType<typeof animate>[] = [];
  let io: IntersectionObserver | undefined;
  let observing = false;
  let observationGeneration = 0;
  let observerAvailable = false;
  let entered = false;
  let mayRearm = false;
  let resize: ResizeObserver | undefined;
  let mutations: MutationObserver | undefined;
  let media: MediaQueryList | undefined;

  const reduced = () => !media || media.matches || options.reduceMotion;
  const blocked = () =>
    disposed ||
    targets.length === 0 ||
    pointers.size > 0 ||
    root.contains(document.activeElement) ||
    reduced() ||
    document.visibilityState === 'hidden' ||
    options.duration === 0 ||
    options.offset === 0;
  const stopObserving = () => {
    observationGeneration++;
    io?.disconnect();
    observing = false;
  };
  const stopGeometry = () => {
    resize?.disconnect();
    mutations?.disconnect();
    resize = undefined;
    mutations = undefined;
  };
  const stop = () => {
    generation++;
    const active = playback;
    playback = [];
    try {
      for (const animation of active) {
        try {
          animation.stop();
        } catch {
          animation.cancel();
        }
      }
    } catch {
      // WAAPI commitStyles can reject when a native hidden/display change removes paint.
      for (const animation of active) animation.cancel();
    } finally {
      stopGeometry();
    }
  };
  function finish() {
    stop();
    for (const target of targets) {
      target.style.removeProperty('transform');
      target.style.removeProperty('will-change');
    }
    state = 'settled';
    consumed = true;
    if (options.once) stopObserving();
  }
  function observe() {
    if (targets.length === 0 || observing || !observerAvailable || disposed) return;
    const epoch = ++observationGeneration;
    try {
      io = new IntersectionObserver(
        (entries) => {
          if (
            disposed ||
            epoch !== observationGeneration ||
            !observing ||
            (options.once && consumed && state === 'settled')
          )
            return;
          const entry = entries.at(-1);
          const inside =
            entry?.isIntersecting &&
            entry.intersectionRect.width > 0 &&
            entry.intersectionRect.height > 0;
          if (inside) {
            entered = true;
            mayRearm = false;
            if (state === 'prepared') run(false);
          } else {
            if (entered) {
              mayRearm = true;
              entered = false;
            }
            if (state === 'running') finish();
            if (state === 'settled' && !options.once && mayRearm) {
              prepare();
              observe();
            }
          }
        },
        { threshold: 0, rootMargin: '0px' },
      );
      observing = true;
      io.observe(root);
    } catch {
      observerAvailable = false;
      finish();
      stopObserving();
    }
  }
  function visible() {
    const rect = root.getBoundingClientRect();
    return (
      rect.width > 0 &&
      rect.height > 0 &&
      rect.top < window.innerHeight &&
      rect.bottom > 0 &&
      rect.left < window.innerWidth &&
      rect.right > 0
    );
  }
  function safeGeometry(requireBelow = true) {
    // A conservative flow-only envelope, not an attempt to infer arbitrary painted overflow.
    const nodes = Array.from(
      new Set([
        root,
        ...targets.flatMap((target) => [target, ...Array.from(target.querySelectorAll('*'))]),
      ]),
    );
    for (const node of nodes) {
      const box = node.getBoundingClientRect();
      const css = getComputedStyle(node);
      if (
        ![box.top, box.bottom, box.width, box.height].every(Number.isFinite) ||
        box.width <= 0 ||
        box.height <= 0 ||
        (requireBelow && box.top < window.innerHeight + 24) ||
        box.left < 0 ||
        box.right > window.innerWidth
      )
        return false;
      if (
        !['', 'static', 'relative'].includes(css.position) ||
        (css.boxShadow && css.boxShadow !== 'none') ||
        (css.textShadow && css.textShadow !== 'none') ||
        (css.filter && css.filter !== 'none')
      )
        return false;
      if (!targets.includes(node as HTMLElement) && css.transform && css.transform !== 'none')
        return false;
      if (
        [
          css.translate,
          css.rotate,
          css.scale,
          css.perspective,
          css.clipPath,
          css.backdropFilter,
        ].some((value) => value && value !== 'none')
      )
        return false;
      if (
        ['::before', '::after'].some((pseudo) => {
          const content = getComputedStyle(node, pseudo).content;
          return content && !['none', 'normal'].includes(content);
        })
      )
        return false;
      // Native replaced controls clip their own surface; this cannot expose descendants outside it.
      const nativeControl = ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(node.tagName);
      if (
        !nativeControl &&
        ((css.overflow && css.overflow !== 'visible') ||
          (css.overflowX && css.overflowX !== 'visible') ||
          (css.overflowY && css.overflowY !== 'visible'))
      )
        return false;
    }
    for (let ancestor = root.parentElement; ancestor; ancestor = ancestor.parentElement) {
      const css = getComputedStyle(ancestor);
      if (
        !['', 'static', 'relative'].includes(css.position) ||
        (css.transform && css.transform !== 'none') ||
        [css.translate, css.rotate, css.scale, css.perspective, css.filter, css.clipPath].some(
          (value) => value && value !== 'none',
        ) ||
        (css.overflow && css.overflow !== 'visible') ||
        (css.overflowX && css.overflowX !== 'visible') ||
        (css.overflowY && css.overflowY !== 'visible')
      )
        return false;
    }
    return true;
  }
  function prepare() {
    if (blocked() || !safeGeometry()) {
      finish();
      return;
    }
    mayRearm = false;
    for (const target of targets) target.style.transform = `translateY(${options.offset}px)`;
    state = 'prepared';
    consumed = false;
    const original = root.getBoundingClientRect();
    preparedSize = { width: original.width, height: original.height };
    if (typeof ResizeObserver !== 'undefined') {
      resize = new ResizeObserver(() => {
        const box = root.getBoundingClientRect();
        if (
          state === 'prepared' &&
          (box.width !== original.width || box.height !== original.height)
        )
          finish();
      });
      resize.observe(root);
    }
    if (typeof MutationObserver !== 'undefined') {
      mutations = new MutationObserver((records) => {
        if (
          state === 'prepared' &&
          records.some(
            (record) =>
              !(
                targets.includes(record.target as HTMLElement) &&
                record.type === 'attributes' &&
                record.attributeName === 'style'
              ),
          )
        )
          finish();
      });
      mutations.observe(root, {
        subtree: true,
        attributes: true,
        childList: true,
        characterData: true,
      });
    }
  }
  function run(replay: boolean) {
    const box = root.getBoundingClientRect();
    const invalidPrepared =
      !replay &&
      (!safeGeometry(false) ||
        !preparedSize ||
        preparedSize.width !== box.width ||
        preparedSize.height !== box.height);
    if (blocked() || invalidPrepared || (replay && !safeGeometry(false))) {
      finish();
      return;
    }
    const starts = targets.map((target) => {
      const value = getComputedStyle(target).transform;
      return !value || value === 'none' ? 'translateY(0px)' : value;
    });
    stop();
    state = 'running';
    consumed = true;
    const id = generation;
    let remaining = targets.length;
    try {
      targets.forEach((target, index) => {
        const from = starts[index]!;
        target.style.transform = from;
        const animation = animate(
          target,
          {
            transform: replay
              ? [from, `translateY(${options.offset}px)`, 'translateY(0px)']
              : [from, 'translateY(0px)'],
          },
          {
            duration: options.duration / 1000,
            delay: Math.min(index * (options.stagger ?? 0), 200) / 1000,
            ...(replay ? { times: [0, 0.25, 1] } : {}),
            ease: [...motionTokens.easing.standard],
          },
        );
        playback.push(animation);
        animation.then(
          () => {
            if (!disposed && id === generation && --remaining === 0) finish();
          },
          () => {
            if (!disposed && id === generation) finish();
          },
        );
      });
    } catch {
      finish();
    }
  }

  function release(event?: Event) {
    if (event?.type === 'pointerup' || event?.type === 'pointercancel')
      pointers.delete((event as PointerEvent).pointerId);
    else pointers.clear();
    if (pointers.size) return;
    window.removeEventListener('pointerup', release, true);
    window.removeEventListener('pointercancel', release, true);
    window.removeEventListener('blur', release);
  }
  function pointerDown(pointerId: number) {
    finish();
    pointers.add(pointerId);
    window.addEventListener('pointerup', release, true);
    window.addEventListener('pointercancel', release, true);
    window.addEventListener('blur', release);
  }
  const mediaChanged = () => {
    finish();
  };
  const visibilityChanged = () => {
    finish();
    release();
  };
  // A wheel can skip the viewport entirely: IO remains false above and below.
  // Only inspect at scroll end after an actual exit; never measure each scroll frame.
  const scrollEnded = () => {
    if (!options.once && mayRearm && state === 'settled' && !visible()) {
      prepare();
      observe();
    }
  };
  try {
    if (typeof window.matchMedia === 'function') {
      media = window.matchMedia('(prefers-reduced-motion: reduce)');
      media.addEventListener('change', mediaChanged);
    }
    if (typeof IntersectionObserver !== 'undefined' && media) {
      observerAvailable = true;
      entered = visible();
      prepare();
      if (!consumed || !options.once) observe();
    }
  } catch {
    finish();
  }
  document.addEventListener('visibilitychange', visibilityChanged);
  if (!options.once) document.addEventListener('scrollend', scrollEnded);

  return {
    finish,
    pointerDown,
    activePointers: () => Array.from(pointers),
    update(next: EntranceOptions) {
      const replay = !Object.is(options.replayKey, next.replayKey);
      const changed =
        options.duration !== next.duration ||
        options.stagger !== next.stagger ||
        options.offset !== next.offset ||
        options.once !== next.once ||
        options.reduceMotion !== next.reduceMotion;
      options = next;
      document.removeEventListener('scrollend', scrollEnded);
      if (!options.once) document.addEventListener('scrollend', scrollEnded);
      if (replay) {
        if (!observerAvailable || blocked()) finish();
        else if (visible()) {
          observe();
          run(true);
        } else {
          finish();
          consumed = false;
          prepare();
          if (!consumed || !options.once) observe();
        }
      } else if (changed) {
        finish();
        if (!options.once) observe();
      }
    },
    dispose() {
      disposed = true;
      finish();
      stopObserving();
      release();
      media?.removeEventListener('change', mediaChanged);
      document.removeEventListener('visibilitychange', visibilityChanged);
      document.removeEventListener('scrollend', scrollEnded);
    },
  };
}
