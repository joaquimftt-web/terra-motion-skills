> Registro histórico de planejamento, saneado para apresentação pública. O estado implementado atual está no README e em docs/VALIDATION.md.

# Motion Skills Lab v0.1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a reproducible v0.1 with two independent React motion recipes, two operational agent skills, and a navigable showcase backed by real demonstrations and evidence.

**Architecture:** A pnpm workspace contains `apps/showcase`, `packages/motion-tokens`, and `packages/motion-recipes`. The showcase depends on public package exports; reusable packages never depend on the app or skill directories. Skills describe selection, parameters, constraints, accessibility, and validation without owning runtime code.

**Tech Stack:** React, TypeScript strict, Motion (`motion/react`), Vite, pnpm workspaces, CSS custom properties, Vitest, Testing Library (`@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`), Playwright (`@playwright/test`, `@axe-core/playwright` for focused automated audits), ESLint, Prettier. Versions are selected for compatibility and pinned in the lockfile during implementation; no `latest` dependency declarations.

**Spec:** `docs/superpowers/specs/2026-10-19-motion-skills-lab-v0-1-design.md`

## Global Constraints

- React + TypeScript strict + Motion + Vite are required.
- pnpm workspaces stay lightweight and dependency direction is one-way: showcase → packages; packages do not import showcase or skills.
- Button Feedback and Accordion Transition are required; Drawer is optional only after full accessibility/lifecycle validation.
- `motion-foundations` and `microinteraction-design` are the only planned v0.1 skills; do not create empty modules.
- Lenis, GSAP, Three.js/WebGL, React Router, Tailwind, shadcn, backend, Storybook, CI, hosted site, package publishing, and future roadmap features are not v0.1 dependencies/deliverables.
- CSS and custom properties are the default for simple color/border feedback; Motion is used where its React state/layout integration earns its cost.
- Content, state, focus, and action remain correct if animation is skipped or interrupted.
- Reduced motion from the OS always takes precedence over any showcase demonstration setting.
- The collaborator ZIP and external sites are reference material; no original assets or code are copied in v0.1. Preserve source, license, attribution, and dependency notices if a later authorized contribution is incorporated.
- Do not access or modify projeto privado externo, projeto privado externo, other existing repositories, or original collaborator files. Do not choose a project license, publish, push, or create a remote repository.

## Review Focus

1. **Rapid accordion toggle/unmount under StrictMode:** panel state, `aria-expanded`, `inert`, and Motion animation must settle to the actual state with no stale callbacks or hidden focusable controls. Pin in `AccordionTransition.test.tsx` and Playwright rapid-toggle/unmount cases.
2. **OS reduced-motion changes while the demo override is enabled:** the override may reduce motion but must never re-enable motion against the OS setting. Pin in reduced-motion utility/component tests and Playwright contexts with `reducedMotion: 'reduce'`.
3. **Button input mode and disabled state:** hover is optional feedback; keyboard focus and press remain visible/usable, and disabled never looks active. Pin in `ButtonFeedback.test.tsx` plus keyboard/touch E2E checks.
4. **Package consumption outside the showcase:** package exports and built declarations/runtime must resolve without app-relative imports or CSS leakage. Pin by building `motion-tokens` and `motion-recipes` independently and checking package export smoke imports.
5. **Third-party provenance drift:** source examples, licenses, test reports, and UI inspiration can be mistaken for project-owned verified assets. Pin via a references/license documentation review checklist and assertions that no collaborator/external assets enter the v0.1 tree.

---

## Planned files

### Workspace root

- Create `package.json` — scripts, engine range, workspace commands, and root development dependencies.
- Create `pnpm-workspace.yaml` — only `apps/*` and `packages/*` workspaces.
- Create `pnpm-lock.yaml` during the authorized install step — pinned dependency graph.
- Create `tsconfig.json` and `tsconfig.base.json` — strict shared TS settings and project references where needed.
- Create `eslint.config.js` and `.prettierrc.json` — consistent lint/format behavior; keep app/package rules scoped.
- Create `playwright.config.ts` — production preview/browser configuration and trace retention on failure.
- Create `docs/ARCHITECTURE.md`, `docs/MOTION_CONTRACT.md`, `docs/DECISIONS.md`, `docs/REFERENCES_AND_LICENSES.md`, `docs/CONTRIBUTING.md`, `docs/CHANGELOG.md`, `docs/ROADMAP.md`, `README.md`, and `README.en.md` — only document delivered behavior and future opt-in candidates honestly.

