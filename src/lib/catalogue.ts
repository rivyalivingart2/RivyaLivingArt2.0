/** Versioned source fixtures for isolated visual preview; no inventory or offer claims. */
export type ProductTier = "LARGE" | "MEDIUM" | "SMALL";
export type CollectionSlug = "collectible-design" | "memory-art" | "personal-art";
export type FurnitureCategory = "tables" | "seating" | "consoles" | "installations";
export type MaterialId = "resin" | "wood" | "metal" | "mineral";
export type CatalogueSize = "all" | "compact" | "statement";
export type CatalogueSort = "featured" | "title-asc" | "width-asc" | "price-asc";
export type PriceType = "ON_REQUEST" | "STARTING_FROM" | "FIXED";
export type Material = Readonly<{ id: MaterialId; label: string }>;
export type Finish = Readonly<{ id: string; label: string; description: string }>;
export type ConceptMedia = Readonly<{ src: string; alt: string; width: number; height: number; caption: string }>;
export type Concept = Readonly<{
  id: string; slug: string; title: string; name: string; type: string; tier: ProductTier;
  description: string; detail: string; category: FurnitureCategory;
  image: string | null; alt: string; width: number; height: number; gallery: readonly ConceptMedia[];
  materials: readonly Material[]; finishes: readonly Finish[];
  dimensions: Readonly<{ width: number; depth: number; height: number; unit: "mm" }>;
  priceType: PriceType; priceAmountMinor: number | null; currency: "INR";
  edition: Readonly<{ type: "BESPOKE" | "EDITION"; label: string }>;
  availability: "MADE_TO_ORDER" | "READY_TO_SHIP";
  leadTime: Readonly<{ minWeeks: number; maxWeeks: number }>;
  care: string; installation: string;
  customization: Readonly<{ version: 1; fields: readonly string[] }>;
  originKind: "DEMO_FIXTURE"; demoFixtureKey: string; demoBatchId: string; demoVersion: 1;
  contentStatus: "DEMO_VISIBLE"; workingDraftStatus: "NONE" | "DRAFT" | "IN_REVIEW";
  mediaStatus: "CONCEPT_VISUAL" | "VISUAL_PENDING";
}>;
export type CatalogueFilters = Readonly<{
  category: "all" | FurnitureCategory;
  material: "all" | MaterialId;
  size: CatalogueSize;
  sort: CatalogueSort;
}>;
export type CatalogueQuery = Record<string, string | string[] | undefined>;

export const categoryOptions = [
  { value: "all", label: "All objects" }, { value: "tables", label: "Tables & desks" },
  { value: "seating", label: "Seating" }, { value: "consoles", label: "Consoles" },
  { value: "installations", label: "Art & installations" },
] as const;
export const materialOptions = [
  { value: "all", label: "All materials" }, { value: "resin", label: "Resin" },
  { value: "wood", label: "Wood" }, { value: "metal", label: "Metal" },
  { value: "mineral", label: "Mineral composite" },
] as const;
export const sizeOptions = [
  { value: "all", label: "All sizes" }, { value: "compact", label: "Up to 1,200 mm wide" },
  { value: "statement", label: "Over 1,200 mm wide" },
] as const;
export const sortOptions = [
  { value: "featured", label: "Curated order" }, { value: "title-asc", label: "Name: A–Z" },
  { value: "width-asc", label: "Width: small to large" }, { value: "price-asc", label: "Sample price: low to high" },
] as const;

export const collections = [
  { slug: "collectible-design", number: "01", label: "Collectible design", title: "Art for the space.", detail: "Furniture & spatial art", description: "Sculptural tables, considered seating and statement objects. A material-led expression for the spaces you call your own.", tier: "LARGE" },
  { slug: "memory-art", number: "02", label: "Memory art", title: "Art for the memory.", detail: "Preservation & celebration", description: "A moment, a flower, a personal story. A quieter collection centred on the things you choose to remember.", tier: "MEDIUM" },
  { slug: "personal-art", number: "03", label: "Personal art & gifts", title: "Art for the person.", detail: "Objects & personal gifts", description: "Small-scale expressions with a personal point of view. Thoughtful objects, made meaningful through detail.", tier: "SMALL" },
] as const;

