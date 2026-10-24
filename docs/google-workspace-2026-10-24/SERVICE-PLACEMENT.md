# Service ownership and installation status

The owner asked that Google, GitHub and Vercel work live in their respective services. This register separates version-controlled source from installed resources. Keep it current during the Cloud continuation; a file in GitHub is not evidence that its Google service is installed.

| Service | Responsibility and destination | Current checkpoint |
|---|---|---|
| Google Sheets | Canonical structured records, same-workbook ledger/audit/history, resource registrations, job leases/checkpoints and future catalogue input/output metadata. Four permission-separated content/operations/security/system groups. | Schema and mappings complete in source; isolated workbooks and real provider acceptance pending. Existing catalogue lists are excluded. |
| Google Drive | Original/derived media, private attachments, immutable complete JSON documents, coherent publication bundles, catalogue templates, editable Slides and PDF outputs. | Existing owner assets inspected and selected images retained; immutable JSON transport verified locally. New managed folders, resource IDs and runtime access are not provisioned. |
| Google Apps Script | Installed signed writer gateway, shared ScriptLock, advanced Sheets service, private script properties; later explicitly dispatched catalogue generation. | Runnable source and manifest under `tools/google-workspace/apps-script/`; no deployed script or triggers. Use the exact isolated target plan before installation. |
| GitHub | Application/integration source, tests, sanitized schemas and receipts, decision records, PR history and Cloud continuation instructions. | Accumulated approved changes are prepared for the owner-authorized PR into `main`. Private rows, original media, credentials and local browser evidence stay excluded. |
| Vercel | Next.js website and protected Studio runtime, branch previews, production build/deployment and server environment configuration. | Existing project `rivya-living-art2-0`; release through its existing GitHub integration. New Google provider remains inactive. Record exact preview/production SHA and READY status in the release PR. |

Google implementation source remains versioned in GitHub so installed Google versions are reproducible. Secret values belong in private Apps Script properties or the appropriate server secret configuration, never in Sheets, GitHub, a public manifest or browser code. The exact writer key, resource registrations and deployment identity must be configured in the intended account before real-provider verification.

The source release does not switch data providers. The existing protected database and file storage remain authoritative until the separate migration, reconciliation and cutover gates pass. Do not move records merely to satisfy placement, seed products, import archived Sheets lists, create duplicate Google resources or pretend local emulators are installed services.

Read [ISOLATED-TARGET-PLAN.md](ISOLATED-TARGET-PLAN.md) for exact resource names, permissions, structural cells, deployment configuration and acceptance checks. Read [CONTINUE-IN-CODEX-CLOUD.md](CONTINUE-IN-CODEX-CLOUD.md) for the remaining sequence. Record each installed resource privately and only its sanitized installation/verification status publicly.
