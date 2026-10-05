# C5 acceptance and C6 improvement release

Prepared 5 October 2026 for the owner's explicit instruction to push all updated files into main through a PR with full details. This packet covers everything since PR #37 at `1b3cbbc576aff2d0d37138ebfc211ce3e3444ac2`: six local implementation/evidence commits, followed by this documentation and screenshot packaging. Application source is `f1245c7b6362abbbc3b8a1735686b334090ea190`; subsequent packaging does not change runtime code.

Release is authorized while the stated C6 limitations remain open. This is not a claim that all C6 or CRAFT acceptance has passed. The dated evidence keeps its original local-only status; the resulting GitHub PR, main SHA and Vercel result are the release record.

## C5: failures and recovery

- HTML as well as JSON 401 responses trigger the existing expired-access banner. Editors remain mounted so access renewal preserves unsaved work.
- Navigation/settings initial failure offers retry, failed reload retains existing values, and navigation controls lock during publication. Media retry clears its old error.
- Content, homepage, catalogue and media recovery refuse to replace a local editor when the requested saved record is unavailable.
- Catalogue, media, navigation, business settings and staff-session revocation distinguish a successful change from an unsuccessful follow-up read. Staff are told to reload instead of repeating an operation that already committed.
- Activity/settings refresh failure labels retained results as potentially stale. Export tracking has explicit failure/retry feedback.
- Container-responsive editor panels stack when the sidebar narrows their available width; crop legends wrap.
- C5 acceptance tooling exercises permissions, stale writes, read/network errors, dirty navigation and the real synthetic-page save → exact preview → publish → public verification → revision recovery journey in pinned isolated QA. Synthetic staff/inquiries/pages are retired with history intact.

## C6: loading and accessibility

- Responsive logo sizing and a 1200px image candidate avoid oversized requests. Initial hero/editorial and product-display images use quality 60; enlarged gallery views retain 75. Original images, crop settings and associations remain intact.
- Customization form code has its own client entry; ordinary page-section editing is deferred separately from the homepage editor.
- Studio renders its initial identity/staff after the existing server authentication guard. The same role-filtered staff projection is shared with access refresh; retry/renewal stays available and private identity is not cached.
- Unselected content entries use small searchable summaries marked `detailPending`. Choosing a record loads its full exact draft, publication and revision before editing. Selected homepage detail remains complete. The internal database list query still reads full records.
- Public locale/publication reads begin together. A single bounded process snapshot may be reused only after a new successful database identity/fingerprint check on every request. Membership and full-publication fingerprints detect withdrawal and updates. There is no TTL or stale-on-error fallback; saved previews keep their exact captured revision.
- Studio module rendering is memoized for shell-only menu/finder changes; identity/staff/module updates and local editor changes still render. Small-screen modal backdrops retain the dark layer without a full-screen blur repaint.
- Record-status announcements preserve definition-list semantics. Thumbnail and site-image lists have named group roles. Product badges use defined opaque navy/ivory colours. Content-health repair links have explicit underlines and readable colour.
- Repeatable performance, accessibility, native zoom, contrast, interaction, media/motion and publication-contract checks are included, with sanitized receipts and a public-only screenshot review.

## Verification and provenance

The last application check passes **288 unit tests, 12 preflight checks and 403 built-server checks**, TypeScript and optimized build. Full lint has zero errors and 62 existing warnings; changed-file lint is clean. No application code changed after that check except a comment. This release packaging adds documentation/screenshots only. The PR's Vercel build must also finish successfully for its exact final head before merge; branch rules and review status are inspected without bypass.

