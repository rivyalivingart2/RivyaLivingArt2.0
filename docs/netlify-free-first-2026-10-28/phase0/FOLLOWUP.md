# Phase 0 read-only follow-up — 28 October 2026

This supplements the original audit before the locally prepared Phase 1 architecture. It supersedes the earlier blanket browser-unavailable and billing-detail-unavailable observations only for the facts below. No external writes were performed.

## Browser

An existing Chrome tab handle worked even though new tab binding continued to time out. Its initially visible authenticated overview was stale: opening Products redirected to login. That overview is **not** evidence of a currently valid session or working authenticated product workflow. No password, stored cookie or recovered token was used.

The current public login and homepage rendered in the real browser. Login was visually inspected at desktop and a measured `window.innerWidth` of 320 CSS pixels. At 320, height was 900, document client width 301 and scroll width 301; the form actions were reachable by scrolling. This is a limited public-login observation, not full responsive or authentication acceptance.

Live Creations interactions:

| Action | Observed result |
|---|---|
| Initial gallery | 169 images, showing 1–12, page 1 of 15 |
| Category Clock | 18 images, showing 1–12, page 1 of 2 |
| Next | Showing 13–18, page 2 of 2, Next disabled |
| Keep Clock and search 030 | One matching image, page 1 of 1 |
| Search deliberately absent text | Honest no-images-match state |
| Reset filters | All creations, 169 images, page 1 of 15 |
| Gallery at measured 320 CSS pixels | Client/scroll widths both 301; controls and single-column cards visually inspected |

The browser viewport override was reset and the existing tab returned to the public Studio login. Screenshots were inspected through the browser tool; no complete seven-width comparison artifact was produced. Authenticated old/new Studio parity, full keyboard/motion/error coverage and the required 1920/1440/1200/992/768/512/320 matrix remain open.

## Recovery objects

Search omitted the existing backup folder's children. Direct folder fetch returned seven designated encrypted archives totaling 819,900 bytes. Fresh metadata for all seven is unshared with owner-only permissions. Latest provider creation is 3 October 2026 at 20:33 UTC, over 24 days before this observation. This does not establish current backup coverage, hash/decryption verification or restoration. The known operator config and latest verified receipt were absent in the old local operation folder. No backup schedule restarted and no archive was removed.

## Retained Vercel billing

The connected team still reports Pro. A single month-range query exceeded the tool's result limit; four bounded queries covering 1 October 00:00 UTC through 28 October 00:00 UTC returned complete summaries for 23,265 records. All four windows include nonzero billed cost. These are **team-wide billing records**, not this project's attributed cost, a settled invoice, confirmation of card payment or trial status. Private monetary values and account/resource IDs are excluded. No plan or billing setting changed.

[Sanitized provider summary](followup-provider-summary.json) records the windows and metadata scope. Google capacity, exact installed gateway/renewal binding, five Google acceptance checks, current restore and remaining Vercel configuration details remain unverified.
