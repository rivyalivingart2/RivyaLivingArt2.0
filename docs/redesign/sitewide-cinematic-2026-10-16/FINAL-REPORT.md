# Rivya Living Art — website-wide cinematic implementation

16 October 2026 · Local branch `codex/cinematic-sections` · Based on released main `ffd863928744df0ae2cf985f6504421842a074db`.

**The website-wide visual system is implemented locally across the public templates, Studio access pages and all 37 Studio workspaces.** The new cursor lighting, shared gradients and inner-page treatments extend the earlier homepage cinematic work. Logo, established colours, text, links, media associations, crops, routes, APIs and protected records are preserved.

**This is a local review deliverable. No push, PR, deployment, publication, production database change or Drive upload was performed.** The running application is [local Rivya](http://127.0.0.1:4199/); the visual gallery is [before/after review](http://127.0.0.1:4186/review). These addresses require the local servers to remain running.

## 1. Full website section audit

[FINAL-SECTION-AUDIT.md](./FINAL-SECTION-AUDIT.md) contains the complete section table, including fullscreen decisions, gradient presets, cursor effects, media treatment and evidence boundaries. [ROUTE-AUDIT.md](./ROUTE-AUDIT.md) and [route-audit.json](./route-audit.json) retain the original discovery inventory.

The repository contains **109 route adapters: 62 page files and 47 handlers**. The inventory covers 31 public template adapters, 37 Studio workspace destinations, 18 configurable homepage slots and 16 landing block types. A historical register lists 665 URLs, including 636 dynamic detail URLs; those counts are discovery evidence, not a claim that every record is currently published or was freshly opened.

| Page / family | Section treatment | Fullscreen decision | Gradient / cursor | Media / motion | Verification |
|---|---|---|---|---|---|
| Homepage | All eligible story slots, product/category galleries, invitation and transition bands | Viewport minimum for story moments; growing galleries and compact navigation | Charcoal edges, navy/gold ambient, shared eased light | Hero and Resin film parallax; material/atelier image parallax; reveal hierarchy | Actual local homepage at all eight widths; motion checks; earlier optional-home specimens retained |
| Collections and journeys | Collection openings, published chapters, product results, commission/preserve/personalize guidance | Immersive openings/chapters; results and filters natural | Story, gallery and quiet form presets | Saved full hero media and narrative chapters; accurate product cards | Actual collection/journey routes and static saved-full-hero specimen |
| About, process, materials, architects | Editorial openings, narrative sections, technical/checklist/accordion sections | Viewport storytelling; technical and reading sections natural | Shared dark edges with restrained story light | Existing selected imagery; media-only parallax; stationary captions | Actual routes at eight widths; split/reverse/checklist specimens |
| Product and customization | Gallery, specifications, related cards, existing multi-step brief | Natural height and accurate contained media | Quiet product/frame lighting; inputs suppress ambient light | Existing gallery and enlargement retained | Product and customization routes; keyboard gallery/dialog checks |
| Journal, portfolio, testimonials | Archive opening, filters, cards, detail opening, prose, media and related content | Immersive eligible opening; archive/prose grow | Reading/gallery presets and subtle card frame | Image-bearing stories gain editorial media composition | Published local article; saved portfolio/testimonial previews; archive routes |
| FAQs, policies, contact, receipts and saved pieces | Clear reading/forms/navigation with common surfaces | Natural height, compact title where appropriate | Restrained lighting, visible focus, matching footer | No decorative parallax behind lengthy text or forms | Routes at eight widths; FAQ controls and long-policy print checked |
| Dynamic landing pages | All 16 supported blocks | Fullscreen hero/image/film where useful; other content natural | Shared section and media gradients | Same reusable video, image and card system | Existing local video landing plus 16 static block specimens |
| Studio access | Existing image, original logo, approved white glass, sign-in/request/recovery forms | Safe viewport minimum; form grows | Low-intensity canvas, approved glass and shared pause preference | No intrusive form movement | Login/request/recovery at eight widths; pause persists between access pages |
| Studio operations/admin | Overview, all editors, queues, orders, data tables, settings and status views | Shell minimum only; working content natural | Restrained static panel lighting and low-intensity shell glow | No cinematic parallax in productivity interfaces | 37 desktop + 37 mobile openings; products/inquiries/settings at eight widths |
| Saved previews and print | Public saved revisions, preview controls and printable records | Public template controls its own height; print remains paper-oriented | Public preset inside preview; calm admin controls | No duplicated admin light inside public frame | Portfolio/testimonial/FAQ saved previews at eight widths; print-source exception preserved |

**Fullscreen exceptions follow the requested usability rule.** Grids, long articles, policies, FAQs, forms, record editors, tables and operational queues are not fixed to `h-screen`. Safe `min-height:100svh` sections may grow. Short nav/footer/manifesto-strip content does not occupy an artificial screen. Product photography remains accurately framed; only appropriate narrative imagery becomes full bleed. Optional hidden blocks and unpublished records were not activated to manufacture evidence.

## 2. Reusable component research

[COMPONENT-RESEARCH.md](./COMPONENT-RESEARCH.md) provides the full 12-candidate table, exact source/licence links, compatibility screening, maintenance/dependency considerations and the old-site source comparison.

| System / component | Source | Licence reviewed | Decision | Integration / cost |
|---|---|---|---|---|
| GSAP / ScrollTrigger | [GSAP](https://gsap.com/docs/v3/Plugins/ScrollTrigger/), [licence](https://gsap.com/community/standard-license/) | Standard No Charge licence, not MIT | Selected existing dependency | Existing 3.15.0 runtime reused; bounded transforms and cleanup |
| Motion values / springs | [Motion](https://motion.dev/docs/react-use-spring) | MIT | Reference; avoid a second animation runtime | Not installed |
| SpotlightCard | [React Bits source](https://github.com/DavidHDev/react-bits) | MIT plus Commons Clause | Reference for interaction patterns | No code copied or package added |
| Spotlight / Magic Card | [Motion Primitives](https://github.com/ibelick/motion-primitives), [Magic UI](https://github.com/magicuidesign/magicui) | MIT | Compare pointer-transparent layers and eased coordinates | No extra Motion/theme dependencies |
| Controls and UI catalogues | [shadcn/ui](https://ui.shadcn.com/), [Cult UI](https://www.cult-ui.com/), [Aceternity](https://ui.aceternity.com/), [21st.dev](https://21st.dev/) | MIT for inspected shadcn/Cult repositories; exact-item licence needed for other candidates | Existing local/Radix controls fit the application | No copied showcase or unverified package |
| 3D/shader systems | [Three.js](https://threejs.org/), [React Three Fiber](https://r3f.docs.pmnd.rs/), [OGL](https://github.com/oframe/ogl) | MIT / MIT / declared Unlicense | No demonstrated need for a shader renderer | Zero added WebGL contexts |

The cursor controller is locally authored to fit the existing architecture; no third-party showcase source, tracking script, remote runtime or demo media was copied. Research informed the implementation without adding redundant dependencies. The old repository was inspected at `2dd6d5de34acf3f98e611eda2e1b858ebd0da8e6`; its full-bleed hierarchy, restrained parallax and poster-first approach informed the design, while current application/data/authentication architecture remains authoritative.

## 3. Before-and-after visual report

Open the [local visual review](http://127.0.0.1:4186/review). It includes public desktop/mobile comparisons, inner-page composition, product/gallery presentation, cursor positions, Resin in Motion and representative Studio screens. Original evidence files stay under `test-results/sitewide-cinematic/`, ignored by Git. The earlier homepage-only comparison and the owner's unchanged reference screenshots remain available at [the preceding review](http://127.0.0.1:4185/review).

**Baseline and capture limits:** this pass's before images show the local implementation before the website-wide extension; that baseline already includes the preceding homepage redesign. Some desktop baseline files contain an in-app-browser overscan repeat at the right/bottom edge. The gallery labels this capture defect and crops the comparison viewport consistently; it does not present those repeated strips as website defects. Raw files are retained. Final desktop Studio captures were refreshed after layout and paint settled. Mobile comparisons do not use the defective desktop capture area.

| Evidence | Files in `test-results/sitewide-cinematic/` |
|---|---|
| Homepage desktop/mobile | `before-home-desktop.jpg`, `after-home-desktop.jpg`, `before-home-mobile.jpg`, `after-home-mobile.jpg` |
| Inner storytelling | `before-our-story-desktop.jpg`, `after-our-story-desktop.jpg`, corresponding mobile files |
| Product gallery | `before-pieces-river-channel-desktop.jpg`, `after-pieces-river-channel-desktop.jpg`, corresponding mobile files |
| Cursor light / video | `after-cursor-left.jpg`, `after-cursor-right.jpg`, `after-resin-desktop.jpg`, `after-blocked-video-fallback.jpg` |
| Article / selected landing | `after-article-desktop.jpg`, `after-article-mobile.jpg`, `after-landing-video-desktop.jpg`, `after-landing-video-mobile.jpg` |
| Saved public detail previews | `after-saved-portfolio-desktop.jpg`, `after-saved-testimonial-desktop.jpg`, `after-saved-faq-desktop.jpg`, corresponding mobile files |
| Studio | `after-studio-desktop.jpg`, `after-studio-products-desktop.jpg`, `after-studio-settings-desktop.jpg`, corresponding mobile files |
| Access and narrow caption | `after-studio-login-desktop.jpg`, `after-studio-login-mobile.jpg`, `after-long-caption-320.jpg` |

Saved preview screenshots show existing local draft revisions, not new publication. Static specimens are clearly labelled synthetic, use real rendering components/CSS, and have no hydration, client interactions or database access. They prove layout only. Screenshots demonstrate composition; measured motion checks separately establish live cursor/parallax/video behavior.

## 4. Technical implementation and verification

### Shared system

- `CinematicCanvas` is integrated into the actual public `ShopFrame`, private Studio `Workspace` and `StudioAccessShell`. A context guard prevents a second active lighting layer in nested public previews.
- `cinematic-tokens.css` defines shared charcoal/navy/sapphire/gold/ivory colours, ambient/media/edge/hover gradients, duration and easing tokens. Existing logo assets and fonts are retained. Earlier homepage-local tokens were separated from shared tokens to prevent CSS collisions.
- Cursor lighting uses a single pointer-transparent layer, refs and a scheduled `requestAnimationFrame` interpolation. It eases toward the pointer with a 115ms response constant and stops scheduling when settled. Pointer movement does not update React state. Card lighting writes coordinates only for the active card.
- Ambient motion uses restrained 28-second drift and 12-second breathing. Studio's ambient animations are disabled; its shell light is lower intensity. Reading/forms/media have quieter presets. Photography, product cards, inputs and focused dialogs suppress the global light so product colours and interaction states remain clear.
- `cinematic-motion-runtime.ts` reuses existing GSAP/ScrollTrigger after initial paint. Inner-page media movement is bounded to approximately ±2%; the existing homepage runtime uses its established bounded range. Reveals use transforms while server-rendered text remains visible. Captions/controls are outside moving media layers.
- `cinematic-preference.ts` stores an explicit effects-pause preference across routes. A session fallback preserves it if browser storage is unavailable or blocks writes. The access glass pause and footer/Studio control use the same preference. Film playback keeps its own independent controls.
- Touch/coarse-pointer, reduced-motion, data-saving/slow-connection and modest-device modes use static alternatives. Hidden/offscreen cleanup, debounced resize and teardown release scheduled frames, listeners, observers and scroll animations. Native scrolling and cursor visibility remain intact.

### Media and layout

`CinematicVideo`, `MaterialFilm`, `ImmersiveImage`, `ChapterMedia` and `LegacyChapterMedia` provide reusable film/image presentation. Existing selected media, zero-valued focal coordinates, captions, alt text and visualization disclosures remain intact. Hero and Resin in Motion reuse the approved eight-second silent film, with WebM/MP4 sources, visible-only loading/playback, fallback poster and manual/expanded controls. Full-bleed directional scrims and matched charcoal edges join adjacent sections.

The legacy image path used by Our Story was included after integrated review showed that a header-image-only condition missed it. Long captions wrap in normal flow at 320px. Existing collection presentation choices, product-detail framing, article reading columns and technical checklists retain their appropriate compositions. Global footer, editorial, collection, landing and Studio CSS share the same palette without forcing identical layouts.

**Packages introduced: 0. Packages removed: 0. New media assets: 0.** [MEDIA-AUDIT.md](./MEDIA-AUDIT.md) confirms current local byte counts/hashes for the existing poster, WebM and MP4. The supplied Drive folder and its video inventory were inspected read-only; the manifest's prior Drive-byte verification is explicitly historical. No new Drive transfer was necessary.

### Test results

| Verification | Result | Evidence |
|---|---|---|
| Production build / TypeScript | Passed | `build.txt` |
| Full repository lint | 0 errors; 62 existing warnings | `lint.txt` |
| Final focused lint after legacy-media fix | Passed, no diagnostics | `final-focused-lint.txt` |
| Unit suite | 350 passed | `unit.txt` |
| Final runtime regression | 403 passed; 0 failed/skipped | `final-runtime.txt` |
| Preflight suite | 12 passed | `preflight.txt` |
| Pause preference including blocked storage | 3 cases passed | `preference-check.json` in this directory |
| Public routes | 30 × 8 widths = 240 observations; no detected page overflow, heading clipping or broken visible image | `public-breakpoints.json` |
| Studio modules | 37 desktop + 37 mobile openings = 74 | `studio-workspaces.json` |
| Studio full breakpoint samples | 3 × 8 = 24 | `studio-breakpoints.json` |
| Saved detail previews | 3 × 8 = 24 | `saved-previews.json` |
| Access forms | Login/request/recovery × 8 = 24 | `access-breakpoints.json` |
| Conditional layout specimens | 22 × 8 = 176; includes all 16 landing blocks and long-caption cases | `specimen-breakpoints.json` |
| Interactive motion | Cursor interpolation/idle, Hero and Resin parallax/playback, offscreen behavior, pause persistence, touch/reduced/low-power fallbacks | `motion-checks.json` |
| Representative controls | Product next/enlarge/Escape, mobile menu/focus return, FAQ disclosure/filter, quiet form focus, expanded film, blocked-video poster, print policy, Studio finder, access pause, product hover | `interaction-checks.json` |
| Automated accessibility | 9 representative views; 0 reported violations; contextual contrast and silent-video checks remain incomplete | `accessibility-checks.json` |
| Existing local content/records | All 1,658 rows across 13 protected scopes unchanged; 17 sampled public paths preserve normalized text, ordered links, titles/H1/canonicals | [preservation.json](./preservation.json) |

All breakpoint groups use **1920, 1440, 1200, 992, 768, 512, 390 and 320px**, except the separately identified 74 two-width Studio openings. Combined coverage is 562 layout observations, not 562 unique pages or physical devices. Static layout evidence is kept separate from working-application interaction evidence.

Three local cache-disabled desktop samples measured LCP **1.348s homepage, 0.612s Our Story and 0.384s product**, with CLS **0.000064, 0 and 0**. There was one 51ms long task on the product sample; none in the other two buffered samples. Each page had one light layer and zero WebGL canvases. On the homepage only the visible hero mounted video sources; the offscreen second film had none. See `local-performance.json`. These are local browser samples without mobile network throttling, not production Core Web Vitals or a field-performance guarantee.

Solid token-pair contrast calculations are **17.55:1 ivory/charcoal, 9.39:1 muted/navy, 7.96:1 ivory/sapphire and 7.46:1 gold/charcoal**. They do not establish contrast for every changing image, gradient, translucent access panel or interaction state. Automated contrast results are incomplete because the audit cannot determine gradient backgrounds; silent material-video caption review is also contextual. Existing textual film descriptions remain available. No blanket WCAG conformance claim is made.

### Preservation and limitations

The before/after local snapshots have zero added, removed or changed protected rows. All source library/persistence code, API handlers, route adapters, metadata, package manifests, existing media and business-detail scopes are unchanged against the base commit. The only sampled raw text differences are a newline after an existing visualization caption on two pages; normalized content and destinations match.

The implementation is verified by template families and representative populated states. It is not a fresh visit to every historical dynamic URL, every permission combination, every production record, or every possible optional saved configuration. Existing unavailable/configuration notices remain honest. No sample/customer/order/inquiry or offering was invented for publication.

Native screen-reader tasks, physical phones, independent language/media-rights decisions, production field performance and real customer inquiries were not performed. Prior administrative acceptance does not create new measured evidence. The historical Studio access-request table activation remains a separate production setup item; this visual work neither changes nor proves that setup.

## 5. Mandatory requirements compliance

“Completed” below means implemented and verified within the stated local source/template/browser scope. It does not mean released or independently certified on physical hardware.

| # | Requirement | Status | Evidence / notes |
|---|---|---|---|
| 1 | Apply visual redesign to all suitable website sections | Completed | Shared public/Studio integration plus complete section register; representative runtime and conditional specimen coverage. Optional unpublished content remains unpublished. |
| 2 | Make all possible sections fullscreen | Completed | Safe viewport minimums on appropriate story/media openings. Natural grids, prose, FAQ/forms, navigation and admin are deliberate usability exceptions. |
| 3 | Use seamless gradients between sections | Completed | Common charcoal edge tokens, transparent media fades and matching footer/inner-page surfaces; screenshot review. Functional data separators remain. |
| 4 | Create a global animated gradient system | Completed | One reusable canvas per actual shell; shared tokens and page-mode presets. |
| 5 | Make gradients react smoothly to the cursor | Completed | Ref/RAF eased transform measured at two pointer positions; pointer-transparent layers and accurate product imagery retained. |
| 6 | Add animated gradients throughout the website | Completed | Shared public/access system with idle drift; quiet reading/form presets. Studio productivity, touch and reduced/low-power modes intentionally use restrained/static treatment. |
| 7 | Add video parallax to the Hero | Completed | Visible autoplay/muted/inline playback, changing scroll transform, pause/reduced/fallback evidence. |
| 8 | Add video parallax to Resin in Motion | Completed | Fullscreen film, scroll transform, visibility loading, poster and expanded-player checks. |
| 9 | Add appropriate parallax to other suitable sections | Completed | Material/atelier and eligible inner chapter media; Our Story transform observed. Reading, forms and admin intentionally remain stationary. |
| 10 | Use fullscreen imagery/video when beneficial | Completed | Narrative media and selected hero/landing treatments; accurate product galleries and technical imagery remain contained. |
| 11 | Add transparent gradient media overlays | Completed | Shared directional scrims, edge fades and stationary complete captions; narrow caption specimen verified. |
| 12 | Use GitHub and reputable prebuilt components where suitable | Completed | Twelve candidates and original-source patterns reviewed with licence/compatibility notes; installed GSAP reused. No unnecessary showcase code or packages adopted. |
| 13 | Create reusable components | Completed | Canvas, pause preference/control, motion runtime, tokens, media wrappers and shared existing section owners. |
| 14 | Maintain dark-theme brand consistency | Completed | Original logo/font assets and established palette retained across public/Studio; paper print and approved white access glass remain intentional exceptions. |
| 15 | Apply system to main website and Studio | Completed | Actual public shell, actual private workspace and actual access shell integrated; 37 Studio workspaces opened. |
| 16 | Preserve existing features and content | Completed | 1,658 protected rows unchanged, sampled text/links/SEO unchanged, 403 runtime checks pass, no backend/route/package/business edits. |
| 17 | Support mobile, tablet and desktop | Completed | Eight requested browser widths, touch fallback and narrow-content growth verified. Physical device acceptance is not implied. |
| 18 | Maintain accessibility and performance | Partially Completed | Automated checks, keyboard, pause/fallbacks, solid-token ratios and local performance samples pass within scope. Full contextual contrast, native assistive/device and field validation are not certified. |
| 19 | Fix visual issues introduced or found during implementation | Completed | Legacy media inclusion, global/home token collision, focus-light specificity, blocked-storage pause fallback, no-blur pause access and caption wrapping addressed. Final sampled layouts pass. Capture defects are disclosed separately. |
| 20 | Provide implementation reports and screenshots | Completed | This report, full audit, research, media/preservation/verification receipts and local before/after gallery. |

The next decision is owner visual review of this local result. A future explicit push/release request should use a detailed PR into main, exact-head deployment verification and fresh live checks. Do not replay data fixtures or publish records as part of releasing presentation changes.
