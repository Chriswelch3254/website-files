# Strength Lab V3.1.1 Responsive and Visual Refinement Master Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Release Strength Lab `3.1.1` as a materially more polished, readable, intuitive, accessible, and deliberately responsive training workspace without changing its protected strength engines, commercial identities, browser-local data ownership, or existing customer records.

**Architecture:** Reconstruct the exact live `3.1.0` source before changing visual code, then add a small V3.1.1 presentation layer for design tokens, semantic primitives, responsive layout policy, and focus behavior. Existing Pass 2 through Pass 6 renderers remain the workspace owners. Release is gated by deterministic tests, protected-engine hashes, full responsive browser evidence, visual diffs, privacy checks, rollback artifacts, staged Webflow verification, and live QA on both production domains.

**Tech Stack:** CommonJS JavaScript, static HTML/CSS, current Strength Lab local-storage services, current Memberstack access bridge, Node test/build scripts, Chrome DevTools Protocol browser harness, Webflow page custom code, versioned hosted runtime and stylesheet assets.

## Global Constraints

- Current live implementation truth wins over older packages, screenshots, reports, and conversation memory.
- The first checkpoint must reconstruct or retrieve the exact executable `3.1.0` package and eliminate the archived missing-worktree `ENOENT` condition before any visual implementation begins.
- Target product version is `3.1.1` only at the release-candidate task. Schema remains `3`.
- Preserve `nf.strengthLab.v3`, `nf.strengthLab.v3.backup`, `nf.strengthLab.v2`, `nf.strengthLab.v1`, `nf.strengthLab.v2.backup`, and `nf.labs.v1`.
- Preserve `pln_strength-lab-pro-xc605j3`, `prc_strength-lab-pro-monthly-bi10az3`, `prc_strength-lab-pro-annual-7a2050j`, `pln_nutrition-strength-pro-rypq0m57`, `prc_nutrition-strength-pro-monthly-zho70nn9`, and `prc_nutrition-strength-pro-annual-ffnx0mxm`.
- Do not add cloud sync, a Strength Lab API, a Neon table, a Render route, a Vercel data route, or another permanent data owner.
- Do not create a synthetic subscription, test charge, fake customer, fake entitlement, or fake purchase.
- Exact lift records remain browser-local and must not enter analytics, checkout, access resolution, support telemetry, or marketing payloads.
- Do not change estimate formulas, evidence interpretation, comparability rules, recency handling, uncertainty penalties, setup matching, Free Today calculations, planned-exposure classification, warm-up construction, exact first-set calls, remaining-work decisions, progress thresholds, benchmark formulas, scoring formulas, personal-model limits, or safety-stop behavior.
- The protected engine files listed in `reports/v3-1-1/protected-engine-hashes.json` must retain their baseline SHA-256 values through release.
- Every meaningful state exposes exactly one visually dominant primary action.
- Every material recommendation retains recommendation, reason, confidence, guardrail, and scope.
- Free remains independently useful. Pro adds decision depth, adaptation, comparison, and learning.
- No raw enum, ISO timestamp, UUID, internal source ID, module name, schema token, or debug payload appears in normal customer UI.
- Customer copy uses clear human language and no em dashes.
- Mobile primary body text and input text remain at least `16px`.
- Touch targets remain at least `44px` by `44px`.
- No required viewport may have page-level horizontal overflow.
- No navigation or sticky action may cover a required control.
- One active form is allowed in a Pro session. Future-stage forms remain unrendered.
- No unexpected layout shift may exceed `0.10`.
- No more than one long task above `50 ms` is allowed per measured interaction in the established harness.
- No new framework dependency may be added solely for visual polish.
- No duplicate runtime or inline full-runtime copy may be added to Webflow.
- The existing integrity-verified, versioned asset model remains unless a later task proves a safer replacement.
- Do not modify Nutrition Lab, Reality Types, Automatic Plan, My Library, Tools Hub, unrelated sitewide navigation, Stripe prices, or Memberstack plan identities.

## Required Viewport Matrix

- `320 x 568`
- `360 x 800`
- `390 x 844`
- `430 x 932`
- `667 x 375`
- `844 x 390`
- `768 x 1024`
- `1024 x 768`
- `1280 x 720`
- `1366 x 768`
- `1440 x 900`
- `1920 x 1080`
- one viewport wider than `1920`
- `200%` zoom at a laptop viewport
- `200%` zoom at a mobile or compact viewport where supported

