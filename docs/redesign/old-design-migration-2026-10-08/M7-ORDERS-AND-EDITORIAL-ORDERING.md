# M7 — Orders and editorial ordering

Verified locally on 9 October 2026. The existing eight-stage service remains the functional base. Website brief answers, consent, contacts, reference permissions, amendments, notes and history are preserved. Customer search stays in the tab and the authenticated API request, not shareable navigation URLs. Supported inquiry child links open the exact saved record.

A dedicated private saved-card route checks administrator/assigned-staff authorization and uses saved facts only. It never imports the old site’s inferred materials, generic care or authenticity claims. Manual records use only their saved customer name and brief. Physical printing is not claimed.

Editorial ordering lives separately in the existing presentation tables under `editorial-order:*`: archive, category, featured, related-story, FAQ group/item and testimonial opening placement. Product/gallery ordering and existing featured-product selections are untouched. Complete-scope validation rejects partial permutations, unknown IDs and duplicates. Editors can draft; administrators deliberately publish. Every save writes immutable history atomically and checks versions. A source fingerprint and membership check rejects a stale saved preview when publication changes. Restore creates a new draft. New or withdrawn public records resolve safely against current publication.

Studio provides explicit Curated order mode, drag and keyboard Move up/down, fixed-revision previews with captured public text/media/crops, phone iframe, revision comparison and restore. Public pages consume the separate manifests. Existing order is the default until a manifest is published. The previews demonstrate ordered content; they do not certify whole-page visual parity.

Validation: build/typecheck, targeted lint, 329 unit tests, 403 built-server checks, four ordering/card workflow groups and three saved-inquiry/concurrency groups. A real local browser submission exercised required-field and consent errors, save, prepared receipt and refresh without opening/sending WhatsApp. A concurrent commit test produced one new inquiry and one initial event. All 13 pre-M7 protected scopes are unchanged row-for-row; QA additions are isolated and synthetic. See `m7-evidence.json` and ignored local receipts.

M8 is authorized next. Stop before M9. No push, deployment, production writes, human/native-reader/device/field completion or genuine customer evidence is implied.
