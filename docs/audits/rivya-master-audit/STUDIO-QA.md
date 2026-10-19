# Studio source and interaction audit

> Final status authority: this document retains the dated 17 October source/before review. The 19 October coordinator sections and [FINAL-VERIFICATION.md](FINAL-VERIFICATION.md) provide the final candidate results; [SECURITY-RELEASE-REVIEW.md](SECURITY-RELEASE-REVIEW.md) covers later dependency patches. Earlier source-only requests and issue labels below are not new current passing or open-test claims.

17 October 2026. Specialist: Studio QA and administration UX. Baseline HEAD: `66e82ef04f76b8460654bab4329ccbadfb47f28e`; observed branch: `codex/rivya-master-audit`. The previous acceptance changes were already present and were not altered by this specialist.

This is a current **source inspection**, not a claim that every Studio screen was opened in a browser during this specialist pass. The primary audit owns fresh browser, API, database and screenshot evidence. The route inventory is maintained separately in `ROUTE-STUDIO-INVENTORY.csv`; this document records behavioral coverage, scope decisions and reproduction targets. Historical passing results in `AGENTS.md` were treated as a test plan, not fresh proof.

## Skills and constraints applied

- `.agents/skills/studio-admin-ux/SKILL.md`: information density, meaningful state labels, keyboard access and operational error prevention. Its example optimistic mutations were **not** adopted: existing server-confirmed order moves are appropriate for this business workflow and changing them would expand scope.
- `.agents/skills/fixing-accessibility/SKILL.md`: native controls, accessible names, tabs, dialog focus, validation, announcements and small targeted changes.
- `.agents/skills/mobile-native/SKILL.md`: mobile viewport, 16px inputs, touch targets and hardware limitations. Its initial-response rule applies only when invoked without a specific task; this task provides one. Real-phone testing remains unavailable, as the owner explicitly stated.

No application edits, packages, database writes, account changes, publication, exports, cleanup, messages or releases were performed by this specialist. Only these audit documents were created.

## Current module coverage

The `studioModules` registry contains **37** destinations, all with a renderer in `workspace.tsx`. Eight require an administrator at route admission. Alias routes resolve through the same registry; they do not install legacy tools. “Present” below means implemented in current source, not production activation certification.

