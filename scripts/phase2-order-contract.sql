-- APPLIED in Phase 6 to the database now shared by future Preview/Production.
-- Historical one-time migration: do not replay. Read PHASE-10-OPERATIONS-RUNBOOK.md
-- and phase-6-preview-migration.json before any separately reviewed schema change.
-- No build/seed hook invokes this file. Requires reconciled schema + independent backup.
-- One-time transaction: intentionally fail on existing columns (do not hide drift).
BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '30s';

ALTER TABLE public.rivya_inquiries
  ADD COLUMN contract_version integer NOT NULL DEFAULT 1,
  ADD COLUMN request_kind text NOT NULL DEFAULT 'product',
  ADD COLUMN schema_id text,
  ADD COLUMN schema_version integer,
  ADD COLUMN schema_snapshot jsonb,
  ADD COLUMN answer_snapshot jsonb,
  ADD COLUMN submission_source text,
  ADD COLUMN source_route text,
  ADD COLUMN consent_version text,
  ADD COLUMN consent_accepted_at timestamptz,
  ADD COLUMN reference_count integer,
  ADD COLUMN message_state text NOT NULL DEFAULT 'legacy_unverified',
  ADD COLUMN message_template_version text,
  ADD COLUMN message_destination text,
  ADD COLUMN destination_config_version integer,
  ADD COLUMN message_finalized_at timestamptz,
  ADD COLUMN message_attempts integer NOT NULL DEFAULT 0,
  ADD COLUMN message_last_attempt_at timestamptz,
  ADD COLUMN message_failure_code text,
  ALTER COLUMN product_id DROP NOT NULL,
  ALTER COLUMN product_snapshot DROP NOT NULL;

ALTER TABLE public.rivya_inquiries
  ADD CONSTRAINT rivya_inquiries_contract_version CHECK (contract_version IN (1,2)),
  ADD CONSTRAINT rivya_inquiries_request_kind CHECK (
    (request_kind='product' AND product_id IS NOT NULL AND product_snapshot IS NOT NULL) OR
    (request_kind='bespoke' AND contract_version=2 AND product_id IS NULL AND product_snapshot IS NULL)
  ),
  ADD CONSTRAINT rivya_inquiries_message_attempts CHECK (message_attempts>=0),
  ADD CONSTRAINT rivya_inquiries_contract_v2 CHECK (
    contract_version=1 OR (
      schema_id IS NOT NULL AND length(schema_id) BETWEEN 1 AND 160 AND
      schema_version IS NOT NULL AND schema_version>0 AND
      schema_snapshot IS NOT NULL AND jsonb_typeof(schema_snapshot)='object' AND
      answer_snapshot IS NOT NULL AND jsonb_typeof(answer_snapshot)='array' AND
      submission_source IS NOT NULL AND submission_source='website' AND
      source_route IS NOT NULL AND source_route LIKE '/%' AND source_route !~ '[?#]' AND
      consent_version IS NOT NULL AND length(consent_version) BETWEEN 1 AND 120 AND
      consent_accepted_at IS NOT NULL AND
      reference_count IS NOT NULL AND reference_count BETWEEN 0 AND 3 AND
      message_template_version IS NOT NULL AND length(message_template_version) BETWEEN 1 AND 120 AND
      message_destination IS NOT NULL AND message_destination ~ '^[1-9][0-9]{7,14}$' AND
      destination_config_version IS NOT NULL AND destination_config_version>=0
    )
  ),
  ADD CONSTRAINT rivya_inquiries_message_state CHECK (
    (contract_version=1 AND message_state='legacy_unverified') OR
    (contract_version=2 AND (
      (message_state='handoff_ready' AND length(summary)>0 AND message_finalized_at IS NOT NULL AND message_failure_code IS NULL) OR
      (message_state='handoff_pending' AND summary='' AND message_finalized_at IS NULL AND message_failure_code IS NULL) OR
      (message_state='handoff_failed' AND summary='' AND message_finalized_at IS NULL AND
        message_failure_code IS NOT NULL AND message_failure_code IN ('render_failed','destination_unavailable'))
    ))
  );

-- Metadata added without fabricating historical attachment timestamps or MIME proof.
ALTER TABLE public.rivya_references
  ADD COLUMN normalized_mime text,
  ADD COLUMN linked_at timestamptz,
  ADD CONSTRAINT rivya_references_normalized_mime CHECK (normalized_mime IS NULL OR normalized_mime='image/jpeg'),
  ADD CONSTRAINT rivya_references_linked_at CHECK (linked_at IS NULL OR inquiry_id IS NOT NULL),
  ADD CONSTRAINT rivya_references_vercel_only CHECK (storage_provider='vercel') NOT VALID;
-- NOT VALID preserves any legacy provider rows; new/updated rows must use Vercel.
-- Inventory before VALIDATE; never relabel/delete an unknown-provider object.

CREATE INDEX rivya_inquiries_handoff_pending ON public.rivya_inquiries(created_at,id)
  WHERE contract_version=2 AND message_state IN ('handoff_pending','handoff_failed');
COMMIT;
