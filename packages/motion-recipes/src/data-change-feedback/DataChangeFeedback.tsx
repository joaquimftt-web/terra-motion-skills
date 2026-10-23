import { useEffect, useRef, useState, type HTMLAttributes, type Ref } from 'react';
import { animate } from 'motion/mini';
import { useSystemReducedMotion } from '../internal/useSystemReducedMotion.js';

export type DataChangeFeedbackProps = Omit<
  HTMLAttributes<HTMLSpanElement>,
  'children' | 'dangerouslySetInnerHTML' | 'role' | 'aria-live'
> & {
  value: string | number;
  formatValue?: (value: string | number) => string;
  duration?: number;
  reduceMotion?: boolean;
  changeLabel?: string;
  announcement?: 'off' | 'polite';
  ref?: Ref<HTMLSpanElement>;
};

/** Immediate data presentation; only the empty, neutral marker is animated. */
export function DataChangeFeedback({
  value,
  formatValue,
  duration = 220,
  reduceMotion = false,
  changeLabel = 'Valor atualizado',
  announcement = 'off',
  ref,
  ...nativeProps
}: DataChangeFeedbackProps) {
  if (!Number.isFinite(duration) || duration < 0)
    throw new RangeError(
      'DataChangeFeedback duration must be finite and non-negative milliseconds.',
    );

  const formatted = formatValue ? formatValue(value) : String(value);
  const [observed, setObserved] = useState({ value, revision: 0 });
  // React discards this render and retries before committing. Formatter changes do
  // not participate, and an abandoned concurrent render cannot mutate a ref.
  if (!Object.is(observed.value, value)) setObserved({ value, revision: observed.revision + 1 });

  const systemReducedMotion = useSystemReducedMotion();
  const marker = useRef<HTMLSpanElement>(null);
  const committedRevision = useRef(0);

  useEffect(() => {
    const changed = committedRevision.current !== observed.revision;
    committedRevision.current = observed.revision;
    const target = marker.current;
    if (!changed || !target || reduceMotion || systemReducedMotion || duration === 0) return;

    let playback: ReturnType<typeof animate> | undefined;
    try {
      playback = animate(target, { opacity: [0.8, 0] }, { duration: duration / 1000 });
    } catch {
      // Animation support is optional; the value and label remain ordinary text.
      target.style.opacity = '0';
    }
    return () => {
      playback?.cancel();
      target.style.opacity = '0';
    };
  }, [observed.revision, duration, reduceMotion, systemReducedMotion]);

  return (
    <span
      {...nativeProps}
      ref={ref}
      role={undefined}
      aria-live={undefined}
      dangerouslySetInnerHTML={undefined}
    >
      <span
        aria-live={announcement === 'polite' ? 'polite' : undefined}
        aria-atomic={announcement === 'polite' ? true : undefined}
      >
        {formatted}
      </span>
      <span
        ref={marker}
        aria-hidden="true"
        style={{
          display: 'inline-block',
          inlineSize: '0.4em',
          blockSize: '0.4em',
          marginInlineStart: '0.3em',
          border: '1px solid currentColor',
          borderRadius: '50%',
          opacity: 0,
          pointerEvents: 'none',
        }}
      />
      {observed.revision > 0 && <span style={{ paddingInlineStart: '0.35em' }}>{changeLabel}</span>}
    </span>
  );
}
