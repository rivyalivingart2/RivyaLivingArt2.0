# Google sandbox acceptance — PR checkpoint

25 October 2026. Current GitHub main was freshly fetched and verified at `019f4c1bac2c03dfeab00a1ed1fb46dc20c29d30`. The clean branch `codex/google-cloud-acceptance` retained `f07d38d` (portable setup/verifier) and `4122e89` (real private Google acceptance). The owner requested continuing on this same branch and delivering phase work through detailed PRs. This source publication authorization supersedes the earlier local-only Git hold.

## Reviewable change

The two Google HTTP transports rejected the managed proxy's opaque credential placeholder even though valid authenticated requests worked. They now validate bounded printable header values without assuming an OAuth-token alphabet. The management verifier also handles Google's omitted default sheet-zero GridRange ID without accepting malformed ranges.

Portable tools generate exact structural plans and verify real account/resource ownership, private sharing, 100×12 tabs/protections, immutable Apps Script version/source and approved endpoint policy. The original writer, Drive documents, jobs and publication foundations are reused. Sanitized [sandbox evidence](sandbox-verification.json) distinguishes source completion from actual installed services and bounded non-product tests. Private IDs, account details, endpoint URLs, credentials, originals and raw evidence remain ignored.

## Current validation and access

Fresh `npm run check` completed successfully on the retained application/test source: **641 application tests, 12 preflight tests and 409 built HTTP tests**, typecheck, production build and full lint (62 existing warnings, zero errors). The documentation-only authorization update does not change that application/test source. No initial Google provisioning, formula injection or broad acceptance suite was repeated.

Fresh runtime checks made zero writes: Google Drive account lookup returned **HTTP 401** for the retained short-lived OAuth binding; the existing HMAC-signed System read succeeded. The token must be refreshed privately before dependent Google management operations. The latest successful complete Google installation/acceptance audit remains the dated sandbox receipt; it is not relabelled as a new audit.

Git HTTPS and API access work through the existing authenticated `gh` CLI. Direct HTTP was denied, but the supported CLI route succeeded; the unnecessary proposed `api.github.com` draft exception was removed, retaining the original six Google domains and package-manager preset. Repository metadata, open-PR listing, branch-rules and commit checks were read. Branch-protection details returned integration HTTP 403, so absence of protection is not inferred. No credential value was requested in chat.

## Preservation and limits

Public pages/components, authenticated Studio and login code, current provider wiring, selected/original media, package declarations, lockfile and Vercel configuration are unchanged by this PR. No products, archived imports, business migration, CMS publication or production cutover occurred.

Core private Google foundations are verified; full Phase 2/production acceptance is not claimed. Retain the eight [remaining groups](SANDBOX-CHECKPOINT.md#remaining-dependencies): ordinary-editor permissions; concurrent owner/API writes; actual script interruption/quarantine recovery; independent expired leases; quota/rate-limit capacity; public-asset/large-bundle verification; production secrets/source export/migration reconciliation; remaining application integration/cutover/release work. Independent Phase 3 implementation may proceed, but no absent export or target mapping is invented.

## PR and release procedure

Publish this branch with a detailed PR covering exact changes, validation, preservation, limits and recovery. Read actual repository rules/status contexts and required reviews from GitHub; the checkout has no tracked GitHub Actions workflow or CODEOWNERS file, which does not establish an unprotected branch. Never bypass protections or push directly to main.

`vercel.json` enables Git deployment. Branch publication may create Preview; merging the configured production branch may create Production. Verify actual linkage/protection/deployment effects and resolve the separate later-production-release boundary against the concrete PR before merging. Do not change Vercel settings to bypass that boundary. The Codex environment remains unpublished.

Recovery is a reviewed source revert through a PR, while preserving private Google resources, the registry and mutation journals. Never reset canonical rows/control, delete artifacts or create duplicate deployments to undo this source change. Source revert does not revoke or erase the independently installed sandbox.

The branch was published; the observed Vercel branch check passed. PR URL, exact final head/checks and any merge/production-deployment receipts remain pending their actual actions; no merge or production release is asserted here.
