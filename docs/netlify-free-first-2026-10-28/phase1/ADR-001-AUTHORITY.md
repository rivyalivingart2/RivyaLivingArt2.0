# ADR NFF-100 — Sheets/Drive first, with explicit transaction and capacity gates

Date: 28 October 2026. Status: **accepted owner direction; implementation choice provisional pending measurements**. This record specifies the next local work, not an activated provider or approved production migration.

## Context

The owner requested the next step after Phase 0 and continues to prohibit GitHub pushes and PR changes. Production still reads SQL/Blob. The later [provider readback](../PENDING-CLOSURE.md) verifies four private Google registrations and successful signed reads. Immutable deployed-version source equivalence, renewable Drive/Slides runtime credentials and five provider acceptance checks remain open. The earlier source census contains 22 tables and 3,454 rows; later security counts can change through normal sign-in and session activity. The 28-table schema includes six absent tables; absence is preserved.

## Decision

Keep Netlify as application host and GoDaddy/www configuration intact. Prefer the four existing private Sheets boundaries for canonical records and Drive for immutable large documents, originals and generated files. The [store contracts](STORE-CONTRACTS.md) assign every mapped table and new workflow family one authority. Sheets records that reference a Drive payload own the identity, revision and hash; the referenced bytes are part of that record, not an independently editable second master.

Retain SQL/Blob as the current authority until actual target reconciliation and a controlled switch. No production dual writes. Direct Sheet changes use staging inputs with expected revisions and validation. Staff use authenticated Studio routes; spreadsheet sharing does not grant an application role. The owner can bypass Google protections, so owner/API edits during a commit remain an explicit isolation risk and acceptance gate.

Extend the existing writer for bounded, same-workbook multi-record transactions before integrating access redemption, revocation and order workflows. Each batch must include records, history, audit, durable idempotency and the coordinator state. Slow Drive/network operations use recorded intent plus verified readback outside the critical section. Do not treat a single-record adapter or a lock shared only by cooperating clients as a cross-system transaction.

## Alternatives and consequences

| Option | Benefit | Limitation / disposition |
|---|---|---|
| Sheets/Drive with controlled writer | Owner-editable inputs; reuse existing resources | Full-snapshot cost, owner bypass, quota/latency and append-only growth need proof; preferred conditional target |
| Narrow ongoing-free database | Could give security/operations stronger atomic coordination | Additional provider/cost/recovery responsibility; not selected or provisioned |
| Keep all current SQL/Blob permanently | Minimal immediate change | Does not deliver the requested target; retained only as current authority/recovery while work proceeds |
| Two authoritative stores or process-local Maps | Superficially simple integration | Rejected: conflicting writes or lost state |

Current implementation deficiencies are reasons to finish and test the writer, not proof that a database is necessary. If safe coordination cannot be demonstrated, first consider Security's access requests, staff, sessions and throttles as one transaction family. Extend an exception to Operations only for a separately demonstrated requirement. Preserve one authority and a versioned Sheets staging/projection role for any excepted entity.

The observed 5 TB Google entitlement is a time-limited Jio benefit, with actual use already above the ordinary 15 GB free allowance. It cannot underpin an ongoing-free guarantee. No personal files may be removed to manufacture capacity. Resolve expiry/post-offer capacity and exhaustion behavior before accepting Drive placement; no paid continuation is authorized. Source encoding measurements must also decide bounded partitioning before the current whole-workbook protocol can be accepted.

The later accepted source measurement demonstrates that Content's inline records plus initial history alone exceed 152 MB of signed wire representation and 68 million normalized characters. **Reject the current whole-workbook read protocol for real source-scale activation.** Adopt [bounded canonical reads and retained-history manifests](CAPACITY-REMEDIATION.md) as the next implementation contract. This changes access and encoding while keeping one authoritative store per record type. It does not authorize destructive compaction, a new database or relaxed integrity checks.

Before selecting an exception, record: failing requirement and reproducible evidence; exact owned entities; provider/account ownership and independence from Vercel; current ongoing-free storage/compute/connection/egress limits; no paid trial/auto-recharge; export format and isolated restore; and fail-closed behavior at exhaustion. A known database URL or a Free marketing page is insufficient. No exception is selected here.

## Acceptance

[Capacity/placement](CAPACITY-AND-PLACEMENT.md), [provider acceptance](PROVIDER-ACCEPTANCE.md) and [migration/recovery](MIGRATION-AND-RECOVERY.md) are binding design gates for implementation. Every unresolved measurement remains non-passing. Runtime activation, provider scope changes, migrations, publication and release are separate actions. No accepted historical decision is rewritten; this record supersedes conflicting older service-placement assumptions for the new work.
