# M10 continuation — 12 October 2026

The owner authorized M10 and M11. PR48 released the tested application and Studio published homepage design revision 4. The earlier pause/local-only/M11-not-authorized statements are historical. Receipt branch: `codex/m11-release-receipt`, based on merged main `0f1b1457f1bf870a3742d206a43f04fa781bdf02`. Read `M11-RELEASE.md`, `m11-evidence.json`, `M10-REGRESSION-REPORT.md` and `m10-acceptance-matrix.json` first. Preserve application fingerprint `6096a9dd5ff37a875a8041eaaa25bddfe963a54899679bab9d3d1f5f6170ad46` and any later user edits. No automated restart is scheduled.

## Completed

- M5–M9 was already published through PR47 on 10 October: 480 entries, 120 per section, with labelled concepts/fictional samples, Drive copies, images and selected video. Do not reimport or republish the batches. `release-m5-m9-evidence.json` retains the production observation date.
- M10 homepage Portfolio/Testimonial picker and dependency capture are deployed. The real administrator saved revision 3, inspected desktop/mobile exact previews and published revision 4 with three concepts and three fictional samples. Final build/type/lint, 344 unit checks, 403 built-server checks and six publication/recovery groups pass.
- Final 73 accessibility scans have no confirmed violations. Final 544 responsive DOM checks cover 68 routes at eight widths. Three observed UI issues were repaired: Studio status contrast, filter-group semantics, and desktop visibility of the phone filter button.
- Every original row matches all three local M10/M11 baselines and the production M11 baseline in all 13 protected scopes. The QA fixtures and immutable history remain available. All 26 bounded production checks pass.
- Nine additional focused scans have zero confirmed violations. The silent film has a visible associated sequence description; empty inquiry tables are omitted. Analytics gradient contrast is measured at a minimum 14.56:1. New-editor, saved synthetic-order and print CSS views were inspected; this does not establish every child/error state or physical print behavior.
- Representative old/new openings, keyboard/filter recovery, video playback/pause, reduced-motion behavior and Hindi/Gujarati display checks are recorded. Local and hosted cold/warm timing samples are recorded honestly.

## Remaining M10 acceptance

1. Complete section-by-section visual comparison for all materially distinct templates and child/create/edit/print/error states. Four opening comparisons and a responsive DOM matrix do not prove full old/new parity. Use the matrix's evidence columns rather than marking all 85 templates/74 sections accepted.
2. Resolve the remaining image/overlay contrast manual-review items. Silent-video alternatives and empty table semantics were repaired and checked in the released candidate. Record actual native 200%/400% browser zoom behavior; the IAB Ctrl+plus attempt did not change scale, and viewport emulation is not that test.
3. Obtain real screen-reader and physical-phone task evidence. No available native/physical device was controlled in this session. The owner's request to complete checks independently does not turn emulation into a physical-phone or human test.
4. Obtain independent Hindi/Gujarati native-reader review and any outstanding factual/media-rights review. Keep all original unreviewed translation drafts unpublished. Concepts/fictional samples remain correctly disclosed, never customer evidence.
5. Hosted mobile LCP remains above target after the exact released candidate was retested: homepage 7.056s/11.488s and collection 6.628s/4.064s, all CLS 0. Preserve all samples, including the slow repeat. Investigate server/transport and font/media budgets; the local-to-production read-only query profile is not a Vercel server trace. Preserve publication freshness and optimistic concurrency. Field p75 and consent-safe real inquiry observations remain separate. See M11-RELEASE.md for method and limits.

M10-02 is verified for the protected-data/publication scope. M10-05 is verified for explicit reconciliation of gaps. M10-01, M10-03 and M10-04 remain partially verified. This is not full-plan acceptance.

## Completed M11 release

The owner explicitly authorized M10 and M11 on 12 October 2026. Detailed PR48 was checked and merged; main 0f1b1457f1bf870a3742d206a43f04fa781bdf02 matches READY production dpl_G1muuWBRGoo8DLBQG3sHxM94uzKt and the live custom domain. Homepage activation is complete through the real Studio save → exact preview → publish workflow. Do not repeat it or copy QA IDs/revisions. Read M11-RELEASE.md for compatibility-aware recovery and docs/decisions/2026-10-12-m10-m11.md for authorization. Release completion does not close M10's remaining acceptance gaps.

The previous automatic approval rejection for a protected Vercel fetch concerned creation of an authentication-bypass share link. Do not retry that mechanism. Public verification and the normal Studio administrator workflow are available alternatives.

## Local evidence and environment

QA is the existing loopback database at `127.0.0.1:55439`, database `rivya_migration_local`, role `rivya_migration_qa`; ignored configuration supplies credentials. Use the guarded harness. No reset, seed, scraper, old-product transfer or backup work.

At handoff, the QA web server and PostgreSQL process were stopped cleanly; all saved data remains. Restart the existing database before the guarded server/build commands. Temporary browser tabs, CPU/network/media emulation and viewport overrides were cleaned up. No tests or scheduled continuation remain running.

Final evidence: `test-results/old-design-migration/m10-resume/{accessibility-final.json,layout-grid-final.json,performance.json,interactions.json,preservation.json}`; final workflow `m10-home-editorial-2c67e11f.json`; logs prefixed `m10-final-candidate-`. Earlier UI evidence records QA draft 66/public 67/restored draft 68; the later contract has its own revision sequence. Production receipts and protected digests remain ignored. Do not stage raw evidence or secrets.
