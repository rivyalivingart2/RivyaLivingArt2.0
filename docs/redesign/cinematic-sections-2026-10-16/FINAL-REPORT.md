# Cinematic sections — final local implementation report

16 October 2026 · Branch `codex/cinematic-sections` · Based on main `ffd863928744df0ae2cf985f6504421842a074db`.

**The requested redesign is implemented locally. No push, deployment, publication, migration, Drive upload or production record change was performed.** Preview: http://127.0.0.1:4199/. The layout specimen and screenshot gallery run separately at http://127.0.0.1:4185/review.

Scope: the complete homepage composition, its optional saved section variants, shared material-film presentation, and the shared Studio workspace/overview surfaces. This does not claim a new redesign of every public detail page or a new release of the entire project.

## Part 1 — Section-by-section implementation

“Yes” means the composition fills a viewport at the reviewed sizes, using a safe minimum rather than a clipping fixed height. “Partial” means a viewport minimum or immersive panels with natural growth. “No” means deliberately natural content height. No section uses a fixed viewport height to conceal overflow.

| Page / Section | Previous Design | New Design | Fullscreen Applied? | Gradient Treatment | Animation | Status |
|---|---|---|---|---|---|---|
| Homepage hero | Still-image composition; separate lower details | Approved resin film across the viewport; existing title, actions and detail retained; mobile details in normal flow | Partial — 100svh; 904px at 390×844 and 979px at 320×844 | Directional text shade and charcoal lower fade | Desktop media parallax, heading/action entrances, controlled film | Completed; actual local page |
| Manifesto | Abrupt contrasting surface in supplied reference | Quiet typographic transition; statement and compact strip remain distinct | Yes for statement; No for compact strip | Shared charcoal edge with restrained navy/gold light | Static reading surface | Completed; actual page and strip specimen |
| Selected pieces | Separate catalogue block | Larger editorial rhythm and aligned product gallery | Partial — section may grow; product grid remains natural | Shared dark canvas | Existing product interaction retained | Completed |
| Architects / large-format | Flat text columns | Numbered, spaced editorial principles | Partial — grows with text | Soft inner lighting, matching dark edges | Heading reveal on eligible desktop | Completed |
| Material dialogue | Bounded image beside solid navy panel | Full-bleed saved image; copy aligned over a shaded reading area | Yes; safe 100svh minimum | Directional transparent shade, top/bottom fades | Subtle desktop image parallax | Completed |
| Resin in Motion | Heading above a contained player | Full-viewport film, overlay title, visible description and stationary controls | Yes; safe 100svh minimum | Transparent side shade and charcoal edge fade | Scroll parallax, autoplay eligibility, manual pause, expanded native player | Completed |
| Find your language / collections | Staggered thumbnails and flat empty tiles | Tall image doors, integrated category labels/counts, deliberate monogram fallback | Partial — natural gallery height; single column on narrow mobile | Dark lower image gradients | Restrained hover scale on eligible pointer devices | Completed |
| Worlds of Rivya | Image cards with separate copy | Three immersive image panels with integrated text and actions | Partial — 76svh panels on desktop, 85svh on mobile; text grows | Shaded text fields and fading lower edges | Existing card interaction; no extra moving background | Completed |
| Atelier / maker | Boxed image and separate copy column | Full-bleed material image with original editorial text and caption | Partial — 100svh minimum; 853px at 390×844 | Transparent directional overlay and shared edges | Desktop image parallax | Completed |
| Portfolio | Offset image-and-copy articles | Immersive image articles, readable title/description, conspicuous concept and image disclosures | Partial — natural section, 80/85svh card minimums | Top disclosure backing and shaded lower text | Calm reading surface | Completed in static conditional specimens; publication unchanged |
| Testimonials | Oversized undifferentiated quote columns | Balanced quotation scale, attribution, original fictional-sample disclosure and optional contained image | Partial — desktop minimum; natural mobile height | Shared canvas; no busy image behind long quotes | Calm reading surface | Completed in static conditional specimens; publication unchanged |
| Commission / choose your starting point | Broad solid blue block and stretched button | Centred editorial invitation and comfortably sized single action | Yes; grows if needed | Soft sapphire centre fading to charcoal | Heading reveal | Completed |
| Process | Flat numbered steps | Stronger numerals and responsive spacing; original sequence/actions intact | Partial — natural steps within a viewport composition | Shared dark canvas | Heading reveal | Completed |
| Why Rivya / principles | Plain text columns | Numbered editorial layout with improved hierarchy | Partial — grows to 1394px at 390px for readable copy | Restrained navy/gold lighting | Heading reveal | Completed |
| Journal | Standard card grid | Refined heading rhythm, natural reading cards and original article destinations | Partial — natural mobile grid | Shared canvas | Heading reveal | Completed in static conditional specimens; publication unchanged |
| Closing invitation | Abrupt ivory block | Centred dark invitation with original wording/action | Yes; safe viewport minimum | Sapphire/gold light contained between charcoal edges | Heading reveal | Completed |
| Furniture, rooms, workshop and printing variants | Existing supporting layouts | Consistent spacing, type and canvas; contained imagery retained when it supports reading | No for galleries; Partial for supporting editorial bands | Shared edges | No unnecessary motion | Completed in conditional specimens; no invented offering or publication |
| Contents/navigation | Compact navigation | Existing working controls retained | No | Dark transition; existing logo/palette | Existing menu interaction | Preserved and checked |
| Footer | Visible navy boundary and border | Charcoal-to-navy continuation scoped to homepage | No | Gradual fade into original Studio navy | None | Completed |
| Studio overview and shared shell | More separated panel surfaces | Coherent charcoal/navy atmosphere, quieter sidebar and responsive heading spacing | Partial — shell minimum only | Shared static surface gradient | No cinematic effects in operational work | Completed |
| Studio editing, operational and admin workspaces | Existing working forms, queues and tools | Shared surface/spacing refinement across 37 workspace openings | No for forms, tables, queues and drawers | Quiet static surfaces | Existing functional feedback preserved | Completed; 37 desktop + 37 mobile openings checked |

