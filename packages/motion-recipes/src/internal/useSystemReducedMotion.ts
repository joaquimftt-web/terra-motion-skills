import { useSyncExternalStore } from 'react';

const query = '(prefers-reduced-motion: reduce)';
function mediaQuery() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return null;
  try {
    const media = window.matchMedia(query);
    return typeof media.addEventListener === 'function' &&
      typeof media.removeEventListener === 'function'
      ? media
      : null;
  } catch {
    return null;
  }
}
function snapshot() {
  return mediaQuery()?.matches ?? true;
}
function subscribe(notify: () => void) {
  const media = mediaQuery();
  if (!media) return () => {};
  media.addEventListener('change', notify);
  return () => media.removeEventListener('change', notify);
}

/** Private to the new recipes; the existing Accordion contract is unchanged. */
export function useSystemReducedMotion() {
  return useSyncExternalStore(subscribe, snapshot, () => true);
}
