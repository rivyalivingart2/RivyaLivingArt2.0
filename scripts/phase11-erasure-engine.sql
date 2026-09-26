BEGIN;
SET LOCAL lock_timeout='5s';
SET LOCAL statement_timeout='30s';

-- 1. Minimal Erasure Ledger for DPDP / GDPR compliance
CREATE TABLE IF NOT EXISTS public.rivya_erasure_ledger (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL,
  reference text NOT NULL,
  requested_at timestamptz,
  identity_verified_at timestamptz,
  erased_at timestamptz NOT NULL DEFAULT now(),
  erased_by text NOT NULL,
  reason text NOT NULL CHECK (reason IN ('customer_request', 'retention_expiry', 'administrative_order')),
  references_deleted integer NOT NULL DEFAULT 0,
  notes_purged integer NOT NULL DEFAULT 0,
  details jsonb NOT NULL DEFAULT '{}'::jsonb
);
CREATE INDEX IF NOT EXISTS rivya_erasure_ledger_order ON public.rivya_erasure_ledger(order_id);
CREATE INDEX IF NOT EXISTS rivya_erasure_ledger_ref ON public.rivya_erasure_ledger(reference);
CREATE INDEX IF NOT EXISTS rivya_erasure_ledger_time ON public.rivya_erasure_ledger(erased_at DESC);

-- 2. Managed Customer Exports with 7-day automated expiry
CREATE TABLE IF NOT EXISTS public.rivya_managed_exports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor text NOT NULL,
  row_count integer NOT NULL,
  criteria jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '7 days'),
  invalidated_at timestamptz,
  invalidation_reason text
);
CREATE INDEX IF NOT EXISTS rivya_managed_exports_expires ON public.rivya_managed_exports(expires_at);

-- 3. Add erased_at flag to privacy controls
ALTER TABLE public.rivya_privacy_controls ADD COLUMN IF NOT EXISTS erased_at timestamptz;

COMMIT;
