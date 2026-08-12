# NeuForm Strength Lab 3.1.5 Production Release Lock

Release date: 2026-08-12

Status: production boot repair verified

## Production authority

- Webflow site: `65d26f254c0a038c1f9198e6`
- Webflow page: `68d84107f5fa5f83c9e61823`
- Canonical route: `https://www.neuform-fitness.com/tools-strength-lab`
- Additional production domain: `https://neuform-fitness.com/tools-strength-lab`
- Immutable runtime tag: `strength-lab-v3.1.5-runtime`
- Release directory: `assets/strength-lab-v3/releases/3.1.5`
- Release manifest: `assets/strength-lab-v3/releases/3.1.5/manifest.json`
- Storage schema: `3`
- Storage key: `nf.strengthLab.v3`
- Cloud synchronization implemented: `false`

## Verified boot contract

The initial Webflow HTML now contains a branded, accessible Strength Lab shell before any external runtime request completes. The mount carries both `data-nfsl-release-host` and `data-nfsl-v3-root`, reserves a useful workspace height, and provides loading, delayed-loading, failure, Retry, support, and local-record reassurance states.

Exactly one 3.1.5 loader owns runtime execution. It fetches the immutable release manifest, validates the release version, storage schema, storage key, cloud-sync truth, runtime path, byte counts, and SHA-256 declarations, then verifies both the compressed gzip payload and decompressed JavaScript before execution. Runtime assets use cache reuse rather than `no-store`. The former missing Pass 7 runtime URL and footer loader are not part of the published page.

## Production verification

Both production domains passed the post-publish HTML and asset gate. The immutable manifest and runtime passed compressed and decompressed byte-count and SHA-256 verification.

Eleven independent Chromium scenarios passed:

1. Cold desktop load on the canonical domain.
2. Warm reload on the canonical domain.
3. Cold desktop load through the bare production domain.
4. Mobile portrait.
5. Tablet portrait.
6. Mobile landscape.
7. Delayed runtime with a visible delayed-loading state and eventual recovery.
8. Manifest failure with visible error, Retry, and successful recovery.
9. Corrupted runtime rejection before execution, followed by successful Retry.
10. Memberstack unavailable with a usable Free-safe local interface and paid capability closed.
11. Offline after a completed boot with the local interface and a deterministic local sentinel preserved.

The completed browser state reported product version `3.1.5`, storage key `nf.strengthLab.v3`, cloud synchronization disabled, account synchronization disabled, one verified runtime script, and UI-ready status.

## Data safety

This release does not migrate, delete, upload, or synchronize Strength Lab records. It does not modify the Strength Lab storage schema or storage key. Network or entitlement failure does not disable the local Free-safe interface after the runtime is available. Exact strength data, bodyweight, notes, health information, and email are not added to boot telemetry.

## Commercial and infrastructure scope

No Stripe product, price, subscription, payment, refund, or test purchase was changed. No Memberstack plan, price, entitlement, or real customer account was modified. No Neon customer record or synchronization collection was changed. No Render or Vercel application service was changed for this boot release.

## Known implementation note

The original page-head initializer still contains the historical Pass 7 default value because it also owns the current full application stylesheet. Before the runtime executes, a dedicated release configuration embed deterministically replaces the effective product version with `3.1.5`, preserves schema `3` and storage key `nf.strengthLab.v3`, and explicitly sets cloud and account synchronization to disabled. There is no second runtime owner. A future source-consolidation release may remove the historical initializer text without changing behavior.

## Cloud-sync gate

Cross-device cloud synchronization remains blocked. It may begin only after this production boot release remains stable under continued observation and the typed Strength Lab synchronization contracts, canonical identity exchange, authoritative entitlement model, migration safety, conflict policy, downgrade behavior, deletion model, and support procedures are approved and implemented.
