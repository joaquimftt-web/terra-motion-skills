import { hydrateRoot } from 'react-dom/client';
import { ScrollReveal } from '@motion-skills-lab/motion-recipes/scroll-reveal';
hydrateRoot(
  document.getElementById('ssr-root')!,
  <div>
    <ScrollReveal id="ssr-content">
      <h1>SSR legível</h1>
      <p>HTML real antes da hidratação.</p>
    </ScrollReveal>
  </div>,
);
