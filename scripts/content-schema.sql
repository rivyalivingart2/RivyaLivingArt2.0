-- Additive content publication store; separate from inquiry and customer-reference data.
CREATE TABLE IF NOT EXISTS rivya_content (
 content_key text PRIMARY KEY, kind text NOT NULL CHECK(kind IN ('page','article')),
 route text UNIQUE NOT NULL, draft jsonb NOT NULL, published jsonb,
 version integer NOT NULL DEFAULT 1, published_version integer NOT NULL DEFAULT 0,
 visible boolean NOT NULL DEFAULT false, updated_by text NOT NULL,
 updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS rivya_inquiries_assignee_followup ON rivya_inquiries(assignee,follow_up);
CREATE INDEX IF NOT EXISTS rivya_studio_orders_status_created ON rivya_studio_orders(status,created_at DESC);
CREATE TABLE IF NOT EXISTS rivya_public_media (
 path text PRIMARY KEY, draft jsonb NOT NULL, published jsonb, version integer NOT NULL DEFAULT 1,
 updated_by text NOT NULL, updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS rivya_catalogue_draft_slug ON rivya_catalogue ((draft->>'slug'));
CREATE UNIQUE INDEX IF NOT EXISTS rivya_catalogue_published_slug ON rivya_catalogue ((published->>'slug')) WHERE published IS NOT NULL;
