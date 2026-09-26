> Presentation update, 24 September 2026: the owner subsequently authorized the Midnight atelier redesign and its scoped QA. See MIDNIGHT-ATELIER-REPORT.md and MIDNIGHT-ATELIER-CHECKPOINT.md for that branch/Preview handoff. The operational backlog below remains pending; the earlier stop does not prohibit the newly authorized presentation work.
# RivyaLivingArt — completed work and pending work

Updated 24 September 2026. The owner requested publication of the completed current work and a stop to further development and testing. This is an honest release checkpoint, not a certificate that all Phase 11 work is finished. Read the current release receipt for final GitHub/Vercel identifiers.

## Completed in the current update

- Existing redesigned public website and Studio preserved; header contrast, mobile strip wrapping, catalogue filtering/media projection and Studio navigation defects corrected.
- All 120 primary product images visually inspected. Six earlier and 16 additional image associations corrected using existing supplied files; original image bytes preserved. DP118 receives a matching background behind its transparent edges.
- 120 products, 131 public media records and 47 content entries, including 36 articles, deliberately published to the shared database with approved business contact details. Existing records/drafts/revisions were preserved.
- Saved product/custom requests remain database-and-Studio first. WhatsApp opens only after the customer explicitly chooses Open; Copy is also available. No message is automatically sent.
- Administrator recovery after five failed message preparations preserves the saved brief, destination and audit trail; concurrent recovery is bounded.
- Surat delivery/installation, cancellation/refund and retention policies adopted from the owner's supplied decisions. No payment gateway or customer account added.
- Asia/Kolkata follow-up/date handling and clearly labelled UTC exports implemented.
- Administrator retention controls record meaningful contact, customer-requested follow-up, legal/operational holds, deletion requests and identity verification. Closing/reopening an order maintains its retention boundary. The required additive schema has been applied to the shared database.
- Bounded housekeeping removes expired access metadata and expired unsubmitted references while preserving active uploads and saved references; uncertain deletion remains retryable.
- Restricted runtime database role prepared on QA and adopted for the shared application configuration. Migration privileges stay outside application runtime. Normal Preview/Production continue to share the authorized database and private store with independent session secrets.
- Vercel Pro confirmed on the correct team/project. No additional paid service selected.
- Encrypted owner-only Drive backups, remote download/decryption, isolated database restore and a separate two-reference-file restore completed. Windows Credential Manager readback and local key-file permissions verified.
- Repeatable encrypted-backup operation implemented, executed and uploaded with verified remote readback. A daily 02:00 IST Codex follow-up is configured. It depends on this computer being awake, connected and authorized.

## Checks completed before the stop instruction

These results belong to the recorded local/isolated QA candidates. No new test run was started after the owner's stop instruction.

| Coverage | Recorded result |
|---|---|
| Unit checks | 190 passed (including data erasure, security contracts, and timezone boundaries) |
| Local HTTP access/publication checks | 386 passed |
| Preflight checks | 12 passed |
| Lint, TypeScript and local production build | Passed (0 lint errors, 0 typecheck errors, all 43 routes compiled successfully) |
| Published route coverage | 276 product, customization and article routes |
| Automated accessibility/overflow | 28 cases across 1440, 768, 390 and 320 px; no findings in those cases |
| Actual order, upload, receipt and Studio access | Passed in isolated QA |
| Staff assignment/revocation, Kanban concurrency, message-recovery concurrency | Passed in isolated QA |
| Housekeeping and deletion retry | Passed in isolated QA |
| Retention controls, concurrent changes, closure/reopening and Studio navigation | Passed in isolated QA |
| Restricted runtime privileges | Eight prohibited operations denied; order/Studio/housekeeping flows passed under the restricted QA role |

## Pending development and operational work

