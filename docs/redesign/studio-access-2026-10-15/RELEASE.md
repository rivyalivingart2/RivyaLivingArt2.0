# Studio access release - 15 October 2026

The owner explicitly requested: "push all things into main branch" after the final revision 6 navigation refinement. This authorizes the source publication and normal Git-triggered deployment through a detailed PR into main. Earlier local-only notes and intermediate visual rejections remain historical.

## Final scope

Image-led Studio login, signup/account requests, administrator-assisted recovery and password setup; original logo inside the form; 30-50% animated frosted-white gradient; motion pause/reduced-motion handling; larger open navigation labels and gold active indicator. New requests require administrator verification and approval, start with editor access, and use expiring single-use password links. Owner credentials remain hosting-managed. Includes additive schema/grant scripts, existing-asset derivatives, tests and continuation/review documentation.

## Validation and preservation

Revision 6 full build/type check and desktop/320px navigation checks passed. Six access-validation tests passed again for release. Earlier recorded security/regression results are 350 unit, 403 runtime, 12 preflight, 30 isolated-database security and 21 local HTTP checks; these historical suites were not replayed for this publication. No original data, customer records, drafts, translations or media associations are being imported or republished. No synthetic fixtures or production account decisions are performed by the release.

## Production activation remaining

Publishing source does not apply database migrations. No production database-owner session or migration executor is available in this task. The owner must apply scripts/studio-access-migration.sql and scripts/studio-access-runtime-grants.sql to the intended production database using the existing runtime role, then verify the admin queue and trusted account/reset flow. Until this is done, request/recovery submissions and the new queue may report setup unavailable; ordinary sign-in remains unchanged. The release must not be reported as completed production account activation.

The migration only adds the request table and indexes. Retain it and its records if rolling back application code. Never create real staff accounts or send recovery links as an automatic verification step. Private administrator verification requires a current real Studio session. Production-native/device acceptance is not inferred from automated checks.

GitHub merge and exact deployment evidence will be returned with the release result. No credentials, raw private fixtures or workstation screenshots are included in the commit.
