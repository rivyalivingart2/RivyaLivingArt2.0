# R8-3B — local commission, preservation and gifting journeys

**Date:** 21 September 2026  
**Branch:** `codex/r8-first-frontend`  
**Parent main:** `0999b3b0a873e0745231f119c1567b3f8cd79fd8`

## Owner instruction and scope

R8-3A was merged through PR #7 under the owner's explicit instruction. GitHub's
main ref was read back and matched the parent above. The existing Vercel Git
integration can build that main commit; no deployment settings or domains changed.

The owner moved all testing work to the final phase after backend and database
integration. See `decisions/2026-09-21-development-first.md`. This is a development
checkpoint, not a tested UI or a release candidate. Historical R8-3A results do not
apply to the new routes. Existing checks and test files remain intact.

## Implemented source

| Journey | Entry and public selection | Presentation |
|---|---|---|
| Furniture commission | `/commission`, optionally `?piece=<LARGE slug>` | Project purpose, dimensions with units, material/finish, setting/access/timing/budget, sample contact and review |
| Memory preservation | `/preserve?piece=<MEDIUM slug>` | Configured occasion/format/size/finish/personal details, materials/story, sample contact and review |
| Personal gifting | `/personalize?piece=<SMALL slug>&variant=<configured ID>` | Configured variant, permitted personalization, bounded quantity, gift notes, sample contact and review |

Unselected preservation and gifting routes offer a server-rendered sample picker.
Explicit unknown, wrong-tier, repeated or invalid selection parameters return
`notFound()`; no arbitrary replacement product is used. Public query parameters
contain only catalogue identifiers. Contact, personalization and file metadata are
kept out of URLs. Production gating precedes selection and fixture rendering.

The shared client wizard receives one serializable configuration and selected
product snapshot. The full catalogue remains outside the client form. Back/edit
keeps local values, conditional contact fields follow the chosen method, errors
link to their fields, and the review uses readable option labels. The fictional
example action leaves the acknowledgement unchecked. Required, length, enum,
numeric and real-calendar date rules are implemented as client presentation logic.
No date is shifted through UTC; past memory dates are allowed. Form fields remain
disabled until hydration so the preview cannot fall back to native URL submission.

Optional reference images are local JPEG, PNG or WebP previews. Type, signature,
size and browser decode handling are implemented; object URLs are released when
replaced, removed, reset or unmounted. No file is uploaded. Creating a demo summary
renders an explicitly simulated receipt in the current page; it neither persists
an enquiry nor sends a message. Image decoding finishes before advancing. A user-
initiated clipboard copy includes a manual text fallback. Refresh/navigation can
discard the draft.

Existing header/home/furniture CTAs open commission forms. Memory detail/cards open
preservation forms. Personal details carry the current radio selection to the
gifting form; cards select their first configured variant. Supporting guidance
sections remain available.

## Preview defaults, not studio policies

- One reference image up to **5 MiB**, limited to JPEG/PNG/WebP.
- Optional dimensions: **0.1–100,000** in the explicitly selected mm/cm/in unit,
  with up to three decimal places. These are input bounds, not fabrication limits.
- Bounded text fields; sample name 2–80 characters, sample email at most 160,
  sample phone 7–15 digits. Fictional examples use `example.invalid` and a
  non-contactable phone. These do not establish production identity validation.
- Personal quantity bounds come from the selected fixture; DP114 counts sets of
  four. Initial fields allow one letter or number. No surcharge, tax or total is
  invented, and gift wrapping is a request only.
- Material suitability, packaging/shipping instructions, timing, prices and final
  business consent remain for owner-reviewed content and integrated services.

## Readiness and deferred work

- **SOURCE_IMPLEMENTED:** R8-3B local form journeys and CTA handoffs.
- **UI_READY:** pending the owner's deferred visual/keyboard review.
- **BACKEND_CONNECTED:** no. No database rows, sessions, uploads, saved enquiries,
  messaging, payments, storage or new dependency packages.
- **TESTED:** not run for R8-3B under the development-first instruction. Compiler
  feedback: `npm run typecheck` passed (Next route generation and TypeScript only).
  No lint, build verification, unit/preflight/HTTP/browser checks or screenshots
  were run or created.

At final QA, adapt the earlier CTA assertions that still expect `#guidance` or
`/#commission`, then cover these new routes, selection rejection/production
isolation, keyboard/error focus, conditional and bounded fields, Back/edit,
variant handoff, local reference lifecycle and the simulated receipt alongside
the integrated adapters. Test authoring and execution are deferred together;
no existing assertion or gate was disabled to make this checkpoint pass.

The fixture count remains **24 (12 LARGE / 6 MEDIUM / 6 SMALL)**; media remains two
approved concept images and 22 pending visuals. Server validation, private uploads,
idempotent saved request snapshots and save-before-message behavior belong to R8-8.
All rejected integrations and S01–S04 remain excluded.

**Next exact task:** R8-3C — build the remaining public pages: journal index/article,
FAQ, about/process/materials/care, portfolio, contact and search, with labelled
content and progressively completed source fixtures.
