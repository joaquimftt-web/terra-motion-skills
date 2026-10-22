import {
  createEntranceLifecycle,
  type EntranceOptions,
} from '../internal/createEntranceLifecycle.js';
export type ScrollRevealOptions = Omit<EntranceOptions, 'stagger'>;
export function createScrollRevealLifecycle(
  root: HTMLDivElement,
  target: HTMLDivElement,
  initial: ScrollRevealOptions,
) {
  return createEntranceLifecycle(root, [target], initial);
}
