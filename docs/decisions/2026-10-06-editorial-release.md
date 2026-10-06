# Editorial source release and acceptance continuation

6 October 2026. The owner requested: push all current work into main, then start the pending tasks. The included pending table specifies a detailed PR, merge, deployment and verification. This supersedes the local-only hold for application commit `bcf0302` and its release documentation.

Release via the existing feature branch and a detailed PR. Check the exact PR head, preserve required checks/reviews, merge without an administrative bypass, and verify the Git-linked Vercel production deployment. Production indexing is already enabled; Preview and private routes must retain their existing indexing protections.

The candidate contains public-interface language fixes, captured article-card labels, translated preview image descriptions and Imprint contact-heading support; public-English review sources; seven published page-translation receipts; and 36 article draft review/import packs. Merging the packs does not publish article translations. Preserve newer Studio drafts and use the Studio dry-run, saved preview and deliberate publication workflow for later approved editorial changes.

Existing local validation: 294 unit, 12 preflight and 403 built-server checks; typecheck/build passed, lint no errors. Final label additions also passed typecheck/lint/build and local browser checks. The former 2.476-second mobile LCP sample belongs to PR42, not this candidate. Run bounded hosted verification after release; broad database QA stays on local PostgreSQL.

Continue meaning review and crop corrections after release. Independent native-reader approval, owner page/gallery sign-off, actual screen-reader/phone testing, real-user performance and a genuine business-inquiry observation remain evidence gaps. Do not certify them from automated or synthetic results. No customer messages, artificial traffic, additional analytics, scraper/product transfer, restored backup features, grants, or infrastructure changes are authorized by this release.

Keep products/forms/original galleries, business/social facts, customer records, drafts and revision history unchanged. New follow-up code stays local under the standing preference until another explicit release request.
