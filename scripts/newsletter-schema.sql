-- Additive candidate. Applied only to the isolated restoration database.
-- Production execution requires its own approved migration and retention review.
CREATE TABLE IF NOT EXISTS rivya_newsletter_subscribers (
 email text PRIMARY KEY CHECK (length(email) <= 254 AND email = lower(email)),
 source text NOT NULL CHECK (source IN ('footer','journal')),
 created_at timestamptz NOT NULL DEFAULT now()
);
