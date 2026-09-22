> Historical SITES-01 handoff. Current implementation: [SITES_FULL_02_CHECKPOINT.md](SITES_FULL_02_CHECKPOINT.md).

# RivyaLivingArt — Website & Studio Preview

SITES-01 · 21 September 2026 · owner review · not deployed.

## Delivered in this pass

A furniture-first dark homepage, searchable/filterable collectible collection, five reusable product details, working portrait/room-scene galleries and image enlargement, ordinary finish selection, and a seven-step synthetic commission walkthrough. Additional working views: three short journal notes, Materials & Care, Contact, and a branded fallback for unknown views. Our Story and Process are homepage anchors. Memory Art and Personal Art & Gifts have clearly marked SITES-02 introduction views. The Studio switch explains its SITES-03 status; it is not a completed CMS or a login.

The homepage follows the requested sequence: header, furniture hero, selected collectibles, category discovery, craft story, process, three journeys, explicitly fictional sample project/testimonial, journal and contact invitation/footer.

## Actual records, not targets

| Type | SITES-01 actual | Full-trial target |
|---|---:|---:|
| Large/collectible product records | 5 | 84 |
| Memory product records | 0 | 24 |
| Personal/gifting product records | 0 | 12 |
| Short journal sample drafts | 3 | 36 complete article drafts; expanded writing remains |
| FAQs | 0 | 42 |
| Visibly fictional testimonial examples | 1 | 24 |
| Enquiry/order scenario records | 0 | 40 |
| Local media files inspected and mapped | 11 | As required |

The commission brief is a browser-local form draft, not an enquiry/order record. No dashboard counts or eight-status workflow are claimed as delivered yet. One fictional sample project is shown. Provisional SITES-L-* IDs are local to this trial; the v8 demo blueprint was not supplied or audited. Display names and asset IDs follow the supplied asset index.

## Routes

| URL | Current view |
|---|---|
| `/` | Home |
| `/#selected`, `/#craft`, `/#process`, `/#journeys`, `/#journal` | Homepage sections |
| `/collectible-design` | Five-product collection |
| `/collectible-design?category=Tables` | Category filter; also Seating, Consoles, Spatial art |
| `/pieces/river-channel` | Primary large-product detail |
| `/pieces/shallow-basin`, `/pieces/narrow-span`, `/pieces/entryway-bench`, `/pieces/lattice-object` | Additional concept details |
| `/commission?piece=river-channel&finish=Satin` | Seven-step local demo; consultation intent also supported |
| `/journal?article=0` through `2` | Three short sample editorial drafts |
| `/materials-care` | Honest sample material/care notes |
| `/contact` | Exact supplied business phone, email and map |
| `/memory-art`, `/personal-art` | Explicit SITES-02 journey introductions, not complete collections |
| Unknown single-section or product path | Branded missing-view state |

Routes use the Sites-supported Vinext starter plus client history navigation. Direct URLs are handled by route wrappers; browser back uses popstate. This is not a claim of automatic production Next.js compatibility. Deeper unmatched paths may still use the runtime 404 until SITES-02.

## Components and contracts

- `components/rivya/experience.tsx`: shared Header/Footer, Art with failure/retry state, ProductCard, Collection, ProductDetail, Commission, SearchDialog, journal and supporting views.
- `lib/rivya/data.ts`: typed Product and discriminated Price contracts; five products, three short drafts, media references. Demo amounts are labelled and never imply a commercial offer. Missing prices use Price on Request, never ₹0.
- `lib/rivya/webmcp.ts`: progressive optional sample catalog read and start-sample-commission tools; no submission tool.
- `app/globals.css`: semantic theme tokens, responsive grids, focus, selection and reduced-motion rules.
- Radix/Shadcn primitives supply Dialog, Sheet, Select, Tabs, RadioGroup and Empty. Lucide supplies consistent interface icons.
- A later Studio should move page sections and the current fictional example into typed editable records and separate drafts from demo-visible state.

## Design tokens

| Token | Value |
|---|---|
| Background | #101713 |
| Surface | #19221C |
| Elevated | #232E26 |
| Primary bronze | #B79270 |
| Hover/focus | #CEAC89 |
| Main text | #F3EFE7 |
| Muted text | #B7BFB5 |
| Decorative border | #3A483E |
| Control boundary | #78867C |

