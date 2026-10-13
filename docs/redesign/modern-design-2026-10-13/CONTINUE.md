# Continuation — modern redesign, Phase 1 only

## Current stop
Phase 1 baseline, mapping and four responsive previews are ready for owner review. Phase 1 visual acceptance is pending. **Do not start Phase 2 without explicit owner approval.** The user-approved plan has seven phases; do not resume historical M0–M11 or the old-design matching requirement.

## Working state
- Local branch: `codex/redesign-phase1-previews`.
- Base main: `4cadf21b380a8f3753232318fbb78027aa09ffc5`.
- Source: `experiments/redesign-phase1/`; product constraints: root `PRODUCT.md`.
- Direction: `experiments/redesign-phase1/DIRECTION.md`; scoped proposed design: adjacent `DESIGN.md` and `.impeccable/design.json`.
- Read `PHASE-1-REVIEW.md` and the coverage/baseline JSONs in this directory.
- Preview: `node experiments/redesign-phase1/serve.mjs`, loopback port 4178, four `?view=home|product|journal|studio` views.
- Capture script: `node experiments/redesign-phase1/review.mjs`, outputs ignored under `output/playwright/redesign-phase1/`. This is prototype verification, not production QA.

## Preservation
Keep exact logo/main colours, all copy/products/prices/media associations/crops, translations/drafts/revisions, contacts/social/business values, orders/customers/permissions, routes and publication logic. Source baseline holds 934 original files. Public baseline covers three anonymous pages and the 656-entry sitemap only. A fresh private database baseline has not been taken; obtain a sanitized authorized read-only ID/version/digest inventory before implementation connects to production data. No production changes were made in Phase 1.

The preview uses existing assets and exact reviewed copy; its Studio has only previously created fictional training examples with IDs/contacts removed. Local browser interactions do not save, send or publish. The homepage is a representative composition, not all 18 implemented sections. Existing conditional offerings must remain conditional.

## Owner-review gate
Ask for concrete feedback on the four preview layouts. Approval of the direction alone does not silently authorize Phase 2. Record any requested revisions in this local packet. Future push/release requires explicit authorization, detailed PR into main and exact deployment verification. No push or deployment is authorized by the Phase 1 request.

Scrapers, old-product transfers and backup work stay excluded. Historical native/device/human/field acceptance marked Completed by admin remains historical; no new external evidence was fabricated.
