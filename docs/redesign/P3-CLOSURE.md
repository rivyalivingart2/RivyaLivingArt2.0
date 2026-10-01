# P3 completion — reviewed Drive images and page assignments

1 October 2026. **All four P3 tasks are complete in local implementation and isolated QA. Production release is not included.** P0/P1/P2 closure remains valid. Work stays on local `codex/p3-editorial-images`; do not start P4 or push without the next applicable owner instruction. This report supersedes the pending work in the initial P3 checkpoint.

## Delivered and accepted

| Task | Completed outcome |
|---|---|
| T11 | A separate editorial upload → processing → visual review → explicit publication workflow. Still JPEG/PNG/WebP files are decoded and checked against 4 MiB, minimum 320 px per side and 20 MP limits. Originals are private and immutable; three metadata-free WebP derivatives use 640/960/1600 target widths without enlargement and a 600 KB per-derivative ceiling. Failed/unreviewed assets cannot enter the approved picker. |
| T15 | Page → section → slot → published asset selection now covers independent homepage hero, material/story sections, all three journeys, ordinary page/article headers and sections. Each usage has its own description, caption, desktop/mobile focus and aspect ratio. Existing product-based choices remain compatible fallbacks. Changes use the owning page's versioned save, exact preview, publication and revision recovery. |
| T19 | Nine isolated page assignments use six visually checked Drive subjects: material pour, timber/resin detail, furniture doorway, memory doorway, gift doorway and illustrative making. Homepage hero/material/journeys and process, materials, story and DB001 article headers are connected. Five new originals were ingested; the exact existing approved detail was reused. |
| T60 | The portable release manifest records exact Drive IDs, hashes, subjects, classifications, provenance, captions, review notes, placement purposes and separate crop briefs. The new library searches by filename/description/Drive ID, filters review state and use, shows dimensions/derivative sizes and links saved usages to exact page slots. |

The old Studio-inspired styling, shared form controls and public typography remain in use. Mobile crop controls show one preview at a time with keyboard-operable Desktop/Mobile buttons. Before/After image comparisons include hero, journey, header and section placements. A browser-discovered shrinking hero frame was corrected and rechecked at phone, tablet and desktop widths.

## Media and ownership

The only source folder is the owner's supplied Drive folder: https://drive.google.com/drive/folders/1P2HCTmPge6HsEwtoo-xGEzPTSn68oZOW. `p3-editorial-release-manifest.json` is the portable source-and-placement record. No QA asset UUID is hardcoded into application defaults.

All six selected subjects were inspected as pixels. These are labelled design visualizations, not verified client projects or actual workshop documentation. The making image's caption explicitly states that it is an illustrative scene, not a photograph of Rivya staff. No identity, workshop process, delivered installation or product specification is inferred from these images.

The detail file has SHA-256 `cc7e1bc615987e93d14e4c07fee1a4dc961ae1e6c185902ffb5dbbd5ae0d570e`, exactly matching the already-approved `/media/generated/dp001-matching-detail-4x5.webp`. Its existing media record, original and product associations were reused unchanged. Independent page usages provide contextual crops without modifying that product gallery.

New originals and derivatives use a private `editorial/<uuid>/` namespace. Public routes serve only derivatives belonging to published, reviewed media records. Originals, processing metadata and private customer references are not public picker sources. Editor accounts can upload and draft; administrator access is required to record review or publish. Public image bytes cannot be replaced at an existing identity. Replacement means upload a new asset and explicitly reassign a page slot. There is no delete/overwrite control that can break current or historical references.

Current usages include separate draft and published entries, including hidden pages and captured fallback/reference dependencies. Historical revision references remain retained. The system keeps existing originals even when no current page uses them; this phase adds no automated cleanup or cross-service synchronization.

No video was selected: the six static subjects satisfy these initial placements. The plan makes video review conditional on a real page purpose. Poster, captions and playback controls are required when footage is selected in a later content phase; P3 does not add an unsupported video uploader or claim video verification.

## Executed verification

- 230 unit checks passed. The eight focused P3 checks were rerun after the final hero layout correction and passed.
- 398 preflight/built HTTP regression checks passed (12 preflight plus 386 runtime assertions).
- Final production build and TypeScript passed. Changed-file lint and the final hero-component lint passed with zero errors/warnings. `git diff --check` passed.
- 101 isolated API assertions covered real editor/admin sessions, upload processing, private preview denial to anonymous readers, explicit review/publication gates, all 15 responsive derivatives, stale media/page writes, unsupported deletion, saved previews and the five-page draft/publication cycle.
- Real browser execution changed the homepage mobile focus from 40 to 41 while desktop remained 42; saved draft 20; inspected its actual saved renderer; published and anonymously verified revision 21; restored revision 19 into draft 22; published and anonymously verified recovered revision 23. Site images then displayed the recovered mobile focus 40 and desktop focus 42. Earlier revisions remain available.
- Browser checks covered image search, review/use filters, provenance, derivative information, zero product associations, exact process-header usage links, keyboard crop controls and responsive layouts at 320, 390, 768 and 1440 CSS px. The three journey images loaded as distinct images. These are desktop-browser viewport checks, not physical-device or whole-site accessibility certification.
- Final anonymous readback verified home 23, process 11, materials 7, story 3 and DB001 article 7. All five stored private originals were downloaded read-only in isolated QA and their SHA-256 hashes matched the reviewed originals byte-for-byte.
- All 1,889 protected source files match P0, including the old repository. Every pre-existing catalogue, media and business-settings row matches the P2 fingerprints. The media comparison excludes only the five new `/editorial/` records; it does not hide changes to existing media.
- Temporary editor access was deactivated and the local credential file removed. QA used database `rivya_qa_20260924`, runtime role `rivya_qa_runtime_20260924` and private store `store_maHrpDDHXPR93N0w`. No production resource received test content.

Evidence is retained in the parent workspace under `outputs/P3/`: `Completion-API-QA.json`, `Completion-Final-QA.json`, `Completion-Protected-Source.json`, `Completion-Browser.json`, `Completion-Validation.json`, `QA-Asset-Mapping.json`, the reviewed originals, screenshots and `completion-*.log`. The release manifest is also committed with the source. The earlier start report remains historical evidence, not the current status.

## Future release and recovery procedure

1. When the owner explicitly requests a main push, push the feature branch, open a detailed PR, pass its required checks and merge through the PR. Include both P3 commits and the closure evidence. No direct main push.
2. Production deployment and content publication follow the separately authorized P8 release. In the destination Studio, ingest each necessary original using the manifest Drive ID; review actual pixels, source/provenance and generated sizes; explicitly publish it. Reuse the approved existing detail. Do not copy isolated QA UUID paths into production documents.
3. Apply the nine manifest assignments using the destination's approved picker. Save each draft, open its exact saved preview on desktop/mobile, publish deliberately and independently verify the public page. Existing products and business settings remain protected.
4. To recover, open the page's saved revision history, inspect the selected version, restore it into a new draft, save, preview and publish. Keep immutable media available for that history. Roll back code via the normal reviewed release process if required; no original-file deletion is needed.

No push, PR, merge, deployment, production publication, scraper operation or old-product transfer occurred in P3. P4 detailed-page restoration, P5 remaining Studio screens, P6 languages/legacy URLs, P7 whole-site verification and P8 release remain planned. P3 supplies their working media foundation and reviewed initial assignments; it does not claim those later phases complete.
