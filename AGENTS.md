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
