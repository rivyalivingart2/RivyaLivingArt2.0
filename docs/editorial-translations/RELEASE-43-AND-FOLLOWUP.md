# PR43 release and first article meaning-review batch

6 October 2026. The owner's current source release request is complete. PR43 merged all existing local work through the detailed PR into main. The subsequent article-correction work described below is saved locally on `codex/article-meaning-review` and in two unpublished Studio drafts.

## Released application

- PR: https://github.com/rivyalivingart2/RivyaLivingArt2.0/pull/43
- Application candidate: `bcf0302`; final PR head with authorization record: `531f4e698f36d60f7984048c47991f3ff7af63c3`.
- Merged main: `9e163d775a1dcc8fe43714a8c084bf84709f3c0b`.
- Vercel Preview: `dpl_SAF76wY2SvkHYVtLdrLmJ2NVHdGP`, READY, exact PR head. GitHub's Vercel status passed; no Actions workflows or review threads were returned. Merge used the expected head and no administrative bypass.
- Vercel Production: `dpl_3eBxhZHYJdHHzp5aJtuLC3TSC6Jq`, READY, exact merged main, built in approximately 27 seconds. The custom production domain resolves to this deployment; no alias error.
- Runtime error/fatal log queries for this deployment returned no rows in the observed 15/30-minute windows. This is a bounded observation, not a long-term error-rate guarantee.

The PR includes the full change inventory and previous 294/12/403 test evidence. The final four translation/snapshot/contact regression tests passed again before release. No application source changed after that check in this release.

## Live verification

- Gujarati FAQ search produced translated zero-result status, reset restored 12 answers, and switching to Hindi produced translated headings and zero-result feedback.
- Hindi Imprint retains its translated contact heading and the protected phone/email. `/imprint` returned 200 with `index, follow`.
- `/search` returned 200 with `noindex, nofollow`; `/studio/login` returned 200 with `noindex, nofollow, noarchive` in both metadata and response header.
- Robots and sitemap returned 200; the sitemap still contains 174 URLs.
- Authenticated Studio overview/content list loaded after the owner renewed sign-in. No inquiry/customer state was changed.
- Hindi River Channel gallery moved from image 1 to 2, enlargement keyboard navigation moved to image 3, and Escape closed it and returned focus to its opener. The product-page console returned no errors. Product facts remained in their original text. The original Gujarati browser language preference was restored afterward.
- The final bounded read at 05:17:28 UTC confirms 120 products, 136 media, 19 currently reviewed bilingual public pages and 36 articles. Product, 131-original-media/association and business fingerprints all match the protected baseline. It independently confirms DB001 draft 2/public 1 and DB010 draft 4/public 3.
- One initial HTTP verification process stalled; it was canceled and the five bounded requests above passed with explicit 25-second limits. This is not evidence that every production request timed out.

## Hosted mobile result — still open

Report: https://pagespeed.web.dev/analysis/https-www-rivyalivingart-com-collectible-design/7h634cksm7?form_factor=mobile

6 October, 10:28 IST, collection page, emulated Moto G Power, Slow 4G, initial load: **LCP 3.301s**, FCP 1.351s, TBT 284ms, CLS 0, performance 86. Automated accessibility/best-practices/SEO scores are 100. These do not establish human accessibility acceptance. The report says **No Data** for real users.

The 2.5s LCP target is not met in this sample. The earlier 2.476s PR42 sample does not close current acceptance or establish a statistically meaningful regression comparison. Do not keep rerunning until a passing score appears.

Diagnostic findings:
- The LCP element is the existing approved timber/blue-resin collection image. The report identifies request-priority improvement on its responsive preload.
- Reported LCP subparts: TTFB 210ms, resource-load delay 610ms, resource duration 410ms and render delay 330ms. These trace timings are not interchangeable with the simulated overall LCP value.
- Four long main-thread tasks: approximately 238/102/94ms in the reported JavaScript chunk and 152ms in the document. Render-blocking requests are another reported opportunity.

Next engineering work should inspect the generated responsive preload and client bundle/critical CSS against the installed Next.js version, change one factor at a time, run isolated QA, then compare the next authorized hosted candidate. No speculative application change or extra tracking SDK was added in this follow-up.

## First corrected article batch

The complete English text of DB001 and DB010 was used to rewrite both Hindi and Gujarati: **78 translated field values** across two articles. `article-corrections.json` records exact source hashes, scope and review notes. Generation verifies full field coverage, source match, target scripts, length and Studio import limits. Raw machine drafts remain preserved separately.

| Article | Current English source | Studio action | Result |
| --- | --- | --- | --- |
| DB001 — A Room Begins with a Statement Table | Hash `ab09e8950a7791db8ae917a7be8388caffc8433535e158cba0980df7528b253f`; aligned revision 1 before import | Both language dry runs passed, applied to unsaved editor, saved once | Draft 2; public 1 unchanged; both languages need review, 19/19 fields |
| DB010 — Wall Art at Architectural Scale | Hash `114574c52c1d1d060ac59a28e8bbad8c0e6e56f4dcb9692f40690f23c1896f03`; aligned revision 3 before import | Both language dry runs passed, applied to unsaved editor, saved once | Draft 4; public 3 unchanged; both languages need review, 20/20 fields |

The source check was read-only and exported public English only. No newer draft was overwritten. Corrections preserve proposals, visualization labels, access/installation caveats, photo-sharing rights and the absence of guaranteed dates or new catalogue offerings. No translation was marked independently approved or published. Studio previews that enforce reviewed-language fallback must not be described as approved translated previews.

The review packet now distinguishes these two assistant-corrected drafts from the 34 articles still awaiting complete meaning review. The DB001 review view shows 19 English/Hindi/Gujarati field groups, no horizontal overflow at the observed desktop width and both independent approval boxes unchecked.

## Still open

### Local Studio status-label correction

During the real article draft saves, the list retained its older server-supplied `Aligned` label while the editor correctly showed `Changes pending`. The local fix uses the server status only for compact rows whose full content has not been fetched. Full saved records are compared afresh, so translation-only changes show as pending and publication clears the label. It also covers homepage records through the shared list renderer. No data or API contract changes were needed.

Seven focused regression checks passed, including two new cases covering translation-only draft changes, compact summaries, publication and new drafts. Focused lint, type generation, TypeScript and the production build passed. This UI fix is **local only**, on the follow-up branch; it is not part of deployed PR43 and has not received a local browser save/publish cycle yet.

Complete meaning review of 34 articles; independent native review and deliberate saved-language preview/publication of all 36 articles; independent review of pages/interface wording; full owner content/gallery/crop sign-off; hosted loading improvements and real-user measurements; actual screen-reader and physical-phone checks; and a confirmed genuine business inquiry. Existing Studio inquiry rows do not establish genuine-customer provenance. No fake evidence, messages, analytics, backups or permissions were added.

Keep follow-up files local until the next explicit push request. The release receipt and new editorial corrections are follow-up documentation, not evidence that the 36 translations are public.
