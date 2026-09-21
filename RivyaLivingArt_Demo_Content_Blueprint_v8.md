# RivyaLivingArt — Demo Content and Studio Fixture Blueprint

**Revision 8 · 21 September 2026**  
**Active specification:** `RivyaLivingArt_Master_Build_Prompt_v8.md`  
**Purpose:** A deterministic, editable, removable seed-content brief for Codex. This file lists planned fixtures and supplies sample copy; it is **not** an export of existing products, orders, customers or testimonials. No database records are created by this Markdown file.

**Carried-forward Revision 7 scope note:** The named content, counts, state coverage and cleanup rules are retained from the immediately preceding blueprint. No fixture or module is added for the owner-rejected S01–S04 features. References below to design or personalization approval mean manual WhatsApp discussion/internal sample notes, not a client-facing approval portal. Keep ordinary CMS draft review and content publication separate from that excluded feature.

## Revision 8 delivery — fixtures first, database later

The named product concepts, article briefs, FAQs, fictional reviews and order scenarios below are preserved. Complete them as versioned typed source fixtures during R8-1–5 for the frontend and Studio visual preview. Complete article bodies are still required; do not count briefs as finished posts. Keep stable fixture/content IDs and relationships so the same dataset can be seeded through actual services in R8-9. This file itself creates no database rows.

Frontend previews use only synthetic data and clearly labelled local simulations. A browser-local demo edit/removal is not a database action; report its scope. Real manual removal, idempotent persistent seeding, shared-media protection and cross-session/server durability are implemented and tested after the visual review. Source fixtures must not leak into live public queries or shipped mock-auth bypasses. Do not require production credentials to render the early UI.

Follow `RivyaLivingArt_Frontend_First_Plan_v8.md` and master Section 23 for stage boundaries. Commit/push each completed tested content/fixture slice; a 120-record plan is not evidence that 120 records were authored or inserted.

## 1. Counts and business rules

Create an initial batch of **120 products (84 large / 24 memory / 12 personal), 36 complete blog drafts, 42 FAQs, 24 explicitly fictional testimonial examples, and 40 inquiry/order scenarios**, plus the module coverage below. Large furniture remains the primary business. All ordering stays enquiry-first and WhatsApp-finalized; no checkout, payment gateway or customer account is added.

Tag every fixture with server-owned demo origin, stable batch ID, fixture key and version. Build the owner's manual individual/selected/type/batch removal controls inside Studio. Keep production public reads, real reports, messages and customer evidence free of demo records. Preserve original Drive files and shared real assets during cleanup. Follow master Section 18 for dependency locks, dry runs, reauthentication, edit protection and no automatic reseed.

Default fixtures are development/protected-preview data. A persistent demo banner and local labels are mandatory. All sample material, price, dimension, lead-time, identity and review information is fictional unless separately verified and promoted through the allowed workflow. Use an `.invalid` email domain and non-contactable identity labels, not plausible phone numbers. Store actual test credentials only through a secure isolated test setup, never this seed content.

## 2. Product fixture requirements

Each record needs a distinct title/slug/fixture key, tier and category, a 35–60-word card/summary description, a 100–180-word original demo detail description, typed example dimensions with units where relevant, material/finish relation samples, a price mode, sample amount only where appropriate, made-to-order/ready-to-ship UI cases, customization schema version, demo lead-time example, publication/draft state and an asset/fallback mapping.

Distribute price modes across the 120 records: **60 ON_REQUEST, 36 STARTING_FROM, 24 FIXED** as a clean-seed target, with most ON_REQUEST items in the large tier. Sample monetary values are integer minor units in INR and never displayed as real quotes. Cover draft, in-review, approved, demo-visible and archived UI states without conflating published revision and working draft. Define deterministic state allocation in the seed manifest.

Required customization examples: large objects collect intended use, proposed dimensions, material/finish preference, site access, location, timeline and optional reference; memory pieces collect occasion, names/dates, format and private reference; small gifts collect permitted personalization, variant, quantity and message. Keep private data out of public content and preserve request/form snapshots.

### Asset policy for the catalogue

The identified Drive collection is a concept-image source. Its README reports 35 product portraits and 10 room scenes, not 45 distinct products. The source-index matches below are **candidates from names**, not pixel-reviewed approvals. Verify actual image geometry and scale before mapping. A name such as “desk object” is not a large desk. Existing render IDs 018 and 032 are not automatically mapped to furniture.

For a concept that has no matching image, use a clearly designed “Demo concept — visual pending” placeholder in protected preview and issue a brief in `RivyaLivingArt_Asset_Generation_Prompts_v8.md`. Do not attach the same unrelated table photograph to many allegedly different products. Reuse a visual only when it genuinely represents the same family/reference and is labelled accordingly. Missing media must not prevent seeding, but it remains an explicit quality blocker for final presentation.

## 3. Named product register — 120 planned records

All names below are fictional catalogue concepts for interface development, not claims that these designs are manufactured or offered.

