# Local capacity and record-recovery verification

Candidate parent: `d24aeeb775f9c32893fc342b2000cebb7395dc1b`, branch `codex/netlify-free-first`. Runs used the project's supported Node **22.23.2** and PostgreSQL **18.6**. All observations below are local or explicitly read-only source observations; none is a new Google-provider acceptance pass.

## Tests and static checks

**150 distinct focused/related tests passed across the recorded runs:**

| Scope | Passing tests |
|---|---:|
| Bounded writer and exact-script emulator | 5 |
| Independent adversarial bounded-store tests | 25 |
| Actual-row measurement planner fixtures | 3 |
| Live-source reader/callback fixtures | 9 |
| Encrypted recovery and tracked-path guard | 8 |
| Local PostgreSQL lifecycle/configuration runner | 5 |
| Existing controlled writer, gateway, canonical jobs, durable jobs, source capacity and migration | 95 |

The first combined new-work run passed 48 tests; the later defensive-copy test, final tracked-path regression and five runner tests complete the 55-test new-work group. The full seven-test crypto/restore suite passed before path hardening; the new guard was then tested with a temporary alternate Git index, and the actual archive was reverified through the final guard. The real repository index was preserved. Test totals count distinct cases, not repeated runs.

Whole-project `tsc --noEmit --pretty false`, targeted ESLint across changed implementation/tests and final patch checks passed. No full application build, new browser journey or hosted preview was run for this inactive storage/operator change. Earlier application/browser results retain their own dates and scope.

## Actual data and process evidence

- [Read-only source checkpoint](source-records-checkpoint.json), completed **2026-10-28 18:34:02 UTC**: 22 tables, 3,455 rows, 36 schema/key checks, 54,650,938 bytes of source row JSON. All 20 business-table fingerprints / 3,425 business rows matched the prior protected source. Initial/reassembled/final source fingerprints matched.
- AES-256-GCM archive: **55,970,259 bytes**; authenticated decryption, identities, payloads and mapped relationships verified. The random key is protected by Windows DPAPI CurrentUser; native owner-only file/directory permissions were checked.
- [Actual-source capacity simulation](bounded-capacity.json), completed **18:36:33 UTC**: all 3,145 inline identities/payload hashes reproduced; 310 full documents still unresolved. The report includes original source rows and local initial mutation wrappers, not a real target migration. Eight unchanged-payload revision updates were measured per boundary without dispatch.
- [Actual local PostgreSQL restore](local-record-restore.json), completed **18:43:24 UTC**: all 3,455 row representations, 22 tables and 36 mapped schema/key checks matched in a fresh cluster. No source credentials were supplied to that runner. The database was retained privately and its server stopped.
- Two earlier restore attempts failed before records were restored. The diagnostic attempt identified sandbox `EACCES` at `ADMIN_CONNECT`; the successful run used reviewed loopback access. Both failed attempts also stopped their servers and removed temporary passwords.
- The final path guard rejects tracked destinations and tracked-but-missing paths. [Final archive re-verification](final-archive-verification.json) passed at **18:46:49 UTC** after that hardening. The earlier checkpoint/capacity receipts retain their actual earlier helper hashes; they have not been rewritten to pretend the final helper existed during those runs. The record/crypto and bounded-format algorithms were unchanged.
- An independent final `pg_ctl status` check confirmed all three owned clusters stopped. Their temporary initdb password files were removed; retained local passwords are DPAPI-protected.

The restore scope is **SOURCE_RECORDS_ONLY**. SQL NULL versus JSONB literal null, collations, defaults/checks/other indexes/roles/triggers/sequences, all original media, portable key recovery and off-device redundancy are excluded. `fullBackup`, `offDeviceVerified` and `operationalRecoveryVerified` remain false.

## Preservation and privacy

At the 18:49 UTC check, all **1,198 protected files** matched their stored SHA-256 values. All **352 checked local Markdown links** resolved. The 31 changed source/document files then present contained none of the ten retained private writer values checked. This is a limited exact-value scan, supplemented by deliberate aggregate-only reports; it is not a general guarantee that arbitrary text is non-sensitive.

Private checkpoint/key envelopes, original source fingerprints, restored database directories and lifecycle logs stay under ignored, owner-only `test-results/netlify-capacity-fix-20261028-*` directories. Git receives only source, tests, operator documentation and sanitized aggregate evidence. No source export, credential or private provider registration is included.

## Acceptance still open

The five real Google safety checks, renewable Drive/Slides credentials, actual v2 registration/bootstrap, original target history reconciliation, finite-index growth, account free capacity, quotas and provider latency remain unverified. Google media/document migration, full recovery, runtime adapters, complete Studio workflows, durable research workers and native Slides/PDF outputs remain pending. No provider setting, product, production business record, release or old resource was changed.
