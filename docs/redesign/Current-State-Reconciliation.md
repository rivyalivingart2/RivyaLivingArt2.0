# RivyaLivingArt — Current-state reconciliation

**Date:** 23 September 2026. **Purpose:** Phase 0 evidence companion to `RivyaLivingArt-Commercial-Implementation-Plan.md` revision 3.0. This is not a competing implementation plan.

**Phase 1 handoff update:** The owner subsequently approved the revised plan and instructed Phase 1 completion and GitHub publication. Revision 3.1 records approval with no scope changes. The observations below preserve the original read-only audit date/scope; they are not claims of a new runtime audit. Repository plan/progress guidance is now registered; no application or database changes are part of this handoff.

## Authority and audit scope

At the time of this audit, the owner authorized planning/audit only and required revised Phase 1 approval before implementation. That approval is now recorded in the Phase 1 handoff. The owner explicitly resolved the missing separate `WHATSAPP_ORDER_GUIDE.md` with **“Use the pasted workflow as the reference.”** That workflow requires saved product/customization/customer/reference details in database and Studio before the order message opens in WhatsApp; the customer manually sends. No general WhatsApp feature is authorized.

Read-only evidence: both original plans, master revision 2.5 and its pasted copy, latest pasted correction, repository AGENTS/project/checkpoint/schema/source, current Vercel deployment listing and qualitative reference-site inspection. No new application edits, customer submissions, migration, seeding, tests/build, push, deployment or asset generation.

## Source and deployment baseline

| Surface | Evidence | Interpretation |
|---|---|---|
| Repository | Original `rivyalivingart-website-studio-preview-sites-project/work/repo` | Existing project retained |
| Work branch | `codex/whatsapp-order-experience` at `7c7b38a48f721b54cc32c628454d9d571583af5e`; local working tree clean | Source checkpoint, not a verified release |
| Published source | Prior remote readback matches `7c7b38a`; implementation `0ae2c9f`, Vercel-only correction `583b0b6` | GitHub source already published; no new push this turn |
| Live deployment listing | Fresh Vercel read lists production `dpl_7HRC8CVEJ98ih86yRxoppxVgMgR2`, READY at main `f9533bbbaf3cc2843025f1a1243442b0a9d920e8` | Current redesign is not deployed; READY is not functional verification |
| Public render inspection | Text retrieval failed; bounded browser fallback hit unavailable in-app session and Chrome extension control conflict | No fresh Rivya homepage/WhatsApp-control observation; does not prove outage |
| Preview database | Saved receipts in `docs/redesign/INFRASTRUCTURE.json`: additive inquiry/content/media/provider/settings/revision changes; last readback 16 tables | Recorded evidence, not a fresh database query in this turn |
| Snapshot | Private schema `rla_backup_20260923_p6` before inquiry migration | Useful migration snapshot inside same database, not independent disaster recovery |
| Production database | No current schema/data inspection | Reconcile read-only before any future migration |
| Credentials | Earlier ignored local database/Blob values masked | Connection gap, not absence of services; never put values in this document |
| Hosting | Vercel-only; Netlify removed; Git auto-deploy disabled in committed `vercel.json` | Commercial eligibility unresolved; no manual deployment permitted by this planning request |

## What actually exists

- Reusable forest/navy/ivory components, constrained header/menu/search, product discovery/gallery, 120 product-specific field definitions and three-step form source.
- Published-only catalogue/content query paths; 120 products, 36 articles, 11 page/policy documents and 131 public media in the prepared candidate. The insert-only publication script has not run.
- Atomic inquiry and same-ID Studio order creation, reference association, history and audit. Stable request UUID/payload hash and guest binding support duplicate recovery in source.
- Complete product snapshot, customer fields, answers, notes, saved summary and private reference metadata. Current answer keys are labels; consent check exists without acceptance version/time persistence.
- Private upload decoding/normalization, three-image/3MB limit, guest ownership, capacity reservation, private staff streaming and expired-unattached cleanup source.
- Staff authentication, named roles, assignment restrictions, list/Kanban/detail, notes/due dates/history, manual records, catalogue/forms/content/media drafts/publication, revisions, staff/settings/export source.
- Eight stages already match the requested lifecycle. No stage rename/migration is required by the corrected scope.
- All 48 old coverage rows are source-mapped, none TESTED. Previous TypeScript passes establish wiring only. Full integrated QA remains outstanding.

## WhatsApp cleanup evidence

