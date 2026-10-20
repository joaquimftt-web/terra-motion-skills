import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { createRef } from 'react';
import { ButtonFeedback } from './index';

import './button-feedback.css';

describe('ButtonFeedback', () => {
  it('renders a native button and forwards consumer props, content, and className', () => {
    const onClick = vi.fn();
    render(
      <ButtonFeedback
        type="submit"
        aria-label="Salvar alterações"
        data-purpose="save"
        className="consumer-button"
        onClick={onClick}
      >
        Salvar
      </ButtonFeedback>,
    );

    const button = screen.getByRole('button', { name: 'Salvar alterações' });
    expect(button.tagName).toBe('BUTTON');
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toHaveAttribute('data-purpose', 'save');
    expect(button.className).toContain('msl-button-feedback');
    expect(button.className).toContain('consumer-button');
  });

  it('activates with the native keyboard behavior and preserves the consumer handler', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<ButtonFeedback onClick={onClick}>Continuar</ButtonFeedback>);

    await user.tab();
    expect(screen.getByRole('button', { name: 'Continuar' })).toHaveFocus();
    await user.keyboard('{Enter}');

    expect(onClick).toHaveBeenCalledOnce();
  });

  it('keeps a disabled button inactive and can request additional reduction', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <ButtonFeedback disabled reduceMotion onClick={onClick}>
        Indisponível
      </ButtonFeedback>,
    );

    const button = screen.getByRole('button', { name: 'Indisponível' });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('data-reduce-motion', 'true');
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('forwards its ref and activates once on Space release', async () => {
    const ref = createRef<HTMLButtonElement>();
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <ButtonFeedback ref={ref} type="button" onClick={onClick}>
        Confirmar
      </ButtonFeedback>,
    );
    expect(ref.current).toBe(screen.getByRole('button', { name: 'Confirmar' }));
    ref.current?.focus();
    await user.keyboard('[Space>]');
    expect(onClick).not.toHaveBeenCalled();
    await user.keyboard('[/Space]');
    expect(onClick).toHaveBeenCalledOnce();
  });
});
