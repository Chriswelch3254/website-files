# Strength Lab V3.1.1 Responsive and Visual Refinement Design

**Status:** Approved design direction, implementation not started  
**Date:** 2026-08-10  
**Product owner:** Chris Welch, NeuForm Fitness  
**Current public route:** `/tools-strength-lab`  
**Current public product version:** `3.1.0`  
**Target visual-release version:** `3.1.1`  
**Schema and storage target:** unchanged, schema `3`, storage key `nf.strengthLab.v3`  
**Design approach:** meaningful visual refinement with preserved product logic

## 1. Purpose

Strength Lab V3.1.1 will make the current Strength Lab experience more polished, readable, comfortable, intuitive, accessible, and deliberately responsive across phones, tablets, laptops, desktops, orientation changes, zoom states, and input methods.

The project is not a new Strength Lab feature release and is not a training-science revision. It is a controlled visual and interaction refinement of the live V3.1 product.

The central design goal is:

> Strength Lab should feel like a premium training workspace that makes the current decision obvious, minimizes friction between sets, and remains calm, readable, and trustworthy on every supported device.

The refinement must preserve the existing product contract:

> Record useful strength evidence, understand what it supports, and make the next training decision with appropriate confidence.

## 2. Source-of-truth and release-integrity note

Current live implementation truth wins when it conflicts with an older package, screenshot, document, or remembered implementation detail.

The current public page establishes that Strength Lab is the active tool at `/tools-strength-lab` and that exact Strength Lab data stays in the current browser or device unless the user exports it.

The visual-design evidence includes the current live V3.1 experience, the Gate D responsive contact sheet, existing responsive reports, current page configuration, and the current operating rules.

A release-integrity discrepancy must be handled explicitly before implementation begins: the archived `npm-verify-final.log` currently available in the project files records an `ENOENT` failure because the expected worktree `package.json` was missing. That log does not prove a passing final repository verification. Therefore V3.1.1 implementation may not rely on the prior completion claim alone. The first implementation checkpoint must reconstruct a complete executable source baseline and rerun the full verification suite before changing visual code.

This requirement does not mean the public tool is assumed broken. It means source and verification truth must be re-established before another release.

## 3. Source hierarchy

When sources disagree, use this order:

1. Current live Strength Lab behavior and current Webflow configuration.
2. Current hosted V3.1 runtime and stylesheet referenced by the live page.
3. The exact executable source reconstructed from the current V3.1 release branch, deployment artifact, or validated package.
4. Current deterministic tests, browser reports, accessibility reports, and visual captures.
5. Current commercial, Memberstack, local-storage, and privacy contracts.
6. NeuForm Website Work Rules and Master Operating Document.
7. NeuForm Fitness OS Blueprint as an internal design guardrail, not public marketing copy.
8. Older V3 packages, screenshots, or archived reports.

No implementation may silently replace current live behavior with an older package.

## 4. Locked project direction

### 4.1 Meaningful visual refinement

The approved approach is a meaningful visual refinement.

It will preserve the existing workflows and product logic while changing the responsive composition, visual hierarchy, typography, surface system, stage presentation, forms, navigation, and supporting states.

This is more substantial than a CSS cleanup but intentionally narrower than a full redesign.

### 4.2 Local-first architecture remains unchanged

- Exact lift records remain browser-local.
- Account state continues to verify Free, Pro, bundle, or uncertain access.
- No cross-device sync is added.
- No Neon, Render, or Vercel Strength Lab record API is added.
- Export, import, backup, and restore remain the continuity mechanisms.
- No exact lift evidence may be sent to analytics, checkout, marketing, account resolution, or external services.

### 4.3 Training-science and decision engines remain protected

V3.1.1 will not change:

- estimate formulas;
- evidence interpretation;
- comparability rules;
- recency handling;
- uncertainty penalties;
- setup matching;
- Free Today calculations;
- planned-exposure classification;
- warm-up construction;
- exact first-set calls;
- remaining-work decisions;
- progress thresholds;
- benchmark formulas;
- scoring formulas;
- personal-model limits;
- safety-stop behavior.

Presentation may clarify an engine result. It may not recalculate, reinterpret, or silently override it.

## 5. Project scope

### 5.1 In scope

This project includes the responsive and visual treatment of:

- page shell and workspace frame;
- Today;
- Lifts and setup;
- evidence entry and review;
- Free Today range;
- Pro session stages;
- recommendation and decision explanations;
- Progress;
- Compare;
- Intelligence;
- advanced modes;
- Data and Privacy;
- import, export, backup, restore, and reset surfaces;
- guest, Free, Pro, bundle, downgrade, access-uncertain, storage-warning, corrupted-state, and loading states;
- desktop navigation;
- mobile navigation;
- tablet portrait and landscape layouts;
- responsive typography;
- forms and controls;
- receipts and history;
- tables, charts, benchmark summaries, and text alternatives;
- empty, error, retry, and recovery states;
- focus, hover, active, disabled, selected, and validation states;
- responsive and accessibility QA;
- visual regression evidence;
- deployment, rollback, and release verification.

### 5.2 Out of scope

V3.1.1 will not include:

- new calculators;
- new strength equations;
- new recommendation categories;
- new training plans;
- cloud synchronization;
- wearable integration;
- camera or video analysis;
- AI chat coaching;
- subscription-price changes;
- Memberstack-plan changes;
- new Strength Lab tiers;
- My Library redesign;
- Tools Hub redesign;
- unrelated sitewide navigation work;
- Nutrition Lab changes;
- automatic plan changes;
- Reality Types changes;
- a full NeuForm app migration;
- additional public marketing claims unrelated to current behavior.

## 6. Design principles

### 6.1 One dominant action

Every visible state must answer:

1. What is happening now?
2. What should the user do next?
3. Why is that action appropriate?

Only one control may receive primary-action styling in the current workspace.

Secondary actions remain available but visually subordinate.

### 6.2 Active work over surrounding information

The current task receives the highest visual priority.

The hierarchy is:

1. current decision;
2. primary action;
3. required input;
4. concise reason and guardrail;
5. confidence and scope;
6. completed history;
7. methodology and secondary tools.

### 6.3 Progressive disclosure

The interface shows only the information required for the current decision.

- Advanced fields remain collapsed until relevant.
- Completed stages collapse into receipts.
- Future stages show status but not working forms.
- Provenance is available under “How this was decided.”
- Detailed methodology remains accessible without competing with the main task.

### 6.4 Calm premium presentation

Strength Lab will use the existing NeuForm visual direction:

- near-black and charcoal backgrounds;
- strong white primary text;
- readable muted secondary text;
- restrained NeuForm Blue `#3498db`;
- semantic green, amber, and red only when state meaning requires them;
- no decorative rainbow gradients;
- no neon visual language;
- no stock imagery;
- no unnecessary animation;
- no excessive glow;
- no decorative card proliferation.

### 6.5 Device-specific composition

Responsive design will not be treated as shrinking the desktop layout.

Phones, tablets, laptops, and large desktops receive deliberately different compositions while preserving one semantic document order and one underlying state model.

### 6.6 Accessibility is part of the visual system

Accessibility requirements are first-class design constraints, not a final cleanup.

The system must remain usable with:

- touch;
- mouse;
- keyboard only;
- screen-reader navigation;
- 200% zoom;
- reduced motion;
- forced colors;
- high contrast;
- mobile safe-area insets;
- landscape orientation.

## 7. Visual system

### 7.1 Surface hierarchy

The current interface uses too many similarly weighted boxes. V3.1.1 will use six intentional surface levels.

#### Level 0: page canvas

Purpose: quiet background and overall brand atmosphere.

Treatment:

- near-black base;
- subtle radial tonal lift near the current workspace, not a decorative gradient across the whole page;
- no visible border;
- no texture that harms text contrast.

#### Level 1: workspace

Purpose: contain the current task.

Treatment:

- slightly lighter charcoal than the page canvas;
- restrained radius;
- generous spacing;
- minimal or no border on wide screens;
- thin border only when needed to maintain separation on small screens or forced-color fallback.

#### Level 2: active decision

Purpose: display the recommendation and primary action.

Treatment:

- strongest tonal contrast;
- optional restrained blue edge, top rule, or soft shadow;
- larger recommendation typography;
- one primary button;
- concise reason and guardrail;
- never nested inside another equally strong card.

#### Level 3: supporting surface

Purpose: evidence summary, confidence, scope, contextual history, or secondary instructions.

Treatment:

- low-contrast charcoal;
- subtle separation through spacing and background tone;
- borders used selectively;
- smaller visual weight than the active decision.

#### Level 4: receipt

Purpose: summarize a completed stage or historical action.

Treatment:

- compact row or low-height card;
- status icon and short label;
- expandable details;
- no full working form;
- no unnecessary repeated explanation.

#### Level 5: control surface

Purpose: inputs, selectors, toggles, tables, and other direct interaction.

Treatment:

- clear field boundaries;
- visible labels;
- consistent height;
- sufficient contrast;
- obvious focus and error states;
- disabled state distinct from read-only state.

### 7.2 Border policy

Borders are not the primary separation device.

Use borders for:

