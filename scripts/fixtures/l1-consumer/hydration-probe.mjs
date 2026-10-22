import React, { Suspense, useEffect } from 'react';
import { App } from './app.mjs';

// Test-only selective hydration: keep a real SSR boundary pending while App is
// already committed and interactive. Releasing it proves late mismatch detection.
const client = typeof window !== 'undefined';
let released = !client;
let release;
const pending = client
  ? new Promise((resolve) => {
      release = () => {
        released = true;
        resolve();
      };
    })
  : null;
if (client) window.releaseHydrationProbe = release;
function DeferredSentinel() {
  useEffect(() => {
    window.hydrationBoundaryCommitted = true;
  }, []);
  if (!released) throw pending;
  const mismatch =
    client && new URLSearchParams(window.location.search).get('probe') === 'late-mismatch';
  return React.createElement(
    'p',
    { id: 'hydration-sentinel' },
    mismatch ? 'Deliberate late client mismatch' : 'Stable SSR hydration sentinel',
  );
}
export function ConsumerRoot() {
  useEffect(() => {
    window.hydrationCommitted = true;
  }, []);
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(App),
    React.createElement(
      'aside',
      { 'aria-label': 'Hydration validation' },
      React.createElement(
        Suspense,
        { fallback: React.createElement('p', null, 'Hydration probe pending') },
        React.createElement(DeferredSentinel),
      ),
    ),
  );
}