| Item | Classification | Source evidence | Planned treatment |
|---|---|---|---|
| Saved-order receipt handoff | KEEP | `src/lib/whatsapp.ts:4–7`; `saved-receipt.tsx:6–16` | Order-only Open/reopen/copy |
| Save before handoff | KEEP | `order-form.tsx:58–73`; `inquiry.ts:47–76` | Preserve atomic core save and success-dependent navigation |
| Summary generated before save | REWRITE | `inquiry.ts:45` builds text before CTE insert | Finalize from saved canonical snapshot; persist version/state; safe retry |
| Staff saved message controls | ORDER-RELATED ONLY; ADD | `inquiry-board.tsx:27` displays text but no Open/Copy action | Authorized actions only on a saved record with a real saved message |
| Broad WhatsApp operational copy | REWRITE | `shop-editorial.ts`, `shop-site.tsx`, `shop-frame.tsx`, `layout.tsx` | Narrow application role to prepared-order handoff |
| Internal Kanban/follow-ups | KEEP | `inquiry-board.tsx`, `operations.tsx` | Internal order lifecycle; no outbound automation |
| Business destination setting | KEEP with scoped label | `business-settings.tsx`, settings API | Admin-only WhatsApp order destination |
| Contact page | KEEP normal contacts | `shop/editorial.tsx:26` | Phone/email/map; order CTA into form, no general WhatsApp button |
| Chatbot/support/marketing/broadcast/notification/login/sharing integration | NOT FOUND; EXCLUDE | Source search of WhatsApp URL creation and feature terms | Do not invent implementation or cleanup claims |
| Legacy simulated handoff/state gallery | REMOVE FROM REACHABLE PRODUCTION after audit | `inquiry-recovery.tsx`, `state-gallery.tsx`, legacy `rivya/experience.tsx` | Preserve history; verify imports/routes before safe removal |

Only `src/lib/whatsapp.ts` constructs actual `wa.me` links in active source. This does not prove every production route behaves correctly; final reachability and browser checks remain required.

## Highest-priority corrections

1. Durable message-finalization from saved data, stable field-ID answer snapshots, consent/source/template metadata and explicit bespoke-request kind.
2. Saved-order-only Studio Open/Copy controls, clearer card context and product/category/date filters.
3. Recovery for message-finalization failure, stale form schemas, interrupted uploads and navigation without persistent plaintext browser PII.
4. Verified private access, role/concurrency boundaries, functioning anti-abuse controls and complete personal-data retention/deletion policy.
5. Independent backups/restore, environment reconciliation, real database/Studio proof, measured accessibility/performance and exact-commit QA.
6. All-instance factual/media review, production fixture isolation and specific missing policy facts.
7. Hosting eligibility remains a separate release gate. WhatsApp scope correction is not a Hobby-plan exemption.

See the main plan for the full severity register, conflict/migration/approval table, benchmarks, architecture, phase tasks and release gates.

## Instance checklist rules

The inventory below is copied by ID/slug from the preserved source register. Its older names/dimensions/status wording are not promoted as new factual approval. Later reviewed product/article copy remains authoritative for proposed display text. Every product row requires detail + customization + content/media + responsive/accessibility + persistence/handoff evidence, or an explicit unpublished disposition. Article rows require complete text/media/metadata/related-content verification. Checkboxes are deliberately unchecked: this planning audit is not runtime QA.

The approved supplied product/policy/image set remains approved. Eight fictional projects below are held; 24 fictional testimonials and 40 fictional operational fixtures also stay unpublished. No data has been deleted.

### Product instances — P06/P07