Locally served fonts: Instrument Serif regular/italic, Inter 400/500/600, JetBrains Mono 400, sourced from Google Fonts. The exact-name header text is a fallback wordmark, not the original logo typography. The brand board 91707.png was inspected but not used wholesale or regenerated. A clean logo and original favicon export are pending.

Measured contrast: bronze/background 6.38:1; hover/background 8.57:1; main text/background 15.87:1; muted/surface 8.65:1; control boundary/surface 4.27:1. Bronze-filled buttons use dark text. Decorative borders do not carry control affordances alone.

## Media mapping

All copies live in `public/media` as colour-preserving WebP derivatives. Source portraits: 1122 × 1402. Source scenes: 1672 × 941. They are AI concept visualizations, not finished-project photography; the original source files remain in Drive unchanged.

| Supplied asset | Usage |
|---|---|
| PRODUCT-HERO-001 / PRODUCT-SCENE-001 | River Channel portrait/gallery; scene also homepage hero and matching journal illustration |
| PRODUCT-HERO-003 / PRODUCT-SCENE-003 | Shallow Basin portrait/gallery |
| PRODUCT-HERO-005 / PRODUCT-SCENE-005 | Narrow Span portrait/gallery; matching fictional project and editorial illustration |
| PRODUCT-HERO-009 | Entryway bench portrait |
| PRODUCT-HERO-016 | Lattice Object portrait; scale deliberately unresolved |
| PRODUCT-HERO-020 | Memory Art journey illustration only |
| PRODUCT-HERO-026 | Material concept study, craft section and material note |
| PRODUCT-HERO-029 | Personal Art & Gifts journey illustration only |

No new imagery was generated. Eleven selected assets were visually reviewed; the full 45-image inventory was not visually audited. No Drive hotlinks, video, audio, 3D model or generated replacement logo is served.

## Local behavior and backend boundary

The commission uses controlled synthetic choices and illustrative numeric dimensions. There are no customer-contact inputs and no upload controls. Values survive browser refresh under `rivya-sites-01-brief` when localStorage is available; a visible notice explains the fallback when it is unavailable. Back/Continue preserve values. Reset sample brief is deliberate. Completion reads “Demo request prepared — not submitted.” The completion screen and step position do not persist across refresh; the field values do.

No email or WhatsApp action happens automatically. Only explicit phone/email/map links can open external applications. The final application must save an enquiry before offering a manual WhatsApp handoff. Vercel, Prisma/Neon, Vercel Blob and email are not connected in this Sites trial. No database, hosted CMS, authentication provider, customer account, checkout or payment was provisioned. The production GitHub repository was not opened, changed, pushed, merged or deployed.

Studio drafts/publishing, local record cleanup, menu visibility, staff/login examples, environment status, imports/exports and enquiry scenarios are unfinished SITES-03 work. Existing samples are bundled constants in SITES-01; no removal UI is exposed yet, so there is no silent restoration behavior to imply.

## Verification and review boundary

The Sites build and TypeScript checks passed. Browser checks cover collection category/search/empty-state recovery, product navigation, gallery switch/enlargement/Escape, finish choice, commission entry, numeric error recovery and retained values. Final completion, direct reload, browser-back and responsive review results are appended below when complete. Browser extension metadata errors were observed independently of the application; no blocking app error was observed.

The layout includes phone/tablet/desktop breakpoints and reduced motion. Full responsive/keyboard and content-completeness checks remain SITES-04; this is not a production release or accessibility certification.

This runtime's Sites preview guidance states that the internal agent preview is not an owner-viewable handoff. A saved Site version does not create a live interactive URL. The Site must remain undeployed until the owner explicitly authorizes a private deployment. No domain or sharing changes are authorized.

## Next unfinished pass

Continue this same Site with SITES-02: distinct Memory Art and gifting collection/detail/stepper experiences, remaining public pages, FAQ and complete system-state inventory. Then SITES-03 builds the actual Studio demo. SITES-04 completes the content targets, responsive review, motion and media mapping. Do not restart the design, rewrite the R8 production history or add excluded features.

Final SITES-01 checks: the seven-step review completed with the exact demo-only completion message. A full page reload retained the edited 260 cm sample dimension, and the selected Gloss finish carried from the detail to the brief. Optional WebMCP validation was unavailable because the browser does not expose document.modelContext; registration is feature-detected and does not affect the visible UI. No WebMCP success is claimed. Font OFL licences are included beside the locally served font assets.
