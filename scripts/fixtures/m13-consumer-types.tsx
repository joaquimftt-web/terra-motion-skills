import { createRef } from 'react';
import {
  ExpandableCards,
  type ExpandableCardItem,
} from '@motion-skills-lab/motion-recipes/expandable-cards';
const items: ExpandableCardItem[] = [
  { id: 'a', title: 'A', preview: 'Summary', details: 'Detail' },
];
export const valid = (
  <ExpandableCards
    ref={createRef<HTMLUListElement>()}
    items={items}
    selectedId={null}
    onSelectedIdChange={() => {}}
    duration={0}
    aria-label="Cards"
  />
);
// @ts-expect-error controlled selection is required
export const missing = <ExpandableCards items={items} onSelectedIdChange={() => {}} />;
export const badRef = (
  <ExpandableCards
    // @ts-expect-error native list ref only
    ref={createRef<HTMLDivElement>()}
    items={items}
    selectedId={null}
    onSelectedIdChange={() => {}}
  />
);
export const badTitle: ExpandableCardItem = {
  id: 'a',
  // @ts-expect-error title cannot contain interactive nodes
  title: <button>Bad</button>,
  preview: '',
  details: '',
};
export const badChildren = (
  // @ts-expect-error children belong in item slots
  <ExpandableCards items={items} selectedId={null} onSelectedIdChange={() => {}}>
    Bad
  </ExpandableCards>
);
