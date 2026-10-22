import { motionTokens } from '@motion-skills-lab/motion-tokens';
import { DurationControl } from '../../components/DurationControl';
import { useEffect, useRef, useState } from 'react';
import {
  AsyncStateFeedback,
  type AsyncFeedbackState,
} from '@motion-skills-lab/motion-recipes/async-state-feedback';
import { ButtonFeedback } from '@motion-skills-lab/motion-recipes/button-feedback';
import { CodeExample } from '../../components/CodeExample';

const messages = {
  idle: 'Pronto para iniciar o cenário.',
  pending: 'Operação de demonstração pendente.',
  success: 'Operação de demonstração concluída.',
  error: 'Falha de demonstração. Você pode tentar novamente.',
  cancelled: 'Operação de demonstração cancelada.',
};
type Deferred = { resolve: () => void; reject: () => void; report: boolean };

export function AsyncStateFeedbackDemo({ reduceMotion }: { reduceMotion: boolean }) {
  const [state, setState] = useState<AsyncFeedbackState>('idle');
  const [duration, setDuration] = useState<number>(motionTokens.duration.asyncStateFeedback),
    [ignored, setIgnored] = useState(0);
  const [delegated, setDelegated] = useState(false),
    [activeId, setActiveId] = useState<number | null>(null);
  const requests = useRef(new Map<number, Deferred>()),
    version = useRef(0),
    alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    const pending = requests.current;
    return () => {
      alive.current = false;
      version.current += 1;
      pending.forEach((record) => record.reject());
      pending.clear();
    };
  }, []);
  function begin(keepPrevious = false) {
    const id = ++version.current;
    if (!keepPrevious) requests.current.forEach((record) => record.reject());
    let resolve!: () => void, reject!: () => void;
    const promise = new Promise<void>((yes, no) => {
      resolve = yes;
      reject = () => no(new Error('Controlled fixture rejection'));
    });
    const record = { resolve, reject, report: true };
    requests.current.set(id, record);
    setActiveId(id);
    setState('pending');
    void promise
      .then(
        () => finish('success'),
        () => finish('error'),
      )
      .finally(() => requests.current.delete(id));
    function finish(next: 'success' | 'error') {
      if (!alive.current) return;
      if (id !== version.current) {
        if (record.report) setIgnored((v) => v + 1);
        return;
      }
      setActiveId(null);
      setState(next);
    }
    return id;
  }
  function invalidate(silent = false) {
    version.current += 1;
    requests.current.forEach((record) => {
      if (silent) record.report = false;
      record.reject();
    });
    requests.current.clear();
    setActiveId(null);
  }
  const code = `import { AsyncStateFeedback, type AsyncFeedbackState } from
  '@motion-skills-lab/motion-recipes/async-state-feedback';
import { ButtonFeedback } from '@motion-skills-lab/motion-recipes/button-feedback';
import '@motion-skills-lab/motion-recipes/async-state-feedback.css';
import '@motion-skills-lab/motion-recipes/button-feedback.css';

const messages = ${JSON.stringify(messages, null, 2)};
// A aplicação executa a operação e descarta respostas vencidas.
export function OperationStatus({ state, onStart }: {
  state: AsyncFeedbackState; onStart: () => void;
}) {
  return <div>
    <ButtonFeedback type="button" onClick={onStart}>Iniciar</ButtonFeedback>
    <AsyncStateFeedback state={state} messages={messages}
      duration={${duration}} reduceMotion={${reduceMotion}} announcement="${delegated ? 'off' : 'polite'}" />
    ${delegated ? '<p role="status">{messages[state]}</p> // canal próprio do produto' : '{/* A recipe é o único canal de status deste exemplo. */}'}
  </div>;
}`;
  return (
    <section id="async-state-feedback" className="recipe-section" aria-labelledby="async-title">
      <div className="section-heading">
        <div className="recipe-title">
          <span className="recipe-number">04</span>
          <div>
            <p className="eyebrow">ESTADOS / OPERAÇÃO EXTERNA</p>
            <h2 id="async-title">Async State Feedback</h2>
          </div>
        </div>
        <span className="technology-tag">REACT + CSS</span>
      </div>
      <p className="section-description">
        O resultado vem da aplicação. A recipe apenas apresenta a mensagem atual, sem atrasar
        sucesso, erro ou cancelamento.
      </p>
      <div className="demo-layout">
        <div className="demo-panel">
          <div className="panel-bar">
            <span>FIXTURE CONTROLADA</span>
            <span className="state-tag">{state.toUpperCase()}</span>
          </div>
          <div className="l1-stage">
            <p className="stage-hint">
              Simulação controlada para demonstração; nenhuma gravação de dados.
            </p>
            <AsyncStateFeedback
              state={state}
              messages={messages}
              duration={duration}
              reduceMotion={reduceMotion}
              announcement={delegated ? 'off' : 'polite'}
            />
            <p role={delegated ? 'status' : undefined} className="l1-delegated">
              {delegated ? messages[state] : ''}
            </p>
            <p className="l1-observation">
              {activeId === null ? 'Sem operação ativa.' : `Execução atual: ${activeId}.`} Retornos
              ignorados: {ignored}
            </p>
          </div>
          <div className="lab-settings">
            <p className="lab-control-heading">CENÁRIOS REAIS DA FIXTURE</p>
            <div className="demo-controls l1-actions">
              <ButtonFeedback type="button" onClick={() => begin()}>
                Iniciar operação
              </ButtonFeedback>
              <ButtonFeedback
                type="button"
                disabled={state !== 'pending'}
                onClick={() => requests.current.get(version.current)?.resolve()}
              >
                Resolver sucesso
              </ButtonFeedback>
              <ButtonFeedback
                type="button"
                disabled={state !== 'pending'}
                onClick={() => requests.current.get(version.current)?.reject()}
              >
                Simular falha
              </ButtonFeedback>
              <ButtonFeedback
                type="button"
                disabled={state !== 'pending'}
                onClick={() => {
                  invalidate();
                  setState('cancelled');
                }}
              >
                Cancelar operação
              </ButtonFeedback>
              <ButtonFeedback
                type="button"
                onClick={() => {
                  const id = begin();
                  requests.current.get(id)?.resolve();
                }}
              >
                Resultado imediato
              </ButtonFeedback>
              <ButtonFeedback
                type="button"
                onClick={() => {
                  const first = begin();
                  const second = begin(true);
                  requests.current.get(first)?.resolve();
                  requests.current.get(second)?.resolve();
                }}
              >
                Testar resposta vencida
              </ButtonFeedback>
              <ButtonFeedback
                type="button"
                onClick={() => {
                  invalidate(true);
                  setState('idle');
                  setIgnored(0);
                }}
              >
                Reiniciar feedback
              </ButtonFeedback>
            </div>
            <DurationControl
              id="async-duration"
              label="Duração do feedback"
              value={duration}
              defaultValue={motionTokens.duration.asyncStateFeedback}
              onChange={setDuration}
              reduceMotion={reduceMotion}
            />
            <p className="l1-observation">
              A duração afeta somente o marcador decorativo; o resultado da operação muda
              imediatamente.
            </p>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={delegated}
                onChange={(e) => setDelegated(e.currentTarget.checked)}
              />
              Delegar anúncio ao produto
            </label>
          </div>
        </div>
        <CodeExample code={code} name="Async State Feedback" />
      </div>
      <div className="recipe-notes">
        <p>
          <strong>Use para</strong> comunicar uma operação verdadeira. A fixture resolve Promises
          sob comando e invalida IDs antigos. A recipe não faz requisições nem sabe qual resposta é
          a mais recente.
        </p>
        <p>
          No modo off, o texto permanece acessível, sem role/status ou atributos live próprios. A
          região do produto, se existir, continua responsável pelo anúncio.
        </p>
        <a href={`${import.meta.env.BASE_URL}reference/async-state-feedback.tsx`}>
          Código da receita ↗
        </a>
      </div>
    </section>
  );
}
