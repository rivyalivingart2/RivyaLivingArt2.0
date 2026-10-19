# Rivya full website, Studio and codebase audit

**Latest continuation — 19 October:** [PENDING-COMPLETION.md](PENDING-COMPLETION.md) and [pending-verification.json](pending-verification.json) supersede the previous translation-transfer and disposable-service-lifecycle pending statements. They include the renewed-session production request failure, fresh tests and exact remaining gates. Results below retain their original date and scope.


**Latest local follow-up:** [19 October approved cleanup](FOLLOWUP-CLEANUP.md), based on audit commit `ad84a2a`, removes confirmed unused code/packages and inactive menu entries, bounds translation rendering and fixes misleading request-load feedback. It includes fresh verification and a precise removal manifest. The original audit results below retain their original scope and dates; follow-up fixes do not close the production or external gates.

**17–19 October 2026 — audit delivery complete within the documented scope; targeted local fixes verified; production sign-off withheld.** The main remaining production issues are an unavailable account/password-request queue and cold mobile performance above the requested target. The 17 October same-page catalogue stress timeout was not reproduced on the patched candidate on 19 October (34 completed checks). The earlier failed receipt remains archived. This finite retest used the existing optimizer cache and a newer Chrome version while canonical E2E was also running; it neither proves a causal dependency fix nor certifies every navigation sequence. Existing dependencies were also patched locally; the development-only braces advisory remains deferred. No release or production mutation was performed.

## 1. Scope and Git baseline

