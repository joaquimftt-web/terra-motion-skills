import { useState } from 'react';
import { useSystemReducedMotion } from '../components/useSystemReducedMotion';
import { RecipeCatalog } from '../features/catalog/RecipeCatalog';
import { ButtonFeedbackDemo } from '../features/demos/ButtonFeedbackDemo';
import { AccordionTransitionDemo } from '../features/demos/AccordionTransitionDemo';
import { PresenceTransitionDemo } from '../features/demos/PresenceTransitionDemo';
import { AsyncStateFeedbackDemo } from '../features/demos/AsyncStateFeedbackDemo';
import { NavigationIndicatorDemo } from '../features/demos/NavigationIndicatorDemo';
import { ReducedMotionControl } from '../components/ReducedMotionControl';
import {
  ScrollRevealDemo,
  StaggeredEntranceDemo,
  ScrollProgressDemo,
} from '../features/demos/ScrollFunctionalDemos';
import './lab.css';

export function App() {
  const [reduced, setReduced] = useState(false);
  const systemReduced = useSystemReducedMotion();
  const effectiveReduction = reduced || systemReduced;
  return (
    <div className="lab-shell">
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <nav className="lp-lab-return" aria-label="Navegação da prévia">
        <a href={import.meta.env.BASE_URL}>← Voltar à apresentação</a>
        <span>PRÉVIA LOCAL · MINERAL TÉCNICO</span>
        <a href={`${import.meta.env.BASE_URL}referencias/`}>Referências ↗</a>
      </nav>
      <aside className="sidebar">
        <a className="brand" href="#visao-geral" aria-label="Terra Motion Skills início">
          <img
            className="lab-original-logo"
            src={`${import.meta.env.BASE_URL}identity/terra-commerce-original.png`}
            width="256"
            height="256"
            alt=""
          />
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
                Experimente o gesto.
                <br />
                <span>Entenda a intenção.</span>
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
          </section>
          <div className="lab-summary">
            <div>
              <strong>05</strong>
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
          <PresenceTransitionDemo reduceMotion={effectiveReduction} />
          <AsyncStateFeedbackDemo reduceMotion={effectiveReduction} />
          <NavigationIndicatorDemo reduceMotion={effectiveReduction} />
          <ScrollRevealDemo reduceMotion={effectiveReduction} />
          <StaggeredEntranceDemo reduceMotion={effectiveReduction} />
          <ScrollProgressDemo />
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
              <a href={`${import.meta.env.BASE_URL}reference/scroll-motion.md`}>
                Ler scroll-motion (L2 local) ↗
              </a>
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
