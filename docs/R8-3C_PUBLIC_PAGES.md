# R8-3C — journal, editorial pages and discovery

> **R8-3D correction — 21 September 2026:** the master brief Section 1 already
> supplies the business phone/WhatsApp, email and map link. The R8-3C description
> below that contact channels were missing was incorrect. R8-3D corrects the
> current contact presentation using those exact supplied values, without draft
> transfer or automated messages. Contact values are no longer a blocker; genuine
> care/legal wording, studio history and supporting media still require owner
> review. The original R8-3C record below is preserved as historical evidence.
> See `R8-3D_SYSTEM_STATES.md` for current content counts and implementation status.

**Date:** 21 September 2026  
**Work branch:** `codex/r8-first-frontend`  
**Parent main:** `cd6f91e55f8153b55a8c4af1f4329af1be81f38d`

## Owner instruction and main integration

The owner explicitly requested merging accumulated work into main, then R8-3C.
PR #8 merged R8-3B head `ce37e7966c8b50105c539caee44fba70a5a15278` into the main
commit above. GitHub's main ref was read back and verified. Development was
fast-forwarded to that merge before new implementation. The later R8-3C work is
published separately to the development branch.

All testing remains deferred until after backend/database integration under
`decisions/2026-09-21-development-first.md`. This document describes implemented
source and its limits. It does not claim responsive, keyboard, browser, build or
integration QA. No existing test file, assertion or check script was weakened.

## Public routes and components

| Surface | Implemented presentation |
|---|---|
| `/journal` | Featured note, article cards, category/search URL filters, four-per-page pagination, reset and empty state |
| `/journal/[slug]` | Six complete sample articles, sample author/date, contents links, reading progress, related pieces/articles and owner-review notes |
| `/faq` | All 42 supplied answers in seven topics, bounded URL search, native disclosures, references and explicit notes for planned capabilities |
| `/about` | Furniture-first design direction, three scales of art, existing concept imagery and honest missing maker/studio context |
| `/process` | Four conceptual brief-planning stages; no invented fabrication sequence or schedule |
| `/materials` | Four visual material directions, specification questions and links into filtered furniture discovery |
| `/care` | Questions for piece-specific guidance; not an invented cleaning, repair, handling or safety protocol |
| `/portfolio`, `/portfolio/[slug]` | Three fictional design studies, context/material/open questions, existing object references and inquiry links |
| `/contact` | Three local sample inquiry journeys, FAQ and professional brief links; no guessed contact address or WhatsApp destination |
| `/architects` | Professional project-context and specification guide leading into the existing commission form |
| `/search` | Bounded query/tier/page inputs over current demo concepts, furniture-first ordering, nine-per-page results, reset and empty state |

Twelve new route templates represent 19 concrete page paths in this content slice.
The existing canonical collection and product routes remain unchanged. Navigation
now includes journal and search, while the footer exposes all public page groups.
The homepage reuses the journal-card selection and links to the editorial pages.
The production footer retains its holding-page presentation.

`public-page.tsx` shares page headers, sample notices and closing CTAs. All new
pages call the request-time `requirePublicPreview()` boundary before querying or
rendering fixtures. Dynamic article/study metadata checks preview permission before
resolving titles. `publicPreviewMetadata()` denies sample metadata in production
and retains noindex/nofollow. Unknown article or study slugs use `notFound()`.
No invented live-domain canonical or publication JSON-LD is attached to drafts.

The content and query adapters render on the server. Article prose is typed plain
text in React nodes, never arbitrary HTML. Reading progress alone uses a client
component, passive scroll/resize events, animation-frame scheduling and resize
observation; it is separate from loading or form completion. Native FAQ disclosures
keep answers present without animation or JavaScript.

## Source content inventory

| Record type | This slice | Total / target | Status |
|---|---:|---:|---|
| Products | 0 added | 24 / 120 | Existing 12 LARGE / 6 MEDIUM / 6 SMALL; zero database rows |
| Journal articles | DB001–DB006 | 6 / 36 | Complete original first-batch drafts; remaining 30 are still briefs |
| FAQ answers | DF001–DF042 | 42 / 42 | Supplied wording preserved, owner-review drafts with preview qualifications |
| Design studies | DS001–DS003 | 3 | Fictional briefs, never delivered client projects |
| Editorial pages | EP001–EP006 | 6 | About, process, materials, care, contact and architects; owner review required |
| Testimonials | 0 added | 0 / 24 | Planned source fixtures, no genuine-review claims |
| Inquiry/order scenarios | 0 added | 0 / 40 | Planned operational fixtures; local R8-3B form state is not saved orders |

The six article titles exactly follow the DB001–DB006 assignments. Each has six
purpose-built sections, an excerpt, sample date/author, stable slug, related
existing DP references, a pending image-brief ID and owner-review notes. Article
word count and reading-time helpers describe body text only. These fixtures are
not CMS rows or publicly published articles.

FAQ answers that discuss future real uploads, saved enquiries, staff access or
WhatsApp include adjacent preview notes. Their supplied answers are retained as
drafts rather than silently presented as current functionality.

## Media and owner-supplied information

The existing two AVIFs are unchanged. Riverline/Basin remain object concept
visualizations, including when referenced in a design study; neither is relabelled
as an installed project or documentary workshop photograph. The other 22 product
visuals remain pending. The journal uses original decorative CSS covers with
image-pending labels. No new image, font, runtime package or lockfile change.

The existing asset companion now contains six specific editorial image briefs,
`JOURNAL-DB001`–`JOURNAL-DB006`, awaiting owner output and approval. No asset was
generated or fetched. Real portraits, workshop/fabrication imagery, finished
project records, contact channels and business-policy/care wording require
owner-approved source material. Unsupported workshop/3D-printing offers and legal
policy pages were not invented; the audit found no functioning routes to preserve.

## Development feedback and continuation

**SOURCE_IMPLEMENTED:** R8-3C public pages and first bounded editorial batch.  
**UI_READY:** pending the deferred owner visual/keyboard QA.  
**BACKEND_CONNECTED:** no.  
**TESTED:** not run for this slice, by owner instruction.

`npm run typecheck` passed: Next route generation and the TypeScript compiler
only. This is development-wiring feedback, not a QA pass. No lint, build verification, unit/preflight/HTTP/browser checks or
screenshots were run or added. Prior R8-3A evidence does not certify these pages.
At final QA, the earlier home/menu/link assertions will need adaptation for the
journal/search navigation and all new routes; that test work is deferred too.

Vercel's existing project now reports `nodeVersion: "22.x"`; the earlier mismatch
is resolved without a setting mutation in this task. Preview authentication still
reports `all_except_custom_domains`. Git pushes can trigger builds; no explicit
deployment, promotion, environment/protection change or live-domain action occurred.
Read `VERCEL_RUNTIME_ALIGNMENT.md` for the current observation and retained history.

**Next exact task:** R8-3D — finish public system states: root error, route loading,
empty/unavailable products, failed-form/media presentation and clearly simulated
WhatsApp fallback designs, before Studio development.
