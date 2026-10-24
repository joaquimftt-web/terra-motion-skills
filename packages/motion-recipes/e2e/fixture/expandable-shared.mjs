import { createElement as h, useState, useId } from 'react';
import { ExpandableCards } from '@motion-skills-lab/motion-recipes/expandable-cards';
function Note({ label }) {
  const htmlId = useId();
  return h(
    'label',
    { htmlFor: htmlId },
    label,
    h('input', { id: htmlId, 'aria-label': label, defaultValue: '' }),
  );
}
export function ExpandableFixture({ initial = 'B' } = {}) {
  const afterId = useId();
  const [ids, setIds] = useState(['A', 'B', 'C', 'D']);
  const [selected, setSelected] = useState(initial);
  const [duration, setDuration] = useState(280);
  const [reduced, setReduced] = useState(false);
  const [image, setImage] = useState(false);
  const items = ids.map((id) => ({
    id,
    title: 'Card ' + id,
    media: h('img', {
      width: 600,
      height: 200,
      alt: '',
      src: image
        ? '/late.svg'
        : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='200'%3E%3Crect width='600' height='200' fill='%23616d61'/%3E%3C/svg%3E",
    }),
    preview: h(Note, { label: 'Preview ' + id }),
    details: h(
      'div',
      null,
      h('p', null, 'Details remain in the same flow and DOM.'),
      h(Note, { label: 'Detail ' + id }),
      h('a', { href: '#' + afterId }, 'Continue'),
    ),
  }));
  const choose = (id) => {
    setSelected(id);
  };
  return h(
    'main',
    null,
    h('h1', null, 'Expandable Cards independent'),
    h(
      'div',
      { className: 'controls' },
      ...['A', 'B', 'C', 'D', null].map((id) =>
        h('button', { key: id ?? 'none', onClick: () => choose(id) }, 'Select ' + (id ?? 'none')),
      ),
      h(
        'button',
        {
          onClick: () => {
            setIds((v) => v.filter((x) => x !== selected));
            setSelected(null);
          },
        },
        'Remove selected',
      ),
      h(
        'button',
        {
          onClick: () => {
            setIds([]);
            setSelected(null);
          },
        },
        'Empty',
      ),
      h('button', { onClick: () => setReduced((v) => !v) }, 'Reduce'),
      h('button', { onClick: () => setImage(true) }, 'Late image'),
      h(
        'label',
        null,
        'Duration',
        h('input', {
          type: 'range',
          min: 0,
          max: 800,
          step: 10,
          value: duration,
          onChange: (e) => setDuration(Number(e.target.value)),
        }),
      ),
    ),
    h('h2', null, 'In-flow collection'),
    h(ExpandableCards, {
      className: 'cards',
      'aria-label': 'Independent cards',
      items,
      selectedId: selected,
      onSelectedIdChange: choose,
      duration,
      reduceMotion: reduced,
    }),
    h('a', { id: afterId, href: '#' }, 'After collection'),
  );
}
