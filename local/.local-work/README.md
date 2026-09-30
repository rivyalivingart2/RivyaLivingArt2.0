# RivyaLivingArt approved local implementation package

Status: **local implementation package prepared; full checkout validation blocked in this hosted session**.

Approved plan: 2026-09-30 audit/implementation plan, approved by the owner in chat.
Target repository: `rivyalivingart2/RivyaLivingArt2.0`
Required source head: `0678a8dfb4df7ad140e0e7182742f897444af390`

## What this package does

`apply-approved-local-implementation.py` applies the first approved safety/release repair set to an exact, clean checkout of the required head. It is deliberately hash-pinned and refuses a changed/dirty checkout.

It will:

1. Fix the `ProductCard` optional-price TypeScript contract regression.
2. Remove six newly hard-coded service/SEO routes whose business claims were not owner-approved.
3. Remove DB037-DB039, which contain unapproved pricing/material/logistics claims, and restore the existing release-contract counts.
4. Remove simulated CSV catalogue import UI and simulated media-upload UI.
5. Restore the PDP to the save-first order workflow by removing the direct WhatsApp chat bypass and hard-coded lead-time/provenance claims.
6. Remove fabricated competitor benchmark/opportunity analytics from the demo Studio.
7. Preserve the Phase 6 44px mobile touch-target CSS change and unrelated approved work.

It does **not** create/edit/delete product records, touch a database, send WhatsApp/email, push GitHub, open a PR, or deploy Vercel.

## Run only in a local exact checkout

```bash
python .local-work/apply-approved-local-implementation.py /absolute/path/to/RivyaLivingArt2.0
```

The script requires:
- exact `HEAD` above;
- clean `git status --porcelain`;
- exact current blob hashes for every touched file.

After it runs, inspect `git diff` and run the repository validation sequence from `reports/10-validation-report.md`.

## Hosted-session limitation

The mounted requested `OLDWEBSITE/.local-work` path was read-only and this environment had no materializable/writable full Git checkout. GitHub was accessible only through the authenticated connector; direct GitHub archive/clone access was unavailable. Therefore the script and transformations were fixture-tested here, but a real full-repository `lint/typecheck/build/runtime/E2E` run could not be performed. This limitation is recorded rather than converted into a false PASS.
