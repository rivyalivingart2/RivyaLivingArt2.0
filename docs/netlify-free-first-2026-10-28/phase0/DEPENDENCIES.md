# Current runtime and storage dependency map

This is an inventory at application revision `41cda9c`, not an architecture activation or free-database approval. The complete static route/caller register is [source-inventory.json](source-inventory.json). Run `node --import tsx tools/phase0-source-inventory.mjs --out <local-report-directory>` to refresh it.

The tool uses TypeScript AST value imports and literal dynamic imports. It excludes type-only imports, follows resolvable modules under `src`, records SQL call locations and direct Blob imports, and maps transitive dependencies from route handlers. It does not execute routes, resolve arbitrary computed imports, prove callback execution, or infer provider access from a package name alone. SQL table text may include DDL or comments. `process.env` literal-name extraction is not a complete inventory of aliased configuration objects.

## Actual source coupling

| Dependency | Measured source result | Practical consequence |
|---|---|---|
| SQL | 53 direct-call/provider-initialization files; 45 of 53 route handlers have transitive SQL coupling | Replacing one adapter or toggling a provider flag cannot remove the application dependency |
| Blob | `src/lib/reference-storage.ts` and `src/lib/editorial-media-storage.ts`; 11 handlers transitively depend on them | Upload, read, download and managed-file lifecycle need deliberate replacement; retain Blob originals |
| Security initialization | `setSecurityAdapter` definition in `studio-auth.ts`, no call sites in tracked `src` | Google session/throttle interfaces exist but are not installed into the live app |
| Operations initialization | `setOperationsAdapter` definition in Google operations module, no call sites in tracked `src` | In-memory test stores and unused adapters cannot be treated as live persistence |
| Publication initialization | `setPublicationAdapter` definition in `published-source.ts`, no call sites in tracked `src` | Live public reads still use existing published SQL snapshots; coherent Google publication needs bootstrap and route integration |
| Provider switch | `studio-db.ts` blocks SQL when the selected policy forbids it | This fail-closed guard is not an initializer and will expose unconverted callers rather than migrate them |
| Scraper | `scraper-adapters.ts` uses Maps for jobs/observations, caller-supplied items, local cancellation | No durable source-to-observation worker, leases or restart recovery; fallback source/category/title/price assumptions need provenance review later |
| Catalogue | snapshot and validation contracts; worker compatibility simulation blocks without real providers | No real native Slides/PDF file generation/readback, template ownership or durable output history |
| Deployment | Netlify builds Next.js; production locked to migration branch; old `vercel.json` retained | Release requires explicit owner permission and refreshed deployment effects; deleting framework code is not a hosting migration |

The retained runtime packages are `@neondatabase/serverless` 1.0.2 and `@vercel/blob` 2.8.0. Current Next.js is 16.3.8; React is 19.3.0. `netlify.toml` specifies `npm run build`, `.next`, Node 22.23.2 and npm 10.9.2. Preview indexing is disabled; preview secrets/isolation still need real context verification. No package or build configuration was changed in Phase 0.

## Record authority and relationships

