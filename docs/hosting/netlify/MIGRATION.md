# Active continuation — 28 October 2026

Read [the refreshed Netlify free-first checkpoint](../../netlify-free-first-2026-10-28/CURRENT-STATE.md) and its latest owner brief first. Netlify is live at www.rivyalivingart.com on 7b390d5; PR #71 remains draft and production is locked to the migration branch. Continue locally on codex/netlify-free-first, preserving the migration commits. Sheets/Drive is the preferred target with a conditional, justified ongoing-free database exception. The Google replacement, migration, full Studio parity and release acceptance are incomplete. Historical completion claims below are dated and superseded; simulation receipts do not certify providers, backups or production. Preserve public/login design, records/media, credentials and OLDWEBSITE. Add no products and import no archived catalogue. No production migration, publication, credential rotation or old-resource deletion has occurred in this continuation.

---

# Vercel to Netlify hosting migration

Owner request: 27 October 2026. Base: `35f99fd9b5fd1b76333d92b4ddf3b90289c99b2a`.
Branch: `codex/netlify-hosting-migration`. Draft PR: https://github.com/rivyalivingart2/RivyaLivingArt2.0/pull/71

## Current result

A real, team-protected Netlify deployment is READY and serves the existing website from the current Neon database and private Vercel Blob store. The public domain still points to Vercel. The migration is **not released**: the current Studio credentials are unavailable, so Netlify Studio correctly fails closed with “Studio setup is pending.”

The first verified Netlify Linux deployment is `6ae0c97bc50f9653079082f8`, commit `d583edbeda3be0e2b7b421eeb9ba436a6aabdfcd`:
https://6ae0c97bc50f9653079082f8--rivyalivingart.netlify.app/
Subsequent verifier/documentation commits do not alter public components or login behavior; record their exact READY deployment in the PR before resuming release.

## Scope and preservation

Move the existing Next.js website and Studio hosting to Netlify. Preserve the approved public design, current Studio login, existing records, product identities, URLs, prices, media and relationships. No products, archived imports, CMS publication, schema migration or Google provider cutover. Neon and private Vercel Blob remain the existing data providers. Retain the Vercel project and its stores for rollback; deleting them would break the application.

The earlier Google programme completion statements describe source modules and local tests. They are not evidence that the deployed application has replaced SQL/Blob. This hosting migration deliberately keeps the currently working provider contracts.

## Implementation

- `netlify.toml`: Node 22.23.2, npm 10.9.2, Next build, `.next` output. Netlify's automatic Next.js adapter built successfully on Linux with `@netlify/plugin-nextjs` 5.16.3. No SPA redirect or API rewrite.
- A shared hosting policy recognizes Netlify at build and function runtime, while retaining Vercel and local behavior. Unknown or conflicting host identities fail closed.
- Netlify functions use a context-specific `RIVYA_DEPLOY_CONTEXT`; `CONTEXT` is build metadata and cannot be assumed at runtime.
- Published previews require explicit approval flags; shared data never enables fixture previews. Local editorial and unselected image routes remain inaccessible on either host.
- Locale cookies remain Secure on hosted environments. Request throttling trusts only the selected host's connection metadata, never generic forwarded headers.
- Public components, styles, images, products, SQL contracts and Studio login components are unchanged.
- The approved image manifest receipt normalizes JSON CRLF to LF before hashing, matching its existing approved digest. All 507 image variants retain their original exact-byte hashes, dimensions and metadata checks; no images or expected receipt values were changed.

## Project and private configuration

Project: `rivyalivingart`, team: `RivyaLivingArt`.
Netlify project ID: `11998acf-7951-4a38-bff0-49cff55264ed`.
Dashboard: https://app.netlify.com/projects/rivyalivingart

GitHub is connected to this repository. The temporary Netlify production branch is `codex/netlify-hosting-migration`; switch it to `main` after the reviewed merge. “Production” here is Netlify's build context for the protected project, not a public-domain cutover. Team protection remains enabled. No custom domain or paid upgrade was added.

Runtime settings are configured in Netlify, not just TOML:

| Setting | Protected production context | Deploy Preview / branch deploy |
| --- | --- | --- |
| `RIVYA_HOSTING_PROVIDER` | `netlify` | `netlify` |
| `RIVYA_DEPLOY_CONTEXT` | `production` | `deploy-preview` / `branch-deploy` |
| `RIVYA_DATA_MODE` | `shared` | `shared` |
| `RIVYA_VISUAL_PREVIEW` | `0` | `0` |
| `RIVYA_PUBLISHED_PREVIEW` | not needed | `1` |
| `RIVYA_REFERENCE_STORAGE` | `vercel` | `vercel` |
| `AWS_LAMBDA_JS_RUNTIME` | `nodejs22.x` | `nodejs22.x` |
| `SITE_INDEXABLE` | `false` until verified live release | `false` |
| `RIVYA_ORDER_INTAKE_ENABLED` | `false` until verified live release | `false` |
| `RIVYA_ORDER_MESSAGE_RETRY_ENABLED` | `false` until verified live release | `false` |

