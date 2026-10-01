# Latest acceptance — P0/P1 closed; continue P2

1 October 2026. The owner explicitly requested completion of P0/P1 before P2. P0 baseline and P1 implementation/isolated acceptance are complete; see [P1 closure](P1-CLOSURE.md). Production release is still the P8 gate. Preserve all protected products, media, contacts and scraper behavior; transfer no old products. Earlier pending editor-role, Imprint, terms, keyboard and record-switch QA statements below are superseded by that report.

---

# 1 October 2026 follow-through

P2 continuation located and verified the existing isolated QA resources. Authenticated Content health and its homepage record link passed. The factual Imprint was saved and published only in isolated QA, then checked anonymously and through the actual footer. Homepage save/preview/publish/recovery and inline recovery cancellation were exercised with real persistence. Production publication, editor-account coverage and the remaining P1 checks are not all complete. Continue from [P2-HOMEPAGE-CHECKPOINT.md](P2-HOMEPAGE-CHECKPOINT.md); the dated P1 record below preserves the earlier evidence.

---

# P1 implementation checkpoint

30 September 2026. **Source implemented and locally checked; integrated QA and publication remain pending.**

Branch: `codex/p1-studio-foundations`. Base: `7569bbf720e73c5fee0117618a702b297af116de`. Current authority: [30 September owner decision](../decisions/2026-09-30-p1-foundations.md).

## Delivered changes

| Task | Implementation | Verification and remaining work |
|---|---|---|
| T02 | Corrected the existing `page:imprint` candidate’s escaped text, retained recorded owner/location, and added the owner-confirmed new-site phone/email. It remains one record and uses the existing draft/publish/revision API. | Source validates; exact record opens in the local fixture editor. No live draft save or publication. Isolated publish/public-read/recovery and later authorized public/footer verification remain pending. |
| T03 | Content health is registered and accepted by the authenticated Studio route. | Registry checks and local administrator/editor display passed. Actual authenticated QA route test remains pending. |
| T04 | One typed module registry drives navigation and route admission; TypeScript requires a renderer and icon for every registered module. Existing supported aliases are explicit, including `enquiries` to `inquiries`. | Registry uniqueness/aliases passed. Unsupported modules and extra path segments now produce deliberate not-found outcomes after authentication instead of opening unrelated lists. Legacy record URLs are not silently treated as valid records. |
| T05 | Removed the public ShopFrame’s duplicate skip link; the localized root skip link still targets the focusable main region. | Source reviewed; one root skip control observed in local Studio. Full public keyboard journey awaits connected QA. |
| T06 | Updated homepage, product help, customization review and saved receipt wording to explain saving a brief for the atelier. The terms source candidate uses the same wording. Manual Open/Copy and customer Send remain explicit. | No request/receipt/API behavior changed. Already-published terms text needs separate reviewed content publication; source edits do not overwrite the database. |
| T07 | Today, Last 7 days and Last 30 days use inclusive IST calendar ranges. | Unit checks cover IST midnight, year rollover and leap day. Browser buttons selected 30 Sept–30 Sept, 24 Sept–30 Sept, and 1 Sept–30 Sept respectively. No export was generated. |
| T08 | Health and editor lists distinguish Published, Hidden, Unpublished, Source candidate, Unpublished draft, Changes pending and Aligned. Editorial results say “No issues flagged,” never imply approval. | Readiness/publication tests passed. Failed/incomplete loads show unknown status and retry without false zero totals. Editorial media without product associations is not automatically an error. |
| T09 | Health links encode the exact record, editor tab and first flagged field. The editor selects the record, clears hiding filters, focuses the field, and catalogue selection opens the correct pagination page. Missing records show a clear notice. | Local browser verified Imprint title, product Story tab, media description, missing record, no automatic dirty state, and reload. A 120-product fixture opened DP096 on page 5 of 6. Native confirmation-dialog cancellation was not reliably verifiable through the browser tool and remains pending. |

## Local checks and evidence limits

- Runtime: Node 22.23.2, npm 10.9.2, existing lockfile; no dependency changes.
- Unit checks: **199/199 passed**, including 9 new P1 checks.
- Preflight: **12/12 passed**.
- Lint: **0 errors, 68 existing warnings** across the repository; final changed-component recheck has only the pre-existing unused `Search` import warning.
- Type generation and TypeScript: passed; final production build passed with **46 generated static entries**. This count is not a count of fully exercised pages.
- HTTP regression suite: **386/386 passed** against built source with database, Blob and login credentials explicitly blank. It verifies fail-closed/publication/auth boundaries, not successful database publishing.
- Browser: temporary localhost fixtures exercised the actual Workspace, health and editor components. Administrator/editor navigation, failed-load presentation, exact fields, catalogue pagination/reload and IST buttons passed. No browser error logs were observed on the final check. Existing media preview emitted an image-priority advisory.
- Mobile: at a 390 × 844 viewport (375 px content area with scrollbar), page width stayed 375 px; the 880 px table scrolled inside a 305 px labelled, keyboard-focusable region. Status labels and review links were adjusted after visual inspection to avoid breaking into letters.
- The fixture route and its client response stubs were removed, the dev server stopped, generated dev types cleared, and the final production build contains **no `p1-ui-check` route**. No test sign-in, fake persistence or production auth bypass was added to the deliverable.
- A Windows sandbox limitation prevented the TypeScript test runner reading OS user information. These local tests passed when run with the approved process permission; no application workaround was introduced.

## Protected data and release boundary

No live API writes, publication, product transfer, scraper action, migration, contact-settings update or deployment occurred. Existing product/media source files and asset bytes are compared with P0 in the saved protection report. P0 live fingerprints remain the live baseline, not a new final database equality check. The old repository remains unchanged. No secrets were retrieved, printed or committed.

The full postal address and any applicable registration details have not been supplied in this phase. The Imprint candidate uses only the already-recorded name/location and newly confirmed contacts; it does not claim completeness of legal disclosures.

## Remaining acceptance steps

1. Verify the existing isolated QA database and storage bindings, with independent credentials. No usable QA environment file or binding was available in this checkout. Do not substitute the shared live database.
2. Check authenticated administrator/editor access, deep-link back/forward behavior and confirmation cancellation in QA. Recheck public keyboard skip navigation on connected pages.
3. Save and publish only the intended Imprint candidate in isolated QA; check the actual public renderer and footer, restore an earlier revision into a new draft, and verify version/conflict behavior. Existing publication and revision APIs were retained, not rewritten or claimed newly verified.
4. Prepare exact reviewed Imprint/terms revisions and source deployment for the plan’s later release authorization. After release, verify direct/footer routes and repeat protected live fingerprints. No bulk publication or historical reseeding.

P1 therefore has implemented source and substantial local evidence, **not production acceptance**. P2 remains unstarted and requires its phase instruction. Continue from this checkpoint rather than the historical Midnight atelier branch or old testing hold.
