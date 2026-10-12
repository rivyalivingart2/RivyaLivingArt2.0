# M10 continuation — 12 October 2026

The owner resumed M10. The former pause is historical. Branch: `codex/m10-regression`. Read `M10-REGRESSION-REPORT.md`, `m10-evidence.json` and `m10-acceptance-matrix.json` first. Preserve the final tested application fingerprint and any later user edits. No automated restart is scheduled.

## Completed

- M5–M9 was already published through PR47 on 10 October: 480 entries, 120 per section, with labelled concepts/fictional samples, Drive copies, images and selected video. Do not reimport or republish the batches. `release-m5-m9-evidence.json` retains the production observation date.
- Local M10 homepage Portfolio/Testimonial picker and dependency capture are complete. Final build/type/lint, 344 unit checks, 403 built-server checks and six publication/recovery groups pass.
- Final 73 accessibility scans have no confirmed violations. Final 544 responsive DOM checks cover 68 routes at eight widths. Three observed UI issues were repaired: Studio status contrast, filter-group semantics, and desktop visibility of the phone filter button.
- Every original row matches both local M10 baselines in all 13 protected scopes. The QA fixtures and immutable history remain available.
- Representative old/new openings, keyboard/filter recovery, video playback/pause, reduced-motion behavior and Hindi/Gujarati display checks are recorded. Local and hosted cold/warm timing samples are recorded honestly.

## Remaining M10 acceptance

1. Complete section-by-section visual comparison for all materially distinct templates and child/create/edit/print/error states. Four opening comparisons and a responsive DOM matrix do not prove full old/new parity. Use the matrix's evidence columns rather than marking all 85 templates/74 sections accepted.
2. Resolve the remaining scanner manual-review items: image/overlay contrast, video captions/alternatives and empty table semantics. Record actual native 200%/400% browser zoom behavior; viewport emulation is not that test.
3. Obtain real screen-reader and physical-phone task evidence. No available native/physical device was controlled in this session. The owner's request to complete checks independently does not turn emulation into a physical-phone or human test.
4. Obtain independent Hindi/Gujarati native-reader review and any outstanding factual/media-rights review. Keep all original unreviewed translation drafts unpublished. Concepts/fictional samples remain correctly disclosed, never customer evidence.
5. Hosted mobile LCP remains above target. Recheck the local performance change on its actual hosted deployment only after an applicable release instruction. Investigate server/database latency; preserve publication freshness and optimistic concurrency. Field p75 and consent-safe real inquiry observations remain separate.

M10-02 is verified for the protected-data/publication scope. M10-05 is verified for explicit reconciliation of gaps. M10-01, M10-03 and M10-04 remain partially verified. This is not full-plan acceptance.

## Authorized M11 release (supersedes the earlier hold)

The owner explicitly authorized M10 and M11 on 12 October 2026. Continue the detailed PR into main, review exact checks and verify the exact deployment; never push directly to main. Read M11-RELEASE.md and docs/decisions/2026-10-12-m10-m11.md. Homepage editorial selection activation is a separate Studio save → preview → publish step after the new code is deployed. Select only the approved production identities; never copy QA IDs or QA presentation revisions. Do not infer automatic selections from this code release.

The previous automatic approval rejection for a protected Vercel fetch concerned creation of an authentication-bypass share link. Do not retry that mechanism. Public verification and the normal Studio administrator workflow are available alternatives.

## Local evidence and environment

QA is the existing loopback database at `127.0.0.1:55439`, database `rivya_migration_local`, role `rivya_migration_qa`; ignored configuration supplies credentials. Use the guarded harness. No reset, seed, scraper, old-product transfer or backup work.

At handoff, the QA web server and PostgreSQL process were stopped cleanly; all saved data remains. Restart the existing database before the guarded server/build commands. Temporary browser tabs, CPU/network/media emulation and viewport overrides were cleaned up. No tests or scheduled continuation remain running.

Final evidence: `test-results/old-design-migration/m10-resume/{accessibility-final.json,layout-grid-final.json,performance.json,interactions.json,preservation.json}`; final workflow `m10-home-editorial-2c67e11f.json`; logs prefixed `m10-final-candidate-`. Earlier UI evidence records QA draft 66/public 67/restored draft 68; the later contract has its own revision sequence. Production receipts and protected digests remain ignored. Do not stage raw evidence or secrets.
