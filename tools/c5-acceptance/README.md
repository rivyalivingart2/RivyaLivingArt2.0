# C5 isolated Studio acceptance

These runners target only `http://127.0.0.1:4189` and the existing isolated QA project. Start the local application with the verified QA configuration. Supply that existing file's path in `RIVYA_QA_CONFIG_PATH`; never put its contents, passwords or session cookies on the command line. Use the repository's supported Node 22 runtime and installed Playwright/Chrome.

`common.mjs` checks the database name, runtime role and Blob-store identity. After sign-in it verifies that the local application's session exists in that exact QA database before allowing fixture writes. Credentials and cookies stay in memory. Results under ignored `test-results/c5-acceptance` contain only sanitized acceptance evidence.

Run the following sequentially. Concurrent fixture-writing runners invalidate each other's before/after preservation comparison.

```powershell
node tools/c5-acceptance/service.mjs
node tools/c5-acceptance/read-failures.mjs
node tools/c5-acceptance/protected-browser.mjs
node tools/c5-acceptance/administration-browser.mjs
node tools/c5-acceptance/browser-run.mjs
node tools/c5-acceptance/layout-keyboard.mjs
node tools/c5-acceptance/busy-zoom.mjs
node tools/c5-acceptance/verify-fixtures.mjs
```

- Service tests use synthetic staff, three manual entries, two synthetic inquiry snapshots and one custom page. They cover anonymous/admin/editor scope, stale changes, idempotent retries, session revocation, role changes, exact preview, publication and recovery.
- The browser runner uses one synthetic staff member, inquiry and custom page. It exercises the real UI, native confirmation dialogs, API writes, saved records and anonymous published output. `--inquiries-only` reruns that portion after a focused repair.
- Protected-editor and administration tests intercept every write. Product/media/contact/navigation failure and post-commit-refresh scenarios never modify their saved facts. These simulated acknowledgements are not evidence of actual product or business publication.
- Initial-load and stale-refresh tests deliberately return failures only in the browser. They require retained records, visible feedback, successful retry and no unhandled exceptions.
- Layout tests cover all 16 modules at 1440, 720 and 390 CSS pixels, modal focus, keyboard tabs and the page finder. The zoom runner adds 200% CSS page zoom. These are automated emulations, not native-browser-zoom, human screen-reader or physical-phone certification.
- Cleanup closes synthetic inquiries/orders, disables temporary staff and hides synthetic pages through the regular guarded APIs. History remains available. `verify-fixtures.mjs` verifies retirement and can close only this suite's strictly named synthetic manual fixtures. No product imports, customer messages, exports, deletions, backup operations or production writes occur.

Preservation compares every pre-existing content, inquiry, order and staff row plus complete product/media/business fingerprints. Session, audit and synthetic-fixture histories are expected to change. `docs/redesign/CRAFT-C5-ACCEPTANCE.md` records the accepted run and its limits.
