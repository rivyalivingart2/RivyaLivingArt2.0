# C6 — performance and accessibility engineering pass

5 October 2026. Local source `ccf1ac31b14db058a7b8b01f23637ba349fff9c0` on `codex/c6-performance-accessibility`, continuing the accepted C5 candidate. **C6 remains PARTIAL.** Engineering improvements and the scoped automated matrix are complete; loading targets, real-user percentiles, native browser zoom and human/device evidence are not accepted. Nothing was pushed or deployed.

## Implemented

- The header logo requests a resource sized for its actual 158/184px slot. A 1200px responsive-image candidate avoids jumping from 1080 to 1440px for a 390px DPR3 hero.
- Primary editorial images use eager loading and high fetch priority; below-fold editorial images stay lazy. Existing images, associations, crops, captions and alt text are retained.
- Customization form code has a separate client entry, so ordinary browsing no longer includes that code in shared browsing chunks. Server rendering and the actual form component are retained.
- Studio module rendering is memoized across shell-only menu/page-finder changes. Identity, role, staff, module and editor-local changes still update normally. Unsaved title retention across menu and finder use was checked without saving.
- Small-screen modal backdrops keep their dark contrast layer without a full-screen blur repaint.
- Editing-state announcements now sit inside a definition-list value rather than replacing its semantic role. This repairs the serious `definition-list` issue found on the actual Site copy screen; the final selected-record scan also checks it.
- Repeatable compiled-QA runners, a screenshot report and a human/device checklist now accompany the phase.

## Performance — target still open

The final run contains 21 cold-browser lab samples: three per route, 390×844 CSS px, DPR3, 4× CPU slowdown, 150ms latency, 1.6Mbps down/750Kbps up, reduced motion, local compiled server and isolated remote QA database. Server/image caches may be warm. Menu open/close is the sampled interaction. These observations do not establish field p75 or phone performance.

| Route | Median LCP | LCP range | Median TTFB | Maximum CLS | Maximum sampled interaction |
|---|---:|---:|---:|---:|---:|
| `/` | 3.09s | 3.01–4.40s | 1.47s | 0.0000 | 168ms |
| `/collectible-design` | 4.62s | 4.34–4.71s | 1.81s | 0.0000 | 136ms |
| `/pieces/river-channel` | 3.30s | 3.24–3.72s | 1.16s | 0.0003 | 104ms |
| `/commission/customize` | 1.68s | 1.50–1.71s | 0.46s | 0.0598 | 136ms |
| `/process` | 2.56s | 2.12–3.04s | 0.27s | 0.0000 | 120ms |
| `/studio/inquiries` | 4.12s | 3.83–6.36s | 0.72s | 0.0385 | 176ms |
| `/studio/content?record=page%3Ahome` | 5.16s | 5.08–6.12s | 1.00s | 0.0348 | 160ms |

Homepage transfer fell from approximately 461,721 to 440,632 bytes (about 21KB, 4.6%). The comparable collection/product reductions are about 12KB each. Timings vary; do not attribute every difference to code. Inquiry-menu diagnostics before the Studio optimization were 432/272/280ms; final results are recorded above. Neither series is real-user INP.

The diagnostic published-data read returned 529,618 bytes and took 968–1,828ms; the shared shell returned 23,641 bytes and took 485–941ms. No cross-request cache was introduced: exact previews and immediate publication/withdrawal remain protected. Studio's full home editor still transfers approximately 1.19MB and needs further profiling.

Performance samples include all loading/menu optimizations and precede only the final definition-list `dd`/`span` semantic repair. Final build and accessibility/interaction checks include that repair. No loading logic changed afterward.

The agreed field targets remain LCP ≤2.5s, INP ≤200ms and CLS ≤0.1 at the 75th percentile. Only one of the seven route medians meets the lab LCP comparison. All final sampled CLS and menu-event maxima meet their diagnostic thresholds; that is not field acceptance. See [Web Vitals](https://web.dev/articles/vitals) for the lab/field distinction.

## Automated accessibility and interaction scope

- 48 exact destinations: 32 public/system/login routes and all 16 authenticated Studio modules.
- 144 axe observations at 1440, 390 and 320 CSS pixels, with zero automated violations, horizontal body overflow or uncaught browser errors. Reduced-motion checks find no active animation. The unavailable-route case correctly returns 404.
- 73 focused keyboard/interaction assertions, 10 additional state scans and 26 public 720/360px reflow observations. Menus, search, gallery keys/focus, required-field errors, filter announcements, FAQ and unsaved Studio navigation are covered.
- Ten image/motion observations across five public routes and two widths pass the new C6 regression guards: visible image ≤200KB; selected width ≤1.5× displayed device pixels with a 640px floor (reuse of an already loaded larger image is allowed); timed entrance motion ≤1 second once; native scroll timelines recorded separately; visible reduced-motion content static. Hidden closed-disclosure animation entries are not visual motion. These guards are a scoped regression policy, not a full-page download or field-performance certificate.
- Hindi/Gujarati checks record the actual HTML language and reviewed-language fallback; they do not certify editorial translation or human pronunciation.

axe's unresolved `incomplete` entries remain manual review, notably text over photos/gradients. Narrow viewport reflow does not prove native browser zoom. CSS `zoom` was deliberately rejected as a proxy because it does not trigger viewport media queries. Earlier provisional Studio scans that redirected to sign-in were discarded; only the final exact-route assertions appear in the accepted receipt.

## Validation and protected data

The full `npm run check` passes: 283 unit tests, 12 preflight checks, 403 built-server checks, TypeScript and optimized build. Full lint has zero errors and 62 existing warnings; changed application/test files have zero scoped lint warnings. Protected catalogue/media/business fingerprints and every pre-existing content/inquiry/order/staff row remain unchanged in the read-only matrix. No product, scraper, contact, social, form schema, customer record or gallery association was changed. No production publication, external message, export, erasure or backup action occurred.

## Remaining gates and next actions

| Task | Disposition | Next action |
|---|---|---|
| C6-01 loading | PARTIAL — measured fixes; target missed | Profile the 529KB published projection and the 1.19MB Studio editor; preserve immediate withdrawal and exact-preview behavior. Obtain an authorized hosted candidate in the intended region and repeat; collect eligible field p75 after release. |
| C6-02 image/motion budgets | COMPLETE for recorded regression scope | Run the guards on subsequent image, crop, font or animation changes. |
| C6-03 accessibility matrix | PARTIAL — automation passed | Review contrast/incomplete cases and actual native 200%/400% browser zoom; obtain assistive-technology observations. |
| C6-04 human/device | NOT AVAILABLE — owner confirmed | Use [C6-HUMAN-DEVICE-CHECKLIST.md](C6-HUMAN-DEVICE-CHECKLIST.md) when a real phone and screen reader are available; do not invent results. |
| C6-05/06 backups/key custody | REMOVED BY OWNER | Do not recreate. Studio draft/revision recovery remains supported. |

C7 is not started. A new explicit push-main instruction is required for a detailed PR and release; the previous PR #37 authorization is already fulfilled. Production editorial acceptance and optional C2 video remain separate. This pass did not publish or recheck production Imprint.

Repeatable commands: `tools/c6-acceptance/README.md`. Full sanitized receipt: `craft-c6-evidence.json`. Screenshot report: workspace `outputs/CRAFT/c6-implementation.html`. Human checks follow [W3C Easy Checks](https://www.w3.org/WAI/test-evaluate/preliminary/); automated results alone are not a conformance certificate.
