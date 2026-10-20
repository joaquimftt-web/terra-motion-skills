import { useState } from 'react';
import { useSystemReducedMotion } from '../components/useSystemReducedMotion';
import { RecipeCatalog } from '../features/catalog/RecipeCatalog';
import { ButtonFeedbackDemo } from '../features/demos/ButtonFeedbackDemo';
import { AccordionTransitionDemo } from '../features/demos/AccordionTransitionDemo';
import { ReducedMotionControl } from '../components/ReducedMotionControl';

export function App() {
  const [reduced, setReduced] = useState(false);
  const systemReduced = useSystemReducedMotion();
  const effectiveReduction = reduced || systemReduced;
  return (
    <div className="lab-shell">
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <aside className="sidebar">
        <a className="brand" href="#visao-geral" aria-label="Terra Motion Skills início">
          <span className="brand-symbol" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span>
            Terra
            <br />
            Motion Skills<span className="brand-dot">.</span>
          </span>
        </a>
        <p className="sidebar-intro">
          Um laboratório para
          <br />
          interfaces com intenção.
        </p>
        <RecipeCatalog />
        <div className="sidebar-bottom">
          <span className="version-badge">
            v0.1 <span>REVISÃO LOCAL</span>
          </span>
          <p>
            React · TypeScript · Motion
            <br />
            Projeto independente / v0.1 validada localmente
          </p>
        </div>
      </aside>
      <div className="main-column">
        <header className="topbar">
          <span>LABORATÓRIO DE INTERAÇÃO</span>
          <a href={`${import.meta.env.BASE_URL}reference/motion-contract.md`}>
            Contrato de motion <span aria-hidden="true">↗</span>
          </a>
        </header>
        <main id="conteudo">
          <section id="visao-geral" className="hero" aria-labelledby="hero-title">
            <div className="hero-copy">
              <p className="eyebrow">
                <span className="tiny-cross" aria-hidden="true">
                  +
                </span>{' '}
                MOTION COM PROPÓSITO
              </p>
              <h1 id="hero-title">
                Pequenos movimentos.
                <br />
                <span>Interfaces mais claras.</span>
              </h1>
              <p className="hero-description">
                Receitas reutilizáveis e skills para agentes de IA.
                <br className="desktop-break" /> Explore, ajuste e entenda o movimento em interfaces
                React.
              </p>
              <a className="hero-cta" href="#button-feedback">
                Experimentar receitas <span aria-hidden="true">↘</span>
              </a>
            </div>
            <div className="motion-figure" aria-hidden="true">
              <div className="figure-label">
                <span>INTENÇÃO → RESPOSTA</span>
                <span>01—02</span>
              </div>
              <svg viewBox="0 0 280 170">
                <defs>
                  <pattern id="dots" width="14" height="14" patternUnits="userSpaceOnUse">
                    <circle cx="1" cy="1" r="1" fill="#bbc8b9" />
                  </pattern>
                </defs>
                <rect width="280" height="170" fill="url(#dots)" />
                <path
                  d="M20 146 C84 146 57 25 190 25 L260 25"
                  fill="none"
                  stroke="#254b35"
                  strokeWidth="3"
                />
                <path d="M20 146 L260 25" fill="none" stroke="#9aab98" strokeDasharray="3 5" />
                <circle cx="20" cy="146" r="6" fill="#254b35" />
                <circle cx="260" cy="25" r="8" fill="#d7f26d" stroke="#254b35" strokeWidth="2" />
              </svg>
              <div className="figure-footer">
                <span>cubic-bezier</span>
                <strong>0.2, 0, 0, 1</strong>
              </div>
            </div>
          </section>
          <div className="lab-summary">
            <div>
              <strong>02</strong>
              <span>RECEITAS FUNCIONAIS</span>
            </div>
            <div>
              <strong>02</strong>
              <span>SKILLS OPERACIONAIS</span>
            </div>
            <div>
              <span className="summary-mark" aria-hidden="true">
                ◎
              </span>
              <span>ACESSIBILIDADE POR PRINCÍPIO</span>
            </div>
          </div>
          <div className="recipes-heading">
            <div>
              <p className="eyebrow">BIBLIOTECA / v0.1</p>
              <h2>Explore o comportamento.</h2>
            </div>
            <p>
              Exemplos vivos.
              <br />
              Parâmetros no seu controle.
            </p>
          </div>
          <ReducedMotionControl
            reduced={reduced}
            systemReduced={systemReduced}
            onChange={setReduced}
          />
          <ButtonFeedbackDemo reduceMotion={effectiveReduction} />
          <AccordionTransitionDemo reduceMotion={effectiveReduction} />
          <section id="fundamentos" className="foundations" aria-labelledby="foundations-title">
            <p className="eyebrow">O QUE GUIA O LAB</p>
            <h2 id="foundations-title">
              Menos movimento.
              <br />
              Mais significado.
            </h2>
            <div className="principles">
              <article>
                <span>01 / INTENÇÃO</span>
                <h3>Cada gesto tem um motivo.</h3>
                <p>
                  Feedback para confirmar. Transição para orientar. O movimento acompanha a tarefa.
                </p>
              </article>
              <article>
                <span>02 / CONTROLE</span>
                <h3>O estado vem primeiro.</h3>
                <p>
                  A ação funciona com teclado, toque e movimento reduzido. A animação pode ser
                  interrompida.
                </p>
              </article>
              <article>
                <span>03 / COMPOSIÇÃO</span>
                <h3>Pronto para outro contexto.</h3>
                <p>
                  Receitas sem dependência desta vitrine. Skills descrevem escolhas; pacotes
                  entregam comportamento.
                </p>
              </article>
            </div>
            <div className="foundation-links">
              <a href={`${import.meta.env.BASE_URL}reference/motion-foundations.md`}>
                Ler motion-foundations ↗
              </a>
              <a href={`${import.meta.env.BASE_URL}reference/microinteraction-design.md`}>
                Ler microinteraction-design ↗
              </a>
            </div>
          </section>
        </main>
        <footer>
          <span>
            Terra Motion Skills<span className="brand-dot">.</span>{' '}
            <span className="footer-version">v0.1</span>
          </span>
          <p>
            Projeto independente · Código original sob MIT ·{' '}
            <a href={`${import.meta.env.BASE_URL}reference/references-and-licenses.md`}>
              Fontes e créditos ↗
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
