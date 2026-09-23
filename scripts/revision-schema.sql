CREATE TABLE IF NOT EXISTS rivya_revisions (
 kind text NOT NULL CHECK(kind IN ('product','content','media')),
 entity_key text NOT NULL, version integer NOT NULL,
 document jsonb NOT NULL, actor text NOT NULL,
 operation text NOT NULL, created_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(kind,entity_key,version)
);