| Check | ID | Canonical product slug | Legacy slug to reconcile |
|---|---|---|---|
| [ ] | DP001 | river-channel | riverline-live-edge-dining-table |
| [ ] | DP013 | shallow-basin | basin-shallow-pour-coffee-table |
| [ ] | DP035 | narrow-span | span-narrow-console |
| [ ] | DP048 | entryway-bench | threshold-entry-bench |
| [ ] | DP069 | lattice-object | lattice-resin-and-3d-sculpture |
| [ ] | DP002 | stillwater-full-pour-dining-table | stillwater-full-pour-dining-table |
| [ ] | DP014 | orbit-circular-centre-table | orbit-circular-centre-table |
| [ ] | DP025 | twinleaf-matched-side-table-pair | twinleaf-matched-side-table-pair |
| [ ] | DP043 | petal-sculptural-chair | petal-sculptural-chair |
| [ ] | DP051 | single-slab-atelier-desk | single-slab-atelier-desk |
| [ ] | DP057 | horizon-band-wall-panel | horizon-band-wall-panel |
| [ ] | DP077 | estuary-reception-counter | estuary-reception-counter |
| [ ] | DP003 | verdant-split-slab-dining-table | verdant-split-slab-dining-table |
| [ ] | DP004 | monolith-long-span-dining-table | monolith-long-span-dining-table |
| [ ] | DP005 | estuary-oval-dining-table | estuary-oval-dining-table |
| [ ] | DP006 | canopy-round-dining-table | canopy-round-dining-table |
| [ ] | DP007 | tidal-rectangular-dining-table | tidal-rectangular-dining-table |
| [ ] | DP008 | umber-twin-base-dining-table | umber-twin-base-dining-table |
| [ ] | DP009 | lagoon-pedestal-dining-table | lagoon-pedestal-dining-table |
| [ ] | DP010 | ridge-bronze-inlay-dining-table | ridge-bronze-inlay-dining-table |
| [ ] | DP011 | dune-smoked-resin-dining-table | dune-smoked-resin-dining-table |
| [ ] | DP012 | grove-communal-dining-table | grove-communal-dining-table |
| [ ] | DP015 | contour-oval-coffee-table | contour-oval-coffee-table |
| [ ] | DP016 | drift-nesting-coffee-table | drift-nesting-coffee-table |
| [ ] | DP017 | pebble-sculptural-coffee-table | pebble-sculptural-coffee-table |
| [ ] | DP018 | delta-two-level-coffee-table | delta-two-level-coffee-table |
| [ ] | DP019 | cove-low-coffee-table | cove-low-coffee-table |
| [ ] | DP020 | halo-ring-base-coffee-table | halo-ring-base-coffee-table |
| [ ] | DP021 | moss-square-coffee-table | moss-square-coffee-table |
| [ ] | DP022 | slate-river-coffee-table | slate-river-coffee-table |
| [ ] | DP023 | current-asymmetric-coffee-table | current-asymmetric-coffee-table |
| [ ] | DP024 | terra-plinth-coffee-table | terra-plinth-coffee-table |
| [ ] | DP026 | dewdrop-pedestal-side-table | dewdrop-pedestal-side-table |
| [ ] | DP027 | arc-c-shape-side-table | arc-c-shape-side-table |
| [ ] | DP028 | reed-tall-side-table | reed-tall-side-table |
| [ ] | DP029 | nocturne-bedside-table | nocturne-bedside-table |
| [ ] | DP030 | loam-drum-side-table | loam-drum-side-table |
| [ ] | DP031 | lumen-translucent-side-table | lumen-translucent-side-table |
| [ ] | DP032 | brook-floating-top-side-table | brook-floating-top-side-table |
| [ ] | DP033 | silt-compact-bedside-table | silt-compact-bedside-table |
| [ ] | DP034 | eclipse-round-side-table | eclipse-round-side-table |
| [ ] | DP036 | root-sculptural-base-console | root-sculptural-base-console |
| [ ] | DP037 | passage-entry-console | passage-entry-console |
| [ ] | DP038 | horizon-long-console | horizon-long-console |
| [ ] | DP039 | meadow-floating-effect-console | meadow-floating-effect-console |
| [ ] | DP040 | trace-metal-frame-console | trace-metal-frame-console |
| [ ] | DP041 | sienna-curved-console | sienna-curved-console |
| [ ] | DP042 | canyon-split-level-console | canyon-split-level-console |
| [ ] | DP044 | crescent-lounge-chair | crescent-lounge-chair |
| [ ] | DP045 | aster-dining-chair | aster-dining-chair |
| [ ] | DP046 | rill-counter-stool | rill-counter-stool |
| [ ] | DP047 | flint-accent-stool | flint-accent-stool |
| [ ] | DP049 | forest-long-bench | forest-long-bench |
| [ ] | DP050 | fold-sculptural-bench | fold-sculptural-bench |
| [ ] | DP052 | meridian-writing-desk | meridian-writing-desk |
| [ ] | DP053 | stillpoint-study-desk | stillpoint-study-desk |
| [ ] | DP054 | haven-compact-desk | haven-compact-desk |
| [ ] | DP055 | linework-executive-desk | linework-executive-desk |
| [ ] | DP056 | terrace-studio-desk | terrace-studio-desk |
| [ ] | DP058 | vertical-drop-wall-panel | vertical-drop-wall-panel |
| [ ] | DP059 | sequence-wall-triptych | sequence-wall-triptych |
| [ ] | DP060 | strata-layered-wall-relief | strata-layered-wall-relief |
| [ ] | DP061 | solstice-circular-wall-piece | solstice-circular-wall-piece |
| [ ] | DP062 | tide-botanical-wall-panel | tide-botanical-wall-panel |
| [ ] | DP063 | mist-textured-wall-diptych | mist-textured-wall-diptych |
| [ ] | DP064 | verdure-large-wall-disc | verdure-large-wall-disc |
| [ ] | DP065 | contour-flow-wall-relief | contour-flow-wall-relief |
| [ ] | DP066 | amber-veil-wall-panel | amber-veil-wall-panel |
| [ ] | DP067 | stonewave-oversized-wall-art | stonewave-oversized-wall-art |
| [ ] | DP068 | rivergrid-architectural-wall-set | rivergrid-architectural-wall-set |
| [ ] | DP070 | parametric-floor-vessel | parametric-floor-vessel |
| [ ] | DP071 | cast-architectural-study | cast-architectural-study |
| [ ] | DP072 | form-study-i-sculpture | form-study-i-sculpture |
| [ ] | DP073 | form-study-ii-sculpture | form-study-ii-sculpture |
| [ ] | DP074 | material-column-sculpture | material-column-sculpture |
| [ ] | DP075 | form-study-iii-sculpture | form-study-iii-sculpture |
| [ ] | DP076 | arc-freestanding-resin-sculpture | arc-freestanding-resin-sculpture |
| [ ] | DP078 | canopy-room-divider-concept | canopy-room-divider-concept |
| [ ] | DP079 | monsoon-feature-wall-concept | monsoon-feature-wall-concept |
| [ ] | DP080 | grove-resin-and-wood-screen | grove-resin-and-wood-screen |
| [ ] | DP081 | contour-hospitality-table-installation | contour-hospitality-table-installation |
| [ ] | DP082 | stillwater-lobby-art-installation | stillwater-lobby-art-installation |
| [ ] | DP083 | bronzeleaf-display-plinth-set | bronzeleaf-display-plinth-set |
| [ ] | DP084 | tidal-architectural-panel-installation | tidal-architectural-panel-installation |
| [ ] | DP085 | vow-framed-varmala-keepsake | vow-framed-varmala-keepsake |
| [ ] | DP091 | hourglass-floral-wall-clock | hourglass-floral-wall-clock |
| [ ] | DP095 | union-engagement-tray | union-engagement-tray |
| [ ] | DP099 | letterlight-invitation-frame | letterlight-invitation-frame |
| [ ] | DP103 | threshold-family-nameplate | threshold-family-nameplate |
| [ ] | DP107 | first-chapter-baby-keepsake | first-chapter-baby-keepsake |
| [ ] | DP086 | forever-solid-block-varmala-keepsake | forever-solid-block-varmala-keepsake |
| [ ] | DP087 | petal-story-bouquet-frame | petal-story-bouquet-frame |
| [ ] | DP088 | meadow-wedding-flower-disc | meadow-wedding-flower-disc |
| [ ] | DP089 | aster-single-bloom-keepsake | aster-single-bloom-keepsake |
| [ ] | DP090 | memory-garden-flower-shadowbox | memory-garden-flower-shadowbox |
| [ ] | DP092 | petal-hour-round-clock | petal-hour-round-clock |
| [ ] | DP093 | evergreen-botanical-desk-clock | evergreen-botanical-desk-clock |
| [ ] | DP094 | moment-preserved-flower-clock | moment-preserved-flower-clock |
| [ ] | DP096 | promise-ring-platter | promise-ring-platter |
| [ ] | DP097 | gather-celebration-tray | gather-celebration-tray |
| [ ] | DP098 | bloom-paired-ring-dishes | bloom-paired-ring-dishes |
| [ ] | DP100 | our-chapter-wedding-card-block | our-chapter-wedding-card-block |
| [ ] | DP101 | together-couple-memory-frame | together-couple-memory-frame |
| [ ] | DP102 | anniversary-story-display | anniversary-story-display |
| [ ] | DP104 | welcome-botanical-nameplate | welcome-botanical-nameplate |
| [ ] | DP105 | blessing-pooja-display | blessing-pooja-display |
| [ ] | DP106 | festival-memory-plaque | festival-memory-plaque |
| [ ] | DP108 | little-bloom-memory-frame | little-bloom-memory-frame |
| [ ] | DP109 | botanical-resin-pendant | botanical-resin-pendant |
| [ ] | DP111 | thread-of-light-resin-rakhi | thread-of-light-resin-rakhi |
| [ ] | DP112 | initial-story-keychain | initial-story-keychain |
| [ ] | DP113 | chaptermark-flower-bookmark | chaptermark-flower-bookmark |
| [ ] | DP114 | everyday-resin-coaster-set | everyday-resin-coaster-set |
| [ ] | DP120 | little-archive-keepsake-box | little-archive-keepsake-box |
| [ ] | DP110 | petal-drop-earrings | petal-drop-earrings |
| [ ] | DP115 | palm-mini-serving-tray | palm-mini-serving-tray |
| [ ] | DP116 | still-form-catch-all-bowl | still-form-catch-all-bowl |
| [ ] | DP117 | twinleaf-mini-bookends | twinleaf-mini-bookends |
| [ ] | DP118 | pocketworld-paperweight | pocketworld-paperweight |
| [ ] | DP119 | promise-mini-ring-dish | promise-mini-ring-dish |

