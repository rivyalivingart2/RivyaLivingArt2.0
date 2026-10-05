> Owner scope change, 5 October 2026: the project backup feature, scheduled archive jobs, archive-key custody tasks and backup/RPO/RTO acceptance gates are removed. Any earlier instruction below to run, verify, schedule or require them is historical and superseded. Existing archives/keys were not deleted. Studio draft/revision recovery and privacy-erasure safeguards remain. See the 2026-10-05 removal decision.

> Current release authority (3 October 2026): the owner now explicitly requests main through PR #36 and Vercel production after best-available fixes/checks. See P8-FINAL-RELEASE-CHECKS.md and docs/decisions/2026-10-03-authorized-main-production.md. Draft-only holds below are historical; unresolved acceptance evidence remains accurately open.

> Update, 3 October 2026: see [P8-FOLLOW-UP.md](P8-FOLLOW-UP.md) for the owner release instruction, smaller Studio reads, repaired backup scheduling/receipts, fresh verification and remaining gates. The source candidate is being prepared as a detailed draft PR; main/production remain held. Earlier authorization/local-only statements below are historical.

# P7/P8 checkpoint — 3 October 2026

Local application candidate `dc744c3dd35a9f2bdc4641c4d7d551374dbf9d3c` on `codex/p7-performance-release`, including P6. Read `P7-VERIFICATION-REPORT.md`, `p7-validation.json` and `P8-RELEASE-PACKET.md` first. Repairs, controlled QA and release preparation are saved. No push, PR, deployment or production editorial publication.

P4 performance and full P7 acceptance are **open**: final desktop 6/8 and throttled mobile 1/15 samples meet a 2.5s lab comparison; field p75 is unavailable. Human screen-reader/physical-device tests and full family visual acceptance remain. Backup/controlled restore pass, but the prior 52.21-hour gap misses the 24-hour target and independent key copies are owner-confirmed unverified. Do not ask for the key in chat or repeat the already answered custody question.

P8 packet/PR draft/editing guide/rollback and shared destination revision inventory are prepared. The owner requires a new explicit push-main instruction, then a detailed PR. Do not turn this checkpoint into release authorization. Current production is still the last observed `c94427de88d45a216fdf545840efef2f875e5789` deployment, which must be reverified at release time.

Next engineering focus: candidate-host mobile response/payload profiling and Studio lazy detail reads with exact draft/version protection. Continue assistive/device acceptance and recovery custody/RPO evidence. Before release, verify the actual runtime's erasure schema and deliberate narrow grants; never run migrations in the build. Protected products/forms/originals/galleries/contacts/scraper and histories remain unchanged; no product transfer. The QA homepage draft and publication were restored, synthetic article hidden, temporary staff disabled and disposable recovery resources removed.

The task-owned local QA server was stopped after verification. Restart only through the guarded `work/start-p4-qa.mjs` harness when continuing isolated checks.
