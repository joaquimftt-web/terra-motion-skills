import { createElement as h, useState } from 'react';
import { LayoutReflow } from '@motion-skills-lab/motion-recipes/layout-reflow';
import { SkeletonToContent } from '@motion-skills-lab/motion-recipes/skeleton-to-content';
import { DataChangeFeedback } from '@motion-skills-lab/motion-recipes/data-change-feedback';

export function LayoutFixture() {
  const [ids, setIds] = useState(['a', 'b', 'c']);
  const [revision, setRevision] = useState(0);
  const [duration, setDuration] = useState(800);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState('R$ 1.234,56');
  const [reduced, setReduced] = useState(false);
  const [mounted, setMounted] = useState(true);
  const [, rerender] = useState(0);
  const change = (next) => {
    setIds(next);
    setRevision((v) => v + 1);
  };
  return h(
    'main',
    { style: { maxWidth: 720, margin: 16, font: '16px/1.5 system-ui' } },
    h('h1', null, 'Layout independente L3'),
    h('button', { onClick: () => change([...ids].reverse()) }, 'Reverse'),
    h(
      'button',
      { onClick: () => change(ids.includes('d') ? ids.filter((v) => v !== 'd') : [...ids, 'd']) },
      'Items',
    ),
    h('button', { onClick: () => setDuration((v) => (v === 0 ? 800 : 0)) }, 'Duration'),
    h('button', { onClick: () => setLoading((v) => !v) }, 'Loading'),
    h(
      'button',
      { onClick: () => setValue((v) => (v === 'R$ 1.234,56' ? 'R$ 9.876,54' : 'R$ 1.234,56')) },
      'Value',
    ),
    h('button', { onClick: () => rerender((v) => v + 1) }, 'Rerender'),
    h('button', { onClick: () => setReduced((v) => !v) }, 'Reduce'),
    h('button', { onClick: () => setMounted((v) => !v) }, 'Mount'),
    mounted &&
      h(LayoutReflow, {
        'aria-label': 'Lista controlada',
        'data-testid': 'reflow',
        reflowKey: revision,
        duration,
        reduceMotion: reduced,
        style: {
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1fr)',
          gap: 12,
          padding: 0,
          listStyle: 'none',
        },
        items: ids.map((id) => ({
          id,
          content: h(
            'article',
            { style: { border: '1px solid gray', padding: 12 } },
            h(
              'label',
              null,
              'Nota ' + id,
              h('input', {
                'aria-label': 'Nota ' + id,
                defaultValue: '',
                style: { maxWidth: '100%' },
              }),
            ),
          ),
        })),
      }),
    mounted &&
      h(
        SkeletonToContent,
        {
          loading,
          duration,
          reduceMotion: reduced,
          minBlockSize: 120,
          'data-testid': 'skeleton',
          skeleton: h('div', null, 'Placeholder', h('button', { type: 'button' }, 'False control')),
        },
        h(
          'label',
          null,
          'Conteúdo real',
          h('input', {
            'aria-label': 'Loaded input',
            defaultValue: 'real',
            style: { maxWidth: '100%' },
          }),
        ),
      ),
    mounted &&
      h(DataChangeFeedback, { 'data-testid': 'value', value, duration, reduceMotion: reduced }),
  );
}
