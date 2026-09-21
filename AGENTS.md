# RivyaLivingArt repository guidance

Read `RivyaLivingArt_READ_FIRST_v8.md` and `PROJECT_STATE.md` before making
changes. Revision 8 is the active brief; use its master, frontend-first plan,
Git workflow, Vercel handoff, demo blueprint, asset prompts, and resume prompts
for the slices to which they apply.

- Use the exact brand name **RivyaLivingArt**. Prioritize large collectible
  resin furniture and spatial art; memory art and gifts are secondary.
- Work frontend first: R8-0 through R8-5 precede backend integration. Track
  `UI_READY`, `BACKEND_CONNECTED`, and `TESTED` independently.
- Preserve the audited application and its security boundaries. Never create a
  replacement app when source is absent, weaken `/studio` authentication, or
  describe fixtures and browser-local simulations as persisted operations.
- Keep the website and Studio dark with the specified forest, bronze, and ivory
  direction. Use typed deterministic fixtures before real integrations.
- Do not add Sanity, scraping, Higgsfield, continuous Drive sync, in-CMS media
  generation, customer accounts, checkout, payments, S01 MFA/passkeys, S02 PDF
  quotations, S03 enhanced finish comparison, or S04 private approvals.
- Use approved Drive/repository media first. Put genuine missing-media requests
  in `RivyaLivingArt_Asset_Generation_Prompts_v8.md`; do not regenerate the logo,
  recolour products, or commit private/large originals.
- After each coherent slice, run actual repository checks, inspect and stage only
  owned changes, update the checkpoint, commit normally, push only to a verified
  non-production branch, and verify the remote commit. Never force-push, deploy
  or merge production, change a live domain, or claim unobserved results.

More detailed rules remain in `RivyaLivingArt_AGENTS_Addendum_v8.md`; this file
integrates its operational guidance without duplicating the full master brief.

## Confirmed repository and Codex handoff — 21 September 2026

The owner has confirmed `rivyalivingart2/RivyaLivingArt2.0` as the destination.
Read `docs/CODEX_WORKFLOW.md` and `docs/R8-0_REMOTE_VERIFICATION.md`. Remote identity
is no longer unknown; absence of application source is a separate unresolved
condition. Do not copy the earlier local checkout's missing-remote diagnosis into
new reports after verifying a working origin. Never replace a different origin.

Current tooling checks (no application package manifest is required):

```sh
node --check tools/codex-preflight.mjs
node --test tools/codex-preflight.test.mjs
node tools/codex-preflight.mjs --report-only
```

The preflight is read-only, not a deployment approval or application test. Do not
initialize a framework merely to make it pass. An explicit owner decision to
initialize the first app here may narrowly supersede the source-absence guard;
record that decision once, preserve existing history and then begin frontend work.
Until source is restored or that decision arrives, complete only safe tooling and
handoff tasks, and ask one precise source/initialization question rather than
rebuilding prompt packs or repeatedly asking for the confirmed repository URL.
