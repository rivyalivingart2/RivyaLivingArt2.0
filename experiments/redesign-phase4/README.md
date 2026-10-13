# Phase 4 local public-page review

Phase 4 extends the approved Phase 3 public design. Read `DIRECTION.md` and `../../docs/redesign/modern-design-2026-10-13/PHASE-4-REVIEW.md`. Stop before Phase 5 or any release/publication.

- Review hub: http://127.0.0.1:4181/review
- Real local application: http://127.0.0.1:4199/collectible-design
- Local Journal: http://127.0.0.1:4199/journal
- Unsent brief: http://127.0.0.1:4199/commission/customize
- Static fixture routes on port 4181: `/portfolio-detail`, `/testimonial-detail`, `/faq-detail`, `/portfolio-archive`, `/testimonial-archive`, `/landing`, `/receipt`, `/receipt-recovery`, `/loading`, `/error`.

Fixtures reuse existing public assets and synthetic, visibly labelled records. They are server-rendered visual samples with no hydrated controls. Their HTTP server accepts GET/HEAD only and proxies only local public media, logo and Next assets. They never connect to the database. Real interaction verification uses port 4199. The brief is filled and reviewed but never submitted. The receipt fixtures are not real saved orders. No Drive upload, new asset assignment or content publication occurs.

## Restart

Use the existing isolated QA PostgreSQL instance on `127.0.0.1:55439`, database `rivya_migration_local`. Never seed or alter records merely to reproduce these previews. The ignored `.env.qa` is read by the guarded runner; do not print its contents.

From the repository root in PowerShell:

```powershell
$phase4Node = 'C:/Users/gonda/Documents/Codex/2026-09-23/continue-the-approved-rivyalivingart-redesign-read/work/tooling/node_modules/node/bin/node.exe'
$env:RIVYA_MIGRATION_PG_MODULE = 'C:/Users/gonda/Documents/Codex/2026-09-30/keep-rivyalivingart2-0-as-the-base/work/tooling/local-postgres/node_modules/pg/lib/index.js'
& $phase4Node tools/old-design-migration/run-local.mjs build
& $phase4Node tools/old-design-migration/run-local.mjs serve
```

Run the following in another terminal while the app is serving:

```powershell
& $phase4Node experiments/redesign-phase4/build.mjs
& $phase4Node experiments/redesign-phase4/serve.mjs
```

Stop the app before rebuilding it. Rebuilding beneath an active production server can invalidate its cached chunks and create root-error captures; such captures are not acceptance evidence.

## Reproduce verification

The pre-change evidence was captured against Phase 3 `2a3c9a3`. Do not overwrite `baseline.json` with Phase 4 and call that a preservation comparison. Generated data stays in ignored `output/redesign-phase4` and `output/playwright/redesign-phase4`.

```powershell
& $phase4Node tools/redesign-phase4-browser.mjs verify
& $phase4Node tools/redesign-phase4-fixtures.mjs
& $phase4Node tools/redesign-phase4-interactions.mjs
& $phase4Node tools/redesign-phase4-review-fixes.mjs
& $phase4Node tools/redesign-phase4-recapture.mjs
```

The recapture tool runs last: it waits for form focus/scroll effects and enlarged-image decode, replacing three initially invalid interaction captures and adding final-control views. Those replacements are the authoritative evidence. Initial screenshots of a blank viewport are never counted as visual success.

`redesign-phase4-baseline.mjs before|after` checks the registered public route inventory by local HTTP. It includes historical production URLs that are unpublished in QA. Its streamed HTML hashes are a coarse indicator, not a substitute for resolved DOM comparisons; four streaming-order differences were reconciled by the browser checks. Read the committed verification report for exact scope.

The current local schema/data is older than production's published editorial state. The 480 newer drafts are not published by this phase. Browser emulation, screenshots and static fixtures do not certify physical devices, native-reader meaning review, screen readers or real-world acceptance.

Repeated form openings can reach the existing local 40-per-hour session limit. Do not bypass it or submit an inquiry to make a screenshot pass. The final evidence records the disabled save/reconnect state. The original raw DOM comparison reports one availability-label difference; the supplemental `form-runtime-comparison.json` explains that exact difference without suppressing it. Normal form-session and rate-limit bookkeeping is outside the 13 protected business-data scopes.
