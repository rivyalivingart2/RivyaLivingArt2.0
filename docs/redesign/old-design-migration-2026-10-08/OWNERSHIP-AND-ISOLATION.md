# Migration ownership and isolation — 9 October 2026

The October 9 implementation request authorizes local M0–M11 work, subject to phase dependencies. Release and production publication remain separate later actions. The previous main merge released planning documents only.

## Protected owners

| Information | Authoritative owner | Migration boundary |
| --- | --- | --- |
| Products, prices, forms, selected IDs and gallery order | Current catalogue and its published/draft documents | Read adapters only; never import old catalogue rows |
| Existing content, metadata, routes, locale values and publication state | Current content records and revision history | No rewrite, reclassification, replacement cover or revision reset |
| Asset associations and existing desktop/mobile crops | Current public media and owning document usage | New usages are separate; no gallery relinking |
| Contacts, brand, social and business facts | Current business/site settings and shared copy | Preserve the current phone and email from the continuation instruction; never use old defaults |
| Customer briefs, orders, notes, references and follow-ups | Current scoped order/inquiry services | Immutable saved briefs; existing staff authorization; manual customer Send |
| Old layout, tokens, section keys and component structure | OLDWEBSITE source at the recorded revision | Reference only; no old actions, authentication, Prisma schema, bootstrap or data imports |
| New display ordering | Planned separate versioned presentation manifest | Initial arrangement retains current order; no product/gallery reorder |
| New Portfolio/Testimonial classification | Owner decision of 9 October, labelled concepts/samples; genuine evidence tracked separately | Visible labels in every rendering and Drive/Studio copy; no fake customers, ratings or review structured data |
| Drive media | Supplied 111-candidate register | Filename/existence is not identity, rights, attribution or crop approval |

The `maker-hands` candidate does not establish staff identity. Generated/concept scenes do not establish completed commissions. Workshops, printing, subscriber collection and unsupported offerings stay inactive until their specific factual/workflow requirements are met. No outreach is authorized.

Scrapers, old-product transfers, ingestion-dependent Catalog Fill, backups and key custody remain excluded. Draft/revision recovery remains included. The cancelled design audit remains excluded and was left untouched in the original checkout.

## M0 evidence and local QA

`m0-evidence.json` records exact source/deployment identities and sanitized before/after comparisons. Detailed row IDs, publication identities and hashes stay in ignored `test-results/old-design-migration/`; customer values and record bodies were not exported. The live capture uses the verified current restricted runtime configuration inside a repeatable-read, read-only transaction. The first attempted historical configuration was retired and lacked the application tables; it produced no baseline and no writes. The capture now rejects that target.

The isolated database is a new loopback cluster on port 55439, database `rivya_migration_local`, role `rivya_migration_qa`. The application runner verifies server identity, strips inherited live credentials, disables indexing and refuses remote SQL. No remote Blob credential is available. Only the current repository's public source fixtures were loaded: 120 products, 56 content candidates and 131 static media records. These intentionally differ from live counts and are never production evidence or content to transfer.

The current live baseline has 120 products, 55 content records, 136 media records and 375 revision rows. The private order-related scopes are also covered. M0's ending comparisons match every captured beginning row. This is a verification fingerprint, not an archive or backup system.

## Limits

The screenshots and timings are sampled engineering baselines. Local measurements are unthrottled, use source fixtures and do not represent hosted CDN/Blob loading. The desktop Studio overview shifted by about 0.112 CLS; this remains an open defect. Native-reader, human screen-reader, physical-device, field-performance and genuine-inquiry acceptance remain unperformed. The 12 fresh anonymous public reference captures cover opening viewports only; they do not certify all old sections or authenticated Studio child views.
