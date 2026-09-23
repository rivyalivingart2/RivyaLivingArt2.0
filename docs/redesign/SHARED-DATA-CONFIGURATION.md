# Shared Preview/Production data — configuration checkpoint

23 September 2026. Master revision 3.7. Owner-approved environment change after Phase 6; Phase 7 has not been executed. Production release is paused by the owner's latest free-only decision.

## Configured result

- Vercel project: `rivya-living-art2-0`, `prj_J90SIW3OHaXYsmhan527F4n8PYUc`.
- Shared database target: existing Neon project `blue-haze-08978208`, resource `store_TYe2hzqKpB0JBuDN`, still named `rivya-studio-preview`. Its name is historical; it is now the configured shared target for future Preview and Production deployments.
- Sixteen existing Production database configuration values were updated in place to the shared target, including `DATABASE_URL`, its direct endpoint, all PG/POSTGRES aliases and `NEON_PROJECT_ID`. Existing variable IDs, scopes and sensitivity were preserved. No environment variable was deleted.
- Existing private Blob token, store ID and webhook public key now include Production as well as Preview, following the owner's separate explicit approval. The token value and private access mode were unchanged. Store: `store_1W9MAXAeFr2AwK23`.
- `RIVYA_DATA_MODE=shared` is set for future Preview and Production deployments and in ignored local configuration. Order intake/message flags remain off/unset. Authentication credentials and session secrets are unchanged.
- No deployment was created. The existing production deployment remains `dpl_7HRC8CVEJ98ih86yRxoppxVgMgR2`, source `f9533bbbaf3cc2843025f1a1243442b0a9d920e8`.

**Configuration is saved, but the running deployments have not switched.** Vercel environment changes take effect on new deployments. Production and old Preview deployments retain their original captured connections until an eligible, approved redeployment. [Vercel environment-variable management](https://vercel.com/docs/environment-variables/managing-environment-variables)

## Preservation and verification

Fresh inventory before changes found four empty original Studio tables in the old Production database. The updated Preview database had 16 application tables, one storage-budget row and one existing Studio-session row; all other counts were zero. There were zero private objects. No customer, catalogue or content records were merged or copied because none existed in either target.

Independent encrypted PostgreSQL custom archives, schema/constraint/permission/count/fingerprint manifests and rollback connection configurations were saved for **both** databases. Backup ID: `shared-database-2026-09-23T15-25-17-543Z`. Archive decryption checksums and `pg_restore --list` succeeded; before/after backup record fingerprints matched. This is backup integrity/readability evidence, not a full restore rehearsal. The old Production resource `store_umI4IOBaZhgswS7T` / Neon `frosty-tree-67209980` remains available with its original data and schema.

Vercel acknowledged every in-place database update. A subsequent metadata read confirmed existing variable IDs and intended scopes; the Blob scopes and shared-data marker were also read back. Decrypted sensitive values were not available for independent value comparison, so no runtime connection-equality test is claimed. No secrets were printed or committed. `shared-data-configuration.json` contains only sanitized configuration/backup evidence.

## Connection metadata and drift

Vercel's managed connection update initially found conflicting Production variable names. Automatic review blocked removing the old resource connection because it would delete those variables. The safer permitted route updated their values in place, leaving **both original resource connection associations** intact. Thus the Storage connection cards may still show the old Production association even though future Production environment values were updated to the shared target.

Do not reconnect, regenerate or rotate the old integration's generated variables without reconciling this override: a provider synchronization could restore the old values. Before the eventual release, read the variable destinations and shared marker again and verify the deployed runtime against the chosen database. Metadata cleanup is not required for the current environment override and was not attempted through an alternate deletion path.

## Shared-data safeguards

`seed-reviewed-preview.mjs` and `studio-migrate.mjs` now require an explicit `RIVYA_DATA_MODE=isolated` before connecting. The shared environment cannot run these isolated-only import/bootstrap paths. The visual-preview policy denies fixture/presentation routes when data mode is shared, including local development using shared credentials. These guards supplement operator checks; changing the marker does not make a shared database isolated.

Do not run synthetic inquiries, destructive tests, fixture seeds, reset commands or restore rehearsals against this database or private store. Phase 11 must use a different disposable database/store and dedicated credentials. Ordinary authorized Preview Studio changes, once activated, will intentionally affect the shared records. Database sharing does not merge browser/staff sessions or remove role checks.

Source wiring checks: both modified maintenance scripts pass Node syntax checking; TypeScript no-emit compilation passes with Node 22.23.2. No lint/build/application/browser/concurrency/upload/message/restore QA was performed. No new TESTED claim.

## Release and rollback

The owner kept free-only hosting and paused production after fresh confirmation of Hobby. Vercel's current Hobby policy limits that plan to personal/non-commercial use; RivyaLivingArt's catalogue and order workflow have a commercial purpose even without online payments. No paid upgrade, trial, Netlify deployment or new hosting account was introduced. [Vercel Hobby policy](https://vercel.com/docs/plans/hobby#hobby-billing-cycle)

To reverse the future configuration, use the encrypted old Production connection snapshot and update the same existing Production variable IDs in place; Preview need not change. Reverting shared private-store scope must be deliberate and coordinated with any deployed reference data. Do not delete either database, resource connection or private object. Since no new deployment or data write occurred, the existing live site needs no rollback for this configuration-only change.

Before activating: resolve hosting eligibility; complete remaining Studio/content/media/readiness work; establish least-privilege runtime roles, retention/privacy and full restore proof; publish reviewed real records deliberately; perform Phase 11 QA against isolated data and the final candidate; then deploy with explicit shared-data configuration. The shared database currently contains no published catalogue/content/settings, so code publication alone would not produce a populated final site.

## Resume

Start from main merge `8fd2cf02174ccb81c67586389d5bc958fa442b29` plus branch `codex/shared-database-configuration`. Read the latest decision, master 3.7 and this receipt before **P7.1**. Treat earlier references to an isolated Preview database as historical where superseded. Existing Phase 2/6 migration receipts remain valid history; no migration was replayed here. The local completion artifact records the private backup path and final Git publication SHA.