| ID | Tier | Category | Demo title | Candidate source / request |
|---|---|---|---|---|
| DP001 | LARGE | Dining tables | Riverline Live-Edge Dining Table | PRODUCT-HERO-001; verify match |
| DP002 | LARGE | Dining tables | Stillwater Full-Pour Dining Table | PRODUCT-HERO-002; verify match |
| DP003 | LARGE | Dining tables | Verdant Split-Slab Dining Table | Matching image pending; owner prompt |
| DP004 | LARGE | Dining tables | Monolith Long-Span Dining Table | PRODUCT-HERO-010; verify match |
| DP005 | LARGE | Dining tables | Estuary Oval Dining Table | Matching image pending; owner prompt |
| DP006 | LARGE | Dining tables | Canopy Round Dining Table | Matching image pending; owner prompt |
| DP007 | LARGE | Dining tables | Tidal Rectangular Dining Table | Matching image pending; owner prompt |
| DP008 | LARGE | Dining tables | Umber Twin-Base Dining Table | Matching image pending; owner prompt |
| DP009 | LARGE | Dining tables | Lagoon Pedestal Dining Table | Matching image pending; owner prompt |
| DP010 | LARGE | Dining tables | Ridge Bronze-Inlay Dining Table | Matching image pending; owner prompt |
| DP011 | LARGE | Dining tables | Dune Smoked-Resin Dining Table | Matching image pending; owner prompt |
| DP012 | LARGE | Dining tables | Grove Communal Dining Table | Matching image pending; owner prompt |
| DP013 | LARGE | Coffee and centre tables | Basin Shallow-Pour Coffee Table | PRODUCT-HERO-003; verify match |
| DP014 | LARGE | Coffee and centre tables | Orbit Circular Centre Table | PRODUCT-HERO-004; verify match |
| DP015 | LARGE | Coffee and centre tables | Contour Oval Coffee Table | Matching image pending; owner prompt |
| DP016 | LARGE | Coffee and centre tables | Drift Nesting Coffee Table | Matching image pending; owner prompt |
| DP017 | LARGE | Coffee and centre tables | Pebble Sculptural Coffee Table | Matching image pending; owner prompt |
| DP018 | LARGE | Coffee and centre tables | Delta Two-Level Coffee Table | Matching image pending; owner prompt |
| DP019 | LARGE | Coffee and centre tables | Cove Low Coffee Table | Matching image pending; owner prompt |
| DP020 | LARGE | Coffee and centre tables | Halo Ring-Base Coffee Table | Matching image pending; owner prompt |
| DP021 | LARGE | Coffee and centre tables | Moss Square Coffee Table | Matching image pending; owner prompt |
| DP022 | LARGE | Coffee and centre tables | Slate River Coffee Table | Matching image pending; owner prompt |
| DP023 | LARGE | Coffee and centre tables | Current Asymmetric Coffee Table | Matching image pending; owner prompt |
| DP024 | LARGE | Coffee and centre tables | Terra Plinth Coffee Table | Matching image pending; owner prompt |
| DP025 | LARGE | Side and bedside tables | Twinleaf Matched Side-Table Pair | PRODUCT-HERO-008; verify match |
| DP026 | LARGE | Side and bedside tables | Dewdrop Pedestal Side Table | Matching image pending; owner prompt |
| DP027 | LARGE | Side and bedside tables | Arc C-Shape Side Table | Matching image pending; owner prompt |
| DP028 | LARGE | Side and bedside tables | Reed Tall Side Table | Matching image pending; owner prompt |
| DP029 | LARGE | Side and bedside tables | Nocturne Bedside Table | Matching image pending; owner prompt |
| DP030 | LARGE | Side and bedside tables | Loam Drum Side Table | Matching image pending; owner prompt |
| DP031 | LARGE | Side and bedside tables | Lumen Translucent Side Table | Matching image pending; owner prompt |
| DP032 | LARGE | Side and bedside tables | Brook Floating-Top Side Table | Matching image pending; owner prompt |
| DP033 | LARGE | Side and bedside tables | Silt Compact Bedside Table | Matching image pending; owner prompt |
| DP034 | LARGE | Side and bedside tables | Eclipse Round Side Table | Matching image pending; owner prompt |
| DP035 | LARGE | Consoles | Span Narrow Console | PRODUCT-HERO-005; verify match |
| DP036 | LARGE | Consoles | Root Sculptural-Base Console | PRODUCT-HERO-006; verify match |
| DP037 | LARGE | Consoles | Passage Entry Console | Matching image pending; owner prompt |
| DP038 | LARGE | Consoles | Horizon Long Console | Matching image pending; owner prompt |
| DP039 | LARGE | Consoles | Meadow Floating-Effect Console | Matching image pending; owner prompt |
| DP040 | LARGE | Consoles | Trace Metal-Frame Console | Matching image pending; owner prompt |
| DP041 | LARGE | Consoles | Sienna Curved Console | Matching image pending; owner prompt |
| DP042 | LARGE | Consoles | Canyon Split-Level Console | Matching image pending; owner prompt |
| DP043 | LARGE | Chairs stools and benches | Petal Sculptural Chair | Matching image pending; owner prompt |
| DP044 | LARGE | Chairs stools and benches | Crescent Lounge Chair | Matching image pending; owner prompt |
| DP045 | LARGE | Chairs stools and benches | Aster Dining Chair | Matching image pending; owner prompt |
| DP046 | LARGE | Chairs stools and benches | Rill Counter Stool | Matching image pending; owner prompt |
| DP047 | LARGE | Chairs stools and benches | Flint Accent Stool | Matching image pending; owner prompt |
| DP048 | LARGE | Chairs stools and benches | Threshold Entry Bench | PRODUCT-HERO-009; verify match |
| DP049 | LARGE | Chairs stools and benches | Forest Long Bench | Matching image pending; owner prompt |
| DP050 | LARGE | Chairs stools and benches | Fold Sculptural Bench | Matching image pending; owner prompt |
| DP051 | LARGE | Desks | Single-Slab Atelier Desk | PRODUCT-HERO-007; verify match |
| DP052 | LARGE | Desks | Meridian Writing Desk | Matching image pending; owner prompt |
| DP053 | LARGE | Desks | Stillpoint Study Desk | Matching image pending; owner prompt |
| DP054 | LARGE | Desks | Haven Compact Desk | Matching image pending; owner prompt |
| DP055 | LARGE | Desks | Linework Executive Desk | Matching image pending; owner prompt |
| DP056 | LARGE | Desks | Terrace Studio Desk | Matching image pending; owner prompt |
| DP057 | LARGE | Wall art and reliefs | Horizon Band Wall Panel | PRODUCT-HERO-011; verify match |
| DP058 | LARGE | Wall art and reliefs | Vertical Drop Wall Panel | PRODUCT-HERO-012; verify match |
| DP059 | LARGE | Wall art and reliefs | Sequence Wall Triptych | PRODUCT-HERO-013; verify match |
| DP060 | LARGE | Wall art and reliefs | Strata Layered Wall Relief | PRODUCT-HERO-014; verify match |
| DP061 | LARGE | Wall art and reliefs | Solstice Circular Wall Piece | PRODUCT-HERO-015; verify match |
| DP062 | LARGE | Wall art and reliefs | Tide Botanical Wall Panel | Matching image pending; owner prompt |
| DP063 | LARGE | Wall art and reliefs | Mist Textured Wall Diptych | Matching image pending; owner prompt |
| DP064 | LARGE | Wall art and reliefs | Verdure Large Wall Disc | Matching image pending; owner prompt |
| DP065 | LARGE | Wall art and reliefs | Contour Flow Wall Relief | Matching image pending; owner prompt |
| DP066 | LARGE | Wall art and reliefs | Amber Veil Wall Panel | Matching image pending; owner prompt |
| DP067 | LARGE | Wall art and reliefs | Stonewave Oversized Wall Art | Matching image pending; owner prompt |
| DP068 | LARGE | Wall art and reliefs | Rivergrid Architectural Wall Set | Matching image pending; owner prompt |
| DP069 | LARGE | Sculptural objects | Lattice Resin-and-3D Sculpture | PRODUCT-HERO-016; verify match |
| DP070 | LARGE | Sculptural objects | Parametric Floor Vessel | PRODUCT-HERO-017; verify match |
| DP071 | LARGE | Sculptural objects | Cast Architectural Study | PRODUCT-HERO-019; verify match |
| DP072 | LARGE | Sculptural objects | Form Study I Sculpture | PRODUCT-HERO-024; verify match |
| DP073 | LARGE | Sculptural objects | Form Study II Sculpture | PRODUCT-HERO-025; verify match |
| DP074 | LARGE | Sculptural objects | Material Column Sculpture | PRODUCT-HERO-026; verify match |
| DP075 | LARGE | Sculptural objects | Form Study III Sculpture | PRODUCT-HERO-027; verify match |
| DP076 | LARGE | Sculptural objects | Arc Freestanding Resin Sculpture | Matching image pending; owner prompt |
| DP077 | LARGE | Architectural installations | Estuary Reception Counter | Matching image pending; owner prompt |
| DP078 | LARGE | Architectural installations | Canopy Room-Divider Concept | Matching image pending; owner prompt |
| DP079 | LARGE | Architectural installations | Monsoon Feature-Wall Concept | Matching image pending; owner prompt |
| DP080 | LARGE | Architectural installations | Grove Resin-and-Wood Screen | Matching image pending; owner prompt |
| DP081 | LARGE | Architectural installations | Contour Hospitality Table Installation | Matching image pending; owner prompt |
| DP082 | LARGE | Architectural installations | Stillwater Lobby Art Installation | Matching image pending; owner prompt |
| DP083 | LARGE | Architectural installations | Bronzeleaf Display Plinth Set | Matching image pending; owner prompt |
| DP084 | LARGE | Architectural installations | Tidal Architectural Panel Installation | Matching image pending; owner prompt |
| DP085 | MEDIUM | Flower preservation | Vow Framed Varmala Keepsake | PRODUCT-HERO-020; verify match |
| DP086 | MEDIUM | Flower preservation | Forever Solid-Block Varmala Keepsake | PRODUCT-HERO-021; verify match |
| DP087 | MEDIUM | Flower preservation | Petal Story Bouquet Frame | Matching image pending; owner prompt |
| DP088 | MEDIUM | Flower preservation | Meadow Wedding-Flower Disc | Matching image pending; owner prompt |
| DP089 | MEDIUM | Flower preservation | Aster Single-Bloom Keepsake | PRODUCT-HERO-022; verify match |
| DP090 | MEDIUM | Flower preservation | Memory Garden Flower Shadowbox | PRODUCT-HERO-023; verify match |
| DP091 | MEDIUM | Preservation clocks | Hourglass Floral Wall Clock | Matching image pending; owner prompt |
| DP092 | MEDIUM | Preservation clocks | Petal Hour Round Clock | Matching image pending; owner prompt |
| DP093 | MEDIUM | Preservation clocks | Evergreen Botanical Desk Clock | Matching image pending; owner prompt |
| DP094 | MEDIUM | Preservation clocks | Moment Preserved-Flower Clock | Matching image pending; owner prompt |
| DP095 | MEDIUM | Ceremony trays | Union Engagement Tray | Matching image pending; owner prompt |
| DP096 | MEDIUM | Ceremony trays | Promise Ring Platter | Matching image pending; owner prompt |
| DP097 | MEDIUM | Ceremony trays | Gather Celebration Tray | Matching image pending; owner prompt |
| DP098 | MEDIUM | Ceremony trays | Bloom Paired Ring Dishes | Matching image pending; owner prompt |
| DP099 | MEDIUM | Invitation and photo memories | Letterlight Invitation Frame | Matching image pending; owner prompt |
| DP100 | MEDIUM | Invitation and photo memories | Our Chapter Wedding-Card Block | Matching image pending; owner prompt |
| DP101 | MEDIUM | Invitation and photo memories | Together Couple-Memory Frame | Matching image pending; owner prompt |
| DP102 | MEDIUM | Invitation and photo memories | Anniversary Story Display | Matching image pending; owner prompt |
| DP103 | MEDIUM | Nameplates and celebration pieces | Threshold Family Nameplate | Matching image pending; owner prompt |
| DP104 | MEDIUM | Nameplates and celebration pieces | Welcome Botanical Nameplate | Matching image pending; owner prompt |
| DP105 | MEDIUM | Nameplates and celebration pieces | Blessing Pooja Display | Matching image pending; owner prompt |
| DP106 | MEDIUM | Nameplates and celebration pieces | Festival Memory Plaque | Matching image pending; owner prompt |
| DP107 | MEDIUM | Baby keepsakes | First Chapter Baby Keepsake | Matching image pending; owner prompt |
| DP108 | MEDIUM | Baby keepsakes | Little Bloom Memory Frame | Matching image pending; owner prompt |
| DP109 | SMALL | Personal art and gifting | Botanical Resin Pendant | Matching image pending; owner prompt |
| DP110 | SMALL | Personal art and gifting | Petal Drop Earrings | Matching image pending; owner prompt |
| DP111 | SMALL | Personal art and gifting | Thread of Light Resin Rakhi | Matching image pending; owner prompt |
| DP112 | SMALL | Personal art and gifting | Initial Story Keychain | Matching image pending; owner prompt |
| DP113 | SMALL | Personal art and gifting | Chaptermark Flower Bookmark | Matching image pending; owner prompt |
| DP114 | SMALL | Personal art and gifting | Everyday Resin Coaster Set | PRODUCT-HERO-029; verify match |
| DP115 | SMALL | Personal art and gifting | Palm Mini Serving Tray | PRODUCT-HERO-028; verify match |
| DP116 | SMALL | Personal art and gifting | Still Form Catch-All Bowl | PRODUCT-HERO-030; verify match |
| DP117 | SMALL | Personal art and gifting | Twinleaf Mini Bookends | PRODUCT-HERO-031; verify match |
| DP118 | SMALL | Personal art and gifting | Pocketworld Paperweight | PRODUCT-HERO-033; verify match |
| DP119 | SMALL | Personal art and gifting | Promise Mini Ring Dish | PRODUCT-HERO-034; verify match |
| DP120 | SMALL | Personal art and gifting | Little Archive Keepsake Box | PRODUCT-HERO-035; verify match |

