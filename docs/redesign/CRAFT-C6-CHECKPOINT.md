# Current C6 disposition — 5 October acceptance follow-up

New local query/CSS/logo work passes seven of seven lab medians (21 samples): home 1.608s, collection 1.708s, product 1.508s, brief 1.384s, process 1.656s, inquiries 1.520s and homepage editor 1.524s. Focused tests after the final footer-size attribute give home 1.724s and process 1.688s. These are source-only loopback fixtures, not current production Blob imagery or hosted cold starts. A hosted collection audit still measured 3.539s and no field data. **C6 remains partial.**

The 290-unit/403-server candidate also passes 144 automated scans, 73 interaction assertions and ten image/motion guards; see the sequence and scope limits in [FINAL-ACCEPTANCE-2026-10-05.md](FINAL-ACCEPTANCE-2026-10-05.md). Earlier native zoom/assistant contrast evidence remains scoped evidence. Human screen-reader/physical-phone tests remain NOT RUN; the owner has neither. Backups/key custody remain removed.

PR #38 released the earlier source described below. This follow-up is local on `codex/final-acceptance-traffic`; indexing is approved only with the next explicitly approved release. Imprint/editorial outcomes now have separate production evidence. The earlier measurements below remain historical, not current release-pending status.

---

# C6 — loading, native zoom and contrast completion pass

5 October 2026. Application/tool source `f1245c7b6362abbbc3b8a1735686b334090ea190` on `codex/c6-performance-accessibility`, continuing C5 and the earlier C6 pass. **C6 remains PARTIAL:** native browser zoom and the assistant contrast review are now complete for the recorded scope; collection loading, field p75 and human screen-reader/physical-phone acceptance remain open. Changes are local only.

## What changed

- Initial Studio identity/staff are rendered after the existing server authentication guard, using the same role-filtered projection as the access-refresh endpoint. This removes an initial request waterfall. The original retry/focus/access-renewal path remains; private data is not cached.
- Unselected content rows carry compact search/state summaries with `detailPending`; choosing one fetches its complete exact record before editing. The selected homepage retains its full draft, snapshots and revision. Page section editor code is deferred separately. A read-only comparison measured 1,903,612 bytes for full content, 86,571 for the compact list and 137,904 for selected-home plus list. The database list query still reads complete records internally.
- A single in-process published-data snapshot can be reused only after a fresh database identity/fingerprint check on every request. Membership and complete-publication fingerprints detect updates and withdrawals. There is no TTL, stale-on-error fallback or reused validation promise. Saved previews remain independent captured revisions. Unit checks cover storage failure, concurrent replacement, mutation isolation and updates/withdrawals; isolated QA verifies the real publication/recovery journey.
- Public locale and publication reads start together. Initial hero/editorial and product-gallery display renditions use quality 60; enlarged product views retain 75. Source images, crops, associations, product and business content remain unchanged. Earlier logo sizing, 1200px image candidate, split form entry and menu-rendering improvements remain.
- Product badges now use defined navy/ivory colours on an opaque surface; the old undefined tokens allowed unreadable text over photos. Product thumbnail and page-image lists have valid named group roles. Content-health repair links now have explicit underlines and readable link colour.

## Mobile loading results

21 completed samples: three per route; cold browser each time; 390×844 CSS pixels, DPR3, touch emulation, CPU4×, 150ms latency, 1.6Mbps down/750Kbps up and reduced motion. The compiled server is local and the isolated QA database is remote; server/image caches may be warm. Exact Studio destination and selected-editor controls are asserted. Menu open/close supplies an interaction diagnostic, not field INP.

| Page | Earlier median LCP | Current median LCP | Current range | Median TTFB | Maximum CLS | Maximum menu event |
|---|---:|---:|---:|---:|---:|---:|
| Homepage | 3.09s | 2.25s | 1.93–2.54s | 0.55s | 0.0000 | 168ms |
| Collection | 4.62s | 2.81s | 2.50–3.00s | 0.97s | 0.0000 | 152ms |
| Product | 3.30s | 2.15s | 2.15–2.58s | 0.49s | 0.0003 | 136ms |
| Custom brief | 1.68s | 1.70s | 1.68–1.76s | 0.48s | 0.0598 | 104ms |
| Process | 2.56s | 2.20s | 2.04–2.33s | 0.49s | 0.0000 | 104ms |
| Studio inquiries | 4.12s | 1.94s | 1.93–2.42s | 0.51s | 0.0000 | 176ms |
| Homepage editor | 5.16s | 1.94s | 1.92–1.99s | 0.50s | 0.0141 | 144ms |

Six of seven route medians meet the 2.5s lab comparison. Collection remains **2.808s**, with individual samples 2.500/2.808/3.004s and server response times 0.513/0.981/0.975s. Its measured LCP is the collection image (50,678 transferred bytes), whose load completes roughly 1.7–1.9s after request start under throttling. Do not hide the missed target or assume a hosted deployment will pass. Timing differences include variable network/database latency, not just code effects.