Exceptions are intentional: product grids, long quotes, explanatory text, category lists, Journal cards, forms, tables and operational queues can grow. Compact navigation/footer/strip content does not consume a whole screen. Missing category imagery retains the deliberate monogram; no substitute media or invented business content was added. Portfolio, Testimonials, Journal and optional business-offering specimens are separate read-only rendering fixtures because those sources are not all published in the isolated local dataset.

## Part 2 — Visual and animation improvements

- Hero and Resin in Motion reuse the existing approved eight-second resin film. Both keep readable, stationary controls and factual visualization labels.
- Material and Atelier use the full section as the image field. Existing focal positions and captions are preserved; captions sit outside moving image layers. A zero-percent focal coordinate is preserved instead of falling back to 50%.
- Section edges now converge on charcoal `#080a0e`. Navy `#08283a`, sapphire `#164e6b`, gold `#b89b63` and ivory `#f4f1e9` remain the established palette. The footer fades into navy.
- Original display/body typography is retained, with responsive `clamp()` sizes and varied compositions rather than one repeated card layout.
- GSAP moves only oversized media, from −3% to +3%, with controlled scrub. Text reveals use transforms, not hidden server-rendered text. Captions and controls do not drift.
- Parallax is limited to eligible desktop/fine-pointer conditions. Reduced motion, data-saving and slow connections receive still imagery unless the visitor explicitly chooses to play. There is no scroll hijacking or pinned-page trap.
- Mobile hero details flow naturally after the main copy. This corrected the 320px caption/detail collision found during review.
- The approved Studio login/logo treatment is retained. Operational pages use the same colours without fullscreen content constraints or decorative motion.

## Part 3 — Before/after evidence

The gallery contains actual local before/after hero captures at 1440×1000 and 375×812, local desktop Studio captures, and final desktop/mobile section captures. Owner-supplied production screenshots are copied unchanged and clearly labelled as reference images; their content and viewport may differ from the isolated QA data. The file originally named `before-studio-mobile.jpg` measures 1265×712 and is not claimed as mobile evidence.

Local evidence directory: `test-results/cinematic-sections/` (ignored by Git). Gallery: http://127.0.0.1:4185/review.

Representative same-session hero comparison:

