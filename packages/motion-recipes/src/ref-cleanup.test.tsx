import { StrictMode } from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PresenceTransition } from './presence-transition/PresenceTransition.js';
import { NavigationIndicator } from './navigation-indicator/NavigationIndicator.js';

describe('React 19 public callback ref cleanup', () => {
  it('cleans Presence consumer resources before valid exit completion', () => {
    const cleanup = vi.fn();
    let held: HTMLDivElement | null = null;
    const ref = (node: HTMLDivElement | null) => {
      held = node;
      return () => {
        held = null;
        cleanup();
      };
    };
    const complete = vi.fn(() => expect(held).toBeNull());
    const view = render(
      <PresenceTransition present ref={ref} duration={0} onExitComplete={complete}>
        Notice
      </PresenceTransition>,
    );
    view.rerender(
      <PresenceTransition present={false} ref={ref} duration={0} onExitComplete={complete}>
        Notice
      </PresenceTransition>,
    );
    expect(cleanup).toHaveBeenCalledTimes(1);
    expect(complete).toHaveBeenCalledTimes(1);
  });
  it.each(['presence', 'navigation'])(
    'cleans %s callback refs on replacement, StrictMode and unmount',
    (recipe) => {
      let resources = 0;
      const callbacks: Array<HTMLElement> = [];
      const first = (node: HTMLElement | null) => {
        if (!node) return;
        resources++;
        callbacks.push(node);
        return () => {
          resources--;
        };
      };
      const second = (node: HTMLElement | null) => {
        if (!node) return;
        resources++;
        return () => {
          resources--;
        };
      };
      const tree = (ref: typeof first) => (
        <StrictMode>
          {recipe === 'presence' ? (
            <PresenceTransition present ref={ref}>
              Notice
            </PresenceTransition>
          ) : (
            <NavigationIndicator
              aria-label="Ref navigation"
              items={[{ id: 'a', href: '#a', label: 'A' }]}
              value="a"
              ref={ref}
            />
          )}
        </StrictMode>
      );
      const view = render(tree(first));
      expect(resources).toBe(1);
      expect(callbacks.length).toBeGreaterThan(0);
      view.rerender(tree(second));
      expect(resources).toBe(1);
      view.unmount();
      expect(resources).toBe(0);
    },
  );
});
