# NeuForm Strength Lab 3.1.5 Production Release Lock

Status: production boot repair deployed and verified
Verified: 2026-08-12 UTC

## Production authority

- Canonical route: `https://www.neuform-fitness.com/tools-strength-lab`
- Alternate production domain: `https://neuform-fitness.com/tools-strength-lab`
- Runtime tag: `strength-lab-v3.1.5-release`
- Complete stylesheet tag: `strength-lab-v3.1.5-complete-release`
- Runtime manifest: `assets/strength-lab-v3/releases/3.1.5/runtime-manifest.json`
- Style manifest: `assets/strength-lab-v3/releases/3.1.5/webflow-style-manifest.json`
- Storage key: `nf.strengthLab.v3`
- Schema version: `3`
- Cloud synchronization: not implemented

## Locked boot behavior

The initial HTML contains a branded, accessible Strength Lab shell and reserves a useful workspace before JavaScript executes. The boot loader exposes loading, delayed-loading, failure, Retry, and Support states while reassuring the customer that local records remain in the browser.

The release uses one manifest-driven runtime owner. It verifies the compressed asset, verifies the decompressed runtime, and blocks duplicate execution. The immutable 3.1.5 stylesheet and runtime use GitHub release tags with jsDelivr delivery and raw-GitHub fallback. Free/local initialization does not wait indefinitely for Memberstack, while paid capability remains closed until access resolves.

## Production verification

Both production domains passed the release gate for:

- cold and warm boot;
- desktop, tablet, and phone layouts;
- delayed asset delivery;
- failed asset delivery with visible Retry and successful recovery;
- compressed-runtime failure with verified uncompressed fallback;
- Memberstack-unavailable degradation;
- continued use after network loss once loaded;
- local-storage sentinel survival;
- exact one-runtime execution;
- runtime and stylesheet identity across GitHub raw and jsDelivr;
- immutable cache behavior;
- removal of the stale Pass 7 version and missing-runtime references;
- repeated fresh-context stability soaking.

No local record migration, deletion, or upload is part of this release. No exact strength, load, repetition, bodyweight, health, note, or email data is included in boot diagnostics.

## Dependency gate

This release lock completes the Strength Lab initial-load and boot-repair phase. It unlocks design and implementation of secure Strength Lab Pro cloud synchronization, but it does not represent or advertise cloud synchronization as available.