![Before — local desktop hero](C:/Users/gonda/.codex/.chatgpt-projects/g-p-6ac865e9ce14819185b0694637a1fba9/work/RivyaLivingArt2.0/test-results/cinematic-sections/before-hero-desktop.jpg)
![After — local desktop hero](C:/Users/gonda/.codex/.chatgpt-projects/g-p-6ac865e9ce14819185b0694637a1fba9/work/RivyaLivingArt2.0/test-results/cinematic-sections/after-hero-desktop.jpg)

![Before — local mobile hero](C:/Users/gonda/.codex/.chatgpt-projects/g-p-6ac865e9ce14819185b0694637a1fba9/work/RivyaLivingArt2.0/test-results/cinematic-sections/before-hero-mobile.jpg)
![After — local mobile hero](C:/Users/gonda/.codex/.chatgpt-projects/g-p-6ac865e9ce14819185b0694637a1fba9/work/RivyaLivingArt2.0/test-results/cinematic-sections/after-hero-mobile.jpg)

Material and film:

![After — desktop Material dialogue](C:/Users/gonda/.codex/.chatgpt-projects/g-p-6ac865e9ce14819185b0694637a1fba9/work/RivyaLivingArt2.0/test-results/cinematic-sections/after-material-desktop.jpg)
![After — mobile Resin in Motion](C:/Users/gonda/.codex/.chatgpt-projects/g-p-6ac865e9ce14819185b0694637a1fba9/work/RivyaLivingArt2.0/test-results/cinematic-sections/after-resin-mobile.jpg)

## Part 4 — Technical implementation and verification

New shared pieces: `CinematicVideo`, `ImmersiveImage`, and `section-atmosphere.module.css`. Updated `HomepageDocument`, `ReferenceHomepage`, `MaterialFilm`, the existing homepage motion controller/runtime, homepage styles, scoped footer styles, and Studio editing/overview styles. No dependency, schema, route, API, authentication, publication, catalogue, translation or SEO-data change.

Media is reused, not duplicated. Hero poster gets priority; below-fold imagery remains lazy. Video sources mount only when eligible and visible, with an initial hero delay so primary content/poster can paint first. Offscreen or hidden playback pauses; a visitor's explicit pause persists after leaving and returning. The expanded player is created only when opened, with native seek/fullscreen controls. Unsupported/blocked background video leaves the poster and readable “Film unavailable” status. Print retains the hero poster and MaterialFilm's still, with dark hero text on white.

Evidence:
- Final production-mode local build and TypeScript validation: passed.
- Full source lint: **0 errors, 62 existing warnings**. No new source lint warning in modified components.
- Unit tests: **350 passed**.
- Built HTTP/publication-boundary regression tests: **403 passed**.
- Preflight tests: **12 passed**. Initial sandbox-only localhost/Git restrictions were resolved by running the isolated checks with approved local access.
- Homepage: all eight widths (1920, 1440, 1200, 992, 768, 512, 390, 320) passed page/section overflow, mobile detail separation and film-control separation checks.
- Four layout variants × eight widths: **32 checks passed**, including long disclosure captions, empty media/product state, classic composition and editorial hero; no duplicate IDs or caption/title overlap.
- Studio: **74 workspace-opening checks** (37 at 1440px + 37 at 390px), plus **24 breakpoint checks** for overview/products/inquiries; no page overflow or missing main content.
- Related public-page smoke checks: Our Story, Materials & Care, Commission and Collectible Design open with their original headings, no overflow or broken loaded images, and no captured runtime exceptions.
- Playback confirmed with real advancing video time. Scroll-linked media transform changed from −33px to −10.791px while controls remained separate. Below-fold film had zero sources on first visit.
- Fresh reduced-motion visit: both videos paused, no video sources mounted, motion controller static.
- Expanded player: playback, Escape dismissal and opener focus recovery passed. Manual background pause persisted across offscreen/re-entry.
- Deliberately blocked local video URLs: poster remained visible, video opacity stayed zero and fallback status appeared. Temporary browser blocking was removed.
- Print smoke: 400px hero poster retained; dark heading on white; MaterialFilm still shown and video layer hidden.
- Automated accessibility samples: no detected WCAG-tag violations on homepage or sampled Studio workspace. **Contextual results remain incomplete**: public desktop scan has 143 contrast nodes and two silent-video-caption nodes; Studio sample has 53 contrast nodes. These are not recorded as passed. The sampled screenshots were reviewed for readable overlays, complete disclosures and control placement. This is not full WCAG, native-reader or physical-device certification.
- Local performance sample with browser resource cache disabled, unthrottled localhost and warm application server: **LCP 1.788s**, **CLS 0.0000373**, one 114ms loading long task. Only the 1.65MB WebM loaded; below-fold film sources remained absent. This single local sample is not a production/field-performance guarantee.
- Independent agent screenshot review accepted six scoped desktop/mobile views with no visible blocking clipping, overlap or unreadable controls. This is screenshot review, not independent human/native/device sign-off.
- All **1,658 protected local rows across 13 scopes** retain identical hashes and content identities. All **42 homepage links**, section order, title and canonical URL match the before baseline. Thirteen section text bodies match exactly; the three differences are film controls/descriptions and relocating the existing caption, not removed business copy.

