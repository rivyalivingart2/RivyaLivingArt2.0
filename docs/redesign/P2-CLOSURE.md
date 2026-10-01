# P2 completion — content editing and publication foundations

1 October 2026. **P2 implementation and isolated QA are complete. Production release is not included.** Continue from branch `codex/p2-homepage-workflow`; P0/P1 closure remains valid. This report supersedes pending P2 statements in earlier checkpoints. The detailed consolidated plan remains the design specification.

## Delivered

The existing content service now owns homepage chapters, page/article text, safe rich text, section media usages and shared website copy. Studio and public rendering use the same contracts. Draft saving, exact saved preview, deliberate administrator publication, independent anonymous verification and restoration into a new draft work across the homepage and registered editorial pages. No database migration, dependency installation, authentication replacement or product import was required.

Shared website copy is the registered internal document `page:site-copy`. Its 22 fields cover navigation/search labels, footer headings and brand statement, the skip link and homepage utility labels. They follow normal revisions and publication. Menu destinations and visibility remain in Navigation; phone/email values remain in Business settings. The internal copy record never becomes a public page or sitemap entry.

Page editors provide a searchable section outline, stable IDs, hide/show, keyboard reordering, rich paragraphs with bold/italic/internal links, attributed quotes, lists, contextual image/caption/crops and internal actions. FAQ controls add question groups and canonical policy links; process controls distinguish customer and making stages; materials add appearance, limitations, care and placement; policies accept a verified effective date. Staff source notes are omitted from public rendering and recommendation snapshots.

The homepage keeps its existing hero, journeys, curated product/article references, category order and editorial stories. An approved chapter-type picker adds hidden chapters with an explicit content-needed state. Product choices read existing published records. Before/After comparisons cover text, order, references and per-usage crop thumbnails. Blockers navigate to the relevant control; stale writes retain local work and show the saved/latest differences.

## Task acceptance

| Task | Result and evidence |
|---|---|
| T12 | Editorial usages have independent desktop/mobile crops, alt and caption; server-owned saved dependencies preserve the referenced public projection. No product-gallery or media-metadata writes. |
| T13 | Registered `page:home` drives published hero, sections and settings; source candidates never auto-publish. Existing home QA revisions 2–10 prove isolation and recovery. |
| T14 | `HomepageDocument`, `EditorialDocument` and `SectionBody` serve both private saved previews and public output. Visible typed sections retain stable anchors. |
| T16 | Authenticated full-width and mobile saved previews cover registered pages, durable new article IDs and shared copy; no-store/noindex, missing-revision and actual interrupted-frame recovery verified. |
| T17 | All 22 supported shared fields have one editor and an explicit ownership/render map in `P2-COPY-AND-FIELD-OWNERSHIP.md`. Published-only readers and localized fallbacks are connected. |
| T18 | Existing published product/article selection and display order stay editorial. Category presentation does not mutate taxonomy. Snapshot projections include existing prices and article reading content. |
| T26 | Versioned rich blocks persist with strict validation; supported marks, safe internal links, quotes and attribution render semantically. Raw HTML, executable URLs and malformed models are rejected. |
| T27 | Related products, articles, published images and destinations are validated against current public sources. An actual dependency withdrawal blocks publication atomically. |
| T31 | Expected-version conflicts retain local edits; compare and restore create new attributable drafts. Duplicate, stale, unsaved and forged publication attempts fail. Public verification can retry without republishing. |
| T50 | Existing public and old-Studio-inspired semantic tokens are reused. Responsive controls, visible focus, 16 px fields, 44 px action targets, announcements and still/reduced-motion paths form the shared foundation. |
| T52 | Every supported homepage field/slot has an owner and renderer mapping. The full lifecycle is verified. Conditional chapter ideas remain marked Content needed; full 18-section restoration is P4 under plan §34.1. |
| T58 | Page/copy/image-usage/revision editors share the active content lifecycle, saved/public labels, exact preview, crop comparison and explicit restoration. Focused FAQ/process/material controls use the same service. |

