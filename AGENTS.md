# Current implementation — M0–M4 verified for scope; await M5 permission, local only

Latest owner steering: finish the already-started M4 phase, then obtain explicit permission before starting M5 or any subsequent phase. Add both website images and video. Read `docs/decisions/2026-10-09-phase-permission-and-media.md`. This supersedes automatic progression through the complete plan; local-only and preservation requirements still apply.

9 October 2026. Read `docs/redesign/old-design-migration-2026-10-08/IMPLEMENTATION-CHECKPOINT.md`, `M4-PAGE-TEMPLATES.md`, `m4-evidence.json`, `m4-media-evidence.json` and the updated task register before continuing. M0 baseline/isolation, M1 source contracts, M2 shared frames, M3 saved design workflow and M4 page templates/media are verified for their recorded local engineering scope. The final M4 candidate passes 311 unit and 42 workflow checks; all 13 original protected local scopes match. M5 is the earliest unfinished phase and must not start without the owner's explicit permission. Whole-page parity and human acceptance are not complete. Keep all application work local until a new explicit release request.

Preserve all existing records, contacts, media usages/crops, drafts, translations and history. Use the new dedicated loopback QA harness for writes; live access remains bounded and read-only. No scraper, old-product transfer, ingestion-dependent Catalog Fill or backup work. The owner now explicitly permits labelled concept Portfolio entries and labelled fictional Testimonial samples, with copies in Drive and Studio; read `docs/decisions/2026-10-09-labelled-editorial-content.md`. Never present them as genuine evidence or customer reviews. Human/device evidence cannot be invented. The cancelled audit stays excluded. The October 9 planning release below is historical and does not authorize a new release.

---

# Previous handoff — publish final old-design migration plan

9 October 2026. The owner requested a continuation prompt and publication of the combined plan to `main` through the standing detailed-PR workflow. Read `docs/decisions/2026-10-09-publish-migration-handoff.md`, then `docs/redesign/old-design-migration-2026-10-08/README.md`. The combined Markdown plan and `CONTINUE-IN-NEW-CHAT.md` are the new migration handoff. M0–M11 and all 480 proposed content records are still planned, not implemented or published.

This handoff release changes documentation only. A new-chat implementation instruction can start the planned phases, but future application work remains local until a later applicable push/release request. Preserve all existing product/content/draft/translation/image/crop/contact/business/social/customer/order values. New content/configuration is additive. Scraper work, old-product transfer, ingestion-dependent Catalog Fill and backups/key custody remain excluded; keep draft/revision recovery. Retain the cancelled audit exclusion below. Screenshots/raw/private evidence remain outside Git. Keep source observations and historic tests distinct from fresh acceptance evidence.

---

# Current owner instruction — release latest retained work through a detailed PR

8 October 2026. The owner requested pushing all latest work to the Git repository. Following the standing release instruction, release the retained `codex/article-meaning-review` candidate through a detailed PR into `main`, verify the exact PR head/checks, and verify the existing Vercel Git deployment. Read `docs/decisions/2026-10-08-release-retained-work.md`. Do not push directly to main or bypass protections.

This candidate includes the DB001/DB010 assistant-correction files and review tooling, the Studio content-list status repair, optional design resources, the isolated effects toolkit and the previously verified Mobbin connection documentation. It does not authorize publishing unreviewed Studio article drafts. Preserve all product/form/gallery, contact/business/social and customer data. Human/native-reader/device/performance acceptance remains open, and backups remain removed.

The owner cancelled the subsequent design audit and requested its removal. The untracked `docs/redesign/DESIGN-AUDIT-2026-10-08.md` and workspace `outputs/design-audit-2026-10-08` are excluded from this release. Their local deletion was blocked by the session's command-approval policy; do not stage or restore them as part of a later all-files release. No design-audit application changes were made. Earlier local-only wording below describes historical checkpoints; consult the release PR for the retained candidate's actual state.

---

# Previous checkpoint — reference workflow and isolated effects toolkit

6 October 2026. The owner requested useful compatible installations from additional design articles. Read `docs/redesign/DESIGN-TOOLS-EXTENSION.md`. The user-level `design-reference-workflow` skill is installed and validated; Aceternity's public registry is configured. The independent `experiments/design-effects-toolkit` package contains the optional ShaderGradient/Fiber/Three/Drei/Paper/Motion stack and vendored Liquid Glass source. Nine imports, vendor syntax and the dependency tree pass; a Node-only upstream Three.js deprecation warning remains. These are installed resources, not a rendered/accepted effect. Main application dependencies and page source remain unchanged.

Mobbin's ChatGPT plugin page was inspected after the owner reported connecting it on 6 October 2026. The rendered account status explicitly shows Connected, so the account connection is verified. Mobbin tools are still absent from this Codex session and plugin search returns no matching entry; an actual design search remains unverified. Do not confuse the verified account connection with a successful tool search. No CLI MCP duplicate, paid plan, live content change, push or deployment occurred. Keep further work local and preserve the earlier checkpoints below.

---

# Previous checkpoint — optional design resources installed locally

6 October 2026. The owner requested useful resources from a pasted design-resource article, then Codex-compatible design skills. Read `docs/redesign/DESIGN-RESOURCE-SETUP.md`. Poppins 400/600 with an opt-in local loader, shadcn configuration/Card/helper, one IRA outline illustration and pattern.css 1.0.0 are now available locally; existing Lucide is reused. The root fonts and actual public/Studio page designs remain unchanged. TypeScript/build pass; lint has 0 errors and 62 pre-existing warnings. These resources are not evidence that pending hosted performance or human acceptance is complete.

Four user-level Codex skills were installed outside the repository: UI/UX Pro Max (Windows path adaptation), frontend-design, emil-design-eng and app-store-screenshots. Gstack remains uninstalled because its separate Bun/browser setup was not installed. Full receipt: workspace `outputs/design-skills-installation-2026-10-06.md`. No new screenshot-editor application, website release or production-data edit was performed. Preserve the local article corrections and content-list fix below. Further changes remain local until an explicit push-main request.

---

# Previous checkpoint — PR43 released; first article corrections saved

6 October 2026. PR43 merged the full current candidate to main `9e163d775a1dcc8fe43714a8c084bf84709f3c0b`; exact Vercel Production `dpl_3eBxhZHYJdHHzp5aJtuLC3TSC6Jq` is READY on the custom domain. Read `docs/editorial-translations/RELEASE-43-AND-FOLLOWUP.md` first. Live language/Imprint/indexing checks passed. A new hosted mobile sample measured LCP 3.301s and no field data, so performance acceptance remains open.

