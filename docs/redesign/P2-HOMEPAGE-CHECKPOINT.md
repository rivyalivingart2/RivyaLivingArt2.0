# P2 homepage workflow checkpoint

1 October 2026. **The minimum homepage editing workflow is implemented and verified in isolated QA. The broader P2 specification remains partially implemented; no production release occurred.**

Branch `codex/p2-homepage-workflow`, based on P1 `a7606e9cbcd1d757596d558cf50ca66a8f47b8f0`. Read the [owner continuation decision](../decisions/2026-10-01-p2-homepage-workflow.md) and [field ownership inventory](P2-COPY-AND-FIELD-OWNERSHIP.md). Do not restart from historical presentation branches.

## Delivered

One registered `page:home` document connects Studio, content, editorial image usages and the public homepage. It includes hero/opening strip, curated existing products, category order, richer material story, ordered process steps, three journeys, optional journal selection, invitation, chapter visibility/order and extra story chapters. Desktop/mobile crop controls change editorial usage only. The composer reuses existing public and dark Studio tokens, focus states and control sizing.

The real saved-revision preview and public route share HomepageDocument. Preview requires the actual Studio session, is private/no-store/noindex, and embeds a same-origin mobile viewport. Only the preview frame permits same-origin framing; other Studio routes retain frame denial. Public rendering never falls back to a draft. Server-captured dependencies, validation and optimistic concurrency guard publication. Anonymous public readback is separate from the publication write and can be retried without publishing twice.

Revision comparison and explicit restore-to-draft support text, order, reference and crop changes. Local work survives version conflicts and interrupted saves. Draft recovery has explicit inline keep/replace actions. Public media remains the metadata editor; Site images opens the homepage usage editor.

## Executed isolated QA

Existing resources were found and identity-checked: database `rivya_qa_20260924`, runtime role `rivya_qa_runtime_20260924`, configured private store `store_maHrpDDHXPR93N0w`. Only runtime credentials were used; no migration credential, schema change, storage upload, account creation or permission change. Credentials were never printed or copied into this repository.

1. Saved source candidate as revision 1.
2. Changed the hero heading, existing-product order, journal references and material usage/crop. Saved revision 2 and reloaded the actual editor; anonymous homepage remained unchanged.
3. Checked exact revision 2 using the real desktop and 390 px mobile preview.
4. Published revision 3 from Studio and verified the anonymous response.
5. Compared/restored revision 1, then saved recovery as revision 4. Public remained revision 3.
6. Previewed and published recovery as revision 5. Later negative/concurrent tests ended at draft/public revision 10 with the original candidate editorial content restored. Exact private preview 2 remained available.
7. Verified stale writes, duplicate publication, unsaved publication, foreign origin, anonymous/invalid sessions, invalid references, forged client snapshots and nonexistent recovery sources are rejected. A temporary QA-only article was published then hidden to prove changed references prevent homepage publication; its history remains intact and it remains hidden.
8. Browser checks retained unsaved text during a 409 conflict and an interrupted save; canceling reload kept local work. Failed anonymous readback had a distinct retry state. Final built Studio readback verified revision 10.
9. Public and Studio widths at 320, 390, 768 and 1440 had no page-level horizontal overflow. Mobile and desktop focal values switched correctly. An editorial image delivery failure retained its frame, fallback, copy and CTA. Final built Studio browser error log was empty.
10. P1 follow-through: authenticated Content health loaded and linked to the exact home record. Saved/published the factual Imprint in isolated QA (draft 1, public 2); anonymous page and actual footer navigation showed the confirmed new-site contacts.

Final fingerprints of every catalogue, public-media and business-settings row matched the initial QA fingerprints. Current products/media/contact records were not changed. The old repository and original asset files remain unchanged. No scraper was run and no products were transferred.

## Local verification

- 207/207 unit tests; 12/12 preflight checks; 386/386 built HTTP regressions.
- TypeScript and production build passed with the existing Node 22 runtime and lockfile; 46 generated static entries (not a count of fully tested pages).
- Lint: zero errors, 67 existing warnings.
- Build-mode preview cache verified as `private, no-store`. Development mode had overridden this header; that initial assertion was resolved by testing the built application, not by weakening the expected protection.
- Full local evidence is in workspace `outputs/P2/`: Draft-Isolation.json, Recovery-Isolation.json, Built-QA.json, Responsive-QA.json, logs, screenshots and the implementation report.

## Remaining coverage and limits

- No existing active isolated QA editor account was available, so authenticated editor-role HTTP/browser verification remains pending. Admin UI and anonymous/invalid-session checks passed; no new account was created merely to claim coverage.
- Generic page editors still use their existing inline preview. Extend exact preview and richer structured editing to the remaining page families; do not label homepage verification as all-page completion.
- Finish global/footer/interface copy editing, richer text marks/links/quotes, detailed homepage-specific blocker navigation and the broader shared-component state inventory. The minimum workflow does not implement all 18 proposed homepage content sections.
- P3 must review the supplied Drive assets visually and expand page-slot assignments. This phase used existing approved derivatives; it did not claim new Drive image review or video production.
- Full keyboard/screen-reader journeys, physical mobile devices, translations, WCAG audit, measured Web Vitals and real deployment/cache/CDN checks remain later gates. Missing-revision preview behavior was checked; the mobile iframe network-timeout recovery was implemented but not successfully fault-injected in browser QA.
- Imprint publication occurred only in isolated QA. Full postal/registration facts remain owner-content gaps; no legal completeness is claimed. Production Imprint/terms publication and public verification are still pending.
- Saved preview fixes editorial content and captured dependencies, while its global shell uses current published settings. Public dependencies intentionally follow later publication/withdrawal.

## Continue here

Keep the current source and QA revisions. Complete the remaining P2 coverage listed above, then expand to P3 media assignments and P4 detailed pages, using this verified lifecycle. Use the isolated QA launcher and identity checks in the workspace; never point synthetic tests at normal Preview/Production. Do not rerun version-specific write-test scripts: they are intentionally non-idempotent. Read current versions first.

Prepare a concrete release candidate only after the planned release gates; GitHub push, merge, content publication to shared resources and deployment have not happened in this continuation.
