import { motionTokens } from '@motion-skills-lab/motion-tokens';
import { DurationControl } from '../../components/DurationControl';
import { useCallback, useRef, useState } from 'react';
import { PresenceTransition } from '@motion-skills-lab/motion-recipes/presence-transition';
import { ButtonFeedback } from '@motion-skills-lab/motion-recipes/button-feedback';
import { CodeExample } from '../../components/CodeExample';

function Notice({
  long,
  variant,
  dismiss,
}: {
  long: boolean;
  variant: number;
  dismiss: () => void;
}) {
  return (
    <article className="l1-notice">
      <strong>Contexto {variant === 0 ? 'A' : 'B'}</strong>
      <p>
        Um bloco contextual que pode ser retirado de verdade.
        {long &&
          ' O texto maior permite verificar quebra de linha e o espaço reservado durante a saída. A remoção final provoca o reflow normal da página; esta recipe não anima a altura.'}
      </p>
      <label className="l1-field">
        Nota preservada
        <input className="l1-input" defaultValue="" />
      </label>
      <ButtonFeedback type="button" onClick={dismiss}>
        Dispensar bloco
      </ButtonFeedback>
    </article>
  );
}

export function PresenceTransitionDemo({ reduceMotion }: { reduceMotion: boolean }) {
  const [present, setPresent] = useState(true),
    [duration, setDuration] = useState<number>(motionTokens.duration.presenceTransition);
  const [long, setLong] = useState(false),
    [variant, setVariant] = useState(0);
  const [instance, setInstance] = useState(0),
    [completed, setCompleted] = useState(0),
    [domPresent, setDomPresent] = useState(true);
  const trigger = useRef<HTMLButtonElement>(null);
  const replay = useRef(false),
    replacement = useRef<number | null>(null);
  const bind = useCallback((node: HTMLDivElement | null) => setDomPresent(Boolean(node)), []);
  function cancelIntent() {
    replay.current = false;
    replacement.current = null;
  }
  const code = `import { useRef, useState } from 'react';
import { PresenceTransition } from '@motion-skills-lab/motion-recipes/presence-transition';
import '@motion-skills-lab/motion-recipes/presence-transition.css';

export function Context() {
  const [present, setPresent] = useState(true);
  const trigger = useRef<HTMLButtonElement>(null);
  return <>
    <button type="button" ref={trigger} onClick={() => setPresent(v => !v)}>Alternar</button>
    <PresenceTransition present={present} returnFocusRef={trigger}
      duration={${duration}} reduceMotion={${reduceMotion}}>
      <p>Contexto ${variant === 0 ? 'A' : 'B'}${long ? ': conteúdo longo com quebra natural, sem animar altura.' : '.'}</p>
      <input aria-label="Nota preservada" />
    </PresenceTransition>
  </>;
}`;
  return (
    <section id="presence-transition" className="recipe-section" aria-labelledby="presence-title">
      <div className="section-heading">
        <div className="recipe-title">
          <span className="recipe-number">03</span>
          <div>
            <p className="eyebrow">ESTADOS / PRESENÇA CONTROLADA</p>
            <h2 id="presence-title">Presence Transition</h2>
          </div>
        </div>
        <span className="technology-tag">MOTION · {reduceMotion ? '0' : duration} ms</span>
      </div>
      <p className="section-description">
        A saída conserva o bloco apenas pelo tempo visual necessário. O foco sai primeiro; depois o
        DOM é removido.
      </p>
      <div className="demo-layout">
        <div className="demo-panel">
          <div className="panel-bar">
            <span>PRÉVIA INTERATIVA</span>
            <span className="state-tag">{present ? 'PRESENTE' : 'RETIRADO'}</span>
          </div>
          <div className="l1-stage l1-presence-stage">
            <PresenceTransition
              key={instance}
              ref={bind}
              present={present}
              duration={duration}
              reduceMotion={reduceMotion}
              returnFocusRef={trigger}
              onExitComplete={() => {
                setCompleted((v) => v + 1);
                if (replacement.current !== null) {
                  setVariant(replacement.current);
                  replacement.current = null;
                }
                if (replay.current) {
                  replay.current = false;
                  setPresent(true);
                }
              }}
            >
              <Notice
                long={long}
                variant={variant}
                dismiss={() => {
                  cancelIntent();
                  setPresent(false);
                }}
              />
            </PresenceTransition>
            <p className="stage-hint">
              {domPresent ? 'DOM presente (inclui a retenção visual da saída).' : 'DOM removido.'}{' '}
              Saídas concluídas: {completed}
            </p>
          </div>
          <div className="lab-settings">
            <p className="lab-control-heading">CONFIGURAÇÕES</p>
            <DurationControl
              id="presence-duration"
              label="Duração da presença"
              value={duration}
              defaultValue={motionTokens.duration.presenceTransition}
              onChange={setDuration}
              reduceMotion={reduceMotion}
            />
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={long}
                onChange={(e) => setLong(e.currentTarget.checked)}
              />
              Conteúdo longo
            </label>
            <div className="demo-controls l1-actions">
              <ButtonFeedback
                type="button"
                ref={trigger}
                reduceMotion={reduceMotion}
                onClick={() => {
                  cancelIntent();
                  setPresent((v) => !v);
                }}
              >
                Alternar presença
              </ButtonFeedback>
              <ButtonFeedback
                type="button"
                onClick={() => {
                  cancelIntent();
                  if (!domPresent) setPresent(true);
                  else {
                    replay.current = true;
                    setPresent(false);
                  }
                }}
              >
                Repetir presença
              </ButtonFeedback>
              <ButtonFeedback
                type="button"
                onClick={() => {
                  cancelIntent();
                  if (!domPresent) {
                    setVariant((v) => 1 - v);
                    setPresent(true);
                  } else {
                    replacement.current = 1 - variant;
                    replay.current = true;
                    setPresent(false);
                  }
                }}
              >
                Trocar contexto
              </ButtonFeedback>
              <ButtonFeedback
                type="button"
                onClick={() => {
                  cancelIntent();
                  setPresent(true);
                  setCompleted(0);
                  setInstance((v) => v + 1);
                }}
              >
                Reiniciar presença
              </ButtonFeedback>
            </div>
            <p className="l1-observation">Saídas concluídas: {completed}</p>
          </div>
        </div>
        <CodeExample code={code} name="Presence Transition" />
      </div>
      <div className="recipe-notes">
        <p>
          <strong>Use para</strong> blocos removíveis. <strong>Evite</strong> modal e expansão de
          altura. Reverter antes da remoção preserva a nota; reiniciar ou remover de fato a
          descarta.
        </p>
        <p>
          O alvo externo de foco é obrigatório neste exemplo interativo. Remover sem alvo é apenas
          fallback de segurança, não restauração acessível correta.
        </p>
        <a href={`${import.meta.env.BASE_URL}reference/presence-transition.tsx`}>
          Código da receita ↗
        </a>
      </div>
    </section>
  );
}
