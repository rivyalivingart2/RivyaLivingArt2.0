# Operations and recovery

Adapted from docs/troubleshooting.md at OLDWEBSITE 2dd6d5d. Exact hash: ../MARKDOWN-MIGRATION.csv.

Diagnose a Studio failure against its actual deployment and auth implementation. The old Auth.js bare-host AUTH_URL failure is source history; the destination uses its current session contract. Preserve its login source and verify both layout and sign-in behavior. Do not copy old authentication environment fixes into this repository without reproducing the failure.

For a stuck scraper, inspect job status/cursor/heartbeat and source policy. Reuse or resume the recorded job rather than create duplicates. A field-wide quality spike usually requires an adapter fixture update; clearing failures before repairing extraction conceals the problem. Paused sources require a cause diagnosis, not a faster crawler.

If owner content changes after import, compare identity, revision, protected field values and media relationships. Stop the writer; retain the conflicting snapshot and transaction receipt. A deleted record reappearing requires tombstone and external-key investigation. A large unexpected create count requires identity/crosswalk review before adjusting a limit.

Old deploy-time auto-fill defaults are unsafe for the protected destination and must not be ported. Build/start must not import legacy records into production. The local harness starts only the verified task-owned cluster; external transport is blocked. Runtime secrets, private UI evidence and database exports remain under ignored local evidence, never in Git.

The source's removal of Sheets is superseded by the current master prompt. Reintroduce the catalogue automation with isolated, versioned snapshots and editable Slides; its activation and output publication remain separate from local tests. Keep the already repaired request-table issue closed unless a fresh reproduction demonstrates a new failure; never replay its production DDL as restoration setup.
