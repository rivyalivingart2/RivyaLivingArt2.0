# Private Studio and order board — 23 September 2026

The owner requested a private `/studio` address on the same website, no Studio link on the primary website, an admin ID/password managed in Vercel, and drag-and-drop Kanban orders. This supersedes the earlier authentication placeholder for this scoped owner login. Only free services are authorized.

## Implemented

- `/studio/login` provides the real server-checked owner login. The public website no longer imports the Studio component or displays a Studio link. Old `/preview/studio` addresses redirect to `/studio` and retain server authentication checks.
- Credentials are read only on the server from `STUDIO_ADMIN_ID` and `STUDIO_ADMIN_PASSWORD` (16+ characters). `STUDIO_SESSION_SECRET` must be an independent random 32+ character secret. Nothing has a default password. Missing configuration fails closed.
- Opaque random session tokens use HttpOnly, Secure (deployed), SameSite=Strict cookies. Only SHA-256 token digests are stored in Postgres. Sessions expire after eight hours, with a 30-minute idle limit. Logout revokes the database session. Changing the ID/password/session secret and redeploying invalidates previous sessions. No client-side login flag grants access.
- Database-backed account-wide throttling allows ten attempts per 15-minute window, across instances and browsers. Storage failure denies login. Password comparison uses scrypt and constant-time digest comparison. Server Actions enforce their same-origin boundary; order writes also require an exact Origin match and bound the body to 4 KiB.
- `/studio/orders` loads actual database records, creates orders manually, and saves stage moves. Cards support mouse/touch dragging and a keyboard-accessible stage selector. A move updates the record and audit event in one SQL statement; version checks reject stale-tab overwrites and refresh the board. Failed writes retain the previously saved stage.
- The separate sample-enquiry module offers the same board/table interaction using existing fictional fixtures and browser-local drafts. Samples never seed live orders. Existing catalogue/content modules still use local demo editing; authentication does not imply their backend is implemented.

## Required configuration

1. Use a dedicated **Free** Neon database, matching the project's planned Postgres provider. Do not select Launch, Scale, trial upgrades, paid compute, or auto-upgrade. Connect only to the intended Vercel Preview branch initially; production requires its own database/credentials.
2. Vercel supplies `DATABASE_URL` after connecting the database. Apply `scripts/studio-schema.sql` using Neon's SQL editor, or run `node --env-file=.env.local scripts/studio-migrate.mjs` from a trusted local shell with the isolated URL. This explicit migration creates only namespaced tables and indexes; it inserts no fixtures or credentials and never runs during a build.
3. In Vercel Project Settings → Environment Variables add `STUDIO_ADMIN_ID`, `STUDIO_ADMIN_PASSWORD`, `STUDIO_SESSION_SECRET` for the intended environment. The owner enters the new credentials directly; never send them in chat or put them in Git. The password needs at least 16 characters, and the session secret at least 32 independently random characters.
4. Redeploy the branch after setting configuration. The login intentionally stays unavailable until configured. Database-backed operations cannot be claimed connected before the provider setup and schema application succeed.

The owner can recover access by replacing the Vercel credentials and redeploying. No email recovery, extra staff accounts, external identity provider, payment, outgoing customer message, or public order form integration was added. Order workflow follows New → Contacted → Qualified → Quoted → Confirmed → In production → Completed → Closed; the administrator can move in either direction deliberately. This board saves stages, not card ordering within a stage. The initial listing is capped at the newest 1,000 records with an explicit notice.

## Verification boundary

TypeScript is used for implementation wiring only. Formal auth/security, browser, database-concurrency, session expiry, logout, accessibility and end-to-end order tests remain deferred under the owner's development-first instruction. Deployment READY is build status, not a security or full-QA certification. This implementation is in the Next.js repository; the historical native Sites export has no operational auth/database support and is not republished.