### Shared packages

- Create `packages/motion-tokens/package.json`, `tsconfig.json`, `src/index.ts`, `src/motion-tokens.css`, `src/index.test.ts` — typed durations/easing and neutral CSS custom properties, no brand colors.
- Create `packages/motion-recipes/package.json`, `tsconfig.json` — package exports only the four explicit subpaths `./button-feedback`, `./button-feedback.css`, `./accordion-transition`, and `./accordion-transition.css`; independent build/declarations; React and Motion peer dependencies. No root barrel that eagerly imports every recipe.
- Create `packages/motion-recipes/src/button-feedback/ButtonFeedback.tsx`, `button-feedback.css`, `index.ts`, `ButtonFeedback.test.tsx` — named `ButtonFeedback({ reduceMotion?: boolean, ...buttonProps })` semantic button API and scoped styling.
- Create `packages/motion-recipes/src/accordion-transition/AccordionTransition.tsx`, `accordion-transition.css`, `index.ts`, `AccordionTransition.test.tsx` — named controlled disclosure API with native button semantics and Motion.

### Skills and showcase

- Create `skills/motion-foundations/SKILL.md` — operational decision process, motion map, profile, timing/easing, ownership, reduced-motion and performance checks.
- Create `skills/microinteraction-design/SKILL.md` — criteria, applicable states, parameters, examples, constraints, accessibility, lifecycle, and tests for the v0.1 recipes.
- Create `apps/showcase/package.json`, `index.html`, `vite.config.ts`, `tsconfig.json`, `src/main.tsx`, `src/app/App.tsx`, `src/app/app.css` — Vite entry and app shell.
- Create `apps/showcase/src/features/catalog/RecipeCatalog.tsx` — semantic links and summaries for implemented recipes only.
- Create `apps/showcase/src/features/demos/ButtonFeedbackDemo.tsx` and `AccordionTransitionDemo.tsx` — functional examples consuming package exports; no fixed recipe data in the package.
- Create `apps/showcase/src/components/ReducedMotionControl.tsx` — demo-only additional reduction that composes with, and cannot negate, OS preference.
- Create `apps/showcase/src/components/CodeExample.tsx` and `apps/showcase/src/components/CodeExample.test.tsx` — selectable usage snippets and real copy feedback, including clipboard failure handling.
- Create `apps/showcase/tests/showcase.spec.ts` — browser tests for links, live controls, keyboard, reduced motion, viewport layout, replay/toggle, and runtime errors.

The Drawer is not a planned file. Add drawer files only if its full acceptance checklist is explicitly met during v0.1 work without delaying the two required recipes; otherwise record it as pending in roadmap/changelog.

## Implementation batches

### Batch 0 — Isolated execution setup and dependency decisions

**Files:** worktree/branch only; then the root files listed above. No changes outside this new project.

- [ ] After plan approval, create a clean implementation worktree from the local documentation branch; do not use a remote.
- [ ] Before installing, record Node/pnpm versions, choose compatible pinned package versions, inspect dependency licenses and document why each root/runtime dependency is needed.
- [ ] Add the workspace manifests and strict TypeScript/lint/format/test scripts. Do not add Storybook, Tailwind, shadcn, Router, Lenis, GSAP, Three.js, or a workflow.
- [ ] Install only the approved workspace dependencies and create the lockfile.
- [ ] Smoke-check root scripts with `pnpm typecheck`, `pnpm lint`, `pnpm exec vitest run --passWithNoTests`, and `pnpm exec prettier --check .`; expected: configured tools resolve cleanly before recipe tests are added.

**Acceptance:** fresh checkout instructions are reproducible; scripts cover only configured tooling; the lockfile pins compatible versions; `docs/DECISIONS.md` explains workspace cost/benefit and dependency licenses.

### Batch 1 — Tokens and public package boundary

**Files:** `packages/motion-tokens/**`, `packages/motion-recipes/package.json`, `packages/motion-recipes/tsconfig.json`, `packages/motion-recipes/src/index.ts`, root package build scripts.