### Article instances — P19

| Check | ID | Article slug |
|---|---|---|
| [ ] | DB001 | a-room-begins-with-a-statement-table |
| [ ] | DB002 | reading-the-grain-wood-and-resin-in-a-shared-composition |
| [ ] | DB003 | round-oval-or-rectangular-a-dining-table-planning-notebook |
| [ ] | DB004 | coffee-tables-as-sculptural-objects |
| [ ] | DB005 | the-quiet-role-of-a-side-table |
| [ ] | DB006 | an-entryway-built-around-one-console |
| [ ] | DB007 | pairing-resin-art-with-warm-neutral-interiors |
| [ ] | DB008 | a-guide-to-describing-your-commission |
| [ ] | DB009 | what-to-include-in-an-architects-enquiry |
| [ ] | DB010 | wall-art-at-architectural-scale |
| [ ] | DB011 | from-a-mood-board-to-a-material-conversation |
| [ ] | DB012 | light-transparency-and-the-look-of-resin |
| [ ] | DB013 | chairs-benches-and-the-shape-of-a-room |
| [ ] | DB014 | planning-a-large-piece-for-delivery-access |
| [ ] | DB015 | why-a-visualization-is-not-a-final-specification |
| [ ] | DB016 | a-home-office-with-a-material-focal-point |
| [ ] | DB017 | a-small-vocabulary-of-finishes-and-forms |
| [ ] | DB018 | the-project-story-behind-a-collectible-interior |
| [ ] | DB019 | turning-a-wedding-memory-into-a-design-brief |
| [ ] | DB020 | choosing-a-format-for-a-bouquet-keepsake |
| [ ] | DB021 | names-and-dates-a-personalization-proofreading-checklist |
| [ ] | DB022 | designing-a-wedding-invitation-keepsake |
| [ ] | DB023 | a-preservation-clock-as-a-memory-object |
| [ ] | DB024 | before-you-send-sentimental-materials |
| [ ] | DB025 | a-family-nameplate-with-a-personal-story |
| [ ] | DB026 | photographs-privacy-and-memory-art |
| [ ] | DB027 | small-objects-with-a-personal-meaning |
| [ ] | DB028 | a-cohesive-gift-set-without-repeating-every-detail |
| [ ] | DB029 | personalized-resin-jewellery-preparing-your-brief |
| [ ] | DB030 | seasonal-gifting-without-the-marketplace-clutter |
| [ ] | DB031 | corporate-gifts-as-small-design-objects |
| [ ] | DB032 | choosing-initials-colours-and-a-short-message |
| [ ] | DB033 | inside-a-material-led-design-notebook |
| [ ] | DB034 | how-to-read-a-product-specification |
| [ ] | DB035 | preparing-a-clear-whatsapp-enquiry |
| [ ] | DB036 | from-draft-to-approved-design-a-client-checklist |

### Held fictional project instances — P28

Verify safe unpublished/404 behavior; do not publish these as actual work.

| Check | ID | Held project slug | Disposition |
|---|---|---|---|
| [ ] | DS001 | quiet-dining-room | Intentionally unpublished — fictional |
| [ ] | DS002 | room-around-an-open-centre | Intentionally unpublished — fictional |
| [ ] | DS003 | a-place-for-the-vows | Intentionally unpublished — fictional |
| [ ] | DS004 | a-workspace-with-room-to-think | Intentionally unpublished — fictional |
| [ ] | DS005 | an-arrival-in-one-line | Intentionally unpublished — fictional |
| [ ] | DS006 | a-wall-in-three-movements | Intentionally unpublished — fictional |
| [ ] | DS007 | an-open-screen | Intentionally unpublished — fictional |
| [ ] | DS008 | one-anniversary-one-gesture | Intentionally unpublished — fictional |
