import { StrictMode, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ScrollReveal } from '@motion-skills-lab/motion-recipes/scroll-reveal';
import { StaggeredEntrance } from '@motion-skills-lab/motion-recipes/staggered-entrance';
import { ScrollProgress } from '@motion-skills-lab/motion-recipes/scroll-progress';
const query = new URLSearchParams(location.search),
  kind = query.get('kind') ?? 'group',
  initial = Number(query.get('n') ?? 6);
const css = document.createElement('style');
css.textContent =
  'body{margin:24px;font:16px/1.5 system-ui}*{box-sizing:border-box}button,input{font:inherit;max-width:100%;min-height:40px}button{margin:4px}nav{position:fixed;top:0;left:0;right:0;padding:4px;background:white;z-index:2}main{max-width:900px;margin:auto;padding-top:110px}.spacer{height:110vh}.tail{height:120vh}ul{margin:0;padding-left:24px;display:grid;gap:12px;grid-template-columns:repeat(2,minmax(0,1fr))}li{min-width:0}article{border:1px solid gray;padding:16px}input{display:block;width:100%}:focus-visible{outline:3px solid #3570ff}@media(max-width:600px){ul{grid-template-columns:minmax(0,1fr)}}';
document.head.append(css);
function App() {
  const [sourceKind, setSourceKind] = useState<'document' | 'container'>('document');
  const [replay, setReplay] = useState(0),
    [duration, setDuration] = useState(800),
    [n, setN] = useState(initial),
    [mounted, setMounted] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null),
    contentRef = useRef<HTMLDivElement>(null),
    sectionRef = useRef<HTMLElement>(null);
  const items = Array.from({ length: n }, (_, i) => ({ id: String(i) }));
  const card = (item: { id: string }) => (
    <article style={query.has('shadow') ? { boxShadow: '0 8px 20px #0008' } : undefined}>
      <h2>Item {item.id}</h2>
      <label>
        Nota {item.id}
        <input defaultValue="" />
      </label>
    </article>
  );
  return (
    <main>
      <h1>Scroll funcional independente</h1>
      <nav aria-label="Experimentos">
        <button onClick={() => setReplay((v) => v + 1)}>Replay</button>
        <button onClick={() => setDuration((v) => (v === 0 ? 800 : 0))}>Duration</button>
        <button onClick={() => setN((v) => (v === 20 ? 1 : 20))}>Items</button>
        <button onClick={() => setMounted((v) => !v)}>Mount</button>
      </nav>
      <button
        type="button"
        onClick={() => setSourceKind((v) => (v === 'document' ? 'container' : 'document'))}
      >
        Source
      </button>
      <ScrollProgress
        data-testid="switchable"
        source={
          sourceKind === 'document'
            ? { type: 'document' }
            : { type: 'container', containerRef, contentRef }
        }
      />
      <ScrollProgress data-testid="doc" />
      <div className="spacer" style={query.has('visible') ? { height: 0 } : undefined} />
      <section ref={sectionRef}>
        <h2>Região observada</h2>
        <ScrollProgress data-testid="section" source={{ type: 'section', targetRef: sectionRef }} />
        <div
          style={
            query.has('clip')
              ? { overflow: 'hidden' }
              : query.has('transform')
                ? { transform: 'translateX(0)' }
                : undefined
          }
        >
          {mounted &&
            (kind === 'group' ? (
              <StaggeredEntrance
                data-testid="target"
                items={items}
                getKey={(item) => item.id}
                renderItem={card}
                duration={duration}
                replayKey={replay}
                once={false}
              />
            ) : (
              <ScrollReveal
                data-testid="target"
                duration={duration}
                replayKey={replay}
                once={false}
              >
                {card({ id: '0' })}
              </ScrollReveal>
            ))}
        </div>
      </section>
      <h2>Container independente</h2>
      <ScrollProgress
        data-testid="container-bar"
        source={{ type: 'container', containerRef, contentRef }}
      />
      <div
        ref={containerRef}
        data-testid="container"
        role="region"
        tabIndex={0}
        aria-label="Container"
        style={{ height: 240, overflowY: 'auto' }}
      >
        <div ref={contentRef} data-testid="content">
          {Array.from({ length: 20 }, (_, i) => (
            <p key={i}>Conteúdo em fluxo {i}</p>
          ))}
        </div>
      </div>
      <div className="tail" />
    </main>
  );
}
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
