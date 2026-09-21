# RivyaLivingArt — Start Here: Final Codex Pack

**Revision 8 · 21 September 2026**  
**Build order:** Frontend first → owner visual review → backend → owner full deployment.  
**Source control:** Test, document, commit and verify push after each completed coherent slice.

## 1. What to give Codex

Give Codex the **whole Revision 8 folder** in the actual application repository workspace, plus access to that repository and its approved Git publishing mechanism. All nine Markdown files below work together. The pack includes the already supplied logo board at `reference/91707.png`; it is a reference, not a production SVG/master.

| File | Use |
|---|---|
| [This start-here guide](RivyaLivingArt_READ_FIRST_v8.md) | Reading order, scope and owner setup |
| [Master build prompt](RivyaLivingArt_Master_Build_Prompt_v8.md) | Full retained product/site/custom-CMS/Studio spec, 52 component specifications and new stage rules |
| [Codex start/resume prompts](RivyaLivingArt_Codex_Start_Resume_v8.md) | First-session prompt plus focused continuation, feedback, backend, media, Git and deployment prompts |
| [Frontend-first plan](RivyaLivingArt_Frontend_First_Plan_v8.md) | Twelve R8 phases, early visible results, separate UI/backend milestones and history crosswalk |
| [Git checkpoint workflow](RivyaLivingArt_Git_Checkpoint_Workflow_v8.md) | Safe scoped commits/pushes, remote verification and blocked-push handling |
| [Vercel deployment handoff](RivyaLivingArt_Vercel_Deployment_Handoff_v8.md) | Protected V1 visual-preview checklist and V2 full-release owner instructions |
| [Demo content blueprint](RivyaLivingArt_Demo_Content_Blueprint_v8.md) | 120 concept entries, 36 article briefs, 42 sample FAQs, 24 fictional quotes and 40 order scenarios; completion/seeding/cleanup requirements |
| [Separate asset-generation prompts](RivyaLivingArt_Asset_Generation_Prompts_v8.md) | 24 image, 5 video and 4 SVG templates, existing Drive intake and owner generation/return workflow |
| [AGENTS addendum](RivyaLivingArt_AGENTS_Addendum_v8.md) | Compact rules to merge into existing guidance, not a replacement AGENTS.md |

A suggested location is `docs/briefs/rivya-v8/`, provided it fits the actual repository's documentation rules. Do not rename/move historical files or blindly replace root README/CLAUDE/AGENTS files. Codex should index the imported pack in the existing docs map, merge the addendum and update actual paths. Keep one active Revision 8 instruction source; old packs remain history, not simultaneous competing plans.

## 2. Starting in Codex

Select/open the actual source repository and intended existing workspace. Make this pack's files visible there. Paste **Section 1 of the Codex Start/Resume document**. Let Codex inspect the remote, work branch and existing production/deployment connection before its first push.

Do not paste API keys, real passwords or connection strings into the task prompt. The frontend should render without new database/auth/Blob/mail secrets. If the source repository or push target is genuinely unknown, supply that exact information once. Two historical README files name different repositories; neither is automatically the active destination. Codex must use the verified selected checkout, not create or switch repositories by guessing.

The first session should perform a focused R8-0 audit and report it before substantive changes. If source and safety checks permit, it should proceed to the smallest R8-1 visual slice in the same session. It must not spend the initial build on schema redesign or backend setup. When source/permissions are missing, report the specific blocker rather than inventing a new application or a successful push.

OpenAI's documentation describes `AGENTS.md` instruction discovery and environment-specific tools/permissions. Accordingly, this pack includes a small merge-ready addendum and explicitly referenced detailed files; do not assume a huge attached master is automatically loaded in full. Sources: [AGENTS.md](https://developers.openai.com/codex/guides/agents-md), [Codex cloud environments](https://developers.openai.com/codex/cloud/environments).

## 3. What you will see first

R8-1 produces the dark branded foundation, header/mobile navigation and hero direction. R8-2 completes the primary furniture experience; R8-3 completes remaining public pages and form states; R8-4 builds Studio screens and login visuals. All use real reusable components with safe clearly labelled fixtures.

