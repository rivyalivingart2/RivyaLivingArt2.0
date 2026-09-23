ALTER TABLE rivya_references ADD COLUMN IF NOT EXISTS storage_provider text NOT NULL DEFAULT 'vercel' CHECK(storage_provider IN ('vercel','netlify'));
