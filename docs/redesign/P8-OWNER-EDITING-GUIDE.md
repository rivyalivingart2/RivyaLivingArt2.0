> Owner scope change, 5 October 2026: the project backup feature, scheduled archive jobs, archive-key custody tasks and backup/RPO/RTO acceptance gates are removed. Any earlier instruction below to run, verify, schedule or require them is historical and superseded. Existing archives/keys were not deleted. Studio draft/revision recovery and privacy-erasure safeguards remain. See the 2026-10-05 removal decision.

# Owner guide — website and Studio editing

This guide describes the implemented workflow. The P6/P7 candidate remains local; use the active QA preview for the new behavior until an authorized release. Existing products, galleries, contact facts and scraper behavior remain protected.

## Where to edit

| Public area | Studio destination and record |
|---|---|
| Homepage hero, headings, order and featured references | `/studio/content?record=page%3Ahome&tab=content&field=title` |
| Three collection pages | Pages & journal → `page:collectible-design`, `page:memory-art`, `page:personal-art` |
| Story / Process / Materials / Architects | Pages & journal → `page:our-story`, `page:process`, `page:materials-care`, `page:architects` |
| Journal selection and articles | Pages & journal → `page:journal`; select the actual article ID (existing DB001–DB036) |
| FAQ, Contact and policies | Pages & journal → corresponding `page:<route>` record; Imprint uses `page:imprint` |
| Shared buttons/help/navigation copy | Site copy → `page:site-copy` |
| Page images and mobile crops | Site images → owning page → exact section/slot; not product gallery metadata |
| Source image review | Public media → editorial library → source/provenance/review; original product library remains separate |
| Language text and approval | Language review → exact document/language; review is tied to the current source/target |
| Navigation visibility and destinations | Navigation & languages; destination must be registered/published and usable |
| Broken/incomplete record | Content health → exact record/field repair link |
| Customer request, images and follow-up | Inquiries & orders / Follow-ups → exact assigned record |
| Canonical contacts | Atelier settings displays approved business facts; this project does not authorize changing them |

Some destination records are not yet published. A missing document is not fixed merely by adding its footer link. Register the supported document, review the draft and publish it through the following workflow after release authorization.

## Edit, preview and publish a page

1. Open the exact record and read the current draft/publication status. Keep any existing unsaved work. A draft, ready-for-review record and published record are different states.
2. Edit the appropriate heading, text, action, selection or layout. Keep product IDs/facts in the catalogue. Reorder with the supplied controls; keyboard alternatives remain available. Do not paste arbitrary HTML or scripts.
3. Add missing detailed chapters only where useful. They start hidden/unreviewed so you can check copy, purpose and links. The original old-site section checklist explains conditional omissions. Do not replace unsupported maker/project/testimonial claims with fictional facts.
4. Save the draft. If another session changed the record, stop the conflicting save, retain your text, reload/compare and apply the intended change to the current version. A retry must not overwrite a newer draft silently.
5. Open the **saved preview**. Check the real renderer at desktop and mobile widths: section order, full paragraphs, image crop, link targets and selected existing products/articles. The preview describes the saved revision; later unsaved edits require another save/preview.
6. Resolve validation and missing dependencies. Administrators publish; editors can prepare/review drafts. Publishing does not mean a missing factual claim has been verified.
7. Open the public page independently. Check its actual heading, image and links, and record the published revision. A Studio success notice by itself is insufficient.

## Assign a reviewed image

Use only the supplied Drive folder and the P3 review manifest for these initial assets. Add the original to the editorial library, inspect subject/provenance and generated sizes, and explicitly publish the reviewed asset. Keep illustration/design-visualization captions; an illustration is not a photograph of the real workshop.

In Site images choose the owning page and slot, then an approved destination asset. Set meaningful alternative text and independent Desktop/Mobile crop focus/aspect ratio. Use both previews. Save the owning page draft, open its exact preview, publish and verify the public result. Editing public-media metadata alone does not assign a page slot. Never copy QA asset UUIDs, replace a protected product gallery or put customer reference images in public media.

## Compare and recover revisions

Open the record's revision history and compare the intended older revision with the current record. Restore creates a new draft and preserves history. Review text, live destinations and selected dependencies; save, preview, publish and independently check it. Record both the source revision and new published revision. Restoring a draft does not itself change the public site. Recover the original unpublished draft separately if it must be preserved alongside the public version.

The existing saved-preview snapshot intentionally remains exact when a current public dependency is withdrawn. The public page uses currently published dependencies. This difference is expected and was tested.

## Language review

Select English, Gujarati or Hindi when enabled. Product names/options, contact values, IDs and saved customer answers retain their source values. Review the entire editorial document and record approval against its current source. Changing source or translation makes approval stale. Missing/unreviewed/stale documents fall back to complete English text with a notice; do not mark them reviewed merely because fields contain text.

Translation JSON import is text only: dry run, inspect before/after, then apply to the unsaved draft. It cannot publish, change products/URLs/crops or bypass current-version checks. Save, exact locale preview and administrator publication still follow normal steps.

## Inquiries and privacy

Filters, list/board mode and the selected record stay in the URL where supported. Follow-ups use IST date presets. Record meaningful customer contact separately from internal notes. Assignment controls which editor can see private requests/images; reassignment revokes former access.

A saved request is not a confirmed order or a sent WhatsApp message. The customer chooses Open or Copy and taps Send manually. Administrator message recovery must preserve the saved brief and approved destination; it must not create another inquiry.

Only an administrator handles a verified deletion request or eligible retention expiry. A hold, ongoing follow-up or open order blocks erasure. Review current controls and the irreversible confirmation. “Private storage deletion pending” means access is revoked but deletion is unfinished: use Retry and confirm pending count reaches zero. Never report completion from an API request that failed. Remove previously downloaded CSV copies under the seven-day procedure; metadata expiry cannot recall them.

Archive operations are no longer part of this project. Continue preserving source/content revisions and the privacy-erasure ledger. Previously downloaded CSVs still follow their existing deletion procedure.