Follow-up branch `codex/article-meaning-review` contains complete assistant corrections for DB001 and DB010 (78 field values), generated packs and review tooling. Studio saved both languages as unreviewed drafts: DB001 draft 2/public 1, DB010 draft 4/public 3. Preserve these drafts. Source fingerprints matched immediately before import. No article translation has been published. Thirty-four articles still need full assistant meaning review; independent native review remains required for all 36. Read the explicit evidence gaps in the follow-up record. New follow-up code/files stay local until another explicit push instruction.

A local follow-up fixes the content list's stale `Aligned` status after draft saves. Only compact rows trust the server summary; full saved records recompute the comparison. Seven focused tests, lint, TypeScript and production build pass. Local browser save/publish verification and release of this follow-up remain open; do not report it as already deployed.

---

# Previous checkpoint — remaining language and editorial acceptance

6 October 2026. The owner explicitly requested pushing all current work through a detailed PR into main, deploying/verifying it, then continuing pending acceptance. This authorizes release of `codex/remaining-editorial-acceptance` (application commit `bcf0302`) from released main `b989e5870f390b2f0e8707f15c44014dabcb059e`. See `docs/decisions/2026-10-06-editorial-release.md`. Verify final checks, merge through the PR and verify the exact Vercel production commit. Do not bypass protection or push directly to main. Subsequent new editorial work remains local unless part of completing this release or separately authorized for publication.

Read `docs/editorial-translations/IMPLEMENTATION-STATUS.md`, `acceptance-evidence.json`, `publication-receipts.json` and `HUMAN-ACCEPTANCE.md`. Seven additional pages were translated, exactly previewed and deliberately published through Studio. All 19 public pages now have current Hindi/Gujarati review state. Privacy's obsolete routine-backup promises were replaced with the already approved repository wording. DB010's unrelated console cover was replaced by Horizon wall art and published as revision 3. Protected 120-product, 131-original-media and business fingerprints still match.

The 36 article translations are machine-assisted **drafts**, not approved/public translations. Complete meaning/native-reader review before marking them reviewed or publishing. The local side-by-side review packet and Studio dry-run imports preserve exact English source fingerprints. DB010 includes the documented image-description amendment. Do not overwrite newer work or bulk-mark machine drafts reviewed. Native-reader, owner crop, real human/phone/field/genuine-inquiry acceptance remain open.

Local interface work adds Hindi/Gujarati controls and fixes translated snapshot labels, preview image alt text and the Imprint contact heading while retaining protected facts and exact captured dependencies. Full checks passed 294 unit / 12 preflight / 403 built-server; final small label additions also passed typecheck/lint/build and browser verification. Use loopback PostgreSQL for broad QA. The last passing hosted LCP sample is from the prior release, not proof of this local candidate's field performance.

Backups/key custody remain removed. No scraper/old-product transfer, customer messages, fake business inquiries, new tracking, grants or infrastructure changes. Preserve products/forms/original galleries, business/social facts, customers, drafts and history.

---

# Historical checkpoint — requested release complete; remaining acceptance in progress

5 October 2026. PR39 merged main `0d03d8f` and exact Vercel production `dpl_5SiSZeGuU23F3EvjZrkNAnDJXoP2` is READY. Production indexing is enabled; Preview remains false. Eighteen live checks and the 174-URL sitemap passed. Protected catalogue, original media/associations and business fingerprints still match at 18:02 UTC.

Twelve pages now have published, current Hindi/Gujarati review state (472 field values). Story/materials/FAQ are public revision 3. Seven pages and 36 articles remain English fallback; native-reader sign-off, gallery/content sign-off and real human/device/field/business evidence remain open. Studio expired; renewed sign-in was requested. Do not manufacture that evidence or use database credentials to bypass the Studio editorial workflow.

Post-release hosted collection LCP is 3.545s. Branch `codex/hosted-loading-editorial` prepares responsive preloading of the single opening image; full local check passes 290/12/403. Check its PR/deployment receipt before describing this follow-up as released or the target as met. It continues the owner's same pending-work/release request. No unrelated scope, product/business/social changes, backups or direct main push.

---

# Current owner request — release and complete the pending acceptance work

5 October 2026. The owner requested work on the table including release, hosted performance, indexing and remaining editorial work. Read `docs/decisions/2026-10-05-release-final-acceptance.md`. Release the existing acceptance candidate through a detailed PR into main, verify its exact checks and Vercel production, and apply Production-only indexing as previously approved. This supersedes the local-only hold for this candidate; no direct main push or bypass.

Continue protected Studio editorial review/publication. Real human/device/field/business evidence cannot be manufactured. Product/form/gallery/business/social/customer protections and backup removal remain. Earlier entries below are historical where this instruction differs.

---

# Previous continuation — acceptance follow-up; source remains local

5 October 2026. Read `docs/redesign/FINAL-ACCEPTANCE-2026-10-05.md` and `final-acceptance-evidence-2026-10-05.json`. The owner upgraded Neon to Launch; the former Free cap is historical. All 120 products, 131 original media/associations and business settings match baseline. The Imprint is published at revision 2 with recovery saved as draft 3; five fresh editorial assets and nine pages of Hindi/Gujarati copy were deliberately published and verified. Other translations/content/crop review remain partial.

Local branch `codex/final-acceptance-traffic` reduces SQL payloads, scopes/splits CSS, fixes logo sizing and collection/journal preview markers, and prepares indexing. Broad QA now uses source-only loopback PostgreSQL, not the live Neon project. All seven local mobile medians pass; current hosted collection LCP is still 3.539s. Human phone/screen-reader and field evidence remain unavailable.

PR #38 already released the prior base. New code stays local until another explicit push-main request, then use a detailed PR. The owner approved Production indexing with that next approved release, not now. Keep Preview/private routes closed. Preserve products/forms/galleries, business/social facts, customer records, drafts/history and manual sending. Backups/key custody remain removed. The prior status entries below are historical and superseded where this checkpoint differs.

---

# Current infrastructure status — shared database recovered; transfer allowance constrained

5 October 2026. Preview/Production already share `neondb` in Neon `blue-haze-08978208` (historical name `rivya-studio-preview`). The owner accidentally deleted that database while consolidating. Neon point-in-time recovery to 07:29 UTC restored the existing connection, retaining an undo branch. Production and Preview homepages return 200; aggregate checks show 120 products, 47 content entries and 131 media records. Read `docs/redesign/shared-database-recovery-2026-10-05.json` and the current section of `SHARED-DATA-CONFIGURATION.md`.

