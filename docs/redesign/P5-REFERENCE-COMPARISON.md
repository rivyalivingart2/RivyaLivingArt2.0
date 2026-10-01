# P5 initial old/new Studio reference comparison

The source of truth for this adaptation is the supplied old repository, especially `src/app/studio/(dashboard)/layout.tsx` and `src/styles/tokens.css`, together with the P0 reference inventory. The new application remains RivyaLivingArt2.0 with its existing session, schema, publication and inquiry contracts. This is a source-based comparison plus new local screenshots; a fresh side-by-side authenticated old/new review remains P5E.

| Reference | P5A adaptation | Evidence or boundary |
|---|---|---|
| Obsidian #080a0e | Workspace and sign-in background | Desktop/mobile/sign-in screenshots |
| Blue panel #08283a; nested #0f3247 | Task cards, editors, rows and dialogs | Shared scope only; inspect each deeper state in P5C/E |
| Mineral #f4f1e9; mist #a9b4bc | Operational body/headings and secondary labels | Current font system retained; old display density adapted for readability |
| Champagne #b89b63 | Active navigation, task attention, keyboard focus | Text and shape accompany state; no colour-only status |
| Sapphire #164e6b / #1d6389 | Actions and hover feedback | Sign-in and workspace controls |
| Link #5fafd6; control boundary #6f7680 | Links and field boundaries | Focus/contrast sample calculation is supporting evidence, not a full audit |
| 256 px sidebar / 80 px rail | Desktop expand/collapse and tablet rail | 13 existing registered destinations, accessible names remain |
| Mobile navigation / command finder | Native modal, visible close, keyboard wrap, one Escape, destination-heading focus | Existing unsaved-change guard retained |
| Dashboard organization | Real scoped task counts, due work, recent inquiries, current stages and a Content health destination | Editorial/publication task counters remain open, not fabricated |
| Login/staff identity | Current ID/password/session provider and existing role labels | No Prisma/Auth.js transplant, signup activation or credential-policy change |

P5C/D/E must compare record-level forms, board/list/detail return, pending saves, conflict recovery, unavailable states, permission changes and staff operations. The 43-row family register is a disposition list, not evidence that every family is implemented. The excluded scraper family stays excluded; conditional/unsupported legacy modules remain gated.
