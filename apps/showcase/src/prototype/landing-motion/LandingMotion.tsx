/** Approved landing composition. Showcase only; consumes public recipe exports. */
import { useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react';
import { scroll } from 'motion';
import { ButtonFeedback } from '@motion-skills-lab/motion-recipes/button-feedback';
import { AccordionTransition } from '@motion-skills-lab/motion-recipes/accordion-transition';
import { PresenceTransition } from '@motion-skills-lab/motion-recipes/presence-transition';
import { ScrollReveal } from '@motion-skills-lab/motion-recipes/scroll-reveal';
import { StaggeredEntrance } from '@motion-skills-lab/motion-recipes/staggered-entrance';
import { ScrollProgress } from '@motion-skills-lab/motion-recipes/scroll-progress';
import { linkedGeometry, positionFraction } from './geometry';
import './landing-motion.css';

const base = import.meta.env.BASE_URL;
const principles = [
  {
    id: 'intent',
    title: 'Um gesto. Uma intenção.',
    text: 'Respostas visíveis, sem disputar a atenção com o conteúdo.',
  },
  {
    id: 'control',
    title: 'O controle é seu.',
    text: 'Foco, teclado e preferência por menos movimento vêm primeiro.',
  },
  {
    id: 'reuse',
    title: 'Leve o comportamento.',
    text: 'A identidade pertence à vitrine. As recipes são independentes.',
  },
];
const panelIds = ['feedback', 'contexto', 'presenca', 'posicao'];
const panelTitles = [
  'Confirme uma intenção.',
  'Abra espaço para entender.',
  'Mude sem perder o contexto.',
  'Encontre sua posição.',
];

export function FirstContact({ reduced }: { reduced: boolean }) {
  const [present, setPresent] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  return (
    <aside className="hx-first" data-placement="after" aria-labelledby="hx-first-title">
      <div>
        <p className="lp-kicker">MOTION EM USO / EXPERIMENTE</p>
        <h2 id="hx-first-title">Um gesto. Uma resposta.</h2>
        <p>Abra, feche e observe. O movimento acompanha sua decisão.</p>
      </div>
      <div className="hx-first-demo">
        <ButtonFeedback
          ref={button}
          aria-expanded={present}
          aria-controls="hx-first-response"
          reduceMotion={reduced}
          onClick={() => setPresent(!present)}
        >
          {present ? 'Fechar resposta' : 'Ver uma resposta real'} ↗
        </ButtonFeedback>
        <div className="hx-first-reserve">
          <PresenceTransition present={present} returnFocusRef={button} reduceMotion={reduced}>
            <div id="hx-first-response">
              <strong>O gesto tem consequência.</strong>
              <p>Presença controlada. Foco preservado. Sem remontar o contexto.</p>
              <a href={`${base}lab/#presence-transition`}>Experimentar no laboratório ↗</a>
            </div>
          </PresenceTransition>
        </div>
      </div>
    </aside>
  );
}

function PanelContent({ index, reduced }: { index: number; reduced: boolean }) {
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [present, setPresent] = useState(true);
  const [blocks, setBlocks] = useState(5);
  const presenceButton = useRef<HTMLButtonElement>(null);
  const container = useRef<HTMLDivElement>(null),
    content = useRef<HTMLDivElement>(null);
  if (index === 0)
    return (
      <>
        <div className="hx-sample hx-feedback">
          <span className="hx-overline">BUTTON FEEDBACK / INTERAÇÃO REAL</span>
          <ButtonFeedback reduceMotion={reduced} onClick={() => setCount((n) => n + 1)}>
            Confirmar interação ↗
          </ButtonFeedback>
          <output aria-live="polite">
            {count
              ? `${count} ${count === 1 ? 'ação confirmada' : 'ações confirmadas'}`
              : 'Clique, toque ou use Enter / Espaço.'}
          </output>
        </div>
        <p className="hx-purpose">
          A resposta acompanha o gesto. O conteúdo continua estável, sem escala ou deslocamento da
          interface.
        </p>
      </>
    );
  if (index === 1)
    return (
      <>
        <div className="hx-sample">
          <span className="hx-overline">ACCORDION TRANSITION / ESTADO CONTROLADO</span>
          <AccordionTransition
            id="hx-accordion"
            open={open}
            onOpenChange={setOpen}
            reduceMotion={reduced}
            trigger="Como uma recipe preserva o contexto?"
          >
            <p>
              O estado pertence ao React. O movimento acompanha a mudança, sem transformar a
              interface em uma sequência obrigatória.
            </p>
            <a href={`${base}lab/#accordion-transition`}>Abrir os controles completos ↗</a>
          </AccordionTransition>
        </div>
        <p className="hx-purpose">
          Experimente abrir e fechar durante a transição. O foco permanece no controle.
        </p>
      </>
    );
  if (index === 2)
    return (
      <>
        <div className="hx-sample hx-presence">
          <span className="hx-overline">PRESENCE TRANSITION / ENTRADA E SAÍDA</span>
          <button
            className="hx-button"
            ref={presenceButton}
            aria-expanded={present}
            aria-controls="hx-presence-content"
            onClick={() => setPresent(!present)}
          >
            {present ? 'Retirar conteúdo' : 'Trazer conteúdo'}
          </button>
          <div className="hx-presence-reserve">
            <PresenceTransition
              present={present}
              returnFocusRef={presenceButton}
              reduceMotion={reduced}
            >
              <div id="hx-presence-content" className="hx-presence-message">
                <strong>Presença com responsabilidade.</strong>
                <p>Texto opaco na entrada. Saída breve, sem deixar controles invisíveis ativos.</p>
                <button className="hx-inline" onClick={() => setPresent(false)}>
                  Fechar por dentro e devolver foco ↗
                </button>
              </div>
            </PresenceTransition>
          </div>
        </div>
        <p className="hx-purpose">
          Reversões rápidas preservam o estado. Redução de movimento prevalece sobre a apresentação.
        </p>
      </>
    );
  return (
    <>
      <div className="hx-sample hx-progress-sample">
        <span className="hx-overline">SCROLL PROGRESS / POSIÇÃO REAL</span>
        <ScrollProgress
          className="hx-position"
          source={{ type: 'container', containerRef: container, contentRef: content }}
        />
        <div
          className="hx-scroll-notes"
          ref={container}
          tabIndex={0}
          role="region"
          aria-label="Notas roláveis do painel de progresso"
        >
          <div ref={content}>
            {Array.from({ length: blocks }, (_, i) => (
              <p key={i}>
                <strong>{String(i + 1).padStart(2, '0')} / </strong>
                {
                  [
                    'Posição é orientação, não prova de leitura.',
                    'Role para baixo e volte: o indicador acompanha o caminho real.',
                    'O conteúdo pode crescer sem perder o vínculo com o container.',
                    'Não há easing ou spring atrasando esta informação.',
                    'Teclado, toque e trackpad mantêm a rolagem nativa.',
                  ][i % 5]
                }
              </p>
            ))}
          </div>
        </div>
        <button className="hx-inline" onClick={() => setBlocks((n) => (n === 5 ? 8 : 5))}>
          {blocks === 5 ? 'Acrescentar notas' : 'Restaurar notas'}
        </button>
      </div>
      <p className="hx-purpose">
        Aqui, progresso resolve uma necessidade real: orientar dentro de uma região rolável.
      </p>
    </>
  );
}

function MotionGallery({ reduced }: { reduced: boolean }) {
  const stage = useRef<HTMLDivElement>(null),
    sticky = useRef<HTMLDivElement>(null),
    viewport = useRef<HTMLDivElement>(null),
    rail = useRef<HTMLDivElement>(null);
  const marker = useRef<HTMLSpanElement>(null),
    counter = useRef<HTMLOutputElement>(null),
    mode = useRef<HTMLParagraphElement>(null);
  const go = useRef<(index: number, smooth?: boolean) => void>(() => {}),
    active = useRef(0);
  const [nativeWanted, setNativeWanted] = useState(false);
  useLayoutEffect(() => {
    const root = stage.current!,
      pin = sticky.current!,
      view = viewport.current!,
      track = rail.current!;
    let linked = root.dataset.mode === 'linked',
      travel = 0,
      disposed = false,
      frame: number | undefined,
      stopMotion: (() => void) | undefined;
    const cards = Array.from(track.children) as HTMLElement[];
    const update = () => {
      frame = undefined;
      if (disposed) return;
      const position = linked
        ? window.scrollY - (root.getBoundingClientRect().top + window.scrollY) + 24
        : view.scrollLeft;
      const fraction = positionFraction(position, travel);
      if (linked) track.style.transform = `translate3d(${-fraction * travel}px,0,0)`;
      else track.style.removeProperty('transform');
      marker.current!.style.transform = `scaleX(${fraction})`;
      const index = Math.max(
        0,
        Math.min(cards.length - 1, Math.round(fraction * (cards.length - 1))),
      );
      active.current = index;
      const text = `Painel ${index + 1} de ${cards.length}`;
      if (counter.current!.textContent !== text) counter.current!.textContent = text;
      root.dataset.position = String(Math.round(fraction * 1000) / 1000);
    };
    const schedule = () => {
      if (!disposed && frame === undefined) frame = requestAnimationFrame(update);
    };
    const measure = () => {
      if (disposed) return;
      const top = root.getBoundingClientRect().top;
      const previousHeight = root.offsetHeight;
      const wasLinked = linked;
      const previousTravel = travel;
      const previousFraction = Number(root.dataset.position ?? 0);
      const focusedPanel = cards.findIndex((card) => card.contains(document.activeElement));
      const retainedPanel = focusedPanel >= 0 ? focusedPanel : active.current;
      const geometry = linkedGeometry(
        innerWidth,
        innerHeight,
        pin.getBoundingClientRect().height,
        view.clientWidth,
        track.scrollWidth,
        reduced ||
          nativeWanted ||
          typeof ResizeObserver === 'undefined' ||
          typeof CSS === 'undefined' ||
          typeof CSS.supports !== 'function' ||
          !CSS.supports('position', 'sticky') ||
          (!wasLinked && focusedPanel >= 0),
      );
      linked = geometry.linked;
      travel = geometry.travel;
      root.style.setProperty('--hx-travel', `${travel}px`);
      root.style.setProperty('--hx-pin-height', `${pin.getBoundingClientRect().height}px`);
      root.dataset.mode = linked ? 'linked' : 'native';
      mode.current!.textContent = linked
        ? 'A rolagem vertical percorre os painéis. Depois, a página continua.'
        : 'Rolagem horizontal nativa. Use gestos, setas ou os controles. A página segue verticalmente.';
      if (wasLinked !== linked) {
        stopMotion?.();
        stopMotion = undefined;
        if (linked) {
          // Transfer one horizontal owner to the other, preserving the panel being read.
          // Do not move the document if the section is not currently in view.
          view.scrollLeft = 0;
          if (top < innerHeight && top + previousHeight > 24)
            window.scrollTo({
              top:
                root.getBoundingClientRect().top +
                window.scrollY -
                24 +
                Math.min(travel, cards[retainedPanel]!.offsetLeft),
              behavior: 'instant',
            });
          stopMotion = scroll(update);
        } else {
          track.style.removeProperty('transform');
          view.scrollTo({ left: cards[retainedPanel]!.offsetLeft, behavior: 'instant' });
          // Only compensate when a live fallback collapses the stage currently being read.
          if (wasLinked && top < 24 && top + previousHeight > 24)
            window.scrollTo({
              top: root.getBoundingClientRect().top + window.scrollY - 24,
              behavior: 'instant',
            });
        }
      }
      // A resize can change offsets without switching mode. Preserve the reading
      // position and reveal the focused card rather than waiting for another focusin.
      if (wasLinked === linked && previousTravel > 0 && Math.abs(previousTravel - travel) > 1) {
        if (linked && top < 24 && top + previousHeight > 24) {
          const x =
            focusedPanel >= 0
              ? Math.min(travel, cards[focusedPanel]!.offsetLeft)
              : previousFraction * travel;
          view.scrollLeft = 0;
          window.scrollTo({
            top: root.getBoundingClientRect().top + window.scrollY - 24 + x,
            behavior: 'instant',
          });
        } else if (!linked && focusedPanel >= 0) {
          view.scrollTo({ left: cards[focusedPanel]!.offsetLeft, behavior: 'instant' });
          // Upstream reflow can move a native panel vertically as well. Reveal
          // its focused control only while this section still intersects the viewport.
          if (top < innerHeight && top + previousHeight > 24) {
            const target = (document.activeElement as HTMLElement).getBoundingClientRect();
            const dy =
              target.top < 24 ? target.top - 24 : Math.max(0, target.bottom - innerHeight + 24);
            if (dy) window.scrollBy({ top: dy, behavior: 'instant' });
          }
        }
      }
      if (linked && !stopMotion) stopMotion = scroll(update);
      update();
    };
    go.current = (index, smooth = true) => {
      const i = Math.max(0, Math.min(cards.length - 1, index));
      const x = Math.min(travel, cards[i]!.offsetLeft);
      if (linked)
        window.scrollTo({
          top: root.getBoundingClientRect().top + window.scrollY - 24 + x,
          behavior: smooth && !reduced ? 'smooth' : 'instant',
        });
      else view.scrollTo({ left: x, behavior: smooth && !reduced ? 'smooth' : 'instant' });
    };
    const focus = (event: FocusEvent) => {
      const index = cards.findIndex((card) => card.contains(event.target as Node));
      if (index < 0) return;
      const box = (event.target as HTMLElement).getBoundingClientRect(),
        bounds = view.getBoundingClientRect();
      // Reveal only an offscreen keyboard target; never move selection just for focus on a visible control.
      if (box.left < bounds.left || box.right > bounds.right || (linked && view.scrollLeft !== 0)) {
        if (linked) view.scrollLeft = 0;
        go.current(index, false);
        update();
      }
    };
    const nativeFocusScroll = () => {
      // Some Chromium focus scrolls run after focusin. Keep one horizontal owner:
      // map that native reveal back to the document position, never sum both offsets.
      if (linked && view.scrollLeft !== 0) {
        const index = cards.findIndex((card) => card.contains(document.activeElement));
        view.scrollLeft = 0;
        if (index >= 0) go.current(index, false);
      }
      schedule();
    };
    view.addEventListener('scroll', nativeFocusScroll, { passive: true });
    view.addEventListener('focusin', focus);
    window.addEventListener('resize', measure);
    const resize = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(measure);
    resize?.observe(view);
    resize?.observe(track);
    resize?.observe(pin);
    measure();
    root.dataset.lifecycle = 'active';
    return () => {
      disposed = true;
      stopMotion?.();
      resize?.disconnect();
      if (frame !== undefined) cancelAnimationFrame(frame);
      view.removeEventListener('scroll', nativeFocusScroll);
      view.removeEventListener('focusin', focus);
      window.removeEventListener('resize', measure);
      track.style.removeProperty('transform');
      root.dataset.lifecycle = 'disposed';
      go.current = () => {};
    };
  }, [reduced, nativeWanted]);
  const keys = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    go.current(
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? panelIds.length - 1
          : active.current + (event.key === 'ArrowRight' ? 1 : -1),
    );
  };
  return (
    <div className="hx-stage" ref={stage} data-mode="native" data-testid="horizontal-stage">
      <div className="hx-pin" ref={sticky}>
        <div className="hx-rail-meta">
          <p ref={mode}>Conteúdo em rolagem horizontal nativa.</p>
          <output ref={counter} aria-live="off">
            Painel 1 de 4
          </output>
        </div>
        <div className="hx-controls" aria-label="Controles da exploração">
          <div>
            <button className="hx-button" onClick={() => go.current(0)}>
              Voltar ao início
            </button>
            <button
              className="hx-button"
              aria-label="Painel anterior"
              onClick={() => go.current(active.current - 1)}
            >
              ←
            </button>
            <button
              className="hx-button"
              aria-label="Próximo painel"
              onClick={() => go.current(active.current + 1)}
            >
              →
            </button>
          </div>
          <a href="#hx-after">Pular a sequência ↘</a>
          <button
            className="hx-inline"
            aria-pressed={nativeWanted}
            onClick={() => setNativeWanted(!nativeWanted)}
          >
            {nativeWanted ? 'Permitir exploração guiada' : 'Preferir rolagem nativa'}
          </button>
        </div>
        <div
          className="hx-viewport"
          ref={viewport}
          tabIndex={0}
          role="region"
          aria-label="Exploração horizontal de quatro motions"
          onKeyDown={keys}
        >
          <div className="hx-rail" ref={rail}>
            {panelIds.map((id, index) => (
              <article
                className={`hx-panel hx-panel-${index}`}
                key={id}
                aria-labelledby={`hx-panel-${id}`}
              >
                <div className="hx-panel-heading">
                  <span className="hx-index">0{index + 1} / MOTION EM USO</span>
                  <h3 id={`hx-panel-${id}`}>{panelTitles[index]}</h3>
                </div>
                <PanelContent index={index} reduced={reduced} />
                <div className="hx-panel-links">
                  <a
                    href={`${base}lab/#${['button-feedback', 'accordion-transition', 'presence-transition', 'scroll-progress'][index]}`}
                  >
                    Abrir no laboratório ↗
                  </a>
                  <a
                    href={`${base}reference/${index === 3 ? 'scroll-motion' : index === 0 ? 'microinteraction-design' : 'motion-foundations'}.md`}
                  >
                    Ler a skill ↗
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className="hx-route-progress" aria-hidden="true">
          <span ref={marker} />
        </div>
      </div>
    </div>
  );
}

export function LandingMotion({ reduced }: { reduced: boolean }) {
  return (
    <section className="hx-study" id="motion-exploration" aria-labelledby="hx-title">
      <div className="hx-study-heading">
        <ScrollReveal reduceMotion={reduced}>
          <p className="lp-kicker">MOTION EM USO / EXPLORE NA PRÁTICA</p>
          <h2 id="hx-title">
            <span>O movimento muda.</span>
            <em>A intenção permanece.</em>
          </h2>
          <p>
            Quatro experiências reais. Da resposta de um botão à orientação em um conteúdo maior.
          </p>
        </ScrollReveal>
      </div>
      <StaggeredEntrance
        className="hx-principles"
        items={principles}
        getKey={(item) => item.id}
        renderItem={(item) => (
          <>
            <strong>{item.title}</strong>
            <p>{item.text}</p>
          </>
        )}
        reduceMotion={reduced}
      />
      <MotionGallery reduced={reduced} />
      <div className="hx-after" id="hx-after" tabIndex={-1}>
        <p>Fim da exploração. A leitura continua.</p>
        <a href={`${base}lab/`}>Todas as demonstrações, parâmetros e código no laboratório ↗</a>
      </div>
    </section>
  );
}
