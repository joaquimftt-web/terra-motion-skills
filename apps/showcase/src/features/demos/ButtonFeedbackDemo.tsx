import { useState } from 'react';
import { ButtonFeedback } from '@motion-skills-lab/motion-recipes/button-feedback';
import { CodeExample } from '../../components/CodeExample';

const code = `import { ButtonFeedback } from
  '@motion-skills-lab/motion-recipes/button-feedback';
import '@motion-skills-lab/motion-recipes/button-feedback.css';

export function Confirm({ onConfirm }: {
  onConfirm: () => void;
}) {
  return (
    <ButtonFeedback type="button" onClick={onConfirm}>
      Confirmar
    </ButtonFeedback>
  );
}`;

export function ButtonFeedbackDemo({ reduceMotion }: { reduceMotion: boolean }) {
  const [disabled, setDisabled] = useState(false);
  const [activations, setActivations] = useState(0);
  return (
    <section id="button-feedback" className="recipe-section" aria-labelledby="button-title">
      <div className="section-heading">
        <div className="recipe-title">
          <span className="recipe-number">01</span>
          <div>
            <p className="eyebrow">CONTROLES / FEEDBACK OPERACIONAL</p>
            <h2 id="button-title">Button Feedback</h2>
          </div>
        </div>
        <span className="technology-tag">CSS · 140 ms</span>
      </div>
      <p className="section-description">
        Um gesto pequeno que confirma a interação. Cor e foco comunicam o estado, sem deslocar a
        interface.
      </p>
      <div className="demo-layout">
        <div className="demo-panel">
          <div className="panel-bar">
            <span>
              <i className="live-dot" aria-hidden="true" /> PRÉVIA INTERATIVA
            </span>
            <span className="mono">HOVER / FOCUS / PRESS</span>
          </div>
          <div className="button-stage">
            <ButtonFeedback
              type="button"
              className="demo-action"
              reduceMotion={reduceMotion}
              disabled={disabled}
              onClick={() => setActivations((value) => value + 1)}
            >
              Confirmar interação <span aria-hidden="true">↗</span>
            </ButtonFeedback>
            <span className="stage-hint">Mouse, teclado ou toque. Experimente.</span>
            <output className="activation-output" aria-live="polite">
              {activations} {activations === 1 ? 'ativação' : 'ativações'} nesta sessão
            </output>
          </div>
          <div className="demo-controls">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={disabled}
                onChange={(event) => setDisabled(event.currentTarget.checked)}
              />
              Desabilitar botão
            </label>
            <span className="mono">
              {reduceMotion ? '0 ms · reduzido' : '140 ms · cor e borda'}
            </span>
          </div>
        </div>
        <CodeExample code={code} name="Button Feedback" />
      </div>
      <div className="recipe-notes">
        <p>
          <strong>Use para</strong> ações explícitas, botões de formulário e controles operacionais.{' '}
          <strong>Evite</strong> scale, sucesso simulado ou informação apenas em hover.
        </p>
        <div className="resource-links">
          <a href={`${import.meta.env.BASE_URL}reference/button-feedback.tsx`}>
            Código da receita ↗
          </a>
          <a href={`${import.meta.env.BASE_URL}reference/microinteraction-design.md`}>
            Skill: microinteraction-design ↗
          </a>
        </div>
        <p className="dependency-note">
          Dependências: React + React DOM. Receita CSS independente da vitrine.
        </p>
      </div>
    </section>
  );
}
