import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('showcase', () => {
  it('provides real anchor navigation and recipe source links', () => {
    render(<App />);
    expect(screen.getByRole('link', { name: 'Terra Motion Skills início' })).toHaveTextContent(
      'TerraMotion Skills',
    );
    expect(screen.getByRole('navigation', { name: 'Receitas' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /01.*Button Feedback/ })).toHaveAttribute(
      'href',
      '#button-feedback',
    );
    expect(screen.getByRole('link', { name: /02.*Accordion Transition/ })).toHaveAttribute(
      'href',
      '#accordion-transition',
    );
    expect(screen.getByRole('heading', { name: 'Button Feedback' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Accordion Transition' })).toBeInTheDocument();
  });

  it('connects button activation and disabled controls to the real recipe', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Confirmar interação' }));
    expect(screen.getByText('1 ativação nesta sessão')).toBeInTheDocument();
    await user.click(screen.getByLabelText('Desabilitar botão'));
    expect(screen.getByRole('button', { name: 'Confirmar interação' })).toBeDisabled();
  });

  it('connects duration and additional reduction to the disclosure demo', async () => {
    const user = userEvent.setup();
    render(<App />);
    expect(screen.getByLabelText('Duração do Accordion')).toHaveValue('180');
    await user.click(screen.getByLabelText('Reduzir movimento nas demonstrações'));
    expect(screen.getByRole('region', { name: 'O que torna uma transição útil?' })).toHaveAttribute(
      'data-reduce-motion',
      'true',
    );
  });
});
