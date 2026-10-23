import type { ReactNode } from 'react';
export function Fixture({ header, target }: { header: ReactNode; target: ReactNode }) {
  return (
    <main>
      {header}
      <div className="spacer" aria-hidden="true" />
      {target}
      <section className="tail" id="end">
        <h2>Continuação</h2>
        <p>O conteúdo nunca depende da animação para estar disponível.</p>
      </section>
    </main>
  );
}
