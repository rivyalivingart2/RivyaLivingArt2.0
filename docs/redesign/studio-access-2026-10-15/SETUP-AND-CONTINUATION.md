> Release update: owner authorized source publication to main on 15 October 2026. Read RELEASE.md for the final scope and separate outstanding production database activation. Historical local-only statements below describe earlier checkpoints.

> Current visual direction: revision 6 replaces the rejected boxed navigation with refined text links and a gold active indicator. Read REVISION-6.md first. Functional setup below remains applicable.

# Studio access redesign — local checkpoint

15 October 2026. Branch `codex/studio-access-redesign`, based on released main `ba3564949089fbe993e21275ad324014cbdd6a3d`. This is a new, local implementation following the owner's login references and administrator-assisted recovery choice. No push, PR, production schema change, release, email or Drive write occurred.

## Implemented experience

- Image-led rounded sign-in composition, preserving the original logo, navy/ivory/gold palette and existing fonts. Responsive desktop split layout and mobile artwork header.
- `/studio/request-access`: name, proposed Staff ID, contact and explicit permission to use those details for review. Requesting an account never enables access.
- `/studio/forgot-password`: administrator-assisted recovery using the same generic acknowledgment for known and unknown identities.
- Studio → Staff access → Account & password requests: admin-only queue, identity-verification confirmation, approve/reissue/reject and a one-time link displayed only to the administrator. No automatic message is sent.
- `/studio/set-password`: fragment-carried token, stripped from the address bar after loading, single-use 30-minute expiry, 16–200-character password plus confirmation. An approved new account starts as an editor; recovery preserves the existing role and cannot enable disabled staff. Owner credentials remain managed in secure hosting settings.

## Security and preservation

Tokens are random 32-byte values; only SHA-256 hashes are persisted. Public requests are throttled by client and hashed Staff ID. Approval is authenticated, administrator-only, same-origin, version checked and explicitly requires identity verification. Concurrent link redemption succeeds once. Password updates consume the link and revoke previous sessions. Reissue invalidates the former link; staff credential changes invalidate issued links. Existing logins cannot be taken over by a new-account request.

All 1,657 original rows across 13 protected local scopes matched before/after hashes. One synthetic test staff account was added and ends disabled. Two clearly fictional HTTP requests remain pending in isolated QA for preview; security-test requests are closed. No live records were read or written for this task. Existing public content, media associations, crops, translations, orders and staff rows are unchanged. The existing inquiry authorization helper is retained.

## Verified evidence

- Final Next.js build and TypeScript validation passed.
- 350 unit tests and 403 HTTP runtime regression checks passed.
- 12 repository preflight checks passed after sandbox restrictions on temporary Git fixtures were removed for the test run.
- 30 dedicated isolated-database security checks passed, including concurrent redemption, expiry, replay, role boundaries, duplicate requests, existing-login protection and session revocation.
- 21 local HTTP flow checks passed, including the normal owner sign-in, all new routes, generic form submission, consent, throttling, queue visibility, origin and explicit verification protections.
- Desktop 1440px and mobile 390px/320px browser evidence is stored under ignored `test-results/studio-access/`. Mobile login screenshots use native top/bottom captures because the browser's full-page screenshot compositor produced black frames; the saved final captures were visually inspected.
- The Impeccable detector failed with Windows launcher `cache_directory_failed`; no automated detector pass is claimed. See `VISUAL-REVIEW.md` for independent screenshot review and its exact coverage.
- These checks are local technical evidence, not native screen-reader, physical-device, human identity, independent language or production acceptance evidence.

Raw fixture logs and private snapshots remain ignored. Sanitized receipts are summarized in the adjacent report. Do not replay fixture-creation scripts just to resume the preview.

## Production activation — only after explicit release authorization

1. Have the database owner apply `scripts/studio-access-migration.sql` to the intended production database. It adds one table and three indexes without rewriting existing tables. Apply `scripts/studio-access-runtime-grants.sql` with `runtime_role` set to the existing runtime role; do not grant schema-owner rights to the app.
2. Verify table/index definitions and the runtime role's SELECT/INSERT/UPDATE grants before deploying the app. Keep credentials in the hosting/database UI.
3. Prepare a detailed PR into main covering UI, routes, approval/recovery behavior, migration, preservation and validation. Merge/release only when authorized.
4. After the deployment is READY, check public access routes and image loading, then use the real administrator session to inspect Staff access. Test actual account approval/recovery only with an owner-authorized test identity and trusted delivery channel. Never send links or create real staff accounts automatically.
5. Confirm existing owner/staff login still works. If rolling back the app, retain the additive table and records; do not drop user requests or staff accounts.

The feature is not live yet. The production table/grants, deployment and production acceptance remain future release work. No email provider is needed for the selected assisted-reset flow.

## Resume locally

Use the existing guarded `tools/old-design-migration/run-local.mjs` runner and loopback QA configuration. The local PostgreSQL target is fixed to `127.0.0.1:55439/rivya_migration_local`; application preview is `http://127.0.0.1:4199/studio/login`. Keep live credentials out of this runtime. Start PostgreSQL only with the documented existing QA data directory; never create a replacement database over it.

Read this file, `DIRECTION.md`, `VISUAL-REVIEW.md` and the design documentation before continuing. Do not replay prior redesign phases, M9 publications or previous release operations.
