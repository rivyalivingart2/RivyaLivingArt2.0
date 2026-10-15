-- psql -v runtime_role=<existing app role> -f scripts/studio-access-runtime-grants.sql
GRANT SELECT, INSERT, UPDATE ON rivya_access_requests TO :"runtime_role";
