# Phase 1 continuation — 21 October 2026

Continuation of local `d04218c`, on `codex/exact-legacy-restoration`. The initial [baseline](PHASE-1-BASELINE.md) retains its observation date and scope. All changes remain local.

**Status: baseline discovery expanded; Phase 1 acceptance remains open for the old live database export and unobserved workflow states. Phase 2 independent public foundation port has started.** Do not relabel this as complete database parity or full visual acceptance.

## Newly closed evidence gaps

An existing destination runtime connection was located in the older authorized checkout and used without printing, copying into source, or changing its credentials. `tools/exact-legacy/read-live-baseline.mjs` pins the known target and role, asserts transaction_read_only, reads schema/constraints, and hashes rows server-side. It refuses other targets, bounds each table at 20,000 rows, and emits only counts. Private receipts contain schema and aggregate digests, not raw row values, under ignored evidence.

Two read-only snapshots cover **193 visible schema columns and 19 runtime-visible table scopes**. All 19 aggregate row digests and counts match before/after the local implementation. This includes 120 catalogue rows, 535 content rows, 154 public-media rows, 1,395 revision rows, presentation rows, business settings and order/inquiry relationships represented by the hashed rows. This proves equality within the inspected runtime visibility and interval; it is not an unrestricted owner export or a field-level source/destination crosswalk. Authentication/session/request tables are excluded from row hashing. Schema and rows use separate repeatable-read transactions.

All **21 protected source hashes** match the initial baseline. No original media or authentication implementation was edited. No production business mutation, migration, CMS publication, push, PR, deployment or external message occurred.

## Remaining source-data blocker

Code confirms Prisma PostgreSQL for OLDWEBSITE. The connected hosting project and current storage metadata were inspected read-only. The correct storage integration reports available, but the available connector exposes metadata rather than database secret values or a usable SQL session. Known local old checkouts contain examples rather than a working read-only connection. An unrelated older browser integration is paused; it was not reactivated or treated as the correct source.

The source schema inventory remains authoritative for contracts, and authenticated UI counts remain observations. They are not a substitute for source row/relationship digests. No fake export, guessed record identities, fabricated review evidence, new access grant, paid resource or database role was generated. This blocks real record reconciliation acceptance, not independent local visual porting.

## Visual and state coverage added

- Fresh published old homepage at the same eight widths as the local candidate; draft-preview mode explicitly exited before capture.
- Old/current product and article details at desktop and narrow widths, with different-record scope explicitly labelled.
- Old drawer/search and current candidate drawer/search; source-backed hover/keyboard/scroll behavior comparison.
- Old FAQ expanded answer and no-match state; current FAQ disclosure/filter surface.
- Old portfolio empty archive confirmed: no real old project-detail record could be observed. Custom-page/project detail templates remain source-level coverage where no populated old public record is discoverable.
- Full-page homepage composition captures and footer-state captures supplement the original viewport-only baseline. Full-page images do not certify every lazy-loading or animation state.
- Candidate local login captures at eight widths and actual local synthetic administrator sign-in are separate from the owner's live sessions.
- Unsaved editing is exercised only in the task-owned fixture Studio; old production save/publish/delete/import/scrape controls remain untouched.

The original 216 screenshots are retained separately. New evidence is listed in ignored `phase2-captures.json`; the comparison viewer includes version selection and explicitly marks missing counterparts. All raw screenshots and UI evidence stay out of Git.

## Current audit disposition

| Finding | Fresh continuation disposition |
|---|---|
| Public layout mismatch / VIS-01 | Reproduced by paired captures; header/hero/footer foundation now partly adapted locally. Full-page section and feature parity still open. |
| Production request-table issue | Already verified repaired in the baseline; no DDL replay. |
| Development advisory | Baseline's fresh audit still records five affected development dependency entries; no unrelated downgrade or automatic fix performed here. |
| Product/article/FAQ/portfolio differences | Recorded as concrete template and interaction gaps, not erased by navigation changes. |
| Motion/accessibility regressions | New modal focus, Escape, search route, viewport overflow and reduced-motion checks recorded. This is not a new whole-site accessibility certification. |
| Historical mobile LCP / field performance | Still open. Local fixture response times do not measure deployed cold-load or real-user performance. |
| Native readers, physical phones, live provider and recovery | Separate outstanding gates; historical passes remain dated. |

## Exit boundary and continuation

Phase 1 has a concrete source inventory, destination preservation baseline, assets access inventory, live rendered baselines and a seven-phase implementation map. Its old database baseline and complete conditional/error/unsaved old workflow evidence remain unresolved, so its full acceptance is **not claimed**. Continue the independent Phase 2 port from the verified old sources; retain the blockers in the canonical plan. Real database migration must wait for its source baseline, explicit crosswalk/conflict register, isolated rehearsal and separate production authorization.
