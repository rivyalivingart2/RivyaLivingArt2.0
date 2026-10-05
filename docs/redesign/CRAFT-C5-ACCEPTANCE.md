# C5 — Studio acceptance and recovery

5 October 2026. Local branch `codex/c5-acceptance`, based on the completed PR #37 release. **The requested C5 permission, error-handling and publishing/recovery work is complete in isolated QA.** C6 has not been started by this acceptance pass. This candidate has not been pushed or deployed.

## What changed

- Expired sessions now open the sign-in recovery banner even when an intermediary returns an HTML 401 response. Unsaved editors stay mounted; successful access renewal does not discard their values.
- Navigation reload failures are caught, retain existing values and explain how to retry. An unavailable initial read no longer looks like an indefinite loading state. All navigation editing controls are disabled while publication is pending.
- Successful media retries clear the previous failure message. Content, homepage, catalogue and media recovery refuse to replace the editor when the requested saved record is absent.
- Catalogue, media, navigation, contact settings and staff-session revocation distinguish a committed change from a failed follow-up read. Their message tells staff to reload before another change, preventing an unnecessary repeat of the successful operation.
- Activity/settings refresh failures label retained results as potentially stale. Export-tracking failures are visible and recoverable through Refresh.
- Editors now respond to their available column width as well as the viewport. Enlarged catalogue and image controls stack before their fields become cramped; crop legends wrap within their fieldsets.
- The acceptance runners use in-memory credentials, a pinned QA database/role/store and a check that the local server's newly issued session exists in that QA database. Synthetic fixtures are closed, hidden or disabled with history retained.

## Accepted journeys

| Area | Evidence |
|---|---|
| Permissions | Anonymous requests are denied; administrators can read their modules; editors see their assigned inquiries and permitted editorial tools. Staff, settings, exports, route review, assignment and publication boundaries are enforced by the real APIs. Product publish/hide and media publication are also denied to editors. Direct administrator-only browser routes show the access restriction. |
| Concurrent and failed changes | Real stale inquiry/content/staff versions return 409. Browser-controlled 503, 409, 401, network interruption and truncated-response cases retain local edits and do not retry writes automatically. Staff and protected editors retain their values during access renewal. |
| Publishing | A synthetic page is saved, opened through its exact saved website preview, published and verified anonymously by revision. A new draft leaves the old public revision intact. A deliberately failed public verification is retried without a second publication. |
| Recovery | The local draft can be copied, reload can be cancelled, unavailable records leave the editor intact, and explicit reload restores the saved version. Saved revisions can be compared and restored into an unsaved draft; saving and publishing recovery creates a new revision while preserving history. |
| Inquiries | Native close cancellation retains the note; failed note saves retain text; a successful note returns through the actual record read. A concurrent follow-up change blocks the stale write while preserving the local date. Browser Back preserves the dirty inquiry. No customer message is sent. |
| Initial/stale reads | Seventeen route/load cases cover all 16 modules plus the shared workspace shell. Every initial failure has a working retry. Ten refresh cases retain previous controls/records and display failure feedback. Export tracking and contact reload have separate checks. |
| Keyboard/layout | All 16 modules were checked at 1440, 720 and 390 CSS pixels. Mobile modal focus wraps, Escape returns focus, product tabs support arrow/Home/End keys, and the page finder focuses the destination heading. Enlarged-layout evidence is recorded separately in the acceptance receipt. |

## Validation and protection

The final receipt is `craft-c5-acceptance-evidence.json`; it identifies the source commit and individual checks. The complete local code check passes: **283 unit tests, 12 preflight tests and 403 built-server tests**, TypeScript and optimized build. Repository-wide lint has zero errors and 62 existing warnings; the changed components, new tests and acceptance runners pass scoped lint without warnings.

The service matrix contains 90 assertions. The full browser journey contains 23 checks, with separate suites containing 36 protected-editor checks and eight administration checks. Forty-eight reflow observations, 18 keyboard checks and 16 automated 200% CSS-zoom checks cover the 16 modules. A held-request test confirms navigation cannot be edited during publication and retains values if that request fails. These counts describe their recorded scopes and must not be presented as human usability certification.

All 120 existing products, forms, galleries and associations, all 136 media records, business/contact values and every pre-existing content, inquiry, order and staff row were compared before and after the relevant fixture run. They remain unchanged. Temporary QA staff/inquiries/pages are synthetic additions; they were disabled/closed/hidden, and their audit/revision histories remain. An explicit final retirement check confirms no active staff, open orders or public pages from these runners. Two earlier manual test fixtures needed a separate audited closing step; that correction is recorded in the retirement receipt.

Protected-editor post-commit/read-failure checks simulate acknowledgement entirely inside the browser. They do not claim a real product, media, navigation or contact publication. Positive saved/public/recovery proof uses synthetic content only. There were no production writes, product imports, customer messages, private exports, erasures, backup operations or new privileges.

## Remaining work after C5

C6 still owns measured loading/performance acceptance, the wider accessibility matrix, native browser zoom review, actual human screen-reader use and physical-phone checks. Automated viewport/zoom checks are explicitly labelled as emulations. Optional C2 video and production editorial acceptance remain separate; the last recorded production Imprint result was 404, and this C5 pass did not publish it or recheck production.

Project backup generation, scheduling and key-custody gates remain removed by the owner's 5 October instruction. Studio draft/revision recovery remains supported.

Keep this candidate local. A future explicit push-main request must use a detailed PR and current release verification. The earlier PR #37 authorization has already been fulfilled.

## Repeating the checks

See `tools/c5-acceptance/README.md`. Run fixture-writing suites sequentially against the verified isolated environment. Do not copy QA content/media identities to production. The screenshot review is in the workspace's `outputs/CRAFT/c5-acceptance.html`; historical C5 presentation screenshots remain in `c5-implementation.html`.
