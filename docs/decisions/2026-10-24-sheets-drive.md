# Use Sheets and Drive after verified migration; preserve the approved public site

Status: owner-selected target; implementation in progress, no cutover.
Date: 24 October 2026. Starting local revision: `e9d3228`.

The owner approved the final local public design and supplied the new **CRAFT MASTER PROMPT — Studio Redesign, Google Sheets + Drive Migration, and Completion of Remaining Work**. This resumes work after the prior stop. It supersedes the old public-restoration direction and the preference for SQL as the permanent canonical store. It does not discard completed work or authorize a production release.

Preserve the approved public website, including Rivya / Creations, The Signature and the footer; current Studio login; logo, colour, contacts; product identities, prices, variants, URLs, valid content and original/selected media. Redesign authenticated Studio only, using OLDWEBSITE as its reference. The existing exclusion of product additions, archived catalogue/Sheets imports and Google Photos rework remains in force. Existing catalogue records may be mapped and migrated without adding products. Research observations remain separate from the owned catalogue.

The target is canonical structured records in Google Sheets and managed files in Drive, with secure server APIs and a coordinated writer. No alternate database, Redis queue or persistent local record file may replace SQL. Temporary processing and rebuildable caches are allowed. Preserve the current database as the authority throughout preparation; never silently dual-write or fall back to it after Sheets accepts new authoritative writes.

The current app has 53 SQL-dependent source files and two Blob adapters. A broad SQL emulation shim would conceal transaction, authorization and publication differences. Introduce typed provider boundaries around current domain validators and render contracts, then replace workflows in verified slices. Start with a non-product operation; preserve login presentation while separately migrating its security persistence.

Sheets requests can commit an atomic batch within one spreadsheet. A script lock coordinates only participating script executions, not unrelated clients or direct human edits. Keep each mutation, its revision, audit and idempotency receipt in one workbook batch; use protected canonical ranges and validated staging inputs. Cross-workbook changes need explicit staged workflows and recovery, never an invented multi-workbook transaction. See the [architecture](../google-workspace-2026-10-24/ARCHITECTURE.md) and [phase plan](../google-workspace-2026-10-24/PHASE-PLAN.md).

Consequences: existing SQL behavior remains active until Google auth, migration, write coordination, coherent publication and recovery pass isolated acceptance. Sheets quotas and latency impose operational constraints that must be measured against real accounts; local tests cannot establish production capacity. The existing catalogue workbook/templates and V2 source are reuse candidates, not proof of installed automation or application persistence. No private records, credentials or raw audit evidence belong in Git.

Current authorization covers local source/tools/tests/documentation and read-only inspection of connected services. Cloud mutation, migration/cutover, CMS publication, production configuration, push/PR/deployment and destructive deletion have not occurred. Prepare exact resource and release scopes before crossing those boundaries.

Primary references checked 24 October 2026: [Sheets limits](https://developers.google.com/workspace/sheets/api/limits), [atomic batch behavior](https://developers.google.com/workspace/sheets/api/guides/batch), [Apps Script locks](https://developers.google.com/apps-script/reference/lock/lock-service), [Apps Script quotas](https://developers.google.com/apps-script/guides/services/quotas).
