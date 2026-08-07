# website-files

> **Production source warning:** the legacy Webflow `.txt` mirror in this repository was last materially synchronized before the current August 2026 production site. Do not paste an older repository file over live Webflow without first diffing it against current Webflow source.

Current production baseline:

- [`docs/live-webflow-production-baseline-2026-08-07.md`](docs/live-webflow-production-baseline-2026-08-07.md)
- [`docs/manual-webflow-redirects.md`](docs/manual-webflow-redirects.md)

Current live Webflow implementation wins when it conflicts with older repository files or crawler/search snapshots.

## Self-check

Run: `node scripts/nf-selfcheck.js`

The self-check validates the historical `.txt` mirror and its existing guardrails. It does not prove that the mirror matches the current live Webflow release. It fails with exit code 1 when required mirror guardrails are missing.
