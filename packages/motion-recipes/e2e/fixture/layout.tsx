import { StrictMode, createElement } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { LayoutFixture } from './layout-shared.mjs';

const root = document.getElementById('layout-root')!;
const state = { errors: [] as string[], hydrated: false };
Object.assign(window, { __l3: state });
if (root.hasChildNodes()) {
  if (new URLSearchParams(location.search).has('mismatch'))
    root.querySelector('h1')!.textContent = 'Mismatch injected';
  hydrateRoot(root, createElement(StrictMode, null, createElement(LayoutFixture)), {
    onRecoverableError: (error) => state.errors.push(String(error)),
  });
} else {
  createRoot(root).render(createElement(StrictMode, null, createElement(LayoutFixture)));
}
requestAnimationFrame(() => {
  state.hydrated = true;
});
