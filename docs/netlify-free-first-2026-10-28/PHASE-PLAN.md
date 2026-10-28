# Remaining Phase 0–11 programme

Latest brief: [OWNER-BRIEF.md](OWNER-BRIEF.md). Baseline and findings: [CURRENT-STATE.md](CURRENT-STATE.md). All status claims below are bounded to actual evidence; source repair is not migration/cutover.

| Phase / task IDs | Status | Affected modules and impact | Acceptance / dependency / next action | Effort after audit |
|---|---|---|---|---|
| 0 / NFF-000–004 | partial | refs/deployment/DB/Google/Studio/media inventory; read-only | Refs, Netlify, actual rows/relationships, Blob totals and selected-image bytes refreshed; full workflow inventory remains | 1–2 engineer days |
| 1 / NFF-100–103 | partial | architecture/authority/quotas/permissions | Measured rates/latency/capacity; justify narrow free DB only if needed; review live credential renewal | 1–2 days plus provider access |
| 2 / NFF-200–205 | partial | writer, Drive transport, canonical stores, jobs, credential lifecycle | Five outstanding Google checks; retain original registry and scopes; independent-worker tests | 3–5 days plus account-dependent checks |
| 3 / NFF-300–303 | source rehearsal verified; target missing | exporter/importer/reconciliation/media; sensitive data | Actual isolated targets, complete readback, byte hashes, JSON/FK checks, interruption and restore | 3–5 days |
| 4 / NFF-400–406 | partial | auth, operations, publication, forms, media and every SQL caller | Atomic access redemption and operations; bootstrap all adapters; no legacy fallback; reload proof | 5–8 days |
| 5 / NFF-500–503 | partial | authenticated Studio modules only | Old-Studio structure and full save/reload/roles/filters/states; current public/login unchanged | 4–7 days |
| 6 / NFF-600–602 | partial | approved images, associations, filters | All approved bytes reused; real per-entity coverage; no invented business evidence | 2–4 days |
| 7 / NFF-700–703 | partial | research sources, bounded fetch, observations, durable jobs/review | Verified source acquisition, normalized provenance, duplicate/change detection, cancellation; no product creation | 3–5 days |
| 8 / NFF-800–803 | partial | Sheets projection, templates, native Slides/PDF worker, Studio history | Real editable template copy/population/export/readback; unknown-outcome recovery; actual render inspection | 3–5 days |
| 9 / NFF-900–904 | partial local repairs only | full local/provider/browser/security/performance verification | Complete actual journeys and seven-width comparisons; no obsolete credentials in isolated Netlify | 3–5 days |
| 10 / NFF-1000–1003 | blocked by acceptance | release PR, branch/lock/domain/flags, final delta and recovery | Exact authorization for prepared actions; reviewed merge, exact deploy and post-release readback | 1–2 days after gates |
| 11 / NFF-1100–1102 | partial docs; retirement blocked | operating guides, handoff, old resource register | Accurate separate statuses; verified retention; scoped deletion approval; keep OLDWEBSITE | 1–2 days after gates |

Estimates are engineering effort ranges, not completion promises or provider-wait estimates. Substantial application integration remains; the earlier claim that all phases were complete is withdrawn.

Every task receipt must include revision, environment, objective, affected files, data/media/auth impact, actual command/provider/browser evidence, status, limitations and next action. Missing credentials, unrun tests, local models and documentation are non-passing acceptance states.

## Reporting dimensions

- Implemented: changed source and documented contracts only.
- Locally verified: exact test run and candidate source.
- Real-provider verified: actual network/provider behavior, separated from emulation.
- Preview verified: exact isolated deployment and accessible flows.
- Migrated: actual target readback/reconciliation.
- Cut over: durable authority changed under scoped authorization and verified final delta.
- Production released: exact Netlify deployment verified through reviewed release.
- Old resources removed: exact authorized provider actions completed.
- Backups retained: verified archive, restore, retention and owner access evidence.

No live Google migration, CMS publication, production release or old-resource removal is performed merely by updating this plan.
