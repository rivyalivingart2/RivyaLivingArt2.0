# Supplemental AI meaning-review candidates

These are **unreviewed local drafts**, not independent native approvals or saved Studio revisions. All 34 previously outstanding articles were compared with both target-language drafts in the retained historical snapshot on 12 October 2026. The 462 source fields and 924 target values yielded 200 corrected values across 33 articles; DB019 needed no concrete semantic change.

Use `candidate-review.json` for complete English/Hindi/Gujarati comparison, `correction-diff.json` for changes, and `review-ledger.json` for exact source hashes, coverage and uncertainties. `draft-imports/` contains 68 compatible draft candidates. Their manifest is supplemental safety metadata; importing a packet alone cannot establish current-source freshness or approval.

The separate [current production freshness receipt](../../redesign/old-design-migration-2026-10-08/M10-LANGUAGE-FRESHNESS.md), recorded at 2026-10-12 14:48:20 UTC, confirms that all 34 draft and published English sources still match. All 68 current production Hindi/Gujarati target maps are empty. The 924 historical before-values belong to the retained review snapshot, not current production drafts. The candidate packet's original not-rechecked metadata predates this separate receipt; the receipt supplies that timestamped check without altering the reviewed packet hash.

Immediately before any later application, recheck the current Studio source hashes and target absence. Resolve any new drift without overwriting newer work. Any later draft import adds missing translations; it must not be described as updating verified current target drafts. An independent fluent Hindi/Gujarati reviewer must record identity, competence, date, exact source/candidate hashes, full-text corrections and explicit approval. Save only through the existing reviewed workflow after those conditions are satisfied. No approval or publication is performed by this folder's builder.

`build-review.mjs` is an offline artifact generator. It preserves English and protected fields, verifies hashes/coverage/scripts/numbers, and checks the M9 concept/fictional disclosures. `corrections-*.json` contains manual assistant correction decisions; the generator does not perform translation or confer review status.

See [M10-LANGUAGE-RIGHTS-REVIEW.md](../../redesign/old-design-migration-2026-10-08/M10-LANGUAGE-RIGHTS-REVIEW.md) for limits, rights evidence and continuation.
