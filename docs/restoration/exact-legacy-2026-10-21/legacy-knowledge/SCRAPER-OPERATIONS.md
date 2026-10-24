# Scraper and adapter contracts

Adapted from docs/scraper.md and docs/source-adapters.md at OLDWEBSITE 2dd6d5d. Exact hashes: ../MARKDOWN-MIGRATION.csv. These requirements govern the later port; this document does not report a live scraper.

Keep durable database job state, cursor, heartbeat and optimistic page advancement. One queued/running job per source prevents duplicate work. The old runner reclaims stale jobs after ten minutes, and its scheduled drain only advances idle jobs. Restore action and cron authorization independently; a server action export is a callable endpoint, so a session-free worker must stay outside an action module.

Restore source/category/product scopes. Verify a pasted scope belongs to the registered source before a job exists. Bound pages, redirects, response bytes, concurrency and retry delays. Keep safeFetch SSRF/DNS protections and robots/access policy. Five consecutive failures pause the source; resume resets the counter after diagnosis. Raising a threshold to bypass a refusal is not an adapter fix.

Adapters return normalized observations with stable external IDs. Shopify, WooCommerce and JSON-LD paths precede bespoke adapters. Priced-store and quote-studio shape extractors must reject listing/non-product pages. Quote-only means a null price, never zero or an invented midpoint. Use fixture tests for extraction and separate dated live acceptance for each enabled adapter.

Keep price history append-only when a price changes, including changes to/from null. Record validation failures by product and field. A corrected extraction can resolve its failure; an operator-ignored failure must not reopen. Quality triage groups repeated failures by field/source. Normalize units and canonical URLs before change comparison without inventing material specifications.

Source registry → discovery → jobs → staged data → quality → review → approval → draft import → confirmation is the old stage rail. Display actual counts only when its stores are connected. The Phase 2 local reference explorer contains literal seed records from the pinned source; enabled/platform notes are historical configuration, not current permission, source availability or tested extraction. No external scraper job has run in this restoration checkpoint.
