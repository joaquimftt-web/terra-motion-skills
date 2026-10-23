import { act, fireEvent, render, screen } from '@testing-library/react';
import { createRef, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { DataChangeFeedback } from './index';

let reduced = false;
let listeners: Set<() => void>;
const animationCalls: { target: HTMLElement; cancel: ReturnType<typeof vi.fn> }[] = [];
const originalAnimate = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'animate');

beforeEach(() => {
  reduced = false;
  listeners = new Set();
  animationCalls.length = 0;
  vi.stubGlobal('matchMedia', () => ({
    get matches() {
      return reduced;
    },
    addEventListener: (_: string, listener: () => void) => listeners.add(listener),
    removeEventListener: (_: string, listener: () => void) => listeners.delete(listener),
  }));
  // Native WAAPI boundary: Motion itself remains real. jsdom has no animation engine.
  vi.stubGlobal('Animation', class {});
  Object.defineProperty(HTMLElement.prototype, 'animate', {
    configurable: true,
    value: vi.fn(function (this: HTMLElement) {
      const cancel = vi.fn();
      animationCalls.push({ target: this, cancel });
      return {
        cancel,
        play: vi.fn(),
        pause: vi.fn(),
        finish: vi.fn(),
        commitStyles: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        finished: new Promise(() => {}),
        currentTime: 0,
        startTime: 0,
        playState: 'running',
        playbackRate: 1,
        effect: { getComputedTiming: () => ({}) },
      } as unknown as Animation;
    }),
  });
});
afterEach(() => {
  vi.unstubAllGlobals();
  if (originalAnimate) Object.defineProperty(HTMLElement.prototype, 'animate', originalAnimate);
  else Reflect.deleteProperty(HTMLElement.prototype, 'animate');
});

it('starts static with one visible value and no implicit live semantics', () => {
  render(<DataChangeFeedback value="1.234,56" data-testid="root" />);
  const root = screen.getByTestId('root');
  expect(root.tagName).toBe('SPAN');
  expect(root.textContent).toBe('1.234,56');
  expect(root.querySelector('[aria-live], [role]')).toBeNull();
  expect(root).not.toHaveAttribute('aria-live');
  expect(root).not.toHaveAttribute('role');
  expect(animationCalls).toHaveLength(0);
});

it('replaces arbitrary formatted text immediately and retains a visible change label', () => {
  const formatValue = (value: string | number) => `Estoque: ${value}`;
  const { rerender } = render(
    <DataChangeFeedback value="indisponível" formatValue={formatValue} />,
  );
  rerender(<DataChangeFeedback value="12,5 caixas" formatValue={formatValue} />);
  expect(screen.getByText('Estoque: 12,5 caixas')).toBeVisible();
  expect(screen.queryByText('Estoque: indisponível')).toBeNull();
  expect(screen.getByText('Valor atualizado')).toBeVisible();
  expect(screen.getByText('Estoque: 12,5 caixas').style.opacity).not.toBe('0');
});

it('does not treat formatter-only changes or equal values as data updates', () => {
  const { rerender } = render(<DataChangeFeedback value={10} />);
  rerender(<DataChangeFeedback value={10} formatValue={(value) => `Total ${value}`} />);
  expect(screen.getByText('Total 10')).toBeVisible();
  expect(screen.queryByText('Valor atualizado')).toBeNull();
  expect(animationCalls).toHaveLength(0);
});

it('uses Object.is including NaN stability and signed zero changes', () => {
  const { rerender } = render(<DataChangeFeedback value={NaN} />);
  rerender(<DataChangeFeedback value={NaN} />);
  expect(screen.queryByText('Valor atualizado')).toBeNull();
  rerender(<DataChangeFeedback value={0} />);
  expect(screen.getByText('Valor atualizado')).toBeVisible();
  const count = animationCalls.length;
  rerender(<DataChangeFeedback value={-0} />);
  expect(animationCalls.length).toBeGreaterThan(count);
});

it('animates only decoration and cancels previous animation on rapid updates and unmount', () => {
  const { rerender, unmount } = render(<DataChangeFeedback value="a" />);
  rerender(<DataChangeFeedback value="b" />);
  expect(animationCalls).toHaveLength(1);
  expect(animationCalls[0]!.target).toHaveAttribute('aria-hidden', 'true');
  expect(animationCalls[0]!.target.textContent).toBe('');
  rerender(<DataChangeFeedback value="c" />);
  expect(animationCalls[0]!.cancel).toHaveBeenCalled();
  expect(screen.getByText('c')).toBeVisible();
  expect(screen.queryByText('b')).toBeNull();
  unmount();
  expect(animationCalls[1]!.cancel).toHaveBeenCalled();
});

it('stops decoration on duration changes without inventing another update', () => {
  const { rerender } = render(<DataChangeFeedback value={1} />);
  rerender(<DataChangeFeedback value={2} />);
  expect(animationCalls).toHaveLength(1);
  rerender(<DataChangeFeedback value={2} duration={900} />);
  expect(animationCalls[0]!.cancel).toHaveBeenCalled();
  expect(animationCalls).toHaveLength(1);
  expect(screen.getByText('Valor atualizado')).toBeVisible();
});

it('keeps updates and static labels with explicit reduced motion or zero duration', () => {
  const { rerender } = render(<DataChangeFeedback value={1} reduceMotion />);
  rerender(<DataChangeFeedback value={2} reduceMotion changeLabel="Atualizado agora" />);
  expect(screen.getByText('2')).toBeVisible();
  expect(screen.getByText('Atualizado agora')).toBeVisible();
  rerender(<DataChangeFeedback value={3} duration={0} />);
  expect(screen.getByText('3')).toBeVisible();
  expect(animationCalls).toHaveLength(0);
});

