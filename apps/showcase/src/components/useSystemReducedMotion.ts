import { useSyncExternalStore } from 'react';

const query = '(prefers-reduced-motion: reduce)';
function getSnapshot() {
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

// App-owned status/replay policy: never import the recipe's private implementation.
export function useSystemReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, () => true);
}
