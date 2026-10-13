# Phase 4 — remaining public pages ready for owner review

Date: 13 October 2026. Branch: `codex/redesign-phase4-public-pages`. Parent: Phase 3 `2a3c9a3`.

The owner approved Phase 3 and authorized Phase 4 only. All remaining public page families now extend the approved material-gallery direction. Implementation is local. **Stop before Phase 5 until the owner reviews these previews and explicitly authorizes it.**

## Review the result

[Local review gallery](http://127.0.0.1:4181/review) contains desktop and phone screenshots, real local routes and clearly labelled fixtures.

- [Collections](http://127.0.0.1:4199/collectible-design), [product](http://127.0.0.1:4199/pieces/amber-veil-wall-panel), [Journal](http://127.0.0.1:4199/journal).
- [Commission brief](http://127.0.0.1:4199/commission/customize), [story](http://127.0.0.1:4199/our-story), [policies](http://127.0.0.1:4199/privacy).
- [All 16 landing-block specimens](http://127.0.0.1:4181/landing). Static specimens do not hydrate controls, publish records or submit orders.

Restart/reproduction: `experiments/redesign-phase4/README.md`. Loopback servers may need restarting in a later session.

## Implemented coverage

| Family | Phase 4 presentation and evidence |
| --- | --- |
| Collections, search and commission entry points | Two-column introductions, ocean browsing surfaces, preserved search/filter/pagination links, larger original imagery and honest empty states. Memory/personal/collectible paths and aliases included. |
| Product, gallery, customization and saved pieces | Large image/detail composition, original crop attributes, native enlargement with Escape/focus return, shortlist, form steps and validation. |
| Inquiry and receipt | Preserved prepare/contact/review flow, explicit save and manual WhatsApp handoff. Unavailable public receipt and synthetic ready/recovery receipt fixtures. No inquiry submitted. |
| Story, process, architects, materials/care | Existing section order/content, consistent chapter hierarchy, image treatments, bounded reading measures and optional media. |
| Journal, Portfolio, Testimonials and FAQs | Archive/filter/card/pagination layouts, detail templates, retained concept/fictional disclosures, FAQ expansion and mobile filter dialog. Populated fixtures cover missing local published examples. |
| Contact and policies | Contact routes, ivory reading surfaces, contents links, visible keyboard focus and six policy print PDFs. |
| Custom landing pages | All 16 existing block types, including populated image CTA, product grid, video story, bento and testimonial grid specimens. |
| Utility states | Loading, empty results, unavailable/error/root error, alias destinations, disabled controls, receipt recovery and local session-rate-limit fallback. |

The shared `public-pages.module.css` is explicitly enabled through `publicDesign` on public bodies. Homepage body styling remains Phase 3. Studio editor/preview bodies remain outside this scope; Phase 5 must deliberately reconcile public previews.

Main palette, original logo, fonts and all original wording remain. Existing images/video and crops are reused; no asset reassignment. Hover-capable devices receive restrained image movement when reduced motion is off. Forms and reading stay static. Native scrolling/smooth anchors continue. No new dependency or animation runtime was added.

## Validation

| Check | Result and scope |
| --- | --- |
| Build, types and lint | Final Next production build/TypeScript and focused changed-source/tool lint pass. |
| Existing regression | 344 unit and 403 HTTP runtime checks pass. These preceded the final two CSS-only fixes; final build/browser receipts cover those corrections. |
| Built browser routes | 30 representative routes at 1440/768/390/320. Initial full run: 570 passes. Final run: 569 raw passes plus one runtime form-state difference, reconciled below. |
| Static fixtures | 100 checks across 10 families/four widths, all pass. Presentation evidence, not hydrated workflow or persistence tests. |
| Interactions/contrast | 64 checks and 163 sampled text contrasts pass: search, shortlist, gallery, filters, FAQ, language layout, validation, unsaved review and print. |
| Review fixes | 20 computed checks pass: dark labels 10.59:1; ivory focus 7.96:1; dark form focus 7.46:1; focus against adjacent ocean filter panel 5.75:1. |
| Media/handoff | Gallery thumbnails load. Existing film starts paused, plays after deliberate button click and pauses. Representative images load after full scrolling. |
| Captures/print | 156 PNG files and six policy PDFs, hashes in receipt. Browser PDFs are not physical printer observations. |
| Independent review | Full review found F1/F2; reviewer then returned **ship at fix-list scope**, both resolved. See `PHASE-4-INDEPENDENT-REVIEW.md`. |
| Design documentation | Ordinary extension; incumbent design files preserved. See `PHASE-4-DESIGN-DOCUMENTATION.md`. |

Repeated local form openings reached the existing 40-per-hour session limit. The final product-customizer capture shows the existing unavailability notice, retry message and Reconnect button instead of the ready message. The raw failed comparison is retained. A supplemental comparison removes only those listed runtime labels and confirms the remaining text, links and media match Phase 3. Final controls accurately show disabled saving; preparation/review remain usable. No protection was weakened, inquiry submitted or message sent.

## Preservation and route accounting

All 13 protected table digests match before/final: **1,641 rows unchanged**, including products, content, media, revisions, business settings and inventoried orders/inquiries. This does not cover every table. Normal local form-session/rate-limit bookkeeping is outside this snapshot; browser form visits are not zero database traffic.

No Phase 4 edits to original public/logo/media files, lib models, APIs, dependency manifests or publication logic. No production/Studio/Drive record changes, publication, push, PR or deployment.

**665 URLs** have local HTTP coverage: 185 available and 480 newer editorial URLs remain unpublished drafts in this older QA database. Status/redirect destinations match baseline. Those 480 are not live-site outages or a publication task. Four coarse streamed-HTML hashes differ through serialization/extraction; resolved representative browser DOM provides preservation evidence. This is not individual visual acceptance of 665 pages.

## Limits and next boundary

Impeccable context/detector launchers failed with Windows `cache_directory_failed`; no hook pass. Browser emulation/static fixtures do not certify physical phones, screen readers, independent Hindi/Gujarati meaning, media rights or field performance. Existing administrative closures are not rewritten as new tests.

Phase 4 is ready for owner review. Phase 5 has not begun. After approval, Phase 5 covers Studio content/editing and preview parity. Any later release needs explicit authorization, detailed PR into main and exact deployment verification. Do not replay historical M0–M11 publications. Scrapers, old-product transfers and backups remain excluded.