These results close the P2 foundation for W02/W30 and S12/S13/S25/S29/S31/S32/S33/S42. The detailed family specifications include later media, content and whole-site acceptance; this is not a claim that every P3–P8 requirement is already delivered.

## Executed verification

- 222 unit tests, 12 preflight checks and 386 built HTTP regression checks passed.
- Production build and TypeScript passed after the final editor-status repair and local-preview link guard. Full lint: zero errors, 67 existing warnings; changed subset: zero errors, 11 existing warnings; final five-file check: zero errors or warnings.
- 84 isolated API assertions covered process, FAQ, materials, a journal article and shared copy: editor save, server dependency capture, unchanged anonymous page before publish, exact private preview, admin publication, anonymous readback, restoration and preserved history. The earlier home lifecycle remains applicable.
- Actual browser checks covered retained local edits during a stale-version conflict, public verification failure followed by successful retry, rich saved preview, keyboard reorder/undo, skip-link focus, and preview interruption. Stopping the isolated server caused a real preview error; restarting it and choosing Retry loaded saved home revision 10. Missing revision 999999 also showed a truthful unavailable state.
- The editor role had no Publish control. Deactivating its temporary QA account caused a real 401 on Save: the unsaved title stayed in the editor and renewal guidance appeared. FAQ disclosure Enter and mobile-menu Enter/Escape with focus return passed. The temporary account was deactivated and its local credential file removed.
- Process, shared-copy and public FAQ layouts were measured at 320, 390, 768 and 1440 CSS px without page-level horizontal overflow. The existing mobile frame renders the real page at 390 px. These are desktop-browser viewport checks, not physical-device or screen-reader certification.
- Original-source fingerprint checks covered 1,889 protected files and the unchanged old repository. All catalogue, public-media and business-settings rows retained their QA baseline fingerprints.

Full machine-readable evidence, screenshots and logs are in workspace `outputs/P2/`, principally `Completion-API-QA.json`, `Completion-Browser-QA.json`, `Completion-Final-QA.json`, `Completion-Validation.json` and `P2-Completion-Report.md`.

## Preview and publication boundaries

Newly saved homepage/page revisions include server-captured public product/article/media references. The API discards client snapshots, captures dependencies itself and checks their fingerprints in the same publication statement. Only a saved, unchanged expected version may publish. Published pages resolve references against current published sources, so withdrawn material does not remain visible indefinitely.

Historical generic page revisions created before dependency snapshots retain their text and show an explicit current-dependency notice. Save again to capture references before publishing such a draft. Navigation, business contacts and the outer preview skip-link label use current published settings/copy; the saved shared-copy preview applies selected-revision labels to its real header/footer. Saved previews do not reconstruct old operational settings or claim to be historical site deployments.

Existing plain paragraphs remain valid. Rich text has a canonical plain-text projection for compatibility; translated paragraph overrides do not accidentally display English marks/body instead. Complete reviewed translation journeys remain P6. Source notes assist editorial review; they do not certify factual, legal or policy correctness.

The state gallery is authenticated, explicitly labelled synthetic, noindex and available only with isolated mode plus `RIVYA_P2_STATE_GALLERY=1`; production is refused. Its saved-preview selector uses the real revision endpoint, not a mock image or success simulation.

## Preserved scope and later phases

No scraper work, old-product transfer, product/factual/gallery/contact changes, automatic customer messaging, production writes, push, merge or deployment occurred. QA used the existing isolated database/runtime role and private store; credentials were not printed or copied into the repository. Temporary test staff are deactivated and their local credential file removed after the checks; audit and revision history remain.

P3 owns the supplied Drive review, optimized derivatives and complete image-assignment workspace. P4 restores the full approved detailed-page section set, including the 18 possible homepage chapters; genuine projects/testimonials/workshops require real business content. P5 extends the Studio appearance throughout the remaining operational screens. P6 completes reviewed languages/legacy URLs; P7 covers whole-site accessibility, physical devices and measured performance; P8 prepares the concrete production release. Unsupplied postal/registration facts remain content gaps. P2 completion does not make those future gates complete.