- form controls;
- focus indication;
- active or selected state;
- true semantic warnings;
- tables when row/column reading requires them;
- forced-color compatibility.

Do not outline every card, receipt, section, and metadata block equally.

### 7.3 Radius policy

Use a small, consistent radius family.

- Controls: 8 to 10 CSS pixels.
- Supporting cards: 12 to 14 CSS pixels.
- Active workspace or modal: 14 to 18 CSS pixels.
- Pills only for compact status labels, filters, or segmented choices.

Avoid excessive rounded rectangles that make every element look like a button.

### 7.4 Elevation policy

Elevation is reserved for:

- active decision surface;
- modal or drawer;
- mobile navigation;
- sticky primary action when used;
- temporary menus.

Static supporting sections should rely on tone and spacing rather than shadows.

### 7.5 Color tokens

The implementation must centralize color values in semantic CSS custom properties rather than repeat raw colors throughout components.

Required semantic families:

- `--nfsl-canvas`;
- `--nfsl-workspace`;
- `--nfsl-surface`;
- `--nfsl-surface-raised`;
- `--nfsl-control`;
- `--nfsl-text-primary`;
- `--nfsl-text-secondary`;
- `--nfsl-text-muted`;
- `--nfsl-border-subtle`;
- `--nfsl-border-strong`;
- `--nfsl-accent`;
- `--nfsl-accent-hover`;
- `--nfsl-accent-pressed`;
- `--nfsl-success`;
- `--nfsl-warning`;
- `--nfsl-danger`;
- `--nfsl-focus`;
- `--nfsl-overlay`.

The exact values must pass contrast checks in the implementation plan before publication.

### 7.6 Spacing tokens

Use a predictable spacing scale:

- 4;
- 8;
- 12;
- 16;
- 20;
- 24;
- 32;
- 40;
- 48;
- 64 CSS pixels.

Components should use tokens rather than arbitrary one-off values.

Mobile defaults should favor 16-pixel section padding and 20-to-24-pixel section gaps. Desktop workspaces may use 24-to-40-pixel internal spacing according to information density.

## 8. Typography system

### 8.1 General rules

- Inter remains the primary interface font.
- Font size must never be used to hide complexity.
- Supporting text must remain readable, not merely present.
- Line length should generally remain between 45 and 75 characters for explanatory prose.
- Labels must remain visible after a field contains a value.
- Numeric outputs should use tabular numerals when alignment improves comprehension.
- Raw ISO dates and machine state names must not appear in normal UI.

### 8.2 Responsive type scale

#### Phones, 320 to 430 CSS pixels

- Main page title: 28 to 34 pixels.
- Active recommendation: 26 to 32 pixels.
- Section heading: 20 to 24 pixels.
- Card heading: 17 to 20 pixels.
- Body: 16 to 17 pixels.
- Input text: minimum 16 pixels.
- Supporting text: minimum 14 pixels.
- Microcopy: minimum 13 pixels only when nonessential and still contrast-compliant.

#### Tablets, 768 to 1024 CSS pixels

- Main page title: 34 to 40 pixels.
- Active recommendation: 32 to 38 pixels.
- Section heading: 24 to 28 pixels.
- Body: 16 to 18 pixels.

#### Laptops and desktops, 1280 CSS pixels and above

- Main page title: 40 to 52 pixels according to layout.
- Active recommendation: 34 to 44 pixels.
- Section heading: 26 to 32 pixels.
- Body: 16 to 18 pixels.
- Context-panel body: 15 to 16 pixels.

### 8.3 Hierarchy for material recommendations

A material recommendation displays:

1. eyebrow label, such as “Recommended first set”;
2. large recommendation value;
3. one-sentence reason;
4. confidence label;
5. guardrail;
6. scope;
7. expandable provenance.

The value must not be visually equal to metadata.

## 9. Responsive layout architecture

### 9.1 Supported layout bands

The implementation will use content-driven breakpoints aligned to these design bands:

- compact phone: 320 to 359 pixels;
- standard phone: 360 to 430 pixels;
- large phone and compact tablet: 431 to 767 pixels;
- tablet: 768 to 1023 pixels;
- compact laptop: 1024 to 1279 pixels;
- desktop: 1280 to 1599 pixels;
- large desktop: 1600 pixels and above.

The design bands guide composition. Components may use container queries when their behavior depends on available component width rather than viewport width.

### 9.2 Compact phone, 320 to 359 pixels

Required composition:

1. compact product header;
2. current lift and status;
3. active decision;
4. primary action or active form;
5. concise reason and guardrail;
6. collapsed completed stages;
7. secondary tools;
8. safe-area-aware mobile navigation.

Rules:

