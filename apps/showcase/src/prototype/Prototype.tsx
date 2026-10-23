import { useEffect, useState, type CSSProperties } from 'react';
import { motion } from 'motion/react';
import { ButtonFeedback } from '@motion-skills-lab/motion-recipes/button-feedback';
import { AccordionTransition } from '@motion-skills-lab/motion-recipes/accordion-transition';
import { App } from '../app/App';
import { useSystemReducedMotion } from '../components/useSystemReducedMotion';
import { usePresentation } from './usePresentation';
import { Architecture } from './Architecture';
import { useLandingNarrative } from './useLandingNarrative';
import './prototype.css';
import './v2.css';
import './v3.css';
import './v4.css';
import './p1.css';
import './narrative.css';
import materialUrl from './assets/terra-material-reference.webp';
import { FirstContact, LandingMotion } from './landing-motion/LandingMotion';

const base = import.meta.env.BASE_URL;
const resources = [
  [
    '07',
    'Presence Transition',
    'Presença controlada, foco e remoção real.',
    'presence-transition.tsx',
    'CÓDIGO-FONTE',
  ],
  [
    '08',
    'Async State Feedback',
    'Cinco estados controlados e anúncio opcional.',
    'async-state-feedback.tsx',
    'CÓDIGO-FONTE',
  ],
  [
    '09',
    'Navigation Indicator',
    'Links nativos e seleção controlada.',
    'navigation-indicator.tsx',
    'CÓDIGO-FONTE',
  ],
  [
    '01',
    'Contrato de motion',
    'Princípios, parâmetros e limites das interações.',
    'motion-contract.md',
    'DOCUMENTAÇÃO',
  ],
  [
    '02',
    'Motion foundations',
    'Uma skill operacional para decisões de motion.',
    'motion-foundations.md',
    'SKILL',
  ],
  [
    '03',
    'Microinteraction design',
    'Critérios para interações pequenas e significativas.',
    'microinteraction-design.md',
    'SKILL',
  ],
  [
    '04',
    'Button Feedback',
    'Implementação original da recipe em React.',
    'button-feedback.tsx',
    'CÓDIGO-FONTE',
  ],
  [
    '05',
    'Accordion Transition',
    'Disclosure controlado, sem perder o contexto.',
    'accordion-transition.tsx',
    'CÓDIGO-FONTE',
  ],
  [
    '06',
    'Fontes e licenças',
    'Proveniência, inspiração e condições de uso.',
    'references-and-licenses.md',
    'CRÉDITOS',
  ],
  [
    '10',
    'Scroll Reveal',
    'Entrada neutra, preparação segura e fallback.',
    'scroll-reveal.tsx',
    'CÓDIGO-FONTE',
  ],
  [
    '11',
    'Staggered Entrance',
    'Grupo semântico com atraso limitado.',
    'staggered-entrance.tsx',
    'CÓDIGO-FONTE',
  ],
  [
    '12',
    'Scroll Progress',
    'Indicador decorativo de posição real.',
    'scroll-progress.tsx',
    'CÓDIGO-FONTE',
  ],
  ['13', 'Scroll motion', 'Skill de entradas e progresso de rolagem.', 'scroll-motion.md', 'SKILL'],
  [
    '14',
    'Layout Reflow',
    'Posição controlada e identidade preservada.',
    'layout-reflow.tsx',
    'CÓDIGO-FONTE',
  ],
  [
    '15',
    'Skeleton-to-Content',
    'Conteúdo imediato e recarga acessível.',
    'skeleton-to-content.tsx',
    'CÓDIGO-FONTE',
  ],
  [
    '16',
    'Data Change Feedback',
    'Valor exato e feedback secundário.',
    'data-change-feedback.tsx',
    'CÓDIGO-FONTE',
  ],
  [
    '17',
    'Layout transitions',
    'Skill de layout e estados dinâmicos.',
    'layout-transitions.md',
    'SKILL',
  ],
] as const;

function Brand() {
  return (
    <a className="lp-brand" href={base} aria-label="Terra Motion Skills início">
      <img
        className="lp-original-logo"
        src={`${base}identity/terra-commerce-original.png`}
        width="256"
        height="256"
        alt=""
      />
      TERRA <span>Motion Skills</span>
    </a>
  );
}

