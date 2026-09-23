-- Additive companion to phase2-order-contract.sql. Independent backup required.
-- No build hook or seed invokes this file. Old evidence stays unknown.
BEGIN;
SET LOCAL lock_timeout='5s';
SET LOCAL statement_timeout='30s';
ALTER TABLE public.rivya_references
 ADD COLUMN upload_sha256 text,
 ADD COLUMN write_token uuid,
 ADD COLUMN write_expires_at timestamptz,
 ADD CONSTRAINT rivya_reference_upload_digest CHECK(upload_sha256 IS NULL OR upload_sha256 ~ '^[0-9a-f]{64}$'),
 ADD CONSTRAINT rivya_reference_write_lease CHECK((write_token IS NULL AND write_expires_at IS NULL) OR (write_token IS NOT NULL AND write_expires_at IS NOT NULL));
COMMIT;
