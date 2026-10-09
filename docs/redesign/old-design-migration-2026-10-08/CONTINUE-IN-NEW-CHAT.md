# Current checkpoint — M9 drafts delivered; stop before M10

9 October 2026. All 480 new English drafts are authored, saved in isolated local Studio in 48 ten-entry batches, and delivered to the dedicated Drive folder: 120 Journal, 120 labelled Portfolio concepts, 120 labelled fictional Testimonial examples and 120 FAQs. Production remains 0/480. Read `M9-EDITORIAL-DRAFT-PRODUCTION.md`, `m9-evidence.json` and `PENDING-AFTER-M9.md` under `docs/redesign/old-design-migration-2026-10-08/`. Build/type/lint, 337 unit, 403 built-server, 480 saved-render checks and 34 core Drive hash readbacks pass. Every pre-M9 row in all 13 protected scopes is unchanged. Human editorial, rights/crop, native-reader, physical-device and publication approvals remain open. Stop before M10. No push, release or production writes. Do not re-import existing M9 IDs or copy local QA media publication into production.

---

# Current authorization — M9 draft production and staging

9 October 2026. The owner explicitly authorized M9. Read `docs/decisions/2026-10-09-m9.md`. Produce the new editorial drafts and media in ten-entry batches, stage additively in isolated local Studio and copy the delivery to a dedicated Drive folder. Preserve all pre-M9 records and Drive originals. Stop before M10. No push/release/production publication. Actual human/native/media-owner approvals remain distinct from assistant review. Earlier stops before M9 below are superseded for this phase only.

---

# Current checkpoint — M7 and M8 verified locally; stop before M9

9 October 2026. The owner-authorized M7 and M8 are complete for their documented local engineering scopes. Read `M7-ORDERS-AND-EDITORIAL-ORDERING.md`, `M8-EDITORIAL-WORKFLOW.md`, `m8-evidence.json` and `PENDING-AFTER-M8.md` in this migration directory. M7 is commit `467e157`; M8 is the commit containing this checkpoint. Final M8 build/type/lint, 333 unit, 403 built-server and five workflow groups pass. All 13 pre-M8 protected scopes match row-for-row. M5–M8 remain local; production editorial remains 0/480. Stop before M9. No push, release or production writes until an applicable owner instruction. Human/native-reader/physical-device/field/full-parity acceptance remains open. Historical checkpoints below do not authorize further phases.

---

# M7 checkpoint — verified locally; M8 authorized next

9 October 2026. M7 is complete for its recorded engineering scope. Read `M7-ORDERS-AND-EDITORIAL-ORDERING.md` and `m7-evidence.json` in this migration directory. All 13 pre-M7 protected scopes match. Continue with authorized M8, then stop before M9. Local only; no release or production writes.

---

# Current authorization — M7 then M8 locally

9 October 2026. The owner explicitly requested M7 and M8. Complete and verify M7 before M8; stop before M9. No push, release or production writes are authorized. Preserve existing records and test additively only in the existing loopback QA database. Read `docs/decisions/2026-10-09-m7-m8.md`. Earlier stops before M7 are superseded for these two phases.

---

# Rivya Living Art — continuation prompt

**Current continuation override, 9 October 2026:** M5 and M6 are implemented and verified locally. Read `IMPLEMENTATION-CHECKPOINT.md`, `M6-STUDIO-WORKSPACES.md`, `m6-evidence.json` and `PENDING-AFTER-M6.md` first. **Stop before M7 unless the owner explicitly authorizes it.** Do not restart completed phases. M0–M4/Production setup are live from PR #46; M5/M6 have no new push or release. The labelled concept/fictional sample decision supersedes the genuine-only wording in the historical prompt below. New production entries remain 0/480. Human/device/whole-page parity checks remain open.

Prepared 9 October 2026. Copy the instruction below into the new implementation chat. Its presence in the repository does not itself run implementation or authorize a later release.

```text
Continue Rivya Living Art using the plan committed to:
docs/redesign/old-design-migration-2026-10-08/
Rivya-Combined-Final-Implementation-and-Phase-Wise-Plan.md

Read that combined plan, README.md, the latest applicable AGENTS.md instructions,
and the actual branch/working-tree state. Reconcile any completed work first;
do not overwrite or duplicate it. Start M0 and work through the M0–M11 phases
in dependency order, maintaining a clear checkpoint after each delivery.

Keep RivyaLivingArt2.0 as the functional/data base. Reproduce the OLDWEBSITE
public and Studio design language, page compositions and detailed sections
through adapters to current services. Cover the 85 old page templates,
74 registered section definitions, all 18 homepage sections, 16 landing-page
blocks, 32 Studio destinations and their supporting views, subject to the
documented conditional/excluded modules. Use the 60 implementation tasks.

Do not change any existing product or content information: products, prices,
forms, galleries, selections/order, text, drafts, translations, metadata,
URLs, categories, media assignments/crops, revision history, customer data,
business/contact/social values or saved orders. New content and configuration
must be additive. Keep current phone +91 8320404132 and email
rivyalivingart2.0@gmail.com; resolve other current values from their owner store.

Do not transfer old products, install/run/change the product scraper, activate
ingestion-dependent Catalog Fill, or restore backups/key-custody requirements.
Do not revive the cancelled design audit. Retain current draft/revision recovery.

Prepare 120 new Journal entries, 120 genuine Portfolio records, 120 genuine
Testimonials and 120 FAQs from the embedded register. Existing records and
translations do not count toward these new-entry targets. Check duplicates
without rewriting existing content. Missing projects/feedback stay pending;
never invent clients, quotes, ratings, orders or project evidence. Use the
supplied Drive assets only after identity, rights and new-usage crop review.

Implement both the existing commissions/order workflow and separate versioned
editorial display ordering. Keep saved briefs immutable, current permissions,
IST follow-ups and manual customer WhatsApp Send. Product/gallery ordering
and selected product IDs remain protected.

First prove one complete homepage presentation workflow: save draft -> actual
saved preview -> isolated-QA publish -> public verification -> restore into
draft. Then expand the accepted pattern across all pages and Studio modules.
Verify isolation before QA writes; Preview and Production were previously
documented as sharing resources. Keep list queries bounded and traffic low.

Use relevant available design skills without introducing an unrelated theme.
Record exact code, visual, accessibility, permission, failure, publishing and
recovery evidence for the current candidate. Keep real native-reader, human
screen-reader, physical-phone, field-performance and genuine-customer evidence
separate from assistant review, emulation and synthetic tests. Do not certify
unperformed checks. Continue independent work when source evidence is missing.

Keep implementation local on a codex/ branch. The October 9 push instruction
released the planning handoff only; it is not standing permission to release
future application changes or publish new production records. When I explicitly
request a later push/release, use a detailed PR to main, required checks,
the applicable Vercel deployment verification and bounded live checks.

At each phase report what changed, verification results, protected-data
comparison, actual content counts, unresolved evidence and the next task.
```

## Primary references

- Current repository: https://github.com/rivyalivingart2/RivyaLivingArt2.0.git
- Current site: https://www.rivyalivingart.com/
- Current Studio: https://www.rivyalivingart.com/studio
- Old repository: https://github.com/rivyalivingart2/OLDWEBSITE.git
- Old site: https://oldwebsite-one.vercel.app/
- Old Studio: https://oldwebsite-one.vercel.app/studio
- Drive: https://drive.google.com/drive/folders/1P2HCTmPge6HsEwtoo-xGEzPTSn68oZOW
