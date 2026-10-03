# Final release checks - 3 October 2026

The owner has explicitly authorized the accumulated P6/P7/P8 improvements to main through detailed PR #36 and Vercel production, after completing what is possible. The prior draft-only hold is superseded. Full performance/recovery/human acceptance is not asserted.

## Final changes

CollectionDocument now passes only the eleven product-card fields to the client-side discovery component. The shared projection preserves filter/search/sort semantics and factual values. Across the 120 QA products, card JSON is 40,173 bytes instead of 275,428 bytes (85.4% smaller); this is payload scope, not an 85.4% page-speed claim. Product records, form definitions and gallery associations are untouched.

Editorial and fallback-home reads retain every public article/route for recommendation and navigation semantics but compile dependency snapshots only for the rendered page. Default full content and exact selected-page projections remain unchanged. No cross-request publication cache is introduced. Private saved-revision previews remain exact snapshots.

Atelier settings adds an administrator-only, read-only database check for the P7-added erasure/export table privileges and named columns. It checks each privilege independently (PostgreSQL's comma-list privilege test accepts any listed privilege). It returns only a readiness phrase, never role names, credentials or records. This is a prerequisite check, not a production erasure test.

## Verification

Build and TypeScript pass; changed-file lint passes. All 281 unit tests and 413 preflight/compiled HTTP assertions pass. Public projection comparison again matches all 120 products, 55 documents and business settings. Five selected-page projections match exactly with all recommendation/article/route fields retained; unrelated snapshots are absent. Six discovery queries match full-record behavior. The new runtime prerequisite query passes against the guarded isolated runtime. Source fingerprints remain unchanged.

The earlier 79 compact-editor assertions, repeated 12-step preview/publish/withdraw/recovery lifecycle, privacy/retry/export/replay tests, route-width and keyboard/accessibility checks remain valid for their recorded scopes. No production test write or destructive action was used.

New final local mobile samples (same throttled profile) remain failures: home 6.532s, collection 4.576s, Process 3.984s, Journal 3.768s. Home TTFB was 2.805s and the menu diagnostic 312ms; others 120-136ms. All four have CLS below 0.1, no overflow and no browser application error. Do not hide slower samples or call performance complete. Local results include remote QA database latency and cold image work; repeat on deployed production. See p8-performance-mobile-final-qa.json and p8-final-projection-checks.json.

The renewed production Studio session successfully opened Overview and Atelier settings with shared-live-data status, published contacts, indexing disabled and zero displayed pending/failed/deleting aggregate attention counts. The unsubmitted-reference cleanup inventory displayed unavailable before the new source release; recheck this after deployment without deleting anything. Exact new runtime permission readback must occur on the deployed revision.

## Backup and external evidence

Latest owner-only Drive ciphertext backup was created at 07:36:24 UTC and verified at 07:39:42 UTC on 3 October; nineteen tables, authenticated decryption/hash/manifest checks pass. The active daily/catch-up automation and timestamped/idempotent receipt repair remain in place. The historical 52.21-hour gap stays recorded. A schedule on this computer cannot prove future elapsed daily reliability or guarantee operation while it is offline.

Human screen-reader and physical-phone checks remain unavailable. Independent password-manager and sealed/offsite recovery-key copies remain NOT VERIFIED. No key has been placed in chat, Git or beside the encrypted archive. These facts are carried into the release handoff rather than fabricated.

## Deployment procedure and limits

Reuse PR #36 with full scope and these results, wait for the exact head's hosted checks, merge by expected SHA, and verify that Vercel production is READY on the resulting main commit and intended domains. Recheck public routes, anonymous API denial, authenticated settings, content editor/health and media. Record final SHA/deployment/observations in the PR and local production receipt.

This source release does not publish missing destination editorial records or import isolated QA image UUIDs. The protected-product and contact comparison must still match after release. Earlier P8 destination publication and source/content rollback procedures remain applicable. Prior production source: c94427de88d45a216fdf545840efef2f875e5789. Rollback cannot undo real data erasure; preserve current backups/ledgers and prefer forward repair of privacy issues.
