# Source of truth and remaining dependencies

23 September 2026. Phase 2 source inspection, not runtime verification.

| Area | Current evidence | Owner / next task |
|---|---|---|
| Source | Existing codex/whatsapp-order-experience at f9533bbbaf3cc2843025f1a1243442b0a9d920e8; 33 draft files preserved with hashes before editing | Codex; baseline.json |
| Remote main | GitHub connector readback matches f9533bbbaf3cc2843025f1a1243442b0a9d920e8 | Codex; reconcile again at P10.2 |
| Deployment trigger | Vercel lists READY production dpl_7HRC8CVEJ98ih86yRxoppxVgMgR2 from that main SHA; prior work branches produce Preview | Codex; do not push main before eligibility gate |
| Dependencies | Existing lockfile, Next 16.3.5 / React 19.3.0 / Node 22; Neon, Blob, sharp, Tiptap already present | Retain pins; no new paid service |
| Database | Existing studio-schema.sql applied according to earlier release record; new whatsapp-schema.sql remains unapplied according to handoff. No DATABASE_URL available in this shell | Codex P6.1: provider schema-only inspection, backup, isolated Preview migration; never infer from source |
| Private storage | Historical Preview-only linkage. BLOB_READ_WRITE_TOKEN is required. Current linkage cannot be confirmed from shell | Codex P6.3: inspect dashboard scope/limits before upload |
| Authentication | Existing owner session system plus uncommitted staff drafts; scope defects discovered | Codex P7.2: enforce assigned-record permissions, then final QA |
| Vercel configuration | get_project connector rejects its documented projectId because upstream expects idOrName, while connector rejects idOrName; deployments listing works | Codex: dashboard/CLI fallback; no repeat malformed requests |
| Hosting | Official Hobby documentation still limits use to non-commercial personal projects (https://vercel.com/docs/plans/hobby, read 2026-09-23). Commercial eligibility remains unresolved | Codex P9.8/P10.3: eligible free host/adapter review or provider confirmation; no upgrade/trial |
| Public products | All 120 source IDs inventoried; owner approves supplied set. Existing draft silently falls back to fixtures when DB missing | Codex P4/P7: explicit approved versions in DB; no fixture fallback |
| Public text | Supplied policies/content approved; no new address, hours, warranty, retention or delivery promise inferred | Codex P5: review every source article, retain held fictional projects |
| Media | Existing public derivatives/provenance retained. Drive root and detail folder read successfully; 15 detail entries include originals and derivatives | Codex P8: inspect/crop/optimize only approved derivatives; no new rights inference |
| Historic samples | 36 source articles, 8 project examples, 24 fictional quotes, 40 operational fixtures preserved | Codex: no fabricated live case studies/testimonials/orders |

## Migration and backup path

No migration was executed during Phase 2. Before any schema mutation, confirm the Preview database identity and separation from Production, obtain a provider restore point or private backup, inventory only table/column names and counts, review additive migration against actual schema, and record the migration digest/environment/receipt. Preserve orders, IDs, stages, sessions and all history. Initial publication must be deliberate and idempotent, never build-time fixture seeding. Production repeats the reviewed migration after final QA, its own backup and eligible release decision.

## Known draft defects assigned to later phases

- P3: global text/font tokens disagree with active scoped navy CSS; header menu lacks required navigation/active/focus handling.
- P4: collection filters are transient; forms lack review step/product differences/conditions and reference removal.
- P5: receipt route missing; material/about aliases render duplicates; global noindex and incomplete sitemap; 36 article instances not reconciled to the three live-draft stories.
- P6: upload count uses a racy read-before-write; MIME content detection/receipt expiry/orphan lifecycle incomplete; long WhatsApp fallback loses reference context.
- P7: any signed-in editor can read/move other inquiries and private references; draft catalogue appears public; content/media/settings/overview not connected.

No real customer information, private files or credentials appear in these records.

## Current correction — 23 September, master revision 2.4

The preceding table is the Phase 2 baseline. Current schema and provider evidence is in INFRASTRUCTURE.json. All five additive Preview changes succeeded after the private snapshot; production remains untouched. CLI login/link succeeded but sensitive Preview env values remain masked locally. User entry of the isolated DATABASE_URL and Blob token is required for source runtime integration. Netlify onboarding is cancelled by the latest owner instruction. Vercel-only commercial activation is on hold; see VERCEL-COMMERCIAL-USE.md. All named baseline source defects have implementation changes; none has final QA evidence yet. See CHECKPOINT.md and reviewed-publication.json.
