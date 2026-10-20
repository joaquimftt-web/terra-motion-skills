import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import '@motion-skills-lab/motion-tokens/motion-tokens.css';
import '@motion-skills-lab/motion-recipes/button-feedback.css';
import '@motion-skills-lab/motion-recipes/accordion-transition.css';
import './app/app.css';

const root = document.getElementById('root');
if (!root) throw new Error('Missing application root');
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
