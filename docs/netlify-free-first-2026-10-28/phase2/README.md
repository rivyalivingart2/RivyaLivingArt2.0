# Phase 2 — local bounded storage and recovery foundations

Continuation spans 28–29 October 2026 in the owner's time zone. Technical observations use explicit UTC timestamps. The owner authorized fixing capacity and continuing pending work with all changes local. No GitHub push, PR mutation, deployment, provider configuration change or production business write is part of this step.

## Implementation

The previous whole-workbook protocol cannot fit the actual Content records. The new, inactive `rivya-bounded-v2` protocol uses a registered root, compact manifest/index and fixed physical pages within each existing confidentiality boundary. Ordinary record reads retrieve the current record and its bounded proof pages. Complete history stays retained and is available for explicit audits.

- Pages contain at most eight rows and 128 Ki characters; a page request contains at most four pages.
- Metadata has a hard 1 MiB limit, signed requests 1,800,000 bytes and signed responses 6,000,000 bytes. An operation has a maximum 30-second deadline. These are application safety budgets, not claims about provider quotas or latency.
- Atomic groups contain at most eight mutations. The final batch includes record changes, ledger/audit/history, manifest and coordinator state. Every validation dependency is checked again under the writer lock.
- Operation identity, original actor and request binding survive retry. Lost acknowledgements reconcile original receipts; uncertain inflight operations block unrelated writes. A timer never clears an unknown write.
- Manifest epochs and revision-bound cursors reject mixed/stale pages. Formulas, duplicate identities, malformed history, changed proof pages and rewritten historical rows reject.
- Growth of a current record can split its page while preserving neighboring records and all earlier revisions. Exhaustion rejects without truncating data or evicting history.

The exact Apps Script source has been exercised by a local range-slicing emulator. That is local evidence. The v2 endpoint, registrations and bootstrap have **not** been installed. Existing v1 resources and runtime selection remain unchanged. See [the operator contract](../../../tools/google-workspace/bounded-store.README.md).

Two independent-review findings were fixed: unchanged validation dependencies are now guarded at commit, and a monotonic deadline check prevents synchronous validation from dispatching a write after its time budget. Neither fix proves the real Google owner/API race safe. Google documents an atomic batch but does not provide an expected-revision precondition against unrelated writers: [batchUpdate reference](https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/batchUpdate). Explicit ranges and field masks support the bounded reads: [spreadsheets.get reference](https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/get).

## Actual-source measurement and local recovery

The read-only source reader now has an explicit trusted local inspection hook. It runs only after source fingerprints, shape, identities and key relationships have reconciled. A separate operator command uses that hook to create an AES-256-GCM encrypted local records checkpoint, with a random key protected by Windows DPAPI CurrentUser. Native owner-only permissions are applied and checked before content is written. Private records, source hashes and key envelopes stay below ignored `test-results/`.

The measurement command verifies and decrypts that checkpoint in memory, builds a clearly labelled local target simulation, checks every inline identity/payload hash and prepares representative large updates without dispatching them. Large documents remain unresolved until real Drive objects are created and verified; local fixture registrations are never presented as Google output IDs.

The local PostgreSQL restore is a separate acceptance step. Its target must be a new loopback cluster/database with an exact owner, port, data directory and startup sentinel. Bound parameters preserve the observed row representation; actual column/key definitions and readback payload digests must match before commit. Existing source and QA databases are never restore targets.

[Verification details](VERIFICATION.md) record 150 distinct passing focused/related tests, final TypeScript/lint checks, protected-source preservation, private-value exclusions and the actual data/process receipts.

Scope remains `SOURCE_RECORDS_ONLY`. The checkpoint excludes media, SQL defaults/checks/other indexes/roles/triggers/sequences, and off-device recovery. The source JSON representation cannot distinguish SQL NULL from a JSONB literal null. Even a successful record restore is not full operational or disaster recovery. DPAPI is tied to this Windows identity/environment. See [local recovery instructions](../../../tools/google-workspace/local-recovery.README.md).

The [actual source checkpoint](source-records-checkpoint.json) completed at **2026-10-28 18:34:02 UTC**: 22 tables, 3,455 rows and 36 schema/key checks. Its 55,970,259-byte encrypted archive passed authenticated decryption and dataset verification. All 20 business-table fingerprints, covering 3,425 rows, matched the preceding protected source. The reader used 354 bounded pages and 598 continuation fragments in 497 fragment batches. No source mutation or provider write occurred.

