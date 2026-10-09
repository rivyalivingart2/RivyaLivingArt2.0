# M0–M4 interim release — 9 October 2026

The owner requested all completed work on `codex/old-design-migration` through a detailed PR into `main`. This release contains implementation commits `01453fb`, `e89002d` and `cfabb70`, plus the release documentation and read-only verification tool. It is not completion of M5–M11. The PR description records the exact final head, checks, merge commit and resulting deployment after verification.

## Included

- M0: protected-record fingerprints, isolated loopback QA, guarded SQL transport and baseline captures. Private evidence stays outside Git.
- M1: reconciled 85 page templates, 74 sections, 18 homepage slots, 16 landing block contracts, 32 Studio destinations, 60 tasks and 111 supplied Drive candidates; prepared explicit parity acceptance sheets. Source discovery is separate from implementation/acceptance.
- M2: blue/ivory/champagne palette, local Inter fonts, public header/footer/section navigation, five Studio navigation groups, responsive frames, sidebar persistence and reduced layout movement. Existing 16 working Studio destinations remain reachable.
- M3: separate presentation draft/publication records and immutable revisions; Page design editor; saved desktop/mobile and locale previews; role checks, revision conflict detection, publication dependency checks, rollback-safe history and restore-as-new-draft.
- M4: optional 18-slot homepage composition, keyboard-accessible collection doors, seven public-page design adapters, shared Process/Materials sections, private seven-section workshop structure, conditional service/factual bindings and conspicuous concept/fiction labels.
- Media: original owner-supplied poster, WebM and MP4 material visualization, explicit Play/Pause/native controls, offscreen pause, format recovery and still-image fallback. Matching Drive files were fetched and hash-verified; the MP4 copy was newly uploaded. Local Studio saves metadata/Drive references; media bytes are static assets, not database blobs.

The seven page adapters are Our story, Process, Materials and care, Architects, Collectible design, Contact and Commission. Existing page copy, selections, crops, translations and current contact/business details remain the source. No copied old customers, product records, order data, claims or server actions are imported.

## Verification and limitations

The application fingerprint in `m4-evidence.json` identifies the compiled candidate independently of later documentation commits. It passed 311 unit tests, 42 browser workflow checks, production build/type validation, changed-source lint, four viewport widths and scoped assistant screenshot review. All 13 protected local scopes match the baseline. Historical phase evidence retains its original scope and dates.

Release verification uses fresh read-only production fingerprints before/after, exact GitHub head/check inspection and the matching Vercel production commit. Hosted checks and deployment identity are recorded in the PR receipt; do not interpret this prospective description as a passed deployment.

## Production activation boundary

Read-only inspection on 9 October found both `rivya_presentations` and `rivya_presentation_revisions` absent. The existing runtime role has no CREATE privilege on the public schema. No production DDL or content writes were attempted. Public readers deliberately retain the existing renderer when these additive tables are missing; Studio Page design reports unavailable rather than claiming a saved revision exists. Shared frame/style changes and static media can deploy independently.

A database owner must apply the reviewed `scripts/presentation-schema.sql` against the verified production database, then grant the existing runtime role only SELECT/INSERT/UPDATE on `rivya_presentations` and SELECT/INSERT on `rivya_presentation_revisions`. Do not grant schema CREATE or history UPDATE/DELETE to the runtime role. Then use a real signed-in Studio administrator to save a fresh design against current production content, inspect its exact saved preview and deliberately publish it. Never import local synthetic fixture snapshots/history. Confirm website revision, media playback, permissions and unchanged protected records after activation. The film is available in shipped assets but is not automatically selected on the production homepage.

## Continuation

See `PENDING-AFTER-M4.md`. M5 is earliest unfinished and still needs owner permission. The 480 new editorial entries remain uncreated. Full visual parity, human/native-reader/physical-device/field and genuine-business evidence remain open. Scraper work, old-product transfers, ingestion-dependent Catalog Fill and backups remain excluded.
