import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AsyncStateFeedback, type AsyncFeedbackState } from './AsyncStateFeedback.js';

const messages = {
  idle: 'Pronto',
  pending: 'Salvando',
  success: 'Salvo',
  error: 'Falhou',
  cancelled: 'Cancelado',
};
describe('AsyncStateFeedback', () => {
  it.each<AsyncFeedbackState>(['idle', 'pending', 'success', 'error', 'cancelled'])(
    'shows only the true %s message without a minimum pending delay',
    (state) => {
      render(<AsyncStateFeedback state={state} messages={messages} />);
      const status = screen.getByRole('status');
      expect(status).toHaveTextContent(messages[state]);
      expect(status.textContent).toBe(messages[state]);
      expect(status).toHaveAttribute('aria-live', 'polite');
      expect(status).toHaveAttribute('aria-atomic', 'true');
      expect(status).not.toHaveAttribute('aria-busy');
    },
  );
  it('switches live policy on the same node, without hiding the current text', () => {
    const ref = createRef<HTMLSpanElement>();
    const view = render(<AsyncStateFeedback ref={ref} state="pending" messages={messages} />);
    const node = ref.current;
    view.rerender(
      <AsyncStateFeedback ref={ref} state="success" messages={messages} announcement="off" />,
    );
    expect(ref.current).toBe(node);
    expect(node).toHaveTextContent('Salvo');
    for (const name of ['role', 'aria-live', 'aria-atomic', 'aria-hidden', 'hidden'])
      expect(node).not.toHaveAttribute(name);
    view.rerender(<AsyncStateFeedback ref={ref} state="error" messages={messages} />);
    expect(ref.current).toBe(node);
    expect(screen.getByRole('status')).toHaveTextContent('Falhou');
  });
  it('keeps sizing helpers empty in the DOM when CSS is missing', () => {
    const { container } = render(
      <AsyncStateFeedback state="error" messages={messages} id="feedback" title="Request status" />,
    );
    expect(container.textContent).toBe('Falhou');
    const helpers = container.querySelectorAll('[data-feedback-label]');
    expect(helpers).toHaveLength(5);
    for (const helper of helpers) {
      expect(helper.textContent).toBe('');
      expect(helper).toHaveAttribute('aria-hidden', 'true');
      expect(helper).not.toHaveAttribute('tabindex');
    }
    expect(screen.getByRole('status')).toHaveAttribute('id', 'feedback');
  });
  it('does not reinterpret cancellation, retries or out-of-order props as business truth', () => {
    const view = render(<AsyncStateFeedback state="pending" messages={messages} />);
    for (const state of ['cancelled', 'pending', 'success', 'error'] as const) {
      view.rerender(<AsyncStateFeedback state={state} messages={messages} />);
      expect(screen.getByRole('status').textContent).toBe(messages[state]);
    }
  });
  it.each([-1, NaN, Infinity])('rejects invalid duration %s', (duration) => {
    expect(() =>
      render(<AsyncStateFeedback state="idle" messages={messages} duration={duration} />),
    ).toThrow(RangeError);
  });
  it('rejects invalid state and incomplete or empty labels', () => {
    expect(() =>
      render(<AsyncStateFeedback state={'other' as AsyncFeedbackState} messages={messages} />),
    ).toThrow(RangeError);
    expect(() =>
      render(<AsyncStateFeedback state="idle" messages={{ ...messages, error: '  ' }} />),
    ).toThrow(TypeError);
  });
});