- one column only;
- no side-by-side form fields unless both remain at least 136 pixels wide and the relationship is essential;
- body and input text remain readable;
- completed stages use one-line receipts;
- tables transform into readable cards or scroll within a labeled local container rather than causing page overflow;
- sticky primary action is allowed only when it does not cover form errors, keyboard content, or navigation;
- no horizontal page scroll.

### 9.3 Standard phone, 360 to 430 pixels

Use the same document order as compact phone with slightly more generous spacing.

Logically paired values may appear in two columns only when:

- both labels fit without truncation;
- both controls retain 44-pixel minimum height;
- each control retains adequate width;
- the pair is easier to understand together than stacked.

### 9.4 Mobile landscape

At approximately 568 to 932 pixels wide and limited height:

- navigation must not consume excessive vertical space;
- the active form remains reachable without nested scrolling;
- primary actions remain visible after the on-screen keyboard opens;
- stage summaries may move to a compact horizontal progress strip;
- the layout must not assume portrait orientation.

### 9.5 Tablet portrait, 768 to 1023 pixels

Use a focused primary column with a compact stage summary.

- Main workspace max width: approximately 720 to 820 pixels.
- Completed stages appear as compact receipts above or below the active workspace.
- Forms may use two columns for related fields.
- Decision explanations remain full width.
- Secondary context appears after the active task, not beside it when that would narrow the active form.

### 9.6 Tablet landscape and compact laptop, 1024 to 1279 pixels

Use a two-region composition:

- context and stage rail: approximately 28 to 34 percent;
- active workspace: approximately 66 to 72 percent.

The stage rail includes:

- selected lift;
- current session stage;
- compact completed-stage receipts;
- future-stage status;
- a subordinate exit or switch-lift action.

The rail may become sticky when it remains within the viewport and does not create nested scroll traps.

### 9.7 Desktop, 1280 to 1599 pixels

Use a three-region composition when context is genuinely useful:

- left rail: navigation and stage context;
- primary workspace: current decision and active task;
- optional context panel: recent evidence, confidence, or relevant comparison.

The optional context panel must collapse when it has no current decision value.

Recommended proportions:

- left rail: 220 to 260 pixels;
- primary workspace: 620 to 820 pixels;
- context panel: 280 to 340 pixels;
- total controlled max width: approximately 1180 to 1380 pixels.

### 9.8 Large desktop, 1600 pixels and above

The interface remains centered in a controlled maximum width.

- Do not stretch prose or form fields across the full screen.
- Increase whitespace before increasing component width.
- Context panels may gain breathing room but not new information merely to fill space.
- The primary workspace remains visually dominant.

## 10. Navigation design

### 10.1 Desktop and tablet navigation

Primary navigation remains task-oriented:

- Today;
- Lifts;
- Progress;
- Compare;
- More.

Requirements:

- current section visibly selected;
- navigation does not resemble a row of equal primary CTAs;
- “More” opens a menu or drawer containing Intelligence, Data and Privacy, Import and Export, Advanced Modes, Help, and other secondary destinations;
- keyboard focus order follows visual order;
- current location is announced semantically;
- no exact strength data appears in the URL.

### 10.2 Mobile navigation

Mobile bottom navigation contains:

- Today;
- Lifts;
- Progress;
- More.

Compare remains available contextually and under More.

Requirements:

- minimum 44-pixel targets;
- safe-area padding;
- selected-state text and icon treatment, not color alone;
- no overlap with sticky primary action;
- no hidden form controls behind the navigation;
- landscape fallback may use a compact side or top strip when bottom navigation would consume excessive height.

## 11. Today workspace

### 11.1 Returning-user header

Returning users see a compact status header, not a repeated welcome page.

It includes:

- selected lift;
- current evidence state;
- current task;
- one primary action;
- storage or access warning only when relevant.

### 11.2 Active decision card

The active decision card contains:

- current decision label;
- main output;
- one-sentence reason;
- primary action;
- confidence;
- guardrail;
- scope;
- collapsed provenance.

The card must be the first visually dominant element after the compact product header.

### 11.3 Free Today

Free Today remains valuable and clearly bounded.

Display order:

1. supported range or honest unavailable state;
2. one primary action;
3. reason;
4. confidence;
5. guardrail;
6. best next evidence;
7. subordinate explanation of what Pro adds.

The Pro preview must not visually dominate the Free result.

### 11.4 Pro Today

Pro Today shows only the active stage in full.

Completed stages collapse. Future stages remain status-only.

The current stage contains the working form, recommendation, or review action needed now.

## 12. Session-stage presentation

### 12.1 Stage model

The eight existing customer stages remain:

1. Plan;
2. Warm-up;
3. Final checkpoint;
4. Exact call;
5. First set;
6. Remaining work;
7. Review;
8. Next exposure.

