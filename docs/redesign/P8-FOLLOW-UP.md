> Owner scope change, 5 October 2026: the project backup feature, scheduled archive jobs, archive-key custody tasks and backup/RPO/RTO acceptance gates are removed. Any earlier instruction below to run, verify, schedule or require them is historical and superseded. Existing archives/keys were not deleted. Studio draft/revision recovery and privacy-erasure safeguards remain. See the 2026-10-05 removal decision.

> Current release authority (3 October 2026): the owner now explicitly requests main through PR #36 and Vercel production after best-available fixes/checks. See P8-FINAL-RELEASE-CHECKS.md and docs/decisions/2026-10-03-authorized-main-production.md. Draft-only holds below are historical; unresolved acceptance evidence remains accurately open.

# P8 engineering follow-up — 3 October 2026

The owner asked to complete the remaining performance, accessibility, recovery, daily-backup and release work, then delegated the available actions. This authorizes preparing the release through the standing detailed-PR workflow. It does not supply physical test results, an independent key-custody location, business facts or a current Studio session. Full P7/P8 acceptance remains open. This report supersedes earlier statements that another release instruction is needed; the technical and external-evidence gates remain.

## Implemented and verified

- Studio Pages & journal now reads a smaller list and retrieves a complete selected record before editing. Initial Site copy selection, direct record links, unsaved-edit cancellation, explicit discard, failed-load recovery and retry pass real browser checks. Server-computed draft status preserves differences that exist only inside saved snapshots. Default API callers retain the complete response; revision, publication and authorization contracts are unchanged.
- The authenticated content list fell from **1,810,598 to 455,305 bytes (74.85%)** in isolated QA. The selected document retains its complete immutable preview snapshot. Public homepage dependency reads retain the publication eligibility marker and reconstruct public references from current publications; private saved previews still use their original snapshot.
- All **120 product, 55 content and business public projections** match the pre-optimization output. A repeated **12-check** draft → exact preview → publish → dependency withdrawal → revision recovery flow passes. Original draft/publication restored separately; synthetic article hidden; products, media and contacts unchanged.
- **281 unit, 12 preflight and 401 compiled HTTP checks** pass. Build and TypeScript pass; changed-file lint passes. **79** API/browser assertions cover the smaller editor read, complete selected records, access denial and record-switching behavior. These counts include per-record summary assertions; they are not 79 different workflows.
- The daily-backup automation was **PAUSED**. It is now **ACTIVE** at **02:00, 08:00, 14:00 and 20:00 Asia/Kolkata**. The 02:00 run skips a verified backup younger than six hours; catch-up checks run only if the latest verified backup is at least 18 hours old or the preceding run failed. Healthy unchanged checks stay quiet.
- Fixed a second backup failure: the verifier used one exclusive receipt filename per calendar day. Catch-up and pre-release backups now have separate timestamped receipts, idempotent verification, serialized receipt writes, atomic latest-pointer replacement and protection against an older readback moving that pointer backwards. The committed helper matches the installed operator copy. Same-day, duplicate, conflicting and older-receipt cases pass; a real repeated remote verification is idempotent.
- A fresh **19-table** ciphertext backup was created at **07:36:24 UTC** and independently verified from Drive at **07:39:42 UTC**: owner-only folder/file, parent, byte count, SHA-256, AES-GCM authentication and manifest digests pass. It contains zero private objects; this is not proof of restoring customer files. The preceding verified archive was **1.83 hours** old. The historical **52.21-hour gap** remains recorded. No retention candidates were deleted.
- Fresh shared-source SELECTs still match all **120 products**, **131 original media records/gallery associations** and the complete business settings against P0. No source data was changed by backup or readback.

## Performance results and limits

Same mobile laboratory profile: 390 × 844, DPR 3, CPU slowdown 4×, 150 ms latency, 1.6 Mbps download, 750 Kbps upload, cold browser cache; local compiled application with the remote isolated database. No unrelated acceptance/build work ran during measurement.

