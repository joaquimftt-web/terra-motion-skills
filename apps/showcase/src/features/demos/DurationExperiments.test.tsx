import { fireEvent, render, screen, act } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ButtonFeedbackDemo } from './ButtonFeedbackDemo';
import { AccordionTransitionDemo } from './AccordionTransitionDemo';
import { PresenceTransitionDemo } from './PresenceTransitionDemo';
import { AsyncStateFeedbackDemo } from './AsyncStateFeedbackDemo';
import { NavigationIndicatorDemo } from './NavigationIndicatorDemo';
const cases = [
  {
    name: 'Button Feedback',
    Demo: ButtonFeedbackDemo,
    label: 'Duração do Button Feedback',
    initial: 140,
  },
  {
    name: 'Accordion Transition',
    Demo: AccordionTransitionDemo,
    label: 'Duração do Accordion',
    initial: 180,
  },
  {
    name: 'Presence Transition',
    Demo: PresenceTransitionDemo,
    label: 'Duração da presença',
    initial: 180,
  },
  {
    name: 'Async State Feedback',
    Demo: AsyncStateFeedbackDemo,
    label: 'Duração do feedback',
    initial: 160,
  },
  {
    name: 'Navigation Indicator',
    Demo: NavigationIndicatorDemo,
    label: 'Duração do indicador',
    initial: 180,
  },
];
afterEach(() => vi.useRealTimers());
describe('real laboratory duration experiments', () => {
  for (const { name, Demo, label, initial } of cases)
    it(`${name} exposes real defaults, zero/high values, visible ms, code and restore`, () => {
      const { container } = render(<Demo reduceMotion={false} />);
      const input = screen.getByRole('slider', { name: label });
      expect(input).toHaveAttribute('min', '0');
      expect(input).toHaveAttribute('max', '800');
      expect(input).toHaveAttribute('step', '10');
      expect(input).toHaveValue(String(initial));
      const control = input.closest('.duration-control')!;
      expect(control.querySelector('output')).toHaveTextContent(`${initial} ms`);
      for (const value of [0, 800, 210]) {
        fireEvent.change(input, { target: { value } });
        expect(control.querySelector('output')).toHaveTextContent(`${value} ms`);
        const code = container.querySelector('pre')!.textContent;
        expect(code).toContain(name === 'Button Feedback' ? `${value}ms` : `duration={${value}}`);
      }
      if (name === 'Button Feedback')
        expect(
          screen
            .getByRole('button', { name: 'Confirmar interação' })
            .style.getPropertyValue('--msl-motion-duration-button-feedback'),
        ).toBe('210ms');
      fireEvent.click(screen.getByRole('button', { name: `Restaurar padrão (${initial} ms)` }));
      expect(input).toHaveValue(String(initial));
    });
  it('cancels a pending Accordion demo replay when duration changes instead of firing the old timer', () => {
    vi.useFakeTimers();
    render(<AccordionTransitionDemo reduceMotion={false} />);
    fireEvent.change(screen.getByRole('slider', { name: 'Duração do Accordion' }), {
      target: { value: 800 },
    });
    fireEvent.click(screen.getByRole('button', { name: /Repetir transição/ }));
    fireEvent.change(screen.getByRole('slider', { name: 'Duração do Accordion' }), {
      target: { value: 0 },
    });
    act(() => vi.advanceTimersByTime(1000));
    expect(screen.getByRole('button', { name: 'O que torna uma transição útil?' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    expect(screen.getByText('Repetições: 0')).toBeInTheDocument();
  });
});
