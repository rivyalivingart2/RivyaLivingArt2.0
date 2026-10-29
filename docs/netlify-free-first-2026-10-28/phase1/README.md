# Phase 1 — Remaining-work architecture checkpoint

28 October 2026. The owner now explicitly requests fixing the storage capacity issue locally, completing previous pending work and then proceeding. [Pending-work closure](../PENDING-CLOSURE.md) records the provider observations and implementation evidence. GitHub pushes, PR creation/updates and merges remain prohibited until the owner's later permission. External configuration and production records remain unchanged under this local-only scope.

**Local architecture package prepared; bounded inline-capacity repair is now implemented and measured in [Phase 2](../phase2/README.md).** Ongoing-free allocation, large-document materialization, provider safety/latency and history-growth acceptance remain unresolved. The design, complete table mapping, actual source-encoding measurements, bounded provider procedures and migration/recovery contract are reviewable. Existing writer registration and signed reads were verified at the recorded checkpoint. Phase 1's scope is the architecture and plan. Real writer/credential/provider acceptance belongs to Phase 2, actual target reconciliation and restore to Phase 3, full Studio parity to Phase 5 and complete browser/performance acceptance to Phase 9. Those checks remain open; they do not block the local foundational code needed to make them possible. No later acceptance is inferred from this sequencing correction.

| Task | Deliverable and affected files | Data/auth/media impact | Status / verification / next dependency |
|---|---|---|---|
| NFF-100 | [ADR](ADR-001-AUTHORITY.md), [store contracts](STORE-CONTRACTS.md), schema-derived table map in capacity assessment | Defines one future authority for all 28 mapped tables, six explicitly absent, plus new job/publication/media families | Local design prepared. No database selected. Multi-record writer and five provider gates precede target acceptance |
| NFF-101 | [Capacity and service placement](CAPACITY-AND-PLACEMENT.md), [measured encoding](source-encoding-measurement.json), [remediation contract](CAPACITY-REMEDIATION.md), source profile/policy/assessment and offline assessor | Counts/aggregate sizes only; no raw rows, credentials or provider writes | The old whole-snapshot protocol fails. Phase 2 now implements bounded reads/history and verifies actual-source inline sizes locally; large documents, real target responses, demand, p95, quota accounting and growth remain unverified |
| NFF-102 | [Provider acceptance and permissions](PROVIDER-ACCEPTANCE.md) | Specifies staging, credential renewal, transaction and isolation gates | Design/procedures prepared; existing signed writer binding verified at the preceding checkpoint. Renewable Drive/Slides binding and all five real checks remain Phase 2 acceptance work |
| NFF-103 | [Migration and recovery](MIGRATION-AND-RECOVERY.md) and [Phase 0 follow-up](../phase0/FOLLOWUP.md) | Preserves source authority, original files, histories and post-cutover writes | Rehearsal/recovery plan prepared. Seven archive objects retained; contents/current restore not verified |

## Next implementation sequence

1. Preserve the actual Phase 0 audit and Phase 1 design findings, including unavailable inventory, account/usage and ongoing-free capacity facts. Resolve each dependency in its assigned phase; do not reinterpret a missing later-phase restore or workflow test as a prohibition on all local code work.
2. Continue from the implemented [Phase 2 bounded writer](../phase2/README.md): bounded reads, retained history, same-boundary multi-record writes and durable mutation reconciliation. Provider activation remains off. Local tests cover competing callers, atomic groups and uncertain outcomes. This is foundational implementation, not provider acceptance.
3. In Phase 2, bind/verify renewable credentials and the installed deployment, complete the five real Google checks, and measure actual source-scale provider bytes/latency/capacity. Decide any narrow free-database exception from demonstrated evidence. Validate actual quota/billing settings before unattended work; no external change is implied by the current local-only instruction.
4. In Phase 3, create and restore a protected manual checkpoint before an isolated target rehearsal with actual permitted records and media readback. No product additions or archived imports. Preparing local recovery tooling is not a verified current backup.
5. Integrate auth/operations/publication routes with durable adapters in Phase 4, then complete Studio/media/scraper/catalogue workflows and full verification in their assigned phases. Production actions and GitHub publication retain their separate authorization boundaries.

## Reporting dimensions for this step

- Implemented: offline capacity assessor, aggregate inputs/report and detailed local architecture/acceptance contracts.
- Locally verified: see [VERIFICATION.md](VERIFICATION.md); application runtime tests are historical, not rerun or credited to this documentation/tool change.
- Real-provider verified: existing owner-only Google registrations, four signed reads, archive/billing metadata, public observations and current authenticated read-only Studio checks in the pending-work report; no new controlled Google writes or five-check acceptance passes.
- Preview verified: no new preview.
- Migrated / cut over / production released: none in this step. Existing hosting deployment remains the previously verified migration SHA.
- Old dependencies removed: none. SQL/Blob/Vercel/OLDWEBSITE remain protected.
- Backups retained: seven designated archive objects observed; encryption/readback/restore/current coverage not verified.

All changes stay on the existing local `codex/netlify-free-first` branch descended from migration `7b390d5`. No push, PR mutation, branch switch, production publication, database provisioning, billing upgrade, scheduled backup restart or resource deletion occurred.