| Destination / current label | Implementation reviewed | Classification and limits |
|---|---|---|
| Overview | `overview-panel`, `overview-workspaces`, workspace shell | PRESENT; real task/read-only status links, no revenue or traffic claims |
| Inquiries & orders | `inquiry-workspace`, `inquiry-detail`, shared dialog | PRESENT; orders, kanban and enquiries aliases; scoped list/board, customer briefs and staff-entered records distinguished |
| Follow-ups due | Same inquiry workspace with due-only mode | PRESENT; IST date filters and assigned scope |
| Analytics | `analytics-panel` | PRESENT; saved-record aggregates, explicitly not visits, revenue, purchase conversion or WhatsApp sends |
| Activity & logs | `operations` | PRESENT; stage and editorial audit records with precise links |
| Products | `catalogue-editor`, `product-details` | PRESENT; protected review first, deliberate editing, six child panels, version-aware saves |
| Categories | `catalogue-categories` | PRESENT, READ-ONLY; derived from current products, not an independent category management service |
| Public media | `media-library`, `editorial-asset-library` | PRESENT; metadata, provenance, crop, product associations and saved usages |
| Bulk import | `conditional-workspace` | RESTRICTED / INTENTIONALLY INACTIVE; administrator prerequisite screen, no ingestion job |
| Exports | `operations` with export-only mode | RESTRICTED; private CSV confirmation, tracking, expiry and source/date filters; must not click during production audit |
| Research | `editorial-desk` | PRESENT; inspect saved source notes, no scraping |
| Content gaps | `content-health` with gaps-only mode | PRESENT; limited source checks labelled accurately |
| Site copy | `site-copy-editor` → `content-editor` | PRESENT; exact shared-copy record with source-owned protected fields |
| Page design | `presentation-editor`, `page-design-controls` | PRESENT / RENAMED FROM SECTIONS; independent layout revisions, saved preview, conditional workshop template |
| Site images | `site-images-editor`, crop fields | PRESENT; independent placement crops; original media retained |
| Navigation & languages | `site-settings-editor` | RESTRICTED; current settings validation and explicit publication |
| Process steps | `content-editor` / `page-sections-editor` | PRESENT; exact process record, customer/making sequence fields |
| Materials | Same content editor | PRESENT; exact materials-care record and optional structured guidance |
| Commission forms | `catalogue-editor` forms-only mode | PRESENT; existing product field schemas, conditional visibility and live local form preview |
| All content | `editorial-library` → lazy full editor | PRESENT; server-filtered summaries, pagination, exact records fetched on demand |
| Journal | Same library, journal scope | PRESENT; blog alias; metadata/body/media/translations/history |
| Portfolio | Same library, portfolio scope | PRESENT; factual classification preserved |
| Testimonials | Same library, testimonial scope | PRESENT; source/fictional labels preserved, no fabricated feedback |
| FAQs | Same library, FAQ scope | PRESENT; question groups and policy reference fields |
| Pages | Same library, page scope | PRESENT; required policy/contact/browse sections protected |
| Landing pages | Same library, landing scope / `landing-editor` | PRESENT; custom-pages alias, optional block editors |
| Production register | `content-register`, `reviewed-batch-publisher` | PRESENT; historical delivery facts separated from current saved publication; new editorial draft dry run is distinct from excluded product import |
| Editorial ordering | `editorial-order-editor` | PRESENT; complete-scope ordering, drag plus keyboard buttons, separate saved preview and publish gate |
| Language review | `translation-workspace`, `translation-editor` | PRESENT; missing/incomplete/needs review/reviewed/stale and labelled English fallback; scaling concern below |
| Content health | `content-health`, `read-content-health` | PRESENT; fail-closed completeness of five input reads, stale results labelled after failure |
| SEO | `editorial-desk` SEO mode | PRESENT; exact draft/public metadata inspection, routes and records remain source owned |
| Content lab | `editorial-desk` planning mode | PRESENT; record classifications and counts, no fabricated progress |
| Staff access | `staff-editor`, `access-requests` | RESTRICTED; users alias; role, enabled state, session revocation and reviewed administrator request decisions |
| Atelier settings | `operations`, `business-settings`, `reference-cleanup` | RESTRICTED; contact publication and destructive maintenance are explicit existing actions; do not execute in production audit |
| Subscribers | `conditional-workspace` | RESTRICTED / INTENTIONALLY INACTIVE; no consent service, counts, signup, export or messaging implied |
| Legacy decisions | `legacy-disposition` | RESTRICTED; recorded decisions and references, no transfer/reactivation |
| Old links & publication | `route-review` | RESTRICTED; saved-source availability explicitly distinguished from live HTTP/indexing proof |

Additional non-workspace families are implemented: sign-in, request access, forgot password, set password, private customer reference viewing, saved inquiry/order print cards, saved page previews and mobile frames, page-design previews, ordering previews, authoring-state specimens and a Studio error boundary. The legacy `signup` and `reset-password` catch-all paths redirect to login; the current supported account routes are explicit. A legacy product scraper and Catalog Fill are **ABSENT / EXCLUDED**; customer accounts, payment checkout, old-product transfers and removed backup tooling remain excluded.

The source registry marks these eight administrator-only destinations: Navigation & languages, Legacy decisions, Old links & publication, Staff access, Atelier settings, Bulk import, Exports and Subscribers. Access requests are embedded in Staff access, not a missing standalone module. Backend role enforcement must be evaluated alongside this UI map by the workflow/security review.

## Existing behavior worth retaining

