CREATE TABLE IF NOT EXISTS rivya_business_settings (
 id integer PRIMARY KEY CHECK(id=1), details jsonb NOT NULL,
 version integer NOT NULL DEFAULT 1, updated_by text NOT NULL,
 updated_at timestamptz NOT NULL DEFAULT now()
);