The latest usage panel showed 5.35 GB / 5 GB transfer; the billing period ends 1 November. QA uses a separate database on the same Neon project and shares its quota. Avoid large remote test suites, crawls, exports and full record inventories. Prefer local tests and small read-only checks. Do not delete the shared database or substitute QA/old Production data. No paid upgrade, new backup schedule, environment rewiring or source deployment was made. Existing backup-removal and protected-data boundaries remain; this was recovery of the deleted live data. PR38 already fulfilled the previous release request. Further source changes remain local until a new explicit push-main request.

---

# Current owner instruction — release C5/C6 through a detailed PR

5 October 2026. The owner explicitly requests all updated files in main with a PR describing every change. Read `docs/decisions/2026-10-05-publish-c5-c6-main.md` and `docs/redesign/C5-C6-MAIN-RELEASE.md`. Push the accumulated C5 acceptance/C6 branch, check the final PR head and required checks/reviews, merge through the PR, then verify main and the existing Vercel Git deployment. No direct main push or review bypass.

C5 engineering acceptance is complete. C6 native zoom/assistant contrast are complete for recorded scope; collection loading, field p75 and human/physical-device evidence remain open. Release authorization does not change these results. Preserve protected products/media/business/social/customer/draft/history data. No production content publication, migration, grants, messages or backup operations. Further development returns to local-only after this release.

---

# Current continuation — C6 zoom/contrast complete; loading and human acceptance open

5 October 2026. The owner requested full C6 completion. Local application source `f1245c7` on `codex/c6-performance-accessibility` improves Studio startup, content-list payloads and validated public reads; fixes badges, named groups and repair-link contrast. Read `docs/redesign/CRAFT-C6-CHECKPOINT.md` and `craft-c6-evidence.json`. The current candidate passes 288 unit, 12 preflight, 403 built-server checks, 144 accessibility scans, 73 interaction assertions, 99 native zoom observations, 98 contrast states and 13 isolated publishing/recovery checks. All pre-existing/protected records remain intact; one new QA fixture is hidden with history retained.

C6 remains PARTIAL: 6/7 mobile lab medians meet 2.5s, but collection is 2.808s and field p75 is unavailable. Native 200%/400% zoom and assistant contrast review are complete for their recorded scope. The owner has no physical phone or screen reader available; human evidence remains NOT RUN. Backups/key custody remain removed. C7 has not started. Keep work local until a new explicit push-main request, then use a detailed PR. No production write or deployment occurred. Earlier C6 statuses below are historical.

---

# Current continuation — C5 acceptance complete locally; C6 next

5 October 2026. The owner requested completion of C5 permission, error-handling and publishing/recovery acceptance before C6. That work is complete in isolated QA on `codex/c5-acceptance`, source `0c5dfc5`. Read `docs/redesign/CRAFT-C5-ACCEPTANCE.md` and `craft-c5-acceptance-evidence.json`. All six C5 task rows are accepted for their engineering scope. The new repairs and evidence are local; PR #37 already fulfilled the prior push instruction.

The current candidate passes 283 unit, 12 preflight and 403 built-server tests, typecheck/build, 90 service assertions, real browser draft/preview/publish/public verification/recovery, protected-editor failures, all-module retry/layout and keyboard checks. All protected and pre-existing records remain intact. Synthetic fixtures are retired with history. No production publication, messages, exports or erasures occurred.

C6 has not been started by this pass. Performance, wider accessibility, native browser zoom/human screen-reader/physical-phone verification, optional C2 video and production editorial acceptance remain separate. The last recorded production Imprint result was 404. Backup operations and key-custody gates remain removed. Keep further work local until a new explicit push-main request, then use a detailed PR. Never copy QA content/media identities to production.

---

# Current owner instruction — publish CRAFT through a detailed PR

5 October 2026. The owner explicitly requested all updated files in main with a PR documenting every change. Read `docs/decisions/2026-10-05-publish-craft-main.md` and `docs/redesign/CRAFT-MAIN-RELEASE.md`. Push the complete CRAFT branch, verify the exact PR head and required checks, then merge through the PR and verify the existing Vercel Git deployment. Do not push directly to main or bypass required reviews. This release includes C1–C5 source and backup removal; it does not certify unfinished C5/C6 or publish Studio records. Preserve protected data and archive/key removal boundaries. Later development returns to local-only until a new push-main request.

---

# Current owner instruction — remove project backups

5 October 2026. The owner requested "REMOVE BACKUP FROM THIS PROJECT ENTIRELY". Backup generation, receipt tooling, scheduled jobs, dedicated runbooks and backup/key-custody release gates are removed from scope. Do not recreate or run them during continued C5/C6 work. Historical phase evidence below is superseded for this topic, not proof of an active schedule. Read `docs/decisions/2026-10-05-remove-backups.md`.

Existing archives, keys, source history and customer data remain intact. Studio drafts, revision recovery, manual-send behavior, retention controls, erasure ledger/replay and business/contact/product facts remain protected. Keep changes local until a new explicit push-main request; then use a detailed PR. C5 acceptance, performance, accessibility, human/device and production editorial work continue independently of the retired backup scope.

---

> Owner scope change, 5 October 2026: the project backup feature, scheduled archive jobs, archive-key custody tasks and backup/RPO/RTO acceptance gates are removed. Any earlier instruction below to run, verify, schedule or require them is historical and superseded. Existing archives/keys were not deleted. Studio draft/revision recovery and privacy-erasure safeguards remain. See the 2026-10-05 removal decision.

# Current continuation — C5 Studio presentation implemented; full acceptance open

3 October 2026. Read `docs/redesign/CRAFT-C5-CHECKPOINT.md`, the three `craft-c5-*.json` evidence files and `craft-c5-module-acceptance.csv`. Shared presentation reaches all 16 Studio modules, with labelled record state, compact inquiry filters, protected catalogue/form review, keyboard product tabs, media selection and consistent administration panels. Fifteen focused browser checks, 32 body-reflow observations, 18 isolated service assertions and 403 built-server checks passed. All protected and content/inquiry records match baseline.

Full C5 permission/error/mutation/keyboard acceptance remains open; finish those checks before certifying C5, then continue C6. C4-05 production Imprint's last recorded result was 404; no C5 publication or live recheck occurred. C2 video, human/device/performance, independent key custody, sustained backups and production editorial acceptance remain open. Keep work local until another explicit push-main request, then use a detailed PR. Preserve products/forms/galleries, business/social facts, scraper, private inquiries, drafts/history and manual sending. Screenshot review: workspace `outputs/CRAFT/c5-implementation.html`.

---

# Current continuation — C4 editorial presentation verified locally; live Imprint open

