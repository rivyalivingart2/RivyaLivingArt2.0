# C6 human and device checks — pending

The owner confirmed on 5 October 2026 that neither a physical phone nor a screen reader is available for this pass. No human or physical-device result has been recorded. Automated Chrome checks, accessibility-tree assertions and touch/viewport emulation are separate evidence.

## Test environment and receipt

Use an authorized HTTPS preview of the exact candidate when it becomes available. The local address `127.0.0.1:4194` is accessible only on this computer; opening it on a phone would open that phone's own loopback address. A production check of an older release cannot certify the local C6 candidate. Keep authenticated Studio testing on isolated QA with synthetic data.

Record the source commit, tested URL (omit credentials and private receipt tokens), date, tester, physical device/model, OS version, browser/version, screen-reader/version and settings. Mark each case PASS, FAIL or NOT RUN with a short observation. Record actual announced words for failures. Do not paste customer records, passwords, session cookies, private attachment links or authenticated receipts into evidence.

Suggested coverage: Windows with NVDA and Chrome; an actual iPhone with Safari/VoiceOver; an actual Android phone with Chrome/TalkBack. These are test configurations to obtain, not claims that they were used.

## Public website

| Case | Action | Expected observation | Status |
|---|---|---|---|
| H01 | Enter home, use heading and landmark navigation | Correct language/title; one main landmark; logical heading sequence; image descriptions distinguish informative and decorative images | NOT RUN |
| H02 | Activate skip link using only a keyboard | Focus lands in main content and remains visibly identifiable | NOT RUN |
| H03 | Open mobile navigation and search; move forward/backward; close using Escape or screen-reader action | Modal name is announced, background is unavailable, no focus escape, opener regains focus | NOT RUN |
| H04 | Search, choose a category, remove one filter, then use Back | Results/count and applied filters agree; changes are announced without losing the user's place | NOT RUN |
| H05 | Use product gallery arrows/thumbnails and enlarged image | Current image and position are announced; previous/next and close are named; focus returns to the opener | NOT RUN |
| H06 | Trigger required customization errors, correct one and go Back | Error summary and invalid field are announced; explanation is associated; answers remain; no unsolicited initial autofocus | NOT RUN |
| H07 | Complete a synthetic QA brief and review it | Labels, required state, step and review values are understandable; private references remain private; no real customer message is sent | NOT RUN |
| H08 | Read saved synthetic receipt after an interrupted response | Saved versus unsaved state is clear; recovery is possible; WhatsApp remains an explicit manual action | NOT RUN |
| H09 | Search FAQ; open a result and follow its anchor | Result count is announced appropriately, disclosure state is clear, heading is not covered by the header | NOT RUN |
| H10 | Read story/process/materials/journal and policy pages | Reading order follows the visible chapters; captions and links have meaningful context | NOT RUN |
| H11 | Request Hindi/Gujarati with reviewed-language policy | HTML language, announced language and displayed fallback agree; no mixed-language journey is labelled reviewed | NOT RUN |

## Real phone and native zoom

| Case | Action | Expected observation | Status |
|---|---|---|---|
| D01 | Portrait and landscape; scroll long home, collection and editorial pages | No accidental horizontal page scroll, clipped controls or sticky content covering text | NOT RUN |
| D02 | Open keyboard in search and each brief step, then dismiss it | Active field and errors remain visible; iOS does not unexpectedly zoom ordinary text inputs; actions remain reachable | NOT RUN |
| D03 | Swipe gallery horizontally and scroll vertically; pinch zoom | Horizontal gesture changes images; vertical gesture scrolls; pinch zoom stays available | NOT RUN |
| D04 | Enable the phone's Reduce Motion setting | All content remains readable; no unnecessary entrance animation or forced scrolling | NOT RUN |
| D05 | Use native desktop browser zoom at 200% and 400%, including open menus and Studio editors | 49 destinations passed actual native zoom geometry/reflow and assistant screenshot review; six dialog/focus checks passed. Human operation remains separate | AUTOMATED NATIVE PASS; HUMAN NOT RUN |
| D06 | Use slow/mobile network, lose connectivity mid-brief and reconnect | Typed data remains available; retry/state messages are understandable; no duplicate save or automatic message | NOT RUN |

## Authenticated Studio

| Case | Action | Expected observation | Status |
|---|---|---|---|
| S01 | Traverse sidebar/page finder and each of the 16 modules | Current destination, headings, record names and actions are announced; page-finder navigation focuses the destination heading | NOT RUN |
| S02 | Open an inquiry, type a note, attempt to close, then cancel | Dialog and unsaved warning are understandable; typed text and focus are retained | NOT RUN |
| S03 | Change a synthetic page, preview, publish, verify and recover a revision in QA | Draft, saved, published and verified states remain distinguishable; success/failure announcements are not duplicated or missed | NOT RUN |
| S04 | Renew an expired session and encounter a controlled conflicting edit | Local work stays available; sign-in and conflict messages are announced; no silent repeat publication | NOT RUN |
| S05 | Inspect protected catalogue/media/settings controls as an editor role | Restricted actions are absent or explained; role restrictions are not conveyed only by colour | NOT RUN |

## Assistant review completed; human use still required

The local candidate now has 98 desktop/mobile contrast states, 2,284 measured text cases (minimum 5.26:1), public screenshot inspection and 36 focused follow-up assertions. Badge surfaces, named groups and repair-link styles were fixed. Clipped scroll-container controls and an explicitly empty follow-up table have recorded dispositions. Actual native 200%/400% zoom passed 49 destinations. These results close the recorded assistant/browser scope, not human screen-reader use, phone testing or WCAG conformance. See `CRAFT-C6-CHECKPOINT.md` and `craft-c6-evidence.json`. Source guidance: [W3C Easy Checks](https://www.w3.org/WAI/test-evaluate/preliminary/) and [Web Vitals lab versus field](https://web.dev/articles/vitals).

Performance acceptance requires eligible real-user p75 evidence after an authorized release. No tracking service, paid device service or production publication is activated by this checklist. Backup and recovery-key custody work remains removed from the project.