## Required Product-State Matrix

Guest loading, logged-out prompt, first-use Free, returning Free, Free Today range, each Pro stage, session review, next exposure, comparable Progress, insufficient/noncomparable Progress, personal Compare, benchmark available, benchmark unavailable, Intelligence cold start, Intelligence usable, relevant and unavailable advanced modes, export, import preview, restore preview, storage unavailable, corrupted-state recovery, access uncertain, downgrade, account switch, validation errors, long lift names, large numeric values, and empty history.

## Protected Engine Files

The baseline task must hash these exact files and later tasks must not modify them:

- `src/pass2/evidence.js`
- `src/pass2/today.js`
- `src/pass3/planned-exposure.js`
- `src/pass3/warmup.js`
- `src/pass3/today-call.js`
- `src/pass3/work.js`
- `src/pass3/session-service.js`
- `src/pass4/profiles.js`
- `src/pass4/progress.js`
- `src/pass4/planning.js`
- `src/pass4/personalization.js`
- `src/pass5/benchmark.js`
- `src/pass5/formulas.js`
- `src/pass5/modes.js`

## Source-Root Contract

All implementation-file paths in the detailed plans are relative to the reconstructed canonical Strength Lab package root. The baseline checkpoint must stop unless that root contains:

```text
package.json
src/
scripts/
tests/
fixtures/
```

The canonical root is recorded in `reports/v3-1-1/source-reconstruction.json` as an absolute local worktree path and a repository-relative package path when the package is tracked. Later commands must run from that package root.

## File Structure and Responsibility Map

### New V3.1.1 modules

- `src/v3-1-1/design-tokens.js`: semantic color, spacing, typography, radius, border, shadow, focus, and motion values plus CSS-variable generation.
- `src/v3-1-1/primitives.js`: customer-safe markup helpers for active decisions, supporting details, receipts, statuses, field groups, validation, and drawers.
- `src/v3-1-1/layout-policy.js`: viewport-band, region, navigation, rail, context-panel, and safe-area policy. It does not read or mutate engine state.
- `src/v3-1-1/focus-policy.js`: deterministic focus targets and announcement text for workspace, stage, drawer, validation, save, retry, and recovery transitions.
- `src/v3-1-1/visual-contracts.js`: pure visual projection contracts that normalize decision, support, receipt, status, field-group, and disclosure inputs without recomputing engine truth.

### Existing presentation owners

- `src/entry/styles.css`: generated token variables, semantic surface classes, responsive grid rules, forms, navigation, states, accessibility fallbacks, and motion.
- `src/entry/index.js`: expose V3.1.1 presentation modules through the existing API.
- `src/v3-1/responsive-styles.js`: compatibility bridge only. Move new responsive ownership into the V3.1.1 token/layout system without deleting old rules until dependency checks pass.
- `src/v3-1/navigation.js` and `src/v3-1/navigation-view.js`: current workspace definitions and navigation rendering.
- `src/v3-1/session-presentation.js`: current eight-stage customer projection.
- `src/pass2/ui.js` and `src/pass2/ui-view.js`: Today, Lifts, evidence, Free states, navigation orchestration, and focus restoration.
- `src/pass2/evidence-review-ui.js`: evidence review, correction, and limitation presentation.
- `src/pass3/ui-controller.js` and `src/pass3/ui-view.js`: Pro session actions, active stage, receipts, future-stage summaries, and invalidation confirmation.
- `src/pass4/ui-view.js`: Progress and Intelligence presentation.
- `src/pass5/ui-view.js`: Compare, benchmark, scoring, methodology, and advanced modes.
- `src/pass6/ui-view.js`: Data, Privacy, import, export, restore, reset, access, downgrade, and recovery surfaces.

### Verification and release tooling