const resin: Material = { id: "resin", label: "Resin" };
const wood: Material = { id: "wood", label: "Wood" };
const metal: Material = { id: "metal", label: "Metal" };
const mineral: Material = { id: "mineral", label: "Mineral composite" };
const satin: Finish = { id: "satin", label: "Satin", description: "A softly reflective surface direction. Fictional finish sample; confirm with a physical sample." };
const polished: Finish = { id: "polished", label: "Polished", description: "A brighter reflection for the resin surface. Fictional finish sample; appearance is subject to review." };
const matte: Finish = { id: "matte", label: "Matte", description: "A quiet, low-sheen surface direction. Fictional finish sample; no durability or performance rating is implied." };

const demoDefaults = {
  tier: "LARGE", originKind: "DEMO_FIXTURE", demoBatchId: "rivya-r8-visual-2026-09",
  demoVersion: 1, contentStatus: "DEMO_VISIBLE", currency: "INR",
  customization: { version: 1, fields: ["Intended use", "Proposed dimensions", "Material and finish preference", "Site access", "Location", "Timeline", "Optional reference"] },
} as const;
type ConceptInput = Omit<Concept, keyof typeof demoDefaults | "demoFixtureKey" | "gallery" | "mediaStatus">;
function makeConcept(input: ConceptInput): Concept {
  return {
    ...demoDefaults, ...input, demoFixtureKey: `product:${input.id}`,
    mediaStatus: input.image ? "CONCEPT_VISUAL" : "VISUAL_PENDING",
    gallery: input.image ? [{ src: input.image, alt: input.alt, width: input.width, height: input.height, caption: "AI concept visualization · fictional design, not a completed commission" }] : [],
  };
}

