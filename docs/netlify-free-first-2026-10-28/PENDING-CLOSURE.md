# Pending Phase 0/1 work — 28 October 2026

**Dated checkpoint, superseded for current implementation status.** The latest local capacity and recovery work is recorded in [Phase 2](phase2/README.md) and [current state](CURRENT-STATE.md). The earlier instruction below that Phase 2 had not started describes the preceding checkpoint. Full provider, restore, Studio and performance acceptance belongs to the phases assigned by the master brief; it does not block implementing the local foundations needed for those checks. The provider and browser observations below retain their original scope and date.

The owner requested completion of previous pending phases before starting the next step. This continuation closes accessible audit and provider-readback gaps and improves source measurement. **Phase 0/1 acceptance remains partial; Phase 2 has not started.** No branch was pushed, no PR changed, and no deployment or provider configuration was changed. The local application baseline remains `41cda9c`; this work builds on local architecture checkpoint `9a4c26b`.

## Existing Google writer: actual readback

The existing owner interface showed two Apps Script projects. Only the existing Rivya sandbox writer was inspected. Its saved `Writer.gs` matched the repository after LF normalization and removal of trailing whitespace: 14,804 characters / 182 lines. This compares the saved editor source; it does not independently hash the immutable source of deployed version 1.

Manage deployments showed version 1 from 24 October, executing as the intended owner and accepting requests from Anyone. The latter is the existing signed-HMAC entry point; the underlying workbooks are private. The script has zero triggers. No source, deployment, trigger, scope, sharing or key changed.

The existing Script Properties contained one correctly formatted signing key and four actual resource registrations. These were read through legitimate owner access into an owner-only, non-inherited local ACL file under ignored `test-results/netlify-pending-20261028/`. The endpoint came from the existing deployment dialog. No replacement key was generated and no registration was inferred from titles. This is a new observation of the existing configuration, not a claim that the original cloud registry file was recovered. Keep the entire private evidence directory out of Git and chat.

Four sequential requests through the repository's signed gateway client used action `read`. Signature/request binding and the registered workbook/sheet identities matched. **Zero commit requests** were sent.

| Existing sandbox | Canonical records | Ledger / audit / history entries each | Decoded snapshot bytes | Single read latency |
|---|---:|---:|---:|---:|
| Content | 1 | 3 | 16,568 | 3,180 ms |
| Operations | 2 | 10 | 68,468 | 2,875 ms |
| Security | 1 | 1 | 10,544 | 2,278 ms |
| System | 0 | 0 | 2,732 | 2,323 ms |

These are preserved pre-existing sandbox probes, not imported business records. Sizes are decoded JSON snapshots, not full signed HTTP response sizes. Four samples are not a p95 benchmark, source-scale test or five-check acceptance. The client verified a signed read, not full history semantics or the coordinator's operational readiness.

Independent Drive metadata for those exact registered workbook IDs confirmed four native Sheets, unshared and with only the intended owner permission. Each registration still permits 100 rows and 12 columns across five distinct tabs. [Sanitized ownership evidence](phase0/registered-sandbox-readback.json) contains no private resource IDs. An ordinary-editor identity is not present in these permissions; owner access cannot prove editor denial.

## Google storage entitlement

The owner's Drive/Google One interfaces showed a 5 TB entitlement. The membership page identified **Google AI Pro offered through Jio**. The observed account use exceeds the standard 15 GB free allowance. Detailed personal usage and private account evidence are not included here. No membership, billing or storage setting changed.

