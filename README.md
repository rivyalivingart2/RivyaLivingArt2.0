# RivyaLivingArt2.0

**Confirmed repository:** `rivyalivingart2/RivyaLivingArt2.0`  
**Current handoff branch:** `codex/r8-repository-handoff`

This repository currently contains the **RivyaLivingArt Revision 8 implementation
brief** and development preflight tooling, not the website application described
by the brief. The GitHub destination is verified. Application source is still
absent; adding a remote alone does not create it.

Start with [How to work in Codex](docs/CODEX_WORKFLOW.md), the
[remote/source verification](docs/R8-0_REMOTE_VERIFICATION.md), and the
[current checkpoint](PROJECT_STATE.md). The earlier
[R8-0 source audit](docs/R8-0_AUDIT.md) is retained unchanged as a dated record.

Do not silently scaffold a replacement application. The next owner decision is
whether to restore existing source or initialize the first application here.
The Codex guide contains the explicit instruction for the latter path; that
example is not an approval by itself.

## Active Revision 8 documents

- [Start here](RivyaLivingArt_READ_FIRST_v8.md)
- [Master build prompt](RivyaLivingArt_Master_Build_Prompt_v8.md)
- [Frontend-first plan](RivyaLivingArt_Frontend_First_Plan_v8.md)
- [Git checkpoint workflow](RivyaLivingArt_Git_Checkpoint_Workflow_v8.md)
- [Vercel deployment handoff](RivyaLivingArt_Vercel_Deployment_Handoff_v8.md)
- [Codex start/resume prompts](RivyaLivingArt_Codex_Start_Resume_v8.md)
- [Demo content blueprint](RivyaLivingArt_Demo_Content_Blueprint_v8.md)
- [Asset-generation prompts](RivyaLivingArt_Asset_Generation_Prompts_v8.md)
- [AGENTS addendum source](RivyaLivingArt_AGENTS_Addendum_v8.md)

## Development tooling

`tools/` contains the read-only repository/source preflight and dependency-free
Node tests. It is not an application source directory.

```sh
node --check tools/codex-preflight.mjs
node --test tools/codex-preflight.test.mjs
node tools/codex-preflight.mjs --report-only
```

Twelve preflight tests pass in the recorded environment. Application install,
typecheck, lint, build, browser tests and deployment have **not** run because
there is no application manifest/source. The preflight explicitly reports that
boundary and must not be used as a production-readiness claim.

## Build order after the source decision

Frontend and visuals first, then a protected owner-reviewed Vercel preview;
backend, staff login, custom CMS and data operations afterward. Test, document,
commit and verify the push after each coherent slice. Keep main untouched until
an authorized review/merge, and do not deploy or change a live domain implicitly.
