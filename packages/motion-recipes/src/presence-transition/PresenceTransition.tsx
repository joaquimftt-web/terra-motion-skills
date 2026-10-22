import {
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
  type RefObject,
} from 'react';
import { animate, useMotionValue } from 'motion/react';
import { motionTokens } from '@motion-skills-lab/motion-tokens';
import { useSystemReducedMotion } from '../internal/useSystemReducedMotion.js';

export type PresenceTransitionProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'hidden' | 'inert' | 'aria-hidden'
> & {
  present: boolean;
  children: ReactNode;
  duration?: number;
  reduceMotion?: boolean;
  returnFocusRef?: RefObject<HTMLElement | null>;
  onExitComplete?: () => void;
};

const useClientLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

function validFocusTarget(
  target: HTMLElement | null | undefined,
  root: HTMLElement,
): target is HTMLElement {
  if (
    !target ||
    !target.isConnected ||
    target.ownerDocument !== root.ownerDocument ||
    root.contains(target)
  )
    return false;
  if (target.closest('[hidden], [inert]') || ('disabled' in target && target.disabled))
    return false;
  for (let item: HTMLElement | null = target; item; item = item.parentElement) {
    const css = getComputedStyle(item);
    if (
      css.display === 'none' ||
      css.visibility === 'hidden' ||
      css.visibility === 'collapse' ||
      css.opacity === '0'
    )
      return false;
  }
  return true;
}

