import {
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  type AnchorHTMLAttributes,
  type ComponentPropsWithoutRef,
} from 'react';
import { animate, useMotionValue } from 'motion/react';
import { motionTokens } from '@motion-skills-lab/motion-tokens';
import { useSystemReducedMotion } from '../internal/useSystemReducedMotion.js';

export type NavigationIndicatorItem = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  | 'id'
  | 'href'
  | 'children'
  | 'role'
  | 'aria-current'
  | 'aria-selected'
  | 'aria-controls'
  | 'tabIndex'
  | 'aria-disabled'
> & {
  id: string;
  href: string;
  label: string;
};
export type NavigationIndicatorProps = Omit<
  ComponentPropsWithoutRef<'nav'>,
  'children' | 'role' | 'aria-label'
> & {
  'aria-label': string;
  items: readonly NavigationIndicatorItem[];
  value: string | null;
  currentType?: 'page' | 'location';
  duration?: number;
  reduceMotion?: boolean;
};

const useClientLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/** Native navigation; the consumer, not focus/hover or the animation, owns selection. */
export const NavigationIndicator = forwardRef<HTMLElement, NavigationIndicatorProps>(
  function NavigationIndicator(
    {
      'aria-label': label,
      items,
      value,
      currentType = 'page',
      duration = motionTokens.duration.navigationIndicator,
      reduceMotion = false,
      className,
      ...nativeProps
    },
    forwardedRef,
  ) {
    const reduced = useSystemReducedMotion() || reduceMotion;
    const root = useRef<HTMLElement | null>(null);
    const viewport = useRef<HTMLDivElement | null>(null);
    const track = useRef<HTMLDivElement | null>(null);
    const line = useRef<HTMLSpanElement | null>(null);
    const links = useRef(new Map<string, HTMLAnchorElement>());
    const latest = useRef({ value, duration, reduced });
    const previous = useRef<{
      ready: boolean;
      value: string | null;
      x: number;
      y: number;
      width: number;
      duration: number;
      reduced: boolean;
    }>({ ready: false, value: null, x: 0, y: 0, width: 0, duration, reduced });
    const running = useRef<Array<{ stop: () => void }>>([]);
    const generation = useRef(0);
    const alive = useRef(false);
    const observerReady = useRef(false);
    const x = useMotionValue(0),
      y = useMotionValue(0),
      width = useMotionValue(0);
    const stop = useCallback(() => {
      generation.current += 1;
      running.current.forEach((control) => control.stop());
      running.current = [];
    }, []);
    const setRoot = useCallback(
      (node: HTMLElement | null) => {
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

    useClientLayoutEffect(() => {
      latest.current = { value, duration, reduced };
    });
    useClientLayoutEffect(() => {
      alive.current = true;
      const publish = () => {
        if (line.current)
          line.current.style.transform = `translate(${x.get()}px, ${y.get()}px) scaleX(${width.get()})`;
      };
      const off = [x.on('change', publish), y.on('change', publish), width.on('change', publish)];
      return () => {
        alive.current = false;
        stop();
        off.forEach((fn) => fn());
      };
    }, [x, y, width, stop]);

    const measure = useCallback(
      (cause: 'selection' | 'layout') => {
        const current = latest.current;
        const nav = root.current,
          rail = track.current,
          marker = line.current;
        if (!alive.current || !nav || !rail || !marker) return;
        const hide = () => {
          stop();
          marker.hidden = true;
          nav.removeAttribute('data-indicator-ready');
          previous.current = { ...previous.current, ready: false, value: current.value };
        };
        const link = current.value === null ? undefined : links.current.get(current.value);
        if (
          !observerReady.current ||
          !link?.isConnected ||
          getComputedStyle(nav).direction === 'rtl'
        ) {
          hide();
          return;
        }
        let target: { x: number; y: number; width: number };
        try {
          const anchor = link.getBoundingClientRect(),
            origin = rail.getBoundingClientRect();
          target = {
            x: anchor.left - origin.left,
            y: anchor.bottom - origin.top - 2,
            width: anchor.width,
          };
          if (
            anchor.width <= 0 ||
            anchor.height <= 0 ||
            origin.width <= 0 ||
            !Object.values(target).every(Number.isFinite)
          ) {
            hide();
            return;
          }
        } catch {
          hide();
          return;
        }
        const old = previous.current;
        const geometryChanged =
          Math.abs(old.x - target.x) > 0.1 ||
          Math.abs(old.y - target.y) > 0.1 ||
          Math.abs(old.width - target.width) > 0.1;
        const selected = old.value !== current.value;
        const timingChanged = old.duration !== current.duration || old.reduced !== current.reduced;
        if (old.ready && !geometryChanged && !selected && !timingChanged) return;
        const shouldAnimate =
          old.ready &&
          !current.reduced &&
          current.duration > 0 &&
          cause === 'selection' &&
          (selected || timingChanged);
        stop();
        marker.hidden = false;
        nav.setAttribute('data-indicator-ready', 'true');
        previous.current = {
          ...target,
          value: current.value,
          duration: current.duration,
          reduced: current.reduced,
          ready: true,
        };
        if (!shouldAnimate) {
          x.set(target.x);
          y.set(target.y);
          width.set(target.width);
          marker.style.transform = `translate(${target.x}px, ${target.y}px) scaleX(${target.width})`;
          return;
        }
        try {
          const options = {
            duration: current.duration / 1000,
            ease: [...motionTokens.easing.standard] as [number, number, number, number],
          };
          running.current = [
            animate(x, target.x, options),
            animate(y, target.y, options),
            animate(width, target.width, options),
          ];
        } catch {
          stop();
          x.set(target.x);
          y.set(target.y);
          width.set(target.width);
        }
      },
      [x, y, width, stop],
    );

    useClientLayoutEffect(() => {
      measure('selection');
    }, [value, items, duration, reduced, measure]);
    useClientLayoutEffect(() => {
      const nav = root.current,
        rail = track.current,
        scroller = viewport.current;
      observerReady.current = false;
      if (!nav || !rail || !scroller || typeof ResizeObserver === 'undefined') return;
      let active = true,
        frame: number | null = null;
      const schedule = () => {
        if (!active || frame !== null) return;
        frame = requestAnimationFrame(() => {
          frame = null;
          if (active) measure('layout');
        });
      };
      let observer: ResizeObserver | undefined;
      try {
        observer = new ResizeObserver(schedule);
        observer.observe(rail);
        observer.observe(scroller);
        links.current.forEach((link) => observer?.observe(link));
        observerReady.current = true;
        measure('layout');
      } catch {
        observer?.disconnect();
        stop();
        if (line.current) line.current.hidden = true;
        nav.removeAttribute('data-indicator-ready');
        previous.current.ready = false;
        return;
      }
      const fonts = nav.ownerDocument.fonts;
      fonts?.addEventListener?.('loadingdone', schedule);
      void fonts?.ready.then(() => {
        if (active) schedule();
      });
      return () => {
        observerReady.current = false;
        active = false;
        if (frame !== null) cancelAnimationFrame(frame);
        observer?.disconnect();
        fonts?.removeEventListener?.('loadingdone', schedule);
      };
    }, [items, measure, stop]);

    if (!Number.isFinite(duration) || duration < 0)
      throw new RangeError(
        'NavigationIndicator duration must be finite and non-negative milliseconds.',
      );
    if (typeof label !== 'string' || !label.trim() || !Array.isArray(items))
      throw new TypeError('NavigationIndicator requires a name and items.');
    const seen = new Set<string>();
    for (const item of items) {
      if (
        [item.id, item.href, item.label].some(
          (field) => typeof field !== 'string' || !field.trim(),
        ) ||
        seen.has(item.id)
      )
        throw new TypeError('Navigation links require unique non-empty IDs, hrefs and labels.');
      seen.add(item.id);
    }
    return (
      <nav
        {...nativeProps}
        ref={setRoot}
        aria-label={label}
        className={['msl-navigation-indicator', className].filter(Boolean).join(' ')}
      >
        <div ref={viewport} className="msl-navigation-indicator__viewport">
          <div ref={track} className="msl-navigation-indicator__track">
            <ul className="msl-navigation-indicator__list">
              {items.map(({ id, href, label: text, className: itemClass, ...linkProps }) => (
                <li key={id}>
                  <a
                    {...linkProps}
                    href={href}
                    ref={(node) => {
                      if (node) links.current.set(id, node);
                      else links.current.delete(id);
                    }}
                    className={['msl-navigation-indicator__link', itemClass]
                      .filter(Boolean)
                      .join(' ')}
                    aria-current={value === id ? currentType : undefined}
                  >
                    {text}
                  </a>
                </li>
              ))}
            </ul>
            <span ref={line} hidden aria-hidden="true" className="msl-navigation-indicator__line" />
          </div>
        </div>
      </nav>
    );
  },
);
