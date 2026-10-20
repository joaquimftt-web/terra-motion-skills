import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CodeExample } from './CodeExample';

describe('CodeExample', () => {
  it('copies exactly the displayed example and announces success after resolution', async () => {
    const user = userEvent.setup();
    const write = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue();
    render(<CodeExample code="const real = true;" name="Exemplo" />);
    await user.click(screen.getByRole('button', { name: 'Copiar exemplo Exemplo' }));
    expect(write).toHaveBeenCalledWith('const real = true;');
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Código copiado.'));
  });
  it('keeps code selectable and reports clipboard failure honestly', async () => {
    const user = userEvent.setup();
    vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new Error('Denied'));
    render(<CodeExample code="const real = true;" name="Exemplo" />);
    await user.click(screen.getByRole('button', { name: 'Copiar exemplo Exemplo' }));
    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent(
        'Selecione o código para copiar manualmente.',
      ),
    );
    expect(screen.getByText('const real = true;')).toBeVisible();
    expect(screen.getByRole('status')).not.toHaveTextContent('Código copiado.');
  });
});
