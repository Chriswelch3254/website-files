# NeuForm Strength Lab 3.1.3 Release Lock

Status: boot-repair release authority
Delivery: inline Webflow head CSS plus nineteen verified body runtime parts
Cloud synchronization: not implemented
Storage schema: 3
Storage key: `nf.strengthLab.v3`
Source lineage: `3.0.0-pass7`

## Locked artifacts

- Runtime bytes: 1,237,911
- Runtime SHA-256: `6b4f74a68b722980d0dbd1f124e10ec65a3bff5beaa840b7c1b4a41d7ccd98d9`
- Compressed runtime bytes: 256,342
- Compressed runtime SHA-256: `561025a1c08975dadbc90c738a496bf48cdffa28ac102f486c320c7ba94db361`
- Stylesheet bytes: 26,787
- Stylesheet SHA-256: `4954f20cd8109de69598ddb416e8c23fde06734efacb1be059c4d3d2c4864878`
- Baseline audit package SHA-256: `4d80ac2d4a505f07c08b0d09846eee9c5d6625238fa4abe4033f8a3b78d828f9`
- Runtime transport part count: 19
- Maximum encoded characters per part: 18,000
- Runtime network requests after HTML delivery: 0
- Runtime execution owner count: 1

## Required behavior

The initial HTML must reserve the Strength Lab workspace and display a branded, accessible loading shell before the runtime executes. The loader verifies every ordered transport part, the assembled compressed payload, and the decompressed runtime before execution. Missing or corrupted parts must produce a visible retryable failure state. Local records must not be deleted or uploaded. Free/local operation must not wait indefinitely for Memberstack, and paid capabilities remain closed until authoritative access resolves.

## Release gate

This record authorizes only the boot repair. Cross-device synchronization remains blocked until both production domains pass cold, warm, delayed, failure, retry, responsive, local-persistence, and Memberstack-degraded checks.
