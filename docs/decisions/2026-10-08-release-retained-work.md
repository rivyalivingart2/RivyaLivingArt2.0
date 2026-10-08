# Release retained local work — 8 October 2026

The owner requested: “push all latest thing in gitrepo”. The standing instruction is to use a detailed PR for a main-branch release. Release the existing `codex/article-meaning-review` work through that process, without a direct main push or protection bypass.

## Included

- Complete assistant meaning corrections for DB001 and DB010 in Hindi and Gujarati (78 field values), source-fingerprint checks, import packs, review-packet generation and receipts that keep independent review and publication states explicit.
- Studio content-list status repair: compact records retain their server comparison; full saved records recompute draft/public alignment. Includes regressions for translation-only draft changes, publication and new drafts.
- Optional local Poppins fonts and license, shadcn Card/helper/configuration, existing-theme card defaults, IRA outline asset and license, and the pinned opt-in pattern.css dependency with source notices.
- The Aceternity registry configuration and independent experimental effects toolkit, pinned lockfile, selected upstream Liquid Glass source/notices and verification script. No production route imports the toolkit.
- Installation/checkpoint documentation, including the previously verified Mobbin account connection. User-level Codex skill folders are outside this repository and are not uploaded as repository source.

## Explicitly excluded

The owner stopped the later design audit and requested undoing it. Its untracked `docs/redesign/DESIGN-AUDIT-2026-10-08.md` and workspace `outputs/design-audit-2026-10-08` report/screenshots/support files must not be staged or published. Local deletion was blocked by the session's command-approval policy. No audit application edits exist to revert.

This release does not publish article translations, change business/contact/social values, modify products/forms/original gallery associations, transfer old products, create customer inquiries, send messages, add analytics, change database privileges or restore backups. Independent language/content/crop review, real-device/screen-reader testing and performance/real-user evidence remain separate acceptance work.

## Verification and release procedure

Run the repository checks with the supported Node 22 runtime and isolated data settings. Verify the optional toolkit separately. Review the final changed-file inventory to exclude audit artifacts, credentials, local environment files and dependency installations. Push the retained branch, create a detailed PR into `main`, wait for its exact-head checks, merge with the expected SHA, then inspect the existing Vercel Git deployment and bounded public routes.

At creation of this record the candidate is being prepared; this document is not evidence of a completed push or deployment. The PR records final validation and release results.

## Fresh local validation

- ESLint completed with warnings and no errors; Next type generation and TypeScript passed.
- 296 unit tests, 12 repository-preflight checks and 403 built-server HTTP checks passed. Production build passed using isolated data settings, without a live database test sweep.
- The standard `npm run check` reached the unit stage but its `tsx` startup failed before assertions because this Windows session's `os.userInfo()` call returns `uv_os_get_passwd / ENOMEM`. A temporary loader outside the repository used the already-installed TypeScript compiler to run the unchanged tests with Node 22.23.2. The unit and built-server counts above come from that alternate loader; the standard combined command is not recorded as passing.
- Optional-toolkit verification passed all nine module imports and both vendor-script syntax checks. The upstream Node-only Three.js CommonJS deprecation warning remains; no browser graphics acceptance is claimed.
- `git diff --check` passed. The cancelled audit report and its screenshots remain excluded from the release inventory. No application source changed during release preparation.
