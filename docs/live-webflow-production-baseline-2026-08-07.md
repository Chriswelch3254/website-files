# NeuForm Live Webflow Production Baseline — 2026-08-07

## Status

This document records the current production authority for the NeuForm Fitness website after the August 7, 2026 whole-site cleanup.

**Current live Webflow implementation wins when any older repository file, crawler snapshot, search index, export, or archived page code disagrees.**

Production domains:

- `https://neuform-fitness.com`
- `https://www.neuform-fitness.com`

Latest confirmed custom-domain full-site compile for this baseline:

- `2026-08-07T22:44:17.272Z`

Webflow site ID:

- `65d26f254c0a038c1f9198e6`

## Repository warning

The root `.txt` files and `on page embeds/*.txt` files in this repository are a historical Webflow source mirror. The latest repository commit before this baseline was March 3, 2026, while production Webflow continued evolving through August 7, 2026.

Do **not** paste an older repository file over live Webflow without first diffing it against the current Webflow source.

Until a complete Webflow export/sync refresh is performed, use this authority order:

1. Current published/staged Webflow implementation and current Webflow CMS.
2. Current connected commerce, entitlement, delivery, and application systems such as Stripe, Memberstack, Zapier, Vercel, Render, and Neon where applicable.
3. This August 7 production baseline and current release notes.
4. Older repository `.txt` mirrors and historical exports.

## Shared Webflow authorities

| Surface | Current Webflow authority |
|---|---|
| Shared Navbar | component `21a74cb5-71cc-f37c-afe6-ee1220ce97a2` |
| Shared Footer | component `cfac52d6-17ee-613d-9e9f-4d9da11ebb93` |
| Shared Plan Test / Finder | component `03d45b2a-10e7-51d2-fd54-ad9daeff6660` |
| Homepage | page `65d26f254c0a038c1f9198ec` |
| Training Plans Hub | page `65d4fe84ea98f5727822ffd7` |
| Personal Training | page `65d4f37fb823cb20e31b4330` |
| Tools Hub | page `68cc13a0c31ddbd0dc6c3774` |
| Nutrition Lab marketing | page `69fdfcf64f426bc6cbf292a0` |
| Nutrition Lab actual-use | page `6921dd11ded6784dc3587d6c` |
| Strength Lab marketing | page `6a6e0c1b669054aa4091bd78` |
| Strength Lab actual-use | page `68d84107f5fa5f83c9e61823` |
| My Library | page `6965cef9b3c716f158217cb3` |
| Automatic Plan | page `695c2808fe4607de7fa19371` |
| Nutrition Fundamentals | page `6a6903c5c73d7311ffd90f74` |
| Blog Hub | page `68cb5b34a9518e75d52c4a6a` |
| Results | page `68e5632901c5674aefef84d9` |
| About | page `68ae01e6a467334ce5310465` |
| Contact | page `68adff6ca0d0b3a5f75ac29b` |
| Support | page `69fcef6214a060a2418fc0de` |
| Terms & Privacy | page `68ace32a9f5904e5f133dc16` |

## Current site architecture

NeuForm uses a shallow public discovery layer and separate actual-use/account layers.

- Desktop primary navigation remains: Training Plans, Personal Training, Tools, Articles, Client Results.
- Marketing / comparison routes should own discovery where a separate application route exists.
- Actual-use Nutrition Lab: `/tools-nutrition-lab`.
- Nutrition Lab marketing: `/nutrition-lab`.
- Actual-use Strength Lab: `/tools-strength-lab`.
- Strength Lab marketing: `/strength-lab`.
- My Library is the account/access return point.
- Support is the recovery/support return point.
- Automatic Plan checkout is temporarily paused. Website CTAs must remain availability-aware until that state changes.

## Release-locked / current major surfaces

Do not casually replace these with older repository copies:

- Homepage: current V5.2 family.
- Training Plans Hub: current V8.6.1 family.
- Personal Training marketing: current V4.1 family.
- My Library: current V4.9.1 family.
- Tools Hub: current V12.1 family.
- Nutrition Lab marketing: current V13.0 family.
- Strength Lab marketing: current V10.0 family.
- Results: current V14.1 family.

## August 7 production changes represented by this baseline

The current Webflow release includes, among other live changes:

- Improved Homepage featured training-plan cards using stronger information hierarchy and owned plan cover imagery.
- Rebuilt Training Plans catalog decision cards without expanding the Training Plans CMS schema.
- Universal Training Log opt-in now uses its native success state instead of redirecting into the purchase Thank You flow.
- Personal Training restored to the sitemap while account/private utility routes were removed where appropriate.
- My Library is noindex and excluded from the sitemap.
- Strength Lab and Nutrition Lab marketing versus actual-use routing is more explicit.
- Strength Lab metadata no longer identifies the product as Nutrition Lab.
- Automatic Plan metadata and shared CTAs reflect paused checkout status.
- Shared drawer includes Strength Lab and uses Client Results naming.
- Contact metadata is no longer duplicated in footer custom code.
- About duplicate H1 was removed from published output and the founder image alt text was corrected.
- Actual-use Lab routes are intentionally excluded from the sitemap and receive noindex behavior while their marketing pages own organic discovery.
- Obsolete Online Training and legacy Webflow Ecommerce surfaces are contained with noindex rather than treated as current commerce.
- The prior body-wide cross-site state guard was retired. Remaining dynamic repair logic is scoped to the shared header, while page/product-specific behavior is owned locally.

## Current known debt intentionally not resolved by this baseline

### Manual 301 redirects

Webflow redirect management is not exposed through the available API on the current hosting plan. High-confidence redirects are documented separately in `docs/manual-webflow-redirects.md`.

### Reality Types V3

Reality Types / DLTER is being rebuilt in a separate active project. Do not reconcile its purchase-complete route, entitlement architecture, or premium Blueprint source from this repository baseline until that release is locked.

### Nutrition Lab Stripe legacy prices

Nutrition Lab currently has several active historical/malformed Stripe prices on the same product. They must not be deactivated until current Memberstack and production billing mappings are verified.

### Full code mirror refresh

This baseline prevents the old repository mirror from being mistaken for current production truth. It does **not** claim that every root `.txt` and `on page embeds/*.txt` file has been resynchronized to August 7 Webflow source.

## Safe sync protocol going forward

For future website releases:

1. Read current Webflow/CMS truth first.
2. Make controlled edits against current Webflow source.
3. Publish and verify production behavior.
4. Update the repository baseline or source mirror only from the verified current Webflow implementation.
5. Never use an older repository file as a blind replacement for a newer Webflow block.

This protocol exists to prevent a source-control rollback from silently reintroducing stale navigation, metadata, product availability, account, or conversion behavior.
