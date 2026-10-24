# Local restoration checkpoint — Phase 2 started, 21 October 2026

This is the first foundation checkpoint, retained as historical evidence. Continue from [PHASE-2-HOME-CHECKPOINT.md](PHASE-2-HOME-CHECKPOINT.md) for the later homepage port, current verification and remaining work.

Continued from `d04218c` on `codex/exact-legacy-restoration`. **Local only.** Final application build: `dIA7_A33jqOuNsY09oTOw`. Nothing was pushed, merged, deployed or published.

## What is implemented

The first public foundation slice adapts actual OLDWEBSITE component geometry and interaction rules from source `2dd6d5d`:

- Flat 80px sticky header; 64px compact row; hide on downward scroll beyond 400px and reveal upward; transparent home treatment.
- Published collection menu with three existing collection images and focal points, hover intent, outside dismissal, keyboard opening and Escape recovery.
- Full-height side drawer available on desktop/mobile, working current navigation, commission link, locale control and current WhatsApp.
- Five mobile navigation actions, active indicator and safe-area spacing; omitted on piece/customization and commission routes where the existing action flow owns the bottom edge.
- Single current-copy announcement with optional seven-day local dismissal. Multiple legacy announcements and rotation are still pending.
- Old hero type formula, 14ch measure, shell spacing, bottom composition, gradient and outline action, using the current document, images and attribution.
- Old footer commission-band and grid/type/spacing foundation with current content, links, contact information and legal pages.
- Existing native dialog accessibility preserved with an additive styling prop. No global Studio/login styling or authentication behavior changes.
- One useful legacy Markdown contract adapted with pinned source hash; all 286 paths remain in the larger inventory. This is not 286 migrated files.

Source mapping, protected exceptions and incomplete exact-parity details are in [LEGACY-DESIGN-CONTRACT.md](LEGACY-DESIGN-CONTRACT.md). This is working application code, not a menu mockup, but it is a partial Phase 2 slice.

## Verification

| Check | Result and scope |
|---|---|
| Build + TypeScript build stage | PASS, final build above, task-owned PostgreSQL fixtures only |
| Unit and isolation/reconciliation tests | PASS, 409 (377 existing + 32 restoration checks) |
| Built HTTP/publication boundaries | PASS, 403; no database/provider credentials supplied to those child servers |
| Repository preflight | PASS, 12 |
| Full ESLint | PASS, zero errors, 62 existing warnings; no automatic fixes |
| Protected source | All 21 baseline hashes unchanged |
| Destination data | All 19 runtime-visible table aggregate digests unchanged before/after; two read-only snapshots |
| Responsive homepage | Eight widths: 320, 390, 512, 768, 992, 1200, 1440, 1920; no horizontal overflow; 80px header and expected mobile-bar breakpoint |
| Additional breakpoint | 1024px header controls fit inside the viewport |
| Drawer | Native modal body lock, keyboard wrap from first control to locale selector, Escape and opener focus recovery observed |
| Search | Input autofocus; real GET navigation to /search?q=River with published matching results and no leftover modal |
| Collection menu | Three approved images loaded; keyboard open, Escape close and focus recovery observed |
| Scroll behavior | At 2000px: compact 64px row and hidden state; scrolling up reveals it |
| Protected login | Eight matched captures; seven pixel-identical JPEG decodes, 1920px mean channel difference 0.1268/255 and zero channel differences over 12/255 |
| Local authentication | Synthetic owner sign-in reached authenticated overview; sign-out returned to login |
| Unsaved editor | Synthetic product showed Unsaved changes; no save/publish action. Leave-confirmation interaction timed out and navigation subsequently occurred, so cancel-preservation is NOT certified |
| Screenshot integrity | Actual JPEG dimensions checked against the manifest; counts and pixel measurements in the receipt |

Initial local build/HTTP probes met sandbox loopback restrictions. The same guarded checks passed with permission to access only their local test servers; no assertions were disabled. The inherited CSS rule that hid the new gradient and the narrow mobile Shop label were corrected during visual review before final capture. One stale in-memory manifest omitted files; the bounded filename-based recovery tool rebuilt it from actual saved screenshots, verified dimensions and required all eight login counterparts.

The browser checks use resized desktop viewports, DPR 1 and reduced motion. They do not replace physical phones, screen readers, real-provider, full-motion or field-performance evidence. The fixture site deliberately does not import production records or production homepage presentation settings.

## Working review

- Comparison viewer: `http://127.0.0.1:4211/`. Select **Local restoration candidate** or **Current site baseline** alongside the old reference.
- Working application: `http://127.0.0.1:4210/`.
- Private evidence: ignored `test-results/exact-legacy-2026-10-21/`; original 216-image baseline remains separate.
- Current local credentials stay in the ignored runtime config; never paste them into chat or Git. The local test session was signed out.

Run from the repository with the provisioned Node 22 executable. Start the app with `tools/exact-legacy/run-local.mjs start`; stop it with `... stop`. A fresh build needs the existing preview stopped first. Do not rerun preparation on the populated fixture cluster. Run `rebuild-phase2-manifest.mjs`, `verify-phase2.mjs` and `comparison.mjs` after updating screenshots. Serve the viewer with `comparison.mjs --serve`.

## What remains

Phase 1 is **not fully accepted**: the source live database export and some old conditional/error/unsaved workflow states remain unavailable or unverified. [PHASE-1-CONTINUATION.md](PHASE-1-CONTINUATION.md) records the actual access search, successful destination baseline and limits. Generated data is not a substitute.

Phase 2 still needs the old complete homepage section order, cure ruler, meniscus and material-story motion, full footer/newsletter/announcement behavior, old card/form/gallery/page layouts, and authenticated Studio shell/table/editor port. The current hero product attribution and current content remain visible; the local page is not yet an exact whole-page match.

Next local slice: port the old homepage composition and signature devices against explicit current content bindings, then representative collection/product/editorial pages and the Studio shell without touching login. Continue Markdown migration individually, with provenance. Keep all 575 old field mappings unresolved until actually mapped; real migration, owned media derivatives, vendor adapters, Sheets/Slides/PDF automation and release are later phases.

No production data migration, title rewrite, record import, media edit, CMS publication, new vendor job, external message, GitHub push or deployment occurred in this continuation. Existing production request-table repair was not repeated.