The [bounded-format measurement](bounded-capacity.json) completed at **18:36:33 UTC**, using that verified actual checkpoint with local target registrations and initial mutation wrappers. Every one of the 3,145 inline records reproduced its original identity/payload hash. The 310 large documents, totaling 20,537,481 payload bytes, remain unmaterialized.

| Boundary | Inline records | Physical pages | Manifest bytes | Largest signed read response | Largest sampled prepared update |
|---|---:|---:|---:|---:|---:|
| Content | 1,900 | 1,200 | 613,962 | 713,263 | 829,309 |
| Operations | 116 | 60 | 35,631 | 57,533 | 84,068 |
| Security | 30 | 16 | 9,320 | 33,551 | 30,150 |
| System | 1,099 | 552 | 341,835 | 351,486 | 365,680 |

The response measurement includes the manifest and worst four-page signed response. Eight unchanged-payload revision updates, selected from the largest inline records, were prepared per boundary; their maximum working set was eight pages, requiring three signed reads plus one commit request. None was dispatched. This is not a provider latency benchmark, an enlarged-payload measurement or a proof that every possible multi-record update fits. Oversized signed requests reject before gateway dispatch; oversized Google write batches reject inside the script before the inflight marker or final provider write.

Content's previous whole-snapshot lower bound was 152,446,178 signed bytes, above its 8,000,000-byte ceiling. The new bounded representation fits the stated local read/update budgets while preserving every supplied source inline payload, including source history records, and its local initial mutation wrappers. This is not evidence of migrated target history or provider durability. Its 613,962-byte initial manifest is below the 1,048,576-byte hard limit; future history, large-document references, old sandbox probes and real growth still need allocation and provider acceptance. Finite metadata exhaustion remains a deliberate hard stop.

The [actual local SQL restore](local-record-restore.json) passed at **18:43:24 UTC**: all 3,455 source-row representations, 22 tables and 36 mapped schema/key checks matched after insertion into a fresh PostgreSQL 18.6 database. The runner then stopped its server and verified removal of the temporary password file. The private restored cluster remains retained with owner-only access.

Two earlier attempts remain recorded as failures. The diagnostic attempt isolated sandbox `EACCES` at `ADMIN_CONNECT`, before restoration. Both stopped their own servers and removed the temporary password. The successful attempt used reviewed loopback access; no source credentials or provider writes were involved. The records-only and recovery exclusions above still apply.

## Remaining work and next step

| Task | Status and remaining acceptance |
|---|---|
| NFF-200 bounded writer | Local implementation and adversarial verification; real registration/bootstrap/deployment and provider acceptance remain open |
| NFF-201 document support | Existing immutable-artifact foundations retained; actual large-document upload, reference readback and capacity still pending |
| NFF-202 durable jobs | Existing v1 adapter tests pass locally; a safe v2 port needs original-prior proof in its trusted policy context before replaying domain actions |
| NFF-203 credentials | Existing signed read configuration retained privately; renewable Drive/Slides runtime binding remains unverified |
| NFF-204 provider checks | Ordinary-editor denial, owner/API race, actual script interruption/quarantine, independent lease expiry and genuine bounded rate-limit evidence remain open |
| NFF-205 capacity/placement | Actual-source inline format and sampled update sizes fit locally; large documents, ongoing-free account capacity, growth, provider latency and quotas remain separate gates |
| NFF-300/303 recovery preparation | Actual encrypted source-record checkpoint and fresh loopback SQL restore verified; target Google/media reconciliation and complete recovery remain open |

Next local integration work must port domain policies deliberately: v1 whole-sheet history scans cannot simply be connected to the v2 page provider. Jobs require original-prior proof for historical replay and the same server commit deadline; throttle retries must use one overall deadline, retry only an explicit no-write conflict and deny an unknown outcome. No in-memory map becomes authority.

No new database was selected. The measured snapshot failure justified changing the protocol, not adding a service. The Google account's observed 5 TB offer is time-limited and its use exceeds standard free capacity; sustainable free allocation remains unresolved. Do not delete personal files or enable a paid continuation to conceal that limit.

Phase 0 audit and Phase 1 design evidence remains valid within its recorded scope. Provider acceptance, actual target migration, backend integration, complete Studio workflows, native catalogues and release have not been marked complete. SQL/Blob remain authoritative; Vercel and OLDWEBSITE remain retained.
