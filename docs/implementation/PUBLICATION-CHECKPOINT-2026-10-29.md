# Source publication checkpoint — 29 October 2026

The owner explicitly authorized publishing all accumulated local source and a
complete phase/AI implementation guide to GitHub main, plus an Antigravity prompt.
This checkpoint records publication preparation; verify the actual PR/merge through
GitHub before claiming main has changed. It is not production cutover acceptance.

## Candidate and scope

- Previous implementation HEAD: `98a836964609bed10347f624a37788bc58d6997c`.
- Refreshed pre-publication main: `35f99fd9b5fd1b76333d92b4ddf3b90289c99b2a`.
- Main is an ancestor of ten accumulated implementation/audit/migration commits.
  Both original migration commits, including PR #71's `7b390d5`, are preserved.
- This continuation adds shared Phase 0–11 instructions, exact next work, verification/
  release guidance and a copyable Google Antigravity prompt. AGENTS.md/GEMINI.md
  are concise entry points; prior AGENTS contents are preserved in the history archive.
- Two test-only repairs remove scheduling races: the privacy-IO test enters its
  intended phase before advancing controlled time and verifies the abort signal;
  the throttle test advances monotonic time across both reads instead of relying
  on a worker sleeping exactly 70 ms. Production timeout behavior is unchanged;
  both tests retain their no-write assertions and precise phase coverage.
- Other existing worktrees were clean and left at their current revisions.

## Verification

Publication verification results were recorded before the candidate was committed.
The latest application source is the prior HEAD plus the two test-only timing
repairs; the remaining new changes are documentation and active instructions.

The initial supported Node 22 Windows suite passed 976 of 978 cases. Two failures
were filesystem cleanup/symlink permission cases. The local Windows build failed
when Turbopack could not connect to its PostCSS child process, including with normal
host permissions. No application workaround or removed assertion conceals those
environment limitations.

Initial Linux source-only verification lacked Git/index setup, then a fresh run
revealed the missing ignored test-results parent required by private recovery
tools. With those prerequisites supplied, two real-time test races were observed
across subsequent runs and repaired as described above. These exploratory runs
are not counted as green.

**Final isolated Linux `npm run check` passed** on Node 22.23.2 (container-bundled
npm 10.9.8; the repository's npm 10.9.2 deployment pin remains unchanged):

- ESLint: zero errors, 62 existing warnings.
- Route generation and whole-project TypeScript: passed.
- Unit/contract suite: 977 passed, zero failed, one existing Windows-only DPAPI
  skip out of 978 tests. That DPAPI case passed in the Windows run above.
- Preflight: 12 passed, zero failed.
- Production Next.js build: passed.
- Built HTTP access/publication suite: 663 passed, zero failed.

Both repaired cases also passed their focused Node 22 Windows checks. The full
Linux run used a separate Git checkout, locked dependencies, an existing ignored
test-results parent and synthetic fixtures. It had no production credentials or
private source checkpoint. No assertions were removed or relaxed. The ignored
full log is `test-results/main-publication-linux/check-verified.log`.

The cumulative pre-publication privacy review scanned 239 outgoing historical
blobs and 171 candidate paths: zero matches against seven retained private values
or the selected private-key/token/credential-URL patterns; no forbidden private
paths. This is a bounded scan, not a universal privacy guarantee. All 1,198 protected
files matched the retained baseline. The final guide scan resolved 511 local
links across 40 Markdown files, with zero broken local paths. The historical
AGENTS archive matches the prior committed content after line-ending normalization.

No new real-provider mutation, browser/physical-device acceptance or actual
Antigravity execution is claimed by the local publication checks.

## External state and remaining work

Read-only Netlify verification found the published deployment ready and locked at
`7b390d558b9a48d5ec7ccedb8bab104f6b1411f9`, tracking
`codex/netlify-hosting-migration`, at https://www.rivyalivingart.com/.
No branch/lock/DNS/credential configuration was changed. GitHub main reported no
branch protection or repository rulesets; no protection was bypassed or changed.
PR #71 had no submitted reviews or inline review threads at inspection.

| Dimension | Status in this publication |
|---|---|
| Implementation | Accumulated code plus shared guides and one deterministic test repair |
| Local verification | Exact results above; simulations remain labelled |
| Real-provider verification | Netlify/GitHub readback only; five Google acceptance checks still pending |
| Preview/browser verification | No new real browser or isolated provider preview acceptance |
| Migration | Prior protected local evidence retained; no new Google/media migration |
| Cutover | No application authority switch; SQL/Blob remain active |
| Production release | No Netlify production promotion/configuration change |
| Retirement | No provider resource removed; OLDWEBSITE retained |
| Backups | Prior protected checkpoint/restore evidence retained; full media/schema/off-device gates remain |

Continue with [NEXT-WORK.md](NEXT-WORK.md) and the [phase guide](PHASE-BY-PHASE.md).
Sustainable retained Security history, real credentials/bootstrap/acceptance,
runtime integration and the later Studio/catalogue/recovery phases remain open.
Future source publication requires the owner's new permission.
