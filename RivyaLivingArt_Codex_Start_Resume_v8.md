# RivyaLivingArt — Codex Start, Resume and Checkpoint Prompts

**Revision 8 · 21 September 2026**  
**Reading order:** `RivyaLivingArt_READ_FIRST_v8.md`  
**Master:** `RivyaLivingArt_Master_Build_Prompt_v8.md`

## 1. First session — copy this prompt

Provide the full pack in the actual repository workspace, preferably an indexed location such as `docs/briefs/rivya-v8/` if consistent with the repo. The supplied logo board is included at `reference/91707.png`; use existing clean approved logo assets where present. Do not replace root project guidance with this document.

```text
Work inside my actual RivyaLivingArt source repository. Use the complete Revision 8
pack supplied with this task; start by reading RivyaLivingArt_READ_FIRST_v8.md and
the active master, frontend plan, Git workflow and Vercel handoff. Read relevant
demo/asset sections as you implement them. Do not treat earlier phase order as active.

PRIMARY EXECUTION ORDER
Audit briefly and accurately first. Build the public website frontend/visuals,
then Studio frontend/visuals, then give me a ready-to-deploy protected Vercel
Preview checkpoint so I can see the design. After my visual review or explicit
continue instruction, work on the real backend and integrations. Preserve working
existing backend code; do not redesign the app or start a new template.

Start R8-0 now: inspect effective AGENTS.md, CLAUDE.md, active design/README,
latest checkpoint, real source, lockfile/scripts, routes, component exports,
schema/auth/service boundaries, logo and accessible media. Verify the actual Git
remote, work branch and deployment triggers. Report the audit before substantive
edits. When its safety/compatibility checks are clear, begin the smallest R8-1
visual slice in the same session if feasible. Otherwise record the exact blocker
and next frontend task. Do not begin database migrations or backend provisioning.

CONFIRMED SCOPE
Brand is RivyaLivingArt. Large collectible resin furniture and spatial/3D art are
primary; memory/celebration pieces and smaller art/gifts are secondary. Keep three
distinct cards/detail/customization journeys within one shared design system.
Our own custom CMS belongs in /studio on the audited Next.js/TypeScript,
Tailwind/shadcn, Prisma/Neon, Tiptap, Vercel Blob and existing staff-auth foundation.
No Sanity integration, product scraper, Higgsfield, customer accounts, checkout,
payment gateway, continuous Drive sync or in-CMS generation provider.

All four rejected additions remain EXCLUDED: S01 added staff MFA/passkeys;
S02 specification/quotation PDF builder; S03 enhanced material/finish comparison;
S04 account-free private client design approval. Do not implement or re-propose
them. Normal password security, ordinary finish choices, uploaded specification
files, staff-only CMS preview and WhatsApp discussions remain in scope.

FRONTEND FIRST, WITHOUT FAKE BACKEND CLAIMS
Use the actual reusable application components with typed deterministic fixture
adapters, not a disconnected demo app. Build in fixture mode without production
DB/auth/Blob/mail secrets. Keep real protected routes/actions secure. Use the
separate non-production visual harness for Studio where necessary; no mock-admin
auth bypass or default password. Preview login screens must not collect real
credentials. Label local edits/removals/submissions as simulations. No actual
emails, WhatsApp messages, public reviews or customer writes from demo data.
Show real pending/error/empty states, not invented successful provider operations.

Create the source fixture pack for the early visuals: 120 products (84 large,
24 memory, 12 personal), 36 complete blog drafts, 42 FAQs, 24 fictional testimonial
examples and 40 order/enquiry scenarios covering every actual status, plus all
in-scope Studio views. Reuse these stable fixture IDs/content for real database
seeding and manual Studio removal later. Full article bodies are required; briefs
alone are not finished content. Keep all demo/live separation and cleanup rules.

Use the supplied logo's dark forest/bronze/ivory direction. Preserve the master
palette, responsive typography and original Awwwards-calibre art direction without
promising an award. Build a refined furniture website and a precise, efficient
Studio. Reuse compatible free tools only where the confirmed scope needs them.
Use known approved Drive media first. Missing image/video outputs go into the
separate asset-prompts MD; I will generate and return them through Drive. Use
licensed/original icons and real SVGs. Do not regenerate my logo or recolour products.

SAVE TO GIT AFTER EACH COMPLETED SLICE
After each coherent feature/component slice: run its actual required checks,
review the diff, update canonical Markdown/checkpoint, stage only your reviewed
owned changes, commit and push to the verified safe non-production work branch.
Verify the remote contains the actual commit. Report branch/SHA/tests and push
result after each slice; do not wait until the whole project is finished.

Preserve unrelated work and repository/PR conventions. No force push, production
merge/push, branch deletion, secret commits or unapproved deployment changes.
Verify existing Vercel/CI auto-deploy behavior before the first push. If direct
push is unavailable, use the supported authorized publishing path or report the
exact push blocker. A local commit or patch is not a verified remote push.

VERCEL HANDOFFS
At R8-5, after visual checks/build and verified push, tell me:
"Frontend visual preview is ready. Please deploy this verified branch/commit as
a protected Vercel Preview to review the website and Studio. Backend integration
is not complete."
Give exact audited root/build/runtime/settings, stage/environment instructions,
review routes, screenshots and simulated features. Confirm Preview protection;
never place the visual build on the live business domain. If an authorized Git
integration already produced a Preview, report its actual URL/status instead of
inventing one or asking for an unnecessary duplicate deployment.
Pause substantial backend work for my visual review or explicit continuation.

Then complete R8-6 through R8-11: real staff login/permissions/recovery/sessions,
SQL and public/private media, our CMS/drafts/versions/publication, product queries,
saved enquiries before WhatsApp, imports and persistent demo seed/manual cleanup.
Keep the reviewed frontend; replace adapters and test actual services.

At R8-11, after full integration, testing and deployment prerequisites, tell me
the complete build is ready for my Vercel deployment. Provide verified SHA,
configuration names, migration/backup plan and post-deployment checks. If real
content or production setup is missing, report integrated-preview readiness and
the specific public-launch blockers instead. Do not deploy/promote production
or change the live domain without my explicit instruction.

DELIVERY DISCIPLINE
Keep the existing Markdown hierarchy; import this pack into an indexed suitable
docs location, and merge the small AGENTS addendum without overwriting existing
instructions. Track UI_READY separately from BACKEND_CONNECTED and TESTED. Use
R8 phase IDs and preserve old dated history. End every slice with actual changes,
checks, commit/push evidence, readiness/blockers and one exact resume instruction.
Never claim a source audit, database seed, image import, test pass, Git push or
deployment that did not actually happen.
```

