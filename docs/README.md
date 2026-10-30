# Documentation index

Read [START-HERE.md](../START-HERE.md) first. Current implementation uses the
[owner brief](netlify-free-first-2026-10-28/OWNER-BRIEF.md),
[owner scope](netlify-free-first-2026-10-28/OWNER-SCOPE.md) and shared guides below.
The programme remains incomplete; historical completion claims are not acceptance.

| Need | Document |
|---|---|
| Implement each phase | [Phase 0–11 guide](implementation/PHASE-BY-PHASE.md) |
| Start the next task | [Next work](implementation/NEXT-WORK.md) |
| Work safely with any AI | [AI working guide](implementation/AI-WORKING-GUIDE.md) |
| Start in Antigravity | [Copyable prompt](implementation/ANTIGRAVITY-START-PROMPT.md) |
| Test or prepare publication | [Verification and release](implementation/VERIFICATION-AND-RELEASE.md) |
| Understand current evidence | [Current state](netlify-free-first-2026-10-28/CURRENT-STATE.md) |
| Inspect architecture and provider gates | [Architecture](netlify-free-first-2026-10-28/ARCHITECTURE.md), [provider acceptance](netlify-free-first-2026-10-28/phase1/PROVIDER-ACCEPTANCE.md) |
| Continue auth/storage work | [Security checkpoint](netlify-free-first-2026-10-28/phase2/SECURITY-WORKFLOWS-CONTINUATION.md) |
| Use recovery tools | [Local recovery](../tools/google-workspace/local-recovery.README.md), [document migration](../tools/google-workspace/source-document-migration.README.md) |
| Restore authenticated Studio | [OLDWEBSITE restoration reference](restoration/exact-legacy-2026-10-21/CONTINUE-IN-NEW-CHAT.md) |
| Inspect earlier provider contracts/runbooks | [Google foundations index](google-workspace-2026-10-24/README.md) |

## Removed historical documents

On 30 October 2026, the owner requested removal of unwanted Markdown from old
completed work. The local cleanup removes 254 obsolete/superseded reports, prompts,
phase delivery notes and design revisions. It replaces accumulated history in the
root README, PROJECT_STATE, PRODUCT and old Google index with current summaries.

The [exact removal inventory](documentation-cleanup-2026-10-30.json) records every
path, reason, previous size and SHA-256. The removed content remains in Git at
`7becabb7b6ee9d98f8786435a6e766e2ed33aaa9`. Retained Markdown links to those reports
point to that fixed revision, preserving evidence without keeping obsolete files
in the working tree. Historical paths in immutable JSON receipts remain dated
references to their original revision; those evidence files are unchanged.

To inspect or restore one specific old document when needed:

```sh
git show 7becabb7b6ee9d98f8786435a6e766e2ed33aaa9:path/to/document.md
git restore --source=7becabb7b6ee9d98f8786435a6e766e2ed33aaa9 -- path/to/document.md
```

Substitute an exact path from the inventory; inspect local changes before restoring.
Current implementation guides, unresolved acceptance/recovery references, licenses,
AI skills, OLDWEBSITE restoration material and documents used by source/tools/tests
remain. Removing reports changes no phase acceptance, application code, data,
media, credentials, deployment or provider resource. The owner subsequently
authorized publishing this cleanup to GitHub main on 30 October. Future unrelated
pushes require new owner permission.

## Cleanup verification

- Markdown inventory: 508 before; 255 after (254 removed and this index added).
- The five existing handover/operating-guide tests passed.
- All 1,198 protected application/data/media files matched their retained hashes.
- No new broken Markdown links were introduced; retained historical links use a
  fixed revision. There are 27 pre-existing missing references within bundled AI
  skills, outside the current project guides; those skills were left intact.
- Application/test/tool source and existing non-Markdown evidence are unchanged.
  The new JSON inventory contains only public repository paths, reasons and hashes.

Publication privacy check: the owner brief uses owner-held references in place
of Google account and Drive identifiers. The historical rights register is now
a public checklist; its detailed evidence remains locally outside version control.
Obtain private evidence only through authorized private access. Existing Git
history has not been rewritten.
