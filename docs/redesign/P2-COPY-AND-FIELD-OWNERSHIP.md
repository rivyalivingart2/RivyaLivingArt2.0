# Active content and shared-copy ownership

1 October 2026. P2 completion inventory; supersedes the earlier homepage-only map. Read `P2-CLOSURE.md` for verification and phase boundaries. This inventory covers supported editorial fields, not every functional string across future pages or Studio operations.

## Homepage and page fields

| Visible field | Stored owner and control | Actual renderer and rule |
|---|---|---|
| Hero/page title, eyebrow and introduction | ContentDocument.title / eyebrow / description; bounded text fields | HomepageDocument / EditorialDocument; metadata reuses title/description |
| Hero artwork | homepage.heroProductId; published piece selector | Existing product image/scene; protected facts and gallery unchanged |
| Hero actions, annotation, strip | homepage.primary / secondary / annotation / strip[3] | Checked internal CTAs and opening strip |
| Chapter type, identity, order and visibility | homepage.sections[]; approved type picker, stable IDs, hide and move controls | Shared typed renderer; keyboard reordering announces position |
| Chapter readiness | homepage.sections[].contentNeeded; review checkbox | Visible unreviewed chapter blocks publication; conditional ideas remain hidden Content needed |
| Heading, paragraphs, checklist and rich blocks | document.sections[]; selected-section editor; body schema version 1 | SectionBody renders semantic paragraphs, strong/em, safe links, blockquote/cite and lists |
| Plain-text compatibility | section.paragraphs derived from rich body | Validator requires exact projection; older plain sections remain supported |
| Chapter eyebrow and action | homepage.sections[].eyebrow / action | Eyebrow and validated internal destination |
| Selected products | selected.productIds, up to six; published selectors and order controls | Existing public cards; saved projection includes current price; no product writes |
| Category display order | categories.categories; existing names | Current categories/counts and disclosure; no taxonomy edits |
| Editorial image usage | chapter.image or page section.image: path, alt, caption | EditorialImage uses approved published derivative; source/global metadata unchanged |
| Desktop/mobile crops | image.desktop/mobile: x, y, ratio; sliders and frame controls | Responsive switch at 780 px; visual crop comparison in ContentCompare |
| Home process steps | steps.items[]: stable ID/title/body/action | Ordered list; manual customer Send remains unchanged |
| Three journeys | journeys.items[3]: title/body/product/action | Existing published image plus editable copy/CTA |
| Journal selection | journal.articleIds, ordered up to six | Public article cards; saved preview captures public reading content; empty section hidden |
| Invitation | invitation copy/action | Full-width invitation block |
| Generic page section outline | sections[].enabled, stable ID and order | EditorialDocument hides disabled sections and preserves active anchors |
| FAQ | heading/body/group/policyHref; question editor and canonical-policy field | Native disclosure, group and stable anchor; server checks linked destination; policy meaning requires editorial review |
| Process stages | section.stage: customer or making; sequence selector | Explicit sequence label; presentation does not create operational stages |
| Materials | section.material: appearance, limitations, care, placement | Semantic definition list and existing care anchors; verified guidance only |
| Generic section action | section.action: label/href | Checked internal CTA |
| Header image | document.image / imageAlt; published-media selector | Page snapshot captures the published image focal position |
| Related products | document.relatedProductIds, up to six | Existing published catalogue only; withdrawn/invalid references block publication |
| Policy effective date | document.effectiveDate; verified real ISO date | Date or explicit not-recorded state; no invented legal facts |
| Staff review/source note | section.sourceNote; bounded text | Staff only; omitted from public content and recommendation snapshots |
| Translations | existing document.translations controls | Optional overrides/fallback; translated paragraphs suppress English rich body; complete journeys P6 |
| Draft/public/recovery | Existing content and revision service | Version labels, exact saved preview, compare and restore into a new draft |

## Shared website copy — all 22 supported fields

The fixed inventory is `page:site-copy` in the existing content service. Site copy opens it by default. Each field is one bounded plain-text paragraph with a stable kebab-case section ID. Grouped search locates fields; other page prose opens its owning page rather than a second copy. Published-only readers and normal draft/preview/publish/revision gates apply. The record is internal and never creates a public route/sitemap entry.

| Field | Public owner / location |
|---|---|
| collections | ShopHeader collections label |
| searchPieces | ShopHeader search button accessible label |
| beginPiece | ShopHeader / ShopFrame commission action |
| openNavigation | ShopHeader mobile menu accessible label |
| closeNavigation | ShopHeader / Dialog mobile close accessible label |
| exploreTitle | ShopHeader navigation panel title |
| theCollections | ShopHeader collections group |
| findPiece | ShopHeader search heading |
| searchCollection | ShopHeader search prompt |
| exploreResults | ShopHeader results action |
| browseAllPieces | ShopHeader browse action |
| footerExplore | ShopFrame first footer heading |
| footerAtelier | ShopFrame atelier heading |
| footerTalk | ShopFrame contact heading |
| emailAtelier | ShopFrame email link label, not its address |
| contact | ShopFrame contact page label |
| customPieces | ShopFrame closing statement |
| skipMain | Root layout skip-to-content link |
| footer-statement | ShopFrame brand statement |
| show-categories | HomepageDocument category disclosure |
| read-story | HomepageDocument journal link |
| discover-piece | HomepageDocument selected-piece link |
| hero-fallback | HomepageDocument missing hero-image text |

Existing reviewed locale dictionaries remain fallbacks; optional section translations belong to this same record. Publication revalidates the root layout. A public shell revision marker supports anonymous readback. Individual navigation-item labels, destinations and visibility remain owned by SiteSettings.navigation, not duplicated here.

## Separate and protected owners

- Phone, email, WhatsApp and business facts remain in published Business settings. The copy editor has no contact-value controls; the required Imprint contact section stays locked.
- Products, factual descriptions, specifications, prices, forms, taxonomy, galleries and media metadata retain their existing contracts. Editorial selection/crops reference them read-only.
- Scraper sources, settings, scheduling and operation are excluded. No old-product transfer.
- Locale availability remains in SiteSettings.localization. Other form/operational messages remain in their owning components and services; broader public/Studio improvements are P4/P5.

## Publication and preview boundary

Draft save strips client snapshots and captures current public dependencies server-side. Publication requires the exact saved version and unchanged editorial content, checks role and dependency fingerprints atomically, and appends revision/audit history. Editor accounts cannot publish. Failed anonymous verification has a separate retry that does not publish again.

New saved previews use captured text, image positions and product/article references through actual public renderers. Older generic text revisions without snapshots stay readable with an explicit current-dependency notice; save again before publishing. Navigation and business settings remain current. The outer preview skip-link label also stays current; a saved shared-copy preview applies its selected labels to the real header/footer. Published pages use current published references and never fall back to drafts.

Restore loads a selected revision into the editor; Save creates a new attributable draft. Preview and Publish remain separate. Comparison includes text, order, reference and crop changes, excluding server-owned snapshots. Conflicts and expired sessions retain local work; record switching resets the previous record's status.

Full Drive review/assignment coverage is P3. Full detailed public-page and 18-section homepage restoration is P4. Optional video needs genuine approved assets, poster/fallback and later accessibility/performance checks.
