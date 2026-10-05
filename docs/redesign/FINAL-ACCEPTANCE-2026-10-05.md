# Final acceptance follow-up — 5 October 2026

**Overall acceptance remains partial.** The database, CSS, preview and SEO improvements below were released through [PR #39](https://github.com/rivyalivingart2/RivyaLivingArt2.0/pull/39), main `0d03d8f099b8bf5026e010ee35a68bc47740ecde`. Its exact Vercel production deployment `dpl_5SiSZeGuU23F3EvjZrkNAnDJXoP2` reached READY. The opening-image preload follow-up is separately reviewed on `codex/hosted-loading-editorial`; its PR/deployment receipt establishes release status, not this source report.

The owner authorized the listed release and production content work. Production indexing is now enabled and verified; Preview remains excluded. Studio sign-in expired after the twelve-page editorial pass. Further publication needs renewed sign-in; saved and published revisions remain intact.

## Production verification

- The signed-in Neon console confirms the owner's **Launch** upgrade. The previous Free 5 GB cap is historical. The new usage period begins 5 October; delayed zero counters are not evidence of zero consumption. The agent made no billing change.
- Preview/Production still share the recovered `neondb`. No deletion, reconnection, migration or grant occurred.
- The latest bounded read at **18:02:48 UTC / 23:32:48 IST** returned 200 on 17 public routes/endpoints. Authenticated content/media workflows were exercised earlier; the session has since expired.
- Fingerprints match for **120 catalogue records**, **131 original media records/associations** and **business settings**. Five deliberate new editorial records bring media to 136; content contains 55 records.
- No customer inquiry/order, staff permission, protected product/form, social account, phone or email was edited. No real customer inquiry was manufactured.

### Imprint: previous 404 resolved

The factual source was saved at revision 1, reviewed in exact private preview and published at revision 2. Anonymous content and the footer link work. Revision 1 was recovered into **new saved draft revision 3**, leaving public revision 2 unchanged. Its intentional “Changes pending” state demonstrates draft recovery.

Approved contacts remain **+91 8320404132** and **rivyalivingart2.0@gmail.com**. No registration, legal promise or effective date was invented.

### Images and page content

Five owner-designated Drive images were matched against manifest file hashes, visually reviewed, imported under fresh production identities and published at media revision 3. All have empty product associations.

| Asset | Production placement | Classification |
|---|---|---|
| hero-pour.jpg | Homepage opening | Design visualization |
| doorway-collectible.jpg | Homepage doorway and collectible collection | Design visualization |
| doorway-memory.jpg | Homepage doorway and memory collection | Design visualization |
| doorway-gifts.jpg | Homepage doorway and personal-art collection | Design visualization |
| maker-hands.jpg | Process opening | Illustrative scene; explicitly not a photograph of Rivya staff |

Desktop composition and three collection/process mobile crops were inspected. Homepage Hindi geometry at 390px had no overflow or clipped headings/actions; Hindi/Gujarati desktop previews were reviewed. These are browser checks, not physical-phone evidence.

Homepage hero/doorways and three journal references now publish from Studio. The three collections, search, commission and journal landing have published editable copy. Process retains its existing four-step text with the new opening. This does not certify every older QA-only detailed chapter, article cover or gallery crop.

### Hindi and Gujarati publication

Each language was translated, meaning-checked against English, marked reviewed, saved, previewed at the exact revision and published. Final database checks confirm complete current review state.

| Page | Fields per language | Public revision |
|---|---:|---:|
| Homepage | 63 | 5 |
| Collectible design | 24 | 4 |
| Memory art | 24 | 4 |
| Personal art | 20 | 4 |
| Search | 8 | 4 |
| Commission | 16 | 4 |
| Process | 14 | 5 |
| Journal landing | 5 | 4 |
| Contact | 9 | 3 |
| Our story | 10 | 3 |
| Materials & care | 16 | 3 |
| FAQ | 27 | 3 |

Total: **472 translated field values** across twelve pages. This is assistant meaning review, not independent native-speaker sign-off. Product/business facts stay in their source values. Manual WhatsApp sending, specification/timing uncertainty and illustrative-image qualifications remain explicit. The latest read confirms all 24 language records are current/reviewed with zero missing fields. Story, materials and FAQ saved revision 2 previews were inspected in both languages before publishing revision 3 and verifying anonymous publication.

The remaining **36 journal articles and seven other page records** still use English fallback: architects, privacy, terms, shipping/delivery, returns/cancellations, accessibility and Imprint. Shared UI labels and complete language journeys need final native-reader review. No unreviewed translation was published.

## Released application improvements

1. **Database list projection:** compact unselected records are produced inside SQL before transfer. Selected records retain complete exact drafts/snapshots. Original JSONB equality computes draft state, preserving body-, translation- and snapshot-only changes.
2. **Publication validation:** warm reads transfer a 32-character digest of ordered membership, route/kind, revision and full-document fingerprints. Every request validates; withdrawals remain immediate; storage errors fail closed. Full source and digest share one SQL snapshot. No TTL/stale fallback was added.
3. **Local QA:** dedicated loopback PostgreSQL uses source fixtures only. Broad C6 runners reject the former QA connection on the live Neon project. Local transport refuses remote SQL and preserves transaction isolation/read-only behavior.
4. **CSS and images:** Tailwind scans application sources, excluding reports/examples. Global CSS fell from 162,374 to 53,061 raw bytes (gzip 26,151 to 11,363). Graph CSS chunking separates Studio-only overview styles from public pages. Footer logo sizes now match its actual layout.
5. **Preview repair:** collection/journal exact previews now include the expected revision marker; the absent marker previously produced a false failure around otherwise rendered content.
6. **SEO preparation:** sitemap/metadata exclude private, search, saved-piece and customization flows. Preview/hold remain closed. Share images follow the published approved hero. No social posts/accounts changed.

After the twelve-page language pass, production full documents measure **1,443,146 bytes**, versus **75,249 bytes** of compact rows. Different serialized envelopes make these indicative sizes, not guaranteed wire savings. The matching-envelope synthetic test measured **252,857 → 1,282 bytes (99.49%)**. The digest value is 32 bytes; its JSON envelope is larger.

## Validation

### Local mobile loading

Compiled local server, source-only loopback PostgreSQL, cold browser cache per sample, 390×844 DPR3, CPU4×, 150ms latency, 1.6Mbps download. **All seven medians and 21 samples meet 2.5 seconds.**

| Page | Median LCP |
|---|---:|
| Homepage | 1.608s |
| Collection | 1.708s |
| Product | 1.508s |
| Custom brief | 1.384s |
| Process | 1.656s |
| Studio inquiries | 1.520s |
| Homepage editor | 1.524s |

Maximum CLS: 0.0832; maximum menu interaction diagnostic: 176ms. After the final footer-size adjustment, focused homepage/process medians were **1.724s / 1.688s**.

Server/image caches may be warm. Fixtures use representative static imagery, not the exact newly published production Blob media/translations. Earlier slow diagnostics remain retained. These local results do not establish hosted cold starts or real-user p75.

### Hosted loading: still open

The [post-release PageSpeed collection audit](https://pagespeed.web.dev/analysis/https-www-rivyalivingart-com-collectible-design/p5am6z0vv1?form_factor=mobile), 17:49 IST, measured **LCP 3.545s**, FCP 1.351s, TBT 125ms, CLS 0, performance 88 and no real-user data. Accessibility, best-practices and SEO scores were 100. These are automated results only.

The image breakdown reports 210ms TTFB, 960ms resource discovery delay, 1700ms load duration and 80ms render delay. The opening image, not animation, is the LCP element. The follow-up changes the single priority editorial image from eager/high fetch priority to Next's responsive preload; below-fold images remain lazy. It keeps quality, source, crop and protected media unchanged. A fresh full check passes (290 unit, 12 preflight, 403 built-server). Local rendered HTML contains one matching responsive opening-image preload; throttled browser inspection confirms it initiates through the link. This mechanism check does not certify the hosted 2.5s target.

### Released indexing

Production-only `SITE_INDEXABLE=true` was applied before the PR39 deployment. Preview remains false. Eighteen bounded live checks passed at 12:17:39 UTC: public pages return index/follow, private/transient routes noindex, protected API returns 401, unknown route returns 404, robots permits public crawling and the sitemap contains 174 unique allowed URLs. Preview robots separately returns `Disallow: /`. This enables crawling; it does not promise that Google has indexed the site.

### Other verification

| Scope | Result |
|---|---|
| Application | 290 unit tests; TypeScript; optimized build; changed-file lint; 12 preflight and 403 built-server checks |
| Real SQL | 45 local PostgreSQL assertions |
| Publication/recovery | 13 local assertions; pre-existing fixtures unchanged; synthetic fixture hidden with history |
| Exact preview | Collection/journal marker checks pass; missing revision rejected |
| Indexing | 19 local policy checks; private/Preview/hold boundaries preserved |
| Accessibility | 144 automated scans over 48 destinations/three widths; zero violations, overflow or uncaught page errors |
| Interactions | 73 assertions, ten state scans and 26 reflow observations |
| Images/motion | Ten scoped observations after final footer fix |
| Earlier zoom/contrast | Retained 99 native zoom observations and 98 assistant contrast states; not human certification |

The 403 built-server and 144/73 browser runs include graph CSS/SEO and precede only the footer image-size attribute adjustment. Final build, ten media/motion guards and focused performance include that adjustment. The 12 preflight/13 publication checks cover the earlier query candidate; later edits do not change those services. No application dependency was added.

## Remaining acceptance and next release

| Item | Next action |
|---|---|
| Requested source release | PR39 complete; exact main and READY production verified. Opening-image preload follow-up has separate PR/check/deployment evidence. No direct main push. |
| Indexing | Complete for the PR39 release: Production enabled; Preview/private/transient exclusions verified. Search-engine inclusion itself takes external crawling. |
| Hosted mobile target | Current post-PR39 collection: 3.545s. Verify preload follow-up with current assets and cold hosted conditions. |
| Real-user performance | Eligible real traffic; lab menu timing is not p75 INP. No invented analytics or unapproved tracking. |
| Human/device | NOT RUN; owner has neither available. Existing checklist awaits tester/equipment. |
| Remaining editorial/language review | Seven other pages, 36 articles, shared labels and remaining gallery crops; native-reader review and deliberate publication. Keep English fallback meanwhile. Studio renewal requested after session expiry. |
| Genuine business evidence | Real approved portfolio/testimonials/consent and observation of a legitimate inquiry; do not fabricate them. |

Video, new-product media associations, workshops/supplies/3D offerings, unconfirmed legacy URL identities and conversion analytics remain conditional. **Backups/key custody remain removed by owner.** Draft/revision recovery remains supported.

## Evidence and reconciliation

Sanitized receipt: [final-acceptance-evidence-2026-10-05.json](final-acceptance-evidence-2026-10-05.json). Tooling: `tools/final-acceptance` and `tools/c6-acceptance/README.md`. Raw/private receipts stay ignored in `test-results`.

Workspace `outputs` screenshots: `imprint-live-2026-10-05.jpg`, `home-gu-live-2026-10-05.jpg`, collection/memory/personal/process mobile images and `journal-gu-live-2026-10-05.jpg`.

PRs #37/#38/#39 supersede their older source-release-pending rows; the old Imprint 404, Free quota and indexing hold are historical. The register separates released source from remaining acceptance. C6 and overall acceptance remain partial for the explicit limits above.