| Record/file family | Current authoritative source | Preferred replacement and dependency still to prove |
|---|---|---|
| Catalogue, prices, variants, form schemas | SQL `rivya_catalogue` | Private Content Sheet with large documents in Drive; preserve IDs, exact price semantics, URLs and revisions; no new products |
| Content and revision history | SQL content/revisions | Content Sheet + validated immutable Drive documents; exact English/translation drafts, references, provenance and history |
| Presentation and presentation revisions | SQL presentations/presentation_revisions | Content records/documents; atomic save/preview/publication, media references and recovery |
| Public media metadata | SQL public_media | Content records; originals/derivatives in Drive or existing repository according to current origin; publication must authorize public delivery |
| Existing selected public images | Tracked repository public/media | Retain working repository assets; no unnecessary transfer or regeneration |
| Inquiry/order records, events, notes and privacy state | SQL inquiries/studio_orders/studio_order_events/inquiry_notes/privacy_controls | Operations Sheet/documents; preserve relationships, roles, optimistic conflicts, audit and retention |
| Staff, access requests, sessions and throttling | SQL staff/access_requests/studio_sessions/studio_login_limits | Private security authority; prove atomic multi-worker operations and renewal; consider the narrowly justified free DB exception only if required |
| Business settings | SQL business_settings | Controlled record with exact identity/contact data and publication behavior |
| Audit, managed exports, erasure ledger, upload sessions and storage budget | Respective existing SQL tables | Explicit system/operations ownership with durable jobs, fences, retention, privacy and controlled writes |
| Public/editorial and private attachment file bytes | Existing Blob objects, plus repo-served assets | Copy only necessary managed files to Drive; checksums/MIME/dimensions/ownership/privacy and every reference must reconcile |
| Published public snapshots | Existing SQL published values and current capture/read logic | Immutable Drive publication bundle plus one authoritative active pointer; no uncontrolled dual writes/fallback |
| Research observations and generated catalogue jobs | No proven production canonical store | Durable private jobs/observations/output records; Maps remain simulation, never authority |

No production authority changed. No existing Neon resource has been declared the approved permanent free-tier exception merely because it exists. The later architecture decision must demonstrate atomicity/latency/capacity needs, verify current ongoing-free limits and ownership, and document export/restore and limit behavior before activating any exception.

## Table-map discrepancy

The 28-table map describes an isolated schema. Current production has 22. The six absent mapped tables are:

- `rivya_editorial_extensions` and `rivya_editorial_extension_revisions`: editorial extension activation depends on an explicit schema-ready capability; the production environment lacks that flag. Basic content editing uses its existing SQL tables.
- `rivya_newsletter_subscribers`: newsletter collection is disabled; the subscriber API has an honest unavailable response. No table or subscriber is invented.
- `rivya_migration_markers`, `rivya_restoration_conflicts`, `rivya_restoration_crosswalk`: mapping/rehearsal/restoration support tables, not proof of existing business records.

The earlier actual-source rehearsal measured 310 records requiring Drive documents (285 content, 4 presentation revisions, 1 presentation, 20 revisions). The other 3,144 fit the current inline encoding. These measurements are source representation results, not target committed counts. Relationship validation must include JSON references as well as SQL foreign keys during the later migration rehearsal.

## Configuration and recovery dependencies

Current Netlify key-name readback includes `DATABASE_URL`, `BLOB_READ_WRITE_TOKEN`, `STUDIO_ADMIN_ID`, `STUDIO_ADMIN_PASSWORD`, `STUDIO_SESSION_SECRET`, deployment/data/hosting context and the disabled intake/indexing/retry flags. Google writer registry, signing configuration and renewable provider credentials are absent. Secret values are not an audit deliverable.

Retain the installed sandbox's actual workbook/tab/folder IDs, execution identity, Apps Script deployment/version and key registration through its legitimate private environment. A Drive connector session is not an application server credential. Owner-only workbook metadata does not prove ordinary-editor restrictions or lock behavior.

Recovery dependencies remain: current source SQL; all Blob originals; Netlify's published migration deployment; existing Vercel projects/deployments/domains; OLDWEBSITE source; protected private registry and keys; verified source backup and restore; target reconciliation; final-delta/write-fence protocol and post-cutover export. Historical backup manifests and read-only fingerprints do not replace a tested backup.

Fresh native metadata confirms five 100 × 12 tabs in each Google workbook, but does not expose protections. Vercel's account/project integration lists both return zero accessible configurations; this is limited to those queries and does not prove no external resources exist. The project-webhook read is denied with 403 forbidden.

Remaining read-only inventory: authoritative Vercel hooks/schedules/other integration types and plan/trial/charge details, measured Netlify credit usage/limit behavior beyond account capabilities, Google capacity/scopes/installation readback, and current backup access/retention/restore. None requires deleting or replacing a resource. No provider configuration, subscription or account setting was changed in this audit.
