# Shared data and production release decision

23 September 2026. The owner confirmed all Phase 6 work was merged into main, requested Vercel Production publication and asked for Preview and Production to use the same database. Fresh Git inspection confirmed main 8fd2cf02174ccb81c67586389d5bc958fa442b29 (PR #20), with the Phase 6 final source tree.

The owner explicitly selected **“One shared live database”** after being told that Preview edits would also affect live customer data. This supersedes the earlier requirement for separate Preview and Production application databases. It does not authorize destructive QA against their shared data.

Fresh Vercel inspection reported Hobby. After the current personal/non-commercial restriction was explained, the owner selected **“Keep free-only; pause production.”** This is the latest release instruction: no new production deployment, paid upgrade or alternate host. It means pausing the requested new release; the existing production deployment was not taken offline.

The owner completed Vercel reauthentication and separately approved **“Yes, share private reference storage.”** Existing private files remain private. Existing staff credentials/session secrets were not copied between environments or changed.

Both databases and rollback connection details were independently backed up using the established encrypted owner-profile location. The updated former Preview database is the shared target; the old empty Production database remains intact. In-place environment updates preserve variable IDs and resource connections. No database record was inserted, updated or deleted; no schema migration or catalogue publication was run.

Automatic approval review rejected removing the old Production resource connection because that would delete its associated environment variables. That action did not execute; the allowed in-place update path was used. A second review rejected bundled private-storage access expansion pending explicit approval; the owner then approved it, and that expansion was applied separately. No security or approval check was bypassed.

See docs/redesign/SHARED-DATA-CONFIGURATION.md and shared-data-configuration.json. Future deployments will receive the shared configuration. Existing deployments retain the configuration captured when they were built. P7.1 remains the next implementation task; formal QA must use a genuinely separate disposable database/store and cannot use this shared target.
