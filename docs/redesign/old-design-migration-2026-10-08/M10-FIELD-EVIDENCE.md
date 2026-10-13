# M10 field and real-world evidence — 12 October 2026

**CrUX Vis explicitly reports no available data for the canonical origin in its Phone view.** On 12 October 2026, the coordinating agent opened the normal dashboard UI and captured “CrUX data is not available for https://www.rivyalivingart.com/”. The screenshot was independently opened and inspected: the visible heading identifies “this origin on phones.” This resolves the availability check for that displayed scope, while field-performance acceptance remains open. No field LCP, INP or CLS value is claimed, and no Desktop/All-device/other-URL result is inferred.

## Exact lookup results

| Resource or attempt | Actual result | What it establishes |
| --- | --- | --- |
| **Normal CrUX Vis origin-report browser UI, 12 October 2026** | The visible report says “CrUX data is not available for https://www.rivyalivingart.com/”. The heading specifies this origin on phones. The actual PNG was opened and inspected independently. | An explicit no-data result for the displayed origin/Phone view, distinct from the earlier quota error. The result does not identify the underlying cause, prove absence on every other scope, or pass field performance. |
| Existing anonymous PageSpeed Insights API attempt, `2026-10-12T14:22:48.353Z` | HTTP **429**, `RESOURCE_EXHAUSTED`, daily Queries quota exceeded; `loadingExperience` and `originLoadingExperience` are null. Raw receipt: ignored `test-results/old-design-migration/m10-completion/field-data-query.json`. | A quota failure only. The endpoint was not blindly retried. This is not a CrUX “insufficient data” result. |
| Public PageSpeed report link for the canonical homepage, requested through the web-reading tool | The tool returned “not accessible via this tool”; no report contents or field record were obtained. | A limitation of this retrieval route. It says nothing about site eligibility or performance. |
| Official CrUX Vis homepage and the official origin-report link | The public app returned HTTP **200**. Text extraction returned zero content lines, including for the report link. | The app is reachable; its shell is not a completed field-data report. |
| Read-only inspection of CrUX Vis's public launch form and page module | The official form supplies the report link below. The page obtains data client-side from the CrUX History API using the app's configured client credential. | This identified the normal browser route subsequently used for the actual no-data result. No app credential was reused for an independent API request, and no origin/referrer restriction was bypassed. |
| Public search for the exact site plus “CrUX” or “PageSpeed” | No site-specific report was returned by those searches. | Search indexing does not establish CrUX inclusion or absence. |
| Google’s former Looker Studio CrUX dashboard | Official documentation marks this dashboard deprecated; its replacement is CrUX Vis. The deprecation notice describes continued BigQuery use under the user's own credentials. | It is not a reliable anonymous fallback worth creating a new account, key, billing project or copied dashboard for in this task. [Official deprecation notice](https://developer.chrome.com/blog/crux-dashboard-deprecation?hl=en). |

No monitoring automation, tracking code, analytics collector, API key or cloud project was created.

The decisive local evidence is `test-results/old-design-migration/m10-completion/crux-origin-no-data.png`, SHA-256 `832ded04fe910f4e3b68ccec0f21bcb65d29959adfd720f770869f86d7e2004b`. Its `.txt` companion records the tab and exact report URL but does not contain the no-data text; the inspected PNG supplies that evidence. These artifacts are in the ignored test-results folder.

## Concrete continuation for existing field data

