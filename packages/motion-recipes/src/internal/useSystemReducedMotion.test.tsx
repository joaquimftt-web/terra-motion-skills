import { act, renderHook } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { useSystemReducedMotion } from './useSystemReducedMotion.js';

afterEach(() => vi.unstubAllGlobals());

it('keeps content safe with an incomplete matchMedia implementation', () => {
  vi.stubGlobal('matchMedia', () => ({ matches: false }));
  const { result } = renderHook(() => useSystemReducedMotion());
  expect(result.current).toBe(true);
});

it('reduces conservatively when matchMedia is absent', () => {
  vi.stubGlobal('matchMedia', undefined);
  const { result } = renderHook(() => useSystemReducedMotion());
  expect(result.current).toBe(true);
});

it('reduces conservatively if querying the environment throws', () => {
  vi.stubGlobal('matchMedia', () => {
    throw new Error('Unsupported environment');
  });
  const { result } = renderHook(() => useSystemReducedMotion());
  expect(result.current).toBe(true);
});

it('tracks live modern media changes and removes the subscribed listener', () => {
  let reduced = false;
  const listeners = new Set<() => void>();
  vi.stubGlobal('matchMedia', () => ({
    get matches() {
      return reduced;
    },
    addEventListener: (_event: string, callback: () => void) => listeners.add(callback),
    removeEventListener: (_event: string, callback: () => void) => listeners.delete(callback),
  }));
  const { result, unmount } = renderHook(() => useSystemReducedMotion());
  expect(result.current).toBe(false);
  act(() => {
    reduced = true;
    listeners.forEach((callback) => callback());
  });
  expect(result.current).toBe(true);
  unmount();
  expect(listeners.size).toBe(0);
});
