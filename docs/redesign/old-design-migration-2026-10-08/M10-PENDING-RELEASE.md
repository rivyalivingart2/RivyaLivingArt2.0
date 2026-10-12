# M10 follow-up production receipt — 12 October 2026

The loading, image-contrast and Studio usability follow-ups are released through [PR50](https://github.com/rivyalivingart2/RivyaLivingArt2.0/pull/50). Main commit `620aa806fa8d7bbf820b41796cee9ddf90ca0591` produced READY production deployment `dpl_5gNeX33TEQwyiJSyS1toGiavZTSS`; its aliases include [the live website](https://www.rivyalivingart.com). Application fingerprint: `1ef8bfa429bd27a3964b55e359cc4d1691e86d9eb6a60a3b11339a267f5dc24b`.

## Release verification

The exact PR head was `0d8c736d34c0720bd0a53b5a8243a08b154e2b8e`. Its Vercel preview passed. Because no automatic preview initially appeared, the existing connected Git source was used to request that exact commit; no project setting, access control or deployment protection was changed. The protected preview was not accessed through a bypass link. GitHub's code and security reviews completed without findings, and the merge was pinned to the verified head SHA. Production then built automatically from the merged main commit.

All **26 bounded production checks pass**: public routes and six selected editorial details, homepage publication revision 4 and concept/fictional disclosures, current contact details, indexing directives, robots/sitemap, Studio login and anonymous authorization denial, retired Workshops and missing-page behavior. HTML deployment markers match the exact release where applicable. This is bounded route verification, not proof of every customer journey.

Every original production ID and row digest matches the fresh pre-release baseline in all **13 protected scopes**. Counts are unchanged: 120 catalogue records, 535 content records, 154 media records, one business-settings record, 1,389 revisions, two inquiries, two orders, two order events and two privacy-control rows; the remaining captured scopes are empty. The release performed no content writes, schema changes, imports or publication replay. All 480 M9 entries and homepage revision 4 remain as previously published.

The live homepage's image loaded successfully. Its silent film reported duration **8.042 seconds**, played muted through the actual Play control, and paused through the actual Pause control. The associated visible description remains present. A deployment-scoped error/fatal log query returned no groups in its 15-minute lookback; this is a bounded observation, not an uptime guarantee.

## Hosted loading results

The browser used a 390×844 CSS viewport, DPR 1, configured 4× CPU slowdown, 150ms latency, 200,000 bytes/s download and 93,750 bytes/s upload. Buffered performance observers recorded LCP and CLS. Browser-cache bypass and cache-enabled repeat do not establish server/CDN cache state. These are automated lab samples, not a physical phone or field p75.

| Sample | LCP | CLS | Font transfer |
|---|---:|---:|---:|
| Before release, homepage, browser cache bypassed | 3.312s | 0 | 423,388 bytes |
| PR50 homepage, browser cache bypassed | 3.256s | 0 | 248,200 bytes |
| PR50 homepage, cache-enabled repeat | 1.448s | 0.02395 | 0 bytes |
| PR50 collection, browser cache bypassed | 2.928s | 0 | 248,200 bytes |
| PR50 collection, cache-enabled repeat | 0.972s | 0 | 0 bytes |

The **175,188-byte font reduction is verified in production**. The same-session cold homepage latency changed by only 56ms; this is not a statistically established speed improvement. Both cold samples remain above the **2.5s LCP target**. Retain them and continue diagnosis rather than selecting only the faster repeats. Field p75, real interaction latency and consent-safe genuine inquiry observations remain open. No new tracking or paid infrastructure was enabled.

## Remaining acceptance and continuation

The seven missing public opening pairs and the old Media/Research recaptures are complete for their named desktop/mobile states. The Studio pagination and responsive heading/card fixes, ten focused accessibility scans, 74 additional manual contrast dispositions, and unchanged local protected rows are documented in `M10-PENDING-COMPLETION.md` and `m10-pending-evidence.json`.

Full M10 acceptance remains partial. The remaining work is full section/scroll/child/create/edit/print/hover/focus comparison across the registers; actual native 200%/400% browser zoom; real screen-reader and physical-phone tasks; independent Hindi/Gujarati meaning review; outstanding factual/media-rights confirmation; cold-loading diagnosis; and field/real-inquiry evidence. Several old libraries have no populated records, so their corresponding populated-detail comparisons lack reference data. Do not invent evidence or mark these passed from release success.

The QA server and isolated PostgreSQL were stopped cleanly with data retained. Temporary browser viewport, CPU and network settings were reset. No scheduled continuation exists. Continue from this receipt without resetting QA or replaying any publication. Scrapers, old-product transfers and backups remain excluded. Recovery for these changes is a reviewed code revert; no protected-data rollback is needed.

Machine-readable receipt: `m10-pending-release-evidence.json`. Private production digests, screenshots, timing details and logs remain under ignored `test-results/old-design-migration/`. This receipt is documentation only; it does not change the application fingerprint.
