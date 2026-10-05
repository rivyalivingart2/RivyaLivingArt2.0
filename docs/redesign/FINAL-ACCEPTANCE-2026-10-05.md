# Final acceptance follow-up — 5 October 2026

**Overall acceptance remains partial.** Production content work below is complete. New application changes are local on `codex/final-acceptance-traffic`, based on released main `8628480d9e4939590293119800921225dc3b84c7` (PR #38). No new push, merge, deployment or environment change occurred.

The owner authorized the listed production content work and renewed Studio sign-in. Indexing is approved **with the next approved release**, not immediately.

## Production verification

- The signed-in Neon console confirms the owner's **Launch** upgrade. The previous Free 5 GB cap is historical. The new usage period begins 5 October; delayed zero counters are not evidence of zero consumption. The agent made no billing change.
- Preview/Production still share the recovered `neondb`. No deletion, reconnection, migration or grant occurred.
- The final bounded read at **11:50:14 UTC / 17:20:14 IST** returned 200 on 17 public routes/endpoints. Studio authenticated and normal content/media editors were exercised.
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

Total: **366 translated field values**. This is assistant meaning review, not independent native-speaker sign-off. Product/business facts stay in their source values. Manual WhatsApp sending, specification/timing uncertainty and illustrative-image qualifications remain explicit.

The remaining **36 journal articles and ten other page records** still use English fallback. Shared UI labels and complete language journeys need final native-reader review. No unreviewed translation was published.

## Local application improvements

1. **Database list projection:** compact unselected records are produced inside SQL before transfer. Selected records retain complete exact drafts/snapshots. Original JSONB equality computes draft state, preserving body-, translation- and snapshot-only changes.
2. **Publication validation:** warm reads transfer a 32-character digest of ordered membership, route/kind, revision and full-document fingerprints. Every request validates; withdrawals remain immediate; storage errors fail closed. Full source and digest share one SQL snapshot. No TTL/stale fallback was added.
3. **Local QA:** dedicated loopback PostgreSQL uses source fixtures only. Broad C6 runners reject the former QA connection on the live Neon project. Local transport refuses remote SQL and preserves transaction isolation/read-only behavior.
4. **CSS and images:** Tailwind scans application sources, excluding reports/examples. Global CSS fell from 162,374 to 53,061 raw bytes (gzip 26,151 to 11,363). Graph CSS chunking separates Studio-only overview styles from public pages. Footer logo sizes now match its actual layout.
5. **Preview repair:** collection/journal exact previews now include the expected revision marker; the absent marker previously produced a false failure around otherwise rendered content.
6. **SEO preparation:** sitemap/metadata exclude private, search, saved-piece and customization flows. Preview/hold remain closed. Share images follow the published approved hero. No social posts/accounts changed.

Production full documents measure **1,366,786 bytes**, versus **75,249 bytes** of candidate compact rows. Different serialized envelopes make these indicative sizes, not guaranteed wire savings. The matching-envelope synthetic test measured **252,857 → 1,282 bytes (99.49%)**. The digest value is 32 bytes; its JSON envelope is larger.

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

A bounded [PageSpeed collection audit](https://pagespeed.web.dev/analysis/https-www-rivyalivingart-com-collectible-design/s92bdjkvqc?form_factor=mobile), 16:06 IST, measured **LCP 3.539s**, FCP 1.501s, TBT 69ms, CLS 0, performance 90 and no real-user data. Local CSS/database fixes are not deployed.

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
| New source release | New explicit push-main request, detailed PR, exact-head checks, PR merge and verified Vercel deployment. No direct main push. |
| Indexing | Owner approved next release: Production-only SITE_INDEXABLE=true, then verify robots/sitemap/canonical/private exclusions. |
| Hosted mobile target | Test deployed candidate with current assets, intended region and cold CDN/image/server conditions. Current hosted collection: 3.539s. |
| Real-user performance | Eligible real traffic; lab menu timing is not p75 INP. No invented analytics or unapproved tracking. |
| Human/device | NOT RUN; owner has neither available. Existing checklist awaits tester/equipment. |
| Remaining editorial/language review | Ten other pages, 36 articles, shared labels and remaining gallery crops; native-reader review and deliberate publication. Keep English fallback meanwhile. |
| Genuine business evidence | Real approved portfolio/testimonials/consent and observation of a legitimate inquiry; do not fabricate them. |

Video, new-product media associations, workshops/supplies/3D offerings, unconfirmed legacy URL identities and conversion analytics remain conditional. **Backups/key custody remain removed by owner.** Draft/revision recovery remains supported.

## Evidence and reconciliation

Sanitized receipt: [final-acceptance-evidence-2026-10-05.json](final-acceptance-evidence-2026-10-05.json). Tooling: `tools/final-acceptance` and `tools/c6-acceptance/README.md`. Raw/private receipts stay ignored in `test-results`.

Workspace `outputs` screenshots: `imprint-live-2026-10-05.jpg`, `home-gu-live-2026-10-05.jpg`, collection/memory/personal/process mobile images and `journal-gu-live-2026-10-05.jpg`.

PRs #37/#38 supersede older source-release-pending rows; the old Imprint 404 and Free quota state are historical. The register now separates the released base from this unreleased follow-up. C6 and overall acceptance remain partial for the explicit limits above.

