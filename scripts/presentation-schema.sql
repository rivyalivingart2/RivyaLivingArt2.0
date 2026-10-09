-- Additive, explicit migration. No existing content, media or catalogue changes.
-- Apply twice safely to isolated QA; production application needs release approval.
CREATE TABLE IF NOT EXISTS rivya_presentations (
  presentation_key text PRIMARY KEY,
  draft jsonb NOT NULL,
  published jsonb,
  version integer NOT NULL CHECK (version > 0),
  published_version integer NOT NULL DEFAULT 0,
  updated_by text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (published_version BETWEEN 0 AND version)
);
CREATE TABLE IF NOT EXISTS rivya_presentation_revisions (
  presentation_key text NOT NULL REFERENCES rivya_presentations(presentation_key),
  version integer NOT NULL CHECK (version > 0),
  document jsonb NOT NULL,
  actor text NOT NULL,
  operation text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (presentation_key, version)
);
