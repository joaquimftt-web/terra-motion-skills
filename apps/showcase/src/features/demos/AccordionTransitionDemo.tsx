import { useEffect, useRef, useState } from 'react';
import { AccordionTransition } from '@motion-skills-lab/motion-recipes/accordion-transition';
import { ButtonFeedback } from '@motion-skills-lab/motion-recipes/button-feedback';
import { CodeExample } from '../../components/CodeExample';

export function AccordionTransitionDemo({ reduceMotion }: { reduceMotion: boolean }) {
  const [open, setOpen] = useState(true);
  const [duration, setDuration] = useState(180);
  const [instance, setInstance] = useState(0);
  const [replays, setReplays] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  function cancelReplay() {
    if (timer.current !== null) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }
  useEffect(
    () => () => {
      if (timer.current !== null) clearTimeout(timer.current);
    },
    [],
  );
  function replay() {
    cancelReplay();
    setOpen(false);
    timer.current = setTimeout(
      () => {
        timer.current = null;
        setOpen(true);
        setReplays((value) => value + 1);
      },
      reduceMotion ? 0 : duration + 32,
    );
  }
  function restart() {
    cancelReplay();
    setOpen(true);
    setReplays(0);
    setInstance((value) => value + 1);
  }
  const code = `import { useState } from 'react';
import { AccordionTransition } from
  '@motion-skills-lab/motion-recipes/accordion-transition';
import '@motion-skills-lab/motion-recipes/accordion-transition.css';

export function Details() {
  const [open, setOpen] = useState(false);
  return (
    <AccordionTransition open={open}
      onOpenChange={setOpen} trigger="Detalhes"
      duration={${duration}} reduceMotion={${reduceMotion}}>
      <p>Seu conteúdo real, no seu controle.</p>
    </AccordionTransition>
  );
}`;
  return (
    <section id="accordion-transition" className="recipe-section" aria-labelledby="accordion-title">
      <div className="section-heading">
        <div className="recipe-title">
          <span className="recipe-number">02</span>
          <div>
            <p className="eyebrow">CONTEÚDO / DISCLOSURE CONTROLADO</p>
            <h2 id="accordion-title">Accordion Transition</h2>
          </div>
        </div>
        <span className="technology-tag">MOTION · {duration} ms</span>
      </div>
      <p className="section-description">
        Revele conteúdo no ritmo da leitura. Uma transição reversível que mantém contexto, sem
        atrasar a ação.
      </p>
      <div className="demo-layout">
        <div className="demo-panel">
          <div className="panel-bar">
            <span>
              <i className="live-dot" aria-hidden="true" /> PRÉVIA INTERATIVA
            </span>
            <span className="state-tag">{open ? 'ABERTO' : 'FECHADO'}</span>
          </div>
          <div className="accordion-stage" data-instance={instance}>
            <span className="stage-caption">UM MOVIMENTO, UMA INTENÇÃO</span>
            <AccordionTransition
              key={instance}
              open={open}
              onOpenChange={(next) => {
                cancelReplay();
                setOpen(next);
              }}
              trigger="O que torna uma transição útil?"
              duration={duration}
              reduceMotion={reduceMotion}
              id="demo-accordion"
            >
              <p>
                Ela ajuda a entender o que mudou. O conteúdo continua sob controle do React, e cada
                nova interação pode interromper o movimento.
              </p>
              <a href="#fundamentos">
                Conheça os fundamentos <span aria-hidden="true">↗</span>
              </a>
            </AccordionTransition>
            <p className="stage-hint">Enter ou Espaço no gatilho. Tab para explorar o conteúdo.</p>
          </div>
          <div className="lab-settings">
            <p className="lab-control-heading">CONFIGURAÇÕES</p>
            <div className="duration-control">
              <label htmlFor="accordion-duration">Duração do Accordion</label>
              <output htmlFor="accordion-duration">{duration} ms</output>
              <input
                id="accordion-duration"
                type="range"
                min="160"
                max="220"
                step="10"
                value={duration}
                onChange={(event) => setDuration(event.currentTarget.valueAsNumber)}
              />
            </div>
            <div className="demo-controls replay-controls">
              <ButtonFeedback type="button" onClick={replay} reduceMotion={reduceMotion}>
                ↻ Repetir transição
              </ButtonFeedback>
              <ButtonFeedback type="button" onClick={restart} reduceMotion={reduceMotion}>
                Reiniciar exemplo
              </ButtonFeedback>
              <output className="replay-status" aria-live="polite">
                Repetições: {replays}
              </output>
            </div>
          </div>
        </div>
        <CodeExample code={code} name="Accordion Transition" />
      </div>
      <div className="recipe-notes">
        <p>
          <strong>Use para</strong> detalhes e seções de conteúdo. <strong>Evite</strong> conteúdo
          essencial escondido ou controles dentro do gatilho.
        </p>
        <div className="resource-links">
          <a href={`${import.meta.env.BASE_URL}reference/accordion-transition.tsx`}>
            Código da receita ↗
          </a>
          <a href={`${import.meta.env.BASE_URL}reference/motion-foundations.md`}>
            Skill: motion-foundations ↗
          </a>
        </div>
        <p className="dependency-note">
          Dependências: React + React DOM + Motion. Painel fechado: aria-hidden + inert. Movimento
          reduzido: mudança imediata.
        </p>
      </div>
    </section>
  );
}