## 2. Continue a frontend slice before V1

```text
Continue RivyaLivingArt Revision 8, frontend-first. Read the latest checkpoint,
effective instructions, relevant master sections and Frontend First Plan.
Inspect status, current branch, prior pushed commit and actual owned files.

Continue only the next coherent R8-1–5 slice. Build real reusable website/Studio
components with typed fixtures, honest local simulations and verified preview
isolation. Do not start new DB/auth/storage integration or change production.
Preserve prior UI work and source fixture IDs. Resolve assets from approved Drive
files; issue only the next needed owner-generation prompts in the separate MD.

Run checks and real visual review, update docs, commit only reviewed owned changes,
push to the verified safe work branch and confirm the remote commit. Report actual
SHA/push/tests, visual versus backend state and next task. If R8-5/V1 is complete,
produce the protected Vercel Preview handoff and pause for owner review/continuation.
```

## 3. Apply visual review feedback

```text
Apply the owner's specific visual review notes to the existing RivyaLivingArt
frontend. Read the actual notes, reviewed branch/SHA, screenshots/URL where supplied,
current components and tokens. Do not invent feedback or reopen the excluded features.

Fix one coherent visual issue group at a time, preserve unaffected screens and
show new actual screenshots/check results. Do not add backend features merely to
change layout. Commit/push each completed tested slice and verify the remote SHA.
Update the V1 route/review checklist and report whether visuals are ready for the
owner's next review. Do not claim a fresh deployment unless it actually exists.
```

## 4. Start backend only after the visual gate

```text
The owner has reviewed the frontend or explicitly instructed continuation.
Read and record that actual instruction; do not assume this template proves review.
Continue RivyaLivingArt R8-6 onward from the latest verified frontend commit.

Keep the reviewed UI components, contracts, routes and fixture IDs. Audit existing
services, then connect real database/media/auth/CMS behavior in the R8 plan order.
Use additive migrations and isolated integration resources. Replace simulated
operations behind interfaces; track UI_READY / BACKEND_CONNECTED / TESTED per action.
Real /studio permissions, private files, draft/publication and demo/live boundaries
are mandatory. No production credentials in code or default seeded logins.

Preserve normal WhatsApp-only enquiries and all exclusions. Run actual checks,
update docs, commit/push each completed coherent slice and verify its remote SHA.
Do not declare the backend complete while any essential action is still simulated.
```

## 5. Source fixture / persistent demo slice

```text
Use the Revision 8 demo blueprint and master Section 18/23. Determine the current
stage first. Before V1, author complete versioned source fixtures and useful labelled
browser-local preview behavior without database writes. After the backend gate,
reuse exactly those IDs/content through authorized deterministic seed/cleanup services.

Targets: 120 products (84/24/12), 36 complete articles, 42 FAQ answers, 24 fictional
review examples, 40 scenarios plus any extra actual statuses, and all in-scope modules.
Do not count outlines as articles or source records as inserted SQL rows. Preserve
retained/edited data and manual removals. No fake customer identities/revenue, real
messages, public demo reviews, credentials, live-data deletion or shared-media loss.

Run the correct stage's tests, report actual authored/inserted/skipped/removed counts,
update the fixture manifest/checkpoint, commit/push the completed slice and verify it.
```

