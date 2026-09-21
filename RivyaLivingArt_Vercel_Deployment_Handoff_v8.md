# RivyaLivingArt — Owner Vercel Deployment Handoffs

**Revision 8 · 21 September 2026**  
**Master:** `RivyaLivingArt_Master_Build_Prompt_v8.md`  
**Related:** `RivyaLivingArt_Frontend_First_Plan_v8.md` and `RivyaLivingArt_Git_Checkpoint_Workflow_v8.md`.

## 1. The owner deploys; Codex prepares and reports readiness

The owner requested two results: see the frontend before backend work, and be told when the complete build is ready for Vercel. Provide **V1 at R8-5** and **V2 at R8-11**. Do not wait for every backend feature before offering visual review. Do not mislabel the visual build as a functioning CMS.

This is a deployment runbook, not an instruction to deploy now. The latest request authorizes routine completed-slice Git pushes to a verified safe work branch, not production promotion, domain changes, paid activation, production secrets or database mutations. The owner performs the Vercel deployment unless they later authorize a specific action. Report any already authorized auto-created preview separately.

Vercel can create deployments on Git pushes; the configured production branch controls production behavior. Therefore audit the actual integration and branch before the first push. Do not assume `main` is production, or that every other branch is safe under custom environment settings. Never merge a release merely to make a preview URL appear. Official behavior: [Vercel Git integration](https://vercel.com/docs/git) and [deployment environments](https://vercel.com/docs/deployments/environments).

## 2. R8-0 deployment inventory — read, do not silently change

Record this in the existing environment/deployment docs using actual observed values or `NOT YET VERIFIED`:

| Field | Required evidence |
|---|---|
| Repository and work branch | Selected source workspace and verified remote/branch; no guess from historical README links |
| Project/team and root directory | Existing Vercel configuration or owner-confirmed target; detect monorepo root |
| Production branch and automatic jobs | Actual Vercel branch tracking plus other CI/deploy triggers |
| Runtime, package manager, lockfile and build command | Existing package/config and successful local/CI checks |
| Framework and output behavior | Actual Next.js project; do not force `output: export`, `dist` or an unrelated template preset |
| Preview protection | Actual method, target scope and ability for the owner to access the preview |
| Data/storage | None for fixture-only V1; isolated integration resources for backend QA; separate production resources |
| Domain and canonical | Preserve current configuration; no live-domain attachment to a visual build |
| Plan and spend | Confirm eligible plan and owner-approved usage; do not activate upgrades |
| Git publication capability | Actual push or supported publishing/PR mechanism; do not assume a cloud shell has write credentials |

Only unresolved fields needed for the next action should block it. For example, absent production credentials must not block the fixture frontend. A missing production branch/protection confirmation can block an unsafe remote push or preview release, but not local visual work.

## 3. V1 — frontend visual-preview readiness

### 3.1 Scope the owner can inspect

Provide a real frontend build of the home/collectible experience, secondary collections, product detail, form states, journal/FAQ/contact/system pages, and the complete Studio visual surface. Include responsive screenshots and exact accessible routes. Studio may use an isolated proposed `/__visual/studio` presentation route while real `/studio` remains protected; the actual route is determined by the source audit.

The preview displays synthetic fixture data with a persistent notice. Menus, galleries, filter/search/page state, form steps, editor layout and browser-local simulations should be usable. New database saves, authentication, real uploads, real imports, staff changes, publication and external message delivery are not complete. Tell the owner exactly which functions are simulated, unavailable or already genuinely working.

### 3.2 Frontend technical checklist

| Check | Required V1 result |
|---|---|
| Scope | All planned public/Studio visual surfaces mapped; excluded features absent |
| Data | 120/36/42/24/40 source fixtures complete and labelled; article bodies exist, not just titles/briefs |
| Visual quality | Actual mobile/tablet/desktop checks; logo-derived dark system; no missing essential layouts |
| Interaction | Keyboard/focus/dialog/back navigation and reduced motion checked; local changes clearly scoped |
| Media | Existing approved assets or deliberate labelled fallbacks; concrete owner prompts for genuine gaps |
| Build | Actual install/type/lint/relevant tests and Next.js build pass under fixture mode without DB/auth/Blob/mail secrets |
| Isolation | No operational provider calls/credentials; live build denies visual harness/mock auth; production mode does not silently fall back to fixtures |
| Side effects | No actual email/WhatsApp/telephone links for synthetic requests; no real uploads or business writes |
| Git | Scoped code/docs committed; exact work-branch SHA confirmed remotely |
| Deployment settings | Exact audited root/framework/build/environment instructions written; safe Preview target established or pending owner setup clearly identified |
| Evidence | Source fixtures versus database count separated; screenshots/check logs are actual outputs |

Missing optional film footage does not prevent V1 when a suitable reviewed poster/fallback is in place. Missing required routes, full fixture content, build success, isolation or safe deployment prerequisites must be listed as blockers, not hidden behind “ready.”

### 3.3 Minimal preview configuration — examples, not SDK defaults

Reuse existing stage flags when equivalent. Suggested logical settings:

```text
APP_STAGE=visual-preview          # server-selected stage; actual key must be implemented/audited
APP_DATA_MODE=demo                # only if this separate data selector already exists/is necessary
DEMO_SEED_ENABLED=false           # no database seed in the frontend preview
DEMO_EXTERNAL_ACTIONS_DISABLED=true
```

Do not add these names blindly to Vercel before the code actually reads/validates them. No real `DATABASE_URL`, authentication secret, email key, Blob write token, Drive token or generation key should be needed for the fixture-only preview. Existing optional read-only public media may be used without write credentials. Derive permitted public origin/image configuration from the app. Anything prefixed `NEXT_PUBLIC_` is never a place for secrets or an authorization boundary.

The application must reject the visual stage for a **production deployment target** instead of exposing mocks. On Vercel, inspect the actual target (including `VERCEL_ENV` where available) and project branch configuration. Do not infer deployment safety from `NODE_ENV=production`; a locally tested production build can still use synthetic data in a non-public review context. Unknown/conflicting stage/target information must fail closed or remain a documented deployment blocker.

### 3.4 Owner actions for a protected Preview

1. Use the existing correct Vercel project, or select the intended repo/project without changing the live domain. Confirm the work branch is not the configured production/custom-public branch.
2. Select the audited Next.js root, package manager, runtime and build settings from the readiness report. Keep the normal supported Next.js output; no arbitrary Output Directory workaround.
3. Apply only the implemented visual configuration to the actual **Preview scope/branch**. Do not inherit live database or email credentials into this build.
4. Enable and verify available **Vercel Authentication/deployment protection** for the relevant Preview URLs. This uses the owner's Vercel access, not a new application MFA feature. Do not assume paid Password Protection is free or necessary. Keep Studio visuals local if the available protection cannot be established.
5. Create a **Preview** deployment of the exact remote commit/branch using the available dashboard workflow, or review the already authorized auto-created Preview. Do not click production promotion or merge to the production branch.
6. After deployment, use its actual URL and check the stage banner, homepage, a product detail, forms, journal and Studio visuals. Record the SHA and access behavior. Do not attach the real business domain or publish fabricated demo reviews.

**New-project caution:** an initial repository import may create a Production-target deployment. Do not treat its generated `.vercel.app` address as proof it is a Preview. Set up the correct Preview branch/target before deploying fixtures; if the interface first attempts a production visual build, the app must fail closed and the owner should follow the corrected Preview workflow. Do not relax the guard to get a green deployment.

`noindex` and robots exclusions are indexing hints, not privacy controls. They supplement, never replace, verified protection. Check alternative branch/deployment aliases and direct media exposure. Only non-sensitive, rights-approved assets belong in this visual build. Official protection behavior: [Deployment Protection](https://vercel.com/docs/deployment-protection) and [Vercel Authentication](https://vercel.com/docs/deployment-protection/methods-to-protect-deployments/vercel-authentication).

### 3.5 Required V1 owner message

Fill actual values; remove placeholders rather than inventing them:

```text
FRONTEND VISUAL PREVIEW READY — BACKEND NOT COMPLETE

Please deploy the verified work-branch commit below as a protected Vercel Preview
so you can review the RivyaLivingArt website and Studio visuals.

Repository / branch: <verified safe identity / branch>
Commit: <actual remote-verified SHA>
Framework / root / install / build / runtime: <audited settings>
Preview environment: <implemented names and required non-secret values>
Protection before deployment: <verified method or exact owner setup step>
What you can review: <real routes and completed UI flows>
Still simulated: <login/data saves/uploads/publication/orders, as applicable>
Checks: <actual results and screenshot locations>
Remaining asset limitations: <specific prompts/fallbacks or none>
Owner action: <exact safe Preview deployment steps>
Observed preview URL: <only if one actually exists; otherwise NOT DEPLOYED>

This is a visual-review build, not a live business release. After your review,
I will continue the backend integration against these frontend components.
```

Do not use “ready” when required preflight checks have failed. Report **V1 BLOCKED** with exact missing evidence/action instead. When code/build is ready but owner configuration is pending, distinguish **frontend ready; protected Preview configuration pending** from an already protected/deployed site.

Pause substantial backend implementation for visual review or the owner's explicit instruction to continue without online deployment. Fix only confirmed-scope visual feedback; do not propose S01–S04 again.

## 4. Integrated-preview stage before V2

R8-6–10 use an isolated real test database and storage, normal staff sessions and actual backend services. Convert the reviewed UI's fixture adapter to real repositories/actions behind stable contracts. Do not redraw the frontend or leave mock actions active in production paths.

This staging build must not touch production customer data. Tests/fixtures use suppressed external messaging, private uploads, distinct resources and controlled staff credentials. Test a successful save/preview/publish cycle, unpublish/cache visibility, authorized file access, request idempotency, failed DB write, blocked WhatsApp handoff, import resume and durable demo deletion. A preview can demonstrate real backend functionality without being live sales.

Retain the current backend environment inventory from master Section 19. Required names depend on installed versions; do not claim example names are universal. Preview and production must not point at the same actual resources merely because their variable labels differ.

## 5. V2 — full deployment readiness

### 5.1 Release-candidate checklist

| Area | Required evidence |
|---|---|
| Frontend | V1 review outcome recorded; intended visuals preserved through backend integration |
| Login | Real staff password sign-in/setup/recovery/change/logout/revocation; authorized server reads/mutations and last-admin protection |
| Custom CMS | Actual editors, schema/sections, shared media/references, drafts, autosave/conflicts, private preview, versions and publish/unpublish/restore work |
| Catalogue | SQL-backed products/taxonomy/filters/price modes/customization and real validation |
| Enquiries | Save once before WhatsApp; snapshots, private references and usable failure/fallback states |
| Studio operations | Persisted notes/status, actual staff/settings behavior, safe read-only environment diagnostics |
| Demo pack | Correct initial persisted counts; all actual statuses covered; no outgoing messages; real/live metrics excluded |
| Cleanup/import | Real single/type/batch deletion, retain/edit/shared-media protection, no reseed after removal, resumable imports and safe exports |
| Media | Approved optimized assets, matching posters, accessible captions/alt, no private/source credential exposure |
| Stage isolation | Visual harness/mocks denied in live deployment; no client flag/query bypass; real configuration errors fail closed |
| Quality | Actual current tests/build/screenshots and route/state checks; performance/a11y targets measured honestly |
| Data change | Reviewed additive migration sequence, no seed/reset in build, verified backup/restore and known rollback limitations |
| Environment | Actual Vercel root/build/runtime; correct production secrets/resources provided securely by owner; preview separation verified |
| Live content | Approved factual products/content; fictional reviews/orders and demo references absent from live delivery/SEO |
| Git/release | Exact release candidate committed and remote-verified; CI checks observed or explicit blockers; production promotion not performed |

Conditional scheduling is not a launch blocker when explicitly inactive and manual publication works. Paid feature activation and new vendors are never inferred from a readiness request.

If full functionality works but live content/configuration is not ready, report **INTEGRATED PREVIEW READY — PUBLIC LAUNCH BLOCKED**, give the specific remaining owner inputs, and keep the site protected. A database full of demo fixtures is not a ready real catalogue.

### 5.2 Environment and deployment sequence

Record the actual database runtime/migration URLs by variable name only, authentication secret name, public/private media store configuration, trusted origins, optional configured recovery sender, and supported non-sensitive diagnostics. Use the existing compatible secret mechanism. No broad Vercel token in Studio and no secret editor, credentials in Git, cloud-agent logs or screenshots.

Vercel configuration updates apply to **new deployments**, not already deployed builds. After the owner supplies/changes configuration, create the intended new deployment and verify it; do not claim old deployment resources magically changed. Sources: [environment variables](https://vercel.com/docs/environment-variables) and [managing variables](https://vercel.com/docs/environment-variables/managing-environment-variables).

Have the owner review/execute the documented additive migration at the correct release step, using an authorized identity. No production database reset, destructive seeds or implicit build-hook migrations. Separate code rollback from database rollback. A Git revert does not restore deleted rows or Blob objects. Preserve the current live deployment until the approved release is ready.

After the owner authorizes/promotes the release, check actual deployment logs/SHA, hostname/stage, primary routes, staff sign-in, private route denial, assets and an authorized controlled enquiry/CMS workflow. Do not send real customer messages or create a business order merely to smoke-test. Keep any owner-authorized test marked and clean it through a documented safe path.

### 5.3 Required V2 owner message

```text
FULL BUILD READY FOR OWNER VERCEL DEPLOYMENT

The reviewed frontend is connected to the tested backend. The release-candidate
checks listed below passed against the stated environment.

Repository / branch / commit: <actual verified values>
Target: <full protected staging / approved production, explicitly distinguish>
Observed test/CI results: <actual outcomes, dates and relevant environment>
Configuration: <names/scope and exact owner setup actions, never secret values>
Migration / backup / rollback: <approved sequence and evidence>
Production content: <approved real content status; list any blocker>
What is operational: <verified website/CMS/auth/media/enquiry/demo/import flows>
Owner deployment steps: <exact project/root/runtime/build/ref/environment plan>
Post-deploy checks: <actual smoke-test plan>
Current deployment URL: <observed URL only, otherwise NOT DEPLOYED>

Please deploy/promote the approved release through your Vercel account after the
listed owner prerequisites are complete. No production deployment has been made
by this readiness message.
```

Where production prerequisites remain unmet, use the blocked/integrated-preview wording instead; do not bury them under the heading “full build ready.” After an actual deployment and checks, update to `DEPLOYED — VERIFIED` or `DEPLOYED — CHECKS BLOCKED`, with observed facts only.

## 6. Free tools versus hosting cost

Keep compatible free libraries and current architecture. Vercel's published Hobby rules limit that plan to non-commercial personal use; do not describe a business preview as automatically eligible simply because it uses fixtures. Verify the owner's eligible existing plan and budgets before deployment. This document does not authorize buying any plan/add-on. Sources: [Hobby](https://vercel.com/docs/plans/hobby) and [fair use](https://vercel.com/docs/limits/fair-use-guidelines).

## 7. Research and execution boundary

The new sequencing/owner messages are project requirements, not Vercel product guarantees. Official Git/Preview/protection/environment guidance was consulted on 21 September 2026. UI settings, plans and permissions may change; confirm exact controls in the actual project before use. No Git repository, Vercel project, secret, domain, database or deployment was changed while preparing this prompt pack.
