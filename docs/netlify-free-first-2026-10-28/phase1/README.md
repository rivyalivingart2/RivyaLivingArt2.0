# Phase 1 — Remaining-work architecture checkpoint

28 October 2026. The owner's next-step instruction advances local work from Phase 0 into Phase 1. GitHub pushes, PR creation/updates and merges remain prohibited until the owner's explicit later instruction. No provider or application runtime configuration changed.

**Local architecture package prepared; Phase 1 acceptance remains partial.** The design, complete table mapping, source-derived capacity model, bounded provider procedures and migration/recovery contract are reviewable. Real installed-provider capacity, workload/latency and credential binding are still unverified. Phase 0's unresolved authenticated Studio and recovery gates remain open; they are not silently completed to advance independent design work.

| Task | Deliverable and affected files | Data/auth/media impact | Status / verification / next dependency |
|---|---|---|---|
| NFF-100 | [ADR](ADR-001-AUTHORITY.md), [store contracts](STORE-CONTRACTS.md), schema-derived table map in capacity assessment | Defines one future authority for all 28 mapped tables, six explicitly absent, plus new job/publication/media families | Local design prepared. No database selected. Multi-record writer and five provider gates precede target acceptance |
| NFF-101 | [Capacity and service placement](CAPACITY-AND-PLACEMENT.md), [source profile](source-profile.json), [policy](capacity-policy.json), [assessment](capacity-assessment.json), offline assessor | Counts only; no raw rows, credentials or provider writes | Source arithmetic verified locally. Snapshot/wire bytes, demand, p95 latency, capacity, quota accounting and growth remain unmeasured |
| NFF-102 | [Provider acceptance and permissions](PROVIDER-ACCEPTANCE.md) | Specifies staging, credential renewal, transaction and isolation gates | Procedures prepared; all five live-provider checks still open. Exact retained private installation/identity binding required |
| NFF-103 | [Migration and recovery](MIGRATION-AND-RECOVERY.md) and [Phase 0 follow-up](../phase0/FOLLOWUP.md) | Preserves source authority, original files, histories and post-cutover writes | Rehearsal/recovery plan prepared. Seven archive objects retained; contents/current restore not verified |

## Next implementation sequence

1. Finish exact private installation and credential readback through legitimate owner-controlled access without reprovisioning or rotating secrets. Independent local foundation work can continue while this is unavailable.
2. Implement the bounded same-boundary multi-record writer and durable mutation reconciliation, plus partition/capacity handling with retained history. Keep it inactive until acceptance. Add tests that exercise competing independent callers, atomic groups and uncertain outcomes, not only shape checks.
3. Complete the five real Google checks and measure source-scale bytes/latency/capacity. Decide any narrow free-database exception from demonstrated evidence, not from an unfinished adapter. Validate actual quota/billing settings before unattended work.
4. Create and restore a protected manual checkpoint, then perform an isolated target rehearsal with actual permitted records and media readback. No product additions or archived imports.
5. Integrate all auth/operations/publication routes with durable adapters and no obsolete provider fallback. Proceed to Studio/media/scraper/catalogue verification under the master programme. Production actions and GitHub publication retain their separate authorization boundaries.

## Reporting dimensions for this step

- Implemented: offline capacity assessor, aggregate inputs/report and detailed local architecture/acceptance contracts.
- Locally verified: see [VERIFICATION.md](VERIFICATION.md); application runtime tests are historical, not rerun or credited to this documentation/tool change.
- Real-provider verified: limited archive/billing metadata and public browser observations in the Phase 0 follow-up; no new controlled Google writes or acceptance passes.
- Preview verified: no new preview.
- Migrated / cut over / production released: none in this step. Existing hosting deployment remains the previously verified migration SHA.
- Old dependencies removed: none. SQL/Blob/Vercel/OLDWEBSITE remain protected.
- Backups retained: seven designated archive objects observed; encryption/readback/restore/current coverage not verified.

All changes stay on the existing local `codex/netlify-free-first` branch descended from migration `7b390d5`. No push, PR mutation, branch switch, production publication, database provisioning, billing upgrade, scheduled backup restart or resource deletion occurred.
