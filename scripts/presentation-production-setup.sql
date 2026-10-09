-- Owner-authorized production setup, 9 October 2026.
-- Verified Neon project blue-haze-08978208 / main / ep-delicate-silence-awjxadrd.
-- Execute through the signed-in owner console against neondb only.
-- No existing content, product, media, draft, translation or order writes.
BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '30s';
SET LOCAL search_path = public, pg_catalog;
DO $setup$
BEGIN
  IF current_database() <> 'neondb' OR current_user <> 'neondb_owner' THEN
    RAISE EXCEPTION 'Wrong database or owner role; no migration applied';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'rivya_runtime_20260924')
     OR to_regclass('public.rivya_catalogue') IS NULL
     OR to_regclass('public.rivya_content') IS NULL THEN
    RAISE EXCEPTION 'Expected current application schema is unavailable';
  END IF;
END;
$setup$;
CREATE TABLE IF NOT EXISTS public.rivya_presentations (
  presentation_key text PRIMARY KEY,
  draft jsonb NOT NULL,
  published jsonb,
  version integer NOT NULL CHECK (version > 0),
  published_version integer NOT NULL DEFAULT 0,
  updated_by text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (published_version BETWEEN 0 AND version)
);
CREATE TABLE IF NOT EXISTS public.rivya_presentation_revisions (
  presentation_key text NOT NULL REFERENCES public.rivya_presentations(presentation_key),
  version integer NOT NULL CHECK (version > 0),
  document jsonb NOT NULL,
  actor text NOT NULL,
  operation text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (presentation_key, version)
);
REVOKE ALL ON public.rivya_presentations, public.rivya_presentation_revisions FROM PUBLIC;
REVOKE ALL ON public.rivya_presentations, public.rivya_presentation_revisions FROM rivya_runtime_20260924;
GRANT SELECT, INSERT, UPDATE ON public.rivya_presentations TO rivya_runtime_20260924;
GRANT SELECT, INSERT ON public.rivya_presentation_revisions TO rivya_runtime_20260924;
COMMIT;
SELECT current_database() AS database, current_user AS role,
  (SELECT count(*) FROM public.rivya_presentations) AS presentations,
  (SELECT count(*) FROM public.rivya_presentation_revisions) AS revisions;