### 12.2 Phone presentation

Use a compact header:

> Stage 4 of 8 · Exact call

Show:

- current stage title;
- short state description;
- active decision or form;
- compact completed-stage list;
- future-stage summary.

Completed stages display:

- status icon;
- stage label;
- short receipt summary;
- expand control.

### 12.3 Tablet and desktop presentation

Use a vertical progress rail.

Statuses:

- complete;
- current;
- not ready;
- requires review;
- stopped for safety.

Only the current stage displays a full form.

### 12.4 Corrections and invalidation

When an earlier input changes:

- show which downstream decisions will be cleared before confirmation;
- preserve unaffected records;
- move focus to the earliest affected stage;
- show a concise confirmation after invalidation;
- never silently erase completed work.

## 13. Forms and controls

### 13.1 Labels

- Every field has a persistent visible label.
- Placeholder text is not a label.
- Units appear adjacent to or inside the control without ambiguity.
- Required fields are identified through text and semantics, not color alone.

### 13.2 Input sizing

- Minimum control height: 44 pixels.
- Preferred touch control height: 48 pixels.
- Mobile input font: minimum 16 pixels.
- Numeric fields use appropriate input modes.
- Stepper buttons, when present, meet touch-target requirements.

### 13.3 Field grouping

Use clear groups for:

- load and units;
- repetitions and effort;
- setup and equipment;
- technique and confidence;
- bodyweight or assistance context;
- dates and comparison ranges.

Advanced fields remain collapsed unless required by the selected lift or current evidence.

### 13.4 Validation

Validation must be:

- adjacent to the field;
- announced to assistive technology;
- preserved until corrected;
- specific about what is wrong;
- free of raw internal codes;
- non-destructive.

A top-level error summary appears for multi-field failures and moves focus to the first invalid field when activated.

### 13.5 Buttons

Button hierarchy:

- primary: one per active task;
- secondary: supporting action;
- tertiary: text or quiet button;
- destructive: visually and spatially separated;
- disabled: distinguishable from unavailable due to access or missing evidence.

Button labels describe the result, such as “Record first set,” not vague labels such as “Continue” when a more specific label is possible.

## 14. Receipts and history

Receipts must be compact, readable, and expandable.

Default receipt content:

- human-readable event name;
- local date and time;
- key result;
- confidence or status when relevant;
- expansion control.

Expanded receipt may include:

- evidence used;
- setup;
- customer-safe reasoning;
- engine version;
- immutable IDs only inside an explicitly technical or export context.

Historical lists must avoid repeated full explanation blocks.

## 15. Progress design

Progress must answer:

1. What changed?
2. Is the change larger than uncertainty?
3. Are the records comparable?
4. What should happen next?

Visual hierarchy:

- current progress conclusion;
- comparison range or trend;
- uncertainty explanation;
- comparable-record summary;
- primary next action;
- chart or table;
- methodology details.

Charts require:

- visible labels;
- non-color encoding where practical;
- text alternatives;
- responsive axes;
- no truncated values;
- a table or summary for screen-reader and high-zoom use.

On phones, detailed tables may become stacked records. They must not force page-level horizontal scrolling.

## 16. Compare design

Compare retains five routes:

- Personal comparison;
- Benchmarks;
- Scoring;
- Advanced modes;
- Sources and methodology.

The first screen prioritizes personal comparison. Benchmark and scoring tools remain secondary.

Benchmark result design includes:

- result;
- cohort;
- sample size;
- source date;
- confidence;
- eligibility limitations;
- unavailable reason when withheld.

No decorative rank meter may imply precision unsupported by the benchmark source.

## 17. Intelligence design

Intelligence answers four questions:

1. What has Strength Lab learned?
2. How reliable is it?
3. Is it affecting recommendations?
4. What evidence improves it next?

Display order:

- plain-language learning summary;
- reliability state;
- active or inactive influence state;
- generic versus personalized comparison when relevant;
- next useful evidence;
- controls to enable or disable personal influence;
- methodology details.

Technical terms such as policy flags, source counts, or raw model-health codes remain translated into customer language.

## 18. Lifts and setup design

The Lifts workspace should emphasize active profiles and current evidence rather than a dashboard of equally weighted tools.

### 18.1 Lift list

Each lift row or card contains:

- lift name;
- setup summary;
- latest usable evidence;
- current estimate status;
- one contextual action;
- overflow menu for secondary actions.

### 18.2 Lift setup

The guided setup retains three stages:

1. choose a lift;
2. confirm setup, equipment, units, and loading model;
3. record the first useful evidence.

