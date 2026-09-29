# Reality Types Template v3.1.7 Release Note

Date: 2026-09-28
Webflow site: 65d26f254c0a038c1f9198e6
Webflow collection template page: 692cde9c78f04f76b05e3f50

## Current production authority

The published Webflow Reality Types collection template is currently on presentation-polish authority v3.1.7, layered over the existing result, presentation, experience, current Blueprint, and historical Blueprint runtimes.

Until the historical raw-code mirror is refreshed, use the live Webflow template as the source of truth for this surface rather than restoring older template text from this repository.

## Implemented changes

- Removed duplicate custom canonical and duplicate Twitter-card ownership. Webflow now owns the single canonical and native metadata output.
- Added WebPage + Breadcrumb structured data at runtime for current public/saved/local Reality Types surfaces.
- Brought public-reference, local-result, and saved-result typography into the current NeuForm Plus Jakarta Sans / Inter hierarchy.
- Increased undersized overview labels to a readable minimum.
- Preserved the historical-purchase experience without applying current-result polish.
- Changed customer-facing "archetype" language to "reference pattern" / "reference matches".
- Reframed saved-result verification around repeated evidence rather than "Does this feel accurate?"
- Reframed the seven-day experiment as a real-world test of the interpretation.
- Reorganized the Reality Map visually into three domain columns with mode cards and aligned coordination cards, without moving provider-owned DOM nodes.
- Updated copy-summary output to include all nine scores and closest-reference wording.
- Standardized interpretation headings such as "Where this pattern can help", "Where this pattern can create friction", and "Training and recovery reflection".
- Reduced public-reference CTA duplication.
- Improved Overview action hierarchy for saved/local results.
- Added Reality Types template view/action/section analytics under the nf_reality_types_* event family.
- Added current Blueprint presentation polish: wider readable content surface, separate part panels over the shared rocky background, clearer part/chapter hierarchy, larger TOC labels, and preserved deep-dive disclosure.
- Kept the current Blueprint at 12 substantive chapters and preserved historical Blueprint access separately.
- Aligned the current customer-facing type name "The Structured Insight Lens" while retaining the historical slug structured-empathic-lens.

## QA completed

- All 12 public Reality Type URLs returned HTTP 200.
- All 12 had exactly one H1, one canonical, one Twitter-card declaration, no duplicate DOM IDs, no horizontal overflow, and current reference-pattern language.
- All 12 public pages had zero visible Overview text elements below 12px in the final smoke pass.
- Representative desktop and mobile local-result simulations passed without horizontal overflow.
- Historical purchase mode remained isolated: historical mount visible, current Blueprint mount hidden, no v3.1.x polish applied.
- Copy Result Summary was verified to output closest-reference wording plus all nine scores.
- Structured Insight Lens title, H1, and SEO metadata were verified live.


## v3.1.7 final stabilization

- Final production smoke test passed across all 12 public reference profiles.
- Each page resolved HTTP 200, one H1, one canonical, one Twitter-card declaration, runtime JSON-LD, 3 mode-domain cards, 3 coordination cards, no duplicate IDs, no horizontal overflow, and zero visible Overview labels below 12px.
- Current customer-facing names are aligned to The Structured Insight Lens and The Resonant Integrator while preserving historical slugs.
- Historical purchase mode remains isolated from current-result polish.
