-- Read-only metadata/zero-row verification. This does not submit a real request,
-- certify application connectivity or impersonate the runtime role.
-- Run whole file only after matching the owner-console project/branch/endpoint.
BEGIN TRANSACTION READ ONLY;
SET LOCAL statement_timeout = '10s';
SET LOCAL lock_timeout = '2s';
SET LOCAL idle_in_transaction_session_timeout = '30s';
SET LOCAL search_path = pg_catalog, public;
DO $verify$
BEGIN
  IF current_database() <> 'neondb' OR current_user <> 'neondb_owner'
     OR session_user <> 'neondb_owner' THEN
    RAISE EXCEPTION 'ACCESS_REPAIR_VERIFY_TARGET: wrong database or owner connection';
  END IF;
  IF to_regclass('public.rivya_access_requests') IS NULL THEN
    RAISE EXCEPTION 'ACCESS_REPAIR_VERIFY_MISSING: table absent';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_class WHERE oid='public.rivya_access_requests'::regclass
      AND relkind='r' AND relowner=(SELECT oid FROM pg_roles WHERE rolname='neondb_owner')
      AND NOT relrowsecurity AND NOT relforcerowsecurity) THEN
    RAISE EXCEPTION 'ACCESS_REPAIR_VERIFY_SHAPE: owner, relation type or RLS differs';
  END IF;
  IF (SELECT count(*) FROM pg_attribute WHERE attrelid='public.rivya_access_requests'::regclass
      AND attnum>0 AND NOT attisdropped) <> 14 OR EXISTS (
    SELECT 1 FROM (VALUES
      ('id','uuid'::regtype,true),('kind','text'::regtype,true),('login','text'::regtype,true),
      ('name','text'::regtype,true),('contact','text'::regtype,true),('status','text'::regtype,true),
      ('staff_id','uuid'::regtype,false),('token_hash','text'::regtype,false),
      ('credential_version','integer'::regtype,false),('expires_at','timestamptz'::regtype,false),
      ('created_at','timestamptz'::regtype,true),('updated_at','timestamptz'::regtype,true),
      ('decided_by','text'::regtype,false),('version','integer'::regtype,true)
    ) AS e(name,column_type,required)
    LEFT JOIN pg_attribute a ON a.attrelid='public.rivya_access_requests'::regclass
      AND a.attname=e.name AND a.attnum>0 AND NOT a.attisdropped
    WHERE a.attname IS NULL OR a.atttypid<>e.column_type::oid OR a.attnotnull<>e.required
  ) THEN
    RAISE EXCEPTION 'ACCESS_REPAIR_VERIFY_SHAPE: fourteen-column signature differs';
  END IF;
  -- PostgreSQL 18 also catalogs NOT NULL constraints (contype=n). Their required
  -- attributes are checked above; count only the eight key/FK/check constraints.
  IF (SELECT count(*) FROM pg_constraint WHERE conrelid='public.rivya_access_requests'::regclass AND contype IN ('p','f','c','u','x')) <> 8
     OR (SELECT count(*) FROM pg_constraint WHERE conrelid='public.rivya_access_requests'::regclass AND contype='c' AND convalidated) <> 6
     OR NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid='public.rivya_access_requests'::regclass AND contype='p' AND convalidated)
     OR NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid='public.rivya_access_requests'::regclass AND contype='f' AND confrelid='public.rivya_staff'::regclass AND convalidated) THEN
    RAISE EXCEPTION 'ACCESS_REPAIR_VERIFY_SHAPE: constraint signature differs';
  END IF;
  IF (SELECT count(*) FROM pg_index WHERE indrelid='public.rivya_access_requests'::regclass) <> 4 OR EXISTS (
    SELECT 1 FROM (VALUES ('rivya_access_requests_pkey',true),('rivya_access_open_login',true),
      ('rivya_access_token',true),('rivya_access_queue',false)) AS e(name,is_unique)
    LEFT JOIN pg_class c ON c.oid=to_regclass('public.' || e.name)
    LEFT JOIN pg_index i ON i.indexrelid=c.oid AND i.indrelid='public.rivya_access_requests'::regclass
    WHERE i.indexrelid IS NULL OR NOT i.indisvalid OR NOT i.indisready OR i.indisunique<>e.is_unique
  ) THEN
    RAISE EXCEPTION 'ACCESS_REPAIR_VERIFY_SHAPE: index signature differs';
  END IF;
  IF NOT (has_table_privilege('rivya_runtime_20260924','public.rivya_access_requests','SELECT')
      AND has_table_privilege('rivya_runtime_20260924','public.rivya_access_requests','INSERT')
      AND has_table_privilege('rivya_runtime_20260924','public.rivya_access_requests','UPDATE'))
     OR has_table_privilege('rivya_runtime_20260924','public.rivya_access_requests','DELETE,TRUNCATE,REFERENCES,TRIGGER') THEN
    RAISE EXCEPTION 'ACCESS_REPAIR_VERIFY_ACL: effective runtime privileges differ';
  END IF;
  IF has_schema_privilege('rivya_runtime_20260924','public','CREATE') OR EXISTS (
    SELECT 1 FROM pg_class c CROSS JOIN LATERAL aclexplode(c.relacl) a
    WHERE c.oid='public.rivya_access_requests'::regclass AND a.grantee<>c.relowner
      AND (a.grantee<>(SELECT oid FROM pg_roles WHERE rolname='rivya_runtime_20260924')
           OR a.privilege_type NOT IN ('SELECT','INSERT','UPDATE') OR a.is_grantable)
  ) THEN
    RAISE EXCEPTION 'ACCESS_REPAIR_VERIFY_ACL: unexpected schema or direct table privileges';
  END IF;
  IF current_setting('server_version_num')::integer >= 170000
     AND has_table_privilege('rivya_runtime_20260924','public.rivya_access_requests','MAINTAIN') THEN
    RAISE EXCEPTION 'ACCESS_REPAIR_VERIFY_ACL: unexpected maintenance access';
  END IF;
