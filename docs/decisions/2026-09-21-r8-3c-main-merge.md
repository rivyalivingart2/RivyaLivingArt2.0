# Owner decision: merge R8-3C, then develop R8-3D

**Date:** 21 September 2026

**Repository:** `rivyalivingart2/RivyaLivingArt2.0`

**Development branch:** `codex/r8-first-frontend`

The owner instructed that completed work be merged into main, followed by R8-3D.
This authorizes integration of the completed R8-3C checkpoint, then the next
frontend development slice on the safe branch. It does not supply visual approval,
waive final QA or authorize automatic merges of subsequent work.

## Completed main integration

PR [#9](https://github.com/rivyalivingart2/RivyaLivingArt2.0/pull/9) merged source
head `cbacda4d6d9661e47f75157c9e894277181e3ad6` into main at
`96af467fe5cc94dc56f1fa507df35317cbdbc798`. The actual remote main reference
was read back and verified. The normal merge preserves Git history; no force-push
or branch deletion is authorized. Existing Vercel Git integration may build
production from main. No manual deployment, environment/protection setting,
runtime setting or domain change was made. Node `22.x` remains aligned, and the
existing Preview authentication setting remains reported enabled.

## R8-3D development scope

Continue the existing components with shared 404, error, root-error, loading,
empty and unavailable views; media fallbacks and gallery retry; local form-failure
and blocked-WhatsApp simulations; and a guarded `/preview/states` presentation
gallery. These surfaces demonstrate planned interface states. Implementing them is
not browser QA, fault injection or evidence that a real integration failed or
recovered. Actual pending indicators and boundaries belong after route validation,
so a global root loading boundary does not prematurely stream a successful
response for an unknown route.

Author six further complete labelled article drafts, DB007–DB012. Alongside
DB001–DB006, this brings article source to 12/36, with 24 remaining. The catalogue
continues to contain 24 typed fictional products (12 LARGE / 6 MEDIUM / 6 SMALL),
two concept images and 22 visual-pending records; 42 FAQ answers and three fictional
project studies remain present. Full product, testimonial and inquiry/order
scenario targets are still incomplete. No database rows or real saved requests are
created by this frontend work.

Record actual implementation and compiler-only feedback in
`docs/R8-3D_SYSTEM_STATES.md` and `PROJECT_STATE.md`. Readiness is separate:
**SOURCE_IMPLEMENTED:** R8-3D frontend state surfaces; **UI_READY:** pending deferred
QA; **BACKEND_CONNECTED:** no; **TESTED:** not run for this slice.

## Correction: contact values were already supplied

Master Section 1 already provides the authoritative business contacts:

| Field | Supplied value |
|---|---|
| Phone / WhatsApp | +91 8320404132 |
| Click-to-chat destination | `https://wa.me/918320404132` |
| Email | `rivyalivingart2.0@gmail.com` |
| Location link | `https://maps.app.goo.gl/L2NHDt9Akgqs2ZoT6?g_st=ac` |

The earlier R8-3C description of missing contact values was incorrect. R8-3D
corrects the current contact presentation using those exact values. This is a
current correction, not a rewrite of historical evidence. Contact values are no
longer a blocker. Do not infer a street address, opening hours, workshop access or
delivery terms from the location link. Real care/legal wording, studio history
and authentic supporting media still require owner review.

Live contact links must not carry local fictional drafts or trigger automated
messages. The blocked-WhatsApp UI remains an explicitly local simulation; it does
not claim a saved enquiry, sent message or accepted order. The later integrated
flow must preserve the requirement to save the real enquiry before handing off
its approved contents to WhatsApp.

## Continuing constraints

The [development-first decision](2026-09-21-development-first.md) remains active:
all testing-related work is deferred until after backend/database integration.
Do not run or add per-slice lint/test/preflight, build verification, browser checks
or visual QA. Compiler/typechecking may resolve development wiring and does not
establish TESTED or UI_READY. Preserve existing tests, commands and assertions;
historical R8-3A results do not certify later source.

Continue frontend development, Studio and the protected R8-5 handoff before backend
phases. Preserve owner review control; do not invent approval. Production fixture
denial, separately protected Preview deployments and all rejected integrations
and S01–S04 exclusions remain unchanged. No backend, database, authentication,
upload, persistence or messaging integration starts in R8-3D.

**Next exact task:** R8-4A — Studio shell/navigation, fixture-derived dashboard,
product list/detail, tier fields and form-builder visuals.
