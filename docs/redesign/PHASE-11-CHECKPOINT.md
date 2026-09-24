# Phase 11 / current-work release checkpoint

Updated 24 September 2026. The latest owner instruction is to stop further development and testing, publish the completed current work to main and intentional Vercel Preview/Production, and list every pending item. Read ../decisions/2026-09-24-publish-current-stop-testing.md and PENDING-WORK.md. Do not resume the deferred programme automatically.

## Completed evidence

178 unit checks, 386 local HTTP checks, 12 earlier preflight checks, lint/types/build, 276 published routes, 28 accessibility/overflow cases across four screen sizes, actual isolated order/upload/receipt/Studio flows, role assignment/revocation, concurrent Kanban/recovery, bounded cleanup and eight retention/Studio-navigation cases passed before the stop. Restricted QA grants denied eight privileged actions; order/Studio/cleanup passed under that role. These are recorded candidates, not an exact deployed-release certification.

Pro verified on rivyalivingart20-4705. Current shared data publication contains 120 products, 131 media, 47 content entries (36 articles) and approved business settings. No synthetic record was written to shared resources. The additive rivya_privacy_controls migration was applied once to QA and then the shared database following a fresh verified off-device backup. Do not replay it. Shared runtime role rivya_runtime_20260924 has the prepared narrow table/sequence grants; migration owner credentials remain outside runtime. The legacy NOT VALID constraint remains pending.

The key is in Windows Credential Manager target RivyaLivingArt/recovery/release-2026-09-24T06-06-37-058Z; readback and protected file ACLs verified. Independent password-manager and sealed offline copies are unverified. Drive folder 1ynCrjYadka4GNQZL0sOzjKv1Nrfpm9yy is owner-only. Initial archive 1rIrtiP9aeXAqcABuAPMq83EH6-ZuNn-r passed remote download/authenticated decryption and a 16-table restore. Separate QA drill restored two private reference files with matching checksums to a different database/object paths; restored sessions revoked and staff disabled. Full service RTO and deletion replay remain pending.

Repeatable backup script: scripts/operations/encrypted-backup.mjs. Its first shared read-only run uploaded file 1KSOiR-mTvyKbFQl3Gcykv1xAlbiPrLMI; encrypted SHA-256 5f2d5d873b0b242ac7a5fe94eaed3ba62fbe93bab8ac594a6a73d595384397c0. Remote permissions, bytes, authenticated decryption and manifest verified. Codex automation rivya-daily-encrypted-backup is active at 02:00 IST; first scheduled run/expiry/failure handling remain unproved. Read PHASE-11-BACKUP-OPERATIONS.md.

## Preserved resources and current boundaries

QA database rivya_qa_20260924, restore database rivya_restore_20260924, QA role rivya_qa_runtime_20260924, QA project prj_rrxaZ8XfEumn5cLdDG9GZ8p33fET and private QA store store_maHrpDDHXPR93N0w remain isolated. The QA store also contains restore-only objects owned by the restore database: do not classify them as orphans from the QA database alone. No cleanup/delete of these resources is authorized merely by stopping tests.

Production project prj_J90SIW3OHaXYsmhan527F4n8PYUc uses the authorized shared database/private store. The requested current release enables the existing saved-order intake/manual message preparation, while search indexing and automatic Git deployment stay off. Provider deployment builds and commit/alias status readback are publication operations. No further formal QA has been authorized after the stop.

## Resume later only when requested

Use PENDING-WORK.md as the exhaustive continuation list. Main/Preview/Production publication identifiers are recorded in the current release receipt. Do not infer that deployed means all findings closed. Preserve customer data, original assets and immutable saved briefs. No payment gateway, customer accounts, generic WhatsApp support, automation, Sheets sync or Netlify.
