import { useLayoutEffect, useRef } from 'react';
import { createMineralFold } from './mineralFold';

/** Local proof only; accessibility changes never rearm a consumed passage. */
export function useMineralFold(reduced: boolean, materialUrl: string) {
  const plane = useRef<HTMLDivElement>(null);
  const region = useRef<HTMLElement>(null);
  const session = useRef({ consumed: false });
  useLayoutEffect(() => {
    if (!plane.current || !region.current) return;
    const fold = createMineralFold(
      plane.current,
      region.current,
      reduced,
      session.current,
      materialUrl,
    );
    return () => fold.dispose();
  }, [reduced, materialUrl]);
  return { plane, region };
}
