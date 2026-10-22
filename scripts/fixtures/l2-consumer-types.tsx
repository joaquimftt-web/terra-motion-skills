import { createRef } from 'react';
import { ScrollReveal } from '@motion-skills-lab/motion-recipes/scroll-reveal';
import {
  StaggeredEntrance,
  type StaggeredEntranceProps,
} from '@motion-skills-lab/motion-recipes/staggered-entrance';
import {
  ScrollProgress,
  type ScrollProgressSource,
} from '@motion-skills-lab/motion-recipes/scroll-progress';
const items = [{ id: 'stable', title: 'Content' }] as const;
export const reveal = (
  <ScrollReveal ref={createRef<HTMLDivElement>()} duration={260}>
    Text
  </ScrollReveal>
);
export const group = (
  <StaggeredEntrance
    items={items}
    getKey={(item) => item.id}
    renderItem={(item) => <p>{item.title}</p>}
    ref={createRef<HTMLUListElement>()}
  />
);
export const progress = (
  <ScrollProgress
    source={{
      type: 'container',
      containerRef: createRef<HTMLDivElement>(),
      contentRef: createRef<HTMLDivElement>(),
    }}
  />
);
// @ts-expect-error No temporal duration on a position-linked indicator.
export const noDuration = <ScrollProgress duration={200} />;
// @ts-expect-error Native container requires the observable flow wrapper ref.
export const noContentRef: ScrollProgressSource = {
  type: 'container',
  containerRef: createRef<HTMLDivElement>(),
};
const returnsNumber = () => 42;
// @ts-expect-error Stable keys are strings, not numeric indices.
export const numericKey: StaggeredEntranceProps<(typeof items)[number]>['getKey'] = returnsNumber;
// @ts-expect-error Fade is not a recipe option in this version.
export const noFade = <ScrollReveal fade>Visible text</ScrollReveal>;
