# Editorial and language acceptance — 6 October 2026

**Update:** PR43 has now released the source improvements to main and Vercel Production. The first two full article meaning corrections (DB001/DB010, 78 values) are saved locally and as unreviewed Studio drafts; 34 articles still need complete meaning review. Current hosted mobile LCP is 3.301s in one fresh sample, with no field data. See `RELEASE-43-AND-FOLLOWUP.md` for current release identifiers, checks, draft revisions and remaining acceptance. The narrative below records the earlier pre-release handoff.

The feasible production page work is published. Source improvements are local on `codex/remaining-editorial-acceptance`; this pass did not push, merge or deploy application code. Overall acceptance remains partial because independent language review, owner crop approval and real human/device/visitor/customer evidence have not occurred.

## Published through Studio

- Architects, Accessibility, Delivery, Terms, Changes and cancellations, Imprint and Privacy now have Hindi and Gujarati translations: **184 translated field values across seven pages**. Both saved language previews were inspected, publication was deliberate, and anonymous public revisions were verified.
- All **19 public pages** now have complete, current Hindi/Gujarati translation status. This status records assistant meaning review, not independent native-reader approval.
- Privacy now matches the previously approved retained-records wording. It no longer promises the removed routine backup feature. Obligations for existing restricted archives, legal retention and erasure replay remain.
- The wall-art article DB010 now uses the existing Horizon wall-panel image. Saved revision 2 passed desktop and mobile visual review; public revision 3 was verified in Studio and on the public page. No product gallery or media association changed.
- The final bounded read confirms unchanged fingerprints for 120 products, 131 original media records/associations and business settings. Five existing editorial assets bring the media inventory to 136. Phone, email, social/business facts and customer records were not edited.

## Prepared locally

- Public-interface translations cover FAQ search/groups/reset, journal filters/counts, navigation/reading controls, product-gallery and enlargement controls, saved-piece feedback, static product guidance, captions, pricing labels and fallback states. Stored product descriptions and names remain original.
- Saved translated previews retain the translated image description while using the captured media path/crop. The Imprint retains its translated contact heading while binding factual contacts to published business settings.
- Newly captured home/journal article cards include only current reviewed title/category/description/image-description translations. Older snapshots keep their captured English labels until deliberately previewed and republished. No full translation documents or private fields were added to public card payloads.
- All 36 articles have Hindi/Gujarati machine-assisted drafts: **1,002 translated field values and 72 Studio import files**. **They are not marked reviewed or published.** Full paragraph meaning review is still necessary; corrected category terminology and image descriptions do not certify the remaining text. The complete generation receipt is `article-review.json`.
- The local `editorial-language-review.html` output shows English beside both languages, exact source fingerprints, unchecked native-review controls and exportable reviewer notes. It cannot publish content.
- `source-baseline.json` retains only the historical public English fields used for reproducible pack generation. It contains no customer records or private drafts. Apply the documented Privacy/DB010 source amendments and compare against current Studio English before importing; do not treat this historical baseline as current content approval.
- All 136 assets were visually inspected on 17 portrait/wide comparison sheets. `image-review-inventory.json` records every editorial assignment and protected catalogue use. Actual layout checks cover the River Channel gallery/enlargement and DB010 desktop/mobile cover. This is not owner approval of all 120 product pages or all responsive crops. Wide crops of tall objects and repeated River Channel article covers still need deliberate editorial decisions.

## Verification

Full local check passed: 294 unit tests, 12 preflight checks, 403 built-server checks, typecheck and production build. Four additional translation/snapshot regressions cover reviewed-versus-stale labels, captured dependency immutability, translated preview alt text and protected Imprint contact binding. Final small label additions passed a fresh typecheck, lint and build. Lint has no errors; existing warnings remain.

Browser checks used a production build against isolated loopback PostgreSQL. Hindi/Gujarati FAQ search, empty state and reset passed. Gujarati gallery navigation, arrow keys from gallery controls, Escape/focus return, save/remove feedback, search dialog, final pricing/caption labels and the recorded 390px FAQ layout passed. The final product-page console had no errors. No production synthetic inquiry was submitted.

The protected-data read had one network timeout; a later bounded retry succeeded. This was not evidence of an application outage. Broad QA stayed off the shared live Neon database.

## Acceptance still open

Independent native-reader review; full owner content/crop sign-off; actual screen-reader use; physical-phone testing; real-user performance; and observation of a confirmed legitimate business inquiry. The owner previously confirmed that phone/screen-reader equipment is unavailable. The retained PageSpeed report was reopened and still says **No Data** for real users. Its 2.476s mobile lab LCP is one sample from the previous release, not a field percentile or a performance test of these local interface changes.

Read `HUMAN-ACCEPTANCE.md` for precise tasks and evidence fields. No artificial traffic, invented approval, fake customer inquiry, new analytics tracking or automatic WhatsApp sending was used to close these gaps. Backups/key custody remain outside the project at the owner's instruction.

When the owner explicitly requests a release, create a detailed PR for this local candidate, verify its final checks, merge through the PR and confirm Vercel production. Preview/public language checks should then be repeated on that deployed code. Keep any newer Studio drafts intact.
