-- PROD-ACCESS-01: metadata-only diagnosis for the EXISTING deployment runtime role.
-- Connect through the owner-controlled database console/environment; do not paste
-- connection strings into chat or Git. Confirm the target before running this file.
-- Run the whole file in one session. No customer/staff/request rows are returned.
-- Stop on the first SQL error and ROLLBACK if the client does not do so automatically.
-- This file does not apply migrations, grants, fixes, or application session updates.
BEGIN TRANSACTION READ ONLY;
SET LOCAL statement_timeout = '10s';
SET LOCAL lock_timeout = '2s';
SET LOCAL idle_in_transaction_session_timeout = '30s';

-- 1. Confirm the connection identity against the deployment configuration privately.
SELECT current_database() AS database_name,
       current_user AS runtime_role,
       session_user AS connection_role,
       current_setting('transaction_read_only') AS read_only,
       current_setting('search_path') AS search_path,
       has_schema_privilege(current_user, 'public', 'USAGE') AS public_usage;

-- 2. The application's SQL uses unqualified relation names. Compare their actual
-- resolution with public without assuming the migration or search_path is correct.
WITH expected(name) AS (
  VALUES ('rivya_access_requests'), ('rivya_studio_sessions'), ('rivya_staff')
)
SELECT name AS requested_relation,
       to_regclass(name)::text AS resolved_relation,
       to_regclass('public.' || name)::text AS expected_public_relation,
       to_regclass(name) = to_regclass('public.' || name) AS resolves_to_public
FROM expected ORDER BY name;

-- 3. Inspect only the resolved relations' metadata and effective table privileges.
-- Column grants below can explain false table-level flags. RLS being enabled is
-- a diagnosis lead, not proof of the observed failure; no RLS policy is changed.
WITH expected(name) AS (
  VALUES ('rivya_access_requests'), ('rivya_studio_sessions'), ('rivya_staff')
)
SELECT e.name AS requested_relation, n.nspname AS resolved_schema,
       c.relkind AS relation_kind, c.relrowsecurity AS rls_enabled,
       c.relforcerowsecurity AS rls_forced,
       has_table_privilege(current_user, c.oid, 'SELECT') AS table_select,
       CASE WHEN e.name = 'rivya_studio_sessions'
         THEN has_table_privilege(current_user, c.oid, 'UPDATE') END AS session_table_update
FROM expected e
LEFT JOIN pg_class c ON c.oid = to_regclass(e.name)
LEFT JOIN pg_namespace n ON n.oid = c.relnamespace
ORDER BY e.name;

-- 4. Exact columns needed by listAccessRequests() and studioSessionFromToken().
-- Password hashes, tokens, contacts, staff names, and request values are not read.
WITH expected(relation_name, column_name, expected_type) AS (
  VALUES
    ('rivya_access_requests', 'id', 'uuid'::regtype),
    ('rivya_access_requests', 'kind', 'text'::regtype),
    ('rivya_access_requests', 'login', 'text'::regtype),
    ('rivya_access_requests', 'name', 'text'::regtype),
    ('rivya_access_requests', 'contact', 'text'::regtype),
    ('rivya_access_requests', 'status', 'text'::regtype),
    ('rivya_access_requests', 'version', 'integer'::regtype),
    ('rivya_access_requests', 'created_at', 'timestamptz'::regtype),
    ('rivya_access_requests', 'expires_at', 'timestamptz'::regtype),
    ('rivya_studio_sessions', 'token_hash', 'text'::regtype),
    ('rivya_studio_sessions', 'staff_id', 'uuid'::regtype),
    ('rivya_studio_sessions', 'credential_version', 'text'::regtype),
    ('rivya_studio_sessions', 'expires_at', 'timestamptz'::regtype),
    ('rivya_studio_sessions', 'idle_expires_at', 'timestamptz'::regtype),
    ('rivya_staff', 'id', 'uuid'::regtype),
    ('rivya_staff', 'login', 'text'::regtype),
    ('rivya_staff', 'role', 'text'::regtype),
    ('rivya_staff', 'active', 'boolean'::regtype),
    ('rivya_staff', 'version', 'integer'::regtype)
)
SELECT e.relation_name, e.column_name,
       a.attname IS NOT NULL AS column_exists,
       format_type(a.atttypid, a.atttypmod) AS actual_type,
       e.expected_type::text AS expected_type,
       a.atttypid = e.expected_type::oid AS expected_type_matches,
       CASE WHEN a.attname IS NOT NULL
         THEN has_column_privilege(current_user, a.attrelid, a.attnum, 'SELECT') END AS column_select,
       CASE WHEN e.relation_name = 'rivya_studio_sessions'
         AND e.column_name = 'idle_expires_at' AND a.attname IS NOT NULL
         THEN has_column_privilege(current_user, a.attrelid, a.attnum, 'UPDATE') END AS idle_expiry_update
FROM expected e
LEFT JOIN pg_attribute a ON a.attrelid = to_regclass(e.relation_name)
  AND a.attname = e.column_name AND a.attnum > 0 AND NOT a.attisdropped
ORDER BY e.relation_name, e.column_name;

-- 5. Parse/permission probe of the actual queue projection. The constant-false
-- predicate guarantees zero application rows; this does not validate real row
-- contents, session mutation, connectivity from Vercel, or approval/recovery writes.
SELECT id, kind, login, name, contact, status, version,
       created_at AS "createdAt", expires_at AS "expiresAt"
FROM rivya_access_requests
WHERE status IN ('pending', 'approved') AND false
ORDER BY created_at LIMIT 100;

-- No changes exist to commit. End the diagnostic transaction explicitly.
ROLLBACK;
