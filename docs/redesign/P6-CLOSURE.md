# P6 closure — legacy features, languages and old URLs

3 October 2026. **P6A–P6E implementation and isolated QA are complete for the included scope. Four conditional tasks remain inactive, with reasons recorded below.** This is local engineering completion, not a claim that every business document has a reviewed translation or that production has been updated. P4 T41/T61 performance acceptance and P7/P8 remain open.

Branch: `codex/p6-legacy-language-journeys`, based on main `c94427de88d45a216fdf545840efef2f875e5789`. P6A is saved in `56aca73`; this closure accompanies P6B–P6E. No push, PR, deployment, production publication, hosting change or indexing activation occurred.

## What works

### P6A — destinations and diagnostics

The reviewed registry contains 19 route patterns and seven single-hop 308 redirects. Unsupported filters receive an explicit reset notice. Receipt/wishlist retirements use 410; unknown identities and unverified services receive useful 404/retirement responses. Old receipt tokens never reach the new inquiry handler, HTML or redirect destination. Compatibility responses are private, no-store, noindex and no-referrer. Administrator-only Studio diagnostics show current source availability, routes, publication and categories. Canonical metadata uses the existing final www host; indexing stays held.

### P6B — language journeys and governed editorial review

English, Hindi and Gujarati are the public interface choices, subject to the saved enablement settings. Other configured languages are held from the public switcher without rewriting settings. Navigation labels use reviewed source/target pairs or the shipped priority-language labels. Switching retains the current route/search context; mobile navigation retains its existing layout. Search/filter controls, saved-piece actions, form steps, contact validation, consent presentation, upload states, saved-receipt instructions and recovery controls have priority-language copy. Product names, options, prices, identifiers, contact values, submitted answers and the persisted outgoing message keep source values.

Studio → Language review (`/studio/translations`) loads actual draft/public records, filled/missing counts, search and review-state filters. Exact record/language links open the editor. Page, article, shared-copy and nested homepage text use the same translation editor, including actions and image descriptions. Review is bound to the current source and translated values; changing either invalidates it. Incomplete, unreviewed or stale editorial documents display the whole English source. A public notice explains the fallback. Existing legacy translations remain stored; they are not silently certified.

Saved translation previews use the exact authenticated revision and requested locale. An isolated bilingual document passed draft → preview → publish → anonymous verification → source-change fallback → stale-save conflict → history recovery as a new draft → republish. Editors can review/save; server publication remains administrator-only. Homepage review includes nested text while URLs, products, snapshots, crops and identifiers are excluded from translation writes.

Old prefixes for nine previously configured languages resolve only known public paths. English/Hindi/Gujarati preferences are retained when enabled; other languages use English. Redirects are temporary 307, not a new locale SEO scheme. Unknown article/product/private paths remain 404. Only bounded supported discovery parameters survive.

### P6C — category and import presentation

Studio → Old links & publication now exposes exact stored category keys, published-piece counts, collection membership, exact catalogue-record links and normalization conflicts. The existing model stores category strings, not a separate category-ID table. Collection aliases are labelled as collection intent, never product/category identity or a migration proposal.

The supported import is editorial translation text only: paste JSON → dry run → inspect before/after fields → apply to the unsaved draft. Wrong document/language, unknown or protected paths, HTML and oversized fields fail clearly. Changing source or target after checking invalidates the apply action. Import cannot directly save or publish; existing optimistic concurrency and history controls govern subsequent saves. Product imports, exports, ingestion and scraper behavior are unchanged and unrun.

### P6D–P6E — complete disposition and acceptance

Studio → Legacy feature decisions (`/studio/legacy`, administrators only) accounts for **all 79 families and 136 source templates**, with search, inventory/disposition filters and source references. CSV registers are `p6-family-disposition.csv` and `p6-template-disposition.csv`. Current FAQ/process/material/page/journal editing contracts remain active; private subscriber, research and internal-tool boundaries remain intact. No mass data migration or old-runtime replacement was performed.

The inventory is an evidence-backed disposition register, not proof that every one of the 136 historical screens was retested or rebuilt in P6. Existing P4/P5 evidence is identified as inherited. Unsupported capabilities remain explicit instead of appearing as false working editors or fabricated analytics.

## Task reconciliation