export function Prototype() {
  const path = window.location.pathname.slice(base.length).replace(/\/+$/, '');
  const page = path === 'lab' ? 'lab' : path === 'referencias' ? 'references' : 'landing';
  useEffect(() => {
    document.title =
      page === 'lab'
        ? 'Terra Motion Skills — Interações com intenção'
        : page === 'references'
          ? 'Terra Motion Skills — Referências'
          : 'Terra Motion Skills — Experiência integrada';
  }, [page]);
  const [manualReduction, setManualReduction] = useState(false);
  const reduced = useSystemReducedMotion() || manualReduction;
  const { scope, replayIntro } = usePresentation(reduced);
  if (page === 'lab') return <App />;
  return (
    <div
      className="prototype-shell"
      ref={scope}
      data-reduced={reduced}
      data-landing-motion={page === 'landing' ? 'true' : undefined}
      style={{ '--lp-material-image': `url("${materialUrl}")` } as CSSProperties}
    >
      <a className="lp-skip" href="#principal">
        Pular para o conteúdo
      </a>
      <header>
        <div className="lp-preview">
          <span className="lp-status-dot" />
          V4 · L1–L3 <span>Público</span>
        </div>
        <div className="lp-header">
          <Brand />
          <nav aria-label="Navegação principal">
            <a href={`${base}#biblioteca`}>Biblioteca</a>
            <a href={`${base}lab/`}>
              Laboratório <span aria-hidden="true">↗</span>
            </a>
            <a
              href={`${base}referencias/`}
              aria-current={page === 'references' ? 'page' : undefined}
            >
              Referências
            </a>
          </nav>
          <label className="lp-reduce">
            <input
              type="checkbox"
              checked={manualReduction}
              onChange={(event) => setManualReduction(event.target.checked)}
            />
            Reduzir movimento
          </label>
        </div>
      </header>
      {page === 'references' ? (
        <References />
      ) : (
        <Landing reduced={reduced} replayIntro={replayIntro} />
      )}
      <footer className="lp-footer">
        <Brand />
        <p>
          Código original sob MIT.
          <br />© 2026 Joaquim Freitas
        </p>
        <div>
          <a href={`${base}LICENSE`}>Licença</a>
          <a href={`${base}THIRD_PARTY_NOTICES.md`}>Avisos de terceiros</a>
          <a href="https://github.com/joaquimftt-web/terra-motion-skills">GitHub ↗</a>
        </div>
      </footer>
    </div>
  );
}

