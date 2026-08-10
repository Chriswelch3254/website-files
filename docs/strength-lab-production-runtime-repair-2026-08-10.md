# Strength Lab production runtime repair

**Date:** 2026-08-10  
**Route:** `/tools-strength-lab`  
**Production domains:** `www.neuform-fitness.com`, `neuform-fitness.com`  
**Product version restored:** `3.0.0-pass7`  
**Schema:** `3`  
**Primary storage key:** `nf.strengthLab.v3`

## Why the repair was required

The production page still used the original modular footer bootstrap, but its 42 expected module embeds had been replaced with inert placeholder comments during an incomplete V3.1 cutover. That combination could leave the public product on its loading shell.

The archived file previously described as a passing final verification log also contained an `ENOENT` failure because the expected package root did not contain `package.json`. It was not valid completion evidence.

## Repair architecture

The last complete `3.0.0-pass7` runtime was reconstructed from the canonical 42-module package and its original bootstrap. The page now has one runtime owner:

1. Fetch the immutable repair runtime from the public source branch.
2. Require an exact byte count.
3. Verify SHA-256 through Web Crypto.
4. Execute only after both checks pass.
5. Show a fail-safe recovery message without deleting local data if loading or verification fails.

All 42 former body module slots are inert. The obsolete modular footer bootstrap was replaced by the verified loader recorded at:

`assets/strength-lab-v3/strength-lab-3-0-0-pass7-loader.js`

## Verified runtime

- Runtime path: `assets/strength-lab-v3/strength-lab-3-0-0-pass7-b93357e6.js`
- Runtime bytes: `1237480`
- Runtime SHA-256: `b93357e64837c0137612b17a415198f50250f3c36ee55607d86a6ff81b0f1b95`
- JavaScript syntax check: passed
- Source fallback: jsDelivr first, raw GitHub second
- Integrity verification: required before execution

## Production QA

Fresh headless Chromium QA was run after publishing on both production domains at desktop and mobile widths.

Verified on each domain:

- navigation returned a successful response;
- runtime transport reached `ui-ready`;
- actual runtime bytes matched `1237480`;
- actual runtime SHA-256 matched the expected value;
- rendered Strength Lab controls replaced the loading shell;
- no Strength Lab boot-error marker appeared;
- no page-level horizontal overflow was detected;
- no page exception was recorded;
- the current product version remained `3.0.0-pass7`;
- the schema and browser-local storage contract remained unchanged.

A clean-browser persistence check changed the unit preference to kilograms, reloaded the production page, and confirmed both the selection and `nf.strengthLab.v3` local record survived the reload.

## Deliberate non-changes

The repair did not change:

- estimate formulas or training decisions;
- Free or Pro product boundaries;
- Stripe products, prices, or payment links;
- Memberstack plans or price identifiers;
- Vercel, Render, or Neon data architecture;
- customer accounts, subscriptions, or entitlements;
- existing browser-local Strength Lab records;
- the canonical Strength Lab route.

## Remaining work

The approved V3.1.1 responsive and visual-refinement project remains paused until its Gate 1 source baseline is rebuilt from this now-working production authority. Visual changes must not overwrite or silently restore the incomplete V3.1 cutover.