At **R8-5 / V1**, Codex must give you the verified Git branch/commit, actual checks/screenshots and exact settings to deploy a **protected Vercel Preview**. It must say backend integration is incomplete. Review the frontend there, or explicitly authorize proceeding using local visual evidence when online preview is blocked.

Only then does R8-6 onward connect real staff authentication, database, media, custom CMS, enquiries, imports and durable demo cleanup. The reviewed frontend stays; the data/operation adapters change behind it.

At **R8-11 / V2**, Codex must tell you when the full build is ready for your Vercel deployment, with actual backend test evidence, production prerequisites, configuration names, migration/backup steps and the release SHA. Missing real content/configuration is a launch blocker, not permission to publish fictional demo reviews.

Vercel's configured Git integration may automatically deploy branch pushes. A non-production branch should be used only after checking its actual deployment tracking and protection. The Vercel companion explains both new/manual previews and already authorized auto-previews. No automatic production promotion/merge is authorized. Source: [Vercel Git integration](https://vercel.com/docs/git).

## 4. Confirmed scope that stays intact

Brand: **RivyaLivingArt**. Custom **RivyaLivingArt Studio CMS** using the audited existing Next.js/TypeScript/Tailwind/shadcn/Prisma/Neon/Tiptap/Blob/staff-auth foundation. Large collectible furniture/spatial art primary; memory and smaller art secondary. Entire website and Studio dark, based on the supplied bronze/forest/ivory logo direction. Real enquiries saved before WhatsApp; no customer accounts, checkout or payment gateway.

Demo target: **120 products (84 large / 24 memory / 12 personal), 36 complete blog drafts, 42 FAQs, 24 fictional testimonial examples and 40 scenarios plus examples for additional actual order statuses**. First make source fixtures for visuals; later persist them and implement real manual removal. Do not claim the Markdown blueprint contains finished 36 full article bodies or already seeded database rows: those are required implementation/content-writing outputs.

Assets: reuse approved accessible Drive media; give missing image/video prompts in the separate MD for owner generation and return. The pack does not generate or import media. Keep source rights and real-versus-concept labels; no live Drive or generator dependency.

The 52 component specifications and 12 CMS capabilities remain. Dependencies must be compatible and free for the intended use; no arbitrary new platform. Award-level quality is an aspiration, never a promised award. Hosting usage/plan eligibility remains separately verified.

## 5. Exclusions — do not reopen

No Sanity integration, product scraper, Higgsfield, continuous Drive sync or in-CMS generation provider. S01 added staff MFA/passkeys, S02 specification/quotation PDF builder, S03 enhanced material/finish comparison and S04 private client design approval remain **EXCLUDED**, not awaiting approval. No optional-improvements document is included.

Preserve normal password/session security, ordinary material choices, uploaded specification downloads, staff-only CMS draft review and manual WhatsApp discussion. A protected Studio visual harness for the owner's build review is not a customer approval portal and must never bypass real auth in live mode.

## 6. What changed from Revision 7

Only delivery order and working discipline changed: frontend first; a safe fixture-only visual stage; per-slice tested Git push verification; a V1 visual deployment handoff; then backend and a V2 full handoff. Related phase references and companions were aligned. Earlier backend-first phase ordering is superseded, but old historical records must not be edited to pretend they always used R8 numbering.

Existing content catalogues, prompt templates, final backend safeguards, brand, contact details and rejected-feature decisions are preserved. Source summaries from Drive and earlier reference research remain attributed historical evidence, not a new asset/repository audit. The supplied branding board is copied unchanged into the pack.

## 7. Status of this delivery

These are **finalized instruction documents**, not the website source or proof of deployment. This document preparation did not edit application code, seed a database, inspect/push the current Git repository, change Vercel configuration, import Drive media or generate new visuals. Codex must perform and report those later actions honestly under the scope and permission boundaries above.

Start with the Codex first-session prompt. Keep this pack available in the workspace for every later session; use its resume prompts and the latest actual checkpoint rather than restarting from memory.