## 4. Thirty-six blog briefs — complete bodies required at implementation

The following are editorial assignments, not thirty-six completed articles. Codex or a ChatGPT content slice must author and validate every full body before blog seeding is accepted. Write original, labelled demo drafts of approximately 600–1,000 useful words, not repetitive filler. Include an excerpt, purpose-built headings, proposed slug, safe related-demo references, a suitable image/placeholder and owner-review notes. Keep business policies, safety specifications, environmental claims and real project histories out unless documented and approved.

Do not invent an author biography, experience, certification or customer success story. The display author may be “RivyaLivingArt — Demo Editorial.” No fabricated publication history; use deterministic sample timestamps. Generated article text is untrusted content: validate rich-text schema and sanitize permitted pasted markup through the existing renderer.

| ID | Focus | Draft title | Writing brief |
|---|---|---|---|
| DB001 | LARGE | A Room Begins with a Statement Table | Scale, visual balance, circulation questions and a consultation checklist. |
| DB002 | LARGE | Reading the Grain: Wood and Resin in a Shared Composition | Explain the visual relationship using labelled concept images, not material-performance promises. |
| DB003 | LARGE | Round, Oval or Rectangular: A Dining-Table Planning Notebook | Room-shape considerations; measurements the owner should verify; no universal seating guarantee. |
| DB004 | LARGE | Coffee Tables as Sculptural Objects | Silhouette, height relationships, negative space and varied compositions. |
| DB005 | LARGE | The Quiet Role of a Side Table | Different room roles and a practical brief for a custom side table. |
| DB006 | LARGE | An Entryway Built Around One Console | Visual rhythm, a restrained styling approach and project questions. |
| DB007 | LARGE | Pairing Resin Art with Warm Neutral Interiors | Illustrative palettes and texture relationships without copying reference interiors. |
| DB008 | LARGE | A Guide to Describing Your Commission | Purpose, dimensions, references, timeline and conversation-ready questions. |
| DB009 | LARGE | What to Include in an Architect’s Enquiry | Project context, drawings, access constraints and specification requests. |
| DB010 | LARGE | Wall Art at Architectural Scale | Single panel, diptych and triptych composition studies; dimensions remain proposed. |
| DB011 | LARGE | From a Mood Board to a Material Conversation | Separate inspiration from approved physical samples and final decisions. |
| DB012 | LARGE | Light, Transparency and the Look of Resin | Perceptual/art-direction discussion; avoid certifying a real resin formulation. |
| DB013 | LARGE | Chairs, Benches and the Shape of a Room | Sculptural form as a design idea; comfort/load capacity require real evaluation. |
| DB014 | LARGE | Planning a Large Piece for Delivery Access | What to measure and discuss; actual transport/installation policies are owner-confirmed. |
| DB015 | LARGE | Why a Visualization Is Not a Final Specification | Concept render, approved drawing, material sample and physical object distinctions. |
| DB016 | LARGE | A Home Office with a Material Focal Point | A design notebook for desk scale, accessories and quiet visual hierarchy. |
| DB017 | LARGE | A Small Vocabulary of Finishes and Forms | Owner-review draft terminology for visual choices; no chemical/performance assertions. |
| DB018 | LARGE | The Project Story Behind a Collectible Interior | Clearly fictional example brief with challenges, choices and questions—not a delivered project. |
| DB019 | MEDIUM | Turning a Wedding Memory into a Design Brief | Meaningful details to discuss; do not prescribe physical flower handling. |
| DB020 | MEDIUM | Choosing a Format for a Bouquet Keepsake | Framed, block and circular visual approaches using concept images. |
| DB021 | MEDIUM | Names and Dates: A Personalization Proofreading Checklist | Readable spelling, date format, typography and approval before production. |
| DB022 | MEDIUM | Designing a Wedding-Invitation Keepsake | Composition and privacy; original documents handled only under approved instructions. |
| DB023 | MEDIUM | A Preservation Clock as a Memory Object | Placement and visual storytelling; no claims about mechanisms not specified. |
| DB024 | MEDIUM | Before You Send Sentimental Materials | Request current studio instructions; never invent shipping or preservation guarantees. |
| DB025 | MEDIUM | A Family Nameplate with a Personal Story | Typography, placement and name-privacy considerations. |
| DB026 | MEDIUM | Photographs, Privacy and Memory Art | Permission-aware selection and a limited-sharing approach, not legal advice. |
| DB027 | SMALL | Small Objects with a Personal Meaning | Gifting choices based on message, occasion and recipient. |
| DB028 | SMALL | A Cohesive Gift Set without Repeating Every Detail | Coordinating shapes and colours; quantity and packaging remain requests. |
| DB029 | SMALL | Personalized Resin Jewellery: Preparing Your Brief | Aesthetic choices; avoid allergy, material-safety or medical claims. |
| DB030 | SMALL | Seasonal Gifting without the Marketplace Clutter | Calm editorial presentation, recipient focus and timely enquiry. |
| DB031 | SMALL | Corporate Gifts as Small Design Objects | Sample design brief for quantity, approvals and deadlines; no client logos. |
| DB032 | SMALL | Choosing Initials, Colours and a Short Message | A personalization guide and proof checklist without fabricated available options. |
| DB033 | STUDIO | Inside a Material-Led Design Notebook | Illustrative creative planning, not documentary workshop access. |
| DB034 | STUDIO | How to Read a Product Specification | Units, optional fields, unknown values and questions to ask. |
| DB035 | STUDIO | Preparing a Clear WhatsApp Enquiry | What the request captures and what is agreed later; no payment flow. |
| DB036 | STUDIO | From Draft to Approved Design: A Client Checklist | Reviewing visual direction and actual specifications before a final agreement. |

