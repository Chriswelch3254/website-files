# Connected Labs Phase A: published foundation repair

Status: **foundation published and browser-verified; source PR checks remain blocked**. Verified 2026-09-29. Phase B has not started.

## Current truth after release

| Surface | Verified result | Remaining limit |
| --- | --- | --- |
| Webflow | Five coordinated changes published to both production custom domains at `2026-09-29T17:21:04.962Z`. Exact candidate strings occur once in the fetched Strength/Nutrition pages (HTTP 200). | No backend, hydration asset, head code, pricing, research or domain-engine changes. |
| Shared contract | Single `NF_LABS` bridge preserves approved payloads and source dates, binds permission to the current account, and rejects stale, exact, unapproved and unowned data. | New Nutrition, Reality Map and Readiness publishers are not activated. |
| Customer controls | Connected Labs offers five stop controls with awaited, account-checked receipts and browser-only scope. Signed-in Free-account stopping succeeded; normal account saving remained Saved. | The test did not begin with a populated active source record. No live two-device or second-account acceptance is claimed. |
| Logout | Actual logout returned Strength to guest mode. A guest stop attempt asked for sign-in and did not report success. | Account-switch, storage-failure and concurrency cases also have synthetic coverage. |
| Access | Existing dual-Pro gate still covers all cross-Lab reads, including DLTER. | Single-Pro approved Reality Map preferences are future work. Current canonical proof does not establish Nutrition access. |
| Reality Types | Production deployment remains READY; health returned HTTP 200 / `nf_reality_types_health_v1` at 17:33:58 UTC. | No Reality Types backend release was made. |
| Source handoff | website-files PR #14 and NeuformFitnessApp PR #434 contain the maintained changes and rollback evidence. | Both remain unmerged. App GitHub jobs fail before executing steps; one retry also failed. The existing main commit also has failed checks. |
| Separate Nutrition Vercel build | Both the PR preview and pre-existing main deployment attempt fail in `run-one-pass-release-build.mjs`. | Build-log connector reports unavailable. Exact causes are unconfirmed; no CI bypass or new production app deployment was made. |

See `releases/connected-labs-phase-a-20260929/production-receipt.json` for the publication, source hashes, browser checks and remaining gates. `release.json` retains the exact rollback preimages. `staging-receipt.json` is the historical pre-publication receipt.

## Baseline truth verified before editing

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

## Published contract

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

**40/40 passing** after the review fix pass. The original 21 bridge cases yielded 19 failures / 2 passes against production. Seven added review regressions initially failed against the first draft. Five consumer integration cases initially failed against the captured production module. The tests now cover the reported defects and preserve complete non-context domain state.

Integration tests execute the edited module from the actual Webflow embed and eight unmodified captured production dependencies. Fixture hashes, source URL, and purpose are recorded in `scripts/fixtures/strength-live-20260929/manifest.json`. These are test fixtures, not another deployed engine. Synthetic entitled accounts prove contract behavior; they do not establish that real account entitlements are correct.

The original captured-production integration reproduced `source_invalid` with the old bridge, accepted a bounded Nutrition record with the initial repair, and preserved domain state. The final tests additionally reject mismatched subjects/auth revisions, stopped/expired/replaced permissions, expired Strength previews, and false asynchronous write receipts. Current canonical Strength access still returns `nutrition_pro_required`.

The repository's existing `node scripts/nf-selfcheck.js` has six unchanged baseline failures: two legacy `:root` checks and four missing DLTER telemetry markers. They were present before these changes. No unrelated repairs are bundled here.

## Remaining gates

1. Resolve the remote source-check failures before merging the maintained-source PRs. The relevant GitHub job has no runner and no executed steps. Its retry also failed; log retrieval returned 404. Check annotations are not exposed by the connector, and the private browser view requires sign-in. Do not infer a billing or code defect without the missing evidence.
2. Before activating new sources, establish source-owned vocabularies, source-specific expiry, explicit purposes and actual publishers. The old generic `bridge/bridge` V1 publisher remains rejected. No Nutrition, DLTER or Readiness publisher was fabricated.
3. Establish server-verified access for consuming context. The existing canonical namespace mapping is sufficient for stopping sharing when both settled identities match; it does not establish Nutrition entitlement and is not used to grant cross-Lab reads.
4. Before activating connected recommendations, verify real populated-source stopping, account switching, simultaneous tabs and device behavior. Synthetic tests cover these boundaries but cannot substitute for live multi-account/device acceptance.
5. Preserve truthful storage-failure handling. If local writes and deletes fail, another tab can retain old data until durable cleanup succeeds. If session storage also fails, pending cleanup cannot be guaranteed through reload. The published UI reports retry rather than success. Never claim all-device stopping from this local transport.
6. Extend the customer-language audit as additional private product states become available. The actual signed-in stop and guest rejection paths now use plain English. The broader static scan does not prove every private state has been exercised.

## Execution ledger

- Baseline: fresh isolated clone, feature branch `fix/connected-labs-contract-20260929`; original HEAD `eb60fc9a6ddd41137332eb7c459206b8fcfb46e7`.
- Ruling: do not migrate ownerless legacy sharing into an account. Its ownership cannot be established. Cost: users must explicitly reconnect approved context; no Lab histories are deleted.
- Initial ruling (superseded by the bounded foundation release): keep new source activation unavailable until publishers and canonical access are integrated. The repair and safe stop controls are now published; connected insights remain unavailable.
- Ruling: keep unknown tag vocabularies closed rather than accepting arbitrary text. Cost: unsupported context stays unavailable until its source contract is defined.
- Ruling: continue focused verification despite six unrelated baseline self-check failures. Cost: the repository-wide check remains red and is not claimed as a release pass.