- `scripts/v3-1-1-capture-live.js`: normalize live Webflow code, asset URLs, hashes, byte counts, version markers, page topology, and rollback inputs.
- `scripts/v3-1-1-reconstruct-baseline.js`: prove package completeness, runtime/source mapping, build parity, and runnable package root.
- `scripts/v3-1-1-engine-hash.js`: record and verify the 14 protected engine SHA-256 values.
- `scripts/v3-1-1-baseline-report.js`: aggregate live/source/Webflow/browser/rollback baseline evidence and fail on unresolved drift.
- `scripts/v3-1-1-visual-diff.js`: compare approved baseline and candidate screenshots and generate machine-readable diff summaries.
- `scripts/v3-1-1-a11y-report.js`: aggregate semantics, keyboard, focus, zoom, reduced-motion, and forced-color assertions.
- `scripts/v3-1-1-performance-report.js`: aggregate DOM, long-task, layout-shift, overflow, external-request, and active-form measurements.
- `scripts/browser-harness.js`: full viewport and product-state browser matrix.
- `scripts/production-validate.js`: final source, engine, browser, privacy, performance, version, asset, rollback, and package gates.
- `scripts/production-package.js`: exact `3.1.1` hosted assets, release manifest, Webflow loader/configuration, smoke test, and rollback package.
- `tests/run-tests.js`: all deterministic V3.1.1 contracts and regression gates.
- `reports/v3-1-1/`: source reconstruction, hashes, baseline/candidate browser evidence, visual diffs, accessibility, performance, privacy, release-gate, live-smoke, and release-lock records.
- `generated/webflow-production-v3-1-1/`: immutable candidate and rollback artifacts.

## Checkpoint Sequence

The complete detailed plan suite is preserved in the verified downloadable archive generated with this master plan. It contains these eight checkpoint documents:

1. Baseline reconstruction and verification.
2. Visual tokens and primitives.
3. Phone-first composition.
4. Tablet and compact-laptop composition.
5. Desktop and large-screen composition.
6. Workspace-by-workspace refinement.
7. Accessibility and performance closure.
8. Release candidate, Webflow cutover, and release lock.

## Review Gates

### Gate 1: Baseline authority

Required before visual code changes:

- exact current runtime and stylesheet captured;
- current Webflow head/footer/mount/topology captured;
- runnable package root restored;
- full pre-change test command exits `0`;
- protected engine hashes recorded;
- current live screenshot/performance baseline captured;
- rollback snapshot complete.

### Gate 2: Primitive system

- token contract passes;
- primitive semantics pass;
- phone and desktop primitive sheets are reviewed;
- no engine or data behavior changes;
- build and package budgets pass.

### Gate 3: Phone-first

- all phone portrait and landscape viewports pass;
- software-keyboard flow passes;
- active decision and form dominate;
- no stage wall, clipping, or covered controls;
- local records and active sessions persist.

### Gate 4: Tablet/laptop

- intentional portrait and landscape layouts pass;
- rail behavior and paired fields pass;
- `200%` zoom passes;
- keyboard and touch flows remain intact.

### Gate 5: Desktop/large screen

- three-region layout works at `1280` through wider-than-`1920`;
- context panel is conditional;
- line length and whitespace remain controlled;
- no content stretching or narrow floating phone column remains.

### Gate 6: Workspace parity

- every in-scope workspace uses the new hierarchy;
- degraded and recovery states remain truthful;
- one primary action persists;
- no exact-data externalization or hidden engine logic appears.

### Gate 7: Accessibility/performance

- keyboard, focus, semantics, announcements, zoom, reduced motion, forced colors, and charts pass;
- DOM, long-task, CLS, overflow, active-form, and external-request budgets pass;
- privacy audit passes;
- protected engine hashes remain unchanged.

### Gate 8: Release lock

- version `3.1.1` and manifest hashes agree;
- full candidate matrix and visual-diff review pass;
- staged Webflow candidate passes before production;
- rollback is executable before publish;
- both production domains pass live QA;
- operating records and monitoring checklist are updated.

## Commit Strategy

Each detailed task ends with one focused commit. Do not combine baseline reconstruction, token work, phone layout, desktop layout, workspace refinement, accessibility, and release publication into one commit. A reviewer must be able to reject or revert one task without discarding unrelated validated work.

## Execution Rule

Execute the plans in order. Stop at every gate and report:

- exact commit SHA;
- tests run and failure count;
- generated artifact paths;
- protected engine hash status;
- browser viewports and states covered;
- known limitations;
- production systems changed, if any.

No production publication occurs before Gate 8.