### ChatGPT batch-writing prompt

```text
Write the next six unfinished RivyaLivingArt demo blog articles from the named DB
briefs. Use the current master and this blueprint. These are fictional editorial
fixtures for protected preview, not approved live business copy. Produce complete,
original 600–1,000-word drafts with ID, title, slug, excerpt, purpose-built headings,
body, related DP references, image-brief ID and factual-review notes. Avoid repeated
paragraph templates. Do not invent material safety guarantees, actual projects,
certifications, real reviews or business policy. Return structured Markdown content
for review; Codex will validate and map it into the actual Tiptap schema. Do not
claim the drafts have been uploaded, seeded or published. Preserve existing approved
files and mark only the articles actually completed in this batch.
```

## 5. Forty-two FAQ records — supplied sample answers

These answers are **demo/owner-review drafts**. They do not establish final shipping, preservation, return, privacy or manufacturing policies. Store their IDs, group, question, answer and references in the custom CMS. Keep them out of live publication until individually reviewed.

### DF001 · Commissioning
**Can I request a custom dining table?**

Use the commission enquiry to describe the intended piece. The studio reviews the request and confirms what can be offered.

### DF002 · Commissioning
**What information should my furniture enquiry include?**

Share the object type, proposed dimensions, preferred visual direction, location and timing. Attach references only when you have permission to share them.