The [official CrUX Vis origin report](https://cruxvis.withgoogle.com/#/?view=cwvsummary&url=https%3A%2F%2Fwww.rivyalivingart.com%2F&identifier=origin) has now been checked in the normal browser UI. For any later recheck or additional device/page scope, record the actual report state after loading with the origin, scope, selected device and observation dates visible. Use the canonical `www` origin; do not substitute the bare domain, a Vercel preview or localhost. Preserve explicit no-data messages separately from loading, quota and access errors.

When data exists, retain the exact origin/page scope, Phone/Desktop selection, collection-period start/end, retrieval time, p75 values and missing-metric states. Origin-level data does not establish a specific page's result. CrUX Vis shows weekly history whose points each aggregate a rolling 28-day period, so a point overlapping the release is not evidence solely about the new candidate. [Official CrUX Vis documentation](https://developer.chrome.com/docs/crux/vis).

The direct History API route requires a CrUX API key; no new key was created for this task. An already authorized report or normal dashboard result can provide the evidence without adding website tracking. [Official History API guide](https://developer.chrome.com/docs/crux/guides/history-api).

The observed no-data result resolves the availability question for the captured Phone/origin view, but it does not pass the field-performance target. The message does not establish whether popularity, eligibility or another reason accounts for the absent data. An actual visitor cohort and sufficient observations are needed; repeated synthetic visits must not be relabelled field evidence. The current local and hosted cold-load runs remain lab evidence.

## Minimum physical and assistive evidence packet

Each receipt needs a date/time, deployed URL and candidate/version identity, tester identity or accountable private reference, actual device model, OS/browser/assistive-tool version, task steps, observed outcome, and any defect ID. Keep captures redacted and link to their controlled evidence location. A screenshot of a configured device preset, DOM size or accessibility tree is not a physical-device or screen-reader receipt.

| Check | Smallest useful task packet | Evidence that closes the named task |
| --- | --- | --- |
| Actual 200% and 400% browser zoom | Use the browser's native zoom control and verify its displayed percentage. On the tested public journey, open navigation, read the page, use a filter/form and inspect focus. Include the narrowest Studio editing view used for acceptance. | Capture the native percentage and page state; record clipped text, obscured controls, unintended two-axis scrolling, keyboard reachability and any failed task. Exact tested routes must be named. CSS viewport resizing or pinch emulation does not substitute. |
| Physical phone | On each required real phone/browser, traverse Home → collection/search → one product detail → inquiry form, then one editorial detail and the care accordion. Check portrait/landscape, real software-keyboard overlap, menu/filter dismissal, image presentation, deliberate film play/pause and readable language fallback. | A real-device recording or photographed device evidence plus the exact steps/outcomes and device/browser versions. Use QA for synthetic submission, or leave the real inquiry form unsent; this packet alone does not create a genuine inquiry. |
| Human screen-reader use | With an actual enabled screen reader, navigate landmarks/headings and links; open/close menu or filters; identify a product, read its image alternative; trigger and recover from form validation; read a care accordion and film description. Where Studio acceptance is required, also read a saved synthetic record and its status/actions in QA. | Tester task notes or a short recording identifying screen reader/browser/version, labels announced, focus return, errors/status announcements and completion/failure. An automated accessibility scan or accessibility-tree extraction is insufficient. |

These are representative end-to-end packets, not a reduction of the route/state coverage in the acceptance register. Mark only the named tasks and devices complete. Any failure needs a tracked repair and retest on the same actual setup.

## Minimum genuine inquiry receipt

A genuine inquiry must begin with an actual prospective customer's real interest. Do not invent a person or submit synthetic details to make this row green. Observation can use the next naturally occurring inquiry, with consent for the review and redaction of personal information.

The minimum useful receipt contains:

1. A private inquiry reference, actual receipt time and production candidate identity; retain only a redacted/non-identifying reference in Git.
2. The real customer's intended product or commission path and what they expected to happen. Record any chosen options, image attachment or preference only where relevant and consented.
3. Evidence of one successful submission/receipt and the matching Studio inquiry, including the persisted request details and absence of an accidental duplicate. Do not expose the customer's message or contact details in the public evidence bundle.
4. The authorized staff member's observation that the request is usable for a real response. If acceptance includes an outgoing message, record that it was sent to the intended recipient with the applicable consent/authorization and that the expected handoff worked. This research does not send a message.
5. The actual outcome and any defect: confirmation seen, request received, staff able to continue, failed step or corrective follow-up. A QA success or a fabricated customer acknowledgment must not stand in for this observation.

No order, purchase, testimonial or positive rating is required to prove that an inquiry was genuinely received. Preserve the existing order/contact records; this evidence task does not authorize test records in production or deletion of real records.

## Status to carry forward

- Existing field-data lookup: **completed for the canonical origin's displayed Phone view; CrUX Vis explicitly reports no available data**. Other scopes are unverified.
- Field-performance acceptance: **open; no real-user p75 obtained by this research**.
- Native zoom, physical-device and actual human screen-reader tasks: **open unless a separate receipt names a performed task**.
- Genuine inquiry: **open until a consent-safe real observation is recorded**.

These boundaries implement the plan's M10-03/M10-04 and M11-05 evidence requirements. They do not prevent the coordinating agent from completing source repairs, lab testing or other independently verifiable work.