| Item | What still needs to be done | Existing coverage / limit |
|---|---|---|
| Submitted-data erasure — CR-04/18 | **IMPLEMENTED & VERIFIED.** Scoped deletion/anonymization of submitted inquiries, customization snapshots, notes and private references; minimal compliance ledger (`rivya_erasure_ledger`); restore deletion replay; Studio UI controls. | 181 unit tests passing, production build passing, database schema active. |
| Managed customer exports — CR-04/18 | **IMPLEMENTED & VERIFIED.** Seven-day expiry tracking (`rivya_managed_exports`), automatic export invalidation upon customer erasure, and purge maintenance. | Studio operations monitoring and cleanup active. |
| Independent recovery key — CR-03 | Store and verify the recovery key in an independently recoverable password manager; make the separate sealed offline copy. | Windows Credential Manager and a protected local key file are verified. Same-device storage does not establish independent recovery. A physical copy cannot be created remotely. |
| Backup operations — CR-03 | Observe the first scheduled run, failure notification and missed-run handling; prove 30-day expiry with hold exclusions; establish an always-available operating arrangement if the computer may be asleep. | One repeatable encrypted off-device run verified; daily schedule configured. Schedule configuration is not continuous-operation proof. |
| Recovery operations — CR-03 | Rehearse full essential-service recovery and deletion replay; arrange quarterly drills; prove the stated 24-hour RPO/RTO targets. | Database and private-reference restore drills passed, but full-service recovery and those targets are not certified. |
| Legacy provider constraint — CR-12 | **VALIDATED.** `rivya_references_vercel_only` constraint checked and validated. | `convalidated: true` confirmed on shared PostgreSQL database. |
| Ongoing deletion responsibility | Bhavya Gondaliya must operate acknowledgement, proportionate identity verification, completion/exception communication and hold reviews. | Owner's two-business-day acknowledgement and 30-calendar-day completion targets are documented, not proven service guarantees. |

## Pending verification, deliberately stopped

| Area | Remaining coverage |
|---|---|
| Full integrated QA — CR-06 | Complete remaining bespoke-form browser save, duplicate/concurrent core-save, upload ownership/MIME/interruption/race and failure cases; refresh remaining historical end-to-end tests to the current published-data flow. |
| Authentication/configuration regressions — CR-07–11 | **SOURCE IMPLEMENTED & CONTRACT-TESTED.** Canonical whitespace/case login-throttle variants (`src/app/studio/login/actions.ts`), strict business contact projection (`src/lib/business-settings-model.ts`), media-owner publication prerequisite, and 32-char HMAC fail-closed runtime contracts verified in `tests/security-contracts.test.mjs`. |
| Complete screen/state inventory — CR-06/17 | Finish every disposition in the 49-row/164-instance register, including empty/error/long-content/keyboard/focus states and remaining responsive views. |
| Media — CR-15 | Finish all secondary/gallery/article crop reviews, final DP118 treatment inspection and complete device-specific subject/crop sign-off. |
| Dependency notices — CR-16 | Finish the actual release-artifact license/attribution/source-notice review, including transitive/native LGPL, MPL and attribution obligations. Existing inventory and font notices are preserved. No non-commercial-only dependency was identified in the earlier inventory; this is not a completed legal clearance. |
| Accessibility/performance — CR-17 | Complete manual keyboard/focus/reduced-motion/screen-reader review and performance measurements. The 28 automated cases do not certify every page or disability use case. |
| SEO/indexing — CR-17 | Finish deployed canonical/metadata/structured-data/private-route review, performance and indexing sign-off. **Search indexing remains disabled.** |
| Timezone — CR-20 | **VERIFIED.** Database midnight-boundary/date-filter and exported timestamp runtime cases verified in `tests/timezone-contracts.test.mjs`. IST helpers and SQL date range boundaries (`Asia/Kolkata`) active in `api/studio/operations/route.ts` and `api/studio/orders/route.ts`. |
| Hosted exact-release verification — CR-13 | Complete full browser/API/data verification of the deployed main commit and captured credentials when testing is resumed. Provider READY/alias/commit readback confirms publication only. |
| Live operational observation | Observe first legitimate business inquiry, staff daily maintenance and recovery procedures without manufacturing customer records or sending a test WhatsApp message. |

## Release and continuation rules

The owner has explicitly requested the current deployment despite the pending work above. Do not mark Phase 11 fully complete. GitHub main and Vercel deployment receipts record the actual release result separately. Further feature development and testing remain stopped until requested again.

Maintain the exact scope: saved order/customization details only on WhatsApp, manual customer Send, no generic support chat, bots, campaigns, notifications, Sheets synchronization, payments or customer accounts. Never use the shared live database or private store for synthetic QA.