### DF003 · Commissioning
**Can I choose a different size?**

Add the size you have in mind to the request. Availability and suitability are confirmed during consultation, not by the demo options.

### DF004 · Commissioning
**Can an architect submit a project brief?**

The project enquiry can capture professional project context and reference plans. Access and installation details should be discussed directly.

### DF005 · Commissioning
**Do you offer chairs and benches?**

This demo shows possible catalogue categories. The actual offered range must be confirmed by the owner before live publication.

### DF006 · Commissioning
**Does a render show the final manufactured object?**

A concept visualization illustrates a design direction. Final appearance, specifications and feasibility need separate approval.

### DF007 · Materials and customization
**How do I describe a resin colour?**

Share an approved reference and describe the intended impression. Screens and concepts do not establish an exact physical match.

### DF008 · Materials and customization
**Can I discuss wood and resin combinations?**

Record your preferences in the enquiry. The studio will confirm actual options rather than treating demo selections as available inventory.

### DF009 · Materials and customization
**Where can I find product dimensions?**

Look at the specifications panel. Demo dimensions are sample values; request verified dimensions for a real commission.

### DF010 · Materials and customization
**Can I request a particular finish?**

Choose a listed option or describe your preference. The final finish must be agreed using the actual product information.

### DF011 · Materials and customization
**Can I add personal text or initials?**

Applicable products include personalization fields. Check spelling and formatting carefully before the final approval.

### DF012 · Materials and customization
**Are sample prices a binding quote?**

No. Demo figures illustrate interface behavior. Real price and scope are confirmed by the studio for the actual request.

### DF013 · Memory and preservation
**Can I enquire about varmala preservation?**

Use the memory-art enquiry to describe the flowers and desired format. The studio must confirm the process and suitability.

### DF014 · Memory and preservation
**How should I send my flowers?**

Ask the studio for its current written instructions before sending anything. This sample answer intentionally does not invent packaging or transport rules.

### DF015 · Memory and preservation
**Can I include a wedding invitation?**

Describe the material and desired arrangement. Share scans or originals only under the agreed process and with permission.

### DF016 · Memory and preservation
**Can I preview names and dates?**

Request a personalization proof during the design discussion. Verify every name and date before approval.

### DF017 · Memory and preservation
**Can I upload a private reference photograph?**

The enquiry supports private references for authorized staff. Publication or other reuse needs a separate appropriate permission.

### DF018 · Memory and preservation
**Can every sentimental object be preserved?**

Suitability requires review of the actual object and the studio process. Do not rely on a demo design as a preservation guarantee.

### DF019 · Personal art and gifting
**Can I personalize a small gift?**

Applicable products offer fields for a name, initial, colour or short message. Actual available options are confirmed for the live product.

### DF020 · Personal art and gifting
**Can I request multiple gifts together?**

Enter the quantity and relevant notes. Pricing, packaging and timing are agreed directly for the actual request.

### DF021 · Personal art and gifting
**Can I enquire about corporate gifting?**

Describe the intended recipients, quantity and timing. Do not upload a company logo unless you have permission to use it.

