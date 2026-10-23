import { createRef, StrictMode } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { NavigationIndicator } from './NavigationIndicator.js';

const items = [
  { id: 'a', href: '#a', label: 'Overview' },
  { id: 'b', href: '#b', label: 'Details' },
];
describe('NavigationIndicator', () => {
  it('keeps fallback after observer registration fails and selection changes', () => {
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe() {
          throw new Error('unavailable');
        }
        disconnect() {}
      },
    );
    const geometry = vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
      x: 0,
      y: 0,
      left: 0,
      top: 0,
      right: 100,
      bottom: 40,
      width: 100,
      height: 40,
      toJSON() {},
    });
    const view = render(
      <NavigationIndicator aria-label="Failed observer" items={items} value="a" />,
    );
    view.rerender(<NavigationIndicator aria-label="Failed observer" items={items} value="b" />);
    expect(view.container.querySelector('.msl-navigation-indicator__line')).toHaveAttribute(
      'hidden',
    );
    expect(screen.getByRole('link', { name: 'Details' })).toHaveAttribute('aria-current');
    view.unmount();
    geometry.mockRestore();
    vi.unstubAllGlobals();
  });
  it('uses real links and current location, never tab semantics', () => {
    const ref = createRef<HTMLElement>();
    render(
      <NavigationIndicator
        ref={ref}
        aria-label="Within this example"
        items={items}
        value="b"
        currentType="location"
      />,
    );
    expect(ref.current).toBe(screen.getByRole('navigation'));
    expect(screen.getByRole('link', { name: 'Details' })).toHaveAttribute('href', '#b');
    expect(screen.getByRole('link', { name: 'Details' })).toHaveAttribute(
      'aria-current',
      'location',
    );
    expect(screen.getByRole('link', { name: 'Overview' })).not.toHaveAttribute('aria-current');
    expect(screen.queryByRole('tab')).toBeNull();
  });
  it('keeps selection controlled when another link receives focus or activation', () => {
    render(<NavigationIndicator aria-label="Navigation" items={items} value="a" />);
    const other = screen.getByRole('link', { name: 'Details' });
    other.focus();
    fireEvent.click(other);
    expect(other).toHaveFocus();
    expect(other).not.toHaveAttribute('aria-current');
    expect(screen.getByRole('link', { name: 'Overview' })).toHaveAttribute('aria-current', 'page');
  });
  it('retains accessible static selection without ResizeObserver or geometry', () => {
    const view = render(<NavigationIndicator aria-label="Static" items={items} value="a" />);
    expect(view.container.querySelector('.msl-navigation-indicator__line')).toHaveAttribute(
      'hidden',
    );
    expect(screen.getByRole('link', { name: 'Overview' })).toHaveAttribute('aria-current');
    view.rerender(<NavigationIndicator aria-label="Static" items={items} value="unknown" />);
    expect(view.container.querySelector('[aria-current]')).toBeNull();
  });
  it('permits independent instances to reuse domain identifiers', () => {
    render(
      <>
        <NavigationIndicator aria-label="First" items={items} value="a" />
        <NavigationIndicator aria-label="Second" items={items} value="b" />
      </>,
    );
    expect(screen.getAllByRole('navigation')).toHaveLength(2);
    expect(
      screen.getAllByRole('link').filter((link) => link.hasAttribute('aria-current')),
    ).toHaveLength(2);
  });
  it('accepts an empty group without inventing a selected link', () => {
    render(<NavigationIndicator aria-label="Empty" items={[]} value={null} />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.queryAllByRole('link')).toHaveLength(0);
  });
  it('rejects duplicate IDs, missing labels and invalid duration', () => {
    expect(() =>
      render(
        <NavigationIndicator aria-label="Duplicate" items={[items[0]!, items[0]!]} value="a" />,
      ),
    ).toThrow(TypeError);
    expect(() => render(<NavigationIndicator aria-label="" items={items} value="a" />)).toThrow(
      TypeError,
    );
    expect(() =>
      render(
        <NavigationIndicator aria-label="Bad duration" items={items} value="a" duration={NaN} />,
      ),
    ).toThrow(RangeError);
  });
  it('disconnects its observer in StrictMode without observing its moving line', () => {
    const observed = new Set<Element>();
    const instances = new Set<object>();
    class Observer {
      targets = new Set<Element>();
      constructor() {
        instances.add(this);
      }
      observe(node: Element) {
        this.targets.add(node);
        observed.add(node);
      }
      disconnect() {
        this.targets.forEach((node) => observed.delete(node));
        this.targets.clear();
        instances.delete(this);
      }
    }
    vi.stubGlobal('ResizeObserver', Observer);
    const view = render(
      <StrictMode>
        <NavigationIndicator aria-label="Observed" items={items} value="a" />
      </StrictMode>,
    );
    expect(
      [...observed].some((node) => node.classList.contains('msl-navigation-indicator__line')),
    ).toBe(false);
    view.unmount();
    expect(instances.size).toBe(0);
    expect(observed.size).toBe(0);
    vi.unstubAllGlobals();
  });
});
