# Connected Labs Phase A: staged contract repair

Status: **draft; not deployed and not ready for production publishing**. Verified 2026-09-29.

## Current truth

| Surface | Current evidence | Consequence |
| --- | --- | --- |
| Continuation | Portable ZIP checksum and all 87 manifest payload hashes match. One em dash filename was encoded as CP437 in the ZIP. | Contents verified; exact-path manifest verification needs the filename encoding correction. |
| Webflow site | Site `65d26f254c0a038c1f9198e6`; captured footer bridge `2.0.0-pass1` matches this repository's baseline and the published pages byte for byte. | The reported mismatch is current, not historical. |
| Bridge | `safeSource` discards `staleAt` and payload; record consent can override source-level false; browser state has no member owner. | Do not simply expose richer data without repairing privacy boundaries. |
| Strength | Actual app is `/tools-strength-lab`, page `68d84107f5fa5f83c9e61823`; the marketing page is `/strength-lab`. Current reader requires `updatedAt`, `staleAt`, global/source consent, local confirmation, and both Labs' Pro access. | Valid-looking records fail as `source_invalid` after passing access/consent gates. |
| Strength canonical access | `fromCanonicalSnapshot()` reports `hasNutritionPro:false`, `crossLabEligible:false`, `memberId:""`. | Production canonical context reads remain blocked even after the bridge repair. This is not evidence a customer lacks a paid subscription. |
| Current producers | Strength has a legacy root-level writer. No active Nutrition, DLTER, or Readiness writer was found in the captured page scripts and 28 referenced Nutrition/Reality Types assets. | A functioning connected experience is not established. Do not fabricate or automatically publish source signals. |
| Reality Types | GitHub `89fb56975e6dc6682207c1c5ddb4f47c8eb7b681`, production `dpl_3DgP71rzjJPJVv18zcsm9Z3vLJnD`, health HTTP 200 / `nf_reality_types_health_v1`. | Saved results and research permission remain separate. No backend or historical-purchase changes. |
| Stripe | Live NeuForm Pro `prod_U6FyTzdo86TmuX`: $19.99 monthly and $199 yearly prices are active. | Product existence does not authorize launch or prove fulfillment. No commerce changes. |

## Candidate contract

The existing embedded `NF_LABS` is the single implementation. The patch also updates the existing Strength Labs Context module and corrects one Nutrition connection-status claim. These two live embeds were absent from the mirror and are now included with their unchanged surrounding code. This is an intentional stricter contract, not a drop-in release for legacy writers.

- Keep API schema version 2 and storage key `nf.labs.v2`; tag the bounded record contract explicitly.
- Only the current settled shared-auth member can read or change shared records. Unknown/guest identity is neutral. An unowned legacy record never becomes an account's permission.
- Every publication carries the subject, auth revision, random state generation, and shared-state revision captured when its action began. Stale operations return `false`. Each explicit source permission also has a new random identifier, so reconnecting cannot revive recommendations made under an earlier permission.
- Mutations use an exclusive same-origin Web Lock and check the token inside the lock. Callers must await mutations. Unsupported locking fails closed; no unlocked fallback is used. Legacy publications without a token return immediate `false`, avoiding a truthy Promise in an old synchronous caller.
- Global and per-source permission are explicit. A record cannot grant permission. A successful stop removes reusable payloads. Explicit reconnecting clears the old payload and affects only the selected permission. `setState` changes controls, never injects arbitrary source records.
- An attempted stop immediately pauses this tab. On quota failure, removing the shared key is the conservative fallback. If deletion also fails, return `false`, retain a session cleanup marker, and retry on auth/resume or `retryCleanup()`. A same-tab reload processes the marker before exposing data. Other domain storage is never deleted.
- Strength reads and history require an exact current subject/auth match with the bridge. History rechecks source permission identifiers, generation, freshness, and update times; a caller-supplied global-consent flag cannot bypass those checks.
- Strength publication now awaits a real bounded-source receipt and preserves the original observation time. An expired preview is not refreshed by confirmation. Unknown-only payloads cannot become usable context.
- Only typed publication methods accept bounded payloads. Closed vocabularies reject exact measurements, raw histories, unknown fields, and private text disguised as tags.
- Preserve explicit `updatedAt` and `staleAt`. Reject missing, invalid, reversed, future-updated, expired, and more-than-30-day windows. Never manufacture a fresh date for an old record. The 30-day ceiling retains the old bridge's maximum generic freshness horizon; source-specific shorter limits remain a release gate.
- DLTER initially accepts only an existing canonical type slug. Support/friction tags and source warning/reason vocabularies stay unsupported until source-owned definitions and user-confirmed uses are designed.
- `fatLossTrend` and `planFit` keep reserved method names but cannot publish an undefined payload contract.
- The local bridge does not claim cross-device synchronization. Domain records, calculations, research permissions, pricing, and access checks are unchanged.
- A caller-supplied `connection.state="connected"` is not proof that another product consumed a record.

