import { useRef, useState } from 'react';
import { ScrollReveal } from '@motion-skills-lab/motion-recipes/scroll-reveal';
import { StaggeredEntrance } from '@motion-skills-lab/motion-recipes/staggered-entrance';
import { ScrollProgress } from '@motion-skills-lab/motion-recipes/scroll-progress';
import { ButtonFeedback } from '@motion-skills-lab/motion-recipes/button-feedback';
import { DurationControl } from '../../components/DurationControl';
import { CodeExample } from '../../components/CodeExample';
import './scroll-functional.css';

function EntranceDemo({ group, reduceMotion }: { group: boolean; reduceMotion: boolean }) {
  const name = group ? 'Staggered Entrance' : 'Scroll Reveal',
    id = group ? 'staggered-entrance' : 'scroll-reveal';
  const [duration, setDuration] = useState(260),
    [stagger, setStagger] = useState(50),
    [replay, setReplay] = useState(0),
    [count, setCount] = useState(6),
    [shadow, setShadow] = useState(false);
  const items = Array.from({ length: count }, (_, index) => ({ id: String(index) }));
  const card = (item: { id: string }) => (
    <article className={`scroll-card${shadow ? ' scroll-card--unsafe' : ''}`}>
      <h3>Informação {Number(item.id) + 1}</h3>
      <p>Entrada curta, texto opaco e nenhuma espera para interagir.</p>
      <label className="l1-field">
        Nota {name} {item.id}
        <input className="l1-input" defaultValue="" />
      </label>
    </article>
  );
  const code = group
    ? `import { useState } from 'react';
import { StaggeredEntrance } from '@motion-skills-lab/motion-recipes/staggered-entrance';
const items = Array.from({length: ${count}}, (_,i) => ({id: String(i)}));
export function Example() {
  const [replay,setReplay] = useState(0);
  return <>
    <button type="button" onClick={() => setReplay(v => v+1)}>Repetir</button>
    <StaggeredEntrance items={items} getKey={item => item.id}
      duration={${duration}} stagger={${stagger}} replayKey={replay}
      reduceMotion={${reduceMotion}}
      renderItem={item => <article style={${shadow ? "{boxShadow:'0 8px 20px #0008'}" : 'undefined'}}>
        <h3>Informação {Number(item.id)+1}</h3>
        <p>Entrada curta, texto opaco e nenhuma espera para interagir.</p>
        <label>Nota Staggered Entrance {item.id}<input defaultValue="" /></label>
      </article>} />
  </>;
}
// delays: min(i * ${stagger}, 200) ms. Sombra exige fallback estático: ${shadow}.`
    : `import { useState } from 'react';
import { ScrollReveal } from '@motion-skills-lab/motion-recipes/scroll-reveal';
export function Example() {
  const [replay,setReplay] = useState(0);
  return <>
    <button type="button" onClick={() => setReplay(v => v+1)}>Repetir</button>
    <ScrollReveal duration={${duration}} replayKey={replay} reduceMotion={${reduceMotion}}>
      <article style={${shadow ? "{boxShadow:'0 8px 20px #0008'}" : 'undefined'}}>
        <h3>Informação 1</h3>
        <p>Entrada curta, texto opaco e nenhuma espera para interagir.</p>
        <label>Nota Scroll Reveal 0<input defaultValue="" /></label>
      </article>
    </ScrollReveal>
  </>;
}
// Sombra exige fallback estático: ${shadow}.`;

  return (
    <section id={id} className="recipe-section scroll-demo" aria-labelledby={`${id}-title`}>
      <div className="section-heading">
        <div className="recipe-title">
          <span className="recipe-number">{group ? '07' : '06'}</span>
          <div>
            <p className="eyebrow">SCROLL / {group ? 'COORDENAÇÃO LIMITADA' : 'ENTRADA SEGURA'}</p>
            <h2 id={`${id}-title`}>{name}</h2>
          </div>
        </div>
        <span className="technology-tag">DEMO · {duration} ms</span>
      </div>
      <p className="section-description">
        {group
          ? 'Um único gatilho para o grupo. O atraso de cada item para em 200 ms; a cauda entra simultaneamente.'
          : 'Preparação apenas abaixo da viewport. Se o conteúdo já estiver visível ou a geometria for incerta, permanece estático.'}
      </p>
      <div className="demo-layout">
        <div className="demo-panel">
          <div className="panel-bar">
            <span>PRÉVIA REAL / SCROLL NATIVO</span>
          </div>
          <div className="l1-stage">
            <DurationControl
              id={`${id}-duration`}
              label={`Duração ${name}`}
              value={duration}
              defaultValue={260}
              onChange={setDuration}
              reduceMotion={reduceMotion}
            />
            {group && (
              <>
                <label htmlFor="stagger-interval">
                  Intervalo entre itens: <output htmlFor="stagger-interval">{stagger} ms</output>
                </label>
                <input
                  id="stagger-interval"
                  type="range"
                  min={0}
                  max={200}
                  step={10}
                  value={stagger}
                  onChange={(e) => setStagger(e.currentTarget.valueAsNumber)}
                />
                <label className="l1-field">
                  Quantidade no grupo
                  <select value={count} onChange={(e) => setCount(Number(e.target.value))}>
                    {[1, 6, 20].map((n) => (
                      <option key={n} value={n}>
                        {n} itens
                      </option>
                    ))}
                  </select>
                </label>
                <p className="l1-observation">
                  Atrasos: {items.map((_, i) => Math.min(i * stagger, 200)).join(' / ')} ms. Total
                  máximo:{' '}
                  {duration === 0 ? 0 : duration + Math.min(Math.max(count - 1, 0) * stagger, 200)}{' '}
                  ms.
                </p>
              </>
            )}
            <label>
              <input
                type="checkbox"
                checked={shadow}
                onChange={(e) => setShadow(e.currentTarget.checked)}
              />{' '}
              Testar sombra no conteúdo (fallback estático)
            </label>
            <div className="l1-actions">
              <ButtonFeedback type="button" onClick={() => setReplay((v) => v + 1)}>
                Repetir {name}
              </ButtonFeedback>
            </div>
            <p className="l1-observation">
              Replay preserva as notas. Foco, toque e redução encerram o movimento. Trocar
              quantidade cancela o grupo. Sombra, recorte ou ancestral transformado podem impedir a
              preparação: isso é fallback seguro, não erro.
            </p>
            {group ? (
              <StaggeredEntrance
                data-testid="stagger-demo-target"
                className="scroll-group"
                items={items}
                getKey={(item) => item.id}
                duration={duration}
                stagger={stagger}
                replayKey={replay}
                reduceMotion={reduceMotion}
                renderItem={card}
              />
            ) : (
              <ScrollReveal
                data-testid="reveal-demo-target"
                duration={duration}
                replayKey={replay}
                reduceMotion={reduceMotion}
              >
                {card({ id: '0' })}
              </ScrollReveal>
            )}
          </div>
        </div>
        <CodeExample name={name} code={code} />
      </div>
      <a className="recipe-source" href={`${import.meta.env.BASE_URL}reference/${id}.tsx`}>
        Consultar fonte ↗
      </a>
    </section>
  );
}
export function ScrollRevealDemo({ reduceMotion }: { reduceMotion: boolean }) {
  return <EntranceDemo group={false} reduceMotion={reduceMotion} />;
}
export function StaggeredEntranceDemo({ reduceMotion }: { reduceMotion: boolean }) {
  return <EntranceDemo group reduceMotion={reduceMotion} />;
}

