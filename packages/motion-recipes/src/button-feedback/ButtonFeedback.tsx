import { forwardRef, type ButtonHTMLAttributes } from 'react';

export type ButtonFeedbackProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Request additional motion reduction. The operating-system preference is always respected. */
  reduceMotion?: boolean;
};

/** A semantic button with short, color-only interaction feedback. */
export const ButtonFeedback = forwardRef<HTMLButtonElement, ButtonFeedbackProps>(
  function ButtonFeedback({ className, reduceMotion = false, ...buttonProps }, ref) {
    const classes = ['msl-button-feedback', className].filter(Boolean).join(' ');

    return (
      <button
        {...buttonProps}
        ref={ref}
        className={classes}
        data-reduce-motion={reduceMotion ? 'true' : undefined}
      />
    );
  },
);

ButtonFeedback.displayName = 'ButtonFeedback';
