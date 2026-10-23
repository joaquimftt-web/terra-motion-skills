import { ScrollReveal } from '@motion-skills-lab/motion-recipes/scroll-reveal';
import { StaggeredEntrance } from '@motion-skills-lab/motion-recipes/staggered-entrance';
import { ScrollProgress } from '@motion-skills-lab/motion-recipes/scroll-progress';
import React, { useRef, useState, StrictMode } from 'react';
import { PresenceTransition } from '@motion-skills-lab/motion-recipes/presence-transition';
import { AsyncStateFeedback } from '@motion-skills-lab/motion-recipes/async-state-feedback';
import { NavigationIndicator } from '@motion-skills-lab/motion-recipes/navigation-indicator';
export const messages = {
  idle: 'Ready',
  pending: 'Aguarde a conclusão da operação em andamento, sem interromper sua leitura.',
  success: 'Concluído com sucesso',
  error: 'Não foi possível concluir; verifique a conexão e tente novamente.',
  cancelled: 'Cancelado pelo usuário',
};
const items = [
  { id: 'a', href: '#a', label: 'Overview' },
  { id: 'b', href: '#b', label: 'Detalhes e configurações' },
  { id: 'c', href: '#c', label: 'Examples' },
];
export function App() {
  const [present, setPresent] = useState(true),
    [duration, setDuration] = useState(600),
    [state, setState] = useState('idle'),
    [value, setValue] = useState('a'),
    [mounted, setMounted] = useState(true),
    [done, setDone] = useState(0),
    [off, setOff] = useState(false),
    [invalid, setInvalid] = useState(false);
  const target = useRef(null),
    root = useRef(null);
  return React.createElement(
    StrictMode,
    null,
    React.createElement(
      'main',
      null,
      React.createElement('h1', null, 'Independent L1 consumer'),
      React.createElement(
        'button',
        { ref: target, onClick: () => setPresent((v) => !v) },
        'Toggle',
      ),
      React.createElement('button', { onClick: () => setInvalid((v) => !v) }, 'Invalid target'),
      React.createElement('button', { onClick: () => setMounted((v) => !v) }, 'Mount'),
      React.createElement('button', { onClick: () => setDuration(0) }, 'Zero duration'),
      React.createElement('button', { onClick: () => setDuration(120) }, 'Short duration'),
      mounted &&
        React.createElement(
          PresenceTransition,
          {
            present,
            duration,
            returnFocusRef: invalid ? undefined : target,
            ref: root,
            onExitComplete: () => {
              if (root.current) throw Error('Callback before removal');
              setDone((n) => n + 1);
            },
          },
          React.createElement('input', {
            'aria-label': 'Preserved note',
            defaultValue: 'SSR input',
          }),
          React.createElement('button', { onClick: () => setPresent(false) }, 'Dismiss'),
        ),
      React.createElement('p', { id: 'done' }, 'Exits: ' + done),
      React.createElement('button', { onClick: () => setOff((v) => !v) }, 'Announcement'),
      ...Object.keys(messages).map((key) =>
        React.createElement('button', { key, onClick: () => setState(key) }, key),
      ),
      React.createElement(AsyncStateFeedback, {
        state,
        messages,
        announcement: off ? 'off' : 'polite',
      }),
      ...items.map((item) =>
        React.createElement(
          'button',
          { key: item.id, onClick: () => setValue(item.id) },
          'Select ' + item.id,
        ),
      ),
      React.createElement(NavigationIndicator, {
        'aria-label': 'Independent navigation',
        items,
        value,
        duration,
      }),
      React.createElement(
        ScrollReveal,
        { 'data-testid': 'independent-reveal' },
        React.createElement('p', null, 'Reveal SSR legível'),
      ),
      React.createElement(StaggeredEntrance, {
        'data-testid': 'independent-group',
        items,
        getKey: (item) => item.id,
        renderItem: (item) =>
          React.createElement('input', {
            'aria-label': 'Independent group ' + item.id,
            defaultValue: item.label,
          }),
      }),
      React.createElement(ScrollProgress, { 'data-testid': 'independent-progress' }),
      ...items.map((item) =>
        React.createElement(
          'section',
          { key: item.id, id: item.id },
          React.createElement('h2', null, item.label),
          React.createElement('p', null, 'A real destination, not a tab.'),
        ),
      ),
    ),
  );
}