Example publication after the user has enabled global and Nutrition sharing:

```js
await NF_LABS.ready();
const captured = NF_LABS.getState();
const saved = await NF_LABS.writeNutritionSignal({
  subjectId: captured.subjectId,
  authRevision: captured.authRevision,
  revision: captured.revision,
  stateId: captured.stateId,
  available: true,
  status: "ready",
  updatedAt: sourceUpdatedAt,
  staleAt: sourceExpiresAt,
  payload: { phaseTag: "cutting" }
});
```

Check `saved !== false` and `NF_LABS.getStatus().cleanupPending` before showing success. Capture the token when the user action begins. Do not refresh it at the end of an asynchronous operation to disguise an account change or revocation.

## Verification

Run:

```sh
node --test scripts/nf-labs-contract.test.cjs scripts/nf-labs-strength-integration.test.cjs
```

**39/39 passing** after the review fix pass. The original 21 bridge cases yielded 19 failures / 2 passes against production. Seven added review regressions initially failed against the first draft. Five consumer integration cases initially failed against the captured production module. The tests now cover the reported defects and preserve complete non-context domain state.

Integration tests execute the edited module from the actual Webflow embed and eight unmodified captured production dependencies. Fixture hashes, source URL, and purpose are recorded in `scripts/fixtures/strength-live-20260929/manifest.json`. These are test fixtures, not another deployed engine. Synthetic entitled accounts prove contract behavior; they do not establish that real account entitlements are correct.

The original captured-production integration reproduced `source_invalid` with the old bridge, accepted a bounded Nutrition record with the initial repair, and preserved domain state. The final tests additionally reject mismatched subjects/auth revisions, stopped/expired/replaced permissions, expired Strength previews, and false asynchronous write receipts. Current canonical Strength access still returns `nutrition_pro_required`.

The repository's existing `node scripts/nf-selfcheck.js` has six unchanged baseline failures: two legacy `:root` checks and four missing DLTER telemetry markers. They were present before these changes. No unrelated repairs are bundled here.

## Release gates

1. Deploy bridge and Strength module together only after their actual UI callers use the awaited API and current tokens. The old generic `bridge/bridge` V1 publisher is explicitly rejected by the stricter bridge. No Nutrition, DLTER, or Readiness producer was fabricated. Their source-owner mapping, approved use, and user action remain required before they can share.
2. Resolve canonical Strength identity/capability mapping against server-issued access. Its BFF currently supplies an opaque canonical namespace and Strength capabilities, while the global bridge uses the settled shared Memberstack member. These are not interchangeable identity proofs. Never invent a join, infer Nutrition permission from the bridge, or weaken the current paid-access checks.
3. Define source-specific vocabularies and expiry policies with actual publishers. Add explicit customer controls and purpose restrictions before publishing new context.
4. Verify signed-in, logout, account switch, simultaneous tabs, storage failures, and two-device behavior in staging. Browser observation covered the guest workspace and Data and Privacy panel. Automatic approval review rejected the “Connect DLTER context” click because it may initiate consent/sharing; it did not execute. No signed-in ownership or sharing-action acceptance is claimed.
5. Add truthful failure/retry UX for `cleanupPending`. If local writes and deletes fail, another tab can retain old data until durable cleanup succeeds. If session storage also fails, a client cannot guarantee persistence of the pending stop through reload. No success receipt is returned in those cases. Do not claim all-device stopping or synchronization from this local transport.
6. Complete dynamic customer-language review. Static HTML scan across both Labs' marketing/workspace pages, Reality Types, quiz, Library, and Support found no listed jargon; this does not cover generated private states. Current code still contains “Sanitized Strength Signal”, “Context consent saved”, and “Prescriptions are unchanged”. The draft corrects the Nutrition “Both Pro Labs are connected” claim to say its connection has not been confirmed. Strength recommendations now use plain wording. The other flow-specific copy remains in the customer workflow/UI embeds and must be replaced with truthful plain English when those flows are implemented.
7. Re-read live Webflow immediately before any draft update. Replace only the captured bridge and the two identified embed bodies; verify rollback preimages and publish only after the combined release passes.