The homepage editor's measured transfer is approximately 0.836MB, versus approximately 1.19MB previously. The published source is still 529,618 bytes on a full miss; warm unchanged calls avoid transferring that document set and validate a 26,793-byte identity representation. That identity size is the serialized result, not an exact wire-transfer measurement. Read-only validated output equals a fresh complete read. The first profiled source read took 1,893ms; warm calls took 488/261ms.

All sampled CLS values are below 0.1 and menu-event maxima below 200ms. Three lab runs do not establish the agreed real-user p75 targets: LCP ≤2.5s, INP ≤200ms and CLS ≤0.1. A hosted candidate in the intended deployment/database region and eligible field evidence remain necessary.

## Native zoom and contrast — recorded scope complete

- **49 destinations at native Chrome 200% and 400%**, plus a 100% baseline: 99 observations and six dialog/focus-return interactions. Actual CSS viewport width/DPR changes are 1424/1 → 712/2 → 356/4; CSS zoom and visual-viewport scale remain 1. No horizontal page overflow or browser errors were found. Public screenshots were visually inspected. Vertical scrolling remains expected at high magnification.
- **98 desktop/mobile contrast states**: 49 destinations at 1440/390px. Raster sampling covers 2,284 unresolved text cases over actual gradients/images; all measured cases pass, with minimum 5.26:1. Text paint was hidden in memory, geometry preserved, and 1000px screenshot tiles avoided giant-image texture limits. This is assistant review with measurement, not human accessibility certification.
- Remaining cases were resolved through source repairs and **36 focused assertions / 11 targeted scans**. Thumbnail/page-image groups have appropriate roles. Catalogue pagination and health-table links can be scrolled into view and focused. Their measured text contrast is 16.65:1 and 6.97:1 respectively; repair links are underlined. An empty follow-up table has a caption/headers and an explicit empty-result message; it is not missing populated data cells. Repeated same-style cells share that disposition.
- **144 automated scans** across 48 exact destinations at 1440/390/320px report zero violations, page overflow, missing image names, active reduced-motion animation or uncaught page errors. **73 interaction assertions, ten state scans and 26 reflow observations** cover menus, skip links, gallery, validation, filters, FAQ, reviewed-language fallback and unsaved Studio navigation.
- **Ten image/motion observations** across five public routes and two sizes pass the C6 guards: visible images ≤200KB; width selection ≤1.5× device pixels with a 640px floor and already-loaded-resource reuse; finite entrance motion ≤1s once; static visible reduced-motion content. These are scoped regression guards, not full-page or field budgets.

Performance includes all loading changes and precedes only the badge contrast, named-group and repair-link presentation fixes. The full 144-scan accessibility and native zoom matrices include the badge repair and precede the final group/link fixes; 11 targeted scans verify those fixes. Final build, 73 interactions, 10 media/motion samples and public screenshots include all application changes. Only a comment changed after the build.

## Protected data and publication acceptance

The full code check passes: **288 unit, 12 preflight and 403 built-server checks**, TypeScript and optimized build. Lint has zero errors and 62 existing warnings; changed-file lint is clean.

Thirteen isolated-QA assertions verify anonymous denial, compact-list identity/detail safety, exact selected homepage content, private captured preview, draft isolation, immediate publication/update/withdrawal with a warm snapshot, and recovery as a new revision. One newly created synthetic page was published, recovered and hidden at revision 7 with history retained. Every pre-existing catalogue/media/business/content/inquiry/order/staff record matched baseline. No production write, customer message, export, erasure or backup operation occurred.

## Remaining acceptance

| Task | Current status | Evidence needed next |
|---|---|---|
| C6-01 loading | PARTIAL — 6/7 lab medians meet 2.5s | Improve/verify collection on an authorized hosted candidate in the intended region; repeat cold-cache and cold-start diagnostics; obtain eligible real-user p75. Do not introduce stale-publication caching to pass a benchmark. |
| C6-02 image/motion | COMPLETE for scoped guards | Repeat on relevant future image, font or motion changes. |
| C6-03 automated, native zoom and assistant contrast | COMPLETE for recorded scope | Human assistive-technology use remains separately unverified under C6-04; this is not WCAG certification. |
| C6-04 human/device | NOT AVAILABLE — owner confirmed neither device nor screen reader | Run the existing [human/device checklist](C6-HUMAN-DEVICE-CHECKLIST.md) when equipment and a tester are available. |
| C6-05/06 backup and key custody | REMOVED BY OWNER | Do not recreate. Studio drafts/revision recovery remain supported. |

C7 has not started. Keep changes local until a new explicit push-main instruction; then use a detailed PR. PR #37 fulfilled the prior release authorization. Optional C2 video and production editorial/Imprint acceptance remain separate and were not certified by this pass.

Evidence: `craft-c6-evidence.json`. Repeatable checks: `tools/c6-acceptance/README.md`. Screenshot report: workspace `outputs/CRAFT/c6-implementation.html`. [Web Vitals lab/field guidance](https://web.dev/articles/vitals) and [W3C human review guidance](https://www.w3.org/WAI/test-evaluate/preliminary/).
