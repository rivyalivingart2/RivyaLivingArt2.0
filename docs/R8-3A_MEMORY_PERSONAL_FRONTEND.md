# R8-3A — Memory art and personal art frontend

**Date:** 21 September 2026

**Repository / branch:** `rivyalivingart2/RivyaLivingArt2.0` / `codex/r8-first-frontend`

## Scope and starting state

The owner requested diagnosis of the Vercel runtime warning, followed by R8-3A.
The warning is documented in [Vercel runtime alignment](VERCEL_RUNTIME_ALIGNMENT.md):
the tested application requires Node 22, while the project default is 24. The
application already selects 22. Saving the matching dashboard default needs an
authenticated owner session; this task has no project-setting write capability.

During inspection, GitHub confirmed the existing R8-2 PR #6 was already merged at
`b1f0e095721d5b56a502598fe1478893ebf4e356`. Vercel also reported its production
deployment READY. The development branch was fast-forwarded to that merge after
verifying its source tree exactly matched the previous R8-2 head
`528d6b172cd04d98a10541c200be048c7163ab8d`. In-progress work was preserved. No main
merge, production deployment or domain change was performed by this task.

## Implemented journey

This slice extends the existing catalogue, cards, media component, collection route
and canonical `/pieces/[slug]` route. Furniture stays the primary home journey.
Memory art and personal art use distinct presentations under the same data model.

| Surface | Memory art | Personal art |
| --- | --- | --- |
| Discovery | Story-led cards, occasion and preservation fields, sample sizes | Denser square cards, visible variants and permitted personalization |
| URL filters | Occasion, preservation type, sort | Recipient, colour direction, festival, sort |
| Detail | Preservation format, sample sizes, material acceptance, care and narrative | Compact object specifications, variant choices, gifting details and care |
| Primary action | Preserve Your Memory → on-page guidance | Personalize & Enquire → on-page guidance |

Filters are validated on the server and use shareable GET URLs, with bounded pages,
reset and empty states. The native disclosure supports keyboard access. Client
components receive only the current media/options, not the complete catalogue.
Related cards and breadcrumbs stay within the current tier.

R8-3A does not implement the R8-3B forms. Variant selection is a local visual state,
retained while reading that page's guidance and reset on reload. It does not change
media, pricing, stock, or create an enquiry. No addresses, shipping deadlines,
preservation guarantees, uploads, outgoing messages or customer data are invented.
Physical-material guidance requires current studio instructions before sending
anything.

## Progressive sample content

The discriminated catalogue has shared identity/media/price/demo fields, plus
furniture, preservation and gifting fieldsets. Gifts do not receive fabricated
furniture edition or installation fields. Existing furniture names, specifications
and image bytes are retained.

The authored batch adds **six MEDIUM** records: DP085, DP091, DP095, DP099, DP103,
DP107; and **six SMALL**: DP109, DP111, DP112, DP113, DP114, DP120. Each uses its exact
blueprint name, original summary and full narrative, versioned fixture identity and
labelled sample facts. Total: **24 source concepts (12/6/6), zero database rows**.
This does not complete the required 120 products or the remaining article/FAQ/
testimonial/scenario content.

Only the two previously approved furniture images are bundled. **Twenty-two
concepts have pending visuals**, including all 12 new concepts. The existing asset
companion records the new slots, three unapproved source-index candidates and the
next two filled image briefs. No private-source request was retried, image generated
or unrelated furniture image assigned to these objects.

## Verification

The clean `npm ci --no-audit --no-fund` completed under Node 22.23.2 / npm 10.9.2
without changing package.json or package-lock.json. The existing ESLint deprecation
notice remains visible; checks are not suppressed.

| Command | Actual result |
| --- | --- |
| `npm ci --no-audit --no-fund` | Clean install passed; manifest and lockfile unchanged |
| `npm run lint` | Pass, no errors or warnings |
| `npm run typecheck` | Pass |
| `npm test` | 48 passed |
| `npm run test:preflight` | 12 passed |
| `npm run build` | Pass |
| `npm run test:runtime` | 95 passed |
| `npm run test:e2e` | 146 passed, 10 inapplicable mobile-only skips, zero failures |

The final `npm run check` and full browser run passed after the mobile filter
refinement. Chromium 153.0.8010.0 / Playwright 1.62.1 exercised the actual built app
at 1440×1000, 768×1024, 390×844 and 320×740. The existing local browser executable
override was used; cloud-browser loopback restrictions were not altered.

Coverage includes all 24 detail routes and production denial, real image bytes,
unknown-route 404s, loaded fonts, decoded images, mobile-menu keyboard/focus/scroll,
URL filters/sort/pagination/reset/Back/reload, invalid and repeated parameters,
request-only pricing, native disclosures, same-tier related navigation and local
variant selection/announcement/reset. New art journeys also assert no console or
uncaught errors. No physical-device, Safari/Firefox or comprehensive accessibility
certification is claimed.

Independent source review verified every value in the original 12 furniture
records is unchanged and corrected ambiguous memory-card size labels to W × D × H.
Actual screenshot review caught truncated select labels at 390px; filters now use
one column below 600px. Cards retain their distinct density. Independent detail
review found no blocking layout issue at tablet and 320px widths.

Actual, unmodified browser screenshots:

- [Memory collection, desktop](evidence/r8-3a/memory-desktop.png)
- [Personal collection, desktop](evidence/r8-3a/personal-desktop.png)
- [Personal collection, mobile](evidence/r8-3a/personal-mobile.png)
- [Memory collection, 320px](evidence/r8-3a/memory-320.png)
- [Memory detail, tablet](evidence/r8-3a/memory-detail-tablet.png)
- [Personal detail, 320px](evidence/r8-3a/personal-detail-320.png)

The detail capture starts from the top to avoid a full-page screenshot artifact
from offscreen fixed skip links. The eight detail browser cases were rerun for
that evidence capture without changing application code or assertions.

## Readiness and continuation

The production fixture guard remains unchanged. The holding screen on production
is intentional; even an enabled preview flag cannot release the sample catalogue
there. Vercel authentication is reported enabled for previews; no deployment
protection or environment value was changed. A development publication may now
trigger a protected Preview build through the owner's Git integration.

Backend integration, CMS/auth/storage, real enquiries and all rejected integrations
and S01–S04 remain excluded. This is not R8-5 owner visual approval.

**SOURCE_IMPLEMENTED:** R8-3A. **UI_READY:** verified sample collection/detail
journeys for continued frontend work; approved imagery and full content remain
incomplete. **BACKEND_CONNECTED:** no. **TESTED:** actual results above.

The slice is prepared for a reviewed development-branch commit and draft PR. The
task result must report the queried remote SHA after publication. Creating a
commit object alone is not proof that the branch was updated.

**Next exact task:** R8-3B — build the furniture commission, memory-preservation and
personal-gifting form visuals with keyboard validation, a local summary and an
explicitly simulated receipt; no real submissions, uploads or messages.