## Execution ledger

- Baseline: fresh isolated clone, feature branch `fix/connected-labs-contract-20260929`; original HEAD `eb60fc9a6ddd41137332eb7c459206b8fcfb46e7`.
- Ruling: do not migrate ownerless legacy sharing into an account. Its ownership cannot be established. Cost: users must explicitly reconnect approved context; no Lab histories are deleted.
- Ruling: keep this candidate on a draft branch until publishers and canonical access are integrated. The current system has no working end-to-end sharing contract. Cost: the repair is not yet available to customers.
- Ruling: keep unknown tag vocabularies closed rather than accepting arbitrary text. Cost: unsupported context stays unavailable until its source contract is defined.
- Ruling: continue focused verification despite six unrelated baseline self-check failures. Cost: the repository-wide check remains red and is not claimed as a release pass.

## Independent review disposition

One whole-branch independent review ran at the first-draft commit `8f21297`; it requested changes. Its five Important findings and one Minor finding were addressed in one local fix pass. It did not re-review the final changes, and no production approval is claimed.

| Finding | Ruling | Evidence / remaining limit |
| --- | --- | --- |
| Concurrent publication overwrites stop | Fixed | Exclusive Web Lock covers read/check/write and cleanup. Deterministic queued two-tab regression passes; real browser-process acceptance remains required. |
| Selected source cannot reconnect | Fixed | New permission identifier, empty payload, other source permissions preserved. |
| Failed cleanup leaves sharing active | Fixed locally; durable failure explicitly bounded | This tab pauses immediately; removal fallback and session marker prevent tested revival. Complete storage failure cannot be turned into a durable success; production needs failure UX. |
| Strength accepts a different subject | Fixed | Current subject and auth revision must agree; local confirmation binds to the current state/permission generation. |
| Old recommendations remain reusable | Fixed at read boundary | History revalidates permission, subject, source time, and expiry. Reconnect does not revive old generations. This does not erase historical Lab-owned records. |
| Unknown-only payload marked available | Fixed | Each source requires at least one defined meaningful context field. |

CodeRabbit CLI was installed from its official source, but authentication returned `environment_unsupported`: browser login is unavailable and an agent API key or a user-controlled authenticated terminal is required. **CodeRabbit did not review this branch.** No credentials were requested in chat.

## Customer-language audit scope

| Surface | Evidence | Status |
| --- | --- | --- |
| Nutrition and Strength marketing/workspace, Reality Types template, quiz, Library, Support | Static rendered-text scan excludes scripts, styles, templates, and noscript content; no listed internal jargon found. | Static check only. |
| Strength Data and Privacy | Guest live UI displays “NeuForm Connections”, “Connect DLTER context”, “Preview Strength Signal”, and “Include sensitive exact fields”. | Reviewed; sharing click blocked, no consent changed. |
| Strength connection feedback | Actual dynamic source contains “Sanitized Strength Signal”, “Context consent saved”, and “Prescriptions are unchanged”. | Required replacements: “Training summary ready”, “Your sharing choice was saved”, and “Your training plan has not changed”, with actual receipt/error handling. |
| Strength recommendation text | Actual Labs Context module. | Draft plain-English changes included. |
| Nutrition account header | Actual Integration Core used “Both Pro Labs are connected” for an unverified flag. | Draft says “Their connection has not been confirmed.” |
| Signed-in private states and cleanup failures | Not exercised in browser. | Release gate; cannot claim the full language audit passed. |

Phase A is **not released**. Phase B schema and new connected-product features have not started.
