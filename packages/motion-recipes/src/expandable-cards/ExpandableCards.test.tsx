import { act, fireEvent, render, screen } from '@testing-library/react';
import { createRef, StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ExpandableCards, type ExpandableCardItem } from './index';
const items: ExpandableCardItem[] = ['a', 'b', 'c'].map((id) => ({
  id,
  title: id.toUpperCase(),
  preview: <input aria-label={'Preview ' + id} defaultValue="note" />,
  details: <input aria-label={'Detail ' + id} defaultValue="detail" />,
}));
const noop = () => {};
afterEach(() => vi.unstubAllGlobals());
describe('ExpandableCards', () => {
  it('falls back safely when preference listener registration throws', () => {
    vi.stubGlobal('matchMedia', () => ({
      matches: false,
      addEventListener: () => {
        throw new Error('hostile listener');
      },
      removeEventListener: () => {},
    }));
    render(<ExpandableCards items={items} selectedId="b" onSelectedIdChange={noop} />);
    expect(screen.getByRole('button', { name: 'B' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('list')).toBeVisible();
    vi.unstubAllGlobals();
  });
  it('Escape from a selected preview focuses its trigger before requesting close', () => {
    const change = vi.fn();
    render(<ExpandableCards items={items} selectedId="a" onSelectedIdChange={change} />);
    act(() => screen.getByLabelText('Preview a').focus());
    fireEvent.keyDown(screen.getByLabelText('Preview a'), { key: 'Escape' });
    expect(screen.getByRole('button', { name: 'A' })).toHaveFocus();
    expect(change).toHaveBeenCalledExactlyOnceWith(null);
  });
  it('uses native list/articles/headings/buttons and forwards ref/native props', () => {
    const ref = createRef<HTMLUListElement>();
    render(
      <ExpandableCards
        items={items}
        selectedId={null}
        onSelectedIdChange={noop}
        ref={ref}
        aria-label="Collection"
        data-test="native"
      />,
    );
    expect(ref.current).toBe(screen.getByRole('list'));
    expect(ref.current).toHaveAttribute('data-test', 'native');
    expect(screen.getAllByRole('article')).toHaveLength(3);
    expect(screen.getAllByRole('heading')).toHaveLength(3);
    expect(screen.getByRole('button', { name: 'B' })).toHaveAttribute('aria-expanded', 'false');
  });
  it('requests controlled selection without applying it until props change', () => {
    const change = vi.fn();
    render(<ExpandableCards items={items} selectedId={null} onSelectedIdChange={change} />);
    fireEvent.click(screen.getByRole('button', { name: 'B' }));
    expect(change).toHaveBeenCalledExactlyOnceWith('b');
    expect(screen.getByRole('button', { name: 'B' })).toHaveAttribute('aria-expanded', 'false');
  });
  it('preserves nodes and input values across selection and rapid reversals', () => {
    const v = render(<ExpandableCards items={items} selectedId="a" onSelectedIdChange={noop} />);
    const input = screen.getByLabelText('Detail a');
    fireEvent.change(input, { target: { value: 'edited' } });
    v.rerender(<ExpandableCards items={items} selectedId="c" onSelectedIdChange={noop} />);
    v.rerender(<ExpandableCards items={items} selectedId="a" onSelectedIdChange={noop} />);
    expect(screen.getByLabelText('Detail a')).toBe(input);
    expect(input).toHaveValue('edited');
  });
  it('transfers focus before externally hiding active details', () => {
    const v = render(<ExpandableCards items={items} selectedId="b" onSelectedIdChange={noop} />);
    act(() => screen.getByLabelText('Detail b').focus());
    const log: string[] = [];
    screen.getByRole('button', { name: 'B' }).addEventListener('focus', () => {
      expect(screen.getByLabelText('Detail b').closest('[hidden]')).toBeNull();
      log.push('focus');
    });
    v.rerender(<ExpandableCards items={items} selectedId="c" onSelectedIdChange={noop} />);
    expect(screen.getByRole('button', { name: 'B' })).toHaveFocus();
    expect(log).toEqual(['focus']);
    expect(screen.getByLabelText('Detail b').closest('[hidden]')).not.toBeNull();
  });
  it('preserves focus in a preview that remains visible', () => {
    const v = render(<ExpandableCards items={items} selectedId="a" onSelectedIdChange={noop} />);
    const input = screen.getByLabelText('Preview a');
    act(() => input.focus());
    v.rerender(<ExpandableCards items={items} selectedId="c" onSelectedIdChange={noop} />);
    expect(input).toHaveFocus();
  });
  it('removal chooses a surviving successor then predecessor; empty collection is named/focusable', () => {
    const v = render(<ExpandableCards items={items} selectedId="b" onSelectedIdChange={noop} />);
    act(() => screen.getByLabelText('Detail b').focus());
    v.rerender(
      <ExpandableCards
        items={[items[0]!, items[2]!]}
        selectedId={null}
        onSelectedIdChange={noop}
      />,
    );
    expect(screen.getByRole('button', { name: 'C' })).toHaveFocus();
    v.rerender(<ExpandableCards items={[items[0]!]} selectedId={null} onSelectedIdChange={noop} />);
    expect(screen.getByRole('button', { name: 'A' })).toHaveFocus();
    v.rerender(<ExpandableCards items={[]} selectedId={null} onSelectedIdChange={noop} />);
    expect(screen.getByRole('list')).toHaveFocus();
    expect(screen.getByRole('list')).toHaveAccessibleName();
  });
  it('retains accessible old DOM when focus transfer fails, and retries only on new intent', () => {
    const v = render(<ExpandableCards items={items} selectedId="b" onSelectedIdChange={noop} />);
    const input = screen.getByLabelText('Detail b');
    act(() => input.focus());
    const spy = vi
      .spyOn(screen.getByRole('button', { name: 'B' }), 'focus')
      .mockImplementation(() => {});
    v.rerender(<ExpandableCards items={items} selectedId="c" onSelectedIdChange={noop} />);
    expect(input).toHaveFocus();
    expect(input.closest('[hidden]')).toBeNull();
    expect(screen.getByRole('list')).toHaveAttribute('data-update-blocked', 'true');
    spy.mockRestore();
    v.rerender(<ExpandableCards items={items} selectedId={null} onSelectedIdChange={noop} />);
    expect(screen.getByRole('button', { name: 'B' })).toHaveFocus();
  });
  it('Escape requests close only within selected card and composes native events', () => {
    const change = vi.fn(),
      key = vi.fn();
    render(
      <ExpandableCards items={items} selectedId="a" onSelectedIdChange={change} onKeyDown={key} />,
    );
    fireEvent.keyDown(screen.getByLabelText('Preview b'), { key: 'Escape' });
    expect(change).not.toHaveBeenCalled();
    fireEvent.keyDown(screen.getByLabelText('Detail a'), { key: 'Escape' });
    expect(change).toHaveBeenCalledExactlyOnceWith(null);
    expect(key).toHaveBeenCalledTimes(2);
  });
  it('marks selected, peer and unpaired without changing DOM order', () => {
    const v = render(<ExpandableCards items={items} selectedId="b" onSelectedIdChange={noop} />);
    expect(screen.getAllByRole('listitem').map((n) => n.dataset.cardId)).toEqual(['a', 'b', 'c']);
    expect(screen.getAllByRole('listitem')[0]).toHaveAttribute('data-peer', 'true');
    v.rerender(<ExpandableCards items={items} selectedId="c" onSelectedIdChange={noop} />);
    expect(screen.getAllByRole('listitem')[2]).toHaveAttribute('data-lone', 'true');
  });
  it.each([-1, NaN, Infinity])('rejects invalid duration %s', (duration) => {
    expect(() =>
      renderToString(
        <ExpandableCards
          items={items}
          selectedId={null}
          onSelectedIdChange={noop}
          duration={duration}
        />,
      ),
    ).toThrow(RangeError);
  });
  it.each([
    { bad: [{ ...items[0]!, id: '' }] },
    { bad: [items[0]!, items[0]!] },
    { bad: [{ ...items[0]!, title: '' }] },
  ])('rejects invalid identities/title', ({ bad }) => {
    expect(() =>
      renderToString(<ExpandableCards items={bad} selectedId={null} onSelectedIdChange={noop} />),
    ).toThrow(TypeError);
  });
  it('rejects unknown selection', () => {
    expect(() =>
      renderToString(
        <ExpandableCards items={items} selectedId="missing" onSelectedIdChange={noop} />,
      ),
    ).toThrow(RangeError);
  });
  it('SSR is static and has unique ids across instances; StrictMode refs clean up', () => {
    const html = renderToString(
      <>
        <ExpandableCards items={items} selectedId="b" onSelectedIdChange={noop} />
        <ExpandableCards items={items} selectedId={null} onSelectedIdChange={noop} />
      </>,
    );
    const ids = [...html.matchAll(/ id="([^"]+)"/g)].map((m) => m[1]);
    expect(new Set(ids).size).toBe(ids.length);
    expect(html).not.toContain('opacity:0');
    const ref = createRef<HTMLUListElement>();
    const v = render(
      <StrictMode>
        <ExpandableCards items={items} selectedId={null} onSelectedIdChange={noop} ref={ref} />
      </StrictMode>,
    );
    v.unmount();
    expect(ref.current).toBeNull();
  });
});