/** One controlled block; retained exit DOM is never an interactive second state. */
export const PresenceTransition = forwardRef<HTMLDivElement, PresenceTransitionProps>(
  function PresenceTransition(
    {
      present,
      children,
      duration = motionTokens.duration.presenceTransition,
      reduceMotion = false,
      returnFocusRef,
      onExitComplete,
      className,
      style,
      onFocusCapture,
      onPointerDownCapture,
      onKeyDownCapture,
      ...nativeProps
    },
    forwardedRef,
  ) {
    const reduced = useSystemReducedMotion() || reduceMotion;
    const [retained, setRetained] = useState(present);
    const [snapshot, setSnapshot] = useState(() => children);
    // Guarded render adjustments retain the last present children, without a passive-effect gap.
    if (present && !retained) setRetained(true);
    if (present && snapshot !== children) setSnapshot(() => children);
    const root = useRef<HTMLDivElement | null>(null);
    const latest = useRef({ present, returnFocusRef, onExitComplete });
    const phase = useRef<'present' | 'entering' | 'exiting' | 'absent'>(
      present ? 'present' : 'absent',
    );
    const generation = useRef(0);
    const exitCycle = useRef(0);
    const pendingNotification = useRef<number | null>(null);
    const running = useRef<Array<{ stop: () => void }>>([]);
    const alive = useRef(false);
    const y = useMotionValue(0);
    const opacity = useMotionValue(1);

    const setRoot = useCallback(
      (node: HTMLDivElement | null) => {
        root.current = node;
        if (typeof forwardedRef === 'function') {
          // ForwardedRef's legacy void annotation omits React 19 callback cleanup.
          const cleanup: unknown = forwardedRef(node);
          return () => {
            root.current = null;
            if (typeof cleanup === 'function') cleanup();
            else forwardedRef(null);
          };
        }
        if (forwardedRef) forwardedRef.current = node;
        return () => {
          root.current = null;
          if (forwardedRef) forwardedRef.current = null;
        };
      },
      [forwardedRef],
    );

    const stop = useCallback(() => {
      generation.current += 1;
      running.current.forEach((control) => control.stop());
      running.current = [];
    }, []);

    useClientLayoutEffect(() => {
      latest.current = { present, returnFocusRef, onExitComplete };
    });
    useClientLayoutEffect(() => {
      alive.current = true;
      const offY = y.on('change', (value) => {
        if (root.current) root.current.style.transform = `translateY(${value}px)`;
      });
      const offOpacity = opacity.on('change', (value) => {
        if (root.current) root.current.style.opacity = String(value);
      });
      return () => {
        alive.current = false;
        stop();
        offY();
        offOpacity();
      };
    }, [y, opacity, stop]);

    useClientLayoutEffect(() => {
      stop();
      const epoch = generation.current;
      const node = root.current;
      if (!retained && !present) {
        phase.current = 'absent';
        const completed = pendingNotification.current;
        pendingNotification.current = null;
        if (
          completed !== null &&
          completed === exitCycle.current &&
          !latest.current.present &&
          alive.current
        ) {
          latest.current.onExitComplete?.();
        }
        return;
      }
      if (!node) return;
      const options = {
        duration: duration / 1000,
        ease: [...motionTokens.easing.standard] as [number, number, number, number],
      };
      const valid = () => alive.current && generation.current === epoch;
      if (present) {
        pendingNotification.current = null;
        if (phase.current === 'exiting') exitCycle.current += 1;
        const entering = phase.current === 'absent';
        opacity.set(1);
        node.style.opacity = '1';
        node.removeAttribute('aria-hidden');
        node.inert = false;
        if (entering && !reduced && duration > 0) y.set(6);
        if (reduced || duration === 0 || phase.current === 'present') {
          y.set(0);
          node.style.transform = 'translateY(0px)';
          phase.current = 'present';
        } else {
          phase.current = 'entering';
          try {
            const control = animate(y, 0, options);
            running.current = [control];
            void control.then(() => {
              if (valid() && latest.current.present) phase.current = 'present';
            });
          } catch {
            y.set(0);
            phase.current = 'present';
          }
        }
        return;
      }

      if (phase.current !== 'exiting') exitCycle.current += 1;
      const cycle = exitCycle.current;
      phase.current = 'exiting';
      const remove = () => {
        if (!valid() || latest.current.present || cycle !== exitCycle.current) return;
        pendingNotification.current = cycle;
        // The notification runs in the following commit, after the ref and DOM clear.
        setRetained(false);
      };
      const active = node.ownerDocument.activeElement;
      if (active instanceof HTMLElement && node.contains(active)) {
        const target = latest.current.returnFocusRef?.current;
        let transferred = false;
        if (validFocusTarget(target, node)) {
          try {
            target.focus({ preventScroll: true });
            transferred = node.ownerDocument.activeElement === target;
          } catch {
            /* safe removal below */
          }
        }
        if (!valid() || latest.current.present || !node.isConnected) return;
        if (!transferred) {
          active.blur();
          remove();
          return;
        }
      }
      if (!valid() || latest.current.present) return;
      node.inert = true;
      node.setAttribute('aria-hidden', 'true');
      if (reduced || duration === 0) {
        remove();
        return;
      }
      try {
        const move = animate(y, -4, options);
        const fade = animate(opacity, 0, options);
        running.current = [move, fade];
        void Promise.all([move, fade]).then(remove);
      } catch {
        remove();
      }
    }, [present, retained, duration, reduced, y, opacity, stop]);

    function settleInteraction() {
      if (!latest.current.present) return;
      stop();
      opacity.set(1);
      y.set(0);
      phase.current = 'present';
    }

    if (!Number.isFinite(duration) || duration < 0)
      throw new RangeError(
        'PresenceTransition duration must be finite and non-negative milliseconds.',
      );
    if (!retained) return null;
    return (
      <div
        {...nativeProps}
        ref={setRoot}
        className={['msl-presence-transition', className].filter(Boolean).join(' ')}
        style={{ ...style, opacity: 1, transform: 'translateY(0px)' }}
        onFocusCapture={(event) => {
          settleInteraction();
          onFocusCapture?.(event);
        }}
        onPointerDownCapture={(event) => {
          settleInteraction();
          onPointerDownCapture?.(event);
        }}
        onKeyDownCapture={(event) => {
          settleInteraction();
          onKeyDownCapture?.(event);
        }}
      >
        {present ? children : snapshot}
      </div>
    );
  },
);