function Landing({ reduced, replayIntro }: { reduced: boolean; replayIntro: () => void }) {
  const narrativeRoot = useLandingNarrative(reduced);
  const [activations, setActivations] = useState(0);
  const [open, setOpen] = useState(false);
  return (
    <main id="principal" ref={narrativeRoot}>
      <section className="lp-hero" aria-labelledby="lp-title">
        <div className="lp-architectural-field" aria-hidden="true">
          <Architecture />
        </div>
        <div className="lp-hero-coordinate" aria-hidden="true">
          <span>01 / MATERIAL & MOVIMENTO</span>
          <span>TERRA / COMPOSIÇÃO ESPACIAL</span>
        </div>
        <div className="lp-hero-copy">
          <p className="lp-kicker" data-intro>
            TERRA MOTION SKILLS <span aria-hidden="true">/</span> REACT + MOTION
          </p>
          <h1 id="lp-title">
            <span className="lp-hero-line" data-intro>
              Movimento.
            </span>
            <em className="lp-hero-line" data-intro>
              Com intenção.
            </em>
          </h1>
          <p className="lp-hero-description" data-intro>
            Pequenos gestos. Interfaces mais claras.
            <br />
            Uma biblioteca de motion feita para ser entendida, experimentada e levada ao seu próximo
            projeto.
          </p>
          <div className="lp-actions">
            <a className="lp-primary" href="#biblioteca">
              Explorar a biblioteca <span aria-hidden="true">↘</span>
            </a>
            <a className="lp-text-link" href={`${base}lab/`}>
              Entrar no laboratório <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div className="lp-hero-foot">
            <span>01 — INTENÇÃO EM MOVIMENTO</span>
            <button type="button" onClick={replayIntro} disabled={reduced}>
              ↻ Rever entrada
            </button>
          </div>
        </div>
        <div className="lp-material-key" aria-hidden="true">
          <i />
          <span>COBRE / ESTRUTURA</span>
          <i />
          <span>MINERAL / CONTEXTO</span>
        </div>
      </section>
      <FirstContact reduced={reduced} />
      <div className="lp-proof-strip">
        <p>
          <strong>11</strong> Recipes funcionais
        </p>
        <p>
          <strong>04</strong> Skills operacionais
        </p>
        <p>
          <span className="lp-small-cross" aria-hidden="true">
            ✳
          </span>{' '}
          Acessibilidade como fundamento
        </p>
        <p>React · TypeScript · Motion</p>
      </div>
      <section className="lp-statement lp-section" aria-labelledby="statement-title">
        <div className="lp-concept-guide" data-narrative="concept" aria-hidden="true" />
        <p className="lp-kicker">(01) O QUE MOVE ESTE PROJETO</p>
        <h2 id="statement-title">
          Clareza, em
          <br />
          <span>cada interação.</span>
        </h2>
        <div className="lp-statement-bottom">
          <span className="lp-fine-index">INTENÇÃO → RESPOSTA → CONTEXTO</span>
          <p>
            Motion pode confirmar uma ação, orientar a atenção e preservar o contexto. Aqui, cada
            movimento tem um propósito — e um contrato que você pode ler.
          </p>
        </div>
      </section>
      <section id="biblioteca" className="lp-library lp-section" aria-labelledby="library-title">
        <div className="lp-section-heading">
          <div>
            <p className="lp-kicker">(02) A BIBLIOTECA / v0.1</p>
            <h2 id="library-title">
              Ideias que você
              <br />
              pode <em>experimentar.</em>
            </h2>
          </div>
          <p>
            11 recipes. Comportamento real.
            <br />
            Código independente desta vitrine.
          </p>
        </div>
        <div className="lp-recipe-grid">
          <motion.article className="lp-recipe-card">
            <div className="lp-card-meta">
              <span>01 / FEEDBACK</span>
              <span>CSS · 140 ms</span>
            </div>
            <h3>
              Button Feedback<span aria-hidden="true">↗</span>
            </h3>
            <p>Uma resposta discreta para uma ação intencional.</p>
            <div className="lp-demo-surface">
              <span className="lp-demo-label">DEMONSTRAÇÃO REAL</span>
              <ButtonFeedback
                reduceMotion={reduced}
                onClick={() => setActivations((value) => value + 1)}
              >
                Confirmar interação ↗
              </ButtonFeedback>
              <output aria-live="polite">
                {activations === 0
                  ? 'Experimente o botão'
                  : `${activations} ${activations === 1 ? 'ativação' : 'ativações'} nesta sessão`}
              </output>
            </div>
            <a className="lp-card-link" href={`${base}lab/#button-feedback`}>
              Explorar controles e código <span aria-hidden="true">↗</span>
            </a>
          </motion.article>
          <motion.article className="lp-recipe-card">
            <div className="lp-card-meta">
              <span>02 / CONTEXTO</span>
              <span>MOTION · 180 ms</span>
            </div>
            <h3>
              Accordion Transition<span aria-hidden="true">↗</span>
            </h3>
            <p>Revele informação sem interromper a leitura.</p>
            <div className="lp-demo-surface lp-accordion-demo">
              <span className="lp-demo-label">DEMONSTRAÇÃO REAL</span>
              <AccordionTransition
                id="landing-accordion"
                open={open}
                onOpenChange={setOpen}
                reduceMotion={reduced}
                trigger="O que acontece ao abrir?"
              >
                <p>
                  O espaço acompanha o conteúdo. O estado continua no React e o foco permanece no
                  seu controle.
                </p>
                <a href={`${base}lab/#accordion-transition`}>Ver a recipe no laboratório ↗</a>
              </AccordionTransition>
            </div>
            <a className="lp-card-link" href={`${base}lab/#accordion-transition`}>
              Explorar controles e código <span aria-hidden="true">↗</span>
            </a>
          </motion.article>
        </div>
        <p className="lp-scope-note">
          A apresentação é exclusiva da landing. L1, L2 e L3 estão na main e no GitHub Pages. A
          recipe Scroll Reveal publicada pertence ao L2; o experimento R1 permanece preservado no
          histórico. Pacotes npm não publicados.
        </p>
      </section>
      <section className="lp-method lp-section" aria-labelledby="method-title">
        <div className="lp-method-heading">
          <p className="lp-kicker">DA REFERÊNCIA À PRÁTICA</p>
          <h2 id="method-title">
            Explore. Entenda.
            <br />
            <em>Faça seu.</em>
          </h2>
          <p>Uma biblioteca que aproxima intenção, comportamento e implementação.</p>
          <a className="lp-text-link" href={`${base}referencias/`}>
            Abrir as referências ↗
          </a>
        </div>
        <div className="lp-method-sequence">
          <div className="lp-method-path" data-narrative="method" aria-hidden="true" />
          <ol className="lp-method-list">
            <li>
              <span>01</span>
              <div>
                <h3>Escolha pelo propósito.</h3>
                <p>
                  Feedback para ações. Transições para conteúdo. Comece pelo problema da interface.
                </p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <h3>Experimente os limites.</h3>
                <p>
                  Teclado, movimento reduzido, duração e replay. O laboratório mostra o
                  comportamento de verdade.
                </p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <h3>Leve apenas o necessário.</h3>
                <p>
                  Recipes modulares, contratos explícitos e skills para orientar agentes de IA. Sem
                  depender do showcase.
                </p>
              </div>
            </li>
          </ol>
        </div>
      </section>
      <LandingMotion reduced={reduced} />
      <section className="lp-closing lp-section" aria-labelledby="closing-title">
        <div className="lp-closing-light" data-narrative="closing" aria-hidden="true" />
        <div>
          <p className="lp-kicker">MENOS RUÍDO. MAIS SIGNIFICADO.</p>
          <h2 id="closing-title">
            O próximo gesto
            <br />
            começa <em>com você.</em>
          </h2>
        </div>
        <div>
          <p>Entre no laboratório, ajuste os controles e encontre o movimento que faz sentido.</p>
          <a className="lp-primary" href={`${base}lab/`}>
            Abrir o laboratório <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>
    </main>
  );
}

