# Phase 3 — design system and page blueprint

23 September 2026. Updated under approved master revision 3.3, P3.1–P3.6. Source design specification; final visual/keyboard/device verification remains Phase 11. See PHASE-3-DESIGN-SYSTEM.md for the source audit, state coverage and prepared verification scenarios.

## Shared system

Navy #0B1728 frames the site, forest #19221C marks material/atelier chapters, ivory #F3EFE7 holds catalogue/editorial content, stone #DDD6CB separates surfaces. Ink #18202A is text on ivory. Bronze #B08D57 is decorative on dark surfaces; never normal text on ivory. Primary controls are ivory/navy or navy/ivory. Locally hosted Cormorant Garamond and DM Sans use the retained licence files. Display scales to 44–112px; body 16–18px; fields at least 16px.

The shared shell uses a constrained 184×52 logo, 84px desktop sticky header/72px compact sticky header, 16px navigation and 44px minimum compact targets, one Collections disclosure, Our Atelier, Process, Journal, Contact, search and Begin a piece. A native mobile dialog contains the three collection links with keyboard focus containment, Escape and return to the opener. At 1200px the header changes to compact navigation; native noscript navigation remains available without JavaScript. Anchor offsets track header height. Studio is absent. Footer includes collection, atelier, contact and policy destinations.

CSS modules isolate active shop components from retained legacy presentations. The source repair changes shared tokens and the scoped header rather than increasing logo specificity throughout the old website.

| Primitive | Desktop treatment | Compact / state treatment |
|---|---|---|
| Product card | 4:5 image, name, object type, inquiry pricing, clear link | Two columns then one below 390px; image never sole label; no hover-dependent task |
| Editorial card | Wider composition, category, title, excerpt | Stacked with comfortable reading measure |
| Gallery | Large reserved image, thumbnails, previous/next, native zoom dialog | Swipe plus labelled buttons; contain image in zoom; focus returns |
| Filters/search | Labelled toolbar, URL query/category/sort/page size, live result count | Wrapping controls; reset/empty recovery; Back retains filters |
| Form | Selected piece sidebar; three numbered groups; bounded labelled fields | One column; data retained between steps; inline errors and alert summary |
| Review/receipt | Definition list, edit controls, explicit inquiry status and copy/reopen | Full wrapping summary; no fake sent/paid/confirmed language |
| Upload | Private file status, remove/retry and explicit 3×3MB limits | File picker; no drag-only action; failures prevent silent omission |
| Dialog | Native dialog, labelled heading, visible close, body scroll lock | Fits viewport; Escape; trapped focus; return to opener |
| Alerts/empty | Plain reason and actionable next step | Live status for asynchronous work; error alert; retry retains input |
| Staff table/card | Compact legible type, stage text, version/owner, action column | Labelled cards/list alternative; horizontally scrolling Kanban confined to board |
| Pagination | Result range plus Previous/Next or explicit load more | 44px controls; filters/page size retained in URL |

## Public blueprint

| IDs | Desktop composition | Mobile composition and states |
|---|---|---|
| P01 | Full-bleed furniture hero; three journeys; selected published pieces; material split; numbered process; journal; invitation | Poster/static first; shortened headline; stacked chapters; empty catalogue still gives truthful contact recovery |
| P02 | Spatial hero, supported furniture-type filters, ivory product grid | Intro above filters, two/one-column grid, retained URL state |
| P03 | Preservation image/text split, suitability guidance, format filters, memory grid | Empathetic intro; no furniture-only fields; no shipping keepsakes before staff guidance |
| P04 | Gifting image/text split, occasion/type framing, gift grid | Dense but readable cards; relevant size/message/quantity |
| P05 | Search heading, query/filter/count, grid | Full-width search; clear filter reset; no-result recovery |
| P06 | 60/40 gallery/detail, name, inquiry price/CTA, verified material/dimensions, care, related records | Name near gallery, visible CTA, thumbnails/zoom, no overlay covering keyboard |
| P07 | Selected product sidebar + Your piece → Your details & references → Review | Compact product summary; one-column steps; preserve inputs on back/failure |
| P08–P10 | Distinct chooser/journey introduction; selected legacy product redirects directly to its form | Context/query preserved; product is not reselected |
| P11 | Private saved receipt, brief, saved references count, reopen/copy, expiry recovery | Wrapping summary and buttons; no inquiry ID as access credential |
| P12 | Atelier statement, material image, truthful approach, process invitation | Stacked visual/text chapters; no invented founder/workshop claims |
| P13 | Permanent canonical redirect to P12 | Preserve meaningful query parameters |
| P14 | Numbered Discover → Personalize → Save → Discuss sequence | Vertical steps, immediate action, manual-confirmation explanation |
| P15 | Material introduction and accessible care sections with anchor navigation | Short sections, finish-specific caution, no unsupported technical guarantee |
| P16 | /materials and /care redirect to corresponding P15 anchors | Anchor landing remains below header |
| P17 | Spatial composition, project needs checklist and product chooser CTA | City/use/scale/access context carried to product brief |
| P18 | Featured article, topic links, editorial grid | Stacked stories, truthful byline/date, empty publication state |
| P19 | Article header, reserved illustration, narrow reading column, sections, related pieces | 16–18px body, no unreviewed fixture text, wrapping title |
| P20 | Two clear paths: new brief / existing inquiry; supplied phone/email/map | Direct contact actions; no disconnected submit button |
| P21 | Grouped semantic details accordions and relevant journey action | Keyboard/touch activation; question stays visible |
| P22–P26 | Shared readable policy layout with distinct page headings/sections and contact recovery | Comfortable line length; factual storage/manual order wording; no invented promises |
| P27–P28 | Preserve project templates privately; redirect portfolio index to catalogue while all project examples are fictional | Unsupported project detail returns unavailable; never show fictional completed work as real |
| P29–P30 | Shared restrained recovery, visible reason, collection/contact action | Error/offline/retry focus; no public Studio link; no root loading that masks unknown-route status |
| P31 | Compact header/footer, disclosure menu, mobile and gallery native dialogs | Focus return, Escape, 44px controls, reduced-motion parity |

