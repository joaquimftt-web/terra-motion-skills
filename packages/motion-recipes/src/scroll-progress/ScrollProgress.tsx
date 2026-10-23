import {
  useEffect,
  useImperativeHandle,
  useRef,
  type HTMLAttributes,
  type ReactElement,
  type Ref,
  type RefObject,
} from 'react';
import { motionValue } from 'motion';

export type ScrollProgressSource =
  | { type: 'document' }
  | {
      type: 'container';
      containerRef: RefObject<HTMLElement | null>;
      contentRef: RefObject<HTMLElement | null>;
    }
  | { type: 'section'; targetRef: RefObject<HTMLElement | null> };
export type ScrollProgressProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  | 'children'
  | 'dangerouslySetInnerHTML'
  | 'role'
  | 'tabIndex'
  | 'aria-hidden'
  | 'aria-label'
  | 'aria-labelledby'
  | 'aria-live'
> & {
  source?: ScrollProgressSource;
  ref?: Ref<HTMLDivElement>;
};

type Resolved = {
  type: ScrollProgressSource['type'];
  container: HTMLElement | null;
  content: HTMLElement | null;
  section: HTMLElement | null;
};
function resolveSource(source: ScrollProgressSource): Resolved {
  return {
    type: source.type,
    container: source.type === 'container' ? source.containerRef.current : null,
    content: source.type === 'container' ? source.contentRef.current : null,
    section: source.type === 'section' ? source.targetRef.current : null,
  };
}
const same = (a: Resolved, b: Resolved) =>
  a.type === b.type &&
  a.container === b.container &&
  a.content === b.content &&
  a.section === b.section;

/** One scoped subscription and demand-driven frame. Never owns scrolling/history. */
function subscribe(source: Resolved, fill: HTMLSpanElement) {
  let disposed = false,
    frame: number | undefined;
  // A new source owns new geometry; MotionValue(0).set(0) emits no change.
  // Clear the previous source's paint before the first measured frame.
  fill.style.transform = 'scaleX(0)';
  fill.style.visibility = 'hidden';
  const progress = motionValue(0);
  const stopValue = progress.on('change', (value) => {
    fill.style.transform = `scaleX(${value})`;
  });
  const root = source.type === 'container' ? source.container : document.scrollingElement;
  const eventRoot: Window | HTMLElement | null =
    source.type === 'container' ? source.container : window;
  const cleanups: (() => void)[] = [];
  const clamp = (n: number) => Math.max(0, Math.min(1, n));
  function measure() {
    if (disposed) return;
    let value = 0,
      valid = false;
    try {
      if (source.type === 'section') {
        const target = source.section;
        if (target?.isConnected) {
          const css = getComputedStyle(target),
            box = target.getBoundingClientRect(),
            viewport = window.innerHeight;
          valid =
            Number.isFinite(box.top) &&
            Number.isFinite(box.height) &&
            box.height > 0 &&
            Number.isFinite(viewport) &&
            viewport > 0 &&
            !['fixed', 'sticky', 'absolute'].includes(css.position) &&
            (!css.transform || css.transform === 'none');
          if (valid) value = clamp((viewport - box.top) / (viewport + box.height));
        }
      } else if (root?.isConnected) {
        const contentValid =
          source.type === 'document' ||
          (source.content?.isConnected &&
            source.content !== root &&
            root.contains(source.content) &&
            !['absolute', 'fixed'].includes(getComputedStyle(source.content).position));
        const range = root.scrollHeight - root.clientHeight;
        valid =
          Boolean(contentValid) &&
          [root.scrollTop, range, root.clientHeight].every(Number.isFinite) &&
          range > 0 &&
          root.clientHeight > 0;
        if (valid) value = clamp(root.scrollTop / range);
      }
    } catch {
      valid = false;
    }
    fill.style.visibility = valid ? 'visible' : 'hidden';
    progress.set(valid ? value : 0);
  }
  function schedule() {
    if (disposed || frame !== undefined) return;
    if (typeof requestAnimationFrame !== 'function') {
      measure();
      return;
    }
    frame = requestAnimationFrame(() => {
      frame = undefined;
      measure();
    });
  }
  function listen(target: EventTarget | null, name: string, capture = false) {
    if (!target) return;
    target.addEventListener(name, schedule, { passive: true, capture });
    cleanups.push(() => target.removeEventListener(name, schedule, capture));
  }
  listen(eventRoot, 'scroll');
  for (const name of ['resize', 'pageshow', 'hashchange', 'popstate']) listen(window, name);
  listen(window.visualViewport, 'resize');
  const flow = source.type === 'container' ? source.content : document.body;
  listen(flow, 'load', true);
  listen(document.fonts, 'loadingdone');
  document.fonts?.ready.then(() => {
    if (!disposed) schedule();
  });
  if (typeof ResizeObserver !== 'undefined') {
    let observer: ResizeObserver | undefined;
    try {
      observer = new ResizeObserver(schedule);
      const targets =
        source.type === 'container'
          ? [source.container, source.content]
          : [document.documentElement, document.body, source.section];
      for (const target of new Set(targets)) if (target?.isConnected) observer.observe(target);
      cleanups.push(() => observer?.disconnect());
    } catch {
      observer?.disconnect();
    }
  }
  // Flow insertion/reordering may move a section without changing its own size.
  // No style attributes observed: our own writes cannot create an observer loop.
  if (flow && typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver(schedule);
    try {
      observer.observe(flow, { subtree: true, childList: true, characterData: true });
      cleanups.push(() => observer.disconnect());
    } catch {
      observer.disconnect();
    }
  }
  schedule();
  return () => {
    disposed = true;
    if (frame !== undefined) cancelAnimationFrame(frame);
    for (const cleanup of cleanups) cleanup();
    stopValue();
    progress.destroy();
  };
}

export function ScrollProgress({
  source = { type: 'document' },
  ref,
  style,
  ...native
}: ScrollProgressProps): ReactElement {
  const root = useRef<HTMLDivElement>(null),
    fill = useRef<HTMLSpanElement>(null);
  const current = useRef<{ resolved: Resolved; dispose: () => void } | null>(null);
  useImperativeHandle(ref, () => root.current!, []);
  useEffect(() => {
    const resolved = resolveSource(source);
    if (current.current && same(current.current.resolved, resolved)) return;
    current.current?.dispose();
    current.current = { resolved, dispose: subscribe(resolved, fill.current!) };
  });
  useEffect(
    () => () => {
      current.current?.dispose();
      current.current = null;
    },
    [],
  );
  return (
    <div
      {...native}
      ref={root}
      aria-hidden="true"
      role={undefined}
      tabIndex={undefined}
      style={{ height: 4, ...style, pointerEvents: 'none' }}
    >
      <span
        ref={fill}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          backgroundColor: 'currentColor',
          transformOrigin: 'left center',
          transform: 'scaleX(0)',
          visibility: 'hidden',
        }}
      />
    </div>
  );
}