- [ ] Add tests for neutral typed durations/easing and CSS variables, including expected 110–160 ms button and 160–220 ms accordion defaults.
- [ ] Run `pnpm --filter @motion-skills-lab/motion-tokens test`; expected: new tests fail until token exports and stylesheet exist.
- [ ] Implement the token exports and CSS custom properties; no projeto privado externo color or branding tokens.
- [ ] Build tokens and recipe package independently and verify declaration/public exports resolve without the showcase.
- [ ] Run a static scan for package imports referencing `apps/showcase` or `skills/**`; expected: no results. Build each workspace package independently as a second boundary check.

**Acceptance:** package build and smoke import work independently; public entry points are explicit; no global barrel imports every module.

### Batch 2 — Button Feedback recipe

**Files:** `packages/motion-recipes/src/button-feedback/**`, token tests if integration exposes an issue.

- [ ] Write component tests for semantic button props/content forwarding, hover/focus-visible/press affordances, disabled state, keyboard activation, `reduceMotion` plus OS-preference behavior, and absence of operational scale by default.
- [ ] Run `pnpm --filter @motion-skills-lab/motion-recipes test -- button-feedback`; expected: behavioral assertions fail before implementation.
- [ ] Implement `ButtonFeedback({ reduceMotion = false, ...buttonProps })` with CSS transitions and scoped selectors; pass ordinary button props through and make effective reduction be demo prop OR OS media preference without importing showcase CSS.
- [ ] Re-run the targeted tests and package build; expected: pass and generated declarations export the public API.

**Acceptance:** actual pointer/keyboard states are legible; touch has no hover-only behavior; disabled is not animated as active; no fake async success/loading state; style tokens are customizable.

### Batch 3 — Accordion Transition recipe

**Files:** `packages/motion-recipes/src/accordion-transition/**`.

- [ ] Write tests for closed/open semantics, `aria-expanded`, unique trigger/panel IDs, Enter/Space, hidden/inert closed content, rapid open-close-open, consumer-provided children, and reduced-motion behavior.
- [ ] Run the targeted Vitest file; expected: state/ARIA and behavior tests fail before implementation.
- [ ] Implement the named API `AccordionTransition({ open, onOpenChange, trigger, children, duration = 180, reduceMotion = false, id, className })` from the explicit `./accordion-transition` export; compute effective reduction as OS preference OR `reduceMotion`, use native button semantics and Motion, and keep closed descendants inert/hidden from accessibility APIs.
- [ ] Add a test that simulates preference changes during the component lifetime when Motion's hook supports it; reduced mode removes spatial/layout movement while preserving immediate readable state.
- [ ] Re-run targeted tests and standalone package build.

**Acceptance:** content is real consumer content; quick toggles and unmount leave state correct; keyboard works natively; reduced motion does not hide or delay content; recipe has no showcase imports.

### Batch 4 — Skills and provenance/contribution documentation

**Files:** both `skills/**/SKILL.md`; `docs/MOTION_CONTRACT.md`, `docs/REFERENCES_AND_LICENSES.md`, `docs/CONTRIBUTING.md`, `docs/DECISIONS.md`, `docs/ROADMAP.md`, `docs/CHANGELOG.md`.

- [ ] Write Agent Skills frontmatter validation checks for exact directory/name match and required `description`; assert both descriptions say what the skill does and when to use it.
- [ ] Draft `motion-foundations` using intent/profile/trigger/target/duration/easing/reduced alternative/lifecycle/performance evidence from this spec; link only to actual recipe/docs paths.
- [ ] Draft `microinteraction-design` with applicability criteria; Button state matrix; Accordion API/defaults; examples; false-success/disabled/hover-only restrictions; keyboard, reduced-motion, lifecycle and test instructions.
- [ ] Add source ledger rows for Motion.dev, Details, shadcn/ui, Unlumen, Lenis Templates, GSAP Showcase/docs, and the collaborator ZIP. Distinguish verified license text from unverified ownership, licenses of tools from licenses of assets/templates, and third-party reports from reproduced results.
- [ ] Add contribution guidance for future PR/review, authorship, attribution, retaining notices, and no presumed co-authorship until work is integrated.
- [ ] Add roadmap entries for Lenis, GSAP/ScrollTrigger, and WebGL as opt-in future work with entry criteria; leave them out of dependency manifests.
- [ ] Run the local Agent Skills validation script and documentation link/provenance checks; expected: both skills pass and no source entry claims the collaborator report was reproduced.