export const concepts: readonly Concept[] = [
  makeConcept({
    id: "DP001", slug: "riverline-live-edge-dining-table", title: "Riverline", name: "Riverline Live-Edge Dining Table", type: "Dining table concept", category: "tables",
    description: "A fictional dining-table study where flowing blue resin meets expressive wood grain. The long surface gives the natural edge room to wander, while a restrained base keeps attention on the meeting of materials. Sample dimensions and finishes describe a design direction, not a manufactured piece.",
    detail: "Riverline begins with the irregular boundary of a timber slab. In this fictional design study, a blue resin channel follows that edge without smoothing away every change in direction. From the end of the table, the composition reads as a long line through the room; from a seated position, smaller details in the grain become the focus.\n\nThe sample proportions imagine a generous dining setting with space around the object for chairs and circulation. A future commission would begin by discussing the room, the proposed seating arrangement and the relationship between the surface and its supports. The pictured concept is a visual reference, not a construction drawing or evidence of a completed table. Timber selection, resin colour, dimensions and the final finish would all need their own review before a real specification could be agreed.",
    image: "/media/concepts/riverline.avif", alt: "AI concept of a live-edge dining table with a blue resin river in a dark interior", width: 560, height: 700,
    materials: [wood, resin, metal], finishes: [satin, polished], dimensions: { width: 2400, depth: 1000, height: 760, unit: "mm" },
    priceType: "ON_REQUEST", priceAmountMinor: null, edition: { type: "BESPOKE", label: "Bespoke study" }, availability: "MADE_TO_ORDER", leadTime: { minWeeks: 10, maxWeeks: 14 }, workingDraftStatus: "NONE",
    care: "Sample care note: discuss surface protection and the final finish before choosing a cleaning routine. No heat or chemical resistance is specified.",
    installation: "Sample site note: review the full tabletop route, doorway clearances and assembly position before agreeing delivery or installation.",
  }),
  makeConcept({
    id: "DP013", slug: "basin-shallow-pour-coffee-table", title: "Basin", name: "Basin Shallow-Pour Coffee Table", type: "Coffee table concept", category: "tables",
    description: "A fictional low table built around a shallow pool of translucent resin and a generous timber edge. Basin explores a quieter centre for a sitting room, with a broad horizontal surface and an organic outline. Its listed dimensions and finish choices are sample design information.",
    detail: "Basin treats the coffee table as a small landscape seen from above. An uneven timber perimeter frames the imagined resin surface, allowing the outline to feel discovered rather than mechanically repeated. The low silhouette is intended to leave the surrounding seating and the room beyond visually connected.\n\nThis sample asks how a broad surface might hold both everyday objects and stretches of empty space. Its proposed depth would need to be considered alongside the sofa, walking routes and the distance from each seat. The existing image is an AI concept visualization; it cannot establish the final edge profile, support construction or material performance. A real discussion would compare room measurements with a revised drawing and agree the relationship between wood, resin and finish. The fictional care and installation notes are prompts for that discussion, not instructions for an existing product.",
    image: "/media/concepts/basin.avif", alt: "AI-generated resin and wood coffee-table concept in a softly lit interior", width: 480, height: 600,
    materials: [wood, resin], finishes: [satin, polished], dimensions: { width: 1200, depth: 750, height: 360, unit: "mm" },
    priceType: "STARTING_FROM", priceAmountMinor: 8500000, edition: { type: "BESPOKE", label: "Bespoke study" }, availability: "MADE_TO_ORDER", leadTime: { minWeeks: 6, maxWeeks: 9 }, workingDraftStatus: "NONE",
    care: "Sample care note: confirm the supplied finish and an appropriate soft cleaning method. Avoid assuming the concept is rated for hot serving vessels.",
    installation: "Sample site note: compare the proposed footprint with seating clearances and the delivery route before dimensions are agreed.",
  }),
  makeConcept({
    id: "DP002", slug: "stillwater-full-pour-dining-table", title: "Stillwater", name: "Stillwater Full-Pour Dining Table", type: "Dining table concept", category: "tables",
    description: "A fictional full-pour dining surface with a calm, continuous outline. Stillwater studies how a single translucent plane could anchor a room without relying on an expressive timber edge. The sample palette, proportions and finish options are an invitation to discuss the design, not an available offer.",
    detail: "Stillwater takes the resin surface itself as the starting point. Rather than tracing a timber seam, this fictional concept imagines a broad, uninterrupted plane whose colour and reflected light change with the viewing angle. A simple rectangular outline gives the composition a measured rhythm and leaves the surrounding interior room to breathe.\n\nThe sample is deliberately presented without a borrowed product image. Its proportions suggest a shared dining table, but seating numbers, support positions and edge treatment have not been engineered or approved. A future brief could explore whether the surface should appear clear, clouded or softly tinted, then review those choices through actual samples and drawings. The listed lead time and pricing mode demonstrate the interface only. Any discussion of weight, handling, load capacity or suitability would require verified information for the proposed physical object.",
    image: null, alt: "", width: 0, height: 0, materials: [resin, metal], finishes: [polished, satin], dimensions: { width: 2200, depth: 950, height: 750, unit: "mm" },
    priceType: "ON_REQUEST", priceAmountMinor: null, edition: { type: "BESPOKE", label: "Bespoke study" }, availability: "MADE_TO_ORDER", leadTime: { minWeeks: 12, maxWeeks: 16 }, workingDraftStatus: "DRAFT",
    care: "Sample care note: a confirmed resin system and finish are needed before cleaning, temperature or exposure guidance can be supplied.",
    installation: "Sample site note: establish the access route and handling plan once the surface construction and actual weight are known.",
  }),
  makeConcept({
    id: "DP014", slug: "orbit-circular-centre-table", title: "Orbit", name: "Orbit Circular Centre Table", type: "Circular table concept", category: "tables",
    description: "A fictional circular centre table that turns the room around a single, continuous edge. Orbit combines an imagined resin surface with a quiet mineral base. Its compact sample footprint explores conversation and circulation, while the ordinary finish choices remain starting points for a later material review.",
    detail: "Orbit studies what happens when a table has no obvious front. The circular top invites several viewpoints, while the imagined base gives the composition a quieter centre of gravity. A resin surface and mineral composite support are proposed as contrasting visual textures, without claiming that a particular construction has already been resolved.\n\nIn a living room, this sample could help compare the space occupied by a round object with that of a longer coffee table. The listed diameter is expressed as equal width and depth so the dimensions remain clear throughout the preview. Finish selections describe an aesthetic preference only; they do not alter a rendered model or confirm a manufacturing option. Before a real object could be specified, edge details, stability, materials and room clearances would need a separate review. The edition label is fictional and does not imply available stock.",
    image: null, alt: "", width: 0, height: 0, materials: [resin, mineral], finishes: [satin, matte], dimensions: { width: 1000, depth: 1000, height: 380, unit: "mm" },
    priceType: "FIXED", priceAmountMinor: 9600000, edition: { type: "EDITION", label: "Edition study · 12 proposed pieces" }, availability: "READY_TO_SHIP", leadTime: { minWeeks: 2, maxWeeks: 3 }, workingDraftStatus: "NONE",
    care: "Sample care note: resin and mineral surfaces may require different instructions. Request guidance for the confirmed construction before use.",
    installation: "Sample site note: review the circular footprint, support contact points and floor protection before agreeing placement.",
  }),
  makeConcept({
    id: "DP025", slug: "twinleaf-matched-side-table-pair", title: "Twinleaf", name: "Twinleaf Matched Side-Table Pair", type: "Side-table pair concept", category: "tables",
    description: "A fictional pair of side tables with related outlines and deliberately different grain directions. Twinleaf explores the balance between a matched set and two individual objects. The sample dimensions describe each table separately; the proposed materials and price are labelled examples for the protected preview.",
    detail: "Twinleaf imagines two small tables that belong together without looking mechanically identical. Each surface follows a leaflike curve, with the timber grain changing the way the paired forms are read. A narrow resin area is proposed as a connecting detail rather than the dominant feature.\n\nThe pair could be discussed as companions beside a sofa or as separated accents within one room. These are placement ideas for the fictional concept, not statements about an existing collection. Dimensions shown in the preview refer to one table, while the sample fixed price describes the proposed pair. A real brief would need to settle their relative heights, the orientation of each surface and the amount of variation between them. No matching source image is available, so the page keeps a labelled visual placeholder instead of borrowing another design's photograph. The edition and availability states are interface examples only.",
    image: null, alt: "", width: 0, height: 0, materials: [wood, resin], finishes: [satin, matte], dimensions: { width: 520, depth: 420, height: 520, unit: "mm" },
    priceType: "FIXED", priceAmountMinor: 6400000, edition: { type: "EDITION", label: "Edition study · 8 proposed pairs" }, availability: "READY_TO_SHIP", leadTime: { minWeeks: 2, maxWeeks: 4 }, workingDraftStatus: "NONE",
    care: "Sample care note: confirm protection for both the timber and resin areas. The same cleaning treatment should not be assumed suitable for every surface.",
    installation: "Sample site note: the dimensions refer to each table; allow for both footprints when planning the pair together.",
  }),
  makeConcept({
    id: "DP035", slug: "span-narrow-console", title: "Span", name: "Span Narrow Console", type: "Console concept", category: "consoles",
    description: "A fictional console with a long, narrow surface and a restrained supporting frame. Span is a study in the small depth an object can occupy while still giving an entryway a focal point. Every material, dimension and lead-time value shown belongs to this sample concept.",
    detail: "Span begins with a passage rather than a dining room. Its imagined surface stretches along a wall while keeping a shallow profile, creating a place to consider a single vessel, a small arrangement or simply the timber and resin composition itself. The frame is drawn in words as a quiet support, with its engineering intentionally unresolved.\n\nThe sample proportions invite a conversation about wall length, skirting, nearby doors and the space needed to move comfortably past the object. They should not be read as a verified fit for a particular home. A future brief would also ask whether the console requires wall restraint and how the support relates to the room's floor. The finish choices in this preview record ordinary preferences only. No hardware, anchoring method or installation service is included or promised by this fictional record.",
    image: null, alt: "", width: 0, height: 0, materials: [wood, resin, metal], finishes: [satin, matte], dimensions: { width: 1600, depth: 350, height: 820, unit: "mm" },
    priceType: "STARTING_FROM", priceAmountMinor: 12500000, edition: { type: "BESPOKE", label: "Bespoke study" }, availability: "MADE_TO_ORDER", leadTime: { minWeeks: 8, maxWeeks: 12 }, workingDraftStatus: "IN_REVIEW",
    care: "Sample care note: agree a cleaning method for the surface and frame separately when their final materials are specified.",
    installation: "Sample site note: wall restraint, skirting clearance and support stability require assessment for the final design and site.",
  }),
  makeConcept({
    id: "DP043", slug: "petal-sculptural-chair", title: "Petal", name: "Petal Sculptural Chair", type: "Sculptural chair concept", category: "seating",
    description: "A fictional seating study shaped around a soft, opening curve. Petal considers the chair as an object to walk around as well as a place to sit. Its resin and mineral palette, sample dimensions and finish options describe a visual intention without making ergonomic or structural claims.",
    detail: "Petal imagines a chair whose outline unfolds gradually as the viewpoint changes. The back and seat are treated as related curves, with the spaces between them carrying as much visual interest as the surfaces themselves. A resin and mineral palette is proposed to contrast translucency with a quieter, more opaque body.\n\nThis is an early sculptural study, so the page does not turn the idea into a promise of comfort or suitability. A real seating project would require careful review of seat height, posture, edges, support and testing. The dimensions in this preview describe an overall envelope, not a validated ergonomic drawing. With no matched image yet available, the labelled fallback keeps that distinction visible. The sample lead-time range and bespoke state demonstrate how a later catalogue could present agreed information once the design, materials and intended use have been assessed.",
    image: null, alt: "", width: 0, height: 0, materials: [resin, mineral], finishes: [matte, satin], dimensions: { width: 680, depth: 720, height: 800, unit: "mm" },
    priceType: "ON_REQUEST", priceAmountMinor: null, edition: { type: "BESPOKE", label: "Bespoke study" }, availability: "MADE_TO_ORDER", leadTime: { minWeeks: 10, maxWeeks: 14 }, workingDraftStatus: "DRAFT",
    care: "Sample care note: surface instructions depend on the final resin, composite and finish. No abrasion or exposure rating is supplied.",
    installation: "Sample site note: this concept has no validated load capacity or ergonomic assessment; suitability must be reviewed before any real use.",
  }),
  makeConcept({
    id: "DP048", slug: "threshold-entry-bench", title: "Threshold", name: "Threshold Entry Bench", type: "Entry bench concept", category: "seating",
    description: "A fictional entry bench composed as a quiet horizontal line. Threshold brings timber and a narrow resin detail into a compact seating study for transitional spaces. The example dimensions help explore placement, while the stated materials and timing remain synthetic information awaiting a real design review.",
    detail: "Threshold considers the short pause between arriving and moving further into a home. Its fictional composition pairs a broad timber seat with a restrained resin detail, keeping the overall shape legible from the doorway. The proposed frame is intentionally simple so that the surface can remain the main visual element.\n\nFor a real brief, the useful questions would begin with the entryway: where doors swing, how shoes and bags are handled, and how much clear passage remains beside the bench. The sample dimensions are a discussion aid rather than a recommendation for a specific space. Seating loads, edge treatment and the relationship between the frame and floor have not been validated. Ordinary finish preferences can be explored in the preview, but no option establishes durability or availability. This concept is presented without an image until an appropriate visual can be reviewed.",
    image: null, alt: "", width: 0, height: 0, materials: [wood, resin, metal], finishes: [matte, satin], dimensions: { width: 1400, depth: 420, height: 460, unit: "mm" },
    priceType: "STARTING_FROM", priceAmountMinor: 7800000, edition: { type: "BESPOKE", label: "Bespoke study" }, availability: "MADE_TO_ORDER", leadTime: { minWeeks: 7, maxWeeks: 10 }, workingDraftStatus: "NONE",
    care: "Sample care note: request the approved care instructions after the seat, frame and finish are confirmed; no outdoor suitability is established.",
    installation: "Sample site note: review door swings, passage width and the floor contact area. Seating capacity remains unverified.",
  }),
  makeConcept({
    id: "DP051", slug: "single-slab-atelier-desk", title: "Single-Slab", name: "Single-Slab Atelier Desk", type: "Desk concept", category: "tables",
    description: "A fictional work surface that gives a single timber slab the leading role. The Atelier Desk explores a resin detail along the edge and a frame with visual breathing room beneath. Its sample footprint is a starting point for discussing work habits, equipment and the surrounding space.",
    detail: "The Single-Slab Atelier Desk treats a working surface as a composition with its own grain, edge and rhythm. In this fictional study, a restrained resin detail follows one part of the timber while the rest of the top remains visually open. The aim is to consider how an expressive object might sit within a practical workspace.\n\nA real version would begin with the equipment and activities it needs to accommodate. Screen position, chair clearance, cables and lighting all affect the usefulness of the proposed footprint. None of those requirements has been engineered into this sample, and no drawer, cable system or accessory is implied. The dimensions describe the outer envelope only. Finish preferences and a bespoke label allow the interface to explore a commission-led presentation without claiming that the desk exists, is available or has been tested for a particular working arrangement.",
    image: null, alt: "", width: 0, height: 0, materials: [wood, resin, metal], finishes: [satin, matte], dimensions: { width: 1800, depth: 750, height: 750, unit: "mm" },
    priceType: "ON_REQUEST", priceAmountMinor: null, edition: { type: "BESPOKE", label: "Bespoke study" }, availability: "MADE_TO_ORDER", leadTime: { minWeeks: 9, maxWeeks: 13 }, workingDraftStatus: "NONE",
    care: "Sample care note: confirm suitable pads and cleaning methods for the chosen finish. The surface has no stated resistance to equipment heat or marks.",
    installation: "Sample site note: measure chair clearance, equipment layout and the delivery route; cable handling needs a separate design discussion.",
  }),
  makeConcept({
    id: "DP057", slug: "horizon-band-wall-panel", title: "Horizon", name: "Horizon Band Wall Panel", type: "Wall panel concept", category: "installations",
    description: "A fictional wall composition built around a long band of resin and a quieter mineral field. Horizon studies how a horizontal artwork might change the proportions of a room. Its sample scale and finish choices are visual prompts; mounting and site suitability remain entirely unverified.",
    detail: "Horizon imagines a wall panel as a meeting between two fields. A resin band runs across a mineral-toned ground, establishing a horizontal line that can be read from a distance before the surface details come into view. The concept is concerned with proportion and rhythm rather than a particular landscape or commissioned interior.\n\nThe sample dimensions describe a broad panel, but a real installation would need to respond to the wall, nearby openings and the way the room is approached. Its weight, substrate and mounting arrangement are not supplied because those depend on an approved construction. No structural or fire-performance claim can be inferred from the fictional material labels. The preview retains a visual-pending state until suitable imagery exists. A future discussion would pair drawings and material samples with a site assessment before treating the concept as an installable object.",
    image: null, alt: "", width: 0, height: 0, materials: [resin, mineral], finishes: [matte, satin], dimensions: { width: 2200, depth: 60, height: 900, unit: "mm" },
    priceType: "ON_REQUEST", priceAmountMinor: null, edition: { type: "BESPOKE", label: "Site-specific study" }, availability: "MADE_TO_ORDER", leadTime: { minWeeks: 10, maxWeeks: 16 }, workingDraftStatus: "IN_REVIEW",
    care: "Sample care note: wall-panel cleaning and access should be agreed for the confirmed surface and mounting arrangement.",
    installation: "Sample site note: substrate, actual weight, fixing design and wall condition require qualified assessment; no mounting hardware is specified.",
  }),
  makeConcept({
    id: "DP069", slug: "lattice-resin-and-3d-sculpture", title: "Lattice", name: "Lattice Resin-and-3D Sculpture", type: "Sculptural object concept", category: "installations",
    description: "A fictional sculpture that places a fine internal structure within an imagined resin volume. Lattice explores the tension between open pattern and solid outline, with changing viewpoints revealing different overlaps. The proposed scale and material labels describe a spatial-art study rather than a fabricated object.",
    detail: "Lattice starts with a repeating open structure and asks how it might be seen through a resin volume. The pattern is imagined as a three-dimensional insert, with its lines overlapping differently as a viewer moves around the object. An understated outer shape keeps the internal rhythm in focus.\n\nThis is a visual proposition, not a tested fabrication method. Compatibility between the insert, resin and support would need to be established through actual material work. The sample height suggests a freestanding object, but its weight, centre of gravity and stability remain unknown. A real brief would also discuss whether the piece belongs on the floor or on a separately designed plinth, and how close viewers can approach it. Until an appropriate image is supplied, the preview uses a labelled placeholder and avoids presenting an unrelated table or decorative object as this sculpture.",
    image: null, alt: "", width: 0, height: 0, materials: [resin, metal], finishes: [polished, satin], dimensions: { width: 700, depth: 700, height: 1600, unit: "mm" },
    priceType: "ON_REQUEST", priceAmountMinor: null, edition: { type: "EDITION", label: "Edition study · 6 proposed pieces" }, availability: "MADE_TO_ORDER", leadTime: { minWeeks: 12, maxWeeks: 18 }, workingDraftStatus: "DRAFT",
    care: "Sample care note: establish handling and cleaning instructions after the insert, resin and exposed surfaces are confirmed.",
    installation: "Sample site note: support, stability and any plinth require design assessment; the concept is not approved for public circulation areas.",
  }),
  makeConcept({
    id: "DP077", slug: "estuary-reception-counter", title: "Estuary", name: "Estuary Reception Counter", type: "Reception counter concept", category: "installations",
    description: "A fictional reception counter imagined as a meeting point between a flowing resin face and a grounded mineral body. Estuary explores a large architectural gesture at the entrance to a space. All sample dimensions, materials and timing remain preliminary, with access and operational needs still to be discussed.",
    detail: "Estuary moves the material study from a freestanding table to an architectural threshold. Its imagined front face carries a flowing resin detail across a broad mineral body, creating a continuous visual gesture when approached from the entrance. The working side is deliberately unresolved so that the concept does not pretend to answer an unseen operational brief.\n\nA real counter would require discussion of staff tasks, visitor access, equipment, services and the circulation on both sides. The sample envelope is only a way to explore scale in the preview. It does not establish accessible working heights, electrical provision, storage, structural performance or compliance. Delivery could also depend on whether the design is assembled from separate parts, which has not yet been decided. No matched image is available; the labelled fallback preserves that uncertainty while the content demonstrates a site-specific, consultation-led catalogue journey.",
    image: null, alt: "", width: 0, height: 0, materials: [resin, mineral, metal], finishes: [matte, satin], dimensions: { width: 3000, depth: 800, height: 1100, unit: "mm" },
    priceType: "ON_REQUEST", priceAmountMinor: null, edition: { type: "BESPOKE", label: "Site-specific study" }, availability: "MADE_TO_ORDER", leadTime: { minWeeks: 14, maxWeeks: 20 }, workingDraftStatus: "IN_REVIEW",
    care: "Sample care note: a final specification must establish cleaning instructions and suitability for the intended reception setting.",
    installation: "Sample site note: assess access, assembly, services and the building requirements with the project team before defining installation.",
  }),
];