## 6. Missing-media / returned-Drive slice

```text
Read the Revision 8 asset-prompts MD and actual source/slot manifest. Use approved
accessible existing media first. Do not assume this environment shares ChatGPT Drive
access. Inspect returned actual files before approving product/section matches.

For genuine missing image/video slots, give the owner precise prioritized prompts
with ID, filename, placement, ratio, reference and fallback. The owner generates and
returns Drive files. Do not add generation accounts, Higgsfield, scraping or live sync.
Use reviewed modest-size local media for early visuals, then map eligible assets to
the real Blob library later. No large/private originals in Git. Original/licensed
icons and real SVG are allowed within the existing system; no replacement logo.

Record actual inputs/outputs and unresolved requests; prepared prompts are not assets.
Run relevant checks and commit/push the completed source/manifest slice safely.
```

## 7. End a slice with Git evidence

```text
Finish the current coherent RivyaLivingArt slice using the Git workflow companion.
Do not bundle unrelated owner work. Run required checks, inspect the exact diff for
secrets/private files, update the phase/checkpoint, stage explicit reviewed paths,
commit and push through the authorized safe non-production branch mechanism.

Verify the remote ref contains the actual commit and report SHA, branch, tests,
push status and observed CI/preview status separately. No force push, production
merge or deployment. If a push fails, preserve the commit and report the precise
permission/network/conflict blocker; do not claim the work is remotely saved.
```

## 8. Prepare V1 visual deployment handoff

```text
Audit the V1 checklist in the Revision 8 Vercel Handoff document against actual
source/build/tests/screenshots/remote SHA. Verify fixture-mode rendering does not
need backend secrets, /studio auth is not bypassed, visual routes fail closed in live
mode, and real messages/uploads/writes are absent. List any missing assets honestly.

Write exact target root/build/runtime/Preview settings and protection prerequisites.
Commit/push the reviewed candidate and verify it. Tell the owner to deploy the exact
commit as a protected Vercel Preview for website/Studio visual review, explicitly
stating that backend integration is incomplete. A production-target visual deployment
is not allowed. If an already authorized auto-preview exists, use its observed URL.
Pause for review or explicit continuation; do not implement new backend modules now.
```

## 9. Prepare V2 full deployment handoff

```text
Audit the V2 checklist against the actual integrated candidate, not the frontend mock.
Verify real auth, CMS, products, media, enquiry handling, demo seed/manual cleanup,
imports, stage isolation and quality checks. Verify resource separation, migration,
backup/restore, configuration names, safe Git target and factual live-content status.

Fix blockers in tested pushed slices. When ready, commit/push the final candidate,
verify the remote SHA and tell the owner precisely how to deploy on Vercel. Do not
run a production deploy, merge/promote production or change the live domain. If only
integrated preview is ready, state the exact public-launch blockers instead.
After an actual owner deployment, verify the real URL/SHA and smoke-test outcomes
before claiming DEPLOYED/VERIFIED. Never fabricate a preview link or test result.
```

## 10. Interrupted session or failed push

```text
Recover the current RivyaLivingArt Revision 8 work without resetting the repository.
Read the latest checkpoint, effective instructions, git status/diff/history and remote
state. Preserve unrelated work. Confirm whether the last slice was edited, committed,
pushed, CI-checked or actually deployed; those are different states.

Resume a pending push of the existing verified commit when safe; do not recreate the
change or overwrite divergent history. Check fixture tombstones, real migration/job
cursors, draft/public pointers and media manifests before retrying operations. Before
V1, stay frontend-first; after owner continuation, follow the recorded backend phase.

Bring the smallest partial slice to a tested state, update docs, commit/push when
appropriate and report real evidence. Keep S01–S04 and excluded integrations excluded.
A closed session is not permission to reseed, delete data, redo assets or promote live.
```

## 11. Stage and phase reference

R8-0 audit → R8-1 foundation → R8-2 furniture site → R8-3 remaining website/forms → R8-4 Studio frontend → **R8-5 V1 visual review** → R8-6 backend/auth/storage → R8-7 custom CMS → R8-8 catalogue/enquiries/operations → R8-9 persistent demos/imports → R8-10 full QA → **R8-11 V2 owner deployment**.

Every completed coherent slice is tested, documented, committed, pushed and remotely verified subject to actual permissions. Ordinary safe pushes need no new feature approval. Production actions still require the owner's specific authorization. The four rejected additions remain excluded, not deferred suggestions.