export function ScrollProgressDemo() {
  const containerRef = useRef<HTMLDivElement>(null),
    contentRef = useRef<HTMLDivElement>(null),
    sectionRef = useRef<HTMLElement>(null);
  const [count, setCount] = useState(12),
    [height, setHeight] = useState(240);
  const code = `import { useRef } from 'react';
import { ScrollProgress } from '@motion-skills-lab/motion-recipes/scroll-progress';

function Example() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  return <section ref={sectionRef}>
    <ScrollProgress /> {/* documento */}
    <ScrollProgress source={{ type: 'section', targetRef: sectionRef }} />
    <ScrollProgress source={{ type: 'container', containerRef, contentRef }} />
    <div ref={containerRef} role="region" aria-label="Exemplo rolável" tabIndex={0}
      style={{ maxHeight: ${height}, overflowY: 'auto' }}>
      <div ref={contentRef}>{Array.from({length: ${count}}, (_,i) => <p key={i}>Linha {i+1}</p>)}</div>
    </div>
  </section>;
}`;
  return (
    <section
      id="scroll-progress"
      ref={sectionRef}
      className="recipe-section scroll-demo"
      aria-labelledby="scroll-progress-title"
    >
      <div className="section-heading">
        <div className="recipe-title">
          <span className="recipe-number">08</span>
          <div>
            <p className="eyebrow">SCROLL / POSIÇÃO REAL</p>
            <h2 id="scroll-progress-title">Scroll Progress</h2>
          </div>
        </div>
        <span className="technology-tag">SEM DURAÇÃO TEMPORAL</span>
      </div>
      <p className="section-description">
        A barra acompanha a posição da rolagem; não comprova leitura. Sem spring, replay artificial
        ou anúncios a cada pixel.
      </p>
      <div className="demo-layout">
        <div className="demo-panel">
          <div className="panel-bar">
            <span>DOCUMENTO / SEÇÃO / CONTAINER</span>
          </div>
          <div className="l1-stage">
            <p>Documento completo</p>
            <ScrollProgress className="scroll-progress-bar" data-testid="progress-document" />
            <p>Passagem desta seção pela viewport</p>
            <ScrollProgress
              className="scroll-progress-bar"
              data-testid="progress-section"
              source={{ type: 'section', targetRef: sectionRef }}
            />
            <p>Posição no container abaixo</p>
            <ScrollProgress
              className="scroll-progress-bar"
              data-testid="progress-container"
              source={{ type: 'container', containerRef, contentRef }}
            />
            <div className="l1-actions">
              <ButtonFeedback type="button" onClick={() => setCount((n) => n + 8)}>
                Adicionar conteúdo
              </ButtonFeedback>
              <ButtonFeedback type="button" onClick={() => setCount(1)}>
                Testar sem rolagem
              </ButtonFeedback>
              <ButtonFeedback type="button" onClick={() => setCount(12)}>
                Restaurar conteúdo
              </ButtonFeedback>
            </div>
            <label className="l1-field">
              Altura do container
              <select value={height} onChange={(e) => setHeight(Number(e.target.value))}>
                {[160, 240, 400].map((n) => (
                  <option key={n} value={n}>
                    {n} px
                  </option>
                ))}
              </select>
            </label>
            <div
              ref={containerRef}
              data-testid="progress-viewport"
              className="scroll-progress-viewport"
              tabIndex={0}
              role="region"
              aria-label="Exemplo rolável"
              style={{ maxHeight: height, overflowY: 'auto' }}
            >
              <div ref={contentRef}>
                {Array.from({ length: count }, (_, i) => (
                  <p key={i}>Linha {i + 1} — role com teclado, toque ou ponteiro.</p>
                ))}
              </div>
            </div>
            <p className="l1-observation">
              O contentRef observa o crescimento do conteúdo em fluxo normal. Sem faixa rolável, a
              barra fica inativa. A redução preserva essa informação direta, sem acrescentar
              movimento decorativo.
            </p>
          </div>
        </div>
        <CodeExample name="Scroll Progress" code={code} />
      </div>
      <a
        className="recipe-source"
        href={`${import.meta.env.BASE_URL}reference/scroll-progress.tsx`}
      >
        Consultar fonte ↗
      </a>
    </section>
  );
}