function References() {
  return (
    <main id="principal" className="lp-references lp-section">
      <p className="lp-kicker">REPERTÓRIO ABERTO / DOCUMENTAÇÃO</p>
      <h1>
        O que sustenta
        <br />
        <em>cada movimento.</em>
      </h1>
      <p className="lp-reference-intro">
        Contratos, código e decisões. Recursos originais da biblioteca, separados das inspirações
        visuais do showcase.
      </p>
      <div className="lp-reference-grid">
        {resources.map(([index, title, description, file, type]) => (
          <a key={file} className="lp-reference-card" href={`${base}reference/${file}`}>
            <span className="lp-card-meta">
              {index} / {type}
              <span aria-hidden="true">↗</span>
            </span>
            <h2>{title}</h2>
            <p>{description}</p>
            <span className="lp-reference-file">{file}</span>
          </a>
        ))}
      </div>
      <section className="lp-inspirations" aria-labelledby="inspiration-title">
        <h2 id="inspiration-title">Inspiração, com proveniência.</h2>
        <p>
          A linguagem mineral usa a imagem raster fornecida pelo usuário, com enquadramentos,
          máscaras e camadas CSS originais. O fundo arquitetônico não é uma geometria SVG
          procedural. O símbolo Terra Commerce é um PNG separado, usado sem edição; ícones e
          elementos gráficos de interface são originais do projeto. Esses assets não herdam a
          licença MIT do código. Uso público neste projeto autorizado pelo titular, sem licença
          geral de reutilização.
        </p>
        <ul>
          <li>
            <a href="https://www.codemakers.com.br/">Codemakers ↗</a> — ritmo e entradas
            progressivas.
          </li>
          <li>
            <a href="https://fuel.framer.website/">Fuel ↗</a> — composição editorial e camadas.
          </li>
          <li>
            <a href="https://nakula.framer.website/">Nakula ↗</a> — relação entre texto, navegação e
            apresentação.
          </li>
          <li>
            <a href="https://motion.dev/">Motion ↗</a> — tecnologia principal da apresentação.
          </li>
          <li>
            <a href="https://www.adobe.com/">Adobe ↗</a> — hierarquia, produto e clareza das
            chamadas.
          </li>
        </ul>
        <p>
          Nenhum código, imagem ou asset desses sites foi copiado. As referências não são afiliadas
          ao projeto e seus materiais não integram a licença MIT do código original.
        </p>
      </section>
    </main>
  );
}
