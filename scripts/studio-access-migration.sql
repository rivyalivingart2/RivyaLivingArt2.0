-- Additive only. Apply to isolated QA first; deployment requires the database owner.
BEGIN;
CREATE TABLE IF NOT EXISTS rivya_access_requests (
 id uuid PRIMARY KEY,
 kind text NOT NULL CHECK (kind IN ('access','recovery')),
 login text NOT NULL CHECK (length(login) BETWEEN 3 AND 80),
 name text NOT NULL CHECK (length(name) BETWEEN 1 AND 100),
 contact text NOT NULL CHECK (length(contact) BETWEEN 3 AND 160),
 status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','completed')),
 staff_id uuid REFERENCES rivya_staff(id),
 token_hash text, credential_version integer, expires_at timestamptz,
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 decided_by text, version integer NOT NULL DEFAULT 1,
 CHECK (token_hash IS NULL OR length(token_hash)=64)
);
CREATE UNIQUE INDEX IF NOT EXISTS rivya_access_open_login ON rivya_access_requests(kind,lower(login)) WHERE status IN ('pending','approved');
CREATE UNIQUE INDEX IF NOT EXISTS rivya_access_token ON rivya_access_requests(token_hash) WHERE token_hash IS NOT NULL;
CREATE INDEX IF NOT EXISTS rivya_access_queue ON rivya_access_requests(status,created_at);
COMMIT;
-- Use scripts/studio-access-runtime-grants.sql with the existing runtime role.