Audited the current app, published production pages, authenticated Studio, shared systems, workflow/privacy contracts, eight responsive widths, motion/media, accessibility and performance. Started at 66e82ef04f76b8460654bab4329ccbadfb47f28e (PR #63), following cinematic PR #62 (224b2ca0e192b8d8ceced3045d6f8a193b734362). Both release records were read. Main and the exact Vercel READY production alias were rechecked on 19 October; the private Studio opening survey remains from 17 October. Branch: codex/rivya-master-audit. Pre-existing local acceptance work was preserved in 40907ff before new fixes. Application fingerprint: 2f7fc8e634fea4593b3bf1c44ed90d16fe7c6ef48bd21b977e1737a46341071b. Sources/ mirror remains read-only.

## 2. Existing completed features retained

Kept the existing logo/palette, serif hierarchy, shared cursor lighting, viewport-based storytelling, seamless homepage sections, Hero/Resin poster-first parallax films, reduced-motion controls, public templates, Studio 37 workspaces, revisions, translations, protected inquiry workflow and manual WhatsApp boundary. This audit did not repeat the cinematic redesign.

## 3. Main website results

The 17 October production inventory checked 656 published sitemap URLs for HTTP 200, title and H1, and 246 referenced asset HEAD responses. This proves availability at the audit time, not every per-record interaction. Local layouts cover 73 distinct route instances and representative dynamic templates; metadata, language fallbacks, public error states, search/filter/sort, saved pieces and customization are covered through source and targeted/browser suites. No claim that every possible content combination is tested. A small 19 October read-only refresh separately returned HTTP 200 for the homepage, Studio sign-in, robots and sitemap; it does not replace the 17 October full inventory (public-availability-2026-10-19.json).

## 4. Studio/admin results

On 17 October, all 37 registered production destinations were opened using the owner-renewed session. No accessible production Studio session was available for a 19 October recheck. Initial openings had no horizontal overflow/completed broken-image flags; a later settled Staff panel revealed **PROD-ACCESS-01 (P1)**. Page openings are therefore not reported as full-module passes. Local conditional coverage exercised 321 states/1051 checks across editors, child controls, saved layouts and intercepted failure states. Actual roles/persistence/recovery were tested separately with new fictional local records. Inactive import/subscriber prerequisites and excluded scraping/fill features remain inactive/absent.

## 5. Section-by-section observations

| Family | Decision and observed treatment |
|---|---|
| Homepage Hero and Resin in Motion | KEEP viewport-based full-bleed video, approved posters/captions and independent pause controls; fix low-memory and paused CSS movement. |
| Introduction, material/story chapters, worlds and closing invitation | KEEP continuous dark gradients and editorial compositions; no new fullscreen forcing or asset substitution. |
| Featured collection, categories and galleries | KEEP responsive natural grids and media framing; product-related gradient edge corrected locally. |
| Portfolio, testimonials, FAQ and landing blocks | KEEP factual labels, concept/sample provenance and content-led growth. All 19 home slots/16 landing block types are source-inventoried; runtime evidence varies by actual fixture. |
| Article/brand/process/care/legal pages | KEEP long-form natural height and readable overlays; correct effective content-language metadata and English fallback boundaries. |
| Commission/contact/customization | KEEP practical forms and consent/manual-send workflow. Never lock long forms to 100vh. |
| Navigation, footer, unavailable and loading states | KEEP shared semantics and brand; tested focus, Escape, responsive menu and poster/error fallbacks. |
| Studio access | KEEP approved image/logo/frosted panel; finite contrast samples verified, not every animation frame. |
| Studio operational/editor pages | KEEP compact functional data layouts; fix filters, return guard, keyboard comparison and pagination. |

[ROUTE-STUDIO-INVENTORY.csv](ROUTE-STUDIO-INVENTORY.csv) contains 230 source-to-component/data/access/state rows with fresh runtime evidence annotations where available.

## 6. Legacy comparison

[DESIGN-COMPARISON.md](DESIGN-COMPARISON.md) records KEEP/IMPROVE/DO NOT COPY against the old public site and Era reference. The 17 October set of 38 reference captures distinguish settled views from preloaders. Kept current brand/media/architecture; did not copy external assets, navigation/services, bright palettes, preloader delays or old backend behavior. Earlier Bionis/Medesk/Gridline pattern adaptations and their [MIT notice](../../redesign/CRAFT-THIRD-PARTY-NOTICES.md) remain intact. No new dashboard source/component was copied during this audit.

## 7. Responsive screenshot coverage

588 preserved 17 October local observations: 73 routes × 1920/1440/1200/992/768/512/390/320, plus four short-height cases. Chrome 155.0.8059.40, DPR 1. Baseline capture found 0 horizontal overflow flags/0 execution errors. All images are indexed in a local navigable gallery; selected representative captures received visual inspection, not all 588. Narrow after-fix captures and behavior checks are paired only when actually available.

## 8. Accessibility

The final post-patch automated run has 86 scans across 43 families/two widths, with 0 detected violations and 0 execution errors. Fixed the comparison scroll-region keyboard failure, filter semantics and fallback language boundaries. 432 preserved 17 October finite rendered contrast samples passed across five video times, ambient positions and labelled white/black media stresses; 66 preserved interaction/fallback checks passed. These do not constitute native-reader certification, every video-frame contrast certification or physical-device acceptance.

## 9. Performance and SEO

Production desktop cold LCP medians were 1712/1120/1064/956 ms for home/collection/journal/product. Mobile medians were 4804/2788/3604/2620 ms under CPU 4×, 150 ms latency, 1.6 Mbps down. One collection TTFB was 3757 ms, with other cold samples 48/58 ms; median alone conceals it. Mobile search-task maxima were 424/224/152/208 ms; finite lab tasks are not field INP. Cold CLS remained below 0.001. Existing field LCP/INP/CLS queries returned no observations. Full production/local tables, resource totals and caveats appear in [PERFORMANCE-AND-SEO.md](PERFORMANCE-AND-SEO.md). Production hi/gu Article schema language mismatch is reproduced and locally render-tested fixed; deployed output remains unchanged.

## 10. Functional/security/privacy results

55 final 19 October local assertions pass: current product/variant validation, persistence/idempotency/concurrency, receipt ownership/recovery, assignment and role checks, stale conflicts, origin checks, private-reference metadata authorization, access approval/one-time redemption, recovery and session revocation. Corrected follow-up audit-note accuracy and calendar validation, including rejection of year zero before PostgreSQL casting. No customer inquiry or external message was invented or sent. All 1,658 original protected records across 13 scopes are identical from audit start to the final snapshot; no production-data preservation claim is inferred from local hashes. Private-provider bytes and destructive lifecycle tests remain separate gates. Next/matched lint config 16.3.8, Sharp 0.35.5 and source-map-js 1.2.2 clear the production-only dependency audit. The full audit retains 5 entries from 1 development-only braces advisory. [SECURITY-RELEASE-REVIEW.md](SECURITY-RELEASE-REVIEW.md) records actual applicability, registry compatibility and official advisory links; no exploit or production rollout is claimed.

## 11. Issue register

14 locally verified fixes, 2 verified open issues, 2 deferred investigations and 1 historical stress finding not reproduced in the latest bounded retest. No confirmed P0 in the executed scope. [ISSUE-REGISTER.csv](ISSUE-REGISTER.csv) includes severity, viewport, actual/expected, reproduction, source, evidence, risk, effort, validation and final status. The locally remediated dependency finding is P1; the production request panel remains P1. Released mobile performance remains P2. The development advisory is deferred P2; local stress is NOT_REPRODUCED.

## 12. Implementation roadmap

[IMPLEMENTATION-ROADMAP.md](IMPLEMENTATION-ROADMAP.md) orders production read-only diagnosis, a concrete additive repair plan for fresh authorization, candidate release review, deployed performance retest, disposable provider/lifecycle QA and genuine native/device acceptance. No broad redesign or speculative optimization is queued as a completed fix.

## 13. Exact tests

| Check | Evidence date | Result | Scope / limitation |
|---|---|---|---|
| lint | 2026-10-19 | PASS | Guarded local QA; Node 22 |
| unit | 2026-10-19 | PASS — 364/364 | Local source tests; Node 22; no database writes |
| preflight | 2026-10-19 | PASS — 12/12 | Guarded local QA; Node 22 |
| build | 2026-10-19 | PASS | Guarded local QA; Node 22 |
| typegen | 2026-10-19 | PASS | Guarded local QA; Node 22 |
| typecheck | 2026-10-19 | PASS | Guarded local QA; Node 22 |
| runtime | 2026-10-19 | PASS — 403/403 | Guarded local QA; Node 22 |
| Production dependency audit | 2026-10-19 | 0 reported vulnerabilities | Local patched packages; no production rollout |
| Full dependency audit | 2026-10-19 | 5 affected entries / 1 advisory | Development-only braces chain remains disclosed |
| Canonical E2E | 2026-10-19 | 155 passed; 5 intentional skips; 0 failures; 0 flaky | Four viewport projects; automatic form-session failure mocked |
| Actual workflow | 2026-10-19 | 55 passed; cleanup pass | New fictional local records; no messages/provider bytes |
| Conditional Studio UI | 2026-10-17 | 1051 checks; 321 states; 0 issues | Preserved baseline; unsaved selectors and intercepted errors |
| Responsive baseline | 2026-10-17 | 588 observations; 0 errors | Preserved 73 route instances × eight widths + four short heights; selected manual review |
| Pixel contrast | 2026-10-17 | 432 samples; 0 failures | Preserved finite five-frame/ambient/black-white stress; not every frame |
| Interaction/fallback | 2026-10-17 | 66 checks; 0 issues | Preserved reduced motion, touch, power, media failure and focus coverage |
| Automated accessibility | 2026-10-19 | 86 scans; 0 violations; 0 errors | 43 families at 1440/390 px; incomplete rules need manual review |
| Studio targeted controls | 2026-10-19 | pass; 34 checks | Unsaved navigation, comparison focus, pagination and gradients |
| Studio same-page stress | 2026-10-19 | NOT_REPRODUCED; 34 checks | Separate bounded resize/pagination-to-editor scenario |
| Motion and language | 2026-10-19 | MOTION-01, MOTION-02, A11Y-LANGUAGE-FALLBACK-01 verified | DOM/transforms; translated schema render tests are separate |
| Protected original records | 2026-10-19 | Identical | 13 scopes / 1658 original local rows |

## 14. Outstanding gates

- **VERIFIED_OPEN — production access requests (P1):** The 17 October Staff account/password panel reported unavailable. Login worked in that observed session. Generic 503 does not establish schema, grants or another storage cause; a scoped log query was empty. No accessible production Studio session was available in the 19 October browser inventory, so no new private check is claimed. Read-only repository environment discovery found only the example and isolated QA configuration, with no production database connection available for schema/grant diagnosis.
- **VERIFIED_OPEN — released mobile performance (P2):** All four 17 October mobile cold-browser LCP medians exceed 2.5 seconds; three finite search tasks exceed 200 ms. These are lab observations, not field INP. The candidate remains local.
- **NOT_REPRODUCED — historical local navigation stress:** The 17 October same-page catalogue stress timeout was not reproduced on the patched candidate on 19 October (34 completed checks). The earlier failed receipt remains archived. This finite retest used the existing optimizer cache and a newer Chrome version while canonical E2E was also running; it neither proves a causal dependency fix nor certifies every navigation sequence.
- **DEFERRED — development dependency advisory (P2):** Production-only audit is clear, but the full audit retains 5 entries caused by 1 braces advisory. No patched upstream release existed on 19 October. Keep lint configuration trusted; avoid an incompatible downgrade. Read [SECURITY-RELEASE-REVIEW.md](SECURITY-RELEASE-REVIEW.md).
- **BLOCKED — field acceptance:** Existing Vercel p75 LCP/INP/CLS queries for 16 October 00:00–17 October 06:00 UTC returned empty arrays. No percentile, zero-value inference or new tracking installation is claimed.
- **BLOCKED — native/device acceptance:** No physical phone/tablet is available. Narrator exists, but no observed spoken task was available through supported controls; no new reader was installed. Native 200%/400% browser zoom remains unexecuted; browser reflow is separate evidence.
- **BLOCKED — private provider bytes:** Isolated QA has no remote Blob token. Metadata authorization is tested; actual upload/download/deletion bytes need a dedicated nonproduction provider.
- **DEFERRED — lifecycle and conditional breadth:** Full erasure/replay and fresh publication/rollback write matrices need wholly disposable records/storage. Source-only locale/legacy redirects, loading/error boundaries, child path/create contracts and optional homepage/landing variants remain scoped in the inventory. Production role inheritance and every permission combination are not proven.
- **DEFERRED — scale and human judgement:** Translation-list scaling needs timing. Mixed-language FAQ/collection/related-card/story-rail boundaries remain source-review candidates, not newly proved bugs or complete assistive certification. Independent meaning, factual/media permission and physical acceptance require actual human evidence. Historical administrator acceptance is not new independent proof.
- **INTENTIONAL — exclusions:** No customer checkout/accounts, new scraping, legacy transfers, removed backups or inactive prerequisite services were activated. No new design direction, motion/UI package, tracker or stock media was added. Existing dependency versions were patched for security.

## 15. Git and release-readiness conclusion

The source, focused tests and ten requested report files are local on codex/rivya-master-audit; raw screenshots/traces/private evidence remain ignored. No push, PR, merge, deploy, production business-data write or CMS publication occurred. All current original brand/content/media/database contracts were preserved in the tested scope. **Audit delivery is complete; unconditional production acceptance is not.** Read [FINAL-VERIFICATION.md](FINAL-VERIFICATION.md) before any release decision.
