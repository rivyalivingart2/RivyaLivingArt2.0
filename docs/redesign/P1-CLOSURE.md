# P0 and P1 implementation closure

1 October 2026. **P0 baseline complete. P1 implementation and isolated QA complete. Production release remains the separate P8 gate.** The owner requested completion of P0/P1 before continuing P2. This report supersedes earlier pending QA statements, without turning historical tests into production acceptance.

## P0 confirmation

The baseline covers 66 tasks, 79 page/Studio families, 136 template paths, 74 detailed old-site sections and 2,943 source fingerprints. The existing new catalogue remains the authority. No scraper work or old-product transfer. A fresh comparison confirms all 1,889 protected source files, original assets and old-repository files still match P0. Isolated QA is bound to `rivya_qa_20260924`, runtime role `rivya_qa_runtime_20260924`, private store `store_maHrpDDHXPR93N0w`; no schema or storage changes were needed.

## P1 acceptance

| Task | Completed result and evidence |
|---|---|
| T02 Imprint | Existing record remains `page:imprint`. Confirmed business name/location and canonical settings supply the factual content and contact links. Definition-list contacts use settings without changing them. Authenticated saved preview uses the actual public renderer at desktop and mobile widths. Editor saved QA revision 3; recovery of revision 2 created draft 4, preserved the public revision, and published factual revision 5. Anonymous route, metadata, policy crosslinks and actual footer navigation passed. |
| T03 Content health | Real administrator and editor sessions reach the route and exact-record links. Editor UI omits administrator modules and publication controls; server rejects publish/hide/settings writes. |
| T04 Registry | One typed registry retains explicit aliases and exhaustive dispatch. Authenticated route/alias checks and unit tests pass; unsupported destinations remain deliberate unavailable/not-found outcomes. |
| T05 Skip navigation | One public skip control; keyboard Enter moves focus to `main-content` on the connected public renderer. |
| T06 Customer wording | Terms QA revision 3 now explains that Place Order saves the requirements and WhatsApp requires the customer's Send action. Only the intended opening paragraph was updated; other terms and all submission behavior remain intact. Home/form/product/receipt source improvements were retained. |
| T07 IST presets | Browser: Today 1 Oct–1 Oct; 7 days 25 Sept–1 Oct; 30 days 2 Sept–1 Oct. Unit cases cover IST midnight, year change and leap day. No private export was generated. |
| T08 Truthful states | Publication and readiness remain separate; existing unknown/retry failure handling and source-candidate tests pass. Live health shows 301 records without inferring publication from readiness. |
| T09 Exact record navigation | Record, tab and field focus, browser back/forward, missing-record warning and catalogue record beyond the first page verified. New inline keep/discard controls replace native record-switch confirmations. Keep/Escape preserve unsaved content, product and media edits; explicit discard switches. No product or media save was performed. |

## Validation

- 208 unit checks, 12 preflight checks and 386 built HTTP regressions passed.
- Production build and TypeScript passed. Lint: zero errors, 67 existing warnings.
- 27 final persisted/API checks passed, including real editor role, restored revision history, private preview and stale-write rejection.
- Mobile preview identifies its actual loaded saved revision. Private previews are authenticated, private/no-store and noindex; public pages read published content.
- Every QA catalogue, public-media and business-settings row matches the pre-work fingerprint. All 1,889 protected source files match P0.
- The temporary isolated QA editor was deactivated after verification; its audit history remains. Local temporary credentials were removed. No secrets were committed.

The mutation test stopped after publication because one assertion expected “Save order” while the approved text says “Place Order”. A read-only audit verified the persisted wording and history; mutations were not repeated. An audit expectation was also corrected to the existing `draft:restore:2` operation label. Neither issue required changing application behavior.

## Detailed Content health completion

The final specification cross-check added the full S19 diagnostic view before final closure: separate validation, editorial-review, draft, publication, media and translation columns; entity, blocker/advisory, search and saved-editor filters; removable filter chips; manual recheck; and grouped mobile record cards with blockers first. Checks cover public links to unpublished pages/articles/pieces, unsupported navigation destinations, repeated editorial covers, missing mobile crops, missing published media metadata, per-language field coverage and unchanged translations after English draft changes. Exact chapter links open/focus the homepage chapter; navigation repairs identify the menu and destination field.

Health context is read through an authenticated, private/no-store endpoint. Both roles passed; anonymous access is denied. Interrupted context loading removes the table and displays Unknown until retry succeeds. No review approval is inferred. Assigned ownership and review timestamps are not stored; the UI explicitly says its owner filter uses the last saved editor, editorial approval is unrecorded, and translation freshness is unrecorded except where the current draft proves a source change. These limitations are visible rather than invented statuses.

Browser evidence: 301 records; Content + Advisory + process gives one result; repair focuses `content-field-image`; homepage material repair focuses `content-field-section-material`; 390 px and 320 px grouped views have no page overflow. The temporary QA editor used to verify the new endpoint was also deactivated; its credentials were removed.

Final combined source: 215 unit checks, 12 retained preflight checks and 386 HTTP regressions passed. Full lint had zero errors/67 existing warnings; the later changed-component lint had zero errors/8 existing warnings. Production build/TypeScript passed. The new preview/read-only checks add 21 successful assertions across five families and both roles. No product/media/contact data changed.

## Release and content boundary

No production content write, GitHub push, merge or deployment. The exact factual Imprint and terms records are retained in the local `Closure-API-QA.json` release evidence. At P8, compare current production versions and review those two payloads individually before publication; do not replay QA scripts or overwrite later owner edits.

Full postal address and any applicable registration identifiers remain unsupplied business facts. The implemented Imprint uses only recorded facts and does not assert legal completeness. These are explicit release/content gaps, not invented values. Full device, translation, accessibility and performance certification belongs to the later phases.

## Continue with P2

The existing homepage draft → real preview → publish → anonymous verification → revision recovery workflow remains intact. Extend real saved previews to other editable pages and articles next, while keeping global navigation, contact settings and related published content clearly identified as current dependencies. Global/interface copy, richer structured text, detailed blocker navigation and broader P2 states remain to finish. P3–P8 are not started.
