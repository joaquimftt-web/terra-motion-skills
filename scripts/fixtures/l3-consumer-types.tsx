import type { SkeletonToContentProps as SkeletonProps } from '@motion-skills-lab/motion-recipes/skeleton-to-content';
import type { DataChangeFeedbackProps as DataProps } from '@motion-skills-lab/motion-recipes/data-change-feedback';
import { createRef } from 'react';
import { LayoutReflow } from '@motion-skills-lab/motion-recipes/layout-reflow';
import { SkeletonToContent } from '@motion-skills-lab/motion-recipes/skeleton-to-content';
import { DataChangeFeedback } from '@motion-skills-lab/motion-recipes/data-change-feedback';

export const list = (
  <LayoutReflow
    ref={createRef<HTMLUListElement>()}
    reflowKey={0}
    items={[{ id: 'a', content: <input aria-label="Nota" /> }]}
    duration={240}
    aria-label="Lista"
  />
);
export const skeleton = (
  <SkeletonToContent
    ref={createRef<HTMLDivElement>()}
    loading
    skeleton={<p>Carregando</p>}
    minBlockSize={120}
    announcement="off"
  >
    <button>Real</button>
  </SkeletonToContent>
);
export const value = (
  <DataChangeFeedback
    ref={createRef<HTMLSpanElement>()}
    value={1234.56}
    formatValue={(v) => (typeof v === 'number' ? new Intl.NumberFormat('pt-BR').format(v) : v)}
  />
);
// @ts-expect-error Intent is explicit; incidental renders do not authorize reflow.
export const noIntent = <LayoutReflow items={[]} />;
// @ts-expect-error Stable identifiers are strings, not numeric indices.
export const unstableId = <LayoutReflow items={[{ id: 1, content: 'A' }]} reflowKey={0} />;
// @ts-expect-error Loading is controlled, not a Promise.
export const badLoading: SkeletonProps['loading'] = Promise.resolve();
const elementFormatter = () => <span>1</span>;
// @ts-expect-error A formatter returns text, not an element.
export const badFormat: DataProps['formatValue'] = elementFormatter;
// @ts-expect-error No arbitrary object interpretation.
export const arbitraryData = <DataChangeFeedback value={{ amount: 1 }} />;
