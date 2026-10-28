# Phase 0 current-state audit — 28 October 2026

**Audit package prepared locally; Phase 0 acceptance remains partial.** Repository, live deployment, DNS, source-data inventory, protected-file baseline and feature/dependency registers are recorded. Complete authenticated browser inspection, exact Google writer installation readback and some recovery/account configuration evidence remain unavailable. Those gaps are explicit below; no later phase is declared complete.

Follow [the latest owner scope](../OWNER-SCOPE.md): Phase 0 only, no GitHub push or PR changes without the owner's later instruction to push the latest changes to main. This audit changes documentation and a local read-only inventory tool. It changes no application behavior or provider state.

## Exact repository and deployment baseline

| Item | Observed state | Evidence and consequence |
|---|---|---|
| GitHub main | `35f99fd9b5fd1b76333d92b4ddf3b90289c99b2a` | Fresh authenticated `git ls-remote`; no branch write |
| Netlify migration branch | `codex/netlify-hosting-migration` at `7b390d558b9a48d5ec7ccedb8bab104f6b1411f9` | Both migration commits remain ancestors of the current local branch |
| Existing PR | [#71](https://github.com/rivyalivingart2/RivyaLivingArt2.0/pull/71), open/draft, migration head above, main base above | Only open PR returned by the current repository search; not edited |
| Current local branch | `codex/netlify-free-first`; application baseline `41cda9c20947dface0b027484106d0bbcc0cdd14` | Clean at audit start; this commit and the Phase 0 audit are local; no matching remote branch |
| Other worktrees | `codex/sheets-drive-foundation` at `1585a06de03d13816dc122072b92c8a22b6e6e3f`; `codex/full-google-audit-20261027` at main above | Both clean on inspection and preserved |
| OLDWEBSITE reference | `2dd6d5de34acf3f98e611eda2e1b858ebd0da8e6` | Clean local reference; no recovered old database or imported old records |
| Netlify production | Ready, exact migration commit `7b390d5`; production branch still migration branch; published deploy locked | Current API read at 14:21 UTC; latest local repairs are not deployed |
| Netlify account | Free; 300 plan credits; auto-top-up false; Pro/Enterprise trial false | API capability field reports included 300 / used 0, not an independently reconciled billing usage report; no exceeded-usage entries; capability blocks builds when usage is exceeded |
| Vercel recovery | Both `rivya-living-art2-0` and `oldwebsite` projects still available; connected team reports `pro` | Normalized team details omit billing/trial/charge information. Do not label all retained infrastructure free or change its plan as part of this audit |

Netlify production environment contains SQL, Blob and current Studio credential key names, with no Google replacement configuration. `SITE_INDEXABLE`, order intake and message retry are false; newsletter enablement is absent. Secret values were neither logged nor included in these artifacts.

## Live website and domain readback

At 14:21 UTC, certificate-verified anonymous HTTPS returned homepage, Creations and login **200** from Netlify, apex **301** to www, `/studio` **307** to `/studio/login`, and the orders API **401**. Homepage HTML still includes Rivya / Creations, the Signature section and footer. Login contains the existing ID/password fields and no setup-pending message. This is availability/content-marker evidence, not screenshot or authenticated workflow acceptance.

DNS readback: www CNAME `rivyalivingart.netlify.app`; apex IPv4 `75.2.60.5`; nameservers `ns59.domaincontrol.com` and `ns60.domaincontrol.com`. No GoDaddy/DNS/TLS configuration was changed. Vercel still lists the apex/www domains as verified associations; those associations do not override current DNS.

`robots.txt` still disallows indexing. The default Netlify hostname still serves the login with **200**. The local canonical-host redirect in `netlify.toml` is not deployed. Preserve this distinction when preparing a later release.

## Protected records, files and current authority

The fresh database read found **22 tables / 3,454 rows**. Count plus sorted-row fingerprints match the earlier retained baseline across **20 business-data tables / 3,425 rows**. The remaining two tables are session and login-throttle state. No records were exported into Git or changed. All inspected live constraints are validated: 22 primary keys, 5 unique constraints, 9 foreign keys, 36 check constraints and 146 not-null constraints.

Fresh Blob inventory contains **92 objects / 11,678,925 bytes**. Path, URL, size and normalized upload-time metadata match the earlier inventory. This does not establish original-byte checksums, target copies, privacy parity or restore. Original Blob resources remain intact.

The reproducible file manifest contains **1,198 files / 139,839,148 bytes** across tracked public assets, application pages/layouts and components. **No file in this protected set differs from migration commit `7b390d5`.** The selected-image tests again verify all **169 selected images / 507 derivatives**, expected bytes/dimensions/references and public/private separation. See [PROTECTED-BASELINE.md](PROTECTED-BASELINE.md) and [protected-source-baseline.json](protected-source-baseline.json).

SQL/Blob remain the authoritative production record/file stores; repository-served selected images remain repository assets. Google sandbox data is isolated test state, not a second production authority. No narrow free database exception has been selected or activated.

## Current implementation findings

- There are **37 registered Studio modules**, **32 OLDWEBSITE sidebar entries**, and **30 old entries with a current route or alias**. Route existence is not design or workflow parity. Old `/studio/catalog-fill` and `/studio/scraper` are unmapped. Product ingestion remains prohibited; old catalogue-fill behavior must not be re-enabled as a way to satisfy parity.
- Static analysis of **557 source files / 53 route handlers** finds **45 handlers with a transitive SQL dependency** and **11 with a transitive Blob dependency**, plus **53 files containing direct SQL access/provider initialization** and **2 direct Blob modules**. Imports are conservative dependency evidence, not a trace that every request executes every call.
- Security, operations and publication adapter setters have **zero call sites in tracked `src`**. Their definitions exist, but trusted production initialization and route-wide integration are missing. Selecting Google while blocking SQL cannot by itself make the application function.
- Existing SQL login/session code remains present. Google authentication persistence, atomic access flows and independent-worker session tests remain incomplete. This audit does not rotate credentials, log in with a new session or revoke the existing one.
- Research/SEO/content-lab views inspect existing content and link to its editor. The scraper manager stores jobs and observations in process-local Maps and accepts caller-supplied items; it is not a durable source-fetching worker. Native Sheets → editable Slides → PDF execution and verified output history are missing.
- Six tables from the isolated 28-table map are absent from live SQL. Feature guards keep newsletter and editorial-extension activation separate. Do not manufacture rows, recreate absent tables, or replay repairs just to match an old inventory.

The complete module register and per-area evidence requirements are in [FEATURE-MATRIX.md](FEATURE-MATRIX.md). Concrete callers, authority boundaries and missing integration are in [DEPENDENCIES.md](DEPENDENCIES.md) and [source-inventory.json](source-inventory.json).

## Google and historical evidence audit

The four existing sandbox Sheets (Content, Operations, Security, System) remain visible through the connected owner account. Each currently reports `shared: false` and only an owner permission. The last modified timestamps remain 24 October. This verifies workbook metadata, not worksheet protections, concurrent writes, script interruption, lease expiry or quota handling.

Fresh native Sheet metadata also confirms `records`, `ledger`, `audit`, `history` and `writer_control` tabs in each workbook, each allocated 100 rows × 12 columns. These are grid allocations, not migrated row counts; the connector response exposes no protection proof. Vercel integration queries returned zero accessible configurations in both account/project views. Its project-webhook read returned **403 forbidden**, so webhook absence is not established. These read limitations are retained as open inventory items.

The original retained signed resource registry, gateway signing-key file and renewable server credentials remain unavailable in the current desktop checkout. The earlier cloud checkpoint refers to its own private filesystem. No registry was reconstructed from display names, no sandbox was reprovisioned, and no key was rotated. No credentials were sought in browser storage, password vaults or unrelated histories.

All five provider acceptance checks remain open: ordinary-editor protection; concurrent owner/API edits; actual mid-script interruption and quarantine; independently expired leases; bounded real quota/rate-limit behavior. Isolated fault injection and same-process tests do not satisfy them.

Earlier Phase 0–11 completion statements overclaimed their evidence. Local repair commit `41cda9c` has removed unconditional readiness, fabricated catalogue outputs and synthetic migration/backup acceptance from active evaluator paths. This is verified source/local-test history, not proof that the missing provider workflows now exist. Detailed dispositions appear in [CLAIMS-AND-GATES.md](CLAIMS-AND-GATES.md).

## Task acceptance and remaining action

| ID | Objective / affected scope | Status | Verification / remaining action |
|---|---|---|---|
| NFF-000 | Owner scope, branches, worktrees and PR baseline | verified complete | Fresh local/remote refs and connected PR read; latest no-push rule persisted; no remote writes |
| NFF-001 | Live hosting, DNS, account and Google/recovery inventory | partial | Netlify/HTTP/DNS/Google metadata and Vercel projects refreshed; exact installed writer, retained registry, billing/usage details and hooks/integrations need authoritative readback |
| NFF-002 | Protected source/data/media baseline | verified complete | Complete for the stated inventory scope: file hashes, actual table counts/business fingerprints and Blob metadata; byte migration/backup/restore are later gates |
| NFF-003 | Feature, route and dependency register | verified complete | All 37 current modules and 32 old sidebar entries mapped; static route/store dependencies recorded; limitations explicit |
| NFF-004 | Reconcile claims, current browser observation and phase handoff | partial | Claims and open gates documented; browser controller times out before reading the page; authenticated/visual inspection remains unverified |

The browser retry failed at `Emulation.setFocusEmulationEnabled` after 10 seconds. Native window inventory confirms Chrome is open but does not prove page rendering or authenticated behavior. No screenshots of private records were published. Do not count a visible tab title as a passed workflow.

No Phase 1–11 implementation was started in this Phase 0 turn. Finishing unresolved Phase 0 provider/browser reads is the next action within the current scope; later architecture and implementation work remains queued under the master brief. Estimates in the phase plan remain engineering estimates, not acceptance evidence.
