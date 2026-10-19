# Design comparison and visual audit

> Final status authority: this document retains the dated 17 October source/before review. The 19 October coordinator sections and [FINAL-VERIFICATION.md](FINAL-VERIFICATION.md) provide the final candidate results; [SECURITY-RELEASE-REVIEW.md](SECURITY-RELEASE-REVIEW.md) covers later dependency patches. Earlier source-only requests and issue labels below are not new current passing or open-test claims.

Audit date: 17 October 2026. Current source baseline: `66e82ef04f76b8460654bab4329ccbadfb47f28e`, plus preserved local cinematic acceptance changes. This is an audit of the existing design, not authorization for another redesign.

## Decision

**KEEP the current visual direction.** Fresh desktop and mobile observations show that Rivya already has the requested serif hierarchy, original logo, navy/sapphire/gold/ivory palette, full-bleed resin imagery, dark section fades and usable public navigation. The previous cinematic work should not be rebuilt. Two narrow presentation defects were found in the local product and Studio catalogue screens; they can be repaired without changing business data, media, navigation or the accepted art direction.

The October 16 [PR #62](https://github.com/rivyalivingart2/RivyaLivingArt2.0/pull/62) implementation and [PR #63](https://github.com/rivyalivingart2/RivyaLivingArt2.0/pull/63) verification follow-up are the baseline, as documented in `docs/redesign/sitewide-cinematic-2026-10-16/RELEASE.md` and the current checkpoint. Historical release receipts establish earlier scope, not a fresh pass for this audit. The current unreleased contrast, font and video-loading changes are preserved.

## Evidence and conditions

`tools/master-audit/visual-reference.mjs` used installed Playwright and installed Chrome **155.0.8059.40**, fresh browser contexts, DPR **1**, desktop **1440 × 1000** and emulated touch/mobile **390 × 844**. Every network operation was restricted to **GET/HEAD**. No forms, account login, publication, order, message or consent selection was submitted. The external Era site attempted non-GET background requests; they were blocked. These restrictions may affect analytics, not the observed visible composition.

Sources inspected:

- Current production: [rivyalivingart.com](https://www.rivyalivingart.com/), plus its public `/studio/login` screen.
- Current local candidate: `http://127.0.0.1:4199/` against the existing isolated published QA data.
- Legacy reference: [OLDWEBSITE live](https://oldwebsite-one.vercel.app/), its public `/studio/` redirect to login, and [its repository](https://github.com/rivyalivingart2/OLDWEBSITE).
- Inspiration: [Era Residence](https://www.era-residence.com/).
- Review guidance: [Vercel Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md), read on the audit date. Guidance was applied selectively; it does not override the owner’s current content and palette decisions.

The final reference run produced **38 screenshots across 12 route/viewport observations**. All 12 documents returned **HTTP 200**, with no captured JavaScript page exception and no completed broken image in the initial inspected state. Current homepage and login document widths stayed within their viewport. Legacy homepage measured 392 CSS pixels at a 390-pixel viewport; this external-reference observation is not a defect in the current site. Aborted prefetch/media requests are recorded separately and are not treated as a broken page without visible or functional corroboration.

Evidence is local and ignored by Git:

- `test-results/rivya-master-audit/visual-reference/reference-evidence.json`
- `test-results/rivya-master-audit/visual-reference/*.png`
- Current broader route captures supplied by the root audit under `test-results/rivya-master-audit/screenshots/`.

The initial sandbox run could not resolve public hosts or reach loopback. The same read-only script was then executed with approved network access and captured the real pages. Network-sandbox failures are not site failures.

**Comparison limit:** production and isolated QA have different saved content and optional presentation settings. For example, QA shows a featured-piece hero card that production does not show. These screenshots must be labelled by environment, not presented as identical-content before/after proof. Full-page overview captures also do not prove every lazy item was individually visited. Interaction, motion, contrast and eight-width coverage are reported by their dedicated current-run evidence.

## KEEP / IMPROVE / DO NOT COPY

| Treatment | Fresh observation | Decision | Reason and action |
|---|---|---|---|
| Original brand logo | Current desktop and mobile navigation show the approved logo on an ivory plaque. Login places it inside the access panel. | KEEP | Preserves the owner’s identity; do not replace it with the legacy text-only wordmark or Era symbol. |
| Main navigation | Current desktop exposes collection/story/process/Journal/contact links with search, language and primary inquiry entry. Mobile condenses to logo, search and a large menu button. | KEEP | The compact shape is coherent with current pages. A screenshot confirms layout, while opening/focus tests remain separate. |
| Hero composition | Current resin scene fills the viewport, with left-aligned serif heading, readable supporting copy, primary sapphire CTA and secondary text link. Mobile naturally stacks these. | KEEP | The requested cinematic treatment is already implemented. Preserve its image focal point, copy and labels. |
| Hero factual labels | Current scene displays its visualization label and a visible pause control. Legacy hero includes a different business proposition, lead-time wording and a commission count. | KEEP current; DO NOT COPY legacy facts | Visual inspiration cannot replace approved facts or imply a completed commission. |
| Hero-to-content transition | Current lower image fades into charcoal and the short introductory statement. Legacy changes abruptly into a flat navy featured-product band. | KEEP current | Current transition directly supports the owner’s seamless-background priority. Do not restore rectangular colour bands globally. |
| Resin in Motion | Current desktop uses the same full-bleed scene language, large overlaid title, descriptive text, pause and expanded-film controls. Mobile lets the content extend below one viewport. | KEEP | Natural growth is correct for caption/control legibility. Fixed `height:100vh` would risk clipping the mobile controls. |
| Low-contrast media states | Local candidate has a visibly stronger dark scrim on the same composition, with original image and type intact. | IMPROVE through the existing acceptance repair | Retain the pending scoped scrim improvement, then use the fresh contrast sampling report for quantitative acceptance. Screenshots alone are not contrast certification. |
| Legacy editorial pause | Legacy has a centered serif statement on an uncluttered dark background between media moments. Current introductory band uses a shorter statement with a restrained glow. | KEEP the current editorial rhythm | This useful structural idea already exists; adding another statement would duplicate content. |
| Related-product transition | Current local product detail fades to charcoal, then the related-product grid starts and ends as a solid navy rectangle. Visible at 1440 and 390. | IMPROVE — VIS-01 | Apply the existing scoped atmosphere to that section; preserve product data, gallery, links and natural grid height. |
| Product detail composition | Current local gallery and technical copy are separate desktop columns; mobile stacks gallery, captions, specification and actions. | KEEP | Accurate product viewing and reading benefit from this separation. Do not put technical copy over the product image or force the full detail into one viewport. |
| Studio product workspace | Current local screen has readable dark controls, grouped filters, publication status, a record list and a dedicated editing area. | KEEP | This is an operational interface. Cinematic pinning or large moving backdrops would impede work. |
| Studio pagination | The page-count badge wraps into three lines inside its 32px box at both inspected widths. | IMPROVE — VIS-02 | Keep the count on one line with sufficient flex space and verify narrow widths; no pagination logic change is needed. |
| Studio access image and panel | Current login uses the approved making-study image, logo in a frosted panel and clear sign-in/request navigation. Legacy uses a static black form column with a separate abstract resin image. | KEEP current | The current design implements the owner’s later explicit preference. Reverting to the older split would undo accepted work. |
| Mobile login height | The current login grows to 1,067px at a 390 × 844 viewport; its submit action is lower on the page. Legacy also exceeds the viewport. | KEEP natural height; optional future review | This is not clipping. If staff later report excessive scrolling, a more compact introduction can be proposed; do not remove content or impose fixed height in this audit. |
| Era full-image focal treatment | The settled reference hero gives a clear visual subject, sparse navigation and large title. Its editorial scene varies title/image scale. | KEEP as structural inspiration only | Rivya already uses full-bleed artwork with a clear title and CTA. Do not copy architectural imagery, logo or sales claims. |
| Era brand preloader | Both captured first frames show a full-screen brand preloader; later captures show the real hero. | DO NOT COPY | Adding an introductory wait would delay access to Rivya’s content and compete with the performance objective. This is an observed state, not a measured Era LCP result. |
| Era colour and display lettering | The reference uses bright sky, pale backgrounds, burgundy branding and extremely condensed lettering. | DO NOT COPY literally | These belong to a different brand. Retain Rivya’s established dark material-gallery palette and display font. |
| Era persistent cookie panel | The panel remains over the bottom-right desktop view and occupies the lower mobile view in fresh anonymous contexts. No choice was clicked. | DO NOT COPY as decoration | Only introduce a consent interface if actual services require it; do not obscure Rivya’s forms/film controls for visual imitation. This is not a legal-compliance judgement. |
| Legacy mobile fixed bottom bar | A five-action bottom bar is visible over the legacy page edge. The current site uses the approved top navigation and contextual actions. | DO NOT COPY automatically | A second persistent navigation layer reduces space for long translated text and inquiry controls. A separate owner-approved navigation study would be required. |
| Legacy architecture and imports | The reference repository documents a different ORM, localization and motion stack plus historical bootstrap/import flows. | DO NOT COPY | Current architecture, protected catalogue, manual WhatsApp boundary and excluded-feature decisions remain authoritative. No legacy products, scripts, packages or assets were imported. |

## Reproduced presentation defects

### VIS-01 — Product recommendations retain hard background edges

- **Priority/status:** P2 / VERIFIED_OPEN at initial audit.
- **Route and viewports:** `/pieces/river-channel`, local QA, 1440 × 1000 and 390 × 844; normal full-page capture.
- **Evidence:** `screenshots/1440-pieces-river-channel.png` and `screenshots/390-pieces-river-channel.png`, inspected after capture.
- **Actual:** a flat navy related-product block creates sharp upper/lower boundaries against the charcoal detail and footer transition.
- **Expected:** the related-product section uses the same dark edge gradients as surrounding public sections, with unchanged natural-height cards.
- **Source:** `src/components/shop/shop-site.tsx:85` renders the related section with `section` + `elevated` but no dedicated public-section hook. `src/components/shop/shop.module.css:338` supplies a flat `--surface`. `src/components/shop/public-pages.module.css:8` already provides the appropriate reusable atmosphere.
- **Reproduction:** open a published product with related items; scroll from its last detail accordion to the related cards, then to the footer; compare the top and bottom edge colours.
- **Suggested fix:** give only the related section a stable `data-public-part` hook and use the existing `--page-atmosphere`. Do not globally change all raised panels or replace media.
- **Risk/effort:** low; focused markup hook and scoped CSS, small effort.
- **Validation:** new before/after captures at 1440/390 plus 320/768 overflow/readability checks, unchanged related-card count, text, links, image paths and caption.

### VIS-02 — Catalogue pagination count wraps outside its badge

- **Priority/status:** P3 / VERIFIED_OPEN at initial audit.
- **Route and viewports:** `/studio/products`, isolated QA, 1440 × 1000 and 390 × 844.
- **Evidence:** `screenshots/1440-studio-products.png` and `screenshots/390-studio-products.png`, inspected after capture.
- **Actual:** `1 / 6` breaks across three lines; the top and bottom numbers extend beyond the small count badge.
- **Expected:** a single compact count remains legible between Previous and Next without obstructing controls.
- **Source:** `src/components/studio/pagination.tsx:37` places the count in a shrinkable flex span with fixed `height:32px`, padding and no no-wrap/minimum-width rule. Shared button sizing consumes the adjacent space.
- **Reproduction:** load the catalogue with more than 20 records and inspect its list footer without selecting/editing any product.
- **Suggested fix:** make the count non-shrinking and no-wrap, keep the adjacent controls flexible or allow the row to wrap cleanly; preserve button semantics and pagination state.
- **Risk/effort:** low; component-local layout adjustment, small effort.
- **Validation:** page counts at 1/6 and multi-digit counts; 320/390/768/1440 widths; Previous/Next keyboard and last-page state. Do not require real product changes to test.

Root coordinates independent review and any implementation. This specialist did not modify app source. The final issue register must deduplicate these against the Studio/functional audit and record post-fix evidence before changing either status.

## Screenshot index and interpretation

The coordinator's fresh `layouts.json` records **588 automated layout observations**: 73 routes at eight widths and four short-height cases. The file contains zero overflow flags, zero capture errors and DPR 1. That is automated geometry/runtime evidence; it is not a claim that every screenshot or every animated state received visual inspection.

This specialist visually inspected the following **16 additional local screenshots** from the broader suite. These are representative family checks, with the raw files kept in `test-results/rivya-master-audit/screenshots/`. Tall full-page images were also inspected at a reduced overview scale to assess section composition; they do not establish small-text contrast or interactive behavior.

| Family | Inspected files | Observation and decision |
|---|---|---|
| Product detail | `1440-pieces-river-channel.png`, `390-pieces-river-channel.png` | Gallery, specifications and actions retain useful separation; natural mobile growth is appropriate. The related grid has the reproduced VIS-01 hard background edges. |
| Collection | `1440-collectible-design.png` | Introductory atmosphere, filter controls, natural-height product grid and subsequent editorial chapters follow the approved system. Keep the grid usable instead of imposing a fixed viewport. |
| Contact | `1440-contact.png`, `390-contact.png` | Contact options and editorial chapters stack without visible overlap. The generous chapter spacing reflects the approved fullscreen brief; a compact alternative would be a future design choice, not a reproduced defect. |
| Commission form | `1440-commission-customize.png` | Clear introductory hierarchy, step indicator, labelled fields and a separate summary preserve the form's practical layout. No full-bleed media is needed behind inputs. |
| Public Journal | `1440-journal.png` | Intro, filters and natural-height editorial cards remain distinguishable. QA fixture labels are preserved and are not treated as live customer evidence. |
| Brand story | `1440-our-story.png` | Full-image introduction, dark gradient chapters and longer factual sections retain the requested cinematic rhythm. The long overview is not evidence that every accordion state was exercised. |
| Unavailable state | `390-not-a-real-audit-route.png` | Clear unavailable heading, collection/contact recovery links, navigation and complete footer remain visible at mobile width. |
| Studio overview | `1440-studio.png` | Actions requiring attention, counters, stage information, workspace links and activity remain legible in an operational layout. Keep restrained background lighting. |
| Studio catalogue | `1440-studio-products.png`, `390-studio-products.png` | Filters, records and editing region are coherent; the count-badge defect is VIS-02. The narrow category strip intentionally scrolls horizontally within its own region. |
| Studio inquiries | `1440-studio-inquiries.png`, `390-studio-inquiries.png` | Desktop table becomes separated mobile cards with stage actions. Operational content is not forced into viewport height. Some desktop assignee text wraps in its narrow column; no control is lost in the inspected state. |
| Studio editorial list | `1440-studio-journal.png` | Draft/published metadata, find/filter controls and list pagination are clearly separated. This list capture does not certify child-editor or publishing behavior. |
| Studio settings | `390-studio-settings.png` | Contact-reference fields, workflow explanation and service readiness use stacked cards and readable labels. Runtime readiness labels are displayed evidence, not a production-service certification. |

No additional P0/P1 visual failure was established by this subset. This conclusion does not substitute for the coordinator's keyboard, state, contrast and functional checks. Authenticated screenshots contain isolated QA records and remain local; they must not be uploaded to GitHub.

All names below are relative to `test-results/rivya-master-audit/visual-reference/`:

| Evidence | Desktop | Mobile |
|---|---|---|
| Current production hero | `current-production-1440-top.png` | `current-production-390-top.png` |
| Current production transition | `current-production-1440-transition.png` | `current-production-390-transition.png` |
| Current production Resin in Motion | `current-production-1440-resin.png` | `current-production-390-resin.png` |
| Local acceptance candidate hero | `current-local-1440-top.png` | `current-local-390-top.png` |
| Local acceptance candidate Resin in Motion | `current-local-1440-resin.png` | `current-local-390-resin.png` |
| Legacy hero | `legacy-1440-top.png` | `legacy-390-top.png` |
| Legacy section boundary | `legacy-1440-transition.png` | `legacy-390-transition.png` |
| Current public login | `current-login-1440-top.png` | `current-login-390-top.png` |
| Legacy public login | `legacy-login-1440-top.png` | `legacy-login-390-top.png` |
| Era initial brand/loading state | `era-reference-1440-top.png` | `era-reference-390-top.png` |
| Era settled hero | `era-reference-1440-settled-top.png` | `era-reference-390-settled-top.png` |
| Era later editorial composition | `era-reference-1440-editorial.png` | `era-reference-390-editorial.png` |

Initial screenshots with a loader are explicitly labelled as that state. Scroll-position captures are not matched by absolute pixel across different sites. A static screenshot cannot verify smoothness, video autoplay policy, hover/focus behavior or screen-reader experience. Root’s broad layout and interaction suites supply their separate evidence; physical devices and native assistive output remain the previously stated external gates.

## Scope preserved

No palette replacement, brand replacement, package installation, external component copying, asset download/import, schema change, production login, production mutation or release occurred in this specialist pass. The inspected external references were inspiration only. Protected image subjects, captions, crop values, factual labels, content and inquiry behavior remain unchanged.


## Final coordinator verification

VIS-01 related-section continuity and VIS-02 pagination: VERIFIED_FIXED. Evidence: studio-regressions.json and actual after-related/after-pagination screenshots in the ignored local gallery. The original images/crops/captions/links remain unchanged; the full-audit 13-scope snapshot matches. Shared brand, homepage films and existing Studio access design are retained. No full redesign, external component, new shader or stock media was introduced.
