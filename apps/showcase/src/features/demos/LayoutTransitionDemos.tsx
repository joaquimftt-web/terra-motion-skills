import { useState, type ReactNode } from 'react';
import { ButtonFeedback } from '@motion-skills-lab/motion-recipes/button-feedback';
import { LayoutReflow } from '@motion-skills-lab/motion-recipes/layout-reflow';
import { SkeletonToContent } from '@motion-skills-lab/motion-recipes/skeleton-to-content';
import { DataChangeFeedback } from '@motion-skills-lab/motion-recipes/data-change-feedback';
import { DurationControl } from '../../components/DurationControl';
import { CodeExample } from '../../components/CodeExample';
import './layout-demos.css';

function Demo({
  id,
  number,
  title,
  description,
  duration,
  defaultDuration,
  reduced,
  setDuration,
  controls,
  children,
  code,
}: {
  id: string;
  number: string;
  title: string;
  description: string;
  duration: number;
  defaultDuration: number;
  reduced: boolean;
  setDuration: (value: number) => void;
  controls: ReactNode;
  children: ReactNode;
  code: string;
}) {
  return (
    <section id={id} className="recipe-section" aria-labelledby={`${id}-title`}>
      <div className="section-heading">
        <div className="recipe-title">
          <span className="recipe-number">{number}</span>
          <div>
            <p className="eyebrow">LAYOUT / ESTADOS DINÂMICOS</p>
            <h2 id={`${id}-title`}>{title}</h2>
          </div>
        </div>
        <span className="technology-tag">{reduced ? 0 : duration} ms</span>
      </div>
      <p className="section-description">{description}</p>
      <div className="demo-layout">
        <div className="demo-panel">
          <div className="panel-bar">
            <span>PRÉVIA INTERATIVA</span>
            <span className="state-tag">CONTROLADO</span>
          </div>
          <div className="l3-stage">{children}</div>
          <div className="lab-settings">
            <p className="lab-control-heading">CONFIGURAÇÕES</p>
            <DurationControl
              id={`${id}-duration`}
              label={`Duração de ${title}`}
              value={duration}
              defaultValue={defaultDuration}
              onChange={setDuration}
              reduceMotion={reduced}
            />
            <div className="demo-controls l1-actions">{controls}</div>
          </div>
        </div>
        <CodeExample code={code} name={`${title} — configuração atual`} />
      </div>
      <div className="foundation-links">
        <a href={`${import.meta.env.BASE_URL}reference/${id}.tsx`}>Ver implementação ↗</a>
        <a href={`${import.meta.env.BASE_URL}reference/layout-transitions.md`}>
          Ler layout-transitions ↗
        </a>
      </div>
    </section>
  );
}

export function LayoutReflowDemo({ reduceMotion }: { reduceMotion: boolean }) {
  const [ids, setIds] = useState(['A', 'B', 'C']);
  const [intent, setIntent] = useState(0);
  const [duration, setDuration] = useState(240);
  function reorder(next: string[]) {
    setIds(next);
    setIntent((v) => v + 1);
  }
  const code = `import { useState } from 'react';
import { LayoutReflow } from '@motion-skills-lab/motion-recipes/layout-reflow';

export function Notes() {
  const [ids, setIds] = useState(${JSON.stringify(ids)});
  const [intent, setIntent] = useState(0);
  return <>
    <button onClick={() => { setIds(v => [...v].reverse()); setIntent(v => v + 1); }}>Reordenar</button>
    <LayoutReflow reflowKey={intent} duration={${duration}} reduceMotion={${reduceMotion}}
      aria-label="Notas" items={ids.map(id => ({ id,
        content: <label>Nota {id}<input defaultValue="" /></label>
      }))} />
  </>;
}`;
  return (
    <Demo
      id="layout-reflow"
      number="09"
      title="Layout Reflow"
      description="A ordem real muda; cada input mantém identidade e conteúdo. Só uma intenção explícita solicita movimento."
      duration={duration}
      defaultDuration={240}
      reduced={reduceMotion}
      setDuration={setDuration}
      code={code}
      controls={
        <>
          <ButtonFeedback onClick={() => reorder([...ids].reverse())}>
            Reordenar / replay
          </ButtonFeedback>
          <ButtonFeedback
            onClick={() =>
              reorder(ids.includes('D') ? ids.filter((id) => id !== 'D') : [...ids, 'D'])
            }
          >
            {ids.includes('D') ? 'Remover D' : 'Adicionar D'}
          </ButtonFeedback>
        </>
      }
    >
      <LayoutReflow
        className="l3-list"
        aria-label="Notas reordenáveis"
        reflowKey={intent}
        duration={duration}
        reduceMotion={reduceMotion}
        items={ids.map((id) => ({
          id,
          content: (
            <article>
              <label>
                Nota {id}
                <input className="l1-input" aria-label={`Nota do layout ${id}`} defaultValue="" />
              </label>
            </article>
          ),
        }))}
      />
      <p className="stage-hint">
        Ordem DOM: {ids.join(' → ')}. O consumidor transfere foco antes de excluir um item focado.
      </p>
    </Demo>
  );
}