### DF022 · Personal art and gifting
**Are festive products always available?**

Demo collections illustrate merchandising possibilities. Confirm current availability with the studio.

### DF023 · Personal art and gifting
**Can I choose gift packaging?**

Add the request to your notes. Packaging options are subject to the actual offer and confirmation.

### DF024 · Personal art and gifting
**Can a design be repeated for a set?**

Describe the desired consistency and variation. The studio will confirm the appropriate design and production approach.

### DF025 · Enquiries and quotations
**Is there an online checkout?**

No. The website saves your enquiry and helps you continue the discussion on WhatsApp; it does not process online payment.

### DF026 · Enquiries and quotations
**Do I need a customer account?**

No customer registration is required. Login is reserved for authorized Studio staff.

### DF027 · Enquiries and quotations
**What happens after I submit a request?**

A successful submission saves the request and offers a WhatsApp continuation. That action alone is not order acceptance.

### DF028 · Enquiries and quotations
**Does opening WhatsApp confirm my order?**

No. A link click does not establish that a message was sent, a quote was accepted or a payment was made.

### DF029 · Enquiries and quotations
**How do I refer to an existing request?**

Use the reference shown after a successful save. Staff can use it to locate the details you submitted.

### DF030 · Enquiries and quotations
**What can I do if WhatsApp does not open?**

Use the retry or copy-summary fallback, or the supplied phone/email contact. A saved request remains distinct from a sent message.

### DF031 · Delivery installation and care
**How long will a piece take?**

Lead time depends on the real piece and agreed work. The owner must replace sample timing with verified information before live publication.

### DF032 · Delivery installation and care
**Do you deliver to my location?**

Include your delivery location in the enquiry. Service area and charges require confirmation.

### DF033 · Delivery installation and care
**Is installation included?**

Ask for the scope to be stated in your quote. This sample does not promise installation or include hidden charges.

### DF034 · Delivery installation and care
**What access details are useful for large furniture?**

Describe access constraints and provide measurements or drawings requested by the studio. Do not assume a concept will fit a particular route.

### DF035 · Delivery installation and care
**Where can I get care instructions?**

Use the approved instructions for the actual materials and finish. This demo does not establish temperature, chemical or exposure limits.

### DF036 · Delivery installation and care
**Are returns and damage policies available?**

Only the owner-approved policies should be published as business terms. Contact the studio for the applicable current policy.

### DF037 · Website privacy and demo
**Why is this item marked Demo?**

It is sample content used to demonstrate the website. It is not proof of current stock, an actual commission or a real offer.

### DF038 · Website privacy and demo
**Are demo testimonials real reviews?**

No. They are explicitly fictional layout examples and must not be used as customer endorsements.

### DF039 · Website privacy and demo
**Are all gallery images product photographs?**

Media can include labelled concept visualizations. Check the image context and ask for real product evidence where needed.

### DF040 · Website privacy and demo
**Who can access my uploaded reference?**

Private enquiry files are intended for authorized staff under the applicable consent and access rules, not the public media gallery.

### DF041 · Website privacy and demo
**Does this site require a Google login?**

The public website does not require a Google login. Drive is used as a build-time asset source, not the visitor image host.

### DF042 · Website privacy and demo
**How do I ask about privacy or my enquiry?**

Use the supplied studio contact details and your request reference. The owner must approve the final privacy and retention wording.

## 6. Twenty-four fictional testimonial fixtures

Every record is labelled **“Fictional sample — not a customer review.”** Display identity `Demo Reviewer 01` etc. Use initials or a neutral abstract avatar, not generated or borrowed human faces. Do not display a verified-purchase badge, genuine customer location, public rating/review schema or an endorsement claim. These fixtures cannot be converted to real reviews by editing their demo flag.

| ID | Fixture identity | Fictional sample copy |
|---|---|---|
| DT001 | Demo Reviewer 01 | The sample table gives the room a calm focal point without overwhelming the surrounding furniture. |
| DT002 | Demo Reviewer 02 | This example highlights how useful a clear dimension drawing can be during a design conversation. |
| DT003 | Demo Reviewer 03 | The concept pairs a strong silhouette with enough empty space to appreciate the material. |
| DT004 | Demo Reviewer 04 | The sample gallery makes it easy to compare the full object with its close-up details. |
| DT005 | Demo Reviewer 05 | This fictional project shows how an entry console can connect different textures in a room. |
| DT006 | Demo Reviewer 06 | The example presentation keeps the focus on the object rather than unnecessary decorative effects. |
| DT007 | Demo Reviewer 07 | This sample response describes a client who appreciated seeing their preferences gathered into one brief. |
| DT008 | Demo Reviewer 08 | The concept colour palette feels quiet and works well with the surrounding neutral materials. |
| DT009 | Demo Reviewer 09 | The example side-table pair demonstrates how two related objects can still have individual character. |
| DT010 | Demo Reviewer 10 | This fictional chair study presents a memorable shape and invites a more detailed specification discussion. |
| DT011 | Demo Reviewer 11 | The sample project summary makes the sequence from enquiry to design review easy to understand. |
| DT012 | Demo Reviewer 12 | This example illustrates a considered balance between sculptural presence and practical room planning. |
| DT013 | Demo Reviewer 13 | The sample preservation frame keeps the flowers as the visual centre of the composition. |
| DT014 | Demo Reviewer 14 | This fictional memory-art response emphasizes the importance of checking every name and date. |
| DT015 | Demo Reviewer 15 | The concept clock combines a useful object with a personal visual story. |
| DT016 | Demo Reviewer 16 | This sample review describes how a clear layout can make a keepsake feel less crowded. |
| DT017 | Demo Reviewer 17 | The example invitation frame leaves enough space around the details that matter most. |
| DT018 | Demo Reviewer 18 | This fictional nameplate concept feels personal while keeping the lettering easy to read. |
| DT019 | Demo Reviewer 19 | The sample gift set shares a consistent colour direction without making every object identical. |
| DT020 | Demo Reviewer 20 | This example bookmark shows how a small format can still carry a thoughtful design idea. |
| DT021 | Demo Reviewer 21 | The fictional jewellery concept uses restrained detail rather than a busy arrangement. |
| DT022 | Demo Reviewer 22 | This sample gifting response highlights the value of reviewing personalization before approval. |
| DT023 | Demo Reviewer 23 | The example coaster collection feels cohesive when displayed together. |
| DT024 | Demo Reviewer 24 | This fictional packaging study keeps the object and its message at the centre of attention. |

