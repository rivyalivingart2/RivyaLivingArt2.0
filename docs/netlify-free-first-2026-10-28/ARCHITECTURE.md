# Free-first storage, permissions and recovery decision

Owner direction: [OWNER-BRIEF.md](OWNER-BRIEF.md). Decision date: 28 October 2026.

## Authority

| Entity family | Current authority | Target authority / boundary |
|---|---|---|
| Catalogue, content, settings, presentations, revisions | Existing PostgreSQL | Private Content workbook; validated staging edits and controlled canonical writer |
| Inquiries, orders, notes, assignments, consent, private references, subscribers | Existing PostgreSQL | Private Operations workbook; co-located transaction envelope/ledger |
| Staff, password hashes, sessions, recovery, throttles | Existing PostgreSQL | Private Security workbook only if concurrency/security acceptance passes; otherwise narrow documented ongoing-free database exception |
| Historical audit, migration mappings/conflicts | Existing PostgreSQL | Private System workbook; co-locate each mutation's audit/history with its canonical change |
| Jobs, leases, checkpoints, research observations, catalogue metadata | No deployed replacement | Canonical persistent writer in the appropriate private boundary; opaque cross-boundary references |
| Originals, Blob objects, private attachments, generated files | Existing Drive/repository/Blob per registered asset | Drive for managed files; repository public assets may remain |
| Published site | Existing SQL published source | One immutable validated Drive bundle and atomic active pointer; cached last valid public version |

No new database has been selected or provisioned. A race in an unfinished adapter is not evidence that Google cannot support a correctly coordinated operation. The canonical writer can arbitrate a single-record throttle. Cross-record access redemption, order/reference transactions, sustained rate and real quota/latency must be measured before claiming that all security/operations requirements fit Sheets.

If those measurements demonstrate a gap, document exact entities, cross-store constraints, owner account, independently verified free plan, no auto-recharge, export/restore and fail-closed limits before activating the smallest database exception. Existing Neon remains recovery/current authority, not an approved permanent exception inferred from its presence.

## Measured capacity and unknowns

Fresh source inventory: 22 tables / 3,454 rows; protected non-transient baseline 3,425 rows. Largest tables are revisions (1,395), audit (1,099), content (535), media (154), catalogue (120). The real read-only rehearsal measured 54,650,653 bytes of row JSON: 3,144 inline records and 310 full-document records requiring Drive. Mapped row counts are Content 2,210 (310 documents), Operations 116, Security 29 and System 1,099. These are source plans, not imported records or target sizes. This does not measure write rate, peak concurrency, p95 latency, Drive remaining capacity, retained-history growth or recovery duration. Those are open acceptance measurements.

The existing Google sandbox allocates 100 rows per tab; production-scale migration needs reviewed capacity planning, not blind tab resizing. The controlled writer has bounded complete-snapshot reads and audit/history growth; exceeding its budget must block safely and trigger an explicit compaction/sharding design with retained history.

Official limits checked on 28 October (account eligibility is separate):
- [Netlify credit plans](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/): Free has 300 monthly credits and a hard limit. The live site reports Free. Actual account readback confirms 300 plan credits, auto-top-up disabled and no paid trial. Remaining credit usage still requires readback before release.
- [Sheets limits](https://developers.google.com/workspace/sheets/api/limits): documented read/write quotas are 300/min/project and 60/min/user/project, with recommended 2 MB request payloads. Standard use is no additional cost; Google describes quota-billing changes planned later in 2026. Keep bounded queues/backoff; do not enable billing or exhaust quota for a test.
- [Apps Script quotas](https://developers.google.com/apps-script/guides/services/quotas): 6 minutes/execution and 30 simultaneous executions/user. Design resumable bounded steps below the limit. Trigger presence alone does not prove durability.

## Credentials and write controls

Private server credentials and signing material stay in Netlify contexts and Google Script Properties. A connector session is not an application credential. OAuth Playground access tokens cannot serve as production renewal. Use a scoped server renewal lifecycle; monitor expiry and fail closed on revoked/expired authority. Google documents [offline renewal](https://developers.google.com/identity/protocols/oauth2/web-server); consent applications in Testing can issue seven-day refresh tokens. Verify the actual consent configuration before promising unattended operation.

Do not expand the installed gateway's scopes, resource allowlist or sharing merely to get a test passing. Four workbooks are separate confidentiality boundaries. Hidden tabs/protected ranges are not privacy. Direct canonical edits by an owner can bypass Apps Script locks; edits belong in staging with expected revision, validation and review.

Mutation requirements: authenticated actor, trusted authorization, schema validation, expected revision, stable idempotency key, atomic record/audit/history/receipt batch, and unknown-outcome quarantine. Do not retry a possibly committed mutation under a new identity. Slow external calls stay outside the write lock.

## Publication, jobs and recovery

Public projection excludes private/security/operations data. Validate complete source/design/shell/media together, store an immutable version, then CAS its active pointer. Use a bounded rebuildable public cache and last valid snapshot; never fall back to stale SQL after cutover. Revalidation must be measured on actual Netlify.

Job state belongs in the canonical store: inputs/revisions, lease/fence, checkpoint, retry time, cancellation and verified outputs. Native Google file copies cannot use pre-generated IDs ([Drive guidance](https://developers.google.com/workspace/drive/api/guides/create-file)); record an intent before copy and quarantine unknown outcomes. Search-then-copy is not a duplicate-proof transaction.

Migration uses actual permitted source rows only. Preserve IDs, primary/foreign/JSON relationships, slugs, decimal prices, variants, timestamps, disclosures and all populated values. Record absent tables, conflicts and unsupported shape explicitly. No product additions, archived imports or “recovered” old data.

Before cutover: independently verified encrypted backup + restore, write fence/drain, measured final delta, target reconciliation and coherent authority switch. After cutover: retain/export new writes so recovery cannot lose them. A flag, successful build, source receipt or memory ledger cannot establish readiness. Retire SQL/Blob/Vercel resources individually only after verified replacement and exact destructive authorization.

The local OAuth renewal provider is now implemented and emulation-tested, but no live credential is bound to it. Windows private metadata output uses native owner-only ACL restriction plus readback before writing. Neither implementation establishes actual provider acceptance.