| Area | Current source evidence | Audit judgment |
|---|---|---|
| Staff shell | `workspace.tsx:119–127,169–176`, server admission in `src/app/studio/[...path]/page.tsx` | KEEP. Server authentication precedes workspace render; finder/mobile navigation use the shared permitted registry. Ctrl/Cmd+K, breadcrumbs, collapsed navigation and targeted heading focus exist. |
| Product child panels | `catalogue-editor.tsx:228–256,271–345` | KEEP. Six actual tabs have arrow/Home/End handling, roving tabindex, labelled panels and field-repair destinations. This is distinct from the collection-filter defect below. |
| Dialogs | `shop/dialog.tsx:9–47` | KEEP. Native modal inertness, explicit Tab wrap, Escape callback, nested scroll-lock accounting and opener recovery. Native-reader evidence is separate. |
| Dirty edits | `workspace.tsx:130,155`, `record-switch.tsx`, `editorial-library.tsx:17–23`, `inquiry-workspace.tsx:29–50` | KEEP the safeguards; remove duplicate leave prompts only after reproduction. Browser history, same-record changes, new-tab links and saving state are important edge cases. |
| Save and failure recovery | `workspace-api.ts`, `draft-recovery.tsx`, `content-editor.tsx:51–59`, `inquiry-detail.tsx:24–46` | KEEP. No automatic retry of writes. Session-expiry message preserves current tab; ambiguous save responses tell staff to inspect saved state. Version conflicts retain editor text. |
| Publication | `homepage-editor.tsx:44–61`, `presentation-editor.tsx:33–45`, `editorial-order-editor.tsx` | KEEP. Draft, published, changed, blocked and verification-needed states differ; previews identify exact saved revisions. A failed public verification does not imply republish. |
| Saved preview recovery | `saved-preview-frame.tsx` | KEEP. Revision marker check, 15-second loading bound, full-preview/sign-in link and retry; no false success for missing frames. |
| Private inquiry operations | `inquiry-workspace.tsx:55–74`, `inquiry-detail.tsx` | KEEP. State moves wait for server confirmation; backward/closed stages require a reason. Original brief, amendments, notes, message preparation and manual-send boundary remain distinct. |
| Translation editing | `translation-editor.tsx`, `translation-workspace.tsx` | KEEP. Import dry run checks context before applying unsaved text. Presence, meaning review, publication and source freshness are distinct. Do not infer native review. |
| Admin-assisted recovery | `access-requests.tsx:13–38`, `access-password-form.tsx` | KEEP. Real-person verification checkbox gates approval, new editor account is disabled pending password, one-time token remains in fragment/client memory. Production table activation remains a separate runtime question. |
| Operational appearance | `studio-editing.module.css:26,50,55,113`; `studio-operations.module.css` | KEEP. Restrained navy/charcoal surfaces, 16px controls, 44px main actions, natural-height editors and table overflow. No full-screen animation imposed on records. |
| Small-screen alternatives | `workspace.module.css:230–239`, `studio-operations.module.css:63–76` | KEEP. Sidebar becomes labelled modal navigation; inquiries/content-health have compact alternatives; mobile board shows a chosen stage. Real phone keyboard/safe-area behavior remains unverified here. |

## Findings requiring primary-agent reproduction

### STUDIO-01 — Collection filters announce incomplete tabs (P2)

**Source-confirmed, browser verification requested.** `catalogue-editor.tsx:104–138` declares `role="tablist"` and four `role="tab"` buttons with `aria-selected`. Unlike the six product editor tabs lower in the same file, this collection selector has no arrow/Home/End keyboard handler, roving tabindex or associated tabpanel. All four remain normal tab stops. Its actual function is filtering a common results list.

Reproduce in local Studio Products: focus “All pieces”, press ArrowRight, then Tab through the filter group. Compare the role announced/DOM semantics with actual interaction. Expected either a complete tab pattern or ordinary filter buttons whose pressed state is announced. Recommended low-risk fix: `role="group"` with the existing label and `aria-pressed` on the four filter buttons, retaining filtering, labels, counts and visuals. Validate each filter with mouse/keyboard and ensure the lower editor tabs are unchanged. Estimated effort: less than one hour. No schema/data dependency.

### STUDIO-02 — Dirty editorial return can ask twice (P3)

**Source-confirmed competing handlers, browser verification requested.** `workspace.tsx:130` captures any same-tab `/studio` link click when a dirty editor is mounted, then `editorial-library.tsx:23` independently asks again on “Return to filtered records”. Accepting the parent prompt does not clear the dirty flag or mark the click handled, so the child handler is still eligible to show its own confirmation.

Reproduce in isolated local Journal: open a synthetic/existing test record, edit one field without saving, click Return to filtered records and accept the first confirmation. Count confirmation dialogs; also decline and confirm the typed value remains. Expected one deliberate decision. Recommended scoped fix: let the record-return link own its dirty/saving guard and have the workspace capture handler recognize that ownership; do not remove global protection from other navigation links. Verify modified/new-tab clicks, browser back, mobile navigation, Ctrl/Cmd+K and saving-in-flight behavior. Estimated effort: one to two hours. No writes required to reproduce.

### STUDIO-03 — Translation overview has unbounded fetch and DOM scope (P2 candidate, DEFERRED pending measurement)

