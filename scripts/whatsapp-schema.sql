-- Additive migration. Apply to Preview first; existing orders and sessions are retained.
CREATE TABLE IF NOT EXISTS rivya_staff (
 id uuid PRIMARY KEY, login text UNIQUE NOT NULL, name text NOT NULL,
 password_hash text NOT NULL, role text NOT NULL CHECK(role IN ('admin','editor')),
 active boolean NOT NULL DEFAULT true, version integer NOT NULL DEFAULT 1,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS rivya_staff_login_ci ON rivya_staff(lower(login));
ALTER TABLE rivya_studio_sessions ADD COLUMN IF NOT EXISTS staff_id uuid REFERENCES rivya_staff(id);
CREATE TABLE IF NOT EXISTS rivya_catalogue (
 product_id text PRIMARY KEY, draft jsonb NOT NULL, published jsonb,
 version integer NOT NULL DEFAULT 1, published_version integer NOT NULL DEFAULT 1,
 visible boolean NOT NULL DEFAULT true, updated_by text NOT NULL, updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS rivya_inquiries (
 id uuid PRIMARY KEY REFERENCES rivya_studio_orders(id), reference text UNIQUE NOT NULL,
 guest_hash text NOT NULL, request_key uuid UNIQUE NOT NULL, payload_hash text NOT NULL,
 product_id text NOT NULL, product_snapshot jsonb NOT NULL, name text NOT NULL, phone text NOT NULL,
 email text NOT NULL DEFAULT '', answers jsonb NOT NULL, notes text NOT NULL DEFAULT '',
 summary text NOT NULL, assignee uuid REFERENCES rivya_staff(id), follow_up date,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS rivya_references (
 id uuid PRIMARY KEY, guest_hash text NOT NULL, request_key uuid NOT NULL, pathname text UNIQUE NOT NULL,
 bytes integer NOT NULL CHECK(bytes > 0), inquiry_id uuid REFERENCES rivya_inquiries(id),
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS rivya_references_inquiry ON rivya_references(inquiry_id);
CREATE TABLE IF NOT EXISTS rivya_inquiry_notes (
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, inquiry_id uuid NOT NULL REFERENCES rivya_inquiries(id),
 actor text NOT NULL, body text NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS rivya_audit (
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, actor text NOT NULL, action text NOT NULL,
 entity text NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS rivya_storage_budget (id integer PRIMARY KEY CHECK(id=1), bytes bigint NOT NULL DEFAULT 0);
INSERT INTO rivya_storage_budget(id) VALUES(1) ON CONFLICT DO NOTHING;

-- Serializes uploads/final submission for one anonymous form without storing PII.
CREATE TABLE IF NOT EXISTS rivya_inquiry_upload_sessions (
 request_key uuid PRIMARY KEY, guest_hash text NOT NULL, used_slots integer NOT NULL DEFAULT 0 CHECK(used_slots BETWEEN 0 AND 3),
 finalized boolean NOT NULL DEFAULT false, created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE rivya_references ADD COLUMN IF NOT EXISTS upload_key uuid;
ALTER TABLE rivya_references ADD COLUMN IF NOT EXISTS state text NOT NULL DEFAULT 'ready' CHECK(state IN ('pending','ready','deleting'));
CREATE UNIQUE INDEX IF NOT EXISTS rivya_references_upload_key ON rivya_references(upload_key) WHERE upload_key IS NOT NULL;
CREATE INDEX IF NOT EXISTS rivya_references_orphan ON rivya_references(created_at) WHERE inquiry_id IS NULL;
ALTER TABLE rivya_studio_order_events ADD COLUMN IF NOT EXISTS reason text;