export function findConcept(slug: string): Concept | undefined {
  return concepts.find((piece) => piece.slug === slug);
}
export function findCollection(slug: string) {
  return collections.find((collection) => collection.slug === slug);
}
export function conceptsForTier(tier: ProductTier): readonly Concept[] {
  return concepts.filter((piece) => piece.tier === tier);
}
export function relatedConcepts(piece: Concept, limit = 3): readonly Concept[] {
  return concepts.filter((candidate) => candidate.id !== piece.id && candidate.tier === piece.tier)
    .sort((a, b) => Number(b.category === piece.category) - Number(a.category === piece.category))
    .slice(0, Math.max(0, Math.floor(limit)));
}

function optionValue<T extends string>(value: string | string[] | undefined, options: readonly { value: T }[], fallback: T): T {
  // Ambiguous repeated parameters are rejected, not interpreted differently by clients and servers.
  return typeof value === "string" ? options.find((option) => option.value === value)?.value ?? fallback : fallback;
}
export function queryFurniture(raw: CatalogueQuery) {
  const filters: CatalogueFilters = {
    category: optionValue(raw.category, categoryOptions, "all"),
    material: optionValue(raw.material, materialOptions, "all"),
    size: optionValue(raw.size, sizeOptions, "all"),
    sort: optionValue(raw.sort, sortOptions, "featured"),
  };
  const matching = concepts.filter((piece) => piece.tier === "LARGE"
    && (filters.category === "all" || piece.category === filters.category)
    && (filters.material === "all" || piece.materials.some((material) => material.id === filters.material))
    && (filters.size === "all" || (filters.size === "compact" ? piece.dimensions.width <= 1200 : piece.dimensions.width > 1200)));
  if (filters.sort === "title-asc") matching.sort((a, b) => a.title.localeCompare(b.title, "en"));
  if (filters.sort === "width-asc") matching.sort((a, b) => a.dimensions.width - b.dimensions.width);
  if (filters.sort === "price-asc") matching.sort((a, b) => {
    if (a.priceAmountMinor === null) return b.priceAmountMinor === null ? 0 : 1;
    if (b.priceAmountMinor === null) return -1;
    return a.priceAmountMinor - b.priceAmountMinor;
  });
  const pageSize = 6;
  const pageCount = Math.max(1, Math.ceil(matching.length / pageSize));
  const rawPage = typeof raw.page === "string" && /^[1-9]\d{0,8}$/.test(raw.page) ? Number(raw.page) : 1;
  const page = Math.min(rawPage, pageCount);
  return { items: matching.slice((page - 1) * pageSize, page * pageSize), total: matching.length, page, pageCount, pageSize, filters };
}
export function catalogueHref(filters: Partial<CatalogueFilters> = {}, page = 1): string {
  const params = new URLSearchParams();
  for (const key of ["category", "material", "size", "sort"] as const) {
    const value = filters[key];
    if (value && value !== "all" && value !== "featured") params.set(key, value);
  }
  if (Number.isSafeInteger(page) && page > 1) params.set("page", String(page));
  return `/collectible-design${params.size ? `?${params.toString()}` : ""}`;
}
export function formatPrice(piece: Pick<Concept, "priceType" | "priceAmountMinor" | "currency">): string {
  if (piece.priceType === "ON_REQUEST" || piece.priceAmountMinor === null) return "Price on request";
  const amount = new Intl.NumberFormat("en-IN", { style: "currency", currency: piece.currency, minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(piece.priceAmountMinor / 100);
  return `${piece.priceType === "STARTING_FROM" ? "From " : ""}${amount}`;
}
