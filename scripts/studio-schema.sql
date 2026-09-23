-- Apply explicitly to the isolated Studio database. No fixtures or admin password are inserted.
CREATE TABLE IF NOT EXISTS rivya_studio_sessions (
  token_hash text PRIMARY KEY,
  credential_version text NOT NULL,
  expires_at timestamptz NOT NULL,
  idle_expires_at timestamptz NOT NULL
);
CREATE TABLE IF NOT EXISTS rivya_studio_login_limits (
  key text PRIMARY KEY,
  attempts integer NOT NULL,
  reset_at timestamptz NOT NULL
);
CREATE TABLE IF NOT EXISTS rivya_studio_orders (
  id uuid PRIMARY KEY,
  client text NOT NULL CHECK (length(client) BETWEEN 1 AND 120),
  title text NOT NULL CHECK (length(title) BETWEEN 1 AND 240),
  status text NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW','CONTACTED','QUALIFIED','QUOTED','CONFIRMED','IN_PRODUCTION','COMPLETED','CLOSED')),
  version integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS rivya_studio_order_events (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id uuid NOT NULL REFERENCES rivya_studio_orders(id),
  actor text NOT NULL,
  from_status text,
  to_status text NOT NULL,
  version integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS rivya_studio_orders_created ON rivya_studio_orders(created_at DESC);
CREATE INDEX IF NOT EXISTS rivya_studio_events_order ON rivya_studio_order_events(order_id, created_at);
