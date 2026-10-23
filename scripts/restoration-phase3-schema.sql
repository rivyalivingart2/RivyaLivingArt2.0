-- Additive Phase 3 storage. No catalogue/content/media UPDATE, seed or import.
-- Apply only through the guarded local rehearsal until production is authorized.
BEGIN;
CREATE TABLE IF NOT EXISTS rivya_editorial_extensions (
 kind text NOT NULL CHECK (kind IN ('category','video','model')),
 entity_key text NOT NULL,
 draft jsonb NOT NULL CHECK (jsonb_typeof(draft)='object'),
 published jsonb,
 version integer NOT NULL DEFAULT 1 CHECK (version>0),
 published_version integer NOT NULL DEFAULT 0 CHECK (published_version>=0),
 updated_by text NOT NULL,
 updated_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(kind,entity_key)
);
CREATE TABLE IF NOT EXISTS rivya_editorial_extension_revisions (
 kind text NOT NULL,
 entity_key text NOT NULL,
 version integer NOT NULL CHECK(version>0),
 document jsonb NOT NULL,
 actor text NOT NULL,
 operation text NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(kind,entity_key,version),
 FOREIGN KEY(kind,entity_key) REFERENCES rivya_editorial_extensions(kind,entity_key) ON DELETE RESTRICT
);
CREATE TABLE IF NOT EXISTS rivya_restoration_crosswalk (
 source_namespace text NOT NULL,
 source_entity text NOT NULL CHECK(source_entity NOT IN ('Product','ProductVariant','ProductOption','ScrapedProduct','VendorProduct','ProductImport')),
 source_id text NOT NULL,
 destination_kind text NOT NULL CHECK(destination_kind IN ('content','media','category','video','model')),
 destination_id text NOT NULL,
 source_digest text NOT NULL CHECK(source_digest ~ '^[a-f0-9]{64}$'),
 expected_version integer NOT NULL CHECK(expected_version>=0),
 evidence text NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(source_namespace,source_entity,source_id),
 UNIQUE(source_namespace,source_entity,destination_kind,destination_id)
);
CREATE TABLE IF NOT EXISTS rivya_restoration_conflicts (
 source_namespace text NOT NULL,
 source_entity text NOT NULL,
 source_id text NOT NULL,
 field_path text NOT NULL,
 current_digest text NOT NULL CHECK(current_digest ~ '^[a-f0-9]{64}$'),
 proposed_digest text NOT NULL CHECK(proposed_digest ~ '^[a-f0-9]{64}$'),
 disposition text NOT NULL DEFAULT 'keep-current' CHECK(disposition IN ('keep-current','equal','needs-evidence')),
 PRIMARY KEY(source_namespace,source_entity,source_id,field_path),
 FOREIGN KEY(source_namespace,source_entity,source_id) REFERENCES rivya_restoration_crosswalk(source_namespace,source_entity,source_id) ON DELETE RESTRICT
);
-- This named additive constraint also upgrades an earlier local rehearsal safely.
DO $$ BEGIN
 IF NOT EXISTS(SELECT 1 FROM pg_constraint WHERE conrelid='rivya_restoration_crosswalk'::regclass AND conname='restoration_no_catalogue_imports') THEN
  ALTER TABLE rivya_restoration_crosswalk ADD CONSTRAINT restoration_no_catalogue_imports CHECK(source_entity NOT IN ('Product','ProductImage','ProductVariant','ProductOption','CustomizationField','ImportRun','ImportConflict','DeletedImport','ScrapedProduct','VendorProduct','ProductImport'));
 END IF;
END $$;
COMMIT;
