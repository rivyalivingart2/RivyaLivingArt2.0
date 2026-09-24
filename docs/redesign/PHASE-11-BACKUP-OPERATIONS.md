# Encrypted backup operations — 24 September 2026

The owner approved daily backups at 02:00 Asia/Kolkata, a rolling 30-day routine retention period, pre-migration/release copies and quarterly isolated recovery drills. RPO/RTO are 24-hour targets, not guaranteed service levels.

## Verified implementation

`scripts/operations/encrypted-backup.mjs` is an operator-only repeatable read-only export. Its private configuration pins the approved database fingerprint and data mode, paths to PostgreSQL and trusted roots, the separately protected recovery key and the encrypted output directory. It never prints credentials or writes an unencrypted archive. It exports the public application schema, includes all private reference objects, requires every ready reference to be present, records checksums and rejects source changes or incomplete inventories. The archive is bounded to 512 MiB; exceeding this limit is a reported failure requiring a streaming-backup upgrade, never a silently partial backup.

AES-256-GCM uses a fresh random nonce for each archive. Local authenticated decryption checks the database and every private-file digest before success. Only the encrypted result is uploaded to the owner-only Drive folder `1ynCrjYadka4GNQZL0sOzjKv1Nrfpm9yy`. Verify the parent, owner-only permissions, byte count, downloaded archive SHA-256 and authenticated decryption after upload. Store a sanitized receipt; never log keys, authenticated download URLs or customer data.

The first repeatable run, `rivya-daily-2026-09-24T07-51-29-907Z.aes256gcm`, includes 16 shared-source tables and zero private objects. Its Drive file is `1KSOiR-mTvyKbFQl3Gcykv1xAlbiPrLMI`, SHA-256 `5f2d5d873b0b242ac7a5fe94eaed3ba62fbe93bab8ac594a6a73d595384397c0`. Upload permissions, remote bytes, authenticated decryption and manifest digest were verified. No source records were changed.

Local operator configuration is outside the repository at the current task's `work/rivya-backup-operator.json`; use the Node 22 runtime under its `work/tooling/node_modules/node/bin/node.exe`. The configuration can follow a future runtime credential change only after the backup operator is given the required read access and the source fingerprint is reverified. Do not install migration credentials in Vercel runtime.

## Scheduled operation and expiry

The Codex daily follow-up runs this procedure, uses the connected Google Drive tools for the private upload/readback, and reports a failed or missed backup. The computer must be awake, connected, and able to run Codex with the required local and Drive access. This is a local scheduling dependency, not an always-on hosted guarantee. Never claim the 24-hour target proved solely by saving a schedule.

After a new off-device backup verifies, review expiry only inside the exact private folder and the configured local Daily directory. Routine archives must match `rivya-daily-<ISO timestamp>.aes256gcm`; keep the newest verified backup, all copies younger than 30 days, and every documented hold. Do not remove initial release/rehearsal archives or unrelated files under the daily-file rule. Before removing an expired routine archive, establish that no relevant retention hold applies. If hold information, remote verification or current backup health is unavailable, preserve the archive and report the exception. A reviewed expiry run is still pending; no archive has yet reached the retention deadline.

Generated customer exports are separate from encrypted recovery archives. They expire after seven days and must be removed from managed downloaded copies using the deletion procedure. This backup job does not synchronize Google Sheets.

## Recovery and current limits

Use the existing isolated restore procedure; never restore into the shared database as a test. Verify all table counts/digests, private reference readback, target separation, revoked restored sessions and disabled restored staff before controlled re-enablement. Reapply completed erasures before restored data becomes accessible. The database and two private references have passed an isolated restoration drill, but submitted-data erasure/replay, a full service recovery rehearsal and quarterly scheduling remain separate pending work.

The recovery key was saved and read back in Windows Credential Manager, with protected local file ACLs. Independent password-manager custody and a physical sealed offline copy remain unverified; see `RECOVERY-KEY-CUSTODY.md`. Scheduling a backup does not resolve those custody requirements.
