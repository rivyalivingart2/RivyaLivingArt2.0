# R8-4B — Studio content workspace, media and local history

**Date:** 21 September 2026

**Work branch:** `codex/r8-first-frontend`

**Parent main:** `8b8c81f5d85bf0a78d165184b3d8e460073452e4`

## Owner instruction and main integration

The owner requested that completed work be merged into main, followed by R8-4B.
PR [#11](https://github.com/rivyalivingart2/RivyaLivingArt2.0/pull/11) merged
R8-4A head `0691ef45500dc679577aaf1f77ea534f5c98bb67` into the main commit
above. The remote main reference was read back and verified. This R8-4B source
slice continues on development and is published separately; the prior merge
instruction is not standing authorization to merge subsequent work.

The [development-first decision](decisions/2026-09-21-development-first.md)
remains active. All testing-related work is deferred until after backend/database
integration. This document describes source behavior and development boundaries,
not performed browser, keyboard, responsive, build or integration QA. Existing
tests, commands and assertions remain intact for the final phase.

## Routes and access boundary

| Route | Source presentation |
|---|---|
| `/preview/studio/content` | Content-type navigation, searchable source documents and deep links |
| `/preview/studio/content/new?kind=page` | New local page draft; supported kinds also include article, FAQ and testimonial |
| `/preview/studio/content/[id]` | Typed editor, responsive preview, local checkpoints and workflow presentation |
| `/preview/studio/media` | Shared public-safe media metadata and availability presentation |

These routes reuse the existing `/preview/studio` shell. The layout, route and
metadata guards apply the shared preview policy before exposing fixtures; unknown
document IDs are rejected. The `/studio` holding boundary remains intact. There
is no staff account, session, permission grant, query login bypass or backend
authentication supplied by this harness. Studio descendants reuse the shell's
single main region and do not recreate public navigation inside the editor.

Vercel production continues to deny fixture routes. The visual environment flag
and `noindex` are not access control: online Preview still requires separately
verified deployment protection. No public live catalogue or CMS query is wired
to these local drafts.

## Component and operation map

| Specification | Actual source | Current scope | Later integration |
|---|---|---|---|
| A08 / Shared media | `src/lib/studio-media.ts`, `src/components/studio-media-library.tsx`, `src/components/studio-media-browser.tsx`, `src/components/studio-media-picker.tsx` | Public-safe source slots, search/filter, selected usage metadata and reference blockers | Authenticated storage, upload/replacement approval, authoritative usage graph and deletion |
| A09 / Content hub | `src/components/studio-content-hub.tsx`, `src/lib/studio-content-data.ts` | Guarded source adapter, grouped document list and deep links | Permission-scoped database queries and durable content operations |
| A10 / Typed editors | `src/components/studio-content-editor.tsx`, `src/lib/content-contracts.ts` | Page/article/FAQ/testimonial fields and local working drafts | Server schemas, versioned saves and canonical/redirect checks |
| A10 / Page sections | `src/components/content-section-editor.tsx`, `src/components/content-sections.tsx`, `src/lib/content-sections.ts` | Eleven templates, stable references, local ordering and shared preview | Persisted compositions, validated publication and schema migrations |
| A10 / Rich text | `src/components/content-richtext-editor.tsx`, `src/components/content-richtext.tsx`, `src/lib/content-richtext.ts` | Actual Tiptap, allowed nodes/links and safe React rendering | Server validation and durable structured documents |
| A11 / Preview and validation | `src/components/studio-content-editor.tsx`, `src/lib/studio-content-validation.ts` | Working/source preview, width controls and local issue presentation | Authorized draft preview, save/version agreement and delivery refresh |
| A18 / Local history | `src/lib/content-history.ts`, `src/components/studio-content-editor.tsx` | Memory checkpoints, readable field/block differences and restore-to-local-draft | Immutable database revisions, staff audit, permissions and publication pointers |
| Shared public sections | `src/components/content-section-public-parts.tsx`, `src/components/testimonial.tsx` | Reused public/Studio presentation and permanent fictional disclosure | Reviewed real content delivery after integration |

This is source implementation for the R8-4B presentation slice, not complete
A08–A11/A18 or CMS01–CMS12 backend acceptance. Project, navigation, settings,
permission and operational workflows retain their later in-scope tasks.

## Content model and controlled page sections

`src/lib/content-contracts.ts` defines the source-facing document and reference
contracts. Pages, articles, FAQs and testimonials have stable IDs and schema
version 1. The initial workspace adapts the six existing editorial page sources,
a homepage composer starting draft, 12 complete article drafts, 42 FAQ answers
and 24 fictional testimonials. A starting page composition is an editable preview
draft, not an assertion that a published public page has changed.

`src/lib/content-sections.ts` registers eleven approved section types:

| Type | Presentation and relationship boundary |
|---|---|
| Hero | Opening statement, selected media and controlled internal destination |
| Product selection | Stable product references; title/specification/price values remain catalogue-owned |
| Category discovery | Known collection destinations with furniture first |
| Material story | Owner-review editorial copy and selected media reference |
| Commission process | Sample planning steps, without production or delivery promises |
| Three-world introduction | Collectible, memory and personal journeys in their established hierarchy |
| Project story | Explicitly fictional spatial study, not completed client work |
| Testimonial | Referenced fictional quotes with a permanent sample disclosure |
| FAQ | Referenced source answers using the shared public disclosure presentation |
| Journal selection | Referenced source article titles and established destinations |
| Contact | Controlled link to an existing public conversation route |

Sections carry stable block IDs, versions, variants, defaults, bounded fields
and extracted content/media relationships. The editor exposes add, duplicate,
hide/show and keyboard move-up/down controls. It is not a free-form canvas,
HTML/CSS editor, JavaScript rule engine or remote-iframe builder. Unknown types,
versions, invalid variants and unavailable references produce visible local
validation issues. Future schema versions require a source migration.

Homepage validation retains a furniture-linked opening hero, a first product
selection containing LARGE references, and a three-world introduction or category
discovery. Shared public presentation components are reused in Studio preview;
changing local section copy or order does not replace source public pages.
The product-specific inquiry form builder remains a separate existing tool.

## Rich text and typed editors

The rich-text surface uses actual Tiptap 3.31.3. The allowlisted structured
document supports headings, paragraphs, lists, links, quotes, controlled media
references/captions and catalogue product references. Local content is represented
as validated JSON and rendered through React elements, not arbitrary HTML.
Selected media references resolve through the shared library; arbitrary external
image URLs and private customer attachments are not an insertion mechanism.

Links use a bounded safe-protocol policy. Editor initialization disables immediate
SSR rendering. Unsupported stored shapes and unavailable references remain
visible validation problems rather than being treated as approved publishable
content. This source implementation does not establish server-side sanitization,
authorization or browser security acceptance; those belong to integration and
the deferred QA phase.

Article fields include their source relationships and editorial metadata. FAQ
editing preserves a distinct question, group and answer. Testimonial editing keeps
its quote and fictional identity separate from the fixed disclosure. The shared
`src/components/testimonial.tsx` renderer always displays “Fictional sample — not
a customer review.” It includes no rating, reviewer photograph, verified badge,
customer location or public review schema. Editing a quote cannot make the fixture
real customer evidence.

## Shared media, rights and reference usage

`src/lib/studio-media.ts` defines stable asset IDs and usage-specific references,
including alt text, caption and focal-point choices. The picker and media workspace
use the same metadata. Product and editorial usages resolve IDs rather than
copying image bytes or mutable URLs into every document.

Only the two existing product AVIFs have actual local image files. They are
available for the protected concept preview, not marked production-approved or
genuine completed-product photography. The other 34 product mappings are pending
visuals. A generation brief is not an uploaded asset, and a concept image does
not establish rights approval. Unknown approvals, provenance details and real
storage operations must stay unknown/unconnected in the presentation.

The public-safe picker excludes private enquiry attachments. Missing/pending
assets use honest placeholders; reference and alt-text issues remain fixable
warnings. In-use media cannot be silently removed. Upload, actual asset deletion,
replacement approval and storage synchronization remain unavailable until backend
integration. No new image generation, download, upload or source mapping occurred.

## Local checkpoints, preview and workflow

The editor keeps a local working document separate from its source snapshot.
Debounced checkpoints, explicit local save, validation, version labels, history
and restore are in-memory presentation behavior. They do not create database
revisions, staff audit events or server persistence. Reloading or leaving the
workspace can discard these local edits; no durable recovery is promised.

The responsive preview uses the shared presentation components and distinguishes
current working content from the source starting draft; history comparisons are
separate from that preview selection. Mobile/tablet/desktop width choices use a
scrollable canvas; preview links open separately to preserve the open draft.
Only the latest 12 checkpoints are retained, and an expired selection explicitly
falls back to the source comparison. Eyebrow changes and formatting-only body
changes appear in readable history. Search/share fields have a local metadata
presentation. The workspace provides development layout controls, not evidence that mobile or desktop QA has run.
Failure/conflict examples are explicitly labelled simulations. A simulated failed
save must preserve current input and must not report a successful durable save.
Restore creates a new local working draft rather than rewriting the source or a
public publication pointer.

Real review permissions, publication, unpublication, version-conflict protection
across clients, durable history, scheduling, cache refresh and persistent archive
or restore remain later backend capabilities. Local create, duplicate and archive
presentations never mutate the public fixtures or imply a real published version.

## Dependency and implementation references

The actual dependency install adds exact `3.31.3` pins for `@tiptap/core`,
`@tiptap/pm`, `@tiptap/react` and `@tiptap/starter-kit`; npm adds 51 packages and
regenerates `package-lock.json`. Existing Next 16.3.5 and React 19.3.0 pins remain.
There is no paid/cloud collaboration or hosted CMS dependency. Node 22 remains
the repository/runtime target. Lockfile review found 51 new MIT packages with
registry URLs and integrity hashes, no added install scripts and no existing
package version changes. React type packages/csstype become runtime peer
dependencies; their versions remain unchanged. A dependency install is not a QA
pass. Clean npm ci verification remains part of deferred final QA.

Implementation references consulted:
[Tiptap Next.js installation](https://tiptap.dev/docs/editor/getting-started/install/nextjs)
and [StarterKit configuration](https://tiptap.dev/docs/editor/extensions/functionality/starterkit).

## Source content and remaining coverage

| Record type | This slice | Current total / target |
|---|---|---|
| Products | Unchanged | 36 / 120: 24 LARGE, 6 MEDIUM, 6 SMALL; 84 remain |
| Articles | Existing complete source drafts adapted for editing | 12 / 36; 24 remain |
| FAQ answers | Existing supplied source answers adapted for editing | 42 / 42 |
| Fictional testimonials | Exact DT001–DT024 supplied quotes and identities | 24 / 24: 12 LARGE, 6 MEDIUM, 6 SMALL |
| Fictional project studies | Unchanged | 3 |
| Editorial page sources | Six existing records plus a homepage composer starting draft | 7 initial page compositions; broader 14-page blueprint still incomplete |
| Inquiry/order scenarios | None added; local editor states are not operational scenarios | 0 / 40 |

`src/lib/testimonials.ts` retains deterministic IDs, `DEMO_FIXTURE` origin,
version 1, `OWNER_REVIEW_DRAFT` status and the permanent fictional label. The
quotes and identities come from Section 6 of the supplied demo blueprint; they
are not customer endorsements and cannot be promoted into real reviews by editing
a demo flag. No database rows, seeded accounts or delivered work are created.

The wider blueprint remains incomplete: remaining products/articles, fictional
studies, operational scenarios, page drafts and authored multi-revision content
examples need progressive source development. Browser-local history interactions
do not count as the blueprint's authored 12-document/three-snapshot coverage;
actual persistent seeding remains a later phase.

## Development feedback, publication and next task

**SOURCE_IMPLEMENTED:** R8-4B content workspace, editor/media/history presentation
and 24 fictional testimonial source records.

**UI_READY:** pending deferred visual/keyboard QA.

**BACKEND_CONNECTED:** no.

**TESTED:** not run for this slice.

**Compiler feedback:** `npm run typecheck` passed for implementation wiring
(Next route generation and TypeScript, Node 22). No lint, build
verification, unit/preflight/HTTP/browser checks or screenshot QA were run or added
for this slice. Compiler feedback does not establish UI_READY or TESTED. Historical
R8-3A evidence does not certify later source.

Read-only Vercel inspection reports Node `22.x` and authentication protection
`all_except_custom_domains`. Existing Git triggers may build main/Preview; no
explicit deployment, promotion, environment, runtime/protection setting or
live-domain action was performed. Publish the coherent development checkpoint,
read back its actual branch SHA/tree and report the resulting draft PR separately.

Remaining work includes Studio R8-4C/R8-4D, complete demo source, genuine approved
media, owner-reviewed care/legal wording and studio history, backend/database
integration and final consolidated QA. The supplied contact values remain known;
do not infer an address or business terms. R8-5 protected-preview handoff and owner
review are still ahead. No R8-5/V1 approval or R8-11/V2 readiness is claimed.
Every rejected integration and S01–S04 exclusion remains unchanged.

**Next exact task:** R8-4C — enquiry pipeline/status details and internal notes,
catalogue import/export controls, demo manager/remove dialogs and independent
menu visibility.