| Task | Status | Evidence / boundary |
|---|---|---|
| T32 | IMPLEMENTATION AND ISOLATED QA COMPLETE; RELEASE P8 | Read-only exact stored category keys, published counts, usage links, normalization conflicts and explicitly collection-level old aliases. No invented category IDs or relationship changes. |
| T33 | IMPLEMENTATION AND ISOLATED QA COMPLETE; RELEASE P8 | Supported editorial translation JSON dry run, before/after conflicts, allowlisted text fields, stale-import guard and apply-to-unsaved-draft. No direct publication, catalogue import or private export. |
| T34 | CONDITIONAL; GENUINE CONTENT REQUIRED | No genuine approved project facts/media/consent supplied. Existing project reader and honest empty presentation retained; no false working project/testimonial editor exposed. |
| T35 | IMPLEMENTATION AND ISOLATED QA COMPLETE; RELEASE P8 | Seven exact reviewed redirects, safe 404/410 retirements and bounded old locale compatibility. Unknown product/article identity stays unavailable until evidenced; no approximate matching or token forwarding. |
| T36 | IMPLEMENTATION AND ISOLATED QA COMPLETE; EDITORIAL REVIEW AND RELEASE P8 | Priority interface, source-bound editorial review, complete-document English fallback, exact translated previews, save/publish/recovery and Hindi/Gujarati request journeys verified. Existing business documents are not mass-translated or marked reviewed. |
| T37 | CONDITIONAL; NOT SELECTED | No locale URL/SEO migration selected. Cookie preference and temporary legacy-prefix redirect preserve the existing canonical URL scheme; no hreflang/indexing activation. |
| T38 | IMPLEMENTATION AND ISOLATED QA COMPLETE; RELEASE P8 | Canonical www host aligned with observed existing host redirect; private paths excluded and indexing held. Verify the deployed candidate after a later authorized source release. |
| T45 | CONDITIONAL; TRUSTWORTHY EVENTS REQUIRED | Current workload counts preserved. Anonymous funnel data/permission absent; no invented zero metrics, conversion rate, revenue or WhatsApp-send tracking. |
| T47 | CONDITIONAL; VERIFIED OFFERING REQUIRED | No real workshop, supplies or 3D-printing offering provided; public activation remains off with explicit old-route disposition. |
| T59 | IMPLEMENTATION AND ISOLATED QA COMPLETE; RELEASE P8 | All 79 public/Studio families and 136 source templates reconciled in searchable Studio inventory and CSV registers. Protected, conditional, internal and excluded decisions remain explicit. |

## Verification

- 277 unit tests passed, including 10 P6 completion tests; 12 preflight tests passed.
- 401 compiled HTTP regression tests passed, including disabled-public, authenticated Studio and locale compatibility boundaries.
- Final production compilation/TypeScript and changed-source ESLint passed with zero lint warnings/errors.
- P6A: 53 isolated API assertions, 29 browser assertions, 14 layout samples.
- P6B–P6E: 30 isolated API assertions, 34 browser assertions, 11 layout samples. Hindi and Gujarati each passed search/context, form validation, saved-request and private receipt journeys. Studio coverage, taxonomy, all disposition records and guarded translation import were exercised at 320–1440px.
- Final browser page errors: zero. Desktop/mobile screenshots were inspected. The saved-upload-state check used an intercepted synthetic success response and removed that reference before submission; it certifies presentation, not a new private-storage integration test. Real QA requests used the actual saving/receipt flow, and no WhatsApp Send or outbound campaign was triggered.

QA found and fixed: missing locale connection on registered custom pages, mobile switcher overflow, a translated label accidentally used in upload-state comparison, and joined text fragments. Test harness readiness and a hidden-dialog selector were corrected. Earlier failed attempts are not counted as passes. Server logs included closed-stream messages during navigation/aborts; zero browser errors is not a claim of an empty server log.

## Data protection and cleanup

The existing guarded QA database, role and private-store identity were checked before use. API before/after fingerprints confirmed existing content, inquiries and manual orders unchanged, as well as catalogue/media/business rows. Browser checks intentionally created synthetic QA inquiries and closed them through the supported Studio operation. Synthetic content was hidden, temporary QA staff disabled, and audits/revisions retained. Failed-attempt fixtures received the same cleanup. No product transfer, product/form/category change, contact overwrite, gallery reassignment, original-image replacement or scraper action occurred. No schema migration was required.

## Remaining release dependencies

- Business editorial translations require actual meaning review and deliberate publication. The UI supports this; existing production documents remain unchanged. Unknown/dynamic messages and protected/source content can still be English under the explicit fallback. Native-language editorial sign-off is a release activity, not inferred from successful automation.
- Genuine projects/testimonials need facts, permissions and consent before a dedicated governed module can be activated. Workshop/3D/supplies pages require actual offerings. Anonymous funnel reporting needs trustworthy permitted events; operational counts are not conversions.
- Exact unmapped historical products/articles remain unavailable until identity is supplied. No old products will be transferred. New-product media association remains the previously recorded S09 deferred scope.
- Locale URL migration is not selected; indexing remains disabled. P4 performance targets and P7 full accessibility/device/performance verification remain open. This QA does not certify field Web Vitals, physical-device or full assistive-technology behavior.
- P8 prepares the release and destination content review. Source may be pushed only on a new explicit owner instruction, using a detailed PR to main. QA records must never be copied into production.

## Recovery and continuation

Proceed to P7 only when requested. Keep this branch local. Source recovery is a new revert commit preserving later work; no database rollback or history purge is required. Content recovery uses the existing history-to-new-draft workflow. Older unreviewed translations remain stored but do not become reviewed through a code rollback. Review cache behavior of permanent legacy redirects before deployment.

Machine-readable evidence: `p6-validation.json`; earlier P6A evidence remains in `p6a-validation.json`. Full local browser/API reports and screenshots are in the parent workspace `outputs/P6/`.
