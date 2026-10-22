import { describe, expect, it } from 'vitest';
import { linkedGeometry, positionFraction } from './geometry';

describe('isolated horizontal editorial geometry', () => {
  it('uses actual overflow, not a hard-coded panel count', () => {
    expect(linkedGeometry(1440, 900, 620, 1200, 4200, false)).toEqual({
      linked: true,
      travel: 3000,
    });
  });
  it('falls back for mobile, short height, oversized content, no overflow and reduction', () => {
    for (const [w, h, content, view, rail, reduce] of [
      [390, 900, 620, 350, 1400, false],
      [1440, 600, 620, 1200, 4200, false],
      [1024, 900, 880, 900, 3600, false],
      [1440, 900, 620, 1200, 1200, false],
      [1440, 900, 620, 1200, 4200, true],
    ] as const)
      expect(linkedGeometry(w, h, content, view, rail, reduce).linked).toBe(false);
  });
  it('clamps start, reverse and end without division by zero', () => {
    expect(positionFraction(-1, 3000)).toBe(0);
    expect(positionFraction(1500, 3000)).toBe(0.5);
    expect(positionFraction(5000, 3000)).toBe(1);
    expect(positionFraction(100, 0)).toBe(0);
  });
});
