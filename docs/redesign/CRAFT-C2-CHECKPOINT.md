# C2 — detailed homepage and Studio image controls

3 October 2026. Local implementation on `codex/craft-visual-improvements`, continuing the CRAFT report. C2-01/02/03/04/06 have local and isolated QA evidence. C2-05 optional video is deferred. This is not a production publication or full C0–C7 closure.

## What changed

- The existing 13 detailed homepage chapters now have clearer visual hierarchy: editorial statements, spacious image/text compositions, three portrait collection doorways, readable journal cards, numbered process steps, useful brief checklists and a larger closing invitation. Saved chapter order and substantive copy are retained.
- Hero and collection-doorway images can now be assigned directly in Homepage Studio, alongside the existing story image editor. Published-image search retains the current assignment when no match is found. Descriptions, captions, desktop/mobile focal points and frame ratios remain part of the owning page draft.
- Hero crop controls explain their approximate viewport framing and offer independent desktop/phone focal points. The hero fills its container, so an unused frame-ratio selector is no longer presented for that slot. Other slots retain the actual saved frame-ratio selector.
- The shared crop component also serves page sections and Site images, preserving the same content contract.
- A collapsible composition review shows enabled/reviewed chapters, selected existing product references, distinct editorial-image placements, repeated-image advice and saved category coverage/counts. Placement buttons move focus to the corresponding editor section. Unsaved category counts are explicitly identified as coming from the last saved snapshot.
- No packages, database schema, API privilege, product record, form, original gallery, social content or business setting changed.

## Detailed content and image decisions

The 18 old-homepage purposes were checked against [the existing disposition](P4-HOME-SECTION-DISPOSITION.md). Thirteen purposes remain adapted; five are conditional on genuine business content. The current homepage has 13 chapters plus the hero because collection discovery uses both doorways and categories. There are no fabricated delivered projects, testimonials, workshops, print services or new furniture offerings.

The existing selected references remain `DP001`, `DP013`, `DP035`, in the same order. All 15 saved categories remain discoverable with their counts, including the keyboard-operated expansion after the first six. Category support is data driven; 15 is the verified snapshot count, not a new hardcoded limit.

The QA composition retains six previously reviewed P3 Drive images across seven editorial placements: pour still, furniture doorway/room context, memory doorway, gift doorway, material detail and making illustration. The furniture image intentionally appears twice to connect discovery with room guidance; Studio makes that repetition visible. Illustrative captions remain intact. No product-gallery association changed. All three doorway desktop crops changed from landscape to portrait 4:5; the existing phone 4:5 crops and focal points were preserved.

Optional footage remains unapproved. A fresh Drive inventory confirmed candidate hero/pour/swirl files and posters; the hero WebM alone is 1,649,274 bytes and its MP4 alternative 4,107,569 bytes. Metadata is not a visual, rights, accessibility or performance review. No video, autoplay or fake play control was added. See `craft-c2-video-decision.json` for the recorded static-first decision and remaining checks.

## QA save, exact preview, publication and recovery

Only the existing isolated QA database and QA Blob store were used. Credentials stayed in memory. Production was not written.

1. Baseline draft/public revision 40 was captured, and original history was verified retrievable.
2. Browser edits changed one hero focal point as a reversible probe and the three doorway desktop frame ratios. Studio saved revision 41; the real saved-preview route displayed that exact version on desktop and phone.
3. Studio published revision 42 and confirmed the anonymous QA homepage returned 42. All 13 chapters and 15 categories rendered. A stale revision-41 write was rejected.
4. Restoring original revision 40 created draft 43, while public stayed 42. Its real saved preview was checked, then recovered publication 44 was read anonymously.
5. Final draft 45 retained the three portrait doorway crops and restored the probe focal point to its original value. The draft left public 44 intact. Exact preview and dependency checks passed, then QA publication 46 was verified.
6. Final comparison found only the three intended doorway frame-ratio changes. Catalogue, forms, media/gallery associations, business settings and every other content record, including shared social copy, matched the baseline.

The 20 assertions and revision numbers are recorded in `craft-c2-workflow-verification.json`. There are no copied QA media IDs in application defaults. Code deployment alone will not publish these QA selections in another environment.

## Verification

- TypeScript and changed-component lint passed.
- 281 existing unit tests, 12 preflight tests and 401 built-server HTTP checks passed; optimized Next.js build passed.
- Public homepage and Studio composition fit 320, 390, 768 and 1440 pixel viewports without horizontal body overflow. All 13 public headings fit. All three doorway frames maintain the saved 4:5 ratio at each checked width.
- Keyboard checks covered the public table of contents, category expansion, Studio composition disclosure and placement navigation. Published-image search with zero matches retained its assignment and could be cleared. Hero phone crop preview was inspected.
- Desktop and phone process/journal/doorway layouts were inspected; screenshots are in workspace `outputs/CRAFT-C2` and the linked C2 visual receipt. The homepage browser console had no captured errors or warnings.
- Reduced-motion emulation showed no active CSS animations and kept the opening and all 13 chapter headings visible.
- These are browser/emulation and engineering checks. They do not certify human screen-reader use, a physical phone or mobile LCP acceptance.

## Continue

Continue C3 collections, search, products and the complete inquiry journey, then C4 editorial pages and C5 remaining Studio modules. Preserve the exact save/preview/publish/recovery pattern and all protected records. Optional C2 video remains separately deferred until full review and loading evidence support it.

C6 still carries mobile loading targets, human screen-reader/physical-device checks, independent/offsite recovery-key custody (not verified), sustained daily-backup history and remaining production editorial checks. C7 requires a new explicit push-main instruction, a detailed PR and authorized hosted release verification. Current work stays local.
