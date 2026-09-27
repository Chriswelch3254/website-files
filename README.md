# website-files

> **Production source warning:** the legacy Webflow `.txt` mirror in this repository was last materially synchronized before the current August 2026 production site. Do not paste an older repository file over live Webflow without first diffing it against current Webflow source.

Current production baseline:

- [`docs/live-webflow-production-baseline-2026-08-07.md`](docs/live-webflow-production-baseline-2026-08-07.md)
- [`docs/manual-webflow-redirects.md`](docs/manual-webflow-redirects.md)

Current live Webflow implementation wins when it conflicts with older repository files or crawler/search snapshots.


## Current synchronized surfaces

- `on page embeds/Library Page Settings and Embed.txt` is the authoritative saved source for the production `/library` implementation as of 2026-09-27. It contains the 10 current Webflow code embeds plus the page Head settings snapshot and must be diffed against live Webflow before any later replacement.
- Library release line: `4.10.1-library-automatic-plan-discovery`.
- Current Library production verification includes one H1, one canonical, protected backend PDF delivery, canonical NeuForm SKU aliases, direct consent-gated GA4 event delivery, and conditional Automatic Plan loading.
- Do not restore the older v2.1 or v4.8.x Library source over the current page.

## Self-check

Run: `node scripts/nf-selfcheck.js`

The self-check validates the historical mirror guardrails plus the current synchronized My Library contract. It still does not prove every repository mirror matches every live Webflow surface. It fails with exit code 1 when required guardrails or current Library markers are missing.
