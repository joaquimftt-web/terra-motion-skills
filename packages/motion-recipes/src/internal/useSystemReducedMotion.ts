import { useSyncExternalStore } from 'react';

const query = '(prefers-reduced-motion: reduce)';
function snapshot() {
  return typeof window === 'undefined' || !window.matchMedia
    ? true
    : window.matchMedia(query).matches;
}
function subscribe(notify: () => void) {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {};
  const media = window.matchMedia(query);
  media.addEventListener('change', notify);
  return () => media.removeEventListener('change', notify);
}

/** Private to the new recipes; the existing Accordion contract is unchanged. */
export function useSystemReducedMotion() {
  return useSyncExternalStore(subscribe, snapshot, () => true);
}
