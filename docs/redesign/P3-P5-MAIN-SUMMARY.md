# P3–P5 main publication summary

## What changes

Studio could not yet connect reviewed editorial images, detailed public pages and day-to-day staff work consistently. This PR brings **all six unpublished P3–P5 implementation commits** onto the existing RivyaLivingArt2.0 base. Editors can assign reviewed images to page slots, work on detailed pages through saved previews and revision recovery, and move between inquiry lists and records without losing filters or typed drafts.

P0–P2 are already on main. This change adds P3, P4A–P4E and P5A–P5E plus their source documentation, acceptance summaries, release manifests and family/section dispositions. The additional publication record documents the owner's explicit instruction to push and merge through a detailed PR. It does not alter application code.

### P3 — editorial images and Studio assignment

- Add a separate authenticated editorial asset library: upload, decode/process, review, explicit administrator publication and private preview. JPEG/PNG/WebP validation checks 4 MiB input, minimum 320 px sides and 20 MP; metadata-free WebP derivatives use 640/960/1600 targets without enlargement and a 600 KB limit each.
- Preserve immutable originals in private storage. Only reviewed, published derivatives are publicly served through `/editorial/[id]`; private customer references remain separate. No asset delete/overwrite action can break saved history.
- Connect homepage hero, material/story sections, all three journeys and page/article headers/sections to independently assigned assets. Each usage has description, caption, desktop/mobile focus and aspect controls, using its owning document's versioned save/preview/publish/recover workflow.
- Add filename/description/Drive-ID search, review/use filters, provenance, dimensions, derivative sizes and exact page-slot usage links.
- Include the portable Drive review/release manifest: six visually reviewed subjects and nine isolated-QA assignments. Five new assets were ingested in QA; one exact existing approved detail was reused. These are disclosed visualizations, not evidence of real clients, staff or installations. No video or QA asset UUID becomes a default production assignment.

### P4 — detailed public pages and editing

- Restore detailed homepage composition through six additive chapter templates, shared published navigation and distinct entry journeys. The section register accounts for all 18 old homepage sections; unsupported business claims remain hidden/conditional.
- Register editable collection, search, commission and journal candidates. Saved previews and published pages use the same renderers, and the browse section remains available.
- Improve catalogue discovery with visible applied-filter chips, individual removal/reset, result counts, sort, page size/load more, stable order and browser-Back continuity that retains the exact saved-preview revision.
- Add a versioned, bounded 60-piece saved list with persistence, empty/unavailable handling and explicit storage-failure feedback. No account, contact data or old wishlist is imported.
- Add accessible save controls, product-gallery Arrow/Home/End navigation, enlarged-view Escape/focus return, clearer form steps and field-error focus. Preserve existing product facts, prices-on-request behavior, form schemas, private uploads, retry and saved-message semantics.
- Add 16 optional detailed chapter templates for Story, Process, Materials & care and Architects. Adding missing chapters is idempotent, retains existing copy/order/crops/translations and respects the existing 20-section capacity. New chapters start hidden for review.
- Add journal featured-story/topic/search/load-more controls and URL continuity, FAQ groups/search/anchors, publication-aware help links and custom pages under stable `/p/slug` addresses.
- Retain explicit draft → exact saved preview → publish → anonymous readback → revision recovery. Custom pages can be hidden without losing history. Cover/crop changes and source review remain destination-Studio publication steps; source notes are private.
- Reduce visible-document payload by excluding nested stored snapshots from public reads while retaining exact private-preview snapshots and rebuilding published references. **This improves payload size, but does not close the outstanding performance target.**

### P5 — Studio appearance and daily operations

- Apply the old Studio's obsidian/blue/champagne visual system to shared shell, grouped navigation, panels, tables, fields, tabs, dialogs, sign-in and supporting states. Add the role-aware keyboard page finder, desktop sidebar/rail and phone navigation across the 13 existing registered destinations.
- Show real scoped due/overdue/unassigned/failed-message work, bounded recent inquiry/editorial records and on-demand saved-record publication checks with exact destination links. Unknown/stale readiness is labelled; no dashboard count is invented.
- Put inquiry filters, dates, task, sort, paging, view, mobile stage and selected record into the URL. Keep the list mounted; return to its page, position and row focus. Preserve dirty drafts on Back and explain deliberate closing. Failed reads retain earlier rows.
- Use phone cards and a one-stage mobile board with keyboard/touch stage controls. Preserve confirmed-save behavior, stale-version rejection, reasons for backward/closed transitions, original answers/messages and append-only amendments/history.
- Fix date-only follow-up serialization across list, detail, overview and operations; add IST Today/+3/+7/+14 shortcuts. Add a printable saved-brief summary that excludes private images/editing controls and is clearly not an invoice.
- Keep manual entry within its existing name/brief contract, with review and idempotent retry; do not infer consent, attach a product or send a message.
- Add record identity/revision/publication/dirty/save states, initial-read retry, native record-switch confirmation and recoverable session/conflict handling. Existing catalogue records begin in protected review mode.
- Use the real public customization-field renderer for Studio preview, including types, conditions and limits; preview inputs cannot accidentally validate or submit the product-editing form. Existing product/form data stays unchanged.
- Add concrete staff role/account/session-impact review, read-only canonical contact references with copy controls and safe exact activity links. Preserve existing permissions, auth, export and retention contracts.
- Account for all 43 Studio families in a disposition register. Conditional, deferred and excluded families are **not** 43 newly activated modules.

