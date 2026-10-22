// @vitest-environment node
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { motionTokens } from './index';

const stylesheet = readFileSync(new URL('./motion-tokens.css', import.meta.url), 'utf8');

describe('motion tokens', () => {
  it('provides timing defaults for the three independent state recipes', () => {
    expect(motionTokens.duration.presenceTransition).toBe(180);
    expect(motionTokens.duration.asyncStateFeedback).toBe(160);
    expect(motionTokens.duration.navigationIndicator).toBe(180);
  });
  it('provides the approved button and accordion timing defaults in milliseconds', () => {
    expect(motionTokens.duration.buttonFeedback).toBe(140);
    expect(motionTokens.duration.accordionTransition).toBe(180);
  });

  it('exports one standard cubic-bezier tuple for Motion and CSS consumers', () => {
    expect(motionTokens.easing.standard).toEqual([0.2, 0, 0, 1]);
  });

  it('publishes matching neutral CSS custom properties without brand colors', () => {
    expect(stylesheet).toContain('--msl-motion-duration-button-feedback: 140ms;');
    expect(stylesheet).toContain('--msl-motion-duration-accordion-transition: 180ms;');
    expect(stylesheet).toContain('--msl-motion-easing-standard: cubic-bezier(0.2, 0, 0, 1);');
    expect(stylesheet).not.toMatch(/--msl-color-[^:]+:/);
  });
});
