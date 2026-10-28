# Source-scale capacity remediation contract

Status: **required architecture change; implementation and provider acceptance pending**. Evidence: [source-encoding-measurement.json](source-encoding-measurement.json), accepted at 17:43 UTC on 28 October 2026. SQL/Blob remain current authority. No target workbook, provider scope, deployment, product or business record changed.

## Demonstrated failure

Content's current 1,900 inline records and initial history require at least 68,553,028 normalized characters and 152,446,178 signed-response bytes. Both exceed the current maximum, before 310 large-document references and bookkeeping. The large payloads alone add 20,537,481 bytes. Keeping the existing snapshot protocol and merely raising row counts, response ceilings or timeouts is not an acceptable migration plan.

## Required replacement behavior

1. **Read a bounded working set.** Register explicit physical ranges and stable partition identities within each existing confidentiality boundary. A lookup must resolve to a registered record location and revision; it must not scan all history or trust a client-supplied sheet/range. Bind pagination to a manifest version and detect moved, missing or duplicate identities. Keep original record identities, URLs and relationship keys unchanged.
2. **Separate payload size from identity.** Preserve large complete payloads as immutable Drive objects with real returned IDs, exact byte hashes and verified access. Canonical Sheets entries own their identity, revision and reference. Choose the inline threshold from measured signed transport budgets with headroom, not the 45,000-character cell limit alone. Do not fabricate references, truncate payloads or treat an unverified upload as a saved record.
3. **Retain history without reading all of it for each mutation.** Use bounded history segments with an explicit append position, count and integrity root. Historical payload segments may use verified immutable Drive artifacts referenced by the canonical manifest. A segment is not a second editable authority. No existing history may be discarded, rewritten or removed merely to fit capacity. Actual consolidation/migration requires reconciliation and a verified restore checkpoint; any destructive retirement remains separately authorized.
4. **Keep mutation atomicity explicit.** Record changes, expected revisions, receipt, audit/history reference and coordinator state for a same-workbook transaction must commit together. Read only the guarded working set needed for that mutation. Cross-workbook steps need durable intent and reconciliation; never claim a Google transaction spans separate workbooks or Drive. Validate owner/API races independently; ScriptLock alone does not exclude them.
5. **Make interrupted reads and writes unambiguous.** A page token binds authority epoch, manifest/version and scope. A changed manifest invalidates or restarts a bounded read; it cannot silently combine revisions. Interrupted writes retain their durable operation identity and quarantine unknown outcomes until actual provider readback resolves them. Timeouts and 202 responses are not success evidence.
6. **Enforce finite budgets.** Measure request and response wire bytes, normalized characters, rows, execution time and actual provider calls per operation. Bound each request and page before dispatch; stop with a recoverable status before quota, timeout or allocation exhaustion. Include existing probes, all retained history and realistic growth in allocations. Never enable recharge, paid continuation or an expiring paid trial.

## Required implementation evidence

- Reconstruct exactly the source's stable identities, fields, original payload hashes and relationships from bounded reads and referenced artifacts. Source rehearsal alone is insufficient; actual target readback is required.
- Exercise a large preserved revision and more than one page/segment. Verify out-of-order, repeated, missing, stale and tampered pages fail or replay according to the same durable operation.
- Test independent competing writers, multi-record atomic groups, interrupted fragment/artifact delivery, late outcomes, cold restart and an independently expired lease. Label local emulation and real Google evidence separately.
- Measure source-scale maximum response size and latency after the new representation exists. Recompute full overhead and growth; the current lower bound is not an allocation recommendation or measured p95.
- Reconcile a restored checkpoint and original media bytes before migration. Preserve the existing sandbox probes and current SQL/Blob authority until all required acceptance passes.

## Database exception decision

No new database is selected. The measured failure proves that the present full-snapshot protocol is unsuitable; bounded Sheets reads and immutable Drive payloads remain a plausible implementation direction. Their reliability is not yet established. If the owner/API race or a required multi-record invariant cannot be satisfied after bounded implementation and real acceptance, document that reproduced failure and evaluate only the affected transaction family for an ongoing-free database. Verify actual owner account limits, export/restore and hard-stop behavior before adopting it. A current database connection or marketing claim does not satisfy this gate.

The current Google account's time-limited 5 TB offer is a separate unresolved capacity constraint. Its expiry, post-offer capacity and sustainable free allocation need verified owner-account evidence. Do not remove personal files, silently depend on paid storage, or claim free-first acceptance while this remains unresolved.