## Verification

The final combined application source is `a06971bf17ebe26d989c3046789258b83687ae48`. Later PR preparation changes are documentation only. The recorded final checks were executed against this source before publication; they are not presented as GitHub Actions runs.

| Check | Recorded result |
|---|---|
| Final build / TypeScript | Passed |
| Final lint | 0 errors; 63 existing warnings |
| Final unit suite | 259 passed |
| Final preflight and built HTTP suite | 399 passed |
| P3 isolated workflows | 101 API assertions; actual upload/review/publish/crop/preview/recovery and derivative checks |
| P4A | 26 isolated lifecycle and 22 browser checks; all 18 homepage-section dispositions |
| P4B–E | 74 lifecycle, 27 final lifecycle/link and 34 readback assertions; 34 browser checks; 55 viewport samples; 99 internal href/anchor checks across 98 destinations |
| P5A | 22 API assertions, 19 browser checks and 21 layout samples |
| P5B–E | 58 workflow plus 16 final compiled API assertions, 21 browser checks and 14 added layout samples |
| Final browser console | No captured errors in the final compiled verification tab |
| Protected source/records | 1,886 protected whole files match P0 at final P5; 120 catalogue rows, 136 public-media rows and business settings match the phase baseline; pre-existing content/inquiry/order rows unchanged during P5 |

QA used the established isolated database, runtime role and private store. Synthetic inquiries/manual records were closed, test staff disabled and the test page hidden with audits/revisions retained. No customer message, production publication, export or retention deletion was performed. Source equality exceptions are explicit: read-only inquiry filters/history record IDs/calendar-date projections and reuse of the unchanged origin validator for equivalent loopback hosts; existing order POST and workspace mutation handlers remain unchanged.

## Protected scope and known limits

- Keep RivyaLivingArt2.0 as the base. No scraper work or old-product transfer. Preserve current product facts, forms, gallery associations, original files, approved contact values, drafts and historical evidence.
- **P4 T41/T61 performance acceptance remains open.** Local samples exceeded the loading target. This PR is not whole-site performance, accessibility or production-content acceptance.
- New-product media associations remain deferred. Genuine portfolio/testimonial content and reviewed language/legacy journeys retain their planned boundaries. P6–P8 are not implemented by this PR.
- Viewport emulation is not physical-device certification. Full service-retention/privacy/accessibility checks remain P7; the existing unavailable-retention state was recorded, not certified as operational success.
- Source includes manifests and additive templates, not automatic publication of the isolated QA documents/images. Use the destination's current drafts and published media; never copy QA UUID paths or private receipt URLs.
- `vercel.json` already enables Git deployment and is unchanged. The feature push may build Preview; merging main may trigger the existing production pipeline. This PR does not change hosting settings, indexing/intake flags, secrets or automatically publish Studio documents.

## Detailed records and recovery

- [Full changed-file register](P3-P5-CHANGE-REGISTER.md)
- [P3 closure](P3-CLOSURE.md), [asset review](p3-editorial-asset-review.json), [portable media release manifest](p3-editorial-release-manifest.json)
- [P4 closure](P4-CLOSURE.md), [homepage disposition](P4-HOME-SECTION-DISPOSITION.md), [all remaining section dispositions](P4-SECTION-DISPOSITION.md), [public-page release manifest](p4-public-pages-release.json)
- [P5 closure](P5-CLOSURE.md), [authenticated old/new comparison](P5-REFERENCE-COMPARISON.md), [43-family disposition](p5-family-coverage.csv), [final validation summary](p5-validation.json)
- [Owner publication decision](../decisions/2026-10-01-publish-p3-p5-main.md)

No schema migration or data rollback is required. Recover source by reverting the PR merge through a new reviewed commit, retaining earlier P0–P2 and saved data. Recover published content by restoring a historical version as a new draft, reviewing its exact preview and explicitly publishing; never reset databases or delete original assets/audit history.