On phones, show one stage at a time. On tablets and desktops, a compact progress summary may remain visible.

## 19. More, Data, and recovery surfaces

Secondary destinations must remain easy to find without competing with Today.

### 19.1 More menu

Contains:

- Intelligence;
- Compare when not contextually visible;
- Advanced Modes;
- Data and Privacy;
- Import and Export;
- Help;
- account and billing link when appropriate.

### 19.2 Data and Privacy

The page clearly explains:

- records are browser-local;
- account access does not create cross-device sync;
- clearing site data can remove records;
- export and backup provide continuity;
- downgrade does not erase valid saved records;
- exact lift evidence is not sent to checkout or marketing analytics.

### 19.3 Recovery actions

Backup, restore, import, and reset actions must:

- preview consequences;
- identify affected records;
- separate reversible from destructive actions;
- require confirmation for destructive changes;
- never place reset beside the primary task action;
- preserve recovery guidance after failure.

## 20. Loading, empty, error, and degraded states

### 20.1 Loading

- Show a stable skeleton or concise loading state.
- Avoid layout jumps when the runtime resolves.
- Do not show multiple competing spinners.
- Preserve the current local-data statement.

### 20.2 Empty state

An empty state includes:

- what is missing;
- why it matters;
- one primary action;
- an optional explanation.

### 20.3 Access uncertainty

When paid access cannot be verified:

- do not grant Pro optimistically;
- do not erase local data;
- show retry;
- show current Free-safe capability;
- provide Support when retry fails;
- avoid instructing the user to pay again.

### 20.4 Storage warning

When storage is unavailable or memory-only:

- show a persistent but non-blocking warning;
- explain that changes may not survive refresh;
- provide export when possible;
- provide recovery guidance;
- keep the current task usable when safe.

### 20.5 Runtime or asset failure

The failure state must:

- say Strength Lab could not finish loading;
- confirm that local data was not intentionally erased;
- provide refresh and Support actions;
- expose a concise technical status only in an expandable detail;
- avoid raw stack traces in normal UI.

## 21. Accessibility specification

### 21.1 Semantics

Required landmarks:

- one main landmark;
- one primary navigation landmark;
- labeled secondary navigation when present;
- labeled forms;
- labeled sections;
- dialog semantics for modal or drawer surfaces.

### 21.2 Focus

- Focus order follows the visual task order.
- Opening a drawer or modal moves focus inside.
- Closing restores focus to the invoking control.
- Stage completion moves focus to the new stage heading or status.
- Validation moves focus only through an intentional user action or submit failure.
- No focus is lost during access retry or rerender.

### 21.3 Screen-reader announcements

Use polite live regions for:

- saved record confirmation;
- stage completion;
- access-state change;
- import or restore result;
- noncritical validation summary.

Use assertive announcements only for safety stop or destructive failure states.

### 21.4 Zoom and reflow

At 200% zoom:

- no two-dimensional page scrolling for normal text and controls;
- navigation remains usable;
- forms reflow to one column when necessary;
- charts provide readable alternatives;
- sticky elements do not cover content.

### 21.5 Reduced motion

Disable nonessential:

- card transitions;
- stage sliding;
- animated counters;
- decorative fades.

State changes remain visible without motion.

### 21.6 Forced colors and high contrast

- borders remain visible;
- selected and focus states do not depend on background color alone;
- semantic icons retain meaning through text labels;
- charts and status indicators include patterns, labels, or shapes where needed.

## 22. Motion and feedback

Motion is functional and brief.

Allowed:

- short expand/collapse transition;
- subtle stage-change transition;
- focus movement after successful completion;
- brief save confirmation.

Not allowed:

- long entrance animations;
- continuous background motion;
- delayed number reveals;
- large parallax effects;
- motion that hides state changes;
- celebration effects after routine entries.

## 23. Performance specification

The visual refinement must not materially degrade interaction speed.

### 23.1 Runtime requirements

- No new framework dependency solely for visual polish.
- No image-heavy visual system.
- No duplicate runtime.
- No inline copy of the full external runtime in Webflow.
- Current integrity verification and versioned asset model remain intact unless replaced by a demonstrably safer release mechanism.

### 23.2 Interaction requirements

Target budgets:

- no unexpected layout shift above 0.10;
- no more than one long task above 50 ms per measured interaction in the established harness;
- one active form in a Pro session;
- zero inactive future-stage forms;
- active-stage DOM remains bounded;
- no horizontal page overflow at target viewports;
- no hidden duplicated interfaces for different breakpoints.

### 23.3 CSS requirements

- Shared tokens and component rules are centralized.
- Breakpoint overrides are minimal and intentional.
- Container queries are preferred where component width determines behavior.
- Avoid highly specific selectors and repeated `!important` overrides.
- Remove obsolete visual rules only after source and live dependency checks.

