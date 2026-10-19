> **Final continuation, 19 October 2026:** [PENDING-FINAL-REPORT.md](PENDING-FINAL-REPORT.md) and [pending-final-verification.json](pending-final-verification.json) record the owner-approved production request-table repair and successful live queue refresh, the final pagination accessibility correction, and 34 additional real browser/HTTP lifecycle checks. They supersede earlier open request-table, pagination-ARIA and framework-adapter-only statements. Source release and external provider/device/native/field acceptance remain separate. The historical results below were not rerun or silently upgraded by this continuation.

# Implementation roadmap — 17–19 October 2026 and production gate

**Latest continuation — 19 October:** [PENDING-COMPLETION.md](PENDING-COMPLETION.md) and [pending-verification.json](pending-verification.json) supersede the previous translation-transfer and disposable-service-lifecycle pending statements. They include the renewed-session production request failure, fresh tests and exact remaining gates. Results below retain their original date and scope.


**19 October follow-up completed locally:** See [FOLLOWUP-CLEANUP.md](FOLLOWUP-CLEANUP.md). The measured translation overview now renders 20 cards per page and memoizes coverage; all 603 records remain accessible. Confirmed unused source/packages and two inactive menu entries were removed, and failed request loads no longer claim an empty queue. The initial translation payload remains unchanged. Production, release and external evidence steps below remain applicable.

## Completed locally

Retained the released cinematic design and isolated the existing acceptance bundle in 40907ff. Reproduced and corrected narrowly scoped memory/pause, content language, filter semantics, leave confirmation, table focus, pagination, related-section continuity, date validation, note accuracy and current E2E/documentation defects. No schema, stored product/content/crop/published-revision data or business information changed. Existing Next and matched lint config were patched to 16.3.8, Sharp to 0.35.5 and transitive source-map-js to 1.2.2; no new direct dependency or framework major migration was introduced.

## 1. Restore the production account/recovery queue — P1

The concrete failure is the Staff access-request panel, not a failed administrator login. Read-only diagnosis is already authorized and should inspect existence, columns/indexes and runtime-role privileges for rivya_access_requests, the related token/staff structures and the exact deployed service query. Compare against [schema](../../../scripts/studio-access-migration.sql) and [least-privilege grants](../../../scripts/studio-access-runtime-grants.sql). Do not run a broad migration on the strength of the generic UI error. Existing read-only runtime logs did not establish cause. Current repository environment discovery found only the example and isolated QA configuration; no production database connection or accessible production Studio session was available on 19 October. Diagnosis is authorized but needs appropriate existing read access.

If a schema/grant discrepancy is verified, prepare only the required additive SQL, record before/after schema and runtime-role evidence, and present it for **fresh explicit production authorization**. Preserve all staff/password/version/request rows. Validate schema twice in a disposable local database first. Following authorized repair, re-open Staff and test only separately authorized synthetic request/recovery records, including approval, expiry, one-use redemption and revoked-session handling. The user enters actual credentials in Studio.

## 2. Candidate release review

Review this branch and full acceptance baseline separately from protected business data. Recheck production main/deployment drift, pass exact candidate checks and prepare a detailed PR only after fresh authorization. No production promotion or publication follows automatically from local verification. After an approved release, confirm exact main SHA/READY alias, public routes/media, translated schema and private Staff/media/permissions. Until then all candidate fixes are local.

## 3. Performance follow-up — P2

Use the measured tables in [PERFORMANCE-AND-SEO.md](PERFORMANCE-AND-SEO.md). Compare the deployed candidate under the same three cold + one repeat profiles, with browser caches distinguished from uncontrolled server/CDN caches. Attribute the slow collection TTFB sample and homepage LCP/font/video phases. Retain publication/withdrawal consistency; no aggressive cache redesign is authorized by these measurements. Collect legitimate existing field observations; missing p75 is not acceptance.

The full dependency audit retains 5 package entries from 1 development-only braces advisory. No compatible patched upstream release was available on 19 October. Keep lint configuration trusted; evaluate an upstream patch when published without an incompatible lint-config downgrade. This report creates no monitoring automation.

## 4. Dedicated nonproduction lifecycle QA

Provision or designate a wholly disposable DB and private media store before destructive erasure/provider-deletion/CMS rollback testing. Inventory and retain original protected records in the existing QA database. Do not reuse production tokens or send a WhatsApp message. Measure translation overview transfer/DOM/filter latency before proposing summary/pagination changes.

## 5. Historical local catalogue navigation stress

Reproduce studio-regressions-same-page.json with normal user link navigation and fresh versus warm optimizer cache. Capture sanitized pending request source/size/timing, browser connection and local server diagnostics. The historical failure followed repeated width changes/pagination; ordinary independent editor navigation succeeds. Do not infer a production outage or replace Next Image without tracing cause. The 17 October same-page catalogue stress timeout was not reproduced on the patched candidate on 19 October (34 completed checks). The earlier failed receipt remains archived. This finite retest used the existing optimizer cache and a newer Chrome version while canonical E2E was also running; it neither proves a causal dependency fix nor certifies every navigation sequence. Preserve the archived 17 October failure and the final retest separately.

## 6. Human/device acceptance

Use actual phones/tablets and an existing supported screen reader when available. Record browser/OS/device and concrete tasks: navigation, media pause, filter/search, validation, unsaved draft cancel, access request and recovery; native 200%/400% zoom, short heights and long translations. Independently review native-language meaning and provenance where still missing. No physical device was offered for this audit, and installing a new screen reader is outside the chosen permission.

## Decision

The audit and safe local fixes are reviewable. The production system is **not unconditionally ready for sign-off** because the access-request feature is unavailable, mobile performance targets are missed, the development-only advisory is deferred and external evidence gates remain. The final local stress status is NOT_REPRODUCED. None is silently relabeled as an administrator-completed test.
