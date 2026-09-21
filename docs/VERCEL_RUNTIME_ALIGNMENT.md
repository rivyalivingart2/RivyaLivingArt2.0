# Vercel runtime alignment — 21 September 2026

## Current status — R8-3C continuation

Read-only `get_project` inspection of the same project now returns
`nodeVersion: "22.x"`. The project default and repository requirement are aligned.
The earlier dashboard-alignment action is therefore resolved in the current
project configuration; this task did not change that setting. Existing deployment
records may still show the Node24 default captured at their creation.

Deployment protection remains reported enabled with
`deploymentType: "all_except_custom_domains"`. The owner-authorized R8-3B PR #8
merge updated main to `cd6f91e55f8153b55a8c4af1f4329af1be81f38d`, verified
from the remote ref. This can trigger the existing Vercel production build. No
manual deployment, environment/protection mutation or domain change was made.
Deployment readiness, compiler feedback and deferred application QA are distinct;
the alignment observation does not establish that R8-3B or R8-3C has been tested.

The following diagnosis and setting instructions record the earlier state and are
retained for continuity. They are no longer an outstanding owner action.

## Historical diagnosis

The owner supplied a successful Vercel deployment screenshot with Node.js `22.x`
beside a struck-through `24.x`. Read-only inspection of project
`rivya-living-art2-0` (`prj_J90SIW3OHaXYsmhan527F4n8PYUc`) confirmed its project
default was **24.x** at that earlier inspection. The repository deliberately
requires **`>=22.16.0 <23`** in `package.json`, with `.nvmrc` set to `22`. Those settings select the tested Node 22
major instead of the project default; the screenshot is a settings disagreement,
not a failed deployment.

Vercel documents that `package.json` engines override the project setting and
that the dashboard setting applies to new deployments:
[Supported Node.js versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions).
Do not widen the engine range to Node 24 just to hide the warning.

## Historical setting change instructions — now resolved

In the existing Vercel project:

1. Open **Settings → Build and Deployment → Node.js Version**.
2. Select **22.x** and **Save**.
3. Check the next authorized development/Preview build uses Node 22 without the
   project-setting mismatch. Existing deployment records may retain their original
   build settings; do not redeploy production merely to refresh that record.

**Not applied by this task:** the connected Vercel tools expose project reads but
no project-setting update operation. No authenticated Vercel CLI is present, and
the browser opens the Vercel sign-in screen. No credentials were requested or
extracted. The application already pins the correct major; this final dashboard
alignment needs an authenticated owner session.

The screenshot's **Cold Start Prevention: Disabled** is separate from the engine
warning and is not evidence of a build failure. Leave it unchanged for this
frontend slice. Fluid Compute is shown enabled; its cold-start optimizations are
described in [Vercel's Fluid Compute documentation](https://vercel.com/docs/fluid-compute).
No plan upgrade, paid activation or function-runtime change was made.

## Deployment and data boundary

The project now exists, superseding earlier observations that the connected team
had no projects. Inspection found READY production deployments from main:

- `7d9edc1315c39b22335f9f69599b7c8c89b9a63f` (the owner's screenshot).
- `b1f0e095721d5b56a502598fe1478893ebf4e356` (subsequent PR #6 merge, confirmed
  independently through GitHub and Vercel).

The project reports Vercel authentication enabled with scope
`all_except_custom_domains`. No protection setting was changed. Publishing to the
development branch can now trigger Vercel Preview builds; main updates can trigger
production builds. Recheck protection and target before later publishing.

“An atelier taking shape” on production is intentional. `VERCEL_ENV=production`
always denies the fictional catalogue, even if the visual flag is set. A flag and
`noindex` are not authentication. Never change `VERCEL_ENV`, weaken the production
guard, or disable protection to expose the samples. The R8-5 protected visual
preview handoff and owner review remain ahead of backend integration.