3 October 2026. Read `docs/redesign/CRAFT-C4-CHECKPOINT.md`, the four `craft-c4-*.json` evidence files and `craft-c4-page-acceptance.csv`. C4 refines story/process/materials, architects/portfolio, journal/articles, FAQ/contact and policies while retaining all protected records and content. Missing journal/portfolio details now return real 404. Sixty responsive checks, twenty browser checks, thirty-six isolated HTTP assertions and 403 built-server tests pass.

C4-05 is PARTIAL: isolated QA Imprint and exact preview work, but a fresh live read returns 404. Production factual approval, exact preview, publication, footer/public and recovery evidence remain open. Do not certify C4 or the full CRAFT plan as complete. Next is C5 Studio. C2 optional video and C6 performance, human/device, independent key custody, sustained backups and full production editorial acceptance remain open. Keep work local until another explicit push-main request, then use a detailed PR. Preserve products/forms/galleries, social/business facts, scraper, private inquiries, drafts and history. Review screenshots in workspace `outputs/CRAFT/c4-implementation.html`.

---

# Current continuation — C3 collections and inquiry journey verified locally

3 October 2026. Read `docs/redesign/CRAFT-C3-CHECKPOINT.md` and its three `craft-c3-*.json` evidence files. C3 refines collection chapters, search, product/gallery presentation, saved pieces and the inquiry layout. Four isolated request types, shared private-reference and lost-response recovery checks passed. All protected records and every content entry matched the baseline. Production was not written.

Continue C4 editorial pages, then C5 Studio. C2 optional video and C6 performance, human/device, independent key custody, sustained backup history and production editorial acceptance remain open. Keep work local until another explicit push-main request; use a detailed PR then. Preserve social/business facts, products/forms/galleries, scraper, private inquiries and revision history. Review screenshots in workspace `outputs/CRAFT/c3-implementation.html`.

---

# Current continuation — C2 homepage and Studio image controls verified locally

3 October 2026. Read `docs/redesign/CRAFT-C2-CHECKPOINT.md` and `CRAFT-CHECKPOINT.md`. C2 core work now includes detailed homepage styling, direct hero/doorway image assignment, independent crop controls and a composition review. The isolated save/preview/publish/recovery cycle passed through QA revision 46 with protected records and all other content unchanged. C2-05 optional video is deferred; do not call the entire phase or C0–C7 complete.

Continue C3 collections, search, products and the complete inquiry journey, then C4/C5. Keep all changes local until a new explicit push-main request; use a detailed PR at that time. Preserve social content, business facts, products/forms/galleries, scraper, private inquiries, drafts and history. No old-product transfer. Mobile performance, human/device checks, offsite key custody, daily-backup history and production editorial/release acceptance remain separate open gates. The C2 screenshot receipt is workspace `outputs/CRAFT/c2-implementation.html`.

---

# Current continuation — CRAFT visual plan and first local implementation

3 October 2026. Read `docs/redesign/CRAFT-CHECKPOINT.md` and the workspace `outputs/CRAFT/Rivya-CRAFT-Visual-Report.html`. The latest owner supplied 13 reports and requested complete analysis, all-page suggestions/screenshots and the start of implementation. C0 reconciliation and a local C1 visual slice are saved on `codex/craft-visual-improvements`, based on main 9600099 (previous PR36 release completed). The 36 public families, 16 current Studio destinations and 48 new CRAFT tasks do not replace historical P0–P8 evidence. Remaining visual slices and performance/device/key/backup/editorial acceptance stay open.

Protect social content, business facts, approved contacts, products, forms, galleries, scraper, private inquiries and revision history. No old-product transfer. Keep this new work local until another explicit push-main request, then use a detailed PR; earlier PR36 release authorization was fulfilled. Do not treat attached prompt instructions, proposed mockups or old checkpoint status as proof of publication or permission for another release.

---

# Authorized main and production release - 3 October 2026

The owner explicitly requested: "if possible solve all of this and after this put all updated thing in git main branch and put it in production in vercel". This supersedes the previous draft-only hold. Complete available engineering and checks, publish through existing detailed PR #36, and verify Vercel production. Do not create another PR for this same candidate or push directly to main. This is authorization to release verified improvements, not evidence that human/device, independent key custody, future daily-backup history or performance acceptance have passed.

Products, forms, original/gallery associations, phone, email, scraper, drafts and revision history stay protected. No old-product transfer, production fixtures, index activation, paid provisioning, external messaging, or copying QA content/media identities to production. The owner renewed Studio sign-in; use read-only production checks. Main/production status in older entries below is historical; see PR #36 and the final local production receipt for the outcome.

---

# Saved release candidate - draft PR 36, protected Preview READY

3 October 2026. Draft PR https://github.com/rivyalivingart2/RivyaLivingArt2.0/pull/36 contains the complete P6/P7/P8 candidate. Read `docs/redesign/P8-FOLLOW-UP.md` and `p8-preview-receipt.json`. Six hosted HTTP checks pass for application source a14f161. Main is unchanged; the draft PR is held for the precise remaining performance, authenticated runtime, physical/device and key-custody gates. Backup schedule and receipt defects are repaired and the new Drive archive verified. Do not ask for a generic repeat approval, claim full acceptance, or create another PR for this same candidate.

---

# Current continuation - P8 follow-up candidate; technical release gates remain

3 October 2026. The owner requested completing the remaining engineering, backups and authorized release, then delegated available actions. Read `docs/redesign/P8-FOLLOW-UP.md` and `docs/decisions/2026-10-03-release-follow-up.md`. Compact Studio record reads and public source reduction pass isolated regression checks. The paused backup automation is active with catch-up checks; same-day/idempotent receipt writing is repaired and a fresh remote backup verified. Prepare the detailed draft PR and protected Preview under the recorded instruction. Main/production publication remains held for failing performance and unresolved authenticated/device/key-custody evidence; do not claim full P7/P8 completion or repeat a generic approval question. Preserve all protected records, contacts, scraper and history. Earlier local-only and approval-pending statements below are historical.

---

# Current continuation — P7 repairs and P8 preparation saved; acceptance gates open

3 October 2026. Read `docs/redesign/P7-CHECKPOINT.md`, `P7-VERIFICATION-REPORT.md` and `P8-RELEASE-PACKET.md`. Local branch `codex/p7-performance-release` includes completed P6 and P7 application repairs. Final build, recorded flow/privacy/security tests and protection comparisons pass. Full P4 performance/P7 acceptance is NOT complete: final desktop/mobile loading and some interaction diagnostics miss targets; field p75, human screen-reader/physical-device/full-family acceptance, independent key custody and daily backup/RPO proof remain open.

