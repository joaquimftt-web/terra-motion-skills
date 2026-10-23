# Terra Motion Skills

[Português](README.md) · **v0.1 — validated local milestone** · Public GitHub repository

Eight reusable React motion recipes in the candidate and operational AI agent skills, with neutral tokens and a real showcase. Recipes work independently of the showcase. This is an independent project, not affiliated with Motion. Project name: Terra Motion Skills; repository identifier: terra-motion-skills.

![Terra Motion Skills showcase](docs/evidence/publication/terra-showcase-v4-1440.png)

**Public showcase:** [landing](https://joaquimftt-web.github.io/terra-motion-skills/), [Mineral Technical lab](https://joaquimftt-web.github.io/terra-motion-skills/lab/) and [references](https://joaquimftt-web.github.io/terra-motion-skills/referencias/). The integrated V4/P1/P2/P3 experience was published from `49d724183732bc8a82e8ed6889e9ecbd3338d527`; [successful deployment](https://github.com/joaquimftt-web/terra-motion-skills/actions/runs/39654669658). Historical release/tag v0.1.0 remains unchanged; this visual publication does not bump the library version. A1 screenshots below are historical.

**[PR #1](https://github.com/joaquimftt-web/terra-motion-skills/pull/1) candidate:** 8 recipes, 3 operational skills and 13 explicit recipe/CSS subpaths. L1/L2 and the horizontal composition are available on `integration/landing-v4-horizontal`; they are not yet merged into main or deployed to Pages. No npm packages are published. Release/tag v0.1.0 is historical and unchanged.

## Install and run

Verified environments: Windows and the Ubuntu 24.04 runner with Chromium, Node **24.20.0**, pnpm **11.24.0**, React/React DOM 19.3.1 and Motion 14.3.0. Accepted Node engines: `^22.22.2 || ^24.15.0 || >=26.0.0`; other environments are not a validated matrix. See [pnpm installation](https://pnpm.io/installation) and use the pinned version.

Public repository: [joaquimftt-web/terra-motion-skills](https://github.com/joaquimftt-web/terra-motion-skills), branch `main`. Clone the project and enter the root containing pnpm-workspace.yaml. No credentials or .env are needed.

```sh
git clone https://github.com/joaquimftt-web/terra-motion-skills.git
cd terra-motion-skills
# To review the PR; omit this line to use the published main baseline.
git switch integration/landing-v4-horizontal
pnpm install --frozen-lockfile
pnpm dev
```

Open the URL reported by Vite, normally http://127.0.0.1:5173. Workspace packages are built first. Re-run `pnpm build:packages` after changing recipe/token sources. Local production preview:

```sh
pnpm build
pnpm --filter @motion-skills-lab/showcase preview
```

Preview is a local tool, not a production server. The v0.1 showcase is hosted on GitHub Pages; npm packages are not published.

See [HOSTING.md (Portuguese)](docs/HOSTING.md) for Pages operation, `/terra-motion-skills/` testing and rollback. The published experience has three routes: `/`, `/lab/` and `/referencias/`, prefixed in Pages builds. [Public versus local status](docs/PUBLICATION_STATUS.md) · [Closing validation](docs/CLOSING_VALIDATION.md).

## Identity and compatibility

Official name: **Terra Motion Skills**; public repository: [joaquimftt-web/terra-motion-skills](https://github.com/joaquimftt-web/terra-motion-skills). The local `@motion-skills-lab/*` scope, workspace name, and skill names are retained for compatibility. Examples below use the actual identifiers; no packages are published to a registry. The former name remains in historical records and preserved A1 captures. [Inventory and decision (Portuguese)](docs/IDENTITY.md).

## Real recipes

- **Button Feedback:** native button, consumer props/ref, color/border hover/press, visible focus and disabled; no scale, 140 ms.
- **Accordion Transition:** controlled disclosure, unique ARIA associations, closed content inert/aria-hidden, reversible Motion height transition; 180 ms default.
- **Presence Transition:** controlled presence and focus before exit, 180 ms.
- **Async State Feedback:** five controlled states; 160 ms decorative effect, without operation management.
- **Navigation Indicator:** native horizontal LTR links and indicator, 180 ms.
- **Scroll Reveal:** safe block entrance without fade, 260 ms / 8 px.
- **Staggered Entrance:** bounded semantic group entrance, 260 ms / 8 px / 50 ms stagger.
- **Scroll Progress:** actual scroll position, without artificial duration or proof of reading.
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

The candidate has 13 explicit subpaths: eight components and five CSS exports, with no root recipe barrel. Main/Pages still represent the earlier two-recipe baseline. Optional token CSS has recipe fallbacks. See [contracts](docs/MOTION_CONTRACT.md).

## Skills and architecture

Read [motion-foundations](skills/motion-foundations/SKILL.md), [microinteraction-design](skills/microinteraction-design/SKILL.md) and [scroll-motion](skills/scroll-motion/SKILL.md) within the clone, preserving directories for relative links. They contain operational instructions in Portuguese, parameters, examples, constraints, accessibility and validation. They are not runtime or automatically installed agent configuration. Structural validation does not certify agent effectiveness.

- `apps/showcase`: consumes public package exports.
- `packages/motion-tokens`: neutral timing/easing.
- `packages/motion-recipes`: eight independent candidate recipes (two on current main/Pages).
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
pnpm test:e2e:recipes
```

Historical v0.1 refined-base results, not this candidate’s test count: **22 Vitest tests, 17 Playwright tests and eight axe audits** at four widths. Historical evidence also records native browser zoom at 200% with one additional axe audit returning no violations. See [VALIDATION.md](docs/VALIDATION.md) for the recorded validation results. E2E needs a free port 4173 and installed Chromium.

The integrated experience was validated with Chromium on Windows and the Ubuntu 24.04 runner: no claims of a tested alternative browser, screen reader, physical device or accessibility certification. No FPS/hardware measurements. A2 (boundary checks) and A3 (preference changes during scheduled replay) remain backlog. GSAP, Lenis, WebGL, Drawer and new recipes are outside v0.1.

**Ubuntu CI for original candidate `38b6fbbb50a867c790c72a2c8ce90b9aba6a1118`:** [successful run](https://github.com/joaquimftt-web/terra-motion-skills/actions/runs/39874614276) with **172 Vitest, 11 auditor tests, 30 independent-fixture E2E and 109 E2E per base**, including axe within the suites. Validation/build passed; deploy was `skipped`. This subsequent documentation correction still requires Ubuntu revalidation. The **43 Vitest / 11 auditor / 30 E2E per base** results and HTTPS smoke in [CLOSING_VALIDATION.md](docs/CLOSING_VALIDATION.md) are historical published-baseline evidence, not proof of deployment for this candidate. The original R1 branch remains separate; Scroll Reveal implemented in this candidate belongs to L2. No npm packages are published.

## Screenshots and demo

[Full desktop](docs/evidence/a1/after/showcase-1440-full.png) · [1024 px](docs/evidence/a1/after/showcase-1024-full.png) · [390 px](docs/evidence/a1/after/showcase-390-full.png) · [320 px](docs/evidence/a1/after/showcase-320-full.png) · [A1 comparison](docs/REFINEMENT_A1.md)

![Readable code at a 390 px viewport](docs/evidence/a1/after/code-390.png)

The public URL above serves the integrated experience. A1 captures are historical refined-base records, not screenshots of the current landing. The holder authorized project-specific asset use on 21 October 2026, outside MIT and without a general reuse license. [Asset inventory and conditions](docs/ASSET_RIGHTS.md).

## Licensing and contribution

**Original code is licensed under [MIT](LICENSE).** Copyright (c) 2026 Joaquim Freitas. Package manifests remain private to prevent accidental package publication. Dependencies retain their own terms: [notices](THIRD_PARTY_NOTICES.md), [sources/licenses](docs/REFERENCES_AND_LICENSES.md), and [inventory](docs/DEPENDENCY_LICENSES.json).

[Contributing](docs/CONTRIBUTING.md) · [Changelog](docs/CHANGELOG.md) · [Publication status](docs/PUBLICATION_STATUS.md)

The logo and architectural background have specific permissions separate from MIT: [holder declaration](docs/ASSET_PERMISSION_2026-10-21.md) and [conditions](ASSET_NOTICES.md). They are not assets offered for unrestricted reuse.

## L1/L2 and candidate landing composition

Presence Transition (180 ms), Async State Feedback (160 ms) and Navigation Indicator (180 ms) form L1. Scroll Reveal, Staggered Entrance and Scroll Progress form L2. Including Button and Accordion, there are eight recipes; see the [contracts](docs/MOTION_CONTRACT.md) and three skills. The Async demo identifies its user-controlled promise simulation; Navigation uses real links/hash/history. Temporal demos offer 0–800 ms; position-linked progress has no artificial duration.

- [Scroll Reveal](docs/recipes/scroll-reveal.md): short entrance without fade, safe preparation below the viewport.
- [Staggered Entrance](docs/recipes/staggered-entrance.md): semantic ul/li list, min(i×stagger,200) ms delay and whole-group cancellation.
- [Scroll Progress](docs/recipes/scroll-progress.md): actual vertical position, not a reading percentage.

The [candidate Landing V4](docs/LANDING_MOTION_INTEGRATION.md) preserves hero/P1/P2/P3, adds the widget after the hero and guided horizontal gallery A on eligible desktops, with native B as fallback/mobile. It consumes public subpaths without coupling the library to V4 identity. This content is on the public PR branch, not main/Pages; future integration and deployment require approval. No version bump or new release was created.
