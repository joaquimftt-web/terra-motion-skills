import '@testing-library/jest-dom/vitest';
import { StrictMode, useState } from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AccordionTransition } from './index';

function Example({ reduceMotion = false }: { reduceMotion?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <AccordionTransition
      open={open}
      onOpenChange={setOpen}
      trigger="Detalhes"
      reduceMotion={reduceMotion}
    >
      <p>Conteúdo do consumidor</p>
      <a href="#destination">Próximo passo</a>
    </AccordionTransition>
  );
}

describe('AccordionTransition', () => {
  afterEach(() => vi.unstubAllGlobals());

  it.each([-1, Number.NaN, Number.POSITIVE_INFINITY])('rejects invalid duration %s', (duration) => {
    expect(() =>
      render(
        <AccordionTransition open onOpenChange={() => {}} trigger="Inválido" duration={duration}>
          Conteúdo
        </AccordionTransition>,
      ),
    ).toThrow(RangeError);
  });

  it('subscribes to preference changes and cleans up its listener', () => {
    let reduced = false;
    const listeners = new Set<() => void>();
    vi.stubGlobal('matchMedia', () => ({
      get matches() {
        return reduced;
      },
      addEventListener: (_name: string, listener: () => void) => listeners.add(listener),
      removeEventListener: (_name: string, listener: () => void) => listeners.delete(listener),
    }));
    const view = render(
      <StrictMode>
        <AccordionTransition open onOpenChange={() => {}} trigger="Preferência">
          Texto
        </AccordionTransition>
      </StrictMode>,
    );
    expect(screen.getByRole('region')).toHaveAttribute('data-reduce-motion', 'false');
    act(() => {
      reduced = true;
      listeners.forEach((listener) => listener());
    });
    expect(screen.getByRole('region')).toHaveAttribute('data-reduce-motion', 'true');
    view.unmount();
    expect(listeners.size).toBe(0);
  });
  it('associates a native trigger with a closed, inert panel', () => {
    render(<Example />);
    const trigger = screen.getByRole('button', { name: 'Detalhes' });
    const panel = document.getElementById(trigger.getAttribute('aria-controls')!);
    expect(trigger).toHaveAttribute('type', 'button');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(panel).toHaveAttribute('aria-labelledby', trigger.id);
    expect(panel).toHaveAttribute('aria-hidden', 'true');
    expect(panel).toHaveAttribute('inert');
    expect(screen.queryByRole('link', { name: 'Próximo passo' })).toBeNull();
  });

  it('opens with Enter and closes with Space while retaining consumer content', async () => {
    const user = userEvent.setup();
    render(<Example />);
    const trigger = screen.getByRole('button', { name: 'Detalhes' });
    await user.tab();
    await user.keyboard('{Enter}');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('region')).not.toHaveAttribute('inert');
    await waitFor(() => expect(screen.getByRole('link', { name: 'Próximo passo' })).toBeVisible());
    await user.keyboard(' ');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('requests changes without owning the controlled state', async () => {
    const change = vi.fn();
    const user = userEvent.setup();
    render(
      <AccordionTransition open={false} onOpenChange={change} trigger="Controlado">
        Real
      </AccordionTransition>,
    );
    await user.click(screen.getByRole('button'));
    expect(change).toHaveBeenCalledWith(true);
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
  });

  it('generates unique associations and supports an explicit base id', () => {
    render(
      <>
        <Example />
        <Example />
        <AccordionTransition id="custom" open onOpenChange={() => {}} trigger="Personalizado">
          Texto
        </AccordionTransition>
      </>,
    );
    const ids = screen.getAllByRole('button').map((el) => el.getAttribute('aria-controls'));
    expect(new Set(ids).size).toBe(3);
    expect(document.getElementById('custom-panel')).toHaveAttribute(
      'aria-labelledby',
      'custom-trigger',
    );
  });

  it('settles rapid reversals under StrictMode and unmounts cleanly', async () => {
    const user = userEvent.setup();
    const view = render(
      <StrictMode>
        <Example />
      </StrictMode>,
    );
    const trigger = screen.getByRole('button');
    await user.click(trigger);
    await user.click(trigger);
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('region')).not.toHaveAttribute('inert');
    view.unmount();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('exposes effective reduction and keeps open content available', () => {
    render(
      <AccordionTransition open reduceMotion onOpenChange={() => {}} trigger="Reduzido">
        Legível
      </AccordionTransition>,
    );
    expect(screen.getByRole('region')).toHaveAttribute('data-reduce-motion', 'true');
    expect(screen.getByRole('region')).toHaveTextContent('Legível');
  });
});
