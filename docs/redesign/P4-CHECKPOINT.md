# P4 continuation — detailed public pages

1 October 2026. **P4 is in progress. P4A implementation and selected isolated acceptance are complete; P4B–P4E remain to implement.** P0–P3 closure remains valid. Local branch: `codex/p4-detailed-pages`, based on P3 completion `5ec565e5f83e8dd91601f316512afc1c8879a62d`. No push, PR, deployment or production content publication.

## P4A delivered

- An explicit old-homepage checklist accounts for all 18 source sections. Six missing chapters can be added as hidden drafts without replacing existing editorial work, image crops, order or product references. The helper is idempotent and refuses chapter-limit overflow. Five unsupported offerings remain staff-visible as Content needed, with no public empty shells.
- Detailed manifesto, large-format planning, atelier practice, room context, bespoke guidance and operating principles use original copy based on existing approved site information. Paragraphs, checklists, source notes, visibility and readiness stay editable in Studio. Source notes never render publicly; no invented biography, service, project or testimonial is added.
- Story chapters support split, reversed and statement compositions. Image-free chapters use the full reading column. The compact chapter index works without client-side JavaScript. Journey cards have a full pointer target and visible keyboard focus. Selected journal cards retain distinct relevant covers and display a reading estimate. Closing/story chapters can have a secondary action under the same publication-dependency guards.
- The reviewed QA composition places journeys near the first product selection and removes obsolete numeric eyebrow prefixes. It uses P3's approved making and room imagery, explicit visualization captions and separate mobile/desktop crops. No media record or original is changed. The three selected existing stories cover a room, a wedding memory and a family nameplate.
- Public header/footer links now follow current publication and anchor availability without rewriting saved navigation settings. Withdrawing a page removes its menu link; republishing restores it. Contact links use unchanged canonical settings. Empty desktop collection menus are omitted. Desktop outside-click/Escape and mobile focus containment work. Search opens with its field focused and offers the full search destination.
- Studio checklist/outline Edit actions bring the corresponding editor into view and move keyboard focus to it. Action groups have unique anchors, including secondary and journey actions.

See [the 18-section comparison](P4-HOME-SECTION-DISPOSITION.md) and [portable editorial release instructions](p4a-home-release.json). The old site's source and P0 section inventory provide the comparison; this pass does not claim a new live old-site visual audit.

## Verification and evidence

- 235 unit checks passed, including five focused preservation, readiness, capacity, secondary-action and navigation tests.
- 398 preflight/HTTP runtime checks passed. Final production build/TypeScript and changed-file lint passed after the interaction refinements. React review checked server/client boundaries, accessible labels, effect cleanup, image behavior and protected references; no new dependency or client-side data fetch was added for public chapters.
- 26 isolated lifecycle assertions passed. Studio saved hidden draft 24; reviewed draft 25 previewed and published as 26; unready and unavailable-destination drafts were rejected for publication; revision 26 was recovered into draft 29 and published as 30. Final journal/eyebrow refinement saved, previewed and published as 32. Anonymous readback verifies home revision 32.
- The process page was temporarily hidden in isolated QA to exercise actual menu withdrawal, then its original content was saved and republished as revision 14. Every other content record is unchanged.
- All 41 internal linked destinations returned HTTP 200; linked anchors exist. Canonical footer phone `+918320404132` and email `rivyalivingart2.0@gmail.com` match the existing new-site settings.
- All 22 selected browser assertions pass. Browser checks cover 320, 390, 768 and 1440 CSS px on the homepage and Studio, one skip link/main region, chapter-index keyboard operation, desktop menu Escape/outside click, mobile forward/backward focus wrapping and return, search submission/back, explicit search-field focus and reduced-motion visibility. Screenshots were visually inspected. These are desktop-browser viewport checks, not physical-device, comprehensive accessibility or performance certification.
- All 1,889 protected source files still match P0, including the entire old repository. Whole-row fingerprints for all 120 catalogue entries, all 136 public-media records and business settings are unchanged. No scraper action or old-product transfer occurred.

Evidence in the parent workspace: `outputs/P4/P4A-API-QA.json`, `P4A-Final-QA.json`, `P4A-Protected-Source.json`, `P4A-Browser.json`, `P4A-Validation.json`, screenshots and `p4a-*.log`. The initial and final builds are recorded separately; API/HTTP checks exercise the content/navigation work, with final browser checks for the later focus refinements. QA remains isolated, indexing off and order intake off.

## Remaining P4 work

| Slice | Next implementation and acceptance |
|---|---|
| P4B | Three distinct collections and search: old-section comparisons, useful guidance, applied-filter chips/removal/reset, sort/results and URL/back continuity. Saved-pieces behavior only where selected. Preserve existing product IDs and facts. |
| P4C | Product/gallery hierarchy, customization, bespoke/commission and saved receipt: preserve all existing specifications/options/schema and manual-send behavior; execute error, retained-answer, review and retry checks. |
| P4D | Story, process, materials/care, architects and journal/topics/articles: restore meaningful old section depth with original reviewed copy and suitable approved media, including article discovery and related references. |
| P4E | FAQ, contact, policies, Imprint, accessibility, custom pages and shared error/empty/recovery states: protect factual meaning, validate destinations and complete page-family checks. |

T51's shared shell and T64's homepage restoration have P4A evidence; their page-family scope remains open. T39/T41/T61 have selected homepage/mobile/static-motion evidence, not whole-site closure. T20/T21/T22/T23/T28/T46/T53/T54/T55/T56 remain planned. P5 and later phases have not started. Do not mark P4 complete from this slice.

## Continue and release safely

Continue P4B from this local branch and read the consolidated master revision 6.8 and its full W-family specifications. Preserve drafts, history, products, gallery associations, contacts and scraper. Use the owner's supplied Drive folder; review any additional selected image as pixels before assigning it. The reviewed still-image path is complete for P4A; video is unselected and optional.

All work remains local until the owner explicitly requests a push to main. Then push a feature branch, create a detailed PR describing all accumulated changes, affected areas, checks, protected-data results, limits and recovery, and merge through that PR after required checks. No direct main push. Production deployment and content publication retain the later authorized release gate.

For production content, use destination Studio, current destination drafts and published destination images. Follow `p4a-home-release.json`; never copy isolated QA asset UUIDs. Save → exact preview on desktop/mobile → deliberate publish → independent public verification. Recover through saved revision history into a new draft, preview and publish; retain original images and earlier revisions.