[Jio's offer](https://www.jio.com/google-gemini-offer/) and [terms](https://www.jio.com/jcms/en-in/jio-google-gemini-terms-and-conditions/) describe an eligibility-dependent benefit for up to 18 months. [The end-of-offer FAQ](https://www.jio.com/help/faq/mobile/offers/google-gemini-offer/what-happens-after-the-18-month-offer-period-ends/) describes a paid continuation if the subscriber chooses to continue. The account's actual expiry date was not observed. Do not budget the displayed 5 TB as an ongoing free tier or create a paid continuation. Expiry, post-offer capacity and safe quota-exhaustion behavior are unresolved architecture gates.

## Public browser and Studio access

Twenty-one real Chrome captures cover the existing homepage, Creations and login at measured widths 320, 512, 768, 992, 1200, 1440 and 1920 CSS pixels, with a measured height of 900. The browser's existing zoom required calibrated viewport requests; the report records actual DOM widths. None of the observations had document scroll width larger than client width. All 21 saved capture hashes were verified locally.

This is **partial visual evidence**. Home captures cover the viewport because full-page capture failed on the long mobile page. Some gallery full-page captures retain unloaded lazy images; later ordinary scrolling loaded all 14 page images at 320 pixels, but the recapture timed out. No broken-image conclusion is inferred from lazy placeholders. Screenshots show the existing Netlify badge overlapping part of the login help area and the homepage film controls at 320. Public and login source were preserved. The hero video subsequently reported readyState 4, playing, with no media error; this does not certify every video or device.

The local gallery `test-results/netlify-pending-20261028/public/index.html` links the captures and labels their limits. These observations do not prove authenticated old/new Studio parity, full-page responsive acceptance, keyboard/screen-reader behavior, reduced motion or physical-device verification. The viewport override was reset.

One normal Studio sign-in using the current Netlify configuration response was rejected with the generic invalid-credentials message. The older saved credentials were not submitted. Subsequent read-only checks did not establish that Netlify's returned values were usable deployed credentials; notably, the returned database value did not pass the expected connection-URL format check. Do not call this a proven production authentication defect or a successful credential readback. No credential rotation, password recovery, session extraction or authentication bypass occurred. Temporary login input was removed and visible fields were cleared. **The owner then signed in normally and confirmed “login done”; authenticated access is now verified.** No password was sent in chat.

The authenticated browser admitted all 36 inspected navigation routes without a login redirect or generic error boundary. Route admission is narrower than loaded-data/workflow acceptance: some first observations retained busy text, and only selected views were rechecked after settling. Products displayed 120 existing records over six pages. A nonsense search produced the honest empty result; Next and Prev changed the page correctly. The same existing product's read-only review, including its five disabled fields, matched after a full reload; the session also survived. All six product review tabs opened without dirtying the form. These observations are recorded in [the sanitized browser receipt](phase0/authenticated-browser-readback.json).

The selected product editor had no document-level horizontal overflow at all seven measured widths. This is geometry evidence, not visual parity or accessible/device acceptance. No save, publication, import, invite, customer message or other business mutation was submitted. The OLDWEBSITE login remains reachable; its authenticated reference is not established by the current site's session. The browser was left on that reference while measuring the source, to avoid further current-Studio session refreshes.

The rejected sign-in, the owner's successful sign-in and normal session refresh can update security records. It is therefore incorrect to describe the entire continuation as zero production writes; no business records, products or media were written.

## Source measurement and local implementation

The source-only reader now supports bounded pages and Unicode-safe row fragments. Each request is read-only; at most four continuation fragments are grouped into one transaction. The assembled rows must reproduce initial SQL projection fingerprints, and final schema/constraint/table fingerprints must still match. A timeout, short fragment, changed row, duplicate identity, loss of numeric precision or byte/request-budget breach rejects the report. No raw records are persisted. Earlier whole-response, row-page and serial-fragment attempts failed; none produced an accepted capacity report.

The capacity collector measures encoded inline records plus their initial history as a lower bound. Signed-response arithmetic accounts for nested escaping and duplicated raw/effective values, then conservatively subtracts both possible omitted blank metadata cells for every record and history row. It separately counts unmaterialized full documents and their payload bytes/characters. It excludes unknown Drive references, ledger/audit/control overhead, existing probes and future history. It generates no target IDs and certifies no provider capacity or migration. One bounded read correctly rejected a changed security-table fingerprint during owner sign-in.

**The final idle-browser run succeeded at 17:43:16 UTC.** It read 22 tables / 3,455 rows through 354 pages and 598 additional fragments in 497 bounded fragment batches, matching initial/reassembled/final fingerprints and all 36 schema/key constraints. Source JSON measured 54,650,938 bytes. Every one of the 20 business tables / 3,425 business rows still matched the earlier protected source fingerprints. Only login-limit and session fingerprints changed; sessions increased from one to two following the owner's sign-in. No raw source rows were saved and no target writes occurred. [Sanitized source measurement](phase1/source-encoding-measurement.json) omits private source payload fingerprints.

The Content boundary's 1,900 inline rows plus their initial history alone need at least **68,553,028 normalized characters and 152,446,178 signed-response bytes**, exceeding the current maxima of 8 MiB characters and 8,000,000 bytes. The 310 unmaterialized documents add 20,537,481 payload bytes, with their target reference rows still excluded from those bounds. This demonstrates that the current whole-workbook encoding cannot support the real source. Raising the row ceiling cannot fix it. [Capacity remediation](phase1/CAPACITY-REMEDIATION.md) specifies the required bounded-read design and retained-history contract; it is not an implemented or provider-accepted replacement.

## Remaining prerequisites and reporting

| Work | Current evidence / remaining dependency |
|---|---|
| Implementation | Source-reader hardening, source capacity collector, tests and updated continuation records only; application runtime unchanged |
| Local verification | 43 focused source/migration/gateway/capacity tests passed; 1,198 protected files unchanged; targeted lint and final patch checks recorded in the verification receipt |
| Real providers | Existing owner-only registration and four signed reads verified. Immutable deployed source, renewable Drive/Slides credentials, five Google safety checks, actual quota/latency and ongoing-free capacity remain open |
| Authenticated Studio | Owner login and session across reload verified; 36 routes admitted; existing product search/pagination/read-only review verified. Full save/conflict/history/publication, old-Studio parity and replacement-store lifecycle remain open |
| Migration and recovery | No target copy or reconciliation. Seven old archive objects remain retained; current complete encrypted checkpoint, media-byte verification and isolated restore remain unproved |
| Cutover | No authority switch; SQL/Blob remain current authority |
| Production release | No push, PR update, merge, new preview or production deployment |
| Old-resource removal | None; Vercel, Blob, SQL and OLDWEBSITE remain protected |

Continue using these dated observations and the latest owner scope. Do not repeat the prior request for a local signing-key path: the existing writer readback is retained privately. Missing evidence must stay incomplete while local foundational implementation proceeds. The owner's later GitHub push instruction and exact destructive authorization remain separate requirements.
