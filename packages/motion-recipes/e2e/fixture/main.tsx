import { StrictMode, useState } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { ScrollReveal } from '@motion-skills-lab/motion-recipes/scroll-reveal';
import { Fixture } from './shared';

const css = document.createElement('style');
css.textContent =
  'body{margin:24px;font:16px/1.6 system-ui}button,input{font:inherit;max-width:100%;box-sizing:border-box}button{margin:4px;padding:8px}a:focus-visible,button:focus-visible,input:focus-visible{outline:3px solid blue;outline-offset:3px}.toolbar{position:fixed;top:0;left:0;right:0;background:white;border-bottom:1px solid black;z-index:2;padding:8px}.toolbar button{font-size:14px;padding:4px}main{padding-top:110px;max-width:900px;margin:auto}.spacer{height:110vh}.tail{height:120vh}article{border:1px solid black;padding:20px;overflow-wrap:anywhere}input{width:100%}';
document.head.append(css);
const mode = new URLSearchParams(location.search);
if (mode.has('near')) css.textContent += '.spacer{height:0}';
if (mode.has('clipped')) css.textContent += 'main{overflow:hidden}';
if (mode.has('pseudo'))
  css.textContent += 'article::before{content:"";position:fixed;inset:0;pointer-events:none}';

function App() {
  const [replay, setReplay] = useState(0);
  const [mounted, setMounted] = useState(true);
  const [duration, setDuration] = useState(260);
  const [forced, setForced] = useState(false);
  const [content, setContent] = useState('Conteúdo independente, sem estilos do showcase.');
  return (
    <>
      <nav className="toolbar" aria-label="Controles de teste">
        <button onClick={() => setReplay((n) => n + 1)}>Replay</button>
        <button onClick={() => setMounted((value) => !value)}>Mount</button>
        <button onClick={() => setDuration((value) => (value === 260 ? 1000 : 260))}>
          Duration
        </button>
        <button onClick={() => setForced((value) => !value)}>Reduce</button>
        <button onClick={() => setContent((value) => value + ' Atualização.')}>Content</button>
      </nav>
      <Fixture
        header={
          <ScrollReveal data-testid="initial">
            <h1>Scroll Reveal</h1>
            <p>Entrada, replay e interrupção em consumidor independente.</p>
          </ScrollReveal>
        }
        target={
          mounted ? (
            <ScrollReveal
              data-testid="target"
              replayKey={replay}
              duration={duration}
              reduceMotion={forced}
              once={false}
              onFocusCapture={(event) => {
                event.currentTarget.dataset.focusTransform = getComputedStyle(
                  event.currentTarget.firstElementChild!,
                ).transform;
              }}
              onPointerDownCapture={(event) => {
                event.currentTarget.dataset.pointerTransform = getComputedStyle(
                  event.currentTarget.firstElementChild!,
                ).transform;
              }}
            >
              <article>
                <h2>Informação ao chegar</h2>
                <p>{content}</p>
                <label>
                  Estado preservado
                  <input defaultValue="Original" />
                </label>
                <p>
                  <a href="#end">Continuar leitura</a>
                </p>
              </article>
            </ScrollReveal>
          ) : (
            <p>Desmontado</p>
          )
        }
      />
    </>
  );
}
const root = document.getElementById('root')!;
if (root.hasChildNodes())
  hydrateRoot(
    root,
    <StrictMode>
      <App />
    </StrictMode>,
  );
else
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
