# Current production language freshness — 12 October 2026

At **2026-10-12 14:48:20 UTC**, all **34 supplemental article English sources** matched the historical review exactly in both the current Studio draft and the published document: **462 fields**, with no changed, missing or additional editable source fields. The **68 Hindi/Gujarati target maps are currently empty** in the production draft records, so none of the 924 historical target values is presently stored in those maps.

This result establishes source freshness at the recorded time. It also corrects a possible reading of the older draft receipts: those receipts and local packets do not establish that their target text is present in this production database now. The current mismatch is entirely missing target values; it is not evidence that a later editor rewrote them. No translations were imported, reviewed, saved or published by this check.

## Scope and method

The query used the production configuration path supplied by the coordinating agent. The database endpoint, database name, runtime role and shared data mode were pinned to the same guards used by `tools/old-design-migration/protected-snapshot.mjs`. A `RepeatableRead` transaction was explicitly read-only, and `SHOW transaction_read_only` returned `on`. Credentials were never printed or included in the evidence.

Only `DB002–DB009` and `DB011–DB036` were selected. A bounded recursive SQL projection followed the application's editable-text field rules, including array text, permitted editorial details, image descriptions and the protected-subtree exclusions. It returned only the selected articles' editable source strings and their Hindi/Gujarati target-field maps for comparison in memory. It did not export complete documents, customer records, product data, media associations or order records.

The local artifact contains only record IDs, version numbers, counts, hashes and check status. English hashes were computed in the historical field order; field-set equality was also checked separately so a new path could not hide behind an unchanged hash of the old paths. Target hashes compare all expected values in the same order and count additional, missing and changed existing values separately.

The authoritative machine-readable result is [m10-language-freshness-evidence.json](m10-language-freshness-evidence.json).

| Check | Result |
| --- | ---: |
| Draft English source hashes and complete editable path sets match | 34 / 34 |
| Published English source hashes and complete editable path sets match | 34 / 34 |
| Expected source fields compared | 462 |
| Hindi/Gujarati target maps examined | 68 |
| Current target values present | 0 |
| Historical target values missing from current maps | 924 |
| Changed existing target values | 0 |
| Additional current target values | 0 |
| Database writes, imports, approvals and publications | 0 |

The query excludes DB001, DB010 and the seven protected page translations. It does not establish their current state.

## Continuation boundary

The supplemental candidates are based on the current English source as of this snapshot, but still require the independent language approval described in [M10-LANGUAGE-RIGHTS-REVIEW.md](M10-LANGUAGE-RIGHTS-REVIEW.md). Their original “before” text is historical/local text, not a current production target baseline. Any eventual application must be treated as adding missing draft translations, not overwriting verified current drafts.

Recheck both source hashes and target absence immediately before a later import; this receipt is not a permanent conflict lock. Use the existing Studio draft workflow and inspect the exact saved revision. Do not infer native-reader acceptance, permission to mark reviewed, or permission to publish from matching source hashes or empty targets.
