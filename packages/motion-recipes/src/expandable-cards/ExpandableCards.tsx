import {
  useCallback,
  useEffect,
  useId,
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
import { LayoutGroup, MotionConfig, motion } from 'motion/react';
export type ExpandableCardItem = {
  id: string;
  title: string;
  media?: ReactNode;
  preview: ReactNode;
  details: ReactNode;
};
export type ExpandableCardsProps = Omit<
  HTMLAttributes<HTMLUListElement>,
  'children' | 'dangerouslySetInnerHTML'
> & {
  items: readonly ExpandableCardItem[];
  selectedId: string | null;
  onSelectedIdChange: (id: string | null) => void;
  duration?: number;
  reduceMotion?: boolean;
  ref?: Ref<HTMLUListElement>;
};
const subscribeSupport = () => () => {};
function supportSnapshot() {
  try {
    if (
      typeof window === 'undefined' ||
      typeof window.requestAnimationFrame !== 'function' ||
      typeof Element === 'undefined' ||
      typeof Element.prototype.getBoundingClientRect !== 'function'
    )
      return false;
    for (const query of ['(prefers-reduced-motion: reduce)', '(prefers-reduced-motion)']) {
      const media = window.matchMedia(query);
      if (
        typeof media.matches !== 'boolean' ||
        typeof media.addEventListener !== 'function' ||
        typeof media.removeEventListener !== 'function'
      )
        return false;
      const probe = () => {};
      media.addEventListener('change', probe);
      media.removeEventListener('change', probe);
    }
    return true;
  } catch {
    return false;
  }
}
const serverSupport = () => false;
function preference() {
  try {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    return typeof media.matches === 'boolean' &&
      typeof media.addEventListener === 'function' &&
      typeof media.removeEventListener === 'function'
      ? media
      : null;
  } catch {
    return null;
  }
}
function subscribeReduction(notify: () => void) {
  const media = preference();
  if (!media) return () => {};
  try {
    media.addEventListener('change', notify);
    return () => {
      try {
        media.removeEventListener('change', notify);
      } catch {
        /* Keep fallback content accessible. */
      }
    };
  } catch {
    return () => {};
  }
}
const reductionSnapshot = () => preference()?.matches ?? true;
const serverReduction = () => true;

/** Controlled, in-flow expansion. The consumer owns geometry and presentation. */
export function ExpandableCards({
  items,
  selectedId,
  onSelectedIdChange,
  duration = 280,
  reduceMotion = false,
  ref,
  onKeyDown,
  onFocusCapture,
  onPointerDownCapture,
  ...native
}: ExpandableCardsProps) {
  const scope = useId();
  const root = useRef<HTMLUListElement>(null);
  useImperativeHandle(ref, () => root.current!, []);
  const systemReduced = useSyncExternalStore(
    subscribeReduction,
    reductionSnapshot,
    serverReduction,
  );
  const supported = useSyncExternalStore(subscribeSupport, supportSnapshot, serverSupport);
  // Static mode is fixed per client instance; the React wrapper tree stays
  // identical in SSR, hydration and unsupported browsers, including slot useId.
  const [motionEnabled] = useState(supportSnapshot);
  const [view, setView] = useState({ items, selectedId, revision: 0 });
  const [focusBlocked, setFocusBlocked] = useState(false);
  const [settled, setSettled] = useState(-1);
  const [timing, setTiming] = useState({ duration, revision: view.revision });
  const reduced = reduceMotion || systemReduced;
  if (timing.duration !== duration || timing.revision !== view.revision) {
    setTiming({ duration, revision: view.revision });
    if (timing.revision === view.revision) setSettled(view.revision);
  }
  if ((reduced || duration === 0) && settled !== view.revision) setSettled(view.revision);
  const blocked =
    !motionEnabled || !supported || reduced || duration === 0 || settled === view.revision;
  const transform = useCallback(
    (_: unknown, generated: string) => (blocked ? 'none' : generated),
    [blocked],
  );
  const dependency = useMemo(
    () => ({ revision: view.revision, duration, blocked }),
    [view.revision, duration, blocked],
  );

  useLayoutEffect(() => {
    if (view.items === items && view.selectedId === selectedId) return;
    const host = root.current;
    if (!host) return;
    const doc = host.ownerDocument;
    const active = doc.activeElement;
    const cards = Array.from(host.children).filter(
      (n): n is HTMLElement => n instanceof HTMLElement,
    );
    const activeCard = cards.find((n) => n.contains(active));
    const oldItem = view.items.find((item) => item.id === activeCard?.dataset.cardId);
    const removed = oldItem && !items.some((item) => item.id === oldItem.id);
    const hides =
      oldItem &&
      view.selectedId === oldItem.id &&
      selectedId !== oldItem.id &&
      activeCard?.querySelector('[data-card-details]')?.contains(active);
    if (removed || hides) {
      let target: HTMLElement | null;
      if (removed) {
        const index = view.items.indexOf(oldItem);
        // Prefer surviving successors in old DOM order, then predecessors.
        const candidates = [
          ...view.items.slice(index + 1),
          ...view.items.slice(0, index).reverse(),
        ];
        const next = candidates.find((item) => items.some((candidate) => candidate.id === item.id));
        target = next
          ? (cards
              .find((n) => n.dataset.cardId === next.id)
              ?.querySelector<HTMLElement>('[data-card-trigger]') ?? null)
          : host;
      } else target = activeCard?.querySelector<HTMLElement>('[data-card-trigger]') ?? null;
      try {
        if (target?.isConnected) target.focus({ preventScroll: true });
      } catch {
        /* Verify below; never hide the focused subtree on failure. */
      }
      if (!target?.isConnected || doc.activeElement !== target) {
        setFocusBlocked(true);
        return;
      }
    }
    setFocusBlocked(false);
    setView((previous) => ({
      items,
      selectedId,
      revision:
        previous.revision +
        (previous.selectedId !== selectedId ||
        previous.items.length !== items.length ||
        previous.items.some((item, index) => item.id !== items[index]?.id)
          ? 1
          : 0),
    }));
  }, [items, selectedId, view]);

  useEffect(() => {
    if (!motionEnabled) return;
    const settle = () => setSettled(view.revision);
    window.addEventListener('resize', settle);
    return () => window.removeEventListener('resize', settle);
  }, [motionEnabled, view.revision]);

  useLayoutEffect(() => {
    if (blocked && root.current)
      for (const card of root.current.querySelectorAll<HTMLElement>(
        '[data-card-id], [data-card-media], [data-card-content]',
      ))
        card.style.transform = 'none';
  }, [blocked, view]);

  if (!Array.isArray(items)) throw new TypeError('ExpandableCards items must be an array.');
  if (!Number.isFinite(duration) || duration < 0)
    throw new RangeError('ExpandableCards requires a finite duration >= 0 ms.');
  const ids = new Set<string>();
  for (const item of items) {
    if (
      !item ||
      typeof item.id !== 'string' ||
      !item.id.trim() ||
      ids.has(item.id) ||
      typeof item.title !== 'string' ||
      !item.title.trim()
    )
      throw new TypeError('ExpandableCards requires unique nonempty string ids and titles.');
    ids.add(item.id);
  }
  if (selectedId !== null && !ids.has(selectedId))
    throw new RangeError('ExpandableCards selectedId must identify an item or be null.');
  if (typeof onSelectedIdChange !== 'function')
    throw new TypeError('ExpandableCards requires onSelectedIdChange.');
  const transition = {
    layout: {
      duration: blocked ? 0 : duration / 1000,
      ease: [0.2, 0, 0, 1] as [number, number, number, number],
    },
  };
  const movement = {
    style: { transform: blocked ? 'none' : undefined },
    initial: false as const,
    layoutDependency: dependency,
    transformTemplate: transform,
    transition,
  };
  const selectedIndex = view.items.findIndex((item) => item.id === view.selectedId);
  return (
    <MotionConfig isStatic={!motionEnabled}>
      <LayoutGroup id={scope} inherit={false}>
        <ul
          {...native}
          ref={root}
          aria-label={
            native['aria-label'] ?? (native['aria-labelledby'] ? undefined : 'Expandable cards')
          }
          tabIndex={native.tabIndex ?? -1}
          data-update-blocked={focusBlocked}
          data-selected-id={view.selectedId ?? ''}
          onFocusCapture={(event) => {
            setSettled(view.revision);
            onFocusCapture?.(event);
          }}
          onPointerDownCapture={(event) => {
            setSettled(view.revision);
            onPointerDownCapture?.(event);
          }}
          onKeyDown={(event) => {
            onKeyDown?.(event);
            if (event.defaultPrevented || event.key !== 'Escape' || view.selectedId === null)
              return;
            const card = Array.from(event.currentTarget.children).find(
              (n) => n instanceof HTMLElement && n.dataset.cardId === view.selectedId,
            );
            if (card?.contains(event.target as Node)) {
              event.preventDefault();
              const trigger = card.querySelector<HTMLButtonElement>('[data-card-trigger]');
              try {
                if (trigger?.isConnected) trigger.focus({ preventScroll: true });
              } catch {
                return;
              }
              if (
                trigger?.isConnected &&
                event.currentTarget.ownerDocument.activeElement === trigger
              )
                onSelectedIdChange(null);
            }
          }}
        >
          {view.items.map((item, index) => {
            const open = item.id === view.selectedId;
            const peer =
              Math.floor(index / 2) === Math.floor(selectedIndex / 2) &&
              !open &&
              selectedIndex >= 0;
            const lone = open && index % 2 === 0 && index === view.items.length - 1;
            const detailsId = `${scope}-${index}-details`;
            return (
              <motion.li
                key={item.id}
                {...movement}
                layout={supported}
                layoutCrossfade={false}
                data-card-id={item.id}
                data-expanded={open}
                data-peer={peer}
                data-lone={lone}
              >
                <article>
                  {item.media != null && (
                    <motion.div
                      {...movement}
                      layout={supported ? 'position' : false}
                      data-card-media=""
                    >
                      {item.media}
                    </motion.div>
                  )}
                  <motion.div
                    {...movement}
                    layout={supported ? 'position' : false}
                    data-card-content=""
                  >
                    <h3>
                      <button
                        type="button"
                        data-card-trigger=""
                        aria-expanded={open}
                        aria-controls={detailsId}
                        onClick={() => onSelectedIdChange(open ? null : item.id)}
                      >
                        {item.title}
                      </button>
                    </h3>
                    <div data-card-preview="">{item.preview}</div>
                    <div id={detailsId} data-card-details="" hidden={!open}>
                      {item.details}
                    </div>
                  </motion.div>
                </article>
              </motion.li>
            );
          })}
        </ul>
      </LayoutGroup>
    </MotionConfig>
  );
}
