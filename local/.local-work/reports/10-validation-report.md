# Validation report

Updated: 2026-09-30

## Completed checks

| Check | Result | Evidence |
|---|---|---|
| Transformation script syntax | PASS | Python bytecode compilation completed |
| Product-price type failure reproduction | PASS (failure reproduced) | Minimal TS compile produced TS2345 for optional value -> required parameter |
| Fixed price signature reproduction | PASS | Minimal TS compile accepted `ShopProduct['price']`/optional input |
| Product-card transformation fixture | PASS | Expected type/signature present |
| Unapproved content removal fixture | PASS | Six routes removed; DB037-039 removed; count returns to 36 articles / 48 documents |
| Fake CSV/media UI removal fixture | PASS | State, modal and unused CSS absent |
| Order-only WhatsApp restoration fixture | PASS | Direct `wa.me` block removed; customization CTA retained |
| Fabricated analytics removal fixture | PASS | Analytics nav/icon/route/function removed |
| Dirty-tree safety guard | PASS | Script refuses altered checkout |

## Checks not run — BLOCKED, not failed

The hosted environment lacks a writable materializable full repository checkout and direct GitHub clone/archive access. Therefore the following remain required on an actual isolated checkout:

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm run test:preflight
npm run build
# then isolated runtime / E2E commands from package.json and tools/release-qa
```

After a green build, run the seven required widths:
`1920×1080`, `1440×900`, `1200×900`, `992×900`, `768×1024`, `512×915`, `320×740`.

Verify public templates, form validation/error/fallback states, receipt/manual-copy handoff, Studio login and authenticated representative views using isolated QA resources only. Do not submit a real order or send a WhatsApp message.

## Current production evidence
The custom domain remains on the older READY deployment sourced from commit `9797bc0c73375bb7359b950f99eacb5b0e2da4fc`. Current Git head remains unreleased and its latest Vercel production attempt is classified `lint_or_type_error`.
