# Rivya Living Art

Start with [START-HERE.md](START-HERE.md) and the [documentation index](docs/README.md).
The current [owner brief](docs/netlify-free-first-2026-10-28/OWNER-BRIEF.md) and
[Phase 0–11 guide](docs/implementation/PHASE-BY-PHASE.md) govern implementation.
Older completed-work reports were removed from the working tree on 30 October
2026; their contents remain recoverable from Git history.

## Project and current state

- Public website: https://www.rivyalivingart.com/
- Studio: https://www.rivyalivingart.com/studio/login
- Hosting target: Netlify, with existing GoDaddy DNS/email preserved.
- Preferred storage: private Google Sheets and Drive; any ongoing-free database
  exception requires demonstrated necessity and narrow documented authority.
- SQL/Blob remain the active application stores until verified authorized cutover.
- Preserve the public website and current login; restore authenticated Studio from
  OLDWEBSITE. Add no products and import no archived catalogue or Sheets lists.

See [PROJECT_STATE.md](PROJECT_STATE.md) for the checkpoint and
[PRODUCT.md](PRODUCT.md) for protected product requirements. The full programme is
incomplete; source publication does not certify provider activation or migration.

## Local development

Use Node 22 within package.json's supported range and the pinned package manager.
On a fresh checkout:

```sh
npm ci
node -e "require('node:fs').mkdirSync('test-results',{recursive:true})"
npm run dev
```

Read .env.example for configuration names. Keep credentials, private registries,
exports and raw evidence outside Git. Do not attach production credentials to
fixture/QA servers. See the [working guide](docs/implementation/AI-WORKING-GUIDE.md)
for checkout/environment rules and [verification guide](docs/implementation/VERIFICATION-AND-RELEASE.md)
for lint, typecheck, unit, build, runtime and guarded browser prerequisites.

## Continue work

Use [NEXT-WORK.md](docs/implementation/NEXT-WORK.md). The next task is sustainable
retained Security history/capacity, followed by provider/bootstrap/runtime work.
The [Antigravity prompt](docs/implementation/ANTIGRAVITY-START-PROMPT.md) and shared
AGENTS.md/GEMINI.md instructions use the same guides.

Current changes stay local unless the owner provides new publication permission.
Production migration, release configuration and destructive retirement have
separate evidence and authorization requirements. Keep OLDWEBSITE and recovery
resources. Keep the Codex cloud environment unpublished.