## Studio blueprint

| ID | Layout / primary task | Compact / state treatment |
|---|---|---|
| S01 | Branded quiet login card; staff-only ID/password, recovery guidance | One column; generic denied/unavailable/pending messages |
| S02 | Actual scoped counts, due follow-ups, recent activity | Stacked metric cards; real empty state |
| S03 | Query, stage, assignee filters + paginated table | Readable list cards; explicit result counts |
| S04 | Eight existing stage columns, card reference/product/date/owner | Scroll only inside board; Move-to selector equal to drag/drop |
| S05 | Detail drawer/dialog, immutable brief, references, notes/history and follow-up | Full-width dialog; focus management; conflict reload without false save |
| S06 | Manual order form retaining existing client/title functionality | Compact labelled form; source distinguished from website inquiry |
| S07 | Catalogue list, image, live/draft/version state, search | Scrollable list + selected editor; no unsaved loss on selection |
| S08 | Structured product content/spec/media/visibility field groups | Single column; errors near fields; unsaved-change protection |
| S09 | Product fields, typed choices/conditions/limits, reorder + customer preview | Move buttons; no arbitrary executable schema; conflict and validation feedback |
| S10 | Draft/live comparison, validation, admin publish/hide | Editor can preview/save only; clear publication result |
| S11 | Content list, page/article/FAQ typed editor and version history | Editor responsive layout; durable drafts; no raw executable HTML |
| S12 | Public media grid, alt/crop/provenance/detail/usage | Search + detail panel; no customer references in picker |
| S13 | Authorized private reference view in inquiry context | Contain image; return control; denied/expired/unavailable recovery |
| S14 | Staff table, role/status, create/edit/revoke controls | Cards with clear admin-only permission state |
| S15 | Business settings grouped by public identity and operations | Readable values; validated changes; no secrets rendered |
| S16 | Actor/date/action timeline, due follow-ups and controlled export | Stacked events; admin export; explicit empty/filter states |
| S17 | Consistent dialogs, pending/save error/session expiry/permission/conflict | Native focus containment; preserve unsaved input where safe; no dead ends |

## Motion and asset slots

Home headline enters 12px over 550ms with full opacity throughout; image settles from 1.025 scale over 550ms. Navigation is immediately usable. Cards scale at most 1.035; gallery transitions 200ms; native scroll throughout. No unsupported film dependency or pinned section is introduced. Reduced-motion removes transitions/animation and hover/focus scale transforms, preserving every action. Forms/Studio have no decorative entrance delay.

Hero is a supplied 16:9 spatial visualization with responsive object position; card/detail slot is 4:5; material split 4:5 desktop/5:4 compact. Zoom uses object-contain. Alt describes the actual depicted object; captions identify design visualizations. Only same-object images join a gallery. Existing logo and source derivatives remain unchanged; no new paid asset is required. Media budget/derivative work is Phase 9; measured performance is Phase 11.

## Copy rules

Lead with object and purpose. Use concrete material, scale and selection language only where supported. Price on request. The order submit action creates a saved inquiry; WhatsApp opening does not send or confirm it. Exact action labels and persisted-first sequencing are finalized in Phase 6. Error text states what failed and what remains saved. No fictional testimonials, invented provenance, guaranteed lead times or material performance. Staff controls use clear verbs: Save draft, Publish, Hide, Move to, Add note.
