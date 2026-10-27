# Vercel to Netlify hosting migration

Owner request: 27 October 2026. Base: `35f99fd9b5fd1b76333d92b4ddf3b90289c99b2a`.
Branch: `codex/netlify-hosting-migration`.

## Scope and preservation

Move the existing Next.js website and Studio hosting to Netlify. Preserve the approved public design, current Studio login, existing records, product identities, URLs, prices, media and relationships. No products, archived imports, CMS publication, schema migration or Google provider cutover. Neon and private Vercel Blob remain the existing data providers. Retain the Vercel project and its stores for rollback; deleting them would break the application.

The earlier Google programme completion statements describe source modules and local tests. They are not evidence that the deployed application has replaced SQL/Blob. This hosting migration deliberately keeps the currently working provider contracts.

## Implementation

- `netlify.toml`: Node 22.23.2, npm 10.9.2, Next build, `.next` output. Use Netlify's automatic Next.js adapter. No SPA redirect or API rewrite.
- A shared hosting policy recognizes Netlify at build and function runtime, while retaining Vercel and local behavior. Unknown or conflicting host identities fail closed.
- Netlify functions use a context-specific `RIVYA_DEPLOY_CONTEXT`; `CONTEXT` is build metadata and cannot be assumed at runtime.
- Published previews require explicit approval flags; shared data never enables fixture previews. Local editorial and unselected image routes remain inaccessible on either host.
- Locale cookies remain Secure on hosted environments. Request throttling trusts only the selected host's connection metadata, never generic forwarded headers.
- Public components, styles, images, products, SQL contracts and Studio login components are unchanged.

## Project and private configuration

Project: `rivyalivingart`, team: `RivyaLivingArt`.
Netlify project ID: `11998acf-7951-4a38-bff0-49cff55264ed`.
Dashboard: https://app.netlify.com/projects/rivyalivingart

Configure runtime variables through Netlify's environment settings/API, not just TOML:

| Setting | Production | Deploy Preview / branch deploy |
| --- | --- | --- |
| `RIVYA_HOSTING_PROVIDER` | `netlify` | `netlify` |
| `RIVYA_DEPLOY_CONTEXT` | `production` | `deploy-preview` / `branch-deploy` |
| `RIVYA_DATA_MODE` | `shared` | `shared` |
| `RIVYA_VISUAL_PREVIEW` | `0` | `0` |
| `RIVYA_PUBLISHED_PREVIEW` | not needed | `1` |
| `RIVYA_REFERENCE_STORAGE` | `vercel` | `vercel` |
| `AWS_LAMBDA_JS_RUNTIME` | `nodejs22.x` | `nodejs22.x` |
| `SITE_INDEXABLE` | enable only for verified live release | `false` |
| Intake and message retry flags | restore existing true values at release | `false` |

Private server credentials: `DATABASE_URL`, `BLOB_READ_WRITE_TOKEN`, `STUDIO_ADMIN_ID`, `STUDIO_ADMIN_PASSWORD`, `STUDIO_SESSION_SECRET`. Keep them out of source, logs, screenshots and PR descriptions. Never copy `VERCEL`, `VERCEL_ENV` or other Vercel platform identity variables into Netlify. Do not use expired or redacted export values. Production and previews must retain separate session secrets.

An existing owner-local configuration for this exact Vercel project supplied working database and media access. The saved Studio login did not authenticate on the live site; it must not be used to replace the owner's current login. Vercel's sensitive variables cannot be read back through its settings API. The current owner credentials are still required through a secure entry path.

## Verification recorded so far

- Node 22 production Next build: passed.
- Type generation and TypeScript: passed.
- ESLint: zero errors; 62 unchanged warnings.
- Application tests: 752/755 pass, including eight new hosting tests. The three existing Windows failures remain: POSIX mode assertion, symlink privilege, and CRLF serialization digest. Media byte verification is unaffected.
- Preflight: 12/12 pass.
- Built HTTP access/publication suite: 663/663 pass, including Netlify runtime production/preview failure cases.
- Existing database and matching private Blob store: read access verified. Protected business-table fingerprints captured privately. No record import or migration.
- Netlify local adapter packaging: blocked by Windows `EPERM` creating a Sharp directory symlink. Use the Linux hosted builder before asserting deploy readiness.

## Remaining release gates

1. Connect GitHub and build this branch on Netlify's Linux builder. Preserve preview protection.
2. Supply the current Studio credentials privately, without changing the owner login. Verify authentication, private API denial, cookies and role boundaries.
3. Compare the deployed public pages and selected images with the exact Vercel deployment. Check real media delivery, locale redirects, image optimization and unspoofable client-address handling. Use read-only checks against shared data; synthetic writes stay in isolated local QA.
4. Review and merge the focused PR into `main`, then verify the Netlify deployment's exact commit.
5. Add `www.rivyalivingart.com` and the apex to Netlify, verify TLS and primary-domain redirects, then switch only the website DNS records in the existing GoDaddy zone. Preserve mail records and nameservers.
6. Recheck public pages, Studio and private media after cutover; compare protected data fingerprints. Record released SHA, deploy ID, URLs, DNS and rollback evidence.

Until these gates pass, the domain remains on Vercel. A successful source build or empty Netlify project is not a completed migration.

## Rollback

Keep the existing Vercel deployment and all data providers intact. Before cutover record the exact existing website DNS records privately. On a release failure, restore those website records and verify the known Vercel deployment. Because no database/content migration is part of this change, do not restore, reseed or overwrite business data as part of hosting rollback.

## Provider references

- https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/
- https://docs.netlify.com/build/functions/environment-variables/
- https://docs.netlify.com/manage/domains/configure-domains/configure-external-dns/
- https://vercel.com/docs/vercel-blob/using-blob-sdk
- https://vercel.com/docs/environment-variables/sensitive-environment-variables