**Acceptance:** skills are useful to agents without showcase/runtime coupling; no unused skill directories; all license/provenance statements name their evidence and limits; no project license file is added.

### Batch 5 — Navigable showcase and live demos

**Files:** `apps/showcase/**`, root build scripts, docs architecture/README files.

- [ ] Add tests for recipe navigation links, demo control behavior, and the rendered names/intent/source references before building the app shell.
- [ ] Implement a responsive semantic catalog with one route/page and anchor navigation; no router, search, filters, or fake data.
- [ ] Integrate named `ButtonFeedback` and `AccordionTransition` via `@motion-skills-lab/motion-recipes/button-feedback` and `/accordion-transition`; import each scoped CSS file through its explicit export. No app-relative or skill-directory imports.
- [ ] Add an Accordion duration control constrained to the documented range and a toggle/replay flow that actually closes/reopens the panel; use button hover/focus/press as the real Button demo trigger.
- [ ] Add a reduced-motion demo control that can request a conservative mode only; verify OS reduced preference always wins. Don't present a switch that falsely changes OS settings.
- [ ] Add accessible labels, focus-visible styles, skip link/landmarks, source/skill links, and per-recipe snippets that use the same public subpath exports and state workspace/runtime dependencies.
- [ ] Add a functional copy button that copies the displayed exact snippet, announces success only after clipboard success, and leaves the code selectable with an error status if clipboard access fails.
- [ ] Run Vite build and TypeScript strict check; expected: build uses only implemented workspace packages.

**Acceptance:** demos run real recipes, controls change actual behavior, navigation is keyboard-operable, no showcase source has imported `skills/**`, no horizontal overflow at supported viewport widths, and no unimplemented future feature is visible as available.

### Batch 6 — E2E, quality, evidence, and closeout

**Files:** `playwright.config.ts`, `apps/showcase/tests/showcase.spec.ts`, root `README.md`, root `README.en.md`, `docs/ARCHITECTURE.md`, `docs/MOTION_CONTRACT.md`, `docs/REFERENCES_AND_LICENSES.md`, `docs/CHANGELOG.md`.

- [ ] Add Playwright cases for catalog-to-demo navigation, keyboard Tab/Shift+Tab/Enter/Space, rapid accordion toggle, button keyboard/touch behavior, OS reduced-motion and demo reduction precedence, accordion replay, copy success/failure feedback, and console/page errors.
- [ ] Add viewport checks at 1440, 1024, 390, and 320 px; assert no blocking horizontal scroll.
- [ ] Run focused axe checks on the catalog and both demos; expected: no critical/serious automated violations, with any remaining findings recorded and keyboard focus reviewed separately.
- [ ] Run E2E against production preview and retain trace on failure; expected: all selected cases pass in the installed browser only. State browser coverage accurately.
- [ ] Run root `pnpm build`, `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm exec playwright test`; expected: all implemented checks pass.
- [ ] Review package boundaries by standalone package builds and static import scan; review dependency/license manifest and installed third-party license notices.
- [ ] Record actual commands/results, environment/browser, bundle output sizes, observed lifecycle/reduced-motion behavior, limitations, and remaining bugs. Do not report FPS or device accessibility certification.
- [ ] Update root `README.md` and `README.en.md` setup and scope to match only delivered features; note provisional name and unset project license.

**Acceptance:** v0.1 acceptance checklist in the spec is evidenced; at least two complete recipes are delivered; drawer remains explicitly pending unless every modal/focus criterion passes; no public push/repository/site/npm action occurs.

## Stop conditions

- If a dependency's license or a copied asset's provenance is unclear, omit that material and log the source/limitation.
- If pnpm workspace setup makes independent package consumption materially harder than its value, stop and record the concrete issue for user review rather than silently collapsing package boundaries.
- If the drawer cannot meet full dialog/focus/lifecycle acceptance without risking the two required recipes, leave it pending and do not create its files.
- If an environment/browser is unavailable, record the exact unrun validation and continue with independent checks; do not claim that check passed.
- Stop before choosing a project license, publishing, pushing, or creating a remote; those require a separate explicit approval.
