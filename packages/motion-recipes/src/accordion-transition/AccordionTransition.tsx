import { useId, useLayoutEffect, useRef, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { useSystemReducedMotion } from './useSystemReducedMotion.js';
import { motionTokens } from '@motion-skills-lab/motion-tokens';

export type AccordionTransitionProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: ReactNode;
  children: ReactNode;
  /** Duration in milliseconds. Finite, non-negative values only. */
  duration?: number;
  reduceMotion?: boolean;
  id?: string;
  className?: string;
};

/** A controlled disclosure; the consumer owns state and content. */
export function AccordionTransition({
  open,
  onOpenChange,
  trigger,
  children,
  duration = motionTokens.duration.accordionTransition,
  reduceMotion = false,
  id,
  className,
}: AccordionTransitionProps) {
  const generatedId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const systemReduction = useSystemReducedMotion();
  const reduced = reduceMotion || Boolean(systemReduction);
  const baseId = id ?? `msl-accordion-${generatedId}`;
  const triggerId = `${baseId}-trigger`;
  const panelId = `${baseId}-panel`;

  useLayoutEffect(() => {
    if (!open && panelRef.current?.contains(document.activeElement)) triggerRef.current?.focus();
  }, [open]);

  if (!Number.isFinite(duration) || duration < 0) {
    throw new RangeError(
      'AccordionTransition duration must be a finite, non-negative number in milliseconds.',
    );
  }

  return (
    <div className={['msl-accordion-transition', className].filter(Boolean).join(' ')}>
      <button
        ref={triggerRef}
        className="msl-accordion-transition__trigger"
        type="button"
        id={triggerId}
        aria-controls={panelId}
        aria-expanded={open}
        onClick={() => onOpenChange(!open)}
      >
        <span>{trigger}</span>
        <span aria-hidden="true" className="msl-accordion-transition__indicator">
          {open ? '−' : '+'}
        </span>
      </button>
      <motion.div
        ref={panelRef}
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        aria-hidden={!open}
        inert={!open}
        data-reduce-motion={reduced ? 'true' : 'false'}
        className="msl-accordion-transition__panel"
        initial={false}
        animate={{ height: open ? 'auto' : 0 }}
        transition={{
          duration: reduced ? 0 : duration / 1000,
          ease: [...motionTokens.easing.standard],
        }}
      >
        <div className="msl-accordion-transition__content">{children}</div>
      </motion.div>
    </div>
  );
}
