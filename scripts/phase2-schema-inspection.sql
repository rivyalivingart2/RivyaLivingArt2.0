-- Read-only inventory. Run on each positively identified environment separately.
-- No customer rows, password hashes, tokens or object paths are selected.
BEGIN TRANSACTION READ ONLY;
SET LOCAL statement_timeout = '15s';
SELECT current_setting('server_version') AS server_version,
       current_setting('transaction_read_only') AS read_only,
       has_schema_privilege(current_user,'public','USAGE') AS schema_usage,
       has_schema_privilege(current_user,'public','CREATE') AS schema_create;
SELECT c.table_name,c.column_name,c.data_type,c.is_nullable,c.column_default
FROM information_schema.columns c
WHERE c.table_schema='public' AND c.table_name LIKE 'rivya_%'
ORDER BY c.table_name,c.ordinal_position;
SELECT c.relname AS table_name,p.conname,pg_get_constraintdef(p.oid) AS definition,p.convalidated
FROM pg_constraint p JOIN pg_class c ON c.oid=p.conrelid
JOIN pg_namespace n ON n.oid=c.relnamespace
WHERE n.nspname='public' AND c.relname LIKE 'rivya_%'
ORDER BY c.relname,p.conname;
SELECT tablename,indexname,indexdef FROM pg_indexes
WHERE schemaname='public' AND tablename LIKE 'rivya_%' ORDER BY tablename,indexname;
SELECT c.relname AS table_name,c.relrowsecurity AS rls_enabled,
       has_table_privilege(current_user,c.oid,'SELECT') AS can_select,
       has_table_privilege(current_user,c.oid,'INSERT') AS can_insert,
       has_table_privilege(current_user,c.oid,'UPDATE') AS can_update,
       has_table_privilege(current_user,c.oid,'DELETE') AS can_delete
FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
WHERE n.nspname='public' AND c.relkind='r' AND c.relname LIKE 'rivya_%'
ORDER BY c.relname;
COMMIT;
