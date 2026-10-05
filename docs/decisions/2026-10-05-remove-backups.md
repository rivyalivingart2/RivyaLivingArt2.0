# Remove project backup operations

5 October 2026. The owner requested: **“REMOVE BACKUP FROM THIS PROJECT ENTIRELY.”** This overrides all earlier backup, independent archive-key custody, schedule, restore-drill and RPO/RTO requirements in this repository. Those tasks are **removed by owner**, not passed acceptance checks.

## Removed

- Encrypted archive generation and Drive upload/verification tool, receipt writer and its dedicated unit test.
- Dedicated backup operations and archive-key custody runbooks, schedule snapshot and backup/restore receipts in the current checkout.
- The migration's copy of orders, events, sessions and login limits into a backup schema. A metadata-only migration identity marker replaces the seed tool's dependency on that schema. The isolated-target and candidate checks remain in place. Neither migration nor seeding was run.
- Backup-expiry wording in Studio guidance and unsupported ongoing archive-service promises in the source privacy-policy candidate. Existing contact, business, social and retention facts remain unchanged. No saved public policy was published.
- CRAFT tasks C6-05 and C6-06 and backup acceptance gates. Stable task IDs remain in the register with a removed status. Performance, accessibility, human/device, Studio acceptance and editorial/release checks continue independently.
- Current-workspace helper scripts `p7-backup.mjs`, `p7-backup-verify.mjs`, `p8-backup.mjs`, `p8-backup-verify.mjs` and `p7-restore.mjs`. Local CRAFT review pages display the scope change.

## Scheduling checked

- Codex automation `rivya-daily-encrypted-backup`: removal returned `not_found`, confirming the automation was already absent. No automation configuration files were present in the app's local automation directory.
- Windows Task Scheduler: no Rivya backup task was found. Unrelated Windows maintenance tasks were left intact.
- This repository's Vercel configuration has no cron entry and package scripts have no backup command.

No active project backup scheduler was found to disable. The removal does not alter provider-managed infrastructure outside this project's tools.

## Preserved boundaries

Existing archive files, recovery keys, credential stores, private configuration, historical databases/snapshot schemas, customer records and remote Drive data were not read, changed or deleted. No database connection, production write or migration was performed. Previously retained copies remain subject to their recorded retention requirements and holds.

Studio drafts, autosave, revision comparison and restoration, source history, managed exports, privacy erasure and deletion replay remain available. These support editing and privacy; they do not create scheduled database archives. Products, forms, gallery associations, scraper, business contacts and social content remain protected.

Historical phase reports retain their original results beneath a dated superseding scope notice. They must not be interpreted as instructions to restart removed operations. Current plans and runbooks remove the active requirements directly.

## Delivery and validation

Changes stay local on `codex/craft-visual-improvements`. A new explicit push-main request is required for a detailed PR and release. Production publication of saved content is separate from source deployment.

Validation results are recorded in `docs/redesign/backup-removal-verification.json`. No new backup or restore rehearsal is part of this change.
