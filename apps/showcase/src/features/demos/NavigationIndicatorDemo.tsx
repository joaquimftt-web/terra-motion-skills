import { motionTokens } from '@motion-skills-lab/motion-tokens';
import { DurationControl } from '../../components/DurationControl';
import { useMemo, useState, useSyncExternalStore } from 'react';
import { NavigationIndicator } from '@motion-skills-lab/motion-recipes/navigation-indicator';
import { ButtonFeedback } from '@motion-skills-lab/motion-recipes/button-feedback';
import { CodeExample } from '../../components/CodeExample';

const destinations = ['overview', 'details', 'examples'] as const;
type Destination = (typeof destinations)[number];
function hashSnapshot() {
  return window.location.hash;
}
function subscribeHash(notify: () => void) {
  window.addEventListener('hashchange', notify);
  window.addEventListener('popstate', notify);
  notify();
  return () => {
    window.removeEventListener('hashchange', notify);
    window.removeEventListener('popstate', notify);
  };
}
function serverHash() {
  return '';
}

export function NavigationIndicatorDemo({ reduceMotion }: { reduceMotion: boolean }) {
  const hash = useSyncExternalStore(subscribeHash, hashSnapshot, serverHash);
  const selected = destinations.find((id) => hash === `#m05-demo-${id}`) ?? null;
  const [duration, setDuration] = useState<number>(motionTokens.duration.navigationIndicator),
    [width, setWidth] = useState(420);
  const [long, setLong] = useState(false),
    [focus, setFocus] = useState('fora dos links');
  // Focus, hash and duration updates keep the same measurement targets.
  const items = useMemo(() => {
    const labels = long
      ? [
          'Visão geral com informações complementares',
          'Detalhes da navegação e da seleção controlada',
          'Exemplos de consumo independente no projeto',
        ]
      : ['Visão geral', 'Detalhes', 'Exemplos'];
    return destinations.map((id, index) => ({
      id,
      href: `#m05-demo-${id}`,
      label: labels[index]!,
    }));
  }, [long]);
  const labels = items.map((item) => item.label);
  function navigate(id: string) {
    window.location.hash = id ? `m05-demo-${id}` : 'navigation-indicator';
  }
  const code = `import { useSyncExternalStore } from 'react';
import { NavigationIndicator } from '@motion-skills-lab/motion-recipes/navigation-indicator';
import '@motion-skills-lab/motion-recipes/navigation-indicator.css';

function subscribe(notify: () => void) {
  addEventListener('hashchange', notify); addEventListener('popstate', notify);
  return () => { removeEventListener('hashchange', notify); removeEventListener('popstate', notify); };
}
const snapshot = () => location.hash;
const serverSnapshot = () => '';
const items = ${JSON.stringify(items, null, 2)};
export function SectionNavigation() {
  const hash = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const value = items.find(item => item.href === hash)?.id ?? null;
  return <>
    <NavigationIndicator aria-label="Nesta página" items={items} value={value}
      currentType="location" duration={${duration}} reduceMotion={${reduceMotion}} />
    {items.map(item => <section key={item.id} id={item.href.slice(1)}>
      <h2>{item.label}</h2><p>Seu conteúdo real.</p>
    </section>)}
  </>;
}`;
  return (
    <section
      id="navigation-indicator"
      className="recipe-section"
      aria-labelledby="navigation-title"
    >
      <div className="section-heading">
        <div className="recipe-title">
          <span className="recipe-number">05</span>
          <div>
            <p className="eyebrow">SELEÇÃO / LINKS NATIVOS</p>
            <h2 id="navigation-title">Navigation Indicator</h2>
          </div>
        </div>
        <span className="technology-tag">MOTION · LTR</span>
      </div>
      <p className="section-description">
        A linha acompanha a localização selecionada; o foco continua independente. Os destinos
        existem e o histórico do navegador funciona.
      </p>
      <div className="demo-layout">
        <div className="demo-panel">
          <div className="panel-bar">
            <span>LINKS, NÃO TABS</span>
            <span className="state-tag">{selected ?? 'SEM SELEÇÃO'}</span>
          </div>
          <div className="l1-stage">
            <div style={{ width, maxWidth: '100%', minWidth: 0 }}>
              <NavigationIndicator
                aria-label="Destinos da demonstração"
                items={items}
                value={selected}
                currentType="location"
                duration={duration}
                reduceMotion={reduceMotion}
                onFocusCapture={(event) => {
                  if (event.target instanceof HTMLAnchorElement)
                    setFocus(event.target.textContent ?? 'link');
                }}
                onBlurCapture={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget as Node | null))
                    setFocus('fora dos links');
                }}
              />
            </div>
            <p className="l1-observation">
              Selecionado: {selected ?? 'nenhum'}. Foco: {focus}.
            </p>
            <div className="l1-destinations">
              {items.map((item) => (
                <section key={item.id} id={item.href.slice(1)} tabIndex={-1}>
                  <h3>{item.label}</h3>
                  <p>
                    Destino real da demonstração. Links continuam nativos, sem troca de painéis ou
                    roteador.
                  </p>
                </section>
              ))}
            </div>
          </div>
          <div className="lab-settings">
            <p className="lab-control-heading">CONFIGURAÇÕES</p>
            <label className="l1-field">
              Destino da demonstração
              <select value={selected ?? ''} onChange={(e) => navigate(e.currentTarget.value)}>
                <option value="">Nenhuma seleção</option>
                {destinations.map((id, index) => (
                  <option key={id} value={id}>
                    {labels[index]}
                  </option>
                ))}
              </select>
            </label>
            <DurationControl
              id="navigation-duration"
              label="Duração do indicador"
              value={duration}
              defaultValue={motionTokens.duration.navigationIndicator}
              onChange={setDuration}
              reduceMotion={reduceMotion}
            />
            <label className="l1-field">
              Largura da navegação
              <input
                type="range"
                min="180"
                max="640"
                step="20"
                value={width}
                onChange={(e) => setWidth(e.currentTarget.valueAsNumber)}
              />
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={long}
                onChange={(e) => setLong(e.currentTarget.checked)}
              />
              Rótulos longos
            </label>
            <div className="demo-controls l1-actions">
              <ButtonFeedback
                type="button"
                onClick={() =>
                  navigate(
                    destinations[
                      (destinations.indexOf(selected as Destination) + 1) % destinations.length
                    ]!,
                  )
                }
              >
                Próximo destino / replay
              </ButtonFeedback>
              <ButtonFeedback type="button" onClick={() => navigate('')}>
                Reiniciar navegação
              </ButtonFeedback>
            </div>
            <p className="stage-hint">
              Replay manual: um trecho por clique, no máximo uma entrada de histórico. Nenhuma
              sequência automática altera o histórico por você.
            </p>
          </div>
        </div>
        <CodeExample code={code} name="Navigation Indicator" />
      </div>
      <div className="recipe-notes">
        <p>
          <strong>Use para</strong> localização em links horizontais LTR. <strong>Evite</strong>{' '}
          tabs, filtros e menus de setas. Sem geometria/ResizeObserver, a seleção estática
          permanece.
        </p>
        <a href={`${import.meta.env.BASE_URL}reference/navigation-indicator.tsx`}>
          Código da receita ↗
        </a>
      </div>
    </section>
  );
}
