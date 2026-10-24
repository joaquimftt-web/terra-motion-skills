import { useState } from 'react';
import { ExpandableCards } from '@motion-skills-lab/motion-recipes/expandable-cards';
import { ButtonFeedback } from '@motion-skills-lab/motion-recipes/button-feedback';
import { DurationControl } from '../../components/DurationControl';
import { CodeExample } from '../../components/CodeExample';
import material from '../../prototype/assets/terra-material-reference.webp';
import './expandable-demo.css';
export function ExpandableCardsDemo({ reduceMotion }: { reduceMotion: boolean }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [duration, setDuration] = useState(280);
  const [staticMode, setStaticMode] = useState(false);
  const items = ['A', 'B', 'C', 'D'].map((id, index) => ({
    id,
    title: 'Card ' + id,
    media: (
      <img
        src={material}
        width="1672"
        height="941"
        alt=""
        style={{ objectPosition: `${25 + index * 20}% center` }}
      />
    ),
    preview: (
      <>
        <p>
          {
            [
              'Matéria e espaço',
              'Identidade preservada',
              'Ritmo e detalhe',
              'Continuidade no fluxo',
            ][index]
          }
        </p>
        <label>
          Nota {id}
          <input aria-label={'Nota ' + id} defaultValue="" />
        </label>
      </>
    ),
    details: (
      <>
        <p>Expansão no próprio fluxo. Sem modal, bloqueio de scroll ou cópia do formulário.</p>
        <label>
          Detalhe {id}
          <input aria-label={'Detalhe ' + id} defaultValue="" />
        </label>
        <a href={`${import.meta.env.BASE_URL}reference/layout-transitions.md`}>Consultar a skill</a>
      </>
    ),
  }));
  const code = `import { useState } from 'react';
import { ExpandableCards } from '@motion-skills-lab/motion-recipes/expandable-cards';

export function Example() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  return <ExpandableCards
    aria-label="Cards expansíveis"
    items={[{ id: 'a', title: 'Card A', preview: 'Resumo', details: 'Detalhes' }]}
    selectedId={selectedId}
    onSelectedIdChange={setSelectedId}
    duration={${duration}}
    reduceMotion={${reduceMotion || staticMode}}
  />;
}
// Composição CSS do consumidor: data-expanded, data-peer e data-lone.
`;
  return (
    <section
      id="expandable-cards"
      className="recipe-section"
      aria-labelledby="expandable-cards-title"
    >
      <div className="section-heading">
        <div className="recipe-title">
          <span className="recipe-number">12</span>
          <div>
            <p className="eyebrow">LAYOUT / EXPANSÃO NO FLUXO · M13</p>
            <h2 id="expandable-cards-title">Expandable Cards</h2>
          </div>
        </div>
        <span className="technology-tag">{reduceMotion || staticMode ? 0 : duration} ms</span>
      </div>
      <p className="section-description">
        Um card expande, seu par conserva espaço. Inputs, foco e ordem DOM permanecem no fluxo
        nativo.
      </p>
      <div className="demo-panel">
        <div className="panel-bar">
          <span>PRÉVIA INTERATIVA</span>
          <span className="state-tag">CONTROLADO</span>
        </div>
        <div className="expandable-stage">
          <ExpandableCards
            className="expandable-grid"
            aria-label="Cards expansíveis"
            items={items}
            selectedId={selectedId}
            onSelectedIdChange={setSelectedId}
            duration={duration}
            reduceMotion={reduceMotion || staticMode}
          />
        </div>
        <div className="lab-settings">
          <p className="lab-control-heading">CONFIGURAÇÕES</p>
          <DurationControl
            id="expandable-cards-duration"
            label="Duração de Expandable Cards"
            value={duration}
            defaultValue={280}
            onChange={setDuration}
            reduceMotion={reduceMotion || staticMode}
          />
          <div className="demo-controls l1-actions">
            {['A', 'B', 'C', 'D'].map((id) => (
              <ButtonFeedback
                key={id}
                type="button"
                aria-pressed={selectedId === id}
                onClick={() => setSelectedId(id)}
              >
                Selecionar {id}
              </ButtonFeedback>
            ))}
            <ButtonFeedback type="button" onClick={() => setSelectedId(null)}>
              Fechar cards
            </ButtonFeedback>
            <label>
              <input
                type="checkbox"
                checked={staticMode}
                onChange={(e) => setStaticMode(e.target.checked)}
              />{' '}
              Fallback estático
            </label>
          </div>
        </div>
      </div>
      <CodeExample code={code} name="Expandable Cards — configuração atual" />
      <div className="foundation-links">
        <a href={`${import.meta.env.BASE_URL}reference/expandable-cards.tsx`}>
          Ver implementação ↗
        </a>
        <a href={`${import.meta.env.BASE_URL}reference/layout-transitions.md`}>
          Ler layout-transitions ↗
        </a>
      </div>
    </section>
  );
}
