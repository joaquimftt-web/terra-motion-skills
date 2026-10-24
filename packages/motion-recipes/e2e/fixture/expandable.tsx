import { StrictMode, createElement as h } from 'react';
import { createRoot, hydrateRoot, type Root } from 'react-dom/client';
import { ExpandableFixture } from './expandable-shared.mjs';
const state = { errors: [] as string[], roots: [] as Root[] };
const hosts = Array.from(document.querySelectorAll<HTMLElement>('[id^="expandable-root"]'));
function mount() {
  state.roots = hosts.map((host, index) => {
    const prefix = 'm13-' + index + '-';
    const child = h(
      StrictMode,
      null,
      h(ExpandableFixture),
      ...(host.dataset.twins ? [h(ExpandableFixture)] : []),
    );
    if (host.hasChildNodes()) {
      if (new URLSearchParams(location.search).has('mismatch'))
        host.querySelector('h1')!.textContent = 'Real mismatch';
      return hydrateRoot(host, child, {
        identifierPrefix: prefix,
        onRecoverableError: (error) => state.errors.push(String(error)),
      });
    }
    const root = createRoot(host, { identifierPrefix: prefix });
    root.render(child);
    return root;
  });
}
mount();
Object.assign(window, {
  __m13: state,
  __m13unmount: () => state.roots.forEach((root) => root.unmount()),
  __m13mount: mount,
});