`translation-workspace.tsx:10–16` fetches complete `/api/studio/content`, recalculates review state and renders every matching document as a card. Unlike the editorial library, there is no pagination or summary-specific request. This is a verified implementation property, **not yet a measured current usability failure**. `read-content-health.ts` also requires complete content/catalogue/media inputs by design.

Measure first-opening time, transfer size, rendered node count, filter response and long tasks at the current record count on 390px and a throttled desktop CPU. If it materially blocks staff work, plan a paginated review summary using the same completeness/freshness calculations. Do not apply a UI-only slice that silently omits review coverage or independently change backend contracts during this source audit.

## Conditional and error-state test packet

The primary agent should correlate these with fresh evidence, avoiding duplicate executions already covered in the same audit run:

1. Products: all four collection filters, six editor tabs by keyboard, category/search/publication combinations, empty search, pagination, form visibility conditions, missing linked ID, protected review versus deliberate editing, image options unavailable, dirty record-switch Cancel/Discard, restoration into local draft, save/refresh split failure and conflict.
2. Journal/portfolio/testimonials/FAQ/pages/landing pages: filtered list→exact record→return, browser history while dirty, all applicable child fields, hidden sections, revision comparison, saved preview marker success/error, review-state translation controls and slow media options.
3. Page design: current/reference sequence; hero, manifesto, featured and film options; hidden/unavailable reference states; page-specific options; conditional workshop template; exact desktop/mobile saved preview and stale-reference blockers. Changing a selector locally is not publishing it.
4. Inquiry list/board: 0/1/multiple records, table versus compact card view, full stage vocabulary, filtering/paging, selected-record restoration, reason modal Escape/focus, follow-up presets/IST, note/amendment conflict, session expiry with typed edits, read-only private references and print card. Production writes are prohibited.
5. Shell: all 37 destinations and eight administrator exclusions; keyboard finder; mobile navigation; opening another tab without discarding editor; sidebar icon names; responsive breadcrumbs; old child paths admitted only for supported records.
6. Admin: unavailable access-request table, empty queue, scoped synthetic review modal, verification checkbox, expired/replayed link and inaccessible staff mutation. Rejection/approval/revocation/cleanup/export writes need a separately verified isolated QA environment and labelled synthetic fixtures.
7. Error resilience: 401, 403, 409, 503, malformed JSON, network interruption, saved-but-refresh-failed and retry states. Keep synthetic response interception explicitly labelled; it is not production backend proof.
8. Mobile/assistive: all requested widths, short height, 200% actual zoom if tooling permits, tab/focus containment and forced colors. Existing-reader-only and no-physical-device constraints remain in effect.

## Optional dashboard references

The project already records Bionis/Medesk/Gridline pattern adaptation in `docs/redesign/CRAFT-THIRD-PARTY-NOTICES.md`, including registry URLs and a retained MIT notice. `overview-workspaces.tsx:7` expressly identifies its Gridline-inspired searchable-card pattern. No new dashboard component is needed to address the two local interaction defects above. This pass did not revalidate remote licensing, install registry bundles or infer approval for new charts, sample records or theme providers. Any additional source reuse must receive a fresh source/license/compatibility review.

## Verification boundary

Source inspection supports the current module map and targeted reproduction instructions. No new browser screenshots, native screen-reader results, real-phone observations, production data acceptance or release certification were produced by this specialist. Consolidated current results belong in the primary audit's `FINAL-VERIFICATION.md`; do not carry forward historical 37-workspace/1,051-assertion counts as newly executed evidence.


## Final coordinator verification

STUDIO-01/02: VERIFIED_FIXED; final targeted receipt: 34 checks, pass. The 1051 checks / 321 conditional states and 37 production openings are preserved 17 October evidence. The final 86 automated accessibility scans and 34 targeted controls are 19 October runs. The 17 October same-page catalogue stress timeout was not reproduced on the patched candidate on 19 October (34 completed checks). The earlier failed receipt remains archived. This finite retest used the existing optimizer cache and a newer Chrome version while canonical E2E was also running; it neither proves a causal dependency fix nor certifies every navigation sequence. PROD-ACCESS-01 overrides any inference that all production modules are fully working: Staff request panel unavailable after settling. Translation overview scaling remains DEFERRED without measured failure. Final current issue statuses are in ISSUE-REGISTER.csv.
