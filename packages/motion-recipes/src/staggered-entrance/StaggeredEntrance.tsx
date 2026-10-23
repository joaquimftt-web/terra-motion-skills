import {
  useEffect,
  useImperativeHandle,
  useRef,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react';
import {
  createEntranceLifecycle,
  type EntranceOptions,
} from '../internal/createEntranceLifecycle.js';

export type StaggeredEntranceProps<T> = Omit<
  HTMLAttributes<HTMLUListElement>,
  'children' | 'dangerouslySetInnerHTML'
> & {
  items: readonly T[];
  getKey: (item: T) => string;
  renderItem: (item: T, index: number) => ReactNode;
  ref?: Ref<HTMLUListElement>;
  duration?: number;
  offset?: number;
  stagger?: number;
  once?: boolean;
  replayKey?: string | number;
  reduceMotion?: boolean;
};

export function StaggeredEntrance<T>({
  items,
  getKey,
  renderItem,
  ref,
  duration = 260,
  offset = 8,
  stagger = 50,
  once = true,
  replayKey,
  reduceMotion = false,
  onFocusCapture,
  onPointerDownCapture,
  ...native
}: StaggeredEntranceProps<T>): ReactElement {
  const root = useRef<HTMLUListElement>(null);
  const controller = useRef<ReturnType<typeof createEntranceLifecycle> | null>(null);
  const previous = useRef<{ signature: string; options: EntranceOptions } | null>(null);
  const keys = items.map(getKey);
  const signature = JSON.stringify(keys);
  useImperativeHandle(ref, () => root.current!, []);
  useEffect(() => {
    const options = { duration, offset, stagger, once, replayKey, reduceMotion };
    const changedKeys = previous.current !== null && previous.current.signature !== signature;
    if (!controller.current || changedKeys) {
      const activePointers = controller.current?.activePointers() ?? [];
      controller.current?.dispose();
      const initial = changedKeys
        ? { ...options, reduceMotion: true, replayKey: previous.current?.options.replayKey }
        : options;
      controller.current = createEntranceLifecycle(
        root.current!,
        Array.from(root.current!.children) as HTMLLIElement[],
        initial,
      );
      for (const pointer of activePointers) controller.current.pointerDown(pointer);
      if (changedKeys) controller.current.update(options);
    } else controller.current.update(options);
    previous.current = { signature, options };
  });
  useEffect(
    () => () => {
      controller.current?.dispose();
      controller.current = null;
    },
    [],
  );
  if (
    !Number.isFinite(duration) ||
    duration < 0 ||
    !Number.isFinite(offset) ||
    offset < 0 ||
    offset > 24 ||
    !Number.isFinite(stagger) ||
    stagger < 0 ||
    stagger > 200 ||
    (typeof replayKey === 'number' && !Number.isFinite(replayKey))
  )
    throw new RangeError(
      'StaggeredEntrance requires finite duration >=0ms, offset0–24px, stagger0–200ms and finite numeric replayKey.',
    );
  if (
    keys.some((key) => typeof key !== 'string' || key.trim().length === 0) ||
    new Set(keys).size !== keys.length
  )
    throw new Error('StaggeredEntrance requires unique, non-empty, stable string keys.');
  return (
    <ul
      {...native}
      ref={root}
      onFocusCapture={(event) => {
        controller.current?.finish();
        onFocusCapture?.(event);
      }}
      onPointerDownCapture={(event) => {
        controller.current?.pointerDown(event.pointerId);
        onPointerDownCapture?.(event);
      }}
    >
      {items.map((item, index) => (
        <li key={keys[index]}>{renderItem(item, index)}</li>
      ))}
    </ul>
  );
}