## 7. Forty inquiry/order scenarios — every baseline state

These are **operational demo Inquiry records**, not online purchases. Keep the repository's existing lifecycle; the baseline below has eight states with five examples each. If Phase 0 finds additional statuses, add at least one coherent example for every actual status and update the declared total. Do not add arbitrary lifecycle enums only to match this table.

Each scenario needs a distinct `Demo Client NN`, non-contactable details, product/options/price snapshot, applicable form-schema version, synthetic request notes, a deterministic created/updated time, assignment to an eligible demo-only staff label, internal activities and a next action appropriate to its state. Quote or completion values stay simulated and are excluded from real revenue/customer counts. Use a persisted seed base time; chronology must be coherent across resume. No real contact data, tracking identifiers, bank details or sent-notification claims.

| ID | Status | Product | Scenario | Required detail / guard |
|---|---|---|---|---|
| DO001 | NEW | DP001 | Large dining enquiry missing delivery-access measurements | Request clarification; no message sent. |
| DO002 | NEW | DP015 | Coffee-table enquiry with two design references | References are demo-owned/private; awaiting first response. |
| DO003 | NEW | DP085 | Preservation request with an event-date preference | No physical items received; do not imply acceptance. |
| DO004 | NEW | DP096 | Ceremony tray request with sample initials | Personalization not yet reviewed. |
| DO005 | NEW | DP111 | Seasonal gift enquiry for a sample quantity | Quantity is simulated; no stock reserved. |
| DO006 | CONTACTED | DP035 | Console enquiry with initial questions recorded | A simulated activity note exists; external transport blocked. |
| DO007 | CONTACTED | DP045 | Seating enquiry awaiting intended-use clarification | Comfort/structural questions unresolved. |
| DO008 | CONTACTED | DP108 | Baby keepsake enquiry awaiting format choice | Sensitive uploads replaced by fictional fixture graphics. |
| DO009 | CONTACTED | DP112 | Initial keychain enquiry awaiting spelling confirmation | No real phone/email used. |
| DO010 | CONTACTED | DP025 | Side-table pair enquiry awaiting placement details | Two candidate sizes saved as demo options. |
| DO011 | QUALIFIED | DP004 | Long-table brief with proposed dimensions and access notes | Scope ready for sample quotation preparation. |
| DO012 | QUALIFIED | DP051 | Atelier desk brief with a material preference | Proposed finish; actual availability unverified. |
| DO013 | QUALIFIED | DP057 | Large wall-panel project with a room sketch | Sketch is synthetic; installation assessment pending. |
| DO014 | QUALIFIED | DP086 | Varmala block request with agreed sample format | No guarantee of preservation suitability. |
| DO015 | QUALIFIED | DP120 | Gift-box request with quantity and mock packaging choice | Mock brief complete, not a purchase commitment. |
| DO016 | QUOTED | DP007 | Dining table with a sample quotation version | Quote Q-DEMO-001; awaiting simulated response. |
| DO017 | QUOTED | DP017 | Coffee-table project with two sample finish options | Quotation snapshot differs from later catalogue edits. |
| DO018 | QUOTED | DP040 | Console project with a revised sample scope | Retain quote version history and follow-up note. |
| DO019 | QUOTED | DP092 | Clock request with sample personalization cost | No real monetary transaction or invoice. |
| DO020 | QUOTED | DP114 | Coaster set with a sample quantity-based quote | No tax/discount policy implied by fixture amounts. |
| DO021 | CONFIRMED | DP002 | Full-pour table with a simulated accepted design brief | Confirmation is a manual demo event, never a WhatsApp click. |
| DO022 | CONFIRMED | DP046 | Counter stool design with a mock specification approval | No payment proof; hold production until relevant review. |
| DO023 | CONFIRMED | DP089 | Single-bloom keepsake with sample layout approval | Synthetic approval only; not a real customer consent. |
| DO024 | CONFIRMED | DP097 | Invitation frame with a frozen example text proof | Approved revision is recorded; later draft remains separate. |
| DO025 | CONFIRMED | DP109 | Pendant set with a mock personalization approval | Fixture actions cannot send an actual customer message. |
| DO026 | IN_PRODUCTION | DP012 | Communal table sample at fabrication planning | Milestone PLANNING; no documentary workshop claim. |
| DO027 | IN_PRODUCTION | DP049 | Long bench sample at a finishing milestone | Milestone is simulated operational data. |
| DO028 | IN_PRODUCTION | DP065 | Wall relief sample awaiting quality review | Include an assigned staff task and mock due date. |
| DO029 | IN_PRODUCTION | DP087 | Bouquet frame sample at layout confirmation | No invented chemical recipe or preservation instruction. |
| DO030 | IN_PRODUCTION | DP115 | Mini tray sample at packaging review | Include a private sample attachment and next action. |
| DO031 | COMPLETED | DP006 | Round dining-table example with closed production tasks | Simulated completion date; exclude from real portfolio/revenue. |
| DO032 | COMPLETED | DP031 | Side-table example with a complete activity timeline | No invented courier/tracking number. |
| DO033 | COMPLETED | DP053 | Study-desk example with archived quote snapshots | Finished fixture, not real inventory proof. |
| DO034 | COMPLETED | DP102 | Botanical nameplate example with final proof history | Do not expose fictional address details publicly. |
| DO035 | COMPLETED | DP113 | Bookmark example with sample quantity completion | No automatic request for a real review. |
| DO036 | CLOSED | DP003 | Dining-table enquiry closed after a scope change | Reason CHANGED_REQUIREMENTS; preserve notes. |
| DO037 | CLOSED | DP077 | Reception-counter concept closed as outside current scope | Reason NOT_PROCEEDING; not a business capability statement. |
| DO038 | CLOSED | DP088 | Flower-disc enquiry closed without approval | Reason NO_APPROVAL; no sentimental items assumed received. |
| DO039 | CLOSED | DP110 | Earring enquiry closed as a duplicate sample | Reason DUPLICATE; link only to another demo record. |
| DO040 | CLOSED | DP118 | Paperweight enquiry closed after no further response | Reason NO_RESPONSE; no automated recontact. |