export function SkeletonToContentDemo({ reduceMotion }: { reduceMotion: boolean }) {
  const [loading, setLoading] = useState(true);
  const [instance, setInstance] = useState(0);
  const [reserved, setReserved] = useState(true);
  const [duration, setDuration] = useState(180);
  const code = `import { useState } from 'react';
import { SkeletonToContent } from '@motion-skills-lab/motion-recipes/skeleton-to-content';

export function Availability() {
  const [loading, setLoading] = useState(${loading});
  return <>
    <button onClick={() => setLoading(v => !v)}>Alternar disponibilidade</button>
    <SkeletonToContent loading={loading} duration={${duration}} reduceMotion={${reduceMotion}}
      ${reserved ? 'minBlockSize={150} ' : ''}skeleton={<p>Preparando conteúdo…</p>}>
      <label>Nota real<input defaultValue="Conteúdo disponível" /></label>
    </SkeletonToContent>
  </>;
}`;
  return (
    <Demo
      id="skeleton-to-content"
      number="10"
      title="Skeleton-to-Content"
      description="O estado é manual. A duração controla só o acabamento decorativo; conteúdo disponível nunca espera a animação."
      duration={duration}
      defaultDuration={180}
      reduced={reduceMotion}
      setDuration={setDuration}
      code={code}
      controls={
        <>
          <ButtonFeedback onClick={() => setLoading((v) => !v)}>
            {loading ? 'Disponibilizar conteúdo' : 'Revalidar conteúdo'}
          </ButtonFeedback>
          <ButtonFeedback
            onClick={() => {
              setLoading(true);
              setInstance((v) => v + 1);
            }}
          >
            Reiniciar skeleton
          </ButtonFeedback>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={reserved}
              onChange={(e) => setReserved(e.currentTarget.checked)}
            />
            Reservar altura conhecida
          </label>
        </>
      }
    >
      <SkeletonToContent
        key={instance}
        loading={loading}
        duration={duration}
        reduceMotion={reduceMotion}
        {...(reserved ? { minBlockSize: 150 } : {})}
        skeleton={
          <div className="l3-skeleton">
            <span />
            <span />
            <span />
            <p>Preparando conteúdo…</p>
          </div>
        }
      >
        <article className="l3-content">
          <h3>Disponível agora</h3>
          <p>Na revalidação, este bloco continua montado, legível e interativo.</p>
          <label>
            Nota real
            <input
              className="l1-input"
              aria-label="Nota do conteúdo"
              defaultValue="Conteúdo disponível"
            />
          </label>
        </article>
      </SkeletonToContent>
      <p className="stage-hint">
        {loading
          ? 'Estado controlado: carregando / revalidando.'
          : 'Estado controlado: disponível.'}{' '}
        Sem requisição ou timer de negócio.
      </p>
    </Demo>
  );
}

const sampleValues = ['1.234,56', '9.876,54', '12,4%', '42'];
export function DataChangeFeedbackDemo({ reduceMotion }: { reduceMotion: boolean }) {
  const [index, setIndex] = useState(0);
  const [renders, setRenders] = useState(0);
  const [formatted, setFormatted] = useState(false);
  const [duration, setDuration] = useState(220);
  const value = sampleValues[index]!;
  const code = `import { DataChangeFeedback } from '@motion-skills-lab/motion-recipes/data-change-feedback';

export function ExactValue() {
  return <DataChangeFeedback value=${JSON.stringify(value)}
    duration={${duration}} reduceMotion={${reduceMotion}} announcement="off"${formatted ? '\n    formatValue={value => String(value) + " unidades"}' : ''} />;
}`;
  return (
    <Demo
      id="data-change-feedback"
      number="11"
      title="Data Change Feedback"
      description="O novo valor aparece imediatamente e sem interpolação. O destaque e o rótulo comunicam a mudança real, inclusive com movimento reduzido."
      duration={duration}
      defaultDuration={220}
      reduced={reduceMotion}
      setDuration={setDuration}
      code={code}
      controls={
        <>
          <ButtonFeedback onClick={() => setIndex((v) => (v + 1) % sampleValues.length)}>
            Alterar valor / replay
          </ButtonFeedback>
          <ButtonFeedback onClick={() => setRenders((v) => v + 1)}>
            Renderizar mesmo valor
          </ButtonFeedback>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formatted}
              onChange={(e) => setFormatted(e.currentTarget.checked)}
            />
            Formatar como unidades
          </label>
        </>
      }
    >
      <DataChangeFeedback
        className="l3-data"
        value={value}
        duration={duration}
        reduceMotion={reduceMotion}
        {...(formatted ? { formatValue: (v: string | number) => String(v) + ' unidades' } : {})}
        announcement="off"
      />
      <p className="stage-hint">
        Valor controlado: {value}. Renderizações sem mudar o dado: {renders}. A formatação pertence
        ao consumidor.
      </p>
    </Demo>
  );
}