Detailed machine-readable receipts are listed in `verification.json`; private row-hash inventories and raw screenshots remain local/ignored. No production preservation claim is inferred from local testing.

## Part 5 — Requirements compliance checklist

| # | Original Requirement | Status | Implementation Details | Exception / Reason |
|---|---|---|---|---|
| 1 | Make all possible sections fullscreen | Completed | Safe 100svh storytelling sections, immersive tall media panels; natural growth verified at eight widths | Dense grids, long editorial content, forms, tables, navigation and footer retain usable natural height |
| 2 | Use seamless gradients between sections | Completed | Shared charcoal edges, contained navy/gold light, media fades and homepage footer transition | Card boundaries and necessary functional dividers remain |
| 3 | Add parallax video to the hero | Completed | Approved resin film, full-bleed poster/video and bounded desktop scroll motion | Static/parallax-free experience for reduced motion, data-saving or ineligible touch layouts |
| 4 | Add parallax video to Resin in Motion | Completed | Fullscreen film with matching motion, description, pause and expanded native player | No forced pinning; explicit manual play remains available |
| 5 | Use full-bleed media where appropriate | Completed | Hero, Material, Resin, Atelier, Worlds and Portfolio treatments | Product details, long quotes, galleries and offering facts retain contained reading surfaces |
| 6 | Apply transparent gradient overlays | Completed | Directional transparent shades, vignettes and top/bottom blending; stationary captions | Dark overlays chosen for text contrast; light tones used only as restrained brand lighting |
| 7 | Improve all section designs | Completed | Complete homepage composition/optional section variants plus shared Studio shell/overview | Not a claim to redesign unrelated public detail routes; unavailable sections tested as isolated specimens |
| 8 | Preserve existing content and functionality | Completed | 1,658 unchanged local row hashes; 42 unchanged destinations; same section order, SEO title and canonical; regression suites passed | Original publication state preserved; no production write or fabricated evidence |
| 9 | Maintain premium dark-theme consistency | Completed | Original logo, type and navy/sapphire/gold/ivory palette; cohesive public and Studio surfaces | Approved login glass remains; operational pages intentionally calm |
| 10 | Optimize responsiveness and performance | Completed | Eight widths, lazy source mounting, poster priority, offscreen pause, limited transform animation and local performance sample | Field performance, physical phones and native zoom are not inferred from browser emulation |
| 11 | Test and fix introduced visual issues | Partial | Build/types/lint/unit/runtime/preflight; screenshots, controls, fallback, reduced motion, print and layout matrices passed; fixed mobile overlap and print regression | Contextual contrast/video-caption results remain incomplete; sampled visual review does not complete every accessibility node |
| 12 | Provide screenshots and implementation summary | Completed | This five-part report, local gallery, before/after captures, sanitized verification receipts and continuation checkpoint | Large screenshots/private QA evidence intentionally stay local and ignored |

Release remains pending a new explicit owner request for this redesign. Historical Studio access-table activation and real administrator acceptance remain separate from this visual work; no earlier unresolved operational gate is silently marked complete.
