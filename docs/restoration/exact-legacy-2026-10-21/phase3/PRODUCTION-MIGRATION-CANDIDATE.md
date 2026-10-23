# Phase 3 production migration candidate — not executed

Prepared 23 October 2026 for the RivyaLivingArt2.0 application serving `www.rivyalivingart.com`. The owner currently permits local work only. This document does not grant production migration, media upload, CMS publication or release authority.

## Exact scope

Schema candidate: `scripts/restoration-phase3-schema.sql`. It creates four new tables and their checks/primary/foreign keys: `rivya_editorial_extensions`, `rivya_editorial_extension_revisions`, `rivya_restoration_crosswalk`, `rivya_restoration_conflicts`. It does not update/delete current catalogue, content, public media, orders, references, users or settings. The named catalogue-exclusion constraint is additive on the new crosswalk table and replay-safe.

Application candidate: the local descendant of `5545ffb` documented in [the implementation report](PHASE-3-IMPLEMENTATION.md). Public snapshot queries now include the extension table; the schema and SELECT grant must exist **before** candidate app activation. Reverting the app to `5545ffb` remains compatible with the additional tables.

No data backfill is proposed: the old source database was deleted, archive/product imports are forbidden, and no verified source IDs or new product associations exist. Private local drafts and synthetic rows must never be bulk-copied into production. The six branded images are separate review candidates, not a migration payload or publication instruction.

## Required target and backup receipt before authorization

An owner-controlled read-only connection must establish the current destination project/database/branch and runtime role at execution time. Those identities and credentials are deliberately absent here and must not be guessed from historical deployment settings. The known logical target is RivyaLivingArt2.0; a current physical DB target has not been verified by this local checkpoint.

Before presenting an executable production action, record privately: exact target identity, schema/table fingerprints, current app revision, affected-row plan (expected existing-row DML = zero), immutable media inventory, verified encrypted backup identity/time and a tested restore target. Reconcile existing table names/constraints with the candidate and stop on incompatible definitions; `IF NOT EXISTS` alone does not prove schema compatibility. Establish a restore receipt rather than claiming that an untested export is recovery evidence.

## Concrete rollout sequence after explicit authorization

1. Verify expected deployment/app head and refresh the protected data/media baseline through a read-only role.
2. Run the reviewed schema transaction using an owner-controlled DDL role on the verified production target. Do not replay any request-table repair or historical seeds.
3. Grant the existing application runtime role only SELECT/INSERT/UPDATE on extensions, SELECT/INSERT on extension revisions. Crosswalk/conflict tables are reserved for a separately authorized migration operator; the app currently does not write them. Do not grant DELETE, TRUNCATE, CREATE or ownership as a shortcut. Exact role identifiers must be reviewed before SQL is produced.
4. Verify all 31 columns and the expected constraints/grants read-only, then activate the exact approved app revision through the normal release process. Confirm public reads, protected login and existing media before enabling new operations.
5. Reconcile all protected row/file hashes. Compare newly created tables separately. No media upload or publication accompanies schema/app activation.

The 20 MB raster and 40 MB file validators describe application limits. A hosted request gateway may impose a lower upload ceiling; actual hosting upload transport/limits must be verified before production activation. No claim of successful large-file production upload is made. A direct private upload mechanism, if required, needs bounded authorization and equivalent validation; do not expose Blob credentials or originals to bypass the gateway.

## Recovery and evidence

Local rehearsal applies the exact candidate twice, rejects a stale expected revision, and rolls a temporary mutation back with identical table counts. Authenticated API testing also restores a historical category revision as a new draft. None of this proves a production backup or restores deleted source data.

If app verification fails, return to the previously verified app revision and retain the additive tables and private objects. Do not DROP tables, delete uploaded originals, revert populated business rows or copy test history into production. If a later approved metadata publication needs withdrawal, use its versioned hide operation; restore a historical draft independently from publication. Keep partial uploads private and reconcile them explicitly. An owner-approved destructive cleanup, if ever needed, is a separate operation with its own backup and affected-object list.

Status: **candidate prepared; physical target, backup, runtime grants, hosted upload path, production rehearsal and authorization pending**. Production writes/publications/releases performed by this checkpoint: **0**.