END;
$verify$;
SELECT current_database() AS database_name,current_user AS connection_role,
       current_setting('transaction_read_only') AS read_only;
SELECT c.relname,c.relkind,pg_get_userbyid(c.relowner) AS owner,
       c.relrowsecurity,c.relforcerowsecurity
FROM pg_class c WHERE c.oid='public.rivya_access_requests'::regclass;
SELECT a.attname AS column_name,format_type(a.atttypid,a.atttypmod) AS column_type,
       a.attnotnull AS not_null,pg_get_expr(d.adbin,d.adrelid) AS default_expression
FROM pg_attribute a LEFT JOIN pg_attrdef d ON d.adrelid=a.attrelid AND d.adnum=a.attnum
WHERE a.attrelid='public.rivya_access_requests'::regclass AND a.attnum>0 AND NOT a.attisdropped
ORDER BY a.attnum;
SELECT conname,contype,convalidated,pg_get_constraintdef(oid) AS definition
FROM pg_constraint WHERE conrelid='public.rivya_access_requests'::regclass ORDER BY conname;
SELECT i.relname AS index_name,x.indisunique,x.indisvalid,x.indisready,
       pg_get_indexdef(i.oid) AS definition
FROM pg_index x JOIN pg_class i ON i.oid=x.indexrelid
WHERE x.indrelid='public.rivya_access_requests'::regclass ORDER BY i.relname;
SELECT CASE WHEN acl.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(acl.grantee) END AS grantee,
       acl.privilege_type,acl.is_grantable
FROM pg_class c CROSS JOIN LATERAL aclexplode(c.relacl) acl
WHERE c.oid='public.rivya_access_requests'::regclass ORDER BY grantee,privilege_type;
SELECT has_schema_privilege('rivya_runtime_20260924','public','USAGE') AS runtime_schema_usage,
       has_schema_privilege('rivya_runtime_20260924','public','CREATE') AS runtime_schema_create,
       has_table_privilege('rivya_runtime_20260924','public.rivya_access_requests','SELECT') AS runtime_select,
       has_table_privilege('rivya_runtime_20260924','public.rivya_access_requests','INSERT') AS runtime_insert,
       has_table_privilege('rivya_runtime_20260924','public.rivya_access_requests','UPDATE') AS runtime_update,
       has_table_privilege('rivya_runtime_20260924','public.rivya_access_requests','DELETE') AS runtime_delete,
       has_table_privilege('rivya_runtime_20260924','public.rivya_access_requests','TRUNCATE') AS runtime_truncate,
       has_table_privilege('rivya_runtime_20260924','public.rivya_access_requests','REFERENCES') AS runtime_references,
       has_table_privilege('rivya_runtime_20260924','public.rivya_access_requests','TRIGGER') AS runtime_trigger;
-- Same selected columns as the deployed queue, guaranteed zero application rows.
SELECT id,kind,login,name,contact,status,version,created_at AS "createdAt",expires_at AS "expiresAt"
FROM public.rivya_access_requests WHERE status IN ('pending','approved') AND false
ORDER BY created_at LIMIT 100;
ROLLBACK;