it('system reduced motion interrupts immediately and does not replay when disabled', () => {
  const { rerender } = render(<DataChangeFeedback value={1} />);
  rerender(<DataChangeFeedback value={2} />);
  act(() => {
    reduced = true;
    listeners.forEach((listener) => listener());
  });
  expect(animationCalls[0]!.cancel).toHaveBeenCalled();
  rerender(<DataChangeFeedback value={3} />);
  expect(animationCalls).toHaveLength(1);
  act(() => {
    reduced = false;
    listeners.forEach((listener) => listener());
  });
  expect(animationCalls).toHaveLength(1);
  expect(screen.getByText('Valor atualizado')).toBeVisible();
});

it('polite uses the sole visible current value and excludes the static label', () => {
  const { container, rerender } = render(<DataChangeFeedback value="a" announcement="polite" />);
  rerender(<DataChangeFeedback value="b" announcement="polite" />);
  const regions = container.querySelectorAll('[aria-live="polite"]');
  expect(regions).toHaveLength(1);
  expect(regions[0]!.textContent).toBe('b');
  expect(regions[0]).toBeVisible();
  expect(container.textContent).toBe('bValor atualizado');
  const record = vi.fn();
  const observer = new MutationObserver(record);
  observer.observe(regions[0]!, { childList: true, characterData: true, subtree: true });
  rerender(<DataChangeFeedback value="b" announcement="polite" duration={10} />);
  expect(observer.takeRecords()).toHaveLength(0);
  observer.disconnect();
  rerender(<DataChangeFeedback value="b" announcement="off" />);
  expect(container.querySelector('[aria-live], [role]')).toBeNull();
});

it('passes native props, style, object ref, handlers and preserves focused root', () => {
  const ref = createRef<HTMLSpanElement>();
  const onClick = vi.fn();
  const { rerender, unmount } = render(
    <DataChangeFeedback
      value={1}
      ref={ref}
      tabIndex={0}
      title="Valor"
      className="consumer"
      style={{ color: 'red' }}
      onClick={onClick}
    />,
  );
  const root = ref.current!;
  root.focus();
  fireEvent.click(root);
  expect(onClick).toHaveBeenCalledOnce();
  expect(root).toHaveClass('consumer');
  expect(root).toHaveStyle({ color: 'rgb(255, 0, 0)' });
  expect(root).toHaveAttribute('title', 'Valor');
  rerender(<DataChangeFeedback value={2} ref={ref} tabIndex={0} />);
  expect(document.activeElement).toBe(root);
  expect(ref.current).toBe(root);
  unmount();
  expect(ref.current).toBeNull();
});

it('supports React 19 callback ref cleanup under StrictMode without initial animation', () => {
  const cleanup = vi.fn();
  const callback = vi.fn(() => cleanup);
  const { unmount } = render(
    <StrictMode>
      <DataChangeFeedback value={1} ref={callback} />
    </StrictMode>,
  );
  expect(callback).toHaveBeenCalledTimes(2);
  expect(cleanup).toHaveBeenCalledTimes(1);
  expect(animationCalls).toHaveLength(0);
  unmount();
  expect(cleanup).toHaveBeenCalledTimes(2);
  expect(listeners.size).toBe(0);
});

it.each([-1, NaN, Infinity, -Infinity])('rejects invalid duration %s', (duration) => {
  expect(() => renderToString(<DataChangeFeedback value={1} duration={duration} />)).toThrow(
    RangeError,
  );
});

it('SSR and initial hydration are identical without initial change feedback', async () => {
  const element = (
    <DataChangeFeedback
      value="12,50"
      announcement="polite"
      formatValue={(value) => `Quantidade ${value}`}
    />
  );
  const html = renderToString(element);
  const container = document.createElement('div');
  document.body.append(container);
  container.innerHTML = html;
  const onRecoverableError = vi.fn();
  let root: ReturnType<typeof hydrateRoot>;
  await act(async () => {
    root = hydrateRoot(container, element, { onRecoverableError });
  });
  expect(container.innerHTML).toBe(html);
  expect(container.textContent).toBe('Quantidade 12,50');
  expect(onRecoverableError).not.toHaveBeenCalled();
  expect(animationCalls).toHaveLength(0);
  act(() => root.unmount());
  container.remove();
});

it('uses system reduced motion from first mount even with reduceMotion=false', () => {
  reduced = true;
  const { rerender } = render(<DataChangeFeedback value={1} reduceMotion={false} />);
  rerender(<DataChangeFeedback value={2} reduceMotion={false} />);
  expect(screen.getByText('2')).toBeVisible();
  expect(screen.getByText('Valor atualizado')).toBeVisible();
  expect(animationCalls).toHaveLength(0);
});

it('stops an active animation when explicit reduced motion is enabled', () => {
  const { rerender } = render(<DataChangeFeedback value={1} />);
  rerender(<DataChangeFeedback value={2} />);
  rerender(<DataChangeFeedback value={2} reduceMotion />);
  expect(animationCalls[0]!.cancel).toHaveBeenCalled();
  rerender(<DataChangeFeedback value={2} reduceMotion={false} />);
  expect(animationCalls).toHaveLength(1);
  expect(screen.getByText('Valor atualizado')).toBeVisible();
});

it('retains readable current data and label when the native animation API rejects', () => {
  Object.defineProperty(HTMLElement.prototype, 'animate', {
    configurable: true,
    value: () => {
      throw new Error('Native animation unavailable');
    },
  });
  const { rerender } = render(<DataChangeFeedback value="anterior" />);
  rerender(<DataChangeFeedback value="atual" />);
  expect(screen.getByText('atual')).toBeVisible();
  expect(screen.getByText('Valor atualizado')).toBeVisible();
  expect(screen.queryByText('anterior')).toBeNull();
});
