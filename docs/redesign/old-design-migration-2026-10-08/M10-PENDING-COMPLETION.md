# M10 pending-work follow-up — 12 October 2026

## Implemented and verified

Content Health and Content Gaps now render 25 records per page in both their desktop table and mobile cards. Previously the 873-record QA dataset rendered all 873 records in each representation. Filtering and summary totals still consider the complete dataset; changing or clearing a filter returns to page 1. The last page, empty result and retry states remain usable. This changes presentation only, not validation, publication or stored records.

Studio workspace headings now use the display serif seen in the old Studio. Summary cards adapt to the available width, avoiding broken labels such as Testimonials. Current revision-aware editors and larger controls remain intact.

Candidate: `codex/m10-pending-completion`, based on `a97c771ad95f609dd2a7de010b52d767a1d326b5`. Application fingerprint: `1ef8bfa429bd27a3964b55e359cc4d1691e86d9eb6a60a3b11339a267f5dc24b`. This includes the previous loading and image-contrast commits. See `M10-LOADING-PERFORMANCE.md` and `M10-VISUAL-CONTRAST.md` for their exact scope and historical evidence.

## Fresh verification

- Production build and TypeScript: pass; 344 unit and 403 built-server tests pass. Lint: zero errors, 62 existing warnings.
- Ten focused accessibility scans: zero confirmed violations. Views include Content Lab, Content Health, Content Gaps, unsaved new Journal editor at 390/1280, a saved Journal editor and the health-check error state.
- The scanner's 74 additional unique manual contrast targets have explicit calculated dispositions: all pass, minimum **6.2472407118:1**. These cover gradient metrics, pagination and clipped desktop table text/links. They are not falsely reported as zero scanner-incomplete items. Raw computed styles and the WCAG calculation inputs are retained.
- Pagination: first/second/last pages, query from page 2, entity-filter reset, zero results and clear-to-first-page all verified through the real UI. Mobile first-page height is 8,934px versus 268,937px before pagination, on the same 390px-wide dataset. Rows and cards each fall from 873 to 25.
- A simulated local network interruption displays an error and labels prior results potentially stale. A recheck restores completed status and the same 873-record total. Network emulation was restored immediately.
- A new article remains unsaved at revision 0, with publication disabled. Its blocker link moves focus to the Introduction textarea. The saved editor provides exact saved-preview and public-revision links. No content was saved.
- Every original ID, row digest and count matches before/after in all 13 local protected scopes. A fresh read-only production baseline was captured before release; production verification remains a separate step.

## Visual comparison progress

All **seven previously missing public opening pairs** were captured and inspected at desktop and mobile widths: Journal, Portfolio, Saved Pieces, Privacy, Terms, Workshops and the unavailable receipt. Old Media Library and Research were recaptured reliably at both widths, replacing the two rejected reference captures from the preceding review. Some old-page commands timed out before the final page loaded; final URL, heading and rendered state were checked before capture.

The comparison records these adaptations rather than silently treating them as pixel parity:

| Surface | Current implementation and observed difference |
|---|---|
| Journal | Current editorial introduction and metadata filters remain; old opening used topic chips and different spacing. |
| Portfolio | Current text-led introduction keeps concept disclosures. The old image-led opening has no projects in its reference database, so it supplies no populated-detail comparison evidence. |
| Privacy and Terms | Both have serif headings, document navigation and reading sections. Current approved wording, retention, contacts and unrecorded effective dates are preserved; old policy claims and blue section bands are not copied. |
| Saved pieces | Current browser-local idea collection retains its own empty-state explanation and separate saved-brief semantics. |
| Workshops | Current 410/unlisted offering guard remains because availability lacks business confirmation. The reference advertising page cannot establish current availability. |
| Receipt | Current unavailable/expired state preserves private receipt authorization and manual contact; it does not expose or fabricate an order. |
| Media and Research | Current provenance and revision-aware workflows differ from the old upload library and independent notes model. No old database or products were transferred. |

The new pairs extend opening coverage to 15 public pairs and replace both unreliable references among the 30 Studio opening pairs. They **do not complete every section, scroll, child/editor/print state or visual variant** in the 85-template/74-section registers. Keep those acceptance rows partial. No old/current match is inferred from an empty reference dataset.

Screenshot capture used a 720px viewport height after detecting duplicated paint below the browser surface in 800px captures. Rejected screenshot variants are not acceptance evidence. DOM geometry and final 720px screenshots agree. Raw authenticated captures remain ignored, outside Git.

## Release and remaining gates

The owner requested all pending work, following explicit instructions to push through a detailed PR into main and complete M10/M11. Continue that authorized release for this verified candidate. Earlier generated local-only follow-up notes do not revoke the owner's release instruction. At the time this report was prepared, no push or deployment of this candidate had occurred; append the actual PR/main/deployment receipt after verification.

Do not replay the 480 published entries or homepage revision 4. No schema, protected content, translations, media associations/crops, contact/business details, drafts or order-record change is included. Scrapers, old-product transfers and backups remain excluded.

Still requiring actual evidence: full section and child-state comparison; native 200%/400% browser zoom; real screen-reader and physical-phone tasks; independent Hindi/Gujarati review; factual/media-rights confirmation; exact-candidate hosted performance followed by field p75 and a consent-safe genuine inquiry. Browser automation does not certify these human/device/field gates. The old reference is now reachable, albeit slow; it should not be described as a continuing blanket blocker.

Sanitized evidence: `m10-pending-evidence.json`. Private evidence: `test-results/old-design-migration/m10-pending/`; build/unit/runtime/lint logs use the `m10-pending-` prefix. Protection snapshots use `local-m10-pending-{before,after}` and `live-read-only-m10-pending-release-before`. Recovery is a reviewed Git revert of these presentation/performance changes; no database or content rollback is required or authorized.
