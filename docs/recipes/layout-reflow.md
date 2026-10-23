# M09 — Layout Reflow

`LayoutReflow` is a controlled native `ul` whose internal `li` elements animate position after an explicit layout intent. It never scales text or takes the consumer list's transform.

```tsx
import { LayoutReflow } from '@motion-skills-lab/motion-recipes/layout-reflow';

<LayoutReflow
  aria-label="Tasks"
  items={tasks.map((task) => ({ id: task.id, content: <Task task={task} /> }))}
  reflowKey={orderRevision}
  duration={240}
/>;
```

Update order and `reflowKey` together. Keeping the key unchanged leaves incidental renders and geometry changes static. Each change to the key is a new intent; returning to an earlier key value also starts a new intent. The consumer owns the item data and order. There is no replay method, drag interaction, shared layout identifier, exit retention, or entry animation.

## Contract

- `items: readonly { id: string; content: ReactNode }[]` and `reflowKey: string | number` are required.
- Each `id` is a list-local React key and a `data-layout-id` attribute. Separate instances can reuse the same ids without creating duplicate document ids. Empty, whitespace-only or duplicate ids throw `TypeError`.
- `duration` defaults to **240 milliseconds**. Zero settles immediately. Negative, infinite and NaN values throw `RangeError`.
- `reduceMotion` defaults to false. The system preference or an explicit true value takes precedence.
- Native attributes, style, className, event handlers and `ref` belong to the `ul`. Its children and `dangerouslySetInnerHTML` are owned by the recipe.
- React 19 refs use `useImperativeHandle`, including callback ref cleanup.

Stable ids preserve DOM nodes, uncontrolled input values and focus during reordering. Newly added items are immediately readable; removed items disappear immediately. Transfer focus before removing a focused item. A reordering recipe cannot preserve a node the consumer removes.

## Interruption and lifecycle

Focus, pointer down and key down capture settle the current intent before composing the consumer's handler. Live system reduction, explicit reduction and duration zero settle it as well. Ending reduction does not replay the same intent. While focus remains inside the list, even a new key remains static. Leaving the list does not replay that intent; a later new consumer key can animate again. A duration change alone settles the current intent and cannot authorize incidental geometry changes.

Only owned `li` transforms are reset. The public Motion `transformTemplate` keeps those transforms at `none` on subsequent projection frames until another authorized key. A layout effect writes `none` immediately for synchronous interaction settlement. No controls are remounted, disabled, hidden or made inert.

Motion 14.3.0 does not expose a component-level public stop operation for its running projection scheduler. This recipe guarantees visual settlement; it does not promise that Motion performs zero internal animation frames after interruption. Internal projection cleanup remains Motion's responsibility. There is no access to `IProjectionNode`, visual elements or other private runtime APIs, and no generic FLIP engine.

## Static fallback and SSR

Server output and the first hydration render are ordered, readable and static. No browser API is read during server rendering. A client without `requestAnimationFrame`, the geometry method, or usable modern media preference listeners uses a native `li` fallback. Preference APIs that exist but throw during query, value reading, subscription or cleanup are treated as unavailable. The recipe probes both its own query and the equivalent query used by Motion14 before mounting Motion. An initially unsupported instance remains native and static until explicitly remounted, even if APIs later recover. The host choice is stable throughout the instance lifetime, preserving item DOM and edited inputs. Zero-size geometry naturally produces no displacement. Motion is responsible for geometry measurement in supported browsers. No external CSS is required; without JavaScript the native list remains readable.

## Validation and limits

Targeted Vitest source tests use the installed Motion runtime, including a nonzero projection with simulated rectangles, focus settlement over later frames, a subsequent authorized change, rapid replacement by duration zero, same-key geometry changes, SSR in Node, native props/ref, input identity, reduction, cleanup and invalid inputs. Simulated geometry proves lifecycle behavior; browser layout, resize timing and visual acceptance require the independent L3 browser gates. This recipe does not guarantee absence of layout shift or focus preservation after consumer deletion.