| Recorded acceptance scope | Result |
|---|---|
| C5 permission/error/service matrix | 90 assertions; anonymous/admin/editor boundaries, conflicts and access changes |
| C5 real browser publishing/recovery | 23 checks; synthetic fixture, exact saved preview, anonymous public revision and recovery as a new revision |
| C5 other browser checks | 36 protected-editor and eight administration checks; 17 initial-failure, ten stale-refresh cases; 48 reflow and 18 keyboard observations |
| C6 exact-destination accessibility | 144 scans across 48 public/system/Studio destinations at 1440/390/320px; zero violations, body overflow, missing image names or uncaught page errors |
| C6 native Chrome zoom | 49 destinations at 200%/400%, plus 100% baseline: 99 observations and six dialog/focus-return checks |
| C6 assistant contrast | 98 desktop/mobile states and 2,284 measured text cases; minimum 5.26:1; 36 follow-up assertions and 11 targeted scans resolve recorded incomplete cases |
| C6 interaction/reflow | 73 assertions, ten additional state scans and 26 reflow observations |
| C6 images/motion | Ten observations across five public routes and two widths pass the recorded image/motion guards |
| C6 real publication contracts | 13 isolated-QA assertions: exact content detail, draft isolation, immediate updates/withdrawal, captured preview and revision recovery |

Performance contains three cold-browser samples for each of seven routes under 390×844/DPR3/touch, CPU4×, 150ms latency and 1.6Mbps down. Server/image caches may be warm. Local compiled server and remote isolated database are explicitly different from production field measurements.

| Route | Earlier median LCP | Current median LCP |
|---|---:|---:|
| Homepage | 3.09s | 2.25s |
| Collection | 4.62s | **2.81s — above target** |
| River Channel product | 3.30s | 2.15s |
| Custom brief | 1.68s | 1.70s |
| Process | 2.56s | 2.20s |
| Studio inquiries | 4.12s | 1.94s |
| Selected homepage editor | 5.16s | 1.94s |

Timings include network/database variability; do not attribute every difference to code. Lab medians are not field p75, and menu-event maxima are not field INP. Performance precedes only final badge/group/link repairs. Full accessibility/native zoom includes the badge repair; the final group/link repairs have eleven targeted rechecks. Final build, interactions, image/motion and public captures include all application changes. The exact provenance is retained in `craft-c6-evidence.json`.

## Protected data and limits

All 120 pre-existing products/forms/galleries and 136 media records/associations, business/contact/social values, scraper behavior, pre-existing content/customer/order/staff records, drafts/history and manual messaging remain protected. Comparison receipts report unchanged pre-existing records. Synthetic QA fixtures are separate additions, now hidden/closed/disabled with history retained. No QA content/media identity is copied into production.

This source release runs no production content publication, product import, database migration, permission grant, customer message, export or erasure. Backup operations and key-custody gates remain removed; do not recreate them.

**Still open:** collection loading (2.808s median versus 2.5s), real-user p75, human screen-reader/physical-phone evidence (owner confirmed no equipment), optional C2 video and production editorial/Imprint acceptance. Source deployment cannot publish an unavailable Studio record. Authenticated hosted verification needs an owner UI session if the existing session is expired; no credentials belong in the PR or logs.

## Review and release procedure

- [Complete changed-file register](c5-c6-release-files.csv)
- [C5 acceptance](CRAFT-C5-ACCEPTANCE.md) and [C5 receipt](craft-c5-acceptance-evidence.json)
- [C6 checkpoint](CRAFT-C6-CHECKPOINT.md), [C6 receipt](craft-c6-evidence.json) and [human/device checklist](C6-HUMAN-DEVICE-CHECKLIST.md)
- [Screenshot report](reviews/c6-implementation.html) and [public screenshot hashes](reviews/c6-screenshot-receipt.json)

Push the feature branch and open one detailed PR into main. Check its exact head, reviews and configured checks, then merge through GitHub without bypass. Verify the resulting main SHA and the existing Vercel Git deployment's READY state and source. Public HTTP checks remain read-only. Record the outcome in the PR and local release receipt. Return subsequent development to local-only until another explicit push-main request.

Previous production source is `1b3cbbc576aff2d0d37138ebfc211ce3e3444ac2`, deployment `dpl_EqAonrKdj4RZMcTGGQbS38Ssp5oj`. A source rollback uses a reviewed revert PR or an authorized promotion of that deployment; never restore a database to undo UI code. Editorial recovery remains the existing saved-revision workflow.
