> **Publication authorization update — 22 September 2026:** The owner subsequently
> instructed publishing this prepared update to the public GitHub repository, resolving
> the earlier public-disclosure blocker for this scoped source and included assets.
> The historical blocker notes below describe the prior checkpoint. See
> `../decisions/2026-09-22-approved-code-publication.md`. Branch publication is pending
> verification at this authoring commit; main, saved/live Site versions and audience
> are not changed by this GitHub task.

# Actual source and import handoff

Native source: `experiments/sites/rivyalivingart-studio-preview/`, exported directly from Sites Git commit `d3337a2eac823ff50d4426b7d11c9e9a1a66916d`, saved Version 5. This is real source with its package/lock/configuration, not a rendered scrape or bundle. Baseline Version 1 remains in commit history and in the delivery archive. The current public URL has not been deployed to Version 5.

Actual compatible Next.js port: existing `src/app` routes, `src/components/rivya`, existing custom CMS components and existing `src/lib` contracts. Root Next 16.3.5 / React 19.3.0 and npm lockfile retained; six specific UI packages and two bounded local-import dependencies added using actual package resolution. Native Vinext/Cloudflare package/configuration stays isolated under experiments. `tools/scope-sites-css.mjs` reproduces the scoped CSS from that snapshot. See route-component-map.md and status.md.

Safe branch: `codex/sites-approved-design`, based on latest verified development SHA `29250ee0b8d011835a3053510f7d4ea7ca58cf1e`. Read-only remote verification on 22 September still reports that SHA for both the base development branch and the new integration branch. Main remains `8b8c81f5d85bf0a78d165184b3d8e460073452e4`.

GitHub push was rejected by automatic approval review: the destination repository is public and the owner-private source/media payload lacks explicit public-disclosure permission. No alternate push was attempted. No PR is created and no remote integration SHA is claimed. The delivery package includes a real binary Git patch against the verified development base, a native source archive and commit manifest so another authorized Codex session can inspect/apply the prepared work without reconstructing the design.

Import on an isolated worktree based on the current verified development head; inspect newer work first and resolve any differences instead of resetting. Review the patch and source/asset permissions before applying. Use Node 22 and the actual npm lockfile. Keep all tests and final QA commands intact and deferred under the existing policy. Do not enable production fixtures, change secrets/domains, deploy, merge main or bypass a rejected publication. After explicit public disclosure approval, push only the scoped development branch using the authorized workflow, verify its remote SHA, and create a draft PR only if publication is authorized.

SITES-FULL-03 adds actual browser-local CSV/XLSX parsing, confirmed batches and exports, draft continuity, protected removal planning and lazy route boundaries. See non-image-development.md. It introduces no database writes, auth, media uploads or external messaging. The owner is generating remaining images and will provide a new Drive link later.
