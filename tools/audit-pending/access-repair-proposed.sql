-- PROPOSED ONLY. Fresh explicit owner approval is required before production use.
-- Target must be confirmed in the owner console, not inferred from SQL names:
-- blue-haze-08978208 / br-muddy-poetry-awe0sju1 / ep-delicate-silence-awjxadrd.
-- Adapted without schema changes from scripts/studio-access-migration.sql and
-- scripts/studio-access-runtime-grants.sql. Run the COMPLETE file in one session.
-- Stop on error and ROLLBACK. No existing records, roles or schema grants change.
BEGIN;
SET LOCAL lock_timeout = '2s';
SET LOCAL statement_timeout = '30s';
SET LOCAL idle_in_transaction_session_timeout = '60s';
SET LOCAL search_path = pg_catalog, public;

DO $guard$
BEGIN
  IF current_database() <> 'neondb' OR current_user <> 'neondb_owner'
     OR session_user <> 'neondb_owner' THEN
    RAISE EXCEPTION 'ACCESS_REPAIR_TARGET: wrong database or owner connection';
  END IF;
  IF current_setting('transaction_read_only') <> 'off' OR pg_is_in_recovery() THEN
    RAISE EXCEPTION 'ACCESS_REPAIR_TARGET: writable primary required';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'rivya_runtime_20260924'
                 AND NOT rolsuper AND NOT rolbypassrls) THEN
    RAISE EXCEPTION 'ACCESS_REPAIR_ROLE: expected restricted runtime role absent';
  END IF;
  IF NOT has_schema_privilege('rivya_runtime_20260924', 'public', 'USAGE')
     OR has_schema_privilege('rivya_runtime_20260924', 'public', 'CREATE') THEN
    RAISE EXCEPTION 'ACCESS_REPAIR_ROLE: existing schema privileges differ';
  END IF;
  IF to_regclass('public.rivya_access_requests') IS NOT NULL
     OR to_regclass('public.rivya_access_open_login') IS NOT NULL
     OR to_regclass('public.rivya_access_token') IS NOT NULL
     OR to_regclass('public.rivya_access_queue') IS NOT NULL THEN
    RAISE EXCEPTION 'ACCESS_REPAIR_EXISTS: target already exists; inspect, never replay';
  END IF;
  IF EXISTS (
    SELECT 1 FROM (VALUES ('rivya_staff'), ('rivya_studio_sessions')) AS e(name)
    LEFT JOIN pg_class c ON c.oid = to_regclass('public.' || e.name)
    WHERE c.oid IS NULL OR c.relkind <> 'r' OR c.relrowsecurity OR c.relforcerowsecurity
  ) THEN
    RAISE EXCEPTION 'ACCESS_REPAIR_SIGNATURE: expected staff/session tables absent or changed';
  END IF;
  IF EXISTS (
    SELECT 1 FROM (VALUES
      ('rivya_staff','id','uuid'::regtype),
      ('rivya_staff','login','text'::regtype),
      ('rivya_staff','name','text'::regtype),
      ('rivya_staff','password_hash','text'::regtype),
      ('rivya_staff','role','text'::regtype),
      ('rivya_staff','active','boolean'::regtype),
      ('rivya_staff','version','integer'::regtype),
      ('rivya_staff','created_at','timestamptz'::regtype),
      ('rivya_studio_sessions','token_hash','text'::regtype),
      ('rivya_studio_sessions','staff_id','uuid'::regtype),
      ('rivya_studio_sessions','credential_version','text'::regtype),
      ('rivya_studio_sessions','expires_at','timestamptz'::regtype),
      ('rivya_studio_sessions','idle_expires_at','timestamptz'::regtype)
    ) AS e(relation_name,column_name,column_type)
    LEFT JOIN pg_attribute a ON a.attrelid = to_regclass('public.' || e.relation_name)
      AND a.attname = e.column_name AND a.attnum > 0 AND NOT a.attisdropped
    WHERE a.attname IS NULL OR a.atttypid <> e.column_type::oid
  ) THEN
    RAISE EXCEPTION 'ACCESS_REPAIR_SIGNATURE: expected staff/session column signature differs';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint c JOIN pg_attribute a
      ON a.attrelid = c.conrelid AND a.attname = 'id'
    WHERE c.conrelid = 'public.rivya_staff'::regclass AND c.contype = 'p'
      AND c.conkey = ARRAY[a.attnum]::smallint[]
  ) THEN
    RAISE EXCEPTION 'ACCESS_REPAIR_SIGNATURE: staff UUID primary key unavailable';
  END IF;
  IF NOT (has_table_privilege('rivya_runtime_20260924','public.rivya_staff','SELECT')
      AND has_table_privilege('rivya_runtime_20260924','public.rivya_staff','INSERT')
      AND has_table_privilege('rivya_runtime_20260924','public.rivya_staff','UPDATE')
      AND has_table_privilege('rivya_runtime_20260924','public.rivya_studio_sessions','SELECT')
      AND has_table_privilege('rivya_runtime_20260924','public.rivya_studio_sessions','INSERT')
      AND has_table_privilege('rivya_runtime_20260924','public.rivya_studio_sessions','UPDATE')) THEN
    RAISE EXCEPTION 'ACCESS_REPAIR_ROLE: existing authentication privileges differ';
  END IF;