## Independent review disposition

One whole-branch independent review ran at the first-draft commit `8f21297`; it requested changes. Its five Important findings and one Minor finding were addressed in one local fix pass. It did not re-review the final changes, and no production approval is claimed.

| Finding | Ruling | Evidence / remaining limit |
| --- | --- | --- |
| Concurrent publication overwrites stop | Fixed | Exclusive Web Lock covers read/check/write and cleanup. Deterministic queued two-tab regression passes; real browser-process acceptance remains required. |
| Selected source cannot reconnect | Fixed | New permission identifier, empty payload, other source permissions preserved. |
| Failed cleanup leaves sharing active | Fixed locally; durable failure explicitly bounded | This tab pauses immediately; removal fallback and session marker prevent tested revival. Complete storage failure cannot become a durable success; published workflow has truthful retry UX. |
| Strength accepts a different subject | Fixed | Current subject and auth revision must agree; local confirmation binds to the current state/permission generation. |
| Old recommendations remain reusable | Fixed at read boundary | History revalidates permission, subject, source time, and expiry. Reconnect does not revive old generations. This does not erase historical Lab-owned records. |
| Unknown-only payload marked available | Fixed | Each source requires at least one defined meaningful context field. |

CodeRabbit CLI was installed from its official source, but authentication returned `environment_unsupported`: browser login is unavailable and an agent API key or a user-controlled authenticated terminal is required. **CodeRabbit did not review this branch.** No credentials were requested in chat.

## Customer-language audit scope

| Surface | Evidence | Status |
| --- | --- | --- |
| Nutrition and Strength marketing/workspace, Reality Types template, quiz, Library, Support | Static rendered-text scan excludes scripts, styles, templates, and noscript content; no listed internal jargon found. | Static check only. |
| Strength Data and Privacy | Published UI says “Connected Labs”, “Stop sharing Reality Map”, and “Include exact measurements in this download”. | Signed-in and guest panels observed live. Unavailable connection offers removed. |
| Strength stop feedback | Signed-in action confirmed browser-only stopping and unchanged saved Lab records. Guest action asked for sign-in. | Actual receipt/error handling verified for these two paths. |
| Strength recommendation text | Maintained Labs Context module. | Plain-English changes published; recommendations remain gated. |
| Nutrition account header | Actual Integration Core formerly claimed “Both Pro Labs are connected” from an unverified flag. | Published code says “Their connection has not been confirmed.” |
| Other private states and cleanup failures | Source and synthetic tests reviewed. | Not all exercised in a live browser; full audit is not claimed. |

The Phase A foundation is **released**. Remote source-check/merge work remains open. Phase B schema and new connected-product features have not started.

## Continued execution: maintained-source integration

The maintained Strength source was located in `Chriswelch3254/NeuformFitnessApp` at `4421b1d08b161a9b2af24dcacca8dbc11d6cb64d`. Its 68 live inline modules match the captured source. All fetched files were checked against current Git blob hashes before edits. The existing source builder reproduces its historical baseline exactly.

Three module bodies carry the published repair: Labs Context, Customer Workflows, and Data and Privacy UI. **267 Strength tests pass**, including seven new sharing workflow cases. The immutable hydration asset and all backend, auth, access, cloud and domain-engine source files are unchanged. The renderer says connected insights are not yet available and offers explicit per-source/all-source stopping on this browser. It reports success only after an awaited durable receipt and a current-account check. Exact-measurement download copy is now plain English.

The server-issued Strength namespace can verify ownership for stopping through the existing `subject.memberDigestForId` mapping and live canonical proof. This does not prove Nutrition entitlement. Ruling: preserve the existing closed cross-Lab access gate and remove the unavailable connection offer until source-owned publishers and verified joint access exist. Cost: this foundation release does not activate connected insights or single-Pro Reality Map preferences.

The release write list is exactly `docs/releases/connected-labs-phase-a-20260929/release.json`: site footer plus three Strength embeds and one Nutrition embed. Its before/after strings and hashes are rollback evidence. Fresh Webflow reads found a newer Results analytics allowlist in the site footer. It is preserved; only the NF_LABS script is replaced against the live footer. The separate live Review analytics allowlist in the site head is outside this release; the head is not written.

The historical Strength builder reports 28 changed modules compared with its older reconstruction baseline; 25 are already deployed. Only three current module bodies change here. Its 50,000-character checks pass and the largest current replacement is under the limit. The production host policy only allows the exact production app origin, so Webflow's default staging subdomain cannot serve as signed-in Strength acceptance. That policy is preserved.

All five exact provider readbacks matched before publication. Fresh published Strength and Nutrition HTML then contained the expected replacements exactly once. A signed-in Free account could stop Reality Map sharing while ordinary account saving stayed Saved. Logout returned to the separate guest workspace, and a subsequent stop attempt asked for sign-in. These observations do not prove revocation of a populated active record, second-account switching or cross-device synchronization. Phase B has not started.
