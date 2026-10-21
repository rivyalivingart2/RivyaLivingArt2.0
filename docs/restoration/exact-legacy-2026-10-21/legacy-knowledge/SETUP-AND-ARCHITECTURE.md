# Setup and architecture adapted from OLDWEBSITE

Source: OLDWEBSITE README at 2dd6d5d. Exact source hashes are in ../MARKDOWN-MIGRATION.csv. Owner decision dated 21 October takes precedence over historical restrictions.

The old public storefront, protected Studio, review queue and manual WhatsApp journey are restoration requirements. The destination remains Next 16 App Router with existing publication snapshots, guarded Studio APIs, SQL stores and revision controls. Porting its visual components does not require replacing authentication with old Auth.js or replacing protected catalogue records with Prisma seeds.

For this checkpoint use Node 22.16 or later within major 22. The installed version and package-lock govern tooling. Run the destination's lint, typecheck, test, preflight, build and runtime scripts rather than copying obsolete source commands. The isolated harness is tools/exact-legacy/run-local.mjs with build/start/stop commands; it pins a task-owned loopback PostgreSQL cluster and refuses external fetches. Never rerun prepare-local.mjs against the populated fixture cluster. Never run the old build against production: it can migrate, seed sources and fill the catalogue.

Current source-of-truth contracts: src/lib/shop-model.ts (products), content-model.ts (editorial), editorial-record-model.ts (portfolio/testimonials), site-settings-model.ts (navigation/locales), business-settings-model.ts (protected contacts), studio-auth.ts (access), and scripts/*-schema.sql. See inventory/legacy-entities.csv for old entity destinations and unresolved adapters. Historical old credentials, contacts, domains and environment advice are not configuration for the new site.

The old homepage sequence, typography, section rhythm and shared navigation are port sources. Current brand/navy/logo and actual content remain exceptions. A component preview is not proof of complete feature parity, a source registry is not a tested adapter, and a successful local build is not a release.