`DATABASE_URL` and `BLOB_READ_WRITE_TOKEN` were transferred from an existing owner-local configuration for this exact Vercel project and marked secret in Netlify. Their working runtime behavior was verified without changing records or files.

`STUDIO_ADMIN_ID`, `STUDIO_ADMIN_PASSWORD` and `STUDIO_SESSION_SECRET` are **not configured** on Netlify. The legitimate older saved login failed one normal sign-in attempt on the live website. Vercel's sensitive-variable API returned no decrypted current value. Do not reuse the rejected login, reset the owner's credentials, recover browser password vaults, or add secret-extraction endpoints. Permission to copy a secret does not supply its missing value. The remaining dependency is current values entered through the owner's secure configuration path or a legitimate current private configuration file.

Keep credentials out of source, logs, screenshots and PR descriptions. Never copy `VERCEL`, `VERCEL_ENV` or other Vercel platform identity variables into Netlify. Do not use expired or redacted exports. Production and previews must retain separate session secrets.

## Verification recorded

- Netlify Linux build and deployment: READY at the exact commit and deployment above.
- Node 22 production Next build, route type generation and TypeScript: passed.
- ESLint: zero errors; 62 existing warnings.
- Application suite in an isolated Linux Node 22 environment with Git installed: **755/755 passed** after the manifest line-ending correction. The POSIX mode and symlink checks are supported there; no assertions were weakened.
- Preflight: **12/12 passed**.
- Built HTTP access/publication suite: **663/663 passed**, including Netlify runtime production/preview failure cases.
- Windows packaging encountered Sharp symlink `EPERM`; the actual Netlify Linux build resolves this platform-specific deployment obstacle.
- Read-only before/after fingerprints: **20 business tables, 3,425 rows, zero changed tables**. Session and login-throttle tables are excluded; the single rejected login attempt can affect security counters. No products, imports, business writes, schema changes or CMS publications occurred.
- Hosted homepage versus live Vercel: all **27 headings, 85 links and 31 image references** match after removing host/deployment delivery differences. Body colours and heading typography match. This is a content/style contract comparison, not an exhaustive pixel or device certification.
- Homepage, selected Creations images and footer rendered; the hero video played. Gallery category filtering produced 18 clocks; pagination showed the final six; search for 129 returned one image; its enlargement delivered the complete **1600 × 2000** WebP; reset returned 169 images.
- `/studio` redirects to the unchanged login page. Without current credentials it reports setup pending. `/api/studio/orders` denies the anonymous visitor with “Sign in to continue.” Authenticated Studio acceptance remains unverified.
- Evidence, configuration transfers, private record fingerprints and screenshots stay under ignored `test-results/netlify-migration/`; they are not part of the PR.

## Remaining release gates

1. Supply the three current Studio settings privately without changing the owner login. Verify successful authentication, session cookies, role boundaries and private media access.
2. Complete hosted acceptance for locale redirects, connection-header spoof resistance and the remaining authenticated workflows. Preserve read-only shared-data checks; synthetic writes stay in isolated local QA.
3. Review and merge PR #71 into `main`, change Netlify's production branch to `main`, and verify the exact resulting READY deployment.
4. Add `www.rivyalivingart.com` and the apex to Netlify, verify TLS and primary-domain redirects, then change only website DNS records in the existing GoDaddy zone. Preserve mail records and nameservers. Restore the existing production intake/retry settings and indexing only at the verified live release.
5. Recheck public pages, Studio and private media after cutover; compare protected data fingerprints. Record released SHA, deployment ID, URLs, DNS and rollback evidence.

Until these gates pass, the public domain remains on Vercel. A private READY deployment does not finish the full migration.

## Rollback

Keep the existing Vercel deployment and all data providers intact. Before cutover record the exact existing website DNS records privately. On a release failure, restore those website records and verify the known Vercel deployment. Because no database/content migration is part of this change, do not restore, reseed or overwrite business data as part of hosting rollback.

## Provider references

- https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/
- https://docs.netlify.com/build/functions/environment-variables/
- https://docs.netlify.com/manage/domains/configure-domains/configure-external-dns/
- https://vercel.com/docs/vercel-blob/using-blob-sdk
- https://vercel.com/docs/environment-variables/sensitive-environment-variables