## 24. Data and state preservation

V3.1.1 must preserve:

- `nf.strengthLab.v3`;
- `nf.strengthLab.v3.backup`;
- supported V2 and V1 migration keys;
- valid current records;
- lift profiles;
- unit preference;
- current local session state;
- completed receipts;
- downgrade-preserved data;
- account isolation behavior.

Visual state may add a namespaced preference key only when the preference is genuinely useful and nonessential, such as whether a detail panel is collapsed. Such preferences may not contain exact lift evidence and may not affect engine results.

## 25. Analytics and privacy

The visual pass may retain or add coarse interaction events only when they help understand usability.

Allowed examples:

- workspace viewed;
- primary action selected;
- detail expanded;
- validation error category;
- recovery action opened;
- access retry selected.

Disallowed payloads include:

- lift names when custom;
- exact load;
- repetitions;
- RPE or RIR;
- bodyweight;
- exact dates of completed sets;
- notes;
- health or pain details;
- email address;
- Memberstack identity in marketing analytics.

## 26. Verification matrix

### 26.1 Required viewport matrix

Fresh browser verification must cover:

- 320 × 568;
- 360 × 800;
- 390 × 844;
- 430 × 932;
- 667 × 375 mobile landscape;
- 844 × 390 mobile landscape;
- 768 × 1024 tablet portrait;
- 1024 × 768 tablet landscape;
- 1280 × 720 compact laptop;
- 1366 × 768 common laptop;
- 1440 × 900 desktop;
- 1920 × 1080 large desktop;
- at least one viewport wider than 1920;
- 200% zoom at a laptop viewport;
- 200% zoom at a mobile or compact viewport where supported by the harness.

### 26.2 Required product states

Fresh evidence must cover:

- guest loading;
- logged-out access prompt;
- first-use Free;
- returning Free;
- Free Today range;
- Pro plan stage;
- Pro warm-up stage;
- Pro exact-call stage;
- Pro first-set form;
- Pro remaining-work result;
- session review;
- next exposure;
- Progress with comparable data;
- Progress with insufficient or noncomparable data;
- Compare personal;
- benchmark available;
- benchmark unavailable;
- Intelligence cold start;
- Intelligence usable;
- advanced mode relevant;
- advanced mode unavailable;
- data export;
- import preview;
- restore preview;
- storage unavailable;
- corrupted state recovery;
- access uncertain;
- downgrade;
- account switch;
- validation errors;
- long lift names;
- large numeric values;
- empty history.

### 26.3 Required input and accessibility modes

- touch;
- mouse;
- keyboard only;
- screen-reader semantics inspection;
- reduced motion;
- forced colors;
- high contrast;
- software keyboard open;
- orientation change;
- browser back and forward;
- page refresh during active session.

### 26.4 Visual-regression evidence

Each approved release candidate must produce:

- baseline screenshot set;
- candidate screenshot set;
- image-diff report;
- human review notes for intentional differences;
- unique screenshot hashes;
- overflow and clipping report;
- console and page-error report;
- interaction-performance report.

## 27. Acceptance criteria

V3.1.1 is acceptable only when all of the following are true.

### 27.1 Source integrity

- The exact current V3.1 source is reconstructed or retrieved.
- The complete test command runs from a real package root.
- The missing-worktree `ENOENT` condition is eliminated.
- The pre-change baseline test result is recorded.
- The live deployment asset and source package are mapped.

### 27.2 Visual hierarchy

- The active decision is visibly dominant.
- One primary action is clear in every tested state.
- Completed stages no longer appear as equally weighted full cards.
- Supporting details do not compete with the current task.
- Border density is materially reduced without losing structure.

### 27.3 Responsive quality

- No page-level horizontal overflow at required viewports.
- No required control is covered by navigation or sticky actions.
- Active forms remain usable with the software keyboard.
- Tablet portrait and landscape have intentional compositions.
- Large desktops use available space without excessive line length or uncontrolled stretching.
- 200% zoom remains usable.

### 27.4 Readability

- Mobile body text remains at least 16 pixels for primary content.
- Input text remains at least 16 pixels on mobile.
- Supporting text remains readable and contrast-compliant.
- Long labels and values wrap without clipping.
- Timestamps and metadata remain subordinate but legible.

### 27.5 Accessibility

- Keyboard flows pass.
- Focus is preserved through rerenders and access retries.
- All dialogs and drawers restore focus.
- Forms expose labels and errors correctly.
- Reduced-motion and forced-color tests pass.
- Charts have text alternatives.

### 27.6 Function and data integrity

