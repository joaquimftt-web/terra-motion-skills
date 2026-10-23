import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from 'react';
import { useSystemReducedMotion } from '../internal/useSystemReducedMotion.js';

export type SkeletonToContentProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'dangerouslySetInnerHTML' | 'aria-busy'
> & {
  loading: boolean;
  skeleton: ReactNode;
  children: ReactNode;
  duration?: number;
  reduceMotion?: boolean;
  minBlockSize?: number | string;
  announcement?: 'polite' | 'off';
  loadingLabel?: string;
  readyLabel?: string;
  ref?: Ref<HTMLDivElement>;
};

const statusStyle: CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clipPath: 'inset(50%)',
  whiteSpace: 'nowrap',
  border: 0,
};

/** Keep real content available from its first ready commit onward. */
export function SkeletonToContent({
  loading,
  skeleton,
  children,
  duration = 180,
  reduceMotion = false,
  minBlockSize,
  announcement = 'polite',
  loadingLabel = 'Carregando conteúdo.',
  readyLabel = 'Conteúdo disponível.',
  ref,
  style,
  ...nativeProps
}: SkeletonToContentProps) {
  const systemReduced = useSystemReducedMotion();
  const reduced = systemReduced || reduceMotion;
  const [hasBeenReady, setHasBeenReady] = useState(!loading);
  // A guarded render adjustment commits the first ready content without an effect gap.
  if (!loading && !hasBeenReady) setHasBeenReady(true);
  const showContent = hasBeenReady || !loading;
  const decoration = useRef<HTMLSpanElement>(null);
  const previousLoading = useRef(loading);

  useEffect(() => {
    const becameReady = previousLoading.current && !loading;
    previousLoading.current = loading;
    const node = decoration.current;
    if (!becameReady || reduced || duration === 0 || !node?.animate) return;

    // No completion callback controls content or announcement. Cleanup owns the only resource.
    try {
      const animation = node.animate(
        [{ borderColor: 'rgba(128, 128, 128, 0.5)' }, { borderColor: 'transparent' }],
        { duration, easing: 'ease-out', fill: 'none' },
      );
      return () => animation.cancel();
    } catch {
      // Unsupported animation implementations leave the same readable static content.
      return;
    }
  }, [loading, reduced, duration]);

  if (!Number.isFinite(duration) || duration < 0)
    throw new RangeError(
      'SkeletonToContent duration must be finite and non-negative milliseconds.',
    );
  if (typeof minBlockSize === 'number' && (!Number.isFinite(minBlockSize) || minBlockSize < 0))
    throw new RangeError('SkeletonToContent minBlockSize must be finite and non-negative.');

  return (
    <>
      <div
        {...nativeProps}
        ref={ref}
        aria-busy={loading}
        style={{
          position: 'relative',
          ...style,
          ...(minBlockSize === undefined ? {} : { minBlockSize }),
        }}
      >
        <span
          ref={decoration}
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            border: '1px solid transparent',
            borderRadius: 'inherit',
            boxSizing: 'border-box',
            pointerEvents: 'none',
          }}
        />
        {showContent ? (
          children
        ) : (
          <div aria-hidden="true" inert>
            {skeleton}
          </div>
        )}
      </div>
      {announcement === 'polite' && (
        <span role="status" aria-live="polite" aria-atomic="true" style={statusStyle}>
          {loading ? loadingLabel : readyLabel}
        </span>
      )}
    </>
  );
}