END;
$guard$;

CREATE TABLE public.rivya_access_requests (
  id uuid PRIMARY KEY,
  kind text NOT NULL CHECK (kind IN ('access','recovery')),
  login text NOT NULL CHECK (length(login) BETWEEN 3 AND 80),
  name text NOT NULL CHECK (length(name) BETWEEN 1 AND 100),
  contact text NOT NULL CHECK (length(contact) BETWEEN 3 AND 160),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','completed')),
  staff_id uuid REFERENCES public.rivya_staff(id),
  token_hash text, credential_version integer, expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
  decided_by text, version integer NOT NULL DEFAULT 1,
  CHECK (token_hash IS NULL OR length(token_hash)=64)
);
CREATE UNIQUE INDEX rivya_access_open_login ON public.rivya_access_requests(kind,lower(login)) WHERE status IN ('pending','approved');
CREATE UNIQUE INDEX rivya_access_token ON public.rivya_access_requests(token_hash) WHERE token_hash IS NOT NULL;
CREATE INDEX rivya_access_queue ON public.rivya_access_requests(status,created_at);
REVOKE ALL ON public.rivya_access_requests FROM PUBLIC;
REVOKE ALL ON public.rivya_access_requests FROM rivya_runtime_20260924;
GRANT SELECT, INSERT, UPDATE ON public.rivya_access_requests TO rivya_runtime_20260924;

-- Default privileges are not changed. Abort rather than silently accept another
-- grantee or any extra effective runtime privilege inherited through memberships.
DO $postcondition$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_class c CROSS JOIN LATERAL aclexplode(c.relacl) acl
    WHERE c.oid = 'public.rivya_access_requests'::regclass
      AND acl.grantee <> c.relowner
      AND (acl.grantee <> (SELECT oid FROM pg_roles WHERE rolname='rivya_runtime_20260924')
           OR acl.privilege_type NOT IN ('SELECT','INSERT','UPDATE') OR acl.is_grantable)
  ) OR has_table_privilege('rivya_runtime_20260924','public.rivya_access_requests','DELETE,TRUNCATE,REFERENCES,TRIGGER') THEN
    RAISE EXCEPTION 'ACCESS_REPAIR_ACL: unexpected default or inherited access; rolled back';
  END IF;
  IF current_setting('server_version_num')::integer >= 170000
     AND has_table_privilege('rivya_runtime_20260924','public.rivya_access_requests','MAINTAIN') THEN
    RAISE EXCEPTION 'ACCESS_REPAIR_ACL: unexpected maintenance access; rolled back';
  END IF;
END;
$postcondition$;
COMMIT;
