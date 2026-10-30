# Google Workspace foundation references

This folder contains the earlier schema, provider setup, operator runbooks and
machine-readable receipts still used by implementation and tests. Current work
starts at [START-HERE.md](../../START-HERE.md) and the
[Netlify free-first brief](../netlify-free-first-2026-10-28/OWNER-BRIEF.md).

The older 28-table plan is a schema inventory, not proof that 28 live tables were
migrated. The retained record checkpoint contained 22 actual tables; refresh real
source state before any migration. No full Phase 0–11 completion is certified.

## References still needed

- [Architecture](ARCHITECTURE.md), [service placement](SERVICE-PLACEMENT.md) and
  [schema task mapping](PHASE-PLAN.md).
- [Existing sandbox checkpoint](SANDBOX-CHECKPOINT.md) and
  [prior provider handoff](ANTIGRAVITY-HANDOFF-CHECKPOINT.md): dated evidence only.
- [Google setup](CLOUD-GOOGLE-SETUP.md), [isolated target plan](ISOLATED-TARGET-PLAN.md)
  and [local/offline runbook](LOCAL-OFFLINE-RUNBOOK.md).
- [Owner operating guide](OWNER-OPERATING-GUIDE.md), [issue register](ISSUE-REGISTER.md)
  and [cutover/recovery runbook](CUTOVER-RUNBOOK.md).

The latest [phase implementation guide](../implementation/PHASE-BY-PHASE.md) and
[next work](../implementation/NEXT-WORK.md) supersede older continuation prompts.
Completed/superseded phase reports and PR drafts were removed from the working
tree; use [the cleanup inventory](../documentation-cleanup-2026-10-30.json) and its
fixed Git revision when historical evidence is needed. Raw provider receipts and
private registries remain private; source files/fixtures never prove live migration.