## 8. All in-scope Studio modules — coverage map

Seed only modules that exist or are required by the master. “All Studio-related things” does not authorize adding ecommerce checkout, inventory accounting, a shipping integration, a second CRM, hosted CMS, scraping or generation services.

| Module | Proposed fixture coverage | Important behavior |
|---|---|---|
| Overview | Live empty state plus demo counts/chart series computed from the 40 scenarios | Never random or blended real/demo metrics. |
| Product editor / forms | All 120 records; every tier, price mode, required/optional field and validation/error case | Bad fixtures for tests stay outside accepted seed counts. |
| Taxonomy | 3 top-level worlds; product categories derived from the register; 12 material labels, 10 finish labels, 12 occasion labels | Labels are sample taxonomy, not certified available materials. |
| Variants | At least 30 products with multiple permitted option examples | Variant family images must match; no invented availability claims. |
| Pages / section builder | 14 example page drafts with all registered core section types | Reuse actual public components; each section has stable block IDs. |
| Collections / merchandising | Furniture-first home selection plus 3 world landings and category picks | Live settings remain untouched; demo selections reference only demo items. |
| Portfolio / project stories | 8 fictional concept case studies | Mark as concept stories, not delivered work. |
| Blog | 36 full drafts plus sample review/published-revision/new-draft states | Safe renderer, private drafts, related references and coherent revision dates. |
| FAQs / testimonials | 42 / 24 as above | Fictional testimonial label cannot disappear in responsive views or exports. |
| Media | Actual inspected source mappings plus missing, pending, approved, rejected and in-use metadata cases | Do not pretend a prompt is an uploaded file; missing records get honest placeholders. |
| Enquiries / quote milestones | 40 scenarios, at least 2 meaningful activity notes on progressed cases | No actual external side effects. Quote references are sample state, not payment. |
| Content review / history | 12 documents with at least 3 meaningful revision snapshots | Restore makes a new draft; current live pointer stays separate. |
| Imports / exports | 6 persisted example jobs: ready, validating, running, completed, failed, cancelled/resumable as supported | Mark sample failures as simulated; actual operation logs remain genuine. |
| Subscribers | 12 fictional non-contactable records in demo scope | No consent proof forged, no actual campaign sends. |
| Staff / permissions | Example inactive staff profiles or UI fixtures for current admin/editor rules; isolated test users provisioned separately | No publicly usable demo accounts, fake active sessions or default passwords. |
| Activity logs | At least 50 clearly labelled fixture events plus real seed/cleanup audit events | Keep real audit evidence distinct from simulated events. |
| SEO / navigation | Sample titles/descriptions, empty/invalid preview test cases and demo-only menu selections | Demo pages excluded from live sitemap/structured data. |
| Settings / branding | Correct supplied brand/contact references; current bronze/forest tokens | Seeding must not overwrite real global settings or branding. |
| Environment diagnostics | Mock readiness states only in component tests; actual Studio displays real presence/check results | No fake healthy database/auth status. |
| Demo management | Counts, edited/retained items, dependency blockers and cleanup progress | Use real handlers, not a purely visual delete button. |
| Scheduling, if approved/configured | Pending/cancelled/failed/completed fixtures isolated from the real runner | Without real scheduling support, a truthful unavailable state, not an enabled timer. |

Suggested fourteen page drafts: Home, Collectible Design, Memory Art, Personal Art & Gifts, Custom Commission, Architect Enquiry, Our Story, Portfolio, Process, Materials, Care, FAQ, Contact and Journal Intro. Do not overwrite existing route models or fabricate approved legal-policy documents. Existing workshops/3D services remain preserved if actually supported; add corresponding sample states only where in scope.

Suggested taxonomy labels are design examples, not materials inventory. Choose an explicit material/finish sample list during seeding and mark it demo-owned. Dependency cleanup must retain any label later referenced by real content until the owner resolves that reference.

## 9. Implementation deliverables and acceptance

Codex must produce schema-compatible fixture definitions, a versioned batch manifest, validated original text, a reusable seed service, explicit non-production install commands, working Studio controls, idempotency/resume handling, protected public reads and safe cleanup tests. File paths follow the actual repository. Proposed logical locations are the existing seed folder and indexed `docs/demo-content.md`; do not invent a parallel application or scatter unindexed root documents.

Write a seed report with expected versus inserted/skipped/changed/failed counts per entity and state. A clean batch should reach the requested totals. After owner deletion, expected active totals change; a report must respect removal decisions instead of automatically restoring the original quotas.

Tests must preserve a real-record sentinel, a shared-media sentinel and an owner/admin account across each cleanup mode. Verify no external messages, no live sitemap/review/analytics contamination, no stale-cache leaks, no broken preserved references and no automatic reappearance after reseed/deploy. A true external provider outage is reported separately from a simulated fixture failure.

**Owner workflow:** Studio → Settings → Demo Data → choose batch/type/items → inspect dependencies → retain or resolve protected items → confirm removal → see exact result. Optional sidebar visibility is a different Settings action. No SQL editing or code deployment should be needed for ordinary demo removal.
