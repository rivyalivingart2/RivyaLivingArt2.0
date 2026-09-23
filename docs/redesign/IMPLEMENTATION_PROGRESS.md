# RivyaLivingArt Implementation Progress

## Current Phase

Phase 6 source/schema complete. Post-Phase-6 shared database/private storage configuration saved under master revision 3.7; production release paused by owner. Next P7.1. Intake remains disabled; application QA is Phase 11.

## Current Task

Shared configuration, backups, safeguards and resumable documentation complete. Phase 6 merged through PR #20 into main 8fd2cf02174ccb81c67586389d5bc958fa442b29. Follow-up branch: codex/shared-database-configuration. The local completion artifact records the final pushed SHA. See SHARED-DATA-CONFIGURATION.md and shared-data-configuration.json.

## Completed

- P6.1: accepted product/bespoke payload validation, canonical hash, guest/request ownership, original-schema duplicate recovery, owned private upload identity.
- P6.2: atomic Studio order/inquiry/immutable snapshots/consent/source/reference links/NEW event/audit; session-first serialization and version/config checks.
- P6.3: message prepared from committed saved evidence, pinned template and destination version, bounded idempotent finalization; ready messages never overwritten.
- P6.4: pending/ready/failed/legacy/unavailable receipt states; authorized guest/staff recovery without creating another inquiry.
- P6.5: complete encoded message, long-link copy-first, selectable clipboard fallback and blocked-app recovery.
- P6.6: independent Studio retrieval, typed saved answers, bespoke/null-product compatibility and saved-order actions.
- P6.7: truthful maintenance and saved-request copy; customer still presses Send in WhatsApp.
- P6.8: generic/default-number wiring removed; old datasets/presentations preserved with production guards; no additional WhatsApp system.
- Existing isolated Preview credentials retrieved directly into ignored configuration under owner delegation; explicit private Blob token handling fixed.
- Independent encrypted owner-profile backup captured and readable; additive v2/upload-identity DDL applied in one guarded Preview transaction; all original data/counts preserved.

## In Progress

None for this configuration checkpoint. No deployment, active migration or application server. Phase 7 has not begun.

## Pending

P7.1 original-versus-amended Studio detail; remaining P7 roles, Kanban, publishing, retention/export capabilities. P8 public content/policies, P9 media/motion, P10 integrated commercial readiness, P11 formal QA/full restore, P12 final main and eligible production release.

## Blocked

- Commercial activation: owner explicitly paused production under Vercel-only/free-only constraints; automatic Git deployment remains disabled.
- Shared-data operation: require separate disposable database/storage for synthetic QA and full restore. Existing integration associations can overwrite manually aligned values after reconnect/rotation; recheck before release.
- Activation prerequisites: least-privilege runtime grants, environment-specific staff credentials/session revocation, reviewed catalogue/content publication and actual business settings.
- Recovery/privacy: full isolated restore proof, backup portability/cadence/retention/RPO/RTO, submitted-reference retention and deletion responsibilities.
- Release: complete later phases and exact-candidate QA. Preview schema application does not establish end-to-end application correctness.

Masked Preview database/Blob values and backup destination/key custody are no longer pending user-input blockers. The owner delegated both; they were handled without exposing secrets. Do not ask again or repeat the migration.

## Owner Input Required

None for the approved shared database/private storage configuration or source publication. The owner explicitly kept free-only and paused production. Do not repeat approvals or request secrets in chat.

## Files Changed

Shared-data guard in preview-mode.ts; isolated-mode guards in seed-reviewed-preview.mjs and studio-migrate.mjs; .env.example; shared-data decision/report/sanitized receipt, master/progress and active continuation guidance. Prior Phase 6 source remains preserved.

## Database Changes

Historical Phase 6 additive migration: see phase-6-preview-migration.json; do not rerun. This follow-up changed only Vercel environment configuration, with no database schema/data mutation. Both databases were backed up independently; old Production has four empty original tables, shared target has 16 tables with one budget and one existing session row and all other counts zero. Private objects: zero. Production variables now target the modern database for future deployments, and both environments have approved private reference storage access. Existing deployments retain old captured configuration.

## Testing Completed

Node 22 TypeScript no-emit wiring and modified maintenance-script syntax checks passed. Read-only inventories, unchanged row fingerprints, encrypted roundtrip checksums/archive readability and Vercel update acknowledgements with independent IDs/scopes readback recorded. Sensitive plaintext comparison was unavailable. No application/browser/build/lint/concurrency/upload/message/full-restore QA or synthetic records; no TESTED claim.

## Known Issues

Both order write flags remain off/unset. Pending-upload recovery may require waiting five minutes for the lease; unconfirmed pending references retain quota and can block that brief until recovered or expired cleanup after 24 hours. Prove late-write/cleanup reconciliation and assess cancellation tombstones in P10/11. Changed destination/version blocks opening while retaining copy; no audited override yet. Five failed preparation attempts require staff remediation without replacing saved evidence. Legacy unknown destination remains unknown. Unsaved tab state still does not survive reload/close. Full runtime denial/concurrency and restore evidence remain deferred.

## Next Exact Task

**P7.1 — Complete Studio detail layout and immutable original versus operational amendment separation.** Read the shared-data report/decision, Phase 6 report and applied migration receipt first. Preserve all records/IDs/private references and reuse saved-order controls. Main: 8fd2cf02174ccb81c67586389d5bc958fa442b29; branch: codex/shared-database-configuration. Verify current refs before resuming. Repository: C:/Users/gonda/Documents/Codex/2026-09-23/rivyalivingart-website-studio-preview-sites-project/work/repo. Synthetic QA and restore rehearsals must use separate disposable resources, never the shared database/store.

## Resume Instruction

Read AGENTS.md, PROJECT_STATE.md, docs/CODEX_WORKFLOW.md, the shared-data owner decision, master revision 3.7, this file and SHARED-DATA-CONFIGURATION.md. Continue P7.1 without restarting/reapproving. Credentials are already in ignored configuration; independent backups exist. Keep both order write flags and automatic deployment off. Production release remains paused under free-only/Vercel-only requirements. Check integration variable destinations before any later deployment.
