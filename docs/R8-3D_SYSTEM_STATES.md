# R8-3D — system states and local recovery

**Date:** 21 September 2026

**Work branch:** `codex/r8-first-frontend`

**Parent main:** `96af467fe5cc94dc56f1fa507df35317cbdbc798`

## Owner instruction and main integration

The owner requested that completed work be merged into main, followed by R8-3D.
PR [#9](https://github.com/rivyalivingart2/RivyaLivingArt2.0/pull/9) merged R8-3C
head `cbacda4d6d9661e47f75157c9e894277181e3ad6` into the main commit above.
The actual remote reference was read back and verified. New R8-3D work continues
separately on development. No force-push, branch deletion or history removal occurred.

The [development-first decision](decisions/2026-09-21-development-first.md) remains
active. All testing-related work is deferred until after backend/database
integration. This document records implementation and its boundaries, not a browser,
responsive, build or integration QA result. Existing test sources and checks remain.

## Implemented presentation

| Surface | Development behavior |
|---|---|
| `SystemState` | Shared not-found, error, unavailable and empty compositions with clear destinations, optional retry and original decorative artwork; collection empty states expose reset links |
| `RootErrorPresentation` | Shared root-error composition in the global error boundary and presentation gallery; recovery copy does not claim any form was submitted or saved |
| Page loading | Busy/status presentation for pending content, keeping loading distinct from progress or completion |
| Collection, search and journal pending states | Suspense boundaries after preview/route validation; no global root loading boundary before unknown-route rejection |
| Header navigation | `PendingLink` uses `useLinkStatus` for actual in-flight link presentation |
| Failed media and gallery | Load-failure fallback, retry affordance and zoom availability after the selected image loads |
| Local form failure | Explicitly simulated failure keeps form values and the mounted reference preview available for editing or retry |
| Blocked WhatsApp | Labelled local fallback example; no navigation, transport, outgoing message or fake saved enquiry |
| `/preview/states` | Guarded presentation gallery for named states and local interactions, rather than deliberate runtime fault injection |

The gallery is frontend source that makes states inspectable during the eventual
review. Its existence is not evidence that those views have been tested in a
browser or that a real backend failure/recovery occurred. Unavailable examples do
not change the business availability of catalogue records.

State destinations use Next links with prefetch disabled. Collection empty-state
reset destinations preserve the intended collection route while clearing the
current selection; they are source behavior awaiting final QA with the other links.

Preview permission and parameter/record checks remain ahead of fixture rendering.
Pending boundaries are placed after those checks so loading presentation does not
intentionally stream a successful page before an invalid route is rejected. The
actual HTTP, keyboard, responsive and navigation outcomes are deferred final QA;
this source-level choice is not a new runtime-verification claim.

Media retry preserves honest unavailable-image messaging. Successful image loading
enables zoom; failed image loads must not masquerade as a usable enlarged image.
Form and reference state stay local. The failure presentation keeps the reference
component mounted, avoiding deliberate loss of the temporary selected-file preview
when switching into the local error state. Nothing uploads or persists the file.

## Contact correction and data boundary

The master brief Section 1 already supplies the real business contacts:

| Field | Authoritative supplied value |
|---|---|
| Phone / WhatsApp | +91 8320404132 |
| Click-to-chat destination | `https://wa.me/918320404132` |
| Email | `rivyalivingart2.0@gmail.com` |
| Location link | `https://maps.app.goo.gl/L2NHDt9Akgqs2ZoT6?g_st=ac` |

R8-3D corrects the earlier R8-3C missing-contact description using these exact
values. The earlier document has a dated correction above its preserved body.
Contact values are no longer a blocker. The map URL does not establish a street
address, opening hours, workshop access, shipping destination or delivery terms;
none is inferred. Owner-reviewed care/legal wording, studio history and genuine
supporting media remain outstanding.

Ordinary user-initiated contact links do not carry local fictional draft values.
The blocked-WhatsApp simulation remains separate from those supplied destinations
and sends nothing. No enquiries, messages, orders, uploads or sessions are created.
The future integrated journey must still save an actual enquiry before its
approved contents are handed to WhatsApp; clicking a link never proves delivery
or order acceptance.

## Source content and media

| Record type | This slice | Current total / target |
|---|---|---|
| Products | None added | 24 / 120: 12 LARGE, 6 MEDIUM, 6 SMALL |
| Articles | DB007–DB012: six complete original labelled drafts | 12 / 36; 24 remain |
| FAQ answers | Unchanged | 42 / 42 owner-review drafts |
| Fictional design studies | Unchanged | 3 |
| Editorial page records | Contact presentation corrected from the master | 6 |
| Testimonials | None added | 0 / 24 |
| Inquiry/order scenarios | None added; local recovery examples are not saved operational records | 0 / 40 |

The new articles cover warm neutral interiors, describing a commission, an
architect’s enquiry, wall art at architectural scale, material mood boards, and
the appearance of light/transparency. Each retains its DB ID, stable slug, typed
sections, excerpt, category, existing product relationships, image-brief ID and
owner-review notes. They are original design/planning drafts, not material
performance guarantees, approved technical advice or promises of studio services.

The asset companion now contains specific owner-generation briefs
`JOURNAL-DB007`–`JOURNAL-DB012`. No new image was generated or downloaded. Editorial
covers retain pending-image presentation until approved artwork exists. The two
existing product AVIFs, 22 pending product visuals, dependencies and lockfile are
unchanged. Fictional illustrations must never be presented as finished client
projects, documentary studio photographs or real product samples.

## Development feedback and next task

**SOURCE_IMPLEMENTED:** R8-3D frontend system states and second article batch.

**UI_READY:** pending deferred visual/keyboard QA.

**BACKEND_CONNECTED:** no.

**TESTED:** not run for this slice.

`npm run typecheck` passed (Next route generation and TypeScript, Node 22) for
implementation wiring. This remains compiler-only feedback rather than
a QA pass. No lint, build verification, unit/preflight/HTTP/browser checks or
screenshot QA were run or added for this slice. Historical R8-3A results do not
certify later source, and the state gallery must not be described as executed QA.

Read-only Vercel inspection still reports Node `22.x` and authentication protection
`all_except_custom_domains`. Existing Git triggers can build main/Preview; no
explicit deployment, promotion, runtime/environment/protection setting or live-domain
change was made. Production fixture denial remains intact. Publish this coherent
development checkpoint and read back its actual branch SHA/tree; record those
actual publication results separately from implementation or QA status.

**Next exact task:** R8-4A — Studio shell/navigation, fixture-derived dashboard,
product list/detail, tier fields and form-builder visuals. No backend integration
starts in this frontend slice, and rejected integrations and S01–S04 stay excluded.
