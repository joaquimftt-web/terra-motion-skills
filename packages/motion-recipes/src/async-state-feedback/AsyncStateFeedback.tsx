import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react';
import { motionTokens } from '@motion-skills-lab/motion-tokens';

export type AsyncFeedbackState = 'idle' | 'pending' | 'success' | 'error' | 'cancelled';
export type AsyncFeedbackMessages = Readonly<Record<AsyncFeedbackState, string>>;
export type AsyncStateFeedbackProps = Omit<
  HTMLAttributes<HTMLSpanElement>,
  'children' | 'role' | 'aria-live' | 'aria-atomic' | 'aria-busy' | 'hidden' | 'inert'
> & {
  state: AsyncFeedbackState;
  messages: AsyncFeedbackMessages;
  announcement?: 'polite' | 'off';
  duration?: number;
  reduceMotion?: boolean;
};

const states: readonly AsyncFeedbackState[] = ['idle', 'pending', 'success', 'error', 'cancelled'];

/** Presentation only: operations, cancellation and response ordering belong to the consumer. */
export const AsyncStateFeedback = forwardRef<HTMLSpanElement, AsyncStateFeedbackProps>(
  function AsyncStateFeedback(
    {
      state,
      messages,
      announcement = 'polite',
      duration = motionTokens.duration.asyncStateFeedback,
      reduceMotion = false,
      className,
      style,
      ...nativeProps
    },
    ref,
  ) {
    if (!states.includes(state)) throw new RangeError('Unknown AsyncStateFeedback state.');
    if (!Number.isFinite(duration) || duration < 0)
      throw new RangeError(
        'AsyncStateFeedback duration must be finite and non-negative milliseconds.',
      );
    if (
      !messages ||
      states.some((key) => typeof messages[key] !== 'string' || !messages[key].trim())
    )
      throw new TypeError('All five feedback messages must be non-empty strings.');
    if (announcement !== 'polite' && announcement !== 'off')
      throw new RangeError('Unknown feedback announcement policy.');
    return (
      <span
        {...nativeProps}
        ref={ref}
        className={['msl-async-state-feedback', className].filter(Boolean).join(' ')}
        style={{ ...style, '--msl-async-feedback-duration': `${duration}ms` } as CSSProperties}
        role={announcement === 'polite' ? 'status' : undefined}
        aria-live={announcement === 'polite' ? 'polite' : undefined}
        aria-atomic={announcement === 'polite' ? true : undefined}
        aria-busy={undefined}
        hidden={undefined}
        inert={undefined}
        data-state={state}
        data-reduce-motion={reduceMotion ? 'true' : undefined}
      >
        <span className="msl-async-state-feedback__marker" aria-hidden="true" />
        <span className="msl-async-state-feedback__message">{messages[state]}</span>
        {states.map((key) => (
          <span
            key={key}
            className="msl-async-state-feedback__measure"
            aria-hidden="true"
            data-feedback-label={messages[key]}
          />
        ))}
      </span>
    );
  },
);
