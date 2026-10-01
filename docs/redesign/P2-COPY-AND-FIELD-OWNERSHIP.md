# Active homepage and shared-copy ownership

1 October 2026. This is an implementation inventory, not a claim that every page or interface string is editable. The active English homepage uses one `page:home` content document. Pages & journal and Site copy select that record; Site images opens its material chapter. They do not create separate competing drafts.

| Visible field or behavior | Stored owner and type | Editing surface | Public renderer / rule |
|---|---|---|---|
| Hero heading, eyebrow, introduction/search description | ContentDocument.title / eyebrow / description, bounded plain text | Homepage → Hero & opening strip | HomepageDocument; routeMetadata reuses title and description |
| Hero artwork | homepage.heroProductId, existing published ID | Hero piece selector | Current published product image/scene, protected facts and gallery unchanged |
| Primary/secondary hero buttons | homepage.primary / secondary, label + internal href | Hero action fields | Link only to eligible destination; unsafe/external hrefs rejected |
| Annotation and three strip phrases | homepage.annotation / strip[3], plain text | Hero & opening strip | Hero annotation and opening strip |
| Visible chapter order | homepage.sections[], stable IDs / type / enabled | Outline controls | Same typed section order in public and exact saved preview |
| Chapter heading, paragraphs and checklist | document.sections matched by stable ID | Selected chapter | Escaped text, semantic paragraphs/lists; raw HTML rejected |
| Chapter eyebrow and action | homepage.sections[].eyebrow / action | Selected chapter | Eyebrow and checked internal CTA |
| Selected pieces | selected.productIds, ordered array up to 6 | Published-reference selector + Move/Remove | Existing published product cards, no product editing |
| Categories | categories.categories, ordered existing names; empty means current available categories | Category order field | Current counts; first six with native disclosure; no taxonomy changes |
| Material/editorial image | story.image.path / alt / caption | Site images or homepage material chapter | Approved published media, contextual alt and caption |
| Desktop and mobile framing | story.image.desktop/mobile {x,y,ratio} | Independent focal sliders and frame selectors | EditorialImage CSS switches at 780 px; usage only, global media untouched |
| Process steps | steps.items ordered stable IDs, title/body/action | Process chapter | Semantic ordered list; explicit manual customer Send preserved |
| Three customer journeys | journeys.items[3], title/body/product reference/action | Journeys chapter | Current published image reference; text/CTA editable |
| Selected journal stories | journal.articleIds, ordered array up to 6 | Published article selector | Current published article cards; empty section hidden |
| Closing invitation | invitation copy and action | Invitation chapter | Full-width invitation block |
| Extra editorial depth | new hidden story block with paragraphs/checklist/action | Add editorial chapter | Review and enable explicitly; no empty public placeholder |
| Header/footer menu labels, links, ordering and visibility | published SiteSettings.navigation | Navigation & languages | Existing ShopHeader / ShopFrame contract retained |
| Phone and email | published business settings | Existing Atelier settings, protected in this task | ShopFrame contact links; no duplicate home contact values |
| Locale availability | published SiteSettings.localization | Navigation & languages | Existing locale switcher; complete reviewed language journeys remain P6 |
| Other page/policy/article text | existing ContentDocument sections | Pages & journal / Site copy | Existing public content renderer; exact saved preview is currently homepage-only |
| Footer brand statement | hardcoded ShopFrame text | Source only | Remaining global-copy coverage; not claimed editable |
| Interface labels (search, footer headings, skip link, etc.) | source uiText locale dictionary | Source only | Reviewed dictionary; dedicated Studio ownership remains to implement |
| Image/category fallback and disclosure labels | component-owned interface text | Source only | Functional UI language, not an editorial chapter |
| Product facts, forms, galleries and scraper | existing protected contracts | Existing functionality unchanged | Never copied from old site or edited by homepage composer |

## Publication and recovery ownership

Draft save regenerates a server-owned dependency snapshot and writes the document/revision together. Unsaved homepage changes cannot publish. Publication requires the saved version and checks dependency visibility/fingerprints in the same SQL statement. Admin-only publication and existing staff authentication are retained. Optimistic conflicts preserve local edits.

Private preview reads an exact saved revision, including its captured public-only product/article/media dependencies. The preview uses the actual public homepage component. Its shell uses current published navigation/business settings rather than a historical snapshot. Public homepage reads only its published editorial document and resolves referenced records against current published sources, so withdrawn records and invalid destinations do not linger publicly. A saved preview can therefore differ after a dependency changes; save and review again before the next publication.

Restore loads an earlier revision into the editor. Save creates a new draft with a recorded recovery source. Preview and publish are separate actions. Compare covers field values, section ordering, product/article order and crop changes; it omits server-owned dependency snapshots. Hiding the homepage document restores the established existing homepage. No source candidate automatically replaces a missing published homepage.

## Coverage still to expand

T17 still needs editable global/footer/interface copy beyond this inventory. T26 provides safe structured chapters, not a full rich-text mark/quote/link editor across all pages. T16/T58 exact previews and image-slot editing cover the homepage first; all-page slot inventory and focused Story/Process/FAQ editors follow the established contracts. Typed block configuration is additive JSONB; no migration was needed.