The owner confirmed independent password-manager and sealed offline recovery-key copies are not verified. Do not ask for the key or mark custody complete. Fresh remote encrypted backup and controlled 19-table service restore passed; prior backup gap was 52.21 hours. P8 packet, detailed local PR draft, rollback and editing guide are prepared. No source push/PR/deployment/production publication occurred. Keep work local until a new explicit push-main instruction, then use a detailed PR. Preserve products/forms/originals/galleries/contacts/scraper/drafts/history; no product transfer. Earlier status entries below are historical.

---

# Current continuation — included P6 complete locally

3 October 2026. The owner requested full P6. P6A–P6E included implementation and isolated QA are complete on `codex/p6-legacy-language-journeys`. Read `docs/redesign/P6-CLOSURE.md`, `P6-CHECKPOINT.md` and `p6-validation.json`. Conditional T34/T37/T45/T47 remain inactive; business editorial translations still require actual review/publication. Do not claim production is translated or updated. Earlier P6A-only notes below are historical.

Keep work local until a new explicit push-main request, then use a detailed PR. Preserve products/forms/categories/galleries/originals/contacts/scraper/drafts/history and manual-send behavior. No old-product transfer, production publication or automatic service activation. No language-URL migration or indexing activation is selected. S09 new-product media remains deferred; P4 performance acceptance and P7/P8 remain open. P7 has not started.

---

# Current continuation — P6 started locally

