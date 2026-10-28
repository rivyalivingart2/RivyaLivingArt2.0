# Local encrypted source-record checkpoint

This operator module creates an encrypted local checkpoint of the actual source records supplied in memory. It does not fetch production, start PostgreSQL, upload files, restore a provider, copy media or retire anything. Use the project's Node 22 runtime with `--import tsx`.

The only completed scope this module can report is `SOURCE_RECORDS_ONLY`. It preserves the validated source-row JSON representation and the mapped column types/nullability and primary/unique/foreign-key contracts. A `row_to_json` export cannot distinguish SQL NULL from JSON null in nullable JSONB columns without extra source tags; matching these row hashes does not prove that distinction was preserved. SQL defaults, check constraints, other indexes, grants/roles, triggers, sequences, Blob objects and repository files are **not** covered. `fullBackup`, `offDeviceVerified` and `operationalRecoveryVerified` remain false, even when the record restore succeeds. Preserve the 92-object Blob inventory and protected repository assets as separate pending coverage. Do not call this a complete migration or disaster-recovery backup; the later complete SQL backup needs a verified dump or a fully tagged representation.

## Create from verified records

```js
import {createEncryptedCheckpoint} from './tools/google-workspace/local-recovery.mjs';

// Call only after the source reader has verified final fingerprints and shape.
// These variables are supplied in memory; never serialize them to a raw file.
const receipt = await createEncryptedCheckpoint({
  schema,
  source,
  metadata: {evidenceKind: 'live-source', sourceCheckedAt: verifiedSourceTime},
  outputDirectory: newIgnoredRunDirectory,
});
```

The directory must be new, below this checkout's ignored `test-results/`, with an existing parent. Links, traversal and overwriting a previous checkpoint are rejected. The path guard separately checks Git ignore rules and the Git index; tracked destinations and directories with tracked descendants are rejected even when their files are missing locally. Creation also uses exclusive directory/file creation to avoid overwriting existing paths. The module first applies and reads back owner-only native directory/file permissions, then writes ciphertext and the protected key envelope. Raw record exports and the AES key never enter filesystem files or child-process arguments. A later SQL restore necessarily writes the records into its new private PostgreSQL data directory.

Default protection generates a random AES-256-GCM key, authenticates the archive format, and protects the key using Windows DPAPI `CurrentUser` with fixed application entropy. DPAPI input travels through an anonymous process pipe and is never printed. This key is tied to the current Windows identity/environment. It does not provide portable key escrow or off-device redundancy. Do not lose the protected key file; an archive without it is not usable recovery. A portable owner-controlled key recovery arrangement remains separate work.

The receipt contains archive/key paths, the exact archive SHA-256 and the source manifest SHA-256. Retain it privately. `checkpoint-receipt.json` is written beside the encrypted archive. Do not print raw decrypted data, provider identifiers, source credentials or customer values.

## Verify or measure the encrypted records

```js
import {verifyEncryptedCheckpoint, inspectEncryptedCheckpoint} from './tools/google-workspace/local-recovery.mjs';
const input = {
  archivePath: receipt.archivePath,
  keyPath: receipt.keyPath,
  expectedArchiveSha256: receipt.archiveSha256,
  expectedManifestSha256: receipt.manifestSha256,
};
const verified = await verifyEncryptedCheckpoint(input);
const aggregate = await inspectEncryptedCheckpoint(input, ({schema, source}) => {
  // Trusted local calculation only. Return an explicit sanitized aggregate.
  return {tables: schema.tables.length, rows: Object.values(source).reduce((n, rows) => n + rows.length, 0)};
});
```

The inspection hook runs only after authenticated decryption, exact row decoding, identity/relationship reconciliation and expected-manifest verification. It is suitable for repeated local capacity calculations without another source read. The module does not log or persist the callback's input or return value. A local transport emulator using these real records remains an emulator, not a Google-provider result.

## Verify a real local PostgreSQL restore

Use a **new**, separate local cluster and database. The separate `run-local-record-restore.mjs` wrapper prepares an empty owner-only data directory, verifies the existing PostgreSQL binaries, initializes a new local role/password, binds only `127.0.0.1`, and creates a fresh `rivya_recovery_*` database owned by a `rivya_recovery_*` role. It retains the local password only in a DPAPI-protected envelope and briefly supplies an owner-only password file to `initdb`; a `finally` block removes that exact temporary file and records whether removal succeeded. Other password handling uses memory and DPAPI pipes. It does not inherit source credentials, reuse existing QA clusters, configure an autostart service, or enable SQL payload logging. The encrypted-checkpoint module does not itself perform that lifecycle.

Run the wrapper with the project's Node 22 runtime and `--import tsx`, followed by `tools/google-workspace/run-local-record-restore.mjs --checkpoint <private checkpoint-receipt.json> --directory <new ignored run directory>`. The actual SQL data directory is retained privately after the wrapper stops its own server in `finally`. Its receipt explicitly records `sqlNullVersusJsonNullCovered: false`, `collationsCovered: false` and `exactSqlSchemaVerified: false`. These exclusions remain even if all row representations and mapped key relationships match. The CLI omits the private checkpoint identifier; the private receipt retains it.

Supply an already-connected `pg.Client` with startup `options` setting `rivya.recovery_sentinel` to a freshly generated UUID. The explicit target contains exactly `host`, `port`, `user`, `database`, `dataDirectory`, and `sentinel`. The port must be in 55000–55999, excluding existing project QA ports 55439, 55441, 55442 and 55443. The data directory must be an owner-only, non-linked directory below ignored `test-results/`.

```js
import {restoreCheckpointToLoopback} from './tools/google-workspace/local-recovery.mjs';
const restored = await restoreCheckpointToLoopback({...input, client, target});
```

The helper checks the actual server address, port, role, database owner/name, data directory, sentinel and empty public schema before creating tables. It does not accept a connection URL. It inserts exact values using bound parameters, restores the mapped key constraints, reads the records back, checks actual column/key definitions, and matches every table's stable identity/payload digest. Any mismatch rolls the transaction back. The restored database is retained; the caller must stop its temporary server in `finally`. No existing resources are deleted.

Unit tests use explicitly synthetic records and SQL-driver fixtures. Only a later successful run against the guarded actual PostgreSQL process can provide a real loopback restore receipt. The module itself makes no claim about that process merely because a test passed.
