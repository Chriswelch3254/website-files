# website-files

> **Production source warning:** some legacy Webflow `.txt` mirrors in this repository still predate current production. Do not paste an older repository file over live Webflow without first diffing it against current Webflow source. The synchronized surfaces called out below are exceptions and reflect current production as dated.

Current production baseline:

- [`docs/live-webflow-production-baseline-2026-08-07.md`](docs/live-webflow-production-baseline-2026-08-07.md)
- [`docs/manual-webflow-redirects.md`](docs/manual-webflow-redirects.md)

Current live Webflow implementation wins when it conflicts with older repository files or crawler/search snapshots.


## Current synchronized surfaces

- `on page embeds/Library Page Settings and Embed.txt` is the authoritative saved source for the production `/library` implementation as of 2026-09-27. It contains the 10 current Webflow code embeds plus the page Head settings snapshot and must be diffed against live Webflow before any later replacement.
- Library release line: `4.10.1-library-automatic-plan-discovery`.
- Current Library production verification includes one H1, one canonical, protected backend PDF delivery, canonical NeuForm SKU aliases, direct consent-gated GA4 event delivery, and conditional Automatic Plan loading.
- Do not restore the older v2.1 or v4.8.x Library source over the current page.

- `on page embeds/Sitewide Code.txt` is synchronized to the current production Webflow site Head and Footer as of 2026-09-27. It includes the consent-gated direct GA4 forwarding contract for bounded Personal Training custom events.
- Public Personal Training is currently release `v4.2.1` on Webflow page `65d4f37fb823cb20e31b4330` (`/personal-training`). Current live Webflow field values are the source authority; no separate page mirror is created in this repository. The release keeps the Fit Review as the primary public conversion, uses a higher-contrast Library-aligned sticky jump navigation with active-section state, tightens mobile navigation/spacing, strengthens card/button contrast, removes duplicate page-owned canonical/robots metadata, and keeps the FAQ Fit Review CTA deduplicated.
- Private Training Client Hub is currently release `v3.1` on Webflow page `6a343ae7c4b746b6e01f8644` (`/personal-training-client`). Current live Webflow source is authoritative for its stylesheet/runtime. Gateway v2 identifiers are routing offer keys; canonical business/analytics SKUs remain the established v1 private-training SKUs in the operations registry.
- Do not restore earlier Personal Training marketing or Client Hub blocks over these releases without first diffing against live Webflow.

## Self-check

Run: `node scripts/nf-selfcheck.js`

The self-check validates the historical mirror guardrails, the current synchronized My Library contract, and current sitewide Personal Training analytics markers. It still does not prove every repository mirror matches every live Webflow surface. It fails with exit code 1 when required guardrails or synchronized-surface markers are missing.
