import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import { Prototype } from './prototype/Prototype';
import '@motion-skills-lab/motion-tokens/motion-tokens.css';
import '@motion-skills-lab/motion-recipes/button-feedback.css';
import '@motion-skills-lab/motion-recipes/accordion-transition.css';
import './app/app.css';

const root = document.getElementById('root');
if (!root) throw new Error('Missing application root');
const base = import.meta.env.BASE_URL;
const legacyAnchors = new Set([
  '#visao-geral',
  '#button-feedback',
  '#accordion-transition',
  '#fundamentos',
  '#conteudo',
]);
function redirectLegacyAnchor() {
  if (window.location.pathname === base && legacyAnchors.has(window.location.hash)) {
    window.location.replace(`${base}lab/${window.location.hash}`);
    return true;
  }
  return false;
}
window.addEventListener('hashchange', redirectLegacyAnchor);
if (import.meta.hot)
  import.meta.hot.dispose(() => window.removeEventListener('hashchange', redirectLegacyAnchor));
// Preview-only: mount before module evaluation completes, so the intro is prepared
// before first React paint. A genuinely late load still keeps the static fallback.
if (!redirectLegacyAnchor())
  flushSync(() => {
    createRoot(root).render(
      <StrictMode>
        <Prototype />
      </StrictMode>,
    );
  });

import './styles/terra-theme.css';
