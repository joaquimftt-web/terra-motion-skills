import { useLayoutEffect, useRef } from 'react';
import { createSectionPresentation } from './sectionPresentation';
export function useLandingNarrative(reduced: boolean) {
  const root = useRef<HTMLElement>(null);
  const consumed = useRef(new Set<HTMLElement>());
  useLayoutEffect(() => {
    if (!root.current) return;
    const controller = createSectionPresentation(root.current, reduced, consumed.current);
    return () => controller.dispose();
  }, [reduced]);
  return root;
}