The homepage editor transferred **1,174,550 bytes**, down from **2,493,795** (52.90%); its LCP sample fell from **4.856 to 4.124 seconds**. Studio inquiries measured 3.508 seconds and its board interaction maximum was 176 ms. Other page samples remain above the target: home 5.012s, collections 4.568–5.748s, product pages 3.004–4.252s, customization 3.056–8.924s, Process 3.484s and Journal 3.608s. The bespoke form measured 1.712s. Thus **1/15** samples met the 2.5s comparison; do not declare performance accepted. All sampled CLS values remain below 0.1, with no measured overflow or browser application error. The home menu diagnostic reached 216 ms.

The slowest customization sample spent 7.738s before the first response byte. Remaining work includes profiling the hosted candidate/database latency and cold image delivery, then repeating the recorded profile. These single lab samples do not establish real-user p75 LCP/INP/CLS. Earlier faster and slower samples remain preserved.

## Remaining external evidence and release boundaries

1. **Physical phone and human screen reader:** no actual device or human assistive-technology test is available in this session. Browser emulation, keyboard and automated accessibility evidence remain valid only for their measured scope. No human pass is fabricated.
2. **Independent recovery-key custody:** still **not verified**. Windows Credential Manager and the protected local key do not survive loss of this computer as independent copies. No independent password-manager destination or physical sealed/offsite custody has been supplied or verified. Never send the key in chat, receipts, Git or alongside the ciphertext archive.
3. **Daily reliability:** scheduling and receipt defects are repaired; a future sequence of successful off-device runs is still needed to establish operating reliability. Local scheduling requires the computer and Codex to be awake, connected and authorized. No always-on service was provisioned or purchased.
4. **Authenticated destination readiness:** the existing live Studio browser now shows sign-in. Actual deployed runtime schema/grants and authenticated post-release behavior remain unverified. Backup-source privileges are not deployed-runtime proof. No credential was requested in chat or authentication bypass created.
5. **Production release:** the source candidate can be reviewed in the detailed PR and protected Preview. Main merge/promotion and editorial publication remain held while these recorded technical gates are unresolved. The owner instruction is recorded; another vague permission request is unnecessary. Do not claim a successful production release or full P8 completion.

The existing production deployment remains `c94427de88d45a216fdf545840efef2f875e5789`, deployment `dpl_13tHF2pJ6vTmRbP4sFySUG4S1FTL`, READY in `iad1`, with the intended www domain. Reverify after any release. The original P8 release packet retains destination content and recovery instructions; its earlier local-only/authorization status is historical.

## Reproduction and continuation

Receipts: `p8-editor-read-verification.json`, `p8-performance-mobile.json`, `p8-content-lifecycle.json`, `p8-backup-verified.json`, `p8-backup-schedule.json`, `p8-shared-preservation.json`. Root task harnesses: `work/p8-editor-check.mjs`, `p8-mobile-performance.mjs`, `p8-content-lifecycle.mjs`, `p8-backup.mjs`, `p8-backup-verify.mjs`; keep private configuration/download URLs outside Git. Existing source-projection harness was rerun after the change.

The operator verifier uses `backup-receipts.mjs` next to its existing private configuration. A `.receipt-write.lock` left after an interrupted process must be investigated before removal; never discard a lock while a verifier is running. Keep historical receipts and the last good archive. See `P8-RELEASE-PACKET.md` for source/content rollback; no whole-database restoration is needed to revert these presentation changes.


## Saved PR and hosted readback

[Draft PR #36](https://github.com/rivyalivingart2/RivyaLivingArt2.0/pull/36) contains the full source/evidence candidate. Application source `a14f161a7bcc0d0489b2acffec1cb07d1fc5683f` built as protected Preview `dpl_2Aw9bL1EdyWxFRoK1Li9USQFUPct` (READY). Connected authenticated Vercel HTTP reads confirm the home, collection, product, Process and sign-in pages and anonymous Studio API denial. This is a server-rendered readback, not hosted browser performance acceptance. See `p8-preview-receipt.json`. Main remains `c94427de88d45a216fdf545840efef2f875e5789`; no main merge or production content publication.
