# M10 language, factual and media evidence — 12 October 2026

The assistant meaning pass is now complete for the **34 previously outstanding articles**. This closes the missing assistant pass, not independent Hindi/Gujarati acceptance. No Studio save, publication, protected-page edit, media change or customer-data change was made by this task.

| Work | Observed result |
| --- | --- |
| Remaining articles | 34; DB002–DB036 excluding previously reviewed DB010 |
| English fields compared | 462 |
| Hindi/Gujarati values compared | 924 |
| Corrected target values | 200 across 33 articles; DB019 needed no concrete semantic correction |
| Supplemental draft import candidates | 68, one per article and language |
| Article assistant review across old and new receipts | 36/36, including earlier DB001 and DB010 |
| Independent native acceptance | 0 new approvals; no reviewer receipt found |
| Original English and field coverage | Exact hashes and strings preserved |
| Existing 7 protected page translations | Untouched; earlier assistant evidence retained |

## What changed and why

Every source field was read alongside its Hindi and Gujarati drafts in the retained historical snapshot. The supplemental candidates correct ambiguous or opposite meanings and recurring contextual errors: timber grain translated as food grain, material properties as real estate, bespoke commissions as official commissions, surface finish as completion, image crop as harvest, and quoted prices as quoted text.

Three Gujarati corrections are especially material: DB003 now preserves that a circle has **no** short end or long side; DB021 restores **unambiguous** written dates; DB031 restores **unambiguous** quantities. DB014 also restores the Hindi warning against assuming that taking doors off will solve access. No claim of native fluency approval follows from these corrections. Idiom, terminology and regional preference still need independent fluent-human review.

The complete artifact is [candidate-review.json](../../editorial-translations/m10-followup/candidate-review.json). Each record carries its exact English source hash, all source/target fields, reviewed paths, AI review scope, uncertainty, and explicit `NEEDS REVIEW`/local-only status. [correction-diff.json](../../editorial-translations/m10-followup/correction-diff.json) records all 200 before/after values. [review-ledger.json](../../editorial-translations/m10-followup/review-ledger.json) supplies per-article coverage. [import-manifest.json](../../editorial-translations/m10-followup/import-manifest.json) identifies all 68 candidates.

The source is the retained 6 October snapshot, SHA-256 `0a5f935fde9634e9aa4d5b840108ab3a0f8f7ac262b8f8302f7af9b7b03ecd08` for `article-review.json`. A separate guarded, read-only production check at **2026-10-12 14:48:20 UTC** subsequently matched all **34 draft and published English sources and all 462 editable fields**, with no added or missing paths. See [M10-LANGUAGE-FRESHNESS.md](M10-LANGUAGE-FRESHNESS.md) and [its machine-readable receipt](m10-language-freshness-evidence.json).

That fresh check found **all 68 current Hindi/Gujarati production target maps empty**. The **924 historical before-values are not currently stored in those maps**; this is missing target text, not evidence of a later editor's changed translation. These 68 proposed packets remain local, unreviewed candidates. Their original not-rechecked metadata predates the separate freshness receipt, which supplies the timestamped verification without changing the reviewed packet hash. Immediately before any later import, recheck English hashes and target absence; the snapshot is not a permanent conflict lock. Any later draft application must be described as adding missing translations, never as overwriting verified current targets. DB001, DB010 and the seven page translations were excluded from the freshness query and are not regenerated here.

## M9 disclosure and rights evidence

Static checks covered all **480** authored M9 records and unique IDs. All 120 Portfolio records retain `concept` classification and explicit unbuilt/no-customer/no-completed-project statements. All 120 Testimonial records retain `fictional` classification and the “Fictional sample — not customer feedback” disclosure. None of those fictional records has a rating, star score or reviewer portrait. This is disclosure/schema validation, not a second full editorial reading of all 62,611 M9 words.

The entries were already published, as evidenced by `release-m5-m9-evidence.json`. Historical `draft-only` status in the original M9 manifests describes delivery-time state and does **not** mean that publication is still pending. No publication was replayed. The 480 new English records continue to use explicit English fallback for Hindi/Gujarati; no new M9 translations were invented.

The M9 media manifest still records **21** pending rights-provenance and **21** pending crop-approval entries. The user's instructions already authorize using supplied media and publishing the approved work. That permission is retained. It does not identify an image's original creator, third-party rights, allowed reuse, or an asset-specific acceptance receipt.

The Google Drive skill was used for a bounded read-only check of the [M9 delivery folder](https://drive.google.com/drive/folders/1THI4I4cSuA5Af1AmxtqfDD_aWJT-dRQ1), its **35** current children, and targeted “Rivya rights”/“Rivya permission” search results. The [delivery README](https://drive.google.com/file/d/1GrxsSHUa0OFbv30B9aupn-urDGUBnYOj/view), modified 9 October, explicitly retains the rights/crop/native-review gates. A historical [source instruction document](https://docs.google.com/document/d/1HeClgaU4FpeKJhcNZ1k8ToNcfjoyZl6ZJI5cUhd2a_I/edit), modified 28 September, supports prior media-use instructions but supplies no asset-specific provenance receipt. No additional rights or native-review receipt was found in this bounded examination; this is not a claim about every file in the account. [drive-evidence.json](../../editorial-translations/m10-followup/drive-evidence.json) records the exact scope and returned metadata. No Drive file, permission or sharing setting changed.

## Evidence that remains necessary

| Gate | Concrete evidence needed | Why still open |
| --- | --- | --- |
| Independent Hindi/Gujarati acceptance | Actual reviewer identity, language competence, date, exact source/candidate hashes, full-text corrections and explicit approval | An AI review cannot supply an independent human observation |
| Draft freshness before application | Recheck source hashes and target absence immediately before any later import; exact saved preview after an authorized save | Timestamped read-only evidence now confirms all 34 current English sources match and all 68 target maps are empty; no candidate has been applied |
| Media provenance | Creator/rights holder, source or creation evidence, permitted public use and restrictions; necessary third-party consent where applicable | The 21 manifest entries lack this per-asset evidence in examined records |
| Crop acceptance | Actual acceptance associated with each used desktop/mobile slot and crop | Prior visual inspection is available but is not an invented owner sign-off |
| Factual acceptance | Applicable owner/technical records for real dimensions, materials, prices, availability, delivery, installation, preservation or performance claims | Educational concepts and fictional samples do not establish real commissions or technical outcomes |

## Verification and continuation

Use [M10-EXTERNAL-ACCEPTANCE-HANDOFF.md](M10-EXTERNAL-ACCEPTANCE-HANDOFF.md) for the exact 36-article reviewer packet paths, required reviewer response, source-specific outstanding rights/factual records, and links to the existing device/reader/field/inquiry evidence schemas. It is a handoff, not a completed acceptance receipt.

Run `node docs/editorial-translations/m10-followup/build-review.mjs` with Node 22. The offline builder checks all 34 English hashes, exact field coverage, nonempty target-script values, unchanged existing numeric values, original source-file preservation, all 120 concept disclosures, and all 120 fictional disclosures with no ratings/portraits. It emits [m10-language-rights-evidence.json](m10-language-rights-evidence.json) and the complete review packet. All checks passed for this candidate.

Continue from the supplemental packet, keeping status `NEEDS REVIEW`. Do not bulk mark reviewed, publish these protected translations, invent reviewer identities or permissions, or treat publication of concepts as evidence of real projects. The original English, policies, contact/business facts, media associations/crops and order records remain preserved.
