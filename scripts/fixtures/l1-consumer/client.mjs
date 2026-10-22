import { createElement } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { ConsumerRoot } from './hydration-probe.mjs';
import '@motion-skills-lab/motion-recipes/presence-transition.css';
import '@motion-skills-lab/motion-recipes/async-state-feedback.css';
import '@motion-skills-lab/motion-recipes/navigation-indicator.css';
window.hydrationErrors = [];
hydrateRoot(document.getElementById('root'), createElement(ConsumerRoot), {
  onRecoverableError: (error) => window.hydrationErrors.push(String(error)),
});
window.hydrationStarted = true;
