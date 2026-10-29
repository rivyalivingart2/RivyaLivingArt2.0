# Next work — start here after refreshing main

Prepared from `98a8369` on 29 October 2026. Recheck later commits and owner
instructions before repeating completed work. Read the [phase guide](PHASE-BY-PHASE.md)
and [Security continuation](../netlify-free-first-2026-10-28/phase2/SECURITY-WORKFLOWS-CONTINUATION.md).

## Preserve the completed local foundation

- Bounded writer, document transport, job/throttle stores and complete-source local
  representation are implemented. Existing v1 provider reads are dated evidence;
  the new v2 store is not installed merely because its source exists.
- Sessions have guarded creation, validation, refresh, expiry and revocation.
  Atomic Security workflows cover lookup maintenance, approval/reissue/rejection,
  redemption, staff edits, domain audit and bounded session maintenance.
- The final focused Security/access runs at that checkpoint passed 185 distinct
  tests. They do not prove browser/provider/runtime installation or all-phase completion.
- An authenticated retained-record checkpoint locally reconciled 22 tables/3,455
  rows. Its Security subset was 30 rows (28 login limits, 2 sessions, no staff or
  requests), with one explicitly synthetic local coverage marker. No source session
  was authenticated and no owner epoch was provisioned by that rehearsal.
- SQL/Blob still own the active application. Preserve the source, sandbox, recovery
  evidence, current public/login design and OLDWEBSITE.

## First slice: sustainable retained Security history (Phases 1/2/4)

**Problem:** current Security reconciliation reads every current canonical record.
The explicit ceilings are 256 records, 256 proof pages and 8 MiB accumulated proof
data; the underlying manifest is capped at 1 MiB. Audit events, archived claims and
sessions count too. Daily use eventually exhausts this bounded representation.
Do not raise limits or remove historical records as a substitute for a design.

Inspect these files and their callers/tests first:

- `src/lib/google-workspace/security-current-snapshot.ts`
- `src/lib/google-workspace/security-lookup-projection.ts`
- `src/lib/google-workspace/bounded-security-workflows.ts`
- `src/lib/google-workspace/bounded-security-service.ts`
- `src/lib/google-workspace/bounded-store.ts`
- `tools/google-workspace/apps-script/BoundedWriter.gs`
- `tools/google-workspace/rehearse-security-current.mjs`

Work steps:

1. Reproduce growth beyond the safety ceilings with explicitly synthetic local
   histories. Measure current-record/manifest/proof byte growth, transactions,
   elapsed operation budget and independent-worker read cost. Keep existing
   capacity-rejection tests; they protect safety.
2. Design an authoritative current index plus verifiable retained history segments,
   or another measured bounded design. Specify trusted anchors, rollover atomicity,
   lookup/tombstone coverage, event provenance and exact export/restore behavior.
   This is a proposed direction to evaluate, not an approved shortcut.
3. Prove that archiving cannot free a token/login claim for unsafe reuse or erase
   revocation/replay evidence. Historical events must remain retrievable and linked
   to the transaction that committed them. No uncontrolled cross-workbook dual writes.
4. Implement a local migration/readback of the prior representation without losing
   IDs, source payloads, mutation history or audit relationships. Preserve original
   format readers/recovery as needed. An absent private checkpoint in a fresh clone
   is not permission to reconstruct real records from fixtures.
5. Test rollover under concurrent mutation, interrupted commit, lost acknowledgement,
   stale worker, missing/tampered segment, truncated history and exceeded budgets.
   Reopen in a separate process. Prove bounded operations at realistic retained
   growth, then update design and sanitized evidence with measured limits.
6. If Sheets/Drive cannot reliably meet the requirement, document the demonstrated
   narrow ongoing-free database exception before adopting it. Verify current free
   limits, ownership, backup/export and safe stop behavior. No paid provisioning.

**Done for this slice:** a capacity design plus working local implementation and
adversarial/recovery evidence at the stated growth bound. Production activation,
indefinite growth and real provider latency are not claimed by local tests.

## Then close provider and runtime foundations

1. Refresh legitimate Google access/registration and renewable credentials. Preserve
   the installed sandbox and prepare the exact isolated v2 installation/conversion.
   Resolve SQL normalization/collation equivalence, complete source claims, trusted
   bootstrap marker and deliberate owner-epoch provisioning.
2. Complete G1–G5 in the [provider acceptance plan](../netlify-free-first-2026-10-28/phase1/PROVIDER-ACCEPTANCE.md)
   using real identities, interruption, independent expiry and bounded genuine quota
   evidence. Missing access is a named dependency, never a synthetic pass.
3. Assemble real server credentials/gateway, cookie resolver, session/workflow stores,
   successful-login attempt receipt and bounded maintenance job. Test route →
   actual provider → cold reload, current roles/epoch and revocation.
4. Continue operations/forms/publication/private media, actual data/media target
   rehearsal and complete restore, Studio parity, truthful media/filters, durable
   research and native Slides/PDF workflows in the phase guide.

Continue independent local tasks while provider dependencies remain unresolved.
Do not re-ask permission to start each phase. External writes and publication use
the authority actually provided for their specific actions.

## After each slice

Record source revision, changed files, actual test/measurement results and limits.
Update this file with the next concrete task and the current phase matrix. Keep
public and private evidence separate. Future GitHub publication needs new owner
permission; the main publication containing this guide is a one-time instruction.
