# Studio, product lifecycle and import contracts

Adapted from docs/studio-workflow.md, docs/product-lifecycle.md and docs/import/README.md at OLDWEBSITE 2dd6d5d. Hashes: ../MARKDOWN-MIGRATION.csv.

Preserve the old sequence: source observation → staged immutable product → review → protected catalogue draft → explicit confirmation → chosen export. Confirmation is distinct from publication. A source tier describes the discovery list; a product tier describes the creation; an import-list number is separate provenance. Do not equate these values during reconciliation.

Source/external ID pairs are deterministic identity. Slug collisions do not authorize updating unrelated products. Destination product IDs, URLs, prices, variants and original media relationships remain authoritative. Preserve owner edits before considering refresh rules; an imported update must not replace an edited gallery. Preserve tombstones so a later import cannot resurrect removed records.

Bulk selection must distinguish this page from all matching records, resolve the same server-side filter, enforce roles and per-record validation, bound each batch, retain progress and report protected/conflicting rows separately from skipped rows. Preview must identify creates, additions, title proposals, conflicting populated fields and intentional deletions before any write. Missing identity is an error, not a reason to guess from a title.

CSV or Sheet input must retain currency and provenance rather than reinterpret supplier amounts as rupees. Source text and photos require review before public use. New scraped candidates stay separate drafts; they never become genuine owner creations, reviews or customer names by import. The user's restored Sheets → Slides → PDF scope supersedes the source's 2026-09-15 Sheets removal. Private authenticated access is preferred; do not make a private sheet public to satisfy an obsolete import recipe.

Current catalogue editing still uses studioFetch, revision checks, useRecordSwitch, draft recovery and existing published snapshots. The restored table is a view over those records. Real old-record import, bulk approval/confirmation and export pipeline remain Phase 3–6 implementation work. No source workflow described here is claimed active merely because it has been documented.
