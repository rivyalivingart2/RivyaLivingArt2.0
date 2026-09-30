# Release report — RELEASED

Updated: 2026-09-30

## Production release
The approved phased implementation has been promoted to production.

- Repository: `rivyalivingart2/RivyaLivingArt2.0`
- Tested application source: `6c4ac3d16bb9c914eae0a94ece8771328941f551`
- Production commit: `770c66818688077014a828859f08f78c21f2a5be`
- Production deployment: `dpl_3fs7dWDENtPrqmkyDgnjTgimrdY1`
- Deployment target: production
- Deployment state: READY
- Custom aliases: `www.rivyalivingart.com`, `rivyalivingart.com`
- Alias error: none

The production commit was constructed from the exact tested Git blobs for the 25 approved application/test paths. `local/.local-work/**` was not included.

## Validation
Seven-width H1 rendered browser QA passed before release:
1920×1080, 1440×900, 1200×900, 992×900, 768×1024, 512×915 and 320×740.

35 representative rendered states produced:
- 0 navigation failures
- 0 overflow failures
- 0 broken images
- 0 console/page errors
- 0 mobile touch-target failures
- 0 focus-outline failures

## Live smoke verification
After production became READY:
- homepage: HTTP 200 on the new deployment
- collection: HTTP 200 on the new deployment
- portfolio: HTTP 200 on the new deployment and no demo-fixture markers
- Studio login surface: HTTP 200 on the new deployment
- Vercel runtime error clusters in the verification window: none

## Deferred by design
- Navigation editor: no approved persistence schema.
- Localization: no approved multilingual schema/workflow.

These were explicitly excluded rather than implemented with an unreviewed migration.

## Data/schema
No database migration was introduced and no production data/product mutation was performed.

## Rollback
If rollback is required, use standard Git revert/Vercel rollback. Do not force-push. No database rollback is required for this release.
