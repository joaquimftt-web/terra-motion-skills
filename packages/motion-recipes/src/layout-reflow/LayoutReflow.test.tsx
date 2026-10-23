import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createRef, StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LayoutReflow } from './index';

let reduced = false;
const listeners = new Set<() => void>();
const a = { id: 'a', content: <input aria-label="A" defaultValue="preserve" /> };
const b = { id: 'b', content: <button>B</button> };
beforeEach(() => {
  reduced = false;
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({
      get matches() {
        return reduced;
      },
      addEventListener: (_event: string, callback: () => void) => listeners.add(callback),
      removeEventListener: (_event: string, callback: () => void) => listeners.delete(callback),
    })),
  );
});
afterEach(() => {
  vi.unstubAllGlobals();
  listeners.clear();
});

describe('LayoutReflow', () => {
  it('keeps list-local ids out of the document id namespace across instances', () => {
    render(
      <>
        <LayoutReflow items={[a, b]} reflowKey={0} />
        <LayoutReflow items={[a, b]} reflowKey={0} />
      </>,
    );
    expect(screen.getAllByRole('listitem')).toHaveLength(4);
    expect(document.querySelectorAll('li[id]')).toHaveLength(0);
    expect(document.querySelectorAll('li[data-layout-id="a"]')).toHaveLength(2);
  });

  it('keeps a new explicit intent static while focus remains inside and does not replay on blur', async () => {
    const blur = vi.fn();
    const view = render(<LayoutReflow items={[a, b]} reflowKey={0} onBlurCapture={blur} />);
    act(() => screen.getByRole('textbox').focus());
    view.rerender(<LayoutReflow items={[b, a]} reflowKey={1} onBlurCapture={blur} />);
    expect(screen.getByRole('textbox')).toHaveFocus();
    for (const item of screen.getAllByRole('listitem')) expect(item.style.transform).toBe('none');
    act(() => screen.getByRole('textbox').blur());
    expect(blur).toHaveBeenCalled();
    await act(() => new Promise((resolve) => setTimeout(resolve, 80)));
    for (const item of screen.getAllByRole('listitem')) expect(item.style.transform).toBe('none');
  });

  it('does not authorize incidental geometry changes when only nonzero duration changes', async () => {
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (
      this: Element,
    ) {
      const index = this.parentElement ? Array.from(this.parentElement.children).indexOf(this) : 0;
      const top = this.tagName === 'LI' ? index * 60 : 0;
      return {
        x: 0,
        y: top,
        top,
        left: 0,
        right: 200,
        bottom: top + 50,
        width: 200,
        height: 50,
        toJSON() {},
      };
    });
    const view = render(<LayoutReflow items={[a, b]} reflowKey={0} duration={500} />);
    view.rerender(<LayoutReflow items={[b, a]} reflowKey={0} duration={300} />);
    await act(() => new Promise((resolve) => setTimeout(resolve, 80)));
    for (const item of screen.getAllByRole('listitem')) expect(item.style.transform).toBe('none');
  });
  it('does not animate incidental reorder/geometry changes without a new reflowKey', async () => {
    let gap = 60;
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (
      this: Element,
    ) {
      const index = this.parentElement ? Array.from(this.parentElement.children).indexOf(this) : 0;
      const top = this.tagName === 'LI' ? index * gap : 0;
      return {
        x: 0,
        y: top,
        top,
        left: 0,
        right: 200,
        bottom: top + 50,
        width: 200,
        height: 50,
        toJSON() {},
      };
    });
    const view = render(<LayoutReflow items={[a, b]} reflowKey="same" />);
    gap = 80;
    view.rerender(<LayoutReflow items={[b, a]} reflowKey="same" />);
    await act(() => new Promise((resolve) => setTimeout(resolve, 100)));
    expect(
      screen.getAllByRole('listitem').some((item) => item.style.transform.includes('translate')),
    ).toBe(false);
  });

  it('moves through real Motion projection and keeps interrupted transforms settled across later frames', async () => {
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (
      this: Element,
    ) {
      const index = this.parentElement ? Array.from(this.parentElement.children).indexOf(this) : 0;
      const top = this.tagName === 'LI' ? index * 60 : 0;
      return {
        x: 0,
        y: top,
        top,
        left: 0,
        right: 200,
        bottom: top + 50,
        width: 200,
        height: 50,
        toJSON() {},
      };
    });
    const view = render(<LayoutReflow items={[a, b]} reflowKey={0} duration={500} />);
    await act(() => new Promise((resolve) => setTimeout(resolve, 40)));
    view.rerender(<LayoutReflow items={[b, a]} reflowKey={1} duration={500} />);
    await waitFor(() =>
      expect(
        screen.getAllByRole('listitem').some((item) => item.style.transform.includes('translate')),
      ).toBe(true),
    );
    fireEvent.focus(screen.getByRole('textbox'));
    for (const item of screen.getAllByRole('listitem')) expect(item.style.transform).toBe('none');
    await act(() => new Promise((resolve) => setTimeout(resolve, 100)));
    for (const item of screen.getAllByRole('listitem')) expect(item.style.transform).toBe('none');
    fireEvent.blur(screen.getByRole('textbox'), { relatedTarget: document.body });
    view.rerender(<LayoutReflow items={[a, b]} reflowKey={2} duration={500} />);
    await waitFor(() =>
      expect(
        screen.getAllByRole('listitem').some((item) => item.style.transform.includes('translate')),
      ).toBe(true),
    );
    view.rerender(<LayoutReflow items={[b, a]} reflowKey={3} duration={0} />);
    await act(() => new Promise((resolve) => setTimeout(resolve, 100)));
    for (const item of screen.getAllByRole('listitem')) expect(item.style.transform).toBe('none');
  });
  it('renders native ul/li, passes native props and exposes its ul ref', () => {
    const ref = createRef<HTMLUListElement>();
    render(
      <LayoutReflow
        ref={ref}
        items={[a, b]}
        reflowKey={0}
        aria-label="Tasks"
        className="consumer"
        style={{ transform: 'rotate(1deg)' }}
      />,
    );
    expect(ref.current).toBe(screen.getByRole('list'));
    expect(ref.current?.tagName).toBe('UL');
    expect(ref.current?.getAttribute('aria-label')).toBe('Tasks');
    expect(ref.current?.className).toBe('consumer');
    expect(ref.current?.style.transform).toBe('rotate(1deg)');
    expect(
      screen.getAllByRole('listitem').map((node) => node.getAttribute('data-layout-id')),
    ).toEqual(['a', 'b']);
  });

  it('preserves item nodes, uncontrolled input state, and focus through intentional reorder', () => {
    const view = render(<LayoutReflow items={[a, b]} reflowKey={0} />);
    const input = screen.getByRole('textbox');
    const item = input.parentElement;
    fireEvent.change(input, { target: { value: 'edited' } });
    act(() => input.focus());
    view.rerender(<LayoutReflow items={[b, a]} reflowKey={1} />);
    expect(screen.getByRole('textbox')).toBe(input);
    expect(input.parentElement).toBe(item);
    expect(input).toHaveValue('edited');
    expect(input).toHaveFocus();
    expect(
      screen.getAllByRole('listitem').map((node) => node.getAttribute('data-layout-id')),
    ).toEqual(['b', 'a']);
  });

  it('inserts readable content immediately and removes items without retention', () => {
    const view = render(<LayoutReflow items={[a]} reflowKey={0} />);
    view.rerender(<LayoutReflow items={[b]} reflowKey={1} />);
    expect(screen.queryByRole('textbox')).toBeNull();
    expect(screen.getByRole('button')).toBeVisible();
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
  });

  it.each(['focus', 'pointerDown', 'keyDown'] as const)(
    'settles %s interaction and composes consumer handlers',
    (event) => {
      const callback = vi.fn();
      const props = {
        onFocusCapture: callback,
        onPointerDownCapture: callback,
        onKeyDownCapture: callback,
      };
      render(<LayoutReflow items={[a, b]} reflowKey={0} {...props} />);
      if (event === 'focus') fireEvent.focus(screen.getByRole('textbox'));
      else if (event === 'pointerDown') fireEvent.pointerDown(screen.getByRole('button'));
      else fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' });
      expect(callback).toHaveBeenCalled();
      for (const item of screen.getAllByRole('listitem')) expect(item.style.transform).toBe('none');
    },
  );

  it('settles live system reduction and keeps the same intent settled when reduction ends', () => {
    render(<LayoutReflow items={[a, b]} reflowKey={0} />);
    act(() => {
      reduced = true;
      listeners.forEach((callback) => callback());
    });
    for (const item of screen.getAllByRole('listitem')) expect(item.style.transform).toBe('none');
    act(() => {
      reduced = false;
      listeners.forEach((callback) => callback());
    });
    for (const item of screen.getAllByRole('listitem')) expect(item.style.transform).toBe('none');
  });

  it('has immediate duration zero and explicit reduction', () => {
    const view = render(<LayoutReflow items={[a, b]} reflowKey={0} duration={0} />);
    for (const item of screen.getAllByRole('listitem')) expect(item.style.transform).toBe('none');
    view.rerender(<LayoutReflow items={[b, a]} reflowKey={1} reduceMotion />);
    for (const item of screen.getAllByRole('listitem')) expect(item.style.transform).toBe('none');
  });

  it.each([-1, NaN, Infinity])('rejects duration %s', (duration) => {
    expect(() =>
      renderToString(<LayoutReflow items={[a]} reflowKey={0} duration={duration} />),
    ).toThrow(RangeError);
  });

  it.each([[{ id: '', content: 'empty' }], [{ id: ' ', content: 'empty' }], [a, a]])(
    'rejects empty or duplicate item ids',
    (...items) => {
      expect(() => renderToString(<LayoutReflow items={items} reflowKey={0} />)).toThrow(TypeError);
    },
  );

  it('uses React19 callback ref cleanup through StrictMode and removes media subscriptions', () => {
    const cleanup = vi.fn();
    const ref = vi.fn(() => cleanup);
    const view = render(
      <StrictMode>
        <LayoutReflow ref={ref} items={[a, b]} reflowKey={0} />
      </StrictMode>,
    );
    expect(listeners.size).toBe(1);
    view.unmount();
    expect(cleanup).toHaveBeenCalledTimes(ref.mock.calls.length);
    expect(listeners.size).toBe(0);
  });

  it('SSR emits ordered readable content without entry transforms or browser APIs', () => {
    const html = renderToString(<LayoutReflow items={[b, a]} reflowKey="server" />);
    expect(html.indexOf('id="b"')).toBeLessThan(html.indexOf('id="a"'));
    expect(html).toContain('<ul');
    expect(html).toContain('value="preserve"');
    expect(html).not.toContain('opacity:0');
    expect(html).not.toContain('translate');
  });
});
