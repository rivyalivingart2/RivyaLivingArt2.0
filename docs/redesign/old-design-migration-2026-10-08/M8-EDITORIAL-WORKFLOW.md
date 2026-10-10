# M8 — Editorial discovery, review and production register

Verified locally on 9 October 2026. M7 is the preceding local commit `467e157`. This phase adds the editorial workflow and planning register; it creates none of the 480 production entries.

## Public discovery

Journal, Portfolio, Testimonials and FAQs now use appropriate filters from saved metadata, URL state, applied chips, clear controls, real counts and 12-record pagination. Unknown combinations stay empty; missing metadata stays Unclassified. Journal supports topic, journey, format, tags and available language. Portfolio supports topic, journey, material, context, language and story classification. Testimonials support topic, journey, language and classification. FAQs support topic, journey and language. Curated order continues to use the independent M7 manifests. Filters never infer materials, projects, customer identity or review evidence. The mobile drawer has labelled controls, a close button, focus return and keyboard behavior from the existing dialog. Existing FAQ IDs and deep links remain valid across pages. Private saved-preview parameters survive filtering.

Available languages follow the existing complete, current translation-field review contract; publication and that field-review status do not certify native-reader approval. Full language and accessibility acceptance remains M10.

## Studio library and review

The six editorial workspaces and All content now request 25 compact summaries per page. Full drafts load only for the selected record. Server-bound filters cover text, area, publication, category, journey, recorded author/source, translation presence, updated dates in IST, missing fields and review queues. Ordering is stable with a record-ID tie-breaker. List facets are bounded to 200 values. Other existing specialist workspaces retain their existing read contracts.

Returning to the library preserves filters. Reapplying the same filters reloads safely; loading hides stale rows and failed loads offer Retry. Browser Back cannot discard an unsaved or saving editor. The explicit return control asks about discarding unsaved changes. Existing conflict recovery and administrator-only publication remain intact.

Optional discovery metadata is separate from private source/author/duplicate/verification notes. Author, meaning and native-reader reviews each record a named reviewer, actual date, evidence location and exact text fingerprint; subsequent text changes show stale evidence. Recorded evidence is readable in the editor. No review is automatically entered. List review queues mean evidence is absent (English for the native queue); currentness is assessed in the opened record. A possible-duplicate flag blocks publication while retaining the prior public revision. Private review/source notes never enter public cards or pages.

## New-only intake and register

Authenticated intake accepts 1–10 new documents after a read-only dry run. The ten-minute token binds the exact batch and actor. Changed or expired batches, existing IDs/routes/normalized titles, source-template collisions and repeated creates are rejected. One statement inserts all new drafts with history/audit; it never updates existing records or publishes. Current content editing and deliberate publication remain the normal next steps. This is editorial draft intake; catalogue bulk ingestion remains excluded.

The JSON register, offline HTML viewer and new Studio Production register agree on 120 planned records per section and **0/480 production records created**. The planning review compared 93 saved local draft/public records and their titles/headings, including earlier synthetic QA rows; 18 overlapping Journal/FAQ proposals were replaced without modifying their existing matches. See `m8-register-reconciliation.json`. Full-text similarity and factual review of unwritten drafts remain M9.

Portfolio slots are explicitly labelled concept briefs and Testimonial slots explicitly labelled fictional samples under the owner's decision. No people, completed projects, quotes or ratings were created. Genuine claims still require real approved sources. Source/rights, matching Drive and Studio IDs, author/meaning/native/media review and publication fields remain open. The supplied Drive image register is preserved; no external upload occurred in M7/M8.

## Verification and boundaries

Final build, typecheck, targeted lint, 333 unit tests and 403 built-server checks pass. Five M8 API workflow groups cover authentication, bounded summaries/detail loading, invalid dates, truthful empty filters, dry-run no-write behavior, exact-batch/expiry/collision guards, unpublished intake, private-note projection, duplicate publication hold and 120-per-section counts. Existing M7 evidence records its seven workflow groups separately.

Browser checks covered selected-record loading, unsaved browser-Back protection, saving new QA metadata without publication, return to filtered results, repeated identical filtering, mobile drawer application/close focus, URL Back restoration, no horizontal overflow at 390px, a pre-existing FAQ anchor on page two, and the Production register's 120 Portfolio / 0-of-480 count. These are automated browser observations, not physical-device or human accessibility approval.

All 13 pre-M8 protected scopes match row-for-row. Additions are only four clearly synthetic isolated local content records and ten associated revisions. Existing products, text, drafts, translations, media/crops, business details and orders/history are unchanged. Private local receipts and screenshots stay ignored. `m8-evidence.json` records the application fingerprint and local evidence paths.

Stop before M9. No push, deployment, production activation, external message or production content publication was performed. Native-reader, human screen-reader, physical-device/printing, whole-page parity and hosted/field performance acceptance remain open. This completes the local engineering scope of M7/M8, not the full M0–M11 release.