- Protected engine hashes are unchanged.
- Existing local records survive the update.
- Active sessions resume correctly.
- upgrade, downgrade, logout, login, account switch, and access uncertainty do not delete valid records.
- No exact strength data appears in external requests or analytics.

### 27.7 Performance and deployment

- The established performance budgets pass.
- Runtime and stylesheet assets load successfully.
- Version and integrity attributes match the release manifest.
- Rollback is prepared before publication.
- Live QA passes on both `www` and apex production domains.

## 28. Implementation checkpoints

### Checkpoint 1: Reconstruct and verify the V3.1 baseline

- retrieve the exact current source and hosted assets;
- identify the canonical repository or package root;
- restore a working test environment;
- run the complete existing test suite;
- recreate protected-engine hashes;
- capture current live Webflow configuration;
- capture current responsive screenshots and browser metrics;
- produce a rollback snapshot.

No visual implementation begins until this checkpoint passes.

### Checkpoint 2: Visual tokens and primitives

- centralize color, type, spacing, radius, border, shadow, focus, and motion tokens;
- refine buttons, controls, fields, cards, receipts, status labels, and drawers;
- add deterministic visual-component tests where practical;
- produce phone and desktop primitive sheets.

### Checkpoint 3: Phone-first composition

- implement 320-to-430-pixel layouts;
- reduce stage-card density;
- refine mobile navigation and safe-area behavior;
- refine active decision and form hierarchy;
- test software keyboard and landscape behavior.

### Checkpoint 4: Tablet and laptop composition

- implement tablet portrait;
- implement tablet landscape and compact laptop rail;
- verify paired-field layouts;
- verify sticky rail behavior;
- verify 200% zoom.

### Checkpoint 5: Desktop and large-screen composition

- implement controlled three-region layout;
- refine optional context panel;
- improve line length and whitespace;
- verify 1280, 1366, 1440, 1920, and wider screens.

### Checkpoint 6: Workspace-by-workspace refinement

Apply the visual system to:

- Today;
- Pro session;
- Lifts;
- evidence entry and review;
- Progress;
- Compare;
- Intelligence;
- advanced modes;
- More;
- Data and Privacy;
- import, export, restore, and reset;
- loading, empty, error, and recovery states.

### Checkpoint 7: Accessibility and performance closure

- run keyboard and focus tests;
- run semantics and announcement tests;
- run reduced-motion and forced-color tests;
- run DOM, long-task, layout-shift, and overflow measurements;
- correct regressions before packaging.

### Checkpoint 8: Release candidate and controlled cutover

- set release version `3.1.1`;
- build deterministic release assets;
- generate manifest and hashes;
- snapshot Webflow before changes;
- stage the exact candidate;
- run full browser matrix;
- publish only after approval;
- run live QA on both production domains;
- roll back immediately for a critical regression.

## 29. Rollback contract

Before publication, preserve:

- current V3.1 runtime and stylesheet URLs;
- current asset hashes and byte counts;
- current Webflow page head;
- current before-body or footer loader;
- current mount markup;
- current page topology and element IDs;
- current local-storage compatibility tests;
- current live screenshots;
- exact rollback steps.

Rollback must restore V3.1 without changing schema, storage keys, plans, prices, or customer records.

## 30. Explicit non-goals

V3.1.1 will not attempt to make Strength Lab visually resemble a social app, gaming interface, stock-trading terminal, or generic SaaS admin dashboard.

It will not add decorative complexity to create the appearance of intelligence.

It will not hide uncertainty, safety boundaries, or local-data limitations for a cleaner screenshot.

It will not introduce a new component library merely for style consistency if the current package can support a focused token and primitive layer.

It will not sacrifice mobile use between sets in order to create a denser desktop dashboard.

## 31. Final locked decisions

1. Approach B, meaningful visual refinement, is approved.
2. Product logic and training-science engines remain unchanged.
3. The project is phone-first but not phone-only.
4. Today and the active Pro stage remain the visual center.
5. Completed stages collapse into compact receipts.
6. Desktop gains a stage/context rail and optional context panel.
7. Border density is reduced through a semantic surface system.
8. NeuForm Blue is concentrated around active state, focus, and primary action.
9. Browser-local data ownership remains explicit.
10. Current commercial identifiers remain unchanged.
11. A complete source and verification baseline must be restored before implementation because the archived final npm log does not prove a passing repository verification.
12. No production change occurs until a rollback snapshot and fresh full verification exist.

## 32. Approval boundary

This specification authorizes creation of a detailed implementation plan only.

It does not authorize immediate production edits.

Implementation begins after the written specification is reviewed and the checkpoint-by-checkpoint plan is approved.
