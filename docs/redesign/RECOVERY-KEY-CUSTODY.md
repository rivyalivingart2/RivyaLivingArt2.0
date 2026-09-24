# Recovery-key custody — 24 September 2026

The owner delegated key handling to the agent. The following work is verified:

- The database archive and manifest were encrypted before upload to the owner-only `RivyaLivingArt-Encrypted-Backups` Drive folder.
- The uploaded archive was downloaded again, authenticated/decrypted, and its database digest matched the archive already restored into the isolated QA database.
- The recovery key is stored in Windows Credential Manager as the generic credential `RivyaLivingArt/recovery/release-2026-09-24T06-06-37-058Z`. Readback matched without printing the secret.
- The separate key file under `%LOCALAPPDATA%\RivyaLivingArt\RecoveryKeys` and its containing directory have explicit access for the owner's Windows account, SYSTEM and Administrators only. Inherited sandbox-group access was removed. The key was not placed beside the archive, in Git, logs, this document or Drive.

Windows Credential Manager is protected storage on this computer. It is not proof of a copy in the owner's independently recoverable password manager. Loss of the computer/profile still makes an independent recovery copy necessary.

The requested independent password-manager custody and sealed offline copy are **not verified**. The agent cannot create or seal a physical copy, confirm its secure location, or operate an unavailable third-party password manager. The owner can securely import the existing key file into the chosen password manager, create a separate sealed offline copy and verify both directly. Never paste the key into chat or a public issue. Do not delete the protected local key until independent recovery has been proved.

This checkpoint does not certify full backup operations, 24-hour recovery targets or production readiness. Daily encrypted backup scheduling is configured and reference-file restoration is verified. Scheduled operation, retention/failure reporting and deletion replay have their own pending evidence in `PHASE-11-CHECKPOINT.md`.
