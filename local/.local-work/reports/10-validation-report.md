# Validation report

Updated: 2026-09-30
Tested source head: `5176e24706c62b54417931b6f2207987d3e4bc9b`

## Verified checks

| Check | Result | Evidence |
|---|---|---|
| Transformation fixture suite | PASS | Existing local fixture/safety tests |
| Dirty-tree hash guard | PASS | Existing local safety test |
| Product-price regression | PASS | Reproduced before fix; branch build succeeds after typed repair |
| Next/Vercel production build on branch | PASS | Vercel deployment `dpl_SXoz7dDgUzNFNJPy2FnJvgdTuv4e` is READY; GitHub Vercel status is success |
| C1 public integrity fixes | PASS at build/source level | Missing spec PDF CTA removed; preservation wording bounded to approved guidance |
| C2 metadata/structured data | PASS at build/source level | Product breadcrumb graph + collection ItemList/CollectionPage; metadataBase uses canonical site origin |
| D1 error-aware catalogue editor | PASS at build/source level | Exact D1 preview reached READY; later cumulative source head also READY |
| D3 copy/media workspaces | PASS at build/source level | Content/media API reuse; D3 previews reached READY |
| D4 content health | PASS at build/source level | Read-only derived dashboard; D4 preview reached READY |
| E1 public portfolio truthfulness | PASS at build/source level | Public routes now use only `approvedProjects`; cumulative source head READY |
| F1 touch/reduced-motion refinements | PASS at build/source level | Exact F1 source head READY |
| Production data safety | PASS | No migration, DB write, product mutation, order submission or external send performed |

## Responsive source coverage

The required matrix maps to existing CSS breakpoints as follows:
- 1920 / 1440 / 1200: desktop and wide-grid rules.
- 992: public 1100/1024 rules and Studio 1080 collapse behavior.
- 768: public 780 mobile rules and Studio 800 rules.
- 512: mobile public rules plus Studio 540 rules.
- 320: 480/420/400/380 public rules plus 540 Studio rules.

This confirms code-path coverage, **not visual certification**.

## G1 performance/media evidence
- Public image delivery uses Next Image/getImageProps and responsive `sizes`.
- Hero art direction selects a portrait or landscape optimized source before request.
- Active body-font WOFF2 files are ~14 KB each; Instrument Serif TTFs are ~62–64 KB each; JetBrains Mono (~112 KB) is configured with `preload:false`.
- Public media contains 134 source images totaling ~29.8 MB; largest source WebP ~843 KB. Because Next Image transforms delivery, source size alone is not treated as a measured transfer failure.
- No browser/network trace was available, so no Core Web Vitals or transfer-budget PASS is claimed.

## Blocked H1 checks
The exact Preview is protected by Vercel Authentication. Vercel build/status APIs are available, but:
- the connected Vercel fetch endpoint returns the authentication boundary rather than rendered app HTML;
- the hosted Chromium/container cannot resolve/access the protected Preview hostname;
- no authenticated browser action is exposed in this chat.

Therefore the following remain **BLOCKED**, not failed:
- screenshots at 1920×1080, 1440×900, 1200×900, 992×900, 768×1024, 512×915, 320×740;
- current-head interactive keyboard/touch checks in rendered pages;
- authenticated Studio visual checks;
- console/network trace and lab performance capture.

No screenshots or successful browser checks were fabricated.
