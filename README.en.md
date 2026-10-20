# Terra Motion Skills

[Português](README.md) · **v0.1 — validated local milestone** · Publication candidate

Reusable React motion recipes and operational AI agent skills, with neutral tokens and a real showcase. Recipes work independently of the showcase. This is an independent project, not affiliated with Motion. Project name: Terra Motion Skills; repository identifier: terra-motion-skills.

![Terra Motion Skills showcase](docs/evidence/identity/terra-1440-viewport.png)

**Online demo:** not published. Run locally. A1 screenshots document the accepted visual refinement; later editorial name/license messages may differ.

## Install and run

Verified environment: Windows, Node **24.20.0**, pnpm **11.24.0**, React/React DOM 19.3.1 and Motion 14.3.0. Accepted Node engines: `^22.22.2 || ^24.15.0 || >=26.0.0`; other environments are not a validated matrix. See [pnpm installation](https://pnpm.io/installation) and use the pinned version.

Intended destination: `joaquimftt-web/terra-motion-skills`. No remote has been created. Open this candidate folder, or clone the repository after publication is authorized, then enter the root containing pnpm-workspace.yaml. No credentials or .env are needed.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open the URL reported by Vite, normally http://127.0.0.1:5173. Workspace packages are built first. Re-run `pnpm build:packages` after changing recipe/token sources. Local production preview:

```sh
pnpm build
pnpm --filter @motion-skills-lab/showcase preview
```

Preview is a local tool, not a production server. Hosting and npm distribution are not configured.

## Identity and compatibility

Official name: **Terra Motion Skills**; intended destination: `joaquimftt-web/terra-motion-skills`. The local `@motion-skills-lab/*` scope, workspace name, and skill names are retained for compatibility. Examples below use the actual identifiers; no packages are published to a registry. The former name remains in historical records and preserved A1 captures. [Inventory and decision (Portuguese)](docs/IDENTITY.md).

## Real recipes

- **Button Feedback:** native button, consumer props/ref, color/border hover/press, visible focus and disabled; no scale, 140 ms.
- **Accordion Transition:** controlled disclosure, unique ARIA associations, closed content inert/aria-hidden, reversible Motion height transition; 180 ms default.
- **Showcase:** actual duration/replay/reset controls, activation counter, disabled control and clipboard success/fallback.

Live system reduced motion takes priority. Accordion reduces conservatively if matchMedia is unavailable. Consumers own content and business operations.

### Button Feedback

Packages remain local/private, not registry packages. Link built public outputs in another local workspace with React/React DOM 19 and Motion for Accordion. Do not assume npm installation is available. `check:consumer` checks manifests/dist and peers without showcase or package sources.

```tsx
import { ButtonFeedback } from '@motion-skills-lab/motion-recipes/button-feedback';
import '@motion-skills-lab/motion-recipes/button-feedback.css';

export function ConfirmButton({ onConfirm }: { onConfirm: () => void }) {
  return (
    <ButtonFeedback type="button" onClick={onConfirm}>
      Confirm
    </ButtonFeedback>
  );
}
```

### Accordion Transition

```tsx
import { useState } from 'react';
import { AccordionTransition } from '@motion-skills-lab/motion-recipes/accordion-transition';
import '@motion-skills-lab/motion-recipes/accordion-transition.css';

export function Details() {
  const [open, setOpen] = useState(false);
  return (
    <AccordionTransition open={open} onOpenChange={setOpen} trigger="Details">
      <p>Content controlled by your application.</p>
    </AccordionTransition>
  );
}
```

There are four recipe/CSS subpaths and no root recipe barrel. Optional token CSS has recipe fallbacks. See [contracts](docs/MOTION_CONTRACT.md).

## Skills and architecture

Read [motion-foundations](skills/motion-foundations/SKILL.md) and [microinteraction-design](skills/microinteraction-design/SKILL.md) within the clone, preserving directories for relative links. They contain operational instructions in Portuguese, parameters, examples, constraints, accessibility and validation. They are not runtime or automatically installed agent configuration. Structural validation does not certify agent effectiveness.

- `apps/showcase`: consumes public package exports.
- `packages/motion-tokens`: neutral timing/easing.
- `packages/motion-recipes`: independent Button and Accordion recipes.
- `skills`: instructions; `docs`: contracts, decisions, sources and evidence.

[Architecture](docs/ARCHITECTURE.md) · [Decisions](docs/DECISIONS.md) · [Roadmap](docs/ROADMAP.md)

## Validation and limits

```sh
pnpm typecheck
pnpm build
pnpm lint
pnpm format:check
pnpm test
pnpm validate:skills
pnpm check:boundaries
pnpm check:consumer
pnpm exec playwright install chromium
pnpm test:e2e
```

The refined base passed **22 Vitest tests, 17 Playwright tests and eight axe audits** at four widths. Historical evidence also records native browser zoom at 200% with one additional axe audit returning no violations. See [VALIDATION.md](docs/VALIDATION.md) for this candidate's fresh results. E2E needs a free port 4173 and installed Chromium.

Windows/Chromium only: no claims of a tested alternative browser, screen reader, physical device or accessibility certification. No FPS/hardware measurements. A2 (boundary checks) and A3 (preference changes during scheduled replay) remain backlog. GSAP, Lenis, WebGL, Drawer and new recipes are outside v0.1.

## Screenshots and demo

[Full desktop](docs/evidence/a1/after/showcase-1440-full.png) · [1024 px](docs/evidence/a1/after/showcase-1024-full.png) · [390 px](docs/evidence/a1/after/showcase-390-full.png) · [320 px](docs/evidence/a1/after/showcase-320-full.png) · [A1 comparison](docs/REFINEMENT_A1.md)

![Readable code at a 390 px viewport](docs/evidence/a1/after/code-390.png)

A future static demo requires separate approval and applicable notices. No fictional URL, deployment, CI or publication badge.

## Licensing and contribution

**Original code is licensed under [MIT](LICENSE).** Copyright (c) 2026 Joaquim Freitas. Package manifests remain private to prevent accidental package publication. Dependencies retain their own terms: [notices](THIRD_PARTY_NOTICES.md), [sources/licenses](docs/REFERENCES_AND_LICENSES.md), and [inventory](docs/DEPENDENCY_LICENSES.json).

[Contributing](docs/CONTRIBUTING.md) · [Changelog](docs/CHANGELOG.md) · [Preparation status](docs/PUBLICATION_STATUS.md)
