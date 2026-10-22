import {
  useEffect,
  useImperativeHandle,
  useRef,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from 'react';
import {
  createScrollRevealLifecycle,
  type ScrollRevealOptions,
} from './useScrollRevealLifecycle.js';

export type ScrollRevealProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'dangerouslySetInnerHTML'
> & {
  children: ReactNode;
  ref?: Ref<HTMLDivElement>;
  duration?: number;
  offset?: number;
  once?: boolean;
  replayKey?: string | number;
  reduceMotion?: boolean;
};

export function ScrollReveal({
  children,
  ref,
  duration = 260,
  offset = 8,
  once = true,
  replayKey,
  reduceMotion = false,
  onFocusCapture,
  onPointerDownCapture,
  ...native
}: ScrollRevealProps) {
  const root = useRef<HTMLDivElement>(null);
  const target = useRef<HTMLDivElement>(null);
  const controller = useRef<ReturnType<typeof createScrollRevealLifecycle> | null>(null);
  const initial = useRef<ScrollRevealOptions>({ duration, offset, once, replayKey, reduceMotion });
  useImperativeHandle(ref, () => root.current!, []);
  useEffect(() => {
    const lifecycle = createScrollRevealLifecycle(root.current!, target.current!, initial.current);
    controller.current = lifecycle;
    return () => {
      lifecycle.dispose();
      controller.current = null;
    };
  }, []);
  useEffect(() => {
    controller.current?.update({ duration, offset, once, replayKey, reduceMotion });
  }, [duration, offset, once, replayKey, reduceMotion]);

  if (
    !Number.isFinite(duration) ||
    duration < 0 ||
    !Number.isFinite(offset) ||
    offset < 0 ||
    offset > 24 ||
    (typeof replayKey === 'number' && !Number.isFinite(replayKey))
  ) {
    throw new RangeError(
      'ScrollReveal requires finite duration >= 0 ms, offset between 0 and 24 px, and a finite numeric replayKey.',
    );
  }
  return (
    <div
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
      <div ref={target}>{children}</div>
    </div>
  );
}
