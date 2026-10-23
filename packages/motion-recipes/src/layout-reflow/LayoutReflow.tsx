import {
  useCallback,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from 'react';
import { motion } from 'motion/react';

export type LayoutReflowItem = { id: string; content: ReactNode };
export type LayoutReflowProps = Omit<
  HTMLAttributes<HTMLUListElement>,
  'children' | 'dangerouslySetInnerHTML'
> & {
  items: readonly LayoutReflowItem[];
  reflowKey: string | number;
  duration?: number;
  reduceMotion?: boolean;
  ref?: Ref<HTMLUListElement>;
};

const query = '(prefers-reduced-motion: reduce)';
const serverSnapshot = () => false;
/** Probe both query and listener methods: a callable API can still be unavailable. */
function preferenceMedia(queryText = query) {
  try {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return null;
    const media = window.matchMedia(queryText);
    if (
      typeof media.addEventListener !== 'function' ||
      typeof media.removeEventListener !== 'function'
    )
      return null;
    const matches = media.matches;
    if (typeof matches !== 'boolean') return null;
    const probe = () => {};
    media.addEventListener('change', probe);
    media.removeEventListener('change', probe);
    return { media, matches };
  } catch {
    return null;
  }
}
function subscribeReduction(notify: () => void) {
  const preference = preferenceMedia();
  if (!preference) return () => {};
  try {
    preference.media.addEventListener('change', notify);
    return () => {
      try {
        preference.media.removeEventListener('change', notify);
      } catch {
        /* A failed platform cleanup cannot remove readable content. */
      }
    };
  } catch {
    return () => {};
  }
}
function reductionSnapshot() {
  return preferenceMedia()?.matches ?? true;
}
const subscribeSupport = () => () => {};
function supportSnapshot() {
  try {
    return (
      typeof window !== 'undefined' &&
      typeof window.requestAnimationFrame === 'function' &&
      preferenceMedia() !== null &&
      // Motion14 uses this equivalent query when initializing its own listener.
      preferenceMedia('(prefers-reduced-motion)') !== null &&
      typeof Element !== 'undefined' &&
      typeof Element.prototype.getBoundingClientRect === 'function'
    );
  } catch {
    return false;
  }
}
/** Position-only layout motion, explicitly authorized by the consumer's reflowKey. */
export function LayoutReflow({
  items,
  reflowKey,
  duration = 240,
  reduceMotion = false,
  ref,
  onFocusCapture,
  onBlurCapture,
  onPointerDownCapture,
  onKeyDownCapture,
  ...native
}: LayoutReflowProps) {
  // Keep the host component choice stable: unavailable platforms stay native
  // for this instance instead of mounting Motion against a hostile preference API.
  const [enableMotion] = useState(supportSnapshot);
  const root = useRef<HTMLUListElement>(null);
  useImperativeHandle(ref, () => root.current!, []);
  const systemReduced = useSyncExternalStore(subscribeReduction, reductionSnapshot, serverSnapshot);
  const supported = useSyncExternalStore(subscribeSupport, supportSnapshot, serverSnapshot);
  const reduced = reduceMotion || systemReduced;
  const intent = useMemo(() => ({ reflowKey }), [reflowKey]);
  const [focused, setFocused] = useState(false);
  const [timing, setTiming] = useState({ intent, duration });
  const [settled, setSettled] = useState<typeof intent | null>(null);
  const blocked =
    !enableMotion || !supported || reduced || duration === 0 || focused || settled === intent;
  const settle = useCallback(() => {
    setSettled(intent);
  }, [intent]);
  if (timing.intent !== intent || timing.duration !== duration) {
    setTiming({ intent, duration });
    if (timing.intent === intent) setSettled(intent);
  }
  // A render-time guard records a newly reduced intent before it can replay.
  if ((reduced || duration === 0 || focused) && settled !== intent) setSettled(intent);
  useLayoutEffect(() => {
    if (!blocked || !root.current) return;
    for (const item of root.current.children) {
      if (item instanceof HTMLElement) item.style.setProperty('transform', 'none');
    }
  }, [blocked, items]);
  // Options/interaction changes request a fresh measurement to settle the current
  // projection. Only the consumer key permits movement after an interruption.
  const dependency = useMemo(
    () => ({ reflowKey, duration, blocked }),
    [reflowKey, duration, blocked],
  );
  const transformTemplate = useCallback(
    (_values: unknown, generated: string) => (blocked ? 'none' : generated),
    [blocked],
  );

  if (!Number.isFinite(duration) || duration < 0) {
    throw new RangeError('LayoutReflow requires a finite duration >= 0 ms.');
  }
  const ids = new Set<string>();
  for (const item of items) {
    if (typeof item.id !== 'string' || !item.id.trim() || ids.has(item.id)) {
      throw new TypeError('LayoutReflow requires nonempty, unique item ids.');
    }
    ids.add(item.id);
  }
  return (
    <ul
      {...native}
      ref={root}
      onFocusCapture={(event) => {
        setFocused(true);
        settle();
        onFocusCapture?.(event);
      }}
      onBlurCapture={(event) => {
        if (
          !(event.relatedTarget instanceof Node) ||
          !event.currentTarget.contains(event.relatedTarget)
        )
          setFocused(false);
        onBlurCapture?.(event);
      }}
      onPointerDownCapture={(event) => {
        settle();
        onPointerDownCapture?.(event);
      }}
      onKeyDownCapture={(event) => {
        settle();
        onKeyDownCapture?.(event);
      }}
    >
      {items.map((item) =>
        !enableMotion ? (
          <li key={item.id} data-layout-id={item.id} style={{ transform: 'none' }}>
            {item.content}
          </li>
        ) : (
          <motion.li
            key={item.id}
            data-layout-id={item.id}
            initial={false}
            layout={supported ? 'position' : false}
            layoutDependency={dependency}
            style={{ transform: blocked ? 'none' : undefined }}
            transformTemplate={transformTemplate}
            transition={{ layout: { duration: blocked ? 0 : duration / 1000, ease: 'easeOut' } }}
          >
            {item.content}
          </motion.li>
        ),
      )}
    </ul>
  );
}