3 October 2026. The owner requested starting P6. Continue on `codex/p6-legacy-language-journeys` from main `c94427de88d45a216fdf545840efef2f875e5789` (PRs #34/#35 already merged and deployed). Read `docs/redesign/P6-CHECKPOINT.md`. P6A reviewed legacy routing and read-only publication/category diagnostics are implemented and verified locally. Continue P6B reviewed language journeys. Language journeys, exact unverified product/article mappings and remaining P6 slices stay open until evidenced; do not describe all P6 as complete.

Keep work local until a new explicit push-main request, then use a detailed PR. Preserve products, forms, galleries, originals, contact values, scraper, drafts/history and manual-send behavior. No old-product transfer, scraper work, production content publication or automatic service activation. No language-URL migration or indexing activation is selected. P4 performance acceptance and P7/P8 remain open.

---

# Current owner instruction — publish all P3–P5 updates through a detailed PR

1 October 2026. The owner explicitly requested all updated files in main through a PR containing full change details. Push `codex/p5-studio-workspace`, create the detailed PR, verify current checks and merge through the PR. Do not push directly to main or bypass required checks/reviews. This authorizes publication of the accumulated P3/P4/P5 source; later work stays local until a new instruction. Read `docs/decisions/2026-10-01-publish-p3-p5-main.md`, `docs/redesign/P3-P5-MAIN-SUMMARY.md` and the changed-file register. Earlier local-only statements below are historical for this delivery.

Preserve protected products/forms/galleries/originals/contacts/scraper/drafts/history; no product transfer or scraper work. Existing Git deployment triggers are unchanged. Do not manually deploy/promote, change environment settings or publish QA content to production. P4 T41/T61 performance acceptance remains open; P6–P8 are not started. Record the final PR URL and verified main commit in the local publication receipt and final response.

---

# Current continuation — P5A–P5E complete locally

1 October 2026. The owner requested COMPLETE FULL P5B–P5E. Implementation and isolated acceptance are complete on local `codex/p5-studio-workspace`. Read `docs/redesign/P5-CLOSURE.md`, `P5-CHECKPOINT.md`, `p5-validation.json` and `p5-family-coverage.csv`. All four P5 tasks are closed; the 43-family register explicitly preserves deferred, conditional and excluded boundaries. Earlier P5-in-progress entries below are historical.

Products, forms, originals/gallery associations, canonical contacts, scraper, drafts and history remain protected. No old-product transfer or scraper work. Keep all changes local until an explicit push-main request, then use a detailed PR; no push/deployment/production publication occurred. P4 performance acceptance T41/T61 remains open. P6–P8 are not started. Read the closure limitations before making any broader release/service claim.

---

# Current continuation — P5 in progress; P5A implemented locally

1 October 2026. The owner requested START P-5. Continue P5B inquiry continuity on local `codex/p5-studio-workspace`. Read `docs/redesign/P5-CHECKPOINT.md`, `P5A-IMPLEMENTATION.md` and `P5-REFERENCE-COMPARISON.md`. P5A supplies the shared old-reference Studio shell, accessible navigation/page finder, sign-in presentation and initial scoped inquiry queue. The full P5 tasks and 43-family state coverage remain open; P5B–P5E are next. Earlier P5-not-started statements below are historical.

Keep products, original/gallery associations, contact values, forms, scraper, drafts and history protected. No old-product transfer or scraper work. Everything stays local until the owner explicitly requests push to main; then use a detailed PR. No push, deployment or production publication. P4 T41/T61 performance acceptance remains open. P6–P8 are planned.

---

# Current continuation — P4B–P4E implemented and functionally verified

1 October 2026. The owner requested COMPLETE P4B–P4E. Implementation and isolated functional checks are complete on local `codex/p4-detailed-pages`; **performance acceptance remains open** (T41/T61, local loading above target). Read `docs/redesign/P4-CLOSURE.md`, `P4-CHECKPOINT.md` and `docs/decisions/2026-10-01-p4-completion.md`. Historical P4B–P4E-not-started entries below are superseded. P5–P8 have not started.

Preserve products, original/gallery associations, contacts, scraper and history; no product transfer or scraper work. Use the supplied Drive folder and current destination drafts for any later authorized release. Keep everything local until the owner explicitly requests push to main; then use a feature branch and detailed PR. No push, PR, deployment or production content publication occurred. Functional QA is not a performance or production-release certificate.

---

# Current continuation — P4A implemented; P4 in progress

1 October 2026. The owner requested START P-4. P4A shared navigation and detailed homepage implementation have isolated QA evidence. Continue P4B–P4E on local `codex/p4-detailed-pages`; do not treat the whole phase as complete. Read `docs/redesign/P4-CHECKPOINT.md`, `docs/redesign/P4-HOME-SECTION-DISPOSITION.md` and `docs/decisions/2026-10-01-p4-start.md`. P0–P3 closure remains valid. Historical P4-not-started entries below are superseded.

Preserve products, original/gallery associations, contacts, scraper and history; no product transfer or scraper work. Use the supplied Drive folder. Everything stays local until an explicit push-to-main instruction; then use a feature branch and a detailed PR, with no direct main push. No deployment or production content publication occurred. Homepage QA revision 32 and process revision 14 are isolated values, not production versions. P5 has not started.

---

# Current continuation — P0 through P3 complete in isolated QA

1 October 2026. Full P3 (T11, T15, T19, T60) implementation and isolated acceptance are complete. Read `docs/redesign/P3-CLOSURE.md` and `docs/decisions/2026-10-01-p3-completion.md`. The local branch is `codex/p3-editorial-images`; no P3 push, PR, deployment or production publication occurred. P4 has not started. Historical pending P3 entries below are superseded by this closure.

Preserve products, original/gallery associations, approved contacts, scraper and revision history; no old-product transfer. Use the supplied Drive folder. Keep all work local until the owner explicitly says push to main, then use a feature branch and detailed PR with complete changes, affected areas, validation, protection, limitations and recovery; merge through the PR after checks. No direct main push.

---

# Current owner rule — local work; detailed PR when pushing main

1 October 2026. All development stays local unless the owner explicitly says to push to main. On that instruction, push a feature branch and open a pull request to main with the complete change description, affected areas, verification, protected-data checks, limitations and recovery notes. Merge through that PR after required checks. Do not push directly to main, silently push working branches, deploy, or publish production content. Local commits are allowed. The owner's previous direct push is historical, not the rule for future work.

The owner has now authorized starting P3 from main `8990e73` on local `codex/p3-editorial-images`. Use images from https://drive.google.com/drive/folders/1P2HCTmPge6HsEwtoo-xGEzPTSn68oZOW. Read `docs/redesign/P3-CHECKPOINT.md`. Keep existing products, contact values, galleries and scraper protected; no old-product transfer. P3 is in progress, not complete.

---

# Current owner instruction — publish P0/P1/P2 changes to main

1 October 2026. The owner explicitly requested "PUSH ALL CHANGES INTO MAIN BRANCH" after P2 completion. This authorizes merging and pushing the completed implementation commits to GitHub main and supersedes the earlier no-push/no-merge boundary for this delivery. Preserve all protected product, contact, gallery, scraper and history contracts. No new phase implementation, manual deployment/promotion or production content publication is requested. Existing Vercel Git deployment configuration is enabled and is left unchanged; a push may trigger its normal pipeline. See `docs/decisions/2026-10-01-publish-p2-main.md` and `docs/redesign/P2-CLOSURE.md`.

---

# Current continuation — P0/P1/P2 complete in isolated QA

1 October 2026. Read `docs/decisions/2026-10-01-p2-completion.md` and `docs/redesign/P2-CLOSURE.md`. The owner requested P2 completion; implementation and isolated acceptance are closed on `codex/p2-homepage-workflow`. Preserve products, factual/contact values, forms, media associations, scraper and revision history. No old-product transfer, push, merge or production release. P3 is the next planned phase; P4 owns full detailed-page restoration. Historical pending P2 statements below are superseded by the closure report.

---

# Current continuation — P0/P1 complete in QA; P2 in progress

1 October 2026. Read `docs/decisions/2026-10-01-p0-p1-closure-p2-continuation.md` and `docs/redesign/P1-CLOSURE.md`. The owner requested P0/P1 completion before P2. All phase implementation/isolated checks are closed; production and unsupplied legal/business facts remain the later release gate. Continue P2 on `codex/p2-homepage-workflow`, preserving existing products, media, contacts and scraper. No old-product transfer or production release. Historical pending statements below are superseded where the closure report supplies new evidence.

---

# Current continuation — P2 homepage workflow

1 October 2026. Read `docs/decisions/2026-10-01-p2-homepage-workflow.md` and `docs/redesign/P2-HOMEPAGE-CHECKPOINT.md` first. Work is on `codex/p2-homepage-workflow` from the saved P1 commit. The minimum home draft → exact preview → publish → anonymous verification → restore workflow passed isolated QA; broader P2 coverage remains in progress. Preserve current products, galleries, contacts and the scraper. No old-product transfer or production release. Earlier checkpoint text below is historical where superseded.

---

# Current owner scope — P1 Studio foundations

30 September 2026. The owner explicitly started P1 of the consolidated old-to-new implementation plan. Read `docs/decisions/2026-09-30-p1-foundations.md` and `docs/redesign/P1-FOUNDATIONS-CHECKPOINT.md` first. Work is on `codex/p1-studio-foundations` from main `7569bbf720e73c5fee0117618a702b297af116de`. Development and local checks for this phase are authorized; production release remains a separate gate. No scraper work and no old-product transfer. Use the confirmed new-site contacts for the existing Imprint candidate. Preserve current products, contacts, media associations, authentication and manual-send behavior. Older entries below are historical where superseded.

---

# Active owner instruction — Midnight atelier presentation redesign

24 September 2026. Read docs/decisions/2026-09-24-midnight-atelier.md and docs/redesign/MIDNIGHT-ATELIER-CHECKPOINT.md. The owner explicitly resumed presentation work and its quality gates. Work on codex/midnight-atelier from current main; preserve the current published ShopSite architecture and all data/security behavior. Publish a protected Preview for owner visual review only. No main merge or Production deployment is authorized for this new redesign. Prior stopped operational work remains pending.

---
# Active owner instruction — publish current work; further development and testing stopped

24 September 2026. Read docs/decisions/2026-09-24-publish-current-stop-testing.md. The owner explicitly requested completing current publication to GitHub main and Vercel Preview/Production, stopping new work and testing, and documenting all pending work. This supersedes the earlier all-findings-closed release hold for this current deployment. Do not resume the pending development or test programme without a new owner request.

Read docs/redesign/PENDING-WORK.md for the complete current status and docs/redesign/PHASE-11-CHECKPOINT.md for continuation. Master revision 3.13 records this scope change; Phase 11 is not fully complete. Existing completed work, restricted runtime configuration, retention-control schema and deliberate approved public-content publication are being released. Preview/Production share the authorized database/private store with independent session secrets. WhatsApp remains saved-order Open/Copy plus manual customer Send only. Search indexing remains off; automatic Git deployment remains off.

No new purchases, customer accounts, payments, Netlify, WhatsApp automation or Sheets synchronization. Preserve original assets, drafts, data, revision history, secrets and private backups. The older checkpoint text below is historical where superseded.

---

# Active checkpoint — Phase 11 verification in progress

The owner authorized completing all remaining work, normal GitHub main publication and intentional Vercel Preview/Production release after the applicable checks. Read docs/decisions/2026-09-24-pro-final-release.md and 2026-09-24-operating-policies.md. The correct Vercel team now has Pro; the earlier free-only/Hobby hold is superseded. No additional paid service is authorized.

Continue codex/final-verification-release from merged main fc6d3fe (PR #25). Read docs/redesign/PHASE-11-CHECKPOINT.md for exact current evidence and pending tasks. Master revision 3.12 is an in-progress verification update, not a release certificate. No repeat plan, asset, shared database or shared private-store approval is needed.

172 unit checks, 12 preflight checks, lint/typecheck/build and the first isolated browser order/Studio tests have passed at their recorded intermediate source; later edits require rerun. QA uses separate database rivya_qa_20260924 and private store store_maHrpDDHXPR93N0w, with independent credentials. The normal Preview/Production shared resources must never receive synthetic tests. QA now has 120 published products, 47 content entries including 36 articles and 131 media entries. Shared-resource publication remains pending.

The encrypted database archive was uploaded to an owner-only Drive folder and restored into isolated resources with matching counts/digests for 16 tables. Recovery-key password-manager/physical custody, scheduled operations, reference/remote restore and complete privacy lifecycle remain unverified. Do not mark these achieved because the owner delegated them. Current live runtime grants, full device/security/accessibility/performance/media/license QA and exact deployment checks remain release gates.

WhatsApp remains saved-order Open/Copy followed by manual customer Send only. No bots, generic chat, notifications, payments, customer accounts, Sheets synchronization or Netlify. Preserve original assets, drafts, revisions and data. Do not rerun historical migrations or wholesale historical publication candidates. Keep automatic Git deployment disabled and normal order flags off until their release checks pass. No new main merge or deployment has occurred in Phase 11.

Older records below are historical where superseded.

---

# Active owner instruction — approved full redesign

Latest override: read docs/decisions/2026-09-23-vercel-only-hold.md. Publish saved source to the existing GitHub work branch; Vercel only, no Netlify. Commercial deployment remains on hold under free-only constraints. Do not bypass vercel.json's automatic-deployment hold or activate business workflows on Hobby without resolved eligibility.

Continue the approved master from `docs/redesign/CHECKPOINT.md`. Read `docs/decisions/2026-09-23-approved-full-redesign.md` first. Older appearance, frontend-only and release restrictions below are historical where superseded. Preserve source/data; final QA and eligible free hosting remain release gates.

---

# Latest owner override — 23 September 2026 production release

The owner confirmed Studio login and explicitly authorized merging the full current update into main and deploying Vercel Production, using free services only. See `docs/decisions/2026-09-23-production-release.md`. This overrides the historical no-main/no-production and public holding-page restrictions below for this release. Keep Studio server authentication, concept/sample disclosures, separate production data, and the deferred formal-QA boundary. The actual CMS remains partially local; deployment is not full backend completion.

---

# RivyaLivingArt repository guidance

Read this file, `PROJECT_STATE.md`, `docs/CODEX_WORKFLOW.md` and the applicable
Revision 8 specification before editing.

## Current checkpoint — 22 September 2026

The owner approved the existing Sites design and then asked to continue non-image
development while they generate assets. The same Site is preserved; no redesign,
new Site, deployment or sharing change is authorized. Current source fixtures are
120 products (84/24/12), 36 articles, 42 FAQs, 24 fictional testimonials and 40
fictional enquiries. Older counts below are historical.

Continue `codex/sites-approved-design`. See `docs/sites/non-image-development.md`
and `docs/sites/source-version.json` for the latest native source and port.
CSV/XLSX parsing, local batches/exports, draft continuity, cleanup dependencies and
review validation now exist as browser-only demonstrations. Database/auth/storage
and real WhatsApp handoff remain in R8 integration; do not describe them as connected.
Formal QA remains deferred. The owner is preparing missing assets; do not generate
substitutes or retry the previously blocked Drive child access.

The GitHub repository is PUBLIC. After the public-disclosure blocker was reported,
the owner explicitly instructed: “Put this updated code into gitrepo” with this
repository URL. This authorizes publishing the prepared source and included approved
asset derivatives on `codex/sites-approved-design`. See
`docs/decisions/2026-09-22-approved-code-publication.md`. Keep main and the live Site
unchanged; no new sharing, secrets, domains or manual deployment is authorized.
The earlier rejection is history, not a reason to request the same approval again.

Publication is complete. GitHub implementation commit
`d74ca0ee722011bd453b08bc8939892413b0bd86` has the exact tree of local authoring
checkpoint `96af6ca360b68dafe33e94f2ee20e7cf49bccb3a`. Draft PR #13 targets main.
Read `docs/sites/github-publication.json` before continuing; fetch the current remote
branch instead of assuming the older local and connector-created commit IDs match.
The existing Git integration created a protected Preview automatically. No manual
deployment or production change was requested. The saved/live Site is unchanged.

## Latest owner decision — 21 September 2026

**This is a new build.** The Markdown files were the brief, not missing application
source. The owner explicitly authorized the first application here; see
`docs/decisions/2026-09-21-new-build.md`. Earlier source-restoration guards are
superseded for this initialization. Do not restart the source-gap/approval loop.
The first frontend source now exists. Preserve it, all briefs and Git history.

The owner subsequently authorized merging completed R8-4A into main, then
continuing R8-4B. PR #11 is merged at
`8b8c81f5d85bf0a78d165184b3d8e460073452e4`; the remote SHA was verified.
New R8-4B work continues on the development branch; the preceding merge is not
standing authorization to merge this new slice. See
`docs/decisions/2026-09-21-r8-4a-main-merge.md`.

**Latest override: development first; all testing-related work moves to the final
stage after backend/database integration.** Do not run per-slice lint, test,
preflight, build-verification or browser/visual QA gates. Compiler/typechecking
may resolve development wiring only; it does not establish TESTED. Keep all test
source, commands and checks intact for final QA. This overrides conflicting timing
in the older briefs and workflow. See
`docs/decisions/2026-09-21-development-first.md`.

- Exact brand: **RivyaLivingArt**. Large collectible resin furniture/spatial art
  leads; memory art and personal gifts are distinct secondary journeys.
- Continue public frontend, then Studio, then the R8-5 protected development-preview
  handoff and owner review, before backend R8-6 onward. Full QA is no longer a
  prerequisite to integration. Do not invent owner visual approval. Track
  SOURCE_IMPLEMENTED, UI_READY, BACKEND_CONNECTED and TESTED separately.
- Dark forest/bronze/ivory tokens. Reuse components and typed, labelled fixtures.
  No fake login, sessions, persistence, upload, payment, review or production claims.
- Build our own CMS later; no Sanity, scraping, Higgsfield, continuous Drive sync,
  in-CMS media generation, customer accounts, checkout or payment integration.
- S01 MFA/passkeys, S02 PDF quotation builder, S03 enhanced finish comparison and
  S04 private client approvals remain excluded. Do not re-propose them.
- Use approved Drive media first. Write missing image/video prompts for the owner
  in the existing separate asset document. No replacement logo, product recolouring,
  private media or large original media collections in Git.
- Thirty-six labelled source fixtures exist: 24 LARGE / 6 MEDIUM / 6 SMALL;
  two images, 34 pending visuals. Article source is 12/36, FAQs 42/42 and
  fictional testimonials 24/24; operational scenarios remain 0/40. The complete
  demo dataset, persistent CMS, staff login, data/storage and real enquiries remain
  planned work.
- Current visual flag is NOT authentication. Online preview requires separately
  verified deployment protection. Never enable fixture routes in Vercel production.
- The master Section 1 already supplies the business phone, WhatsApp, email and
  map link. R8-3D corrects the earlier claim that contacts were missing. Use those
  exact supplied values; do not infer an address, opening hours or delivery terms.
  Local fictional drafts must never be transferred into live contact links.
- No secrets in code, prompts, commits, diagnostics or `.env.example`.

## Deferred checks and current development boundary

Node 22; npm project at repository root. The actual dependency tree and
package-lock.json exist. R8-4B adds actual Tiptap with exact 3.31.3 pins for core,
pm, react and starter-kit; retain the existing Next/React versions. Commands below
remain available for the final QA stage; this is not an instruction to run them
during the current development slices.

```sh
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npm run test:preflight
npm run test:runtime # after npm run build; real HTTP checks
npx playwright install chromium # once per browser environment
npm run test:e2e # after npm run build; actual local browser tests
```

Historical R8-3A memory/personal checks passed before the timing override:
48 unit, 12 preflight, 95 HTTP and 146 Chromium browser tests, with 10 mobile-only
cases inapplicable on desktop/tablet. Clean npm ci, lint/typecheck/build pass. Read
`docs/R8-3A_MEMORY_PERSONAL_FRONTEND.md` for current evidence and media limits.
Browser Use's cloud loopback restriction is unchanged; the historical local
Playwright evidence did not weaken network controls. Those results do not cover
R8-3B, R8-3C, R8-3D, R8-4A or R8-4B and are not R8-5 owner approval.

R8-3B provides typed, client-only commission, preservation and gifting forms,
local validation/summary, an explicitly simulated receipt and local reference-image
preview. No real submissions, uploads, persistence or messages. Read
`docs/R8-3B_INQUIRY_FRONTEND.md`; its new source is untested and final QA is deferred.
R8-3C adds journal/article, FAQ, about/process/materials/care, portfolio, contact,
architect enquiry and catalogue-search frontend pages. Six full labelled article
drafts (DB001–DB006), 42 FAQ answers and three fictional project studies are source
content, not published business claims. Read `docs/R8-3C_PUBLIC_PAGES.md`.
R8-3D adds shared 404/error/root-error/loading/empty/unavailable states, media
fallbacks and gallery retry, local form-failure and blocked-WhatsApp simulations,
and a guarded `/preview/states` presentation gallery. This gallery is implemented
UI, not performed QA or runtime fault injection. Pending indicators and boundaries
belong after route validation; avoid a root loading boundary that could stream
a success response before an invalid route is rejected. Six more article drafts
(DB007–DB012) bring the source total to 12/36, leaving 24. The complete
120-product/24-testimonial/40-scenario targets remain ahead. Read
`docs/R8-3D_SYSTEM_STATES.md`; all new source remains untested pending final QA.
R8-4A adds the isolated `/preview/studio` shell, fixture-derived dashboard,
URL-filtered product list, local product drafts and typed form-builder presentation.
Guard each harness layout/page and metadata before fixture access. The existing
`/studio` holding boundary remains intact, with a link to the harness only when
preview is allowed: no fake staff identity, authenticated session, backend
permission or persistent operation. Root application framing
omits public chrome only on the Studio presentation path. Future modules have
explicit status pages, not invented working editors. Local review/draft/builder
changes never alter public source fixtures or database records. Product tier
changes require confirmation and preserve the other tier fields in local state.
The form builder uses the public schema and shared input renderer; allow only
typed fields/conditions, never JavaScript. Read `docs/R8-4A_STUDIO_CATALOGUE.md`.
Twelve additional LARGE records bring products to 36/120, with 84 remaining.
No new media is mapped.

R8-4B adds the guarded content hub, typed page/article/FAQ/testimonial editors,
eleven registered marketing section types, actual Tiptap, the shared media picker,
responsive preview and local autosave/validation/history presentation. Read
`docs/R8-4B_CONTENT_WORKSPACE.md`. Content and media routes live under
`/preview/studio`; keep every page and metadata guard before fixture access.
Shared renderers use typed JSON and stable references, never arbitrary HTML,
JavaScript or private attachments. Product specifications/prices stay catalogue-owned.
The marketing composer does not replace the product inquiry form builder.
All checkpoints, duplicate/archive/restore and conflict/failure examples are
session-local presentation, not durable saves, publication, staff audit or actual
server conflict protection. Public source fixtures remain unchanged by local edits.
The media picker distinguishes the two preview-only images from 34 pending
visuals and never invents production rights approval or working upload/storage.
DT001–DT024 complete the supplied fictional quote batch. The shared quote renderer
always retains “Fictional sample — not a customer review.” No stars, reviewer
photos, verified badges or review-schema claims. Remaining products/articles,
page drafts, history examples, studies and operational fixtures are still incomplete.
Next: R8-4C enquiry pipeline/status details and internal notes, catalogue
import/export controls, demo manager/remove dialogs and independent menu visibility.

The owner-created Vercel project exists, with prior READY main deployments and
Preview authentication reported enabled. Recheck deployment target and protection
before publishing. Read-only project inspection during R8-4A still reports Node
`22.x`, aligned with the repository. No setting was changed by this task; the prior
Node24 mismatch is resolved in the current project setting. See
`docs/VERCEL_RUNTIME_ALIGNMENT.md`. Never expose fixtures in production.

## Git and continuity

Work on `codex/r8-first-frontend` or its reviewed successor in the confirmed repo.
Inspect current changes, remote identity and deployment triggers. After a coherent
slice: update docs/checkpoint, inspect changes for the development commit, stage
only owned files, commit normally, publish to the safe work branch and verify the
actual remote SHA. Record testing as deferred, not passed; existing evidence only
covers its recorded revision. The R8-4A merge is not standing authorization to merge
later slices. No force-push, branch deletion, automatic production release or
live-domain changes.

The full requirements remain the nine Revision 8 documents. Apply the dated new-build
override above where they still describe nonexistent prior source. Do not rewrite
historical audits or create another competing master pack.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
