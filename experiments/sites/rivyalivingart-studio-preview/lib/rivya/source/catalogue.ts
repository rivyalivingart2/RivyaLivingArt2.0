import {additionalConcepts} from "./catalogue-extra";
/** Versioned source fixtures for isolated visual preview; no inventory or offer claims. */
export type ProductTier = "LARGE" | "MEDIUM" | "SMALL";
export type CollectionSlug = "collectible-design" | "memory-art" | "personal-art";
export type FurnitureCategory = "tables" | "seating" | "consoles" | "installations";
export type MemoryCategory = "flower-preservation" | "preservation-clocks" | "ceremony-trays" | "invitation-memories" | "nameplates" | "baby-keepsakes";
export type PersonalCategory = "jewellery" | "festive" | "accessories" | "desk-objects" | "home-objects";
export type MemoryOccasion = "wedding" | "anniversary" | "celebration" | "family" | "new-arrival";
export type PreservationType = "flowers" | "paper" | "keepsakes" | "occasion-design";
export type PersonalRecipient = "friend" | "sibling" | "reader" | "family" | "host";
export type PersonalColour = "clear" | "amber" | "green" | "rose";
export type PersonalFestival = "everyday" | "rakhi" | "festive";
export type MaterialId = "resin" | "wood" | "metal" | "mineral";
export type CatalogueSize = "all" | "compact" | "statement";
export type CatalogueSort = "featured" | "title-asc" | "width-asc" | "price-asc";
export type PriceType = "ON_REQUEST" | "STARTING_FROM" | "FIXED";
export type Material = Readonly<{ id: MaterialId; label: string }>;
export type Finish = Readonly<{ id: string; label: string; description: string }>;
export type ConceptMedia = Readonly<{ src: string; alt: string; width: number; height: number; caption: string }>;
export type Dimensions = Readonly<{ width: number; depth: number; height: number; unit: "mm" }>;
export type ConceptBase = Readonly<{
  id: string; slug: string; title: string; name: string; type: string;
  description: string; detail: string;
  image: string | null; alt: string; width: number; height: number; gallery: readonly ConceptMedia[];
  materials: readonly Material[]; finishes: readonly Finish[];
  dimensions: Dimensions;
  priceType: PriceType; priceAmountMinor: number | null; currency: "INR";
  availability: "MADE_TO_ORDER" | "READY_TO_SHIP";
  leadTime: Readonly<{ minWeeks: number; maxWeeks: number }>;
  care: string;
  customization: Readonly<{ version: 1; fields: readonly string[] }>;
  originKind: "DEMO_FIXTURE"; demoFixtureKey: string; demoBatchId: string; demoVersion: 1;
  contentStatus: "DEMO_VISIBLE"; workingDraftStatus: "NONE" | "DRAFT" | "IN_REVIEW";
  mediaStatus: "CONCEPT_VISUAL" | "VISUAL_PENDING";
}>;
export type FurnitureConcept = ConceptBase & Readonly<{
  tier: "LARGE"; category: FurnitureCategory;
  edition: Readonly<{ type: "BESPOKE" | "EDITION"; label: string }>;
  installation: string;
}>;
export type MemoryConcept = ConceptBase & Readonly<{
  tier: "MEDIUM"; category: MemoryCategory;
  memory: Readonly<{
    occasions: readonly MemoryOccasion[]; preservation: PreservationType; format: string;
    sizes: readonly Readonly<{ label: string; dimensions: Dimensions }>[];
    personalization: readonly string[]; materialsNote: string;
  }>;
}>;
export type PersonalConcept = ConceptBase & Readonly<{
  tier: "SMALL"; category: PersonalCategory;
  personal: Readonly<{
    recipients: readonly PersonalRecipient[]; colours: readonly PersonalColour[]; festivals: readonly PersonalFestival[];
    variants: readonly Readonly<{ id: string; label: string; colour: PersonalColour }>[];
    personalization: readonly string[]; quantity: Readonly<{ min: number; max: number }>; giftNote: string;
  }>;
}>;
export type Concept = FurnitureConcept | MemoryConcept | PersonalConcept;
export type CatalogueFilters = Readonly<{
  category: "all" | FurnitureCategory;
  material: "all" | MaterialId;
  size: CatalogueSize;
  sort: CatalogueSort;
}>;
export type CatalogueQuery = Record<string, string | string[] | undefined>;
export type TierSort = "featured" | "title-asc" | "price-asc";
export type MemoryFilters = Readonly<{ occasion: "all" | MemoryOccasion; preservation: "all" | PreservationType; sort: TierSort }>;
export type PersonalFilters = Readonly<{ recipient: "all" | PersonalRecipient; colour: "all" | PersonalColour; festival: "all" | PersonalFestival; sort: TierSort }>;

export const memoryOccasionOptions = [
  { value: "all", label: "All occasions" }, { value: "wedding", label: "Wedding" },
  { value: "anniversary", label: "Anniversary" }, { value: "celebration", label: "Celebration" },
  { value: "family", label: "Family" }, { value: "new-arrival", label: "New arrival" },
] as const;
export const preservationOptions = [
  { value: "all", label: "All preservation types" }, { value: "flowers", label: "Flowers & botanicals" },
  { value: "paper", label: "Invitations & paper" }, { value: "keepsakes", label: "Personal keepsakes" },
  { value: "occasion-design", label: "Celebration design" },
] as const;
export const personalRecipientOptions = [
  { value: "all", label: "Any recipient" }, { value: "friend", label: "A friend" },
  { value: "sibling", label: "A sibling" }, { value: "reader", label: "A reader" },
  { value: "family", label: "Family" }, { value: "host", label: "A host" },
] as const;
export const personalColourOptions = [
  { value: "all", label: "All colour directions" }, { value: "clear", label: "Clear" },
  { value: "amber", label: "Amber" }, { value: "green", label: "Green" }, { value: "rose", label: "Rose" },
] as const;
export const personalFestivalOptions = [
  { value: "all", label: "All occasions" }, { value: "everyday", label: "Everyday gifting" },
  { value: "rakhi", label: "Rakhi" }, { value: "festive", label: "Festive gifting" },
] as const;
export const tierSortOptions = [
  { value: "featured", label: "Curated order" }, { value: "title-asc", label: "Name: A–Z" },
  { value: "price-asc", label: "Sample price: low to high" },
] as const;

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
type ConceptInput = Omit<FurnitureConcept, keyof typeof demoDefaults | "demoFixtureKey" | "gallery" | "mediaStatus">;
function makeConcept(input: ConceptInput): FurnitureConcept {
  return {
    ...demoDefaults, ...input, demoFixtureKey: `product:${input.id}`,
    mediaStatus: input.image ? "CONCEPT_VISUAL" : "VISUAL_PENDING",
    gallery: input.image ? [{ src: input.image, alt: input.alt, width: input.width, height: input.height, caption: "AI concept visualization · fictional design, not a completed commission" }] : [],
  };
}

export const furnitureConcepts: readonly FurnitureConcept[] = [
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
  makeConcept({
    id: "DP003", slug: "verdant-split-slab-dining-table", title: "Verdant", name: "Verdant Split-Slab Dining Table", type: "Dining table concept", category: "tables",
    description: "A fictional dining table that separates two timber slabs with a slender green resin channel. Verdant studies the space between natural edges, keeping the surface visually light despite its length. Sample proportions and finish choices invite discussion of a room, its seating and the character of the timber.",
    detail: "Verdant begins with a pair of timber edges that do not quite mirror one another. A narrow green resin channel is imagined between them, opening and tightening as it follows the grain. The interest lies in that uneven conversation: the slabs stay recognisably separate while becoming one shared dining surface. A quiet metal support is proposed beneath the top.\n\nThe sample length suggests a generous table, but no seating count follows automatically from its dimensions. A real brief would compare chair widths, end positions and movement through the room before settling the slab arrangement. Timber selection could change both the channel and the overall balance, so an approved visual and physical material samples would be needed. This fictional record has no matched image or manufactured counterpart. Its pricing mode, timing and draft state demonstrate a commission discussion without reserving a piece or confirming its construction.",
    image: null, alt: "", width: 0, height: 0, materials: [wood, resin, metal], finishes: [satin, polished], dimensions: { width: 2300, depth: 1000, height: 750, unit: "mm" },
    priceType: "ON_REQUEST", priceAmountMinor: null, edition: { type: "BESPOKE", label: "Bespoke study" }, availability: "MADE_TO_ORDER", leadTime: { minWeeks: 10, maxWeeks: 15 }, workingDraftStatus: "DRAFT",
    care: "Sample care note: agree care for the timber, resin seam and metal support after the actual finishes are selected; no exposure rating is established.",
    installation: "Sample site note: review the complete slab footprint, chair positions and access route; support placement and handling depend on the approved construction.",
  }),
  makeConcept({
    id: "DP004", slug: "monolith-long-span-dining-table", title: "Monolith", name: "Monolith Long-Span Dining Table", type: "Dining table concept", category: "tables",
    description: "A fictional long dining table with a broad resin plane and two substantial mineral supports. Monolith explores a strong horizontal presence for a generous room. Its sample scale describes a design intention; the support spacing, surface construction and practical arrangement await a specific brief.",
    detail: "Monolith gives the dining surface a long, deliberate line. The fictional composition pairs a restrained resin top with two mineral forms set beneath it, allowing the space between the supports to become part of the design. The material relationship is intended to feel grounded without filling every view under the table.\n\nAt this proposed scale, the room and the object need to be considered together. A future discussion would locate the chairs, review the approach from adjoining spaces and examine whether the top should arrive whole or in agreed sections. No span, load capacity or assembly method has been calculated for this concept. Its name describes a visual impression rather than a structural claim. The source index contains an unverified image candidate, so this preview keeps its visual pending. The sample lead time and on-request price mode remain fictional until a real scope and specification are agreed.",
    image: null, alt: "", width: 0, height: 0, materials: [resin, mineral], finishes: [matte, satin], dimensions: { width: 3200, depth: 1100, height: 760, unit: "mm" },
    priceType: "ON_REQUEST", priceAmountMinor: null, edition: { type: "BESPOKE", label: "Bespoke study" }, availability: "MADE_TO_ORDER", leadTime: { minWeeks: 14, maxWeeks: 20 }, workingDraftStatus: "IN_REVIEW",
    care: "Sample care note: confirm separate cleaning guidance for the resin plane and mineral supports; their final composition and finish remain unspecified.",
    installation: "Sample site note: review access, possible assembly sections and floor conditions once the actual weight and support design are known.",
  }),
  makeConcept({
    id: "DP005", slug: "estuary-oval-dining-table", title: "Estuary", name: "Estuary Oval Dining Table", type: "Oval dining table concept", category: "tables",
    description: "A fictional oval dining table where a resin channel opens gently between timber fields. Estuary softens the table's ends while keeping a clear direction through the room. Sample dimensions and materials explore that balance without defining a seating capacity, finished edge or available piece.",
    detail: "Estuary imagines a resin channel that widens as it approaches one end of an oval surface. Two timber fields hold the composition together, while the rounded perimeter changes how the table is approached from each side. Unlike a straight river detail, the proposed channel has a quieter, spreading movement with no single central axis.\n\nThe sample outline could help a future client compare curved and rectangular tables within the same room. The useful questions would include where chairs pull back, how people pass the ends and whether the grain direction should face the entrance or a window. Those choices remain open in this fictional record. An actual timber selection may require the resin shape to change, and support positions would need their own drawings. No image has been approved for the concept. The listed price is a synthetic starting example, with no inclusion, availability or quotation implied.",
    image: null, alt: "", width: 0, height: 0, materials: [wood, resin, metal], finishes: [satin, polished], dimensions: { width: 2400, depth: 1150, height: 750, unit: "mm" },
    priceType: "STARTING_FROM", priceAmountMinor: 28500000, edition: { type: "BESPOKE", label: "Bespoke study" }, availability: "MADE_TO_ORDER", leadTime: { minWeeks: 11, maxWeeks: 16 }, workingDraftStatus: "NONE",
    care: "Sample care note: request finish-specific instructions for the curved timber edge and resin surface; serving and cleaning suitability are not established.",
    installation: "Sample site note: the dimensions describe the oval's outer envelope. Review chair movement, the curved ends and the delivery route against an approved drawing.",
  }),
  makeConcept({
    id: "DP006", slug: "canopy-round-dining-table", title: "Canopy", name: "Canopy Round Dining Table", type: "Round dining table concept", category: "tables",
    description: "A fictional round dining surface with branching timber shapes suspended within an imagined resin field. Canopy considers the table as a composition shared from several viewpoints. Its sample diameter, mineral support and finish choices remain design prompts, with seating and stability still to be reviewed.",
    detail: "Canopy takes its cue from the space between branches rather than from a continuous slab. The fictional round top imagines separated timber forms arranged within resin, leaving translucent intervals that change the rhythm of the surface. A central mineral support is proposed to keep the outline visually continuous from several sides.\n\nThe arrangement would need to be designed for the actual timber available; it is not a repeatable pattern promised by this preview. A real brief would explore how much open resin feels appropriate, how the composition reads under the room's lighting and where seated legs meet the support. Equal width and depth express the sample diameter only. No chair count, stability assessment or weight is supplied. The edition label and fixed amount are interface examples for a proposed group of pieces, not evidence of stock or a purchase offer. The visual remains pending until a suitable concept image is reviewed.",
    image: null, alt: "", width: 0, height: 0, materials: [wood, resin, mineral], finishes: [satin, polished], dimensions: { width: 1500, depth: 1500, height: 750, unit: "mm" },
    priceType: "FIXED", priceAmountMinor: 24500000, edition: { type: "EDITION", label: "Edition study · 6 proposed pieces" }, availability: "READY_TO_SHIP", leadTime: { minWeeks: 3, maxWeeks: 5 }, workingDraftStatus: "NONE",
    care: "Sample care note: the chosen timber, resin and support need confirmed care instructions. The concept supplies no heat, light or staining performance claim.",
    installation: "Sample site note: assess the full diameter through doorways and turns, and review support clearance and stability before any real placement.",
  }),
  makeConcept({
    id: "DP007", slug: "tidal-rectangular-dining-table", title: "Tidal", name: "Tidal Rectangular Dining Table", type: "Dining table concept", category: "tables",
    description: "A fictional rectangular table with alternating resin and timber bands running across its width. Tidal brings a measured rhythm to a long dining surface, with a simple metal frame beneath. The sample palette and proportions explore an ordered composition rather than a manufactured or reserved design.",
    detail: "Tidal studies repetition across a dining surface. In this fictional arrangement, several narrow resin bands interrupt the timber across the short direction of the top. Their spacing changes subtly along the length, creating a rhythm that can be read from an end seat or while approaching the room. A slender metal frame keeps the proposed support visually separate from the pattern.\n\nA real discussion would consider whether the bands should sit beneath individual place settings or remain independent of the seating arrangement. Their number, width and colour would need to respond to selected timber and reviewed material samples. The sample dimensions do not resolve joints, reinforcement or the movement of unlike materials. No image or fabricated prototype supports those details yet. The on-request price and lead-time range demonstrate how a later commission could be presented once the design, surface construction and intended setting have been agreed.",
    image: null, alt: "", width: 0, height: 0, materials: [wood, resin, metal], finishes: [satin, matte], dimensions: { width: 2500, depth: 1000, height: 750, unit: "mm" },
    priceType: "ON_REQUEST", priceAmountMinor: null, edition: { type: "BESPOKE", label: "Bespoke study" }, availability: "MADE_TO_ORDER", leadTime: { minWeeks: 12, maxWeeks: 17 }, workingDraftStatus: "IN_REVIEW",
    care: "Sample care note: the alternating materials require an agreed surface-care method after joints and finishes are confirmed; no chemical resistance is stated.",
    installation: "Sample site note: compare the proposed frame with chair positions and circulation, then confirm access and assembly from the final design.",
  }),
  makeConcept({
    id: "DP008", slug: "umber-twin-base-dining-table", title: "Umber", name: "Umber Twin-Base Dining Table", type: "Dining table concept", category: "tables",
    description: "A fictional dining table grounded by two broad timber supports beneath a warm resin-and-wood surface. Umber explores the relationship between a quiet top and a visibly substantial base. The example footprint and material choices are starting points for discussing seating, room scale and the desired surface balance.",
    detail: "Umber places much of its visual character below the dining surface. Two broad timber supports are imagined as independent forms, turned slightly inward beneath a quieter top. Above them, a restrained amber resin detail follows the timber grain without becoming the main feature. The result is a study in weight, interval and the views through the base.\n\nSupport placement would be an early part of a real brief. Chairs at the sides and ends may need different clearances, and the chosen room could change the distance between the two forms. None of those relationships has been validated by this sample envelope. Timber species, connection details and resin colour remain undecided; the finish controls express ordinary preferences only. The synthetic starting amount and sample timing show possible catalogue fields, not a quote or an installation commitment. A matched visual is still required before the composition can be reviewed as an image.",
    image: null, alt: "", width: 0, height: 0, materials: [wood, resin], finishes: [matte, satin], dimensions: { width: 2600, depth: 1050, height: 760, unit: "mm" },
    priceType: "STARTING_FROM", priceAmountMinor: 31000000, edition: { type: "BESPOKE", label: "Bespoke study" }, availability: "MADE_TO_ORDER", leadTime: { minWeeks: 10, maxWeeks: 16 }, workingDraftStatus: "DRAFT",
    care: "Sample care note: establish care for the timber supports and mixed surface after the final finish is selected; no maintenance interval is promised.",
    installation: "Sample site note: review the support footprints, seated leg clearance and assembly sequence once joints and actual component weights are defined.",
  }),
  makeConcept({
    id: "DP009", slug: "lagoon-pedestal-dining-table", title: "Lagoon", name: "Lagoon Pedestal Dining Table", type: "Pedestal dining table concept", category: "tables",
    description: "A fictional dining table with a softly squared resin top resting above one mineral pedestal. Lagoon studies a pool-like surface held by a compact central form. Its sample dimensions describe an outer envelope, while the edge profile, colour depth and base proportions remain open design questions.",
    detail: "Lagoon imagines a resin surface whose corners turn gently into its sides. The outline sits between a circle and a square, giving the dining table several equivalent approaches without losing a recognisable direction. A single mineral pedestal gathers the support into the centre, leaving the perimeter visually open.\n\nThe proposed colour is a quiet blue-green, but a name cannot establish how an actual resin sample will transmit light or read against the room. A future discussion would compare edge thickness, opacity and the pedestal's width alongside chair placement. Central support does not by itself guarantee legroom or stability, and this concept supplies no structural assessment. Its sample dimensions are intended to help that discussion begin. The on-request price mode and bespoke label describe a possible commissioning journey only. There is no matched product image, reserved material, finished piece or agreed production date behind this fictional record.",
    image: null, alt: "", width: 0, height: 0, materials: [resin, mineral], finishes: [polished, satin], dimensions: { width: 1600, depth: 1450, height: 750, unit: "mm" },
    priceType: "ON_REQUEST", priceAmountMinor: null, edition: { type: "BESPOKE", label: "Bespoke study" }, availability: "MADE_TO_ORDER", leadTime: { minWeeks: 12, maxWeeks: 18 }, workingDraftStatus: "IN_REVIEW",
    care: "Sample care note: obtain approved cleaning and handling guidance for the resin edge and mineral pedestal after the materials are confirmed.",
    installation: "Sample site note: establish the base footprint, support connection and actual weight before agreeing handling, positioning or floor protection.",
  }),
  makeConcept({
    id: "DP010", slug: "ridge-bronze-inlay-dining-table", title: "Ridge", name: "Ridge Bronze-Inlay Dining Table", type: "Dining table concept", category: "tables",
    description: "A fictional timber dining table marked by a fine bronze inlay beside a narrow resin seam. Ridge uses a small metallic line to give direction to a broad surface. The example materials, dimensions and finishes describe a visual study, with fabrication and care details awaiting confirmation.",
    detail: "Ridge concentrates attention on a line that might otherwise be easy to miss. A fine bronze inlay is imagined along one side of a narrow resin seam, tracing a measured path through the timber surface. Its warm reflection would sit beside the quieter grain, giving the composition a different character as the viewpoint changes.\n\nThe inlay is a proposed material detail, not evidence of a resolved joint. A real design would need to establish its depth, edge condition and relationship to both the wood and resin. The surrounding interior could also influence whether that line should be continuous or interrupted. Sample finish options cannot predict how different materials will age together, and no patina or maintenance outcome is promised. The fictional dimensions and lead time demonstrate a bespoke catalogue entry only. A suitable visual, material samples and construction review remain necessary before this idea could become an agreed physical specification.",
    image: null, alt: "", width: 0, height: 0, materials: [wood, resin, metal], finishes: [satin, matte], dimensions: { width: 2400, depth: 1000, height: 755, unit: "mm" },
    priceType: "ON_REQUEST", priceAmountMinor: null, edition: { type: "BESPOKE", label: "Bespoke study" }, availability: "MADE_TO_ORDER", leadTime: { minWeeks: 12, maxWeeks: 18 }, workingDraftStatus: "DRAFT",
    care: "Sample care note: bronze, resin and timber may need different treatment. Confirm an approved routine and expected surface changes for the actual specification.",
    installation: "Sample site note: protect the proposed inlay edge during handling only according to an agreed plan; component dimensions and assembly remain unresolved.",
  }),
  makeConcept({
    id: "DP011", slug: "dune-smoked-resin-dining-table", title: "Dune", name: "Dune Smoked-Resin Dining Table", type: "Dining table concept", category: "tables",
    description: "A fictional dining surface that pairs muted timber with a broad band of smoked resin. Dune explores gentle changes in opacity and tone within a simple rectangular outline. The sample finish and scale invite a material conversation without claiming a repeatable colour effect or a completed table.",
    detail: "Dune begins with a low-contrast meeting of materials. Muted timber sits beside an imagined band of smoked resin, allowing the boundary to be read gradually rather than as a bright dividing line. The rectangular top and restrained metal supports keep attention on differences in grain, translucency and reflected light.\n\nA real version would require physical samples viewed in the intended room. A resin described as smoked can appear quite different beside a window or against a dark floor, and this fictional concept does not supply an approved colour formula. The sample dimensions suggest one possible proportion without settling chair positions, edge thickness or support spacing. Its starting amount is synthetic and carries no agreed scope. With no matched image available, the page keeps its visual pending instead of borrowing a more colourful table. Final materials, construction and timing would need separate confirmation before any real project could proceed.",
    image: null, alt: "", width: 0, height: 0, materials: [wood, resin, metal], finishes: [satin, polished], dimensions: { width: 2200, depth: 950, height: 750, unit: "mm" },
    priceType: "STARTING_FROM", priceAmountMinor: 26800000, edition: { type: "BESPOKE", label: "Bespoke study" }, availability: "MADE_TO_ORDER", leadTime: { minWeeks: 10, maxWeeks: 15 }, workingDraftStatus: "NONE",
    care: "Sample care note: confirm the resin and timber finishes before choosing cleaning products or surface protection; the tint does not establish exposure resistance.",
    installation: "Sample site note: review the lighting, chair layout and access route with an approved drawing; actual weight and support positions are still unknown.",
  }),
  makeConcept({
    id: "DP012", slug: "grove-communal-dining-table", title: "Grove", name: "Grove Communal Dining Table", type: "Communal dining table concept", category: "tables",
    description: "A fictional communal table formed from a sequence of timber sections linked by restrained resin intervals. Grove explores a long shared surface with a changing grain rhythm. Its generous sample footprint invites a room-scale conversation, with seating, circulation and construction still to be defined.",
    detail: "Grove imagines several timber sections becoming one long communal surface. Each section keeps its own grain direction and edge character, while narrow resin intervals connect the sequence without disguising every difference. A repeated supporting frame is proposed below, giving the table a rhythm that can be read along its full length.\n\nThe concept could begin a discussion about a shared dining room or another gathering space, but no commercial-use suitability is established. A real brief would first identify the people, activities and circulation the table needs to accommodate. The sample length does not set a seating count or resolve accessibility, joins, movement or assembly. Section sizes and the delivery route would need to be developed together. This record's draft state and lead-time range are fictional interface examples, not workshop progress. No completed installation or approved image is claimed; the material composition remains a direction for later drawings and samples.",
    image: null, alt: "", width: 0, height: 0, materials: [wood, resin, metal], finishes: [matte, satin], dimensions: { width: 3600, depth: 1100, height: 760, unit: "mm" },
    priceType: "ON_REQUEST", priceAmountMinor: null, edition: { type: "BESPOKE", label: "Bespoke study" }, availability: "MADE_TO_ORDER", leadTime: { minWeeks: 14, maxWeeks: 22 }, workingDraftStatus: "IN_REVIEW",
    care: "Sample care note: agree care for the actual timber sections, resin joins and supporting frame; no communal-use durability or cleaning schedule is specified.",
    installation: "Sample site note: develop section sizes, access, assembly and support positions with the room plan; public-space suitability requires separate assessment.",
  }),
  makeConcept({
    id: "DP015", slug: "contour-oval-coffee-table", title: "Contour", name: "Contour Oval Coffee Table", type: "Oval coffee table concept", category: "tables",
    description: "A fictional oval coffee table with layered resin contours set against a quiet mineral base. Contour studies a low surface that reads like an abstract map from above. The sample dimensions and finish options explore its relationship with seating, without defining a finished casting or available object.",
    detail: "Contour imagines several soft lines visible within an oval resin surface. The lines follow related paths without becoming exact concentric rings, giving the top a sense of depth when viewed from nearby seating. A quieter mineral base holds the composition low in the room so that its upper surface remains the main point of attention.\n\nFor a real brief, the useful starting point would be the surrounding sofa and chairs. The table's length, height and distance from each seat would influence both its usefulness and the way the internal pattern is seen. Layering, transparency and the connection to the base have not been resolved through fabrication. The sample amount is a fictional starting value, and finish preferences do not establish an available casting option. Until an appropriate concept image is reviewed, the visual stays pending. Drawings and material samples would be needed to turn these contours into a specific object.",
    image: null, alt: "", width: 0, height: 0, materials: [resin, mineral], finishes: [satin, polished], dimensions: { width: 1350, depth: 800, height: 350, unit: "mm" },
    priceType: "STARTING_FROM", priceAmountMinor: 11800000, edition: { type: "EDITION", label: "Edition study · 10 proposed pieces" }, availability: "MADE_TO_ORDER", leadTime: { minWeeks: 8, maxWeeks: 12 }, workingDraftStatus: "NONE",
    care: "Sample care note: confirm cleaning and surface-protection instructions for the final layered resin and mineral base; no serving-vessel rating is supplied.",
    installation: "Sample site note: compare the oval footprint and height with the seating plan, and confirm component weight and access before arranging placement.",
  }),
  makeConcept({
    id: "DP016", slug: "drift-nesting-coffee-table", title: "Drift", name: "Drift Nesting Coffee Table", type: "Nesting coffee-table concept", category: "tables",
    description: "A fictional pair of low tables with related resin-and-timber surfaces at different heights. Drift explores an overlapping composition that can be discussed together or apart. The listed dimensions describe the larger table only; the smaller companion, clearances and combined arrangement remain part of a future design brief.",
    detail: "Drift imagines two low tables that share a material language without sharing an identical outline. A larger timber-and-resin surface sits above a smaller companion, allowing one edge to overlap when the pair is drawn together. Their resin details are proposed as related gestures, not a continuous image that requires one fixed arrangement.\n\nThe displayed dimensions refer only to the larger table. The smaller table is tentatively imagined at 700 by 500 by 300 millimetres, while the combined footprint would depend on the chosen overlap. Those figures are fictional discussion aids, not confirmed nesting clearances. A real design would need to resolve the frames, edge spacing, stability and the movement needed to separate the pair. Its on-request price would cover a scope still to be agreed. No matched visual, physical set or tested nesting mechanism exists behind this preview; each surface and support remains subject to drawings and material review.",
    image: null, alt: "", width: 0, height: 0, materials: [wood, resin, metal], finishes: [satin, matte], dimensions: { width: 1100, depth: 700, height: 400, unit: "mm" },
    priceType: "ON_REQUEST", priceAmountMinor: null, edition: { type: "EDITION", label: "Edition study · 8 proposed pairs" }, availability: "MADE_TO_ORDER", leadTime: { minWeeks: 9, maxWeeks: 13 }, workingDraftStatus: "DRAFT",
    care: "Sample care note: agree handling and care for both surfaces and frames; the concept supplies no approved sliding contact or scratch-protection method.",
    installation: "Sample site note: dimensions show the larger table, not the pair's combined footprint. Review overlap, separation space and edge clearance in the actual room.",
  }),
...additionalConcepts.filter((p): p is FurnitureConcept => p.tier === "LARGE"),
];

const artDefaults = {
  originKind: "DEMO_FIXTURE", demoBatchId: "rivya-r8-visual-2026-09", demoVersion: 1,
  contentStatus: "DEMO_VISIBLE", currency: "INR", image: null, alt: "", width: 0, height: 0,
  gallery: [], mediaStatus: "VISUAL_PENDING",
} as const;
type MemoryInput = Omit<MemoryConcept, keyof typeof artDefaults | "demoFixtureKey" | "customization">;
type PersonalInput = Omit<PersonalConcept, keyof typeof artDefaults | "demoFixtureKey" | "customization">;
function makeMemory(input: MemoryInput): MemoryConcept {
  return { ...artDefaults, ...input, demoFixtureKey: `product:${input.id}`,
    customization: { version: 1, fields: ["Occasion", "Names and dates", "Format and size", "Finish preference", "Optional private reference"] } };
}
function makePersonal(input: PersonalInput): PersonalConcept {
  return { ...artDefaults, ...input, demoFixtureKey: `product:${input.id}`,
    customization: { version: 1, fields: ["Permitted personalization", "Variant", "Quantity", "Gift message"] } };
}

export const memoryConcepts: readonly MemoryConcept[] = [
  makeMemory({
    id: "DP085", slug: "vow-framed-varmala-keepsake", title: "Vow", name: "Vow Framed Varmala Keepsake", type: "Varmala frame concept", tier: "MEDIUM", category: "flower-preservation",
    description: "A fictional frame study that gives wedding flowers room to hold their own story. Vow imagines a quiet border around selected botanical details, with optional names and a date kept secondary. Its sizes, materials and timing are sample directions; preservation suitability needs an individual studio discussion.",
    detail: "Vow begins with the relationship between a wedding garland and the space around it. The fictional composition imagines selected flowers arranged within a restrained frame, allowing their differing shapes to remain the focus. Names or a date could sit at the edge of the composition without becoming its main subject.\n\nThe two sample sizes are discussion aids, not a promise that every garland can fit. Flower condition, the quantity retained and the desired arrangement would all influence an eventual design. Before any sentimental material is sent, the studio must supply current acceptance, packing and shipping instructions. This page provides no handling recipe or preservation guarantee. Its frame materials, finish choices and lead time demonstrate a possible catalogue presentation only. A real project would need its own review of the supplied flowers and a confirmed layout.",
    materials: [resin, wood], finishes: [matte, satin], dimensions: { width: 300, depth: 55, height: 400, unit: "mm" },
    priceType: "ON_REQUEST", priceAmountMinor: null, availability: "MADE_TO_ORDER", leadTime: { minWeeks: 6, maxWeeks: 9 }, workingDraftStatus: "NONE",
    care: "Sample care note: request care guidance for the confirmed frame, surface and botanical composition. No colour-retention or exposure guarantee is supplied.",
    memory: { occasions: ["wedding", "anniversary"], preservation: "flowers", format: "Framed botanical composition",
      sizes: [{ label: "Intimate frame", dimensions: { width: 300, depth: 55, height: 400, unit: "mm" } }, { label: "Statement frame", dimensions: { width: 400, depth: 65, height: 500, unit: "mm" } }],
      personalization: ["Optional names", "Optional date", "Layout preference"], materialsNote: "Describe the garland and its current condition first. Wait for current studio acceptance and shipping instructions before sending any flowers." },
  }),
  makeMemory({
    id: "DP091", slug: "hourglass-floral-wall-clock", title: "Hourglass", name: "Hourglass Floral Wall Clock", type: "Floral wall-clock concept", tier: "MEDIUM", category: "preservation-clocks",
    description: "A fictional wall-clock study where a ring of remembered flowers surrounds a calm central face. Hourglass explores a useful object with a personal story, rather than a crowded arrangement. Its circular sizes, finish and starting price are examples, with the mechanism and botanical treatment still awaiting review.",
    detail: "Hourglass places botanical details around the passage of time. In this fictional study, the flowers form an uneven outer rhythm while the imagined clock face keeps enough open space for the hands to remain legible. A restrained dedication could accompany the composition, though the sample does not supply any real names or dates.\n\nThe proposed circular formats invite a conversation about viewing distance, wall position and the amount of floral material available. They do not establish a particular mechanism, battery requirement, accuracy or mounting system. Those practical details would need confirmation for an actual object. Any flowers would also require an individual suitability review and the studio's current instructions before transfer. The listed dimensions, starting price and lead time are interface examples. No image is borrowed from another clock, and no promise of permanent flower colour is made.",
    materials: [resin, metal], finishes: [satin, polished], dimensions: { width: 300, depth: 40, height: 300, unit: "mm" },
    priceType: "STARTING_FROM", priceAmountMinor: 950000, availability: "MADE_TO_ORDER", leadTime: { minWeeks: 5, maxWeeks: 8 }, workingDraftStatus: "DRAFT",
    care: "Sample care note: care, mechanism access and wall mounting depend on the final design. Ask for confirmed guidance before handling an actual clock.",
    memory: { occasions: ["wedding", "anniversary", "family"], preservation: "flowers", format: "Circular floral wall clock",
      sizes: [{ label: "Small circle", dimensions: { width: 300, depth: 40, height: 300, unit: "mm" } }, { label: "Wide circle", dimensions: { width: 400, depth: 45, height: 400, unit: "mm" } }],
      personalization: ["Optional dedication", "Optional date", "Floral arrangement preference"], materialsNote: "Describe the flowers and proposed display location. The studio must confirm botanical suitability, mechanism and current shipping instructions." },
  }),
  makeMemory({
    id: "DP095", slug: "union-engagement-tray", title: "Union", name: "Union Engagement Tray", type: "Engagement tray concept", tier: "MEDIUM", category: "ceremony-trays",
    description: "A fictional ceremony tray composed around two small focal points and a generous open border. Union considers how names, a date and a botanical accent might sit together without competing. Sample dimensions and finish directions describe a display idea; they do not establish serving or food-contact suitability.",
    detail: "Union imagines the engagement tray as a setting for a brief, meaningful moment. The fictional outline leaves room between two proposed ring positions, with a botanical accent following one edge. Names and a date are treated as optional parts of the composition rather than information that must fill every available space.\n\nThe sample is a display study, not a food-serving product or a tested jewellery holder. An eventual brief would clarify what the tray needs to hold, how it will be carried and whether any supplied flowers are intended for inclusion. Physical materials should only be sent after the studio confirms suitability and provides current instructions. The example fixed price, size and finish choices support this preview's presentation; they do not reserve a piece or settle a quotation. Any supports, recesses or attachments would need a separate design review.",
    materials: [resin], finishes: [polished, satin], dimensions: { width: 280, depth: 200, height: 25, unit: "mm" },
    priceType: "FIXED", priceAmountMinor: 480000, availability: "READY_TO_SHIP", leadTime: { minWeeks: 2, maxWeeks: 3 }, workingDraftStatus: "NONE",
    care: "Sample care note: this display concept has no food-contact or scratch-resistance specification. Handling guidance must match a confirmed physical piece.",
    memory: { occasions: ["wedding", "celebration"], preservation: "occasion-design", format: "Ceremony display tray",
      sizes: [{ label: "Paired display", dimensions: { width: 280, depth: 200, height: 25, unit: "mm" } }],
      personalization: ["Optional names", "Optional date", "Botanical accent preference"], materialsNote: "A ceremony design may use a studio-supplied accent or proposed personal material. Describe your preference before requesting any physical-material transfer." },
  }),
  makeMemory({
    id: "DP099", slug: "letterlight-invitation-frame", title: "Letterlight", name: "Letterlight Invitation Frame", type: "Invitation frame concept", tier: "MEDIUM", category: "invitation-memories",
    description: "A fictional invitation frame that keeps the printed page at the centre of the story. Letterlight pairs a quiet surround with space for a small botanical or colour accent. Its sample format invites a discussion about legibility, personal information and whether an original or a copy is appropriate.",
    detail: "Letterlight studies how an invitation might move from a drawer into a considered display. The fictional composition keeps the printed page legible, with an open border that could hold a restrained colour or botanical accent. The idea is to frame the document's own visual character, rather than replacing it with a louder decorative treatment.\n\nAn actual discussion would begin with the invitation's size, folds, printing and personal information. A copy may be more appropriate than an irreplaceable original, but the studio must confirm its current process before anything is sent. This sample does not establish archival compatibility, paper stability or a conservation method. Its dimensions, frame finish and starting price demonstrate the interface only. No real invitation, address or contact detail appears in the preview. The eventual layout and treatment would require separate review with the owner of the document.",
    materials: [resin, wood], finishes: [matte, satin], dimensions: { width: 260, depth: 40, height: 340, unit: "mm" },
    priceType: "STARTING_FROM", priceAmountMinor: 720000, availability: "MADE_TO_ORDER", leadTime: { minWeeks: 4, maxWeeks: 7 }, workingDraftStatus: "IN_REVIEW",
    care: "Sample care note: the paper, print and framing method need an individual assessment. No archival life or lightfastness claim is supplied.",
    memory: { occasions: ["wedding", "anniversary", "celebration"], preservation: "paper", format: "Invitation display frame",
      sizes: [{ label: "Single invitation", dimensions: { width: 260, depth: 40, height: 340, unit: "mm" } }, { label: "Expanded composition", dimensions: { width: 350, depth: 45, height: 450, unit: "mm" } }],
      personalization: ["Optional short dedication", "Border preference", "Private document review"], materialsNote: "Describe the invitation before sharing a private reference. Ask whether a copy is suitable and obtain current studio instructions before sending an original." },
  }),
  makeMemory({
    id: "DP103", slug: "threshold-family-nameplate", title: "Threshold", name: "Threshold Family Nameplate", type: "Family nameplate concept", tier: "MEDIUM", category: "nameplates",
    description: "A fictional nameplate study that brings a personal inscription into a calm botanical composition. Threshold explores a welcoming object for a chosen place, with lettering kept clear and generous. The example sizes and starting price are illustrative; fixing, weather exposure and the final spelling need their own review.",
    detail: "Threshold treats a nameplate as the first small introduction to a household. In this fictional design, a restrained botanical detail sits beside an open area for lettering. The balance between the inscription and the surrounding material matters more than decorative complexity, allowing the imagined object to feel welcoming without becoming crowded.\n\nA future brief would discuss the exact wording, the viewing distance and the intended location. A sheltered interior position and an exposed entrance can have very different requirements, and this sample claims no outdoor or weather performance. Fixings, weight and surface compatibility have not been specified. The two proposed sizes and starting price are examples for the preview, while names remain private and are not prefilled with invented identities. If personal flowers are considered, the studio must first confirm suitability and its current instructions for receiving them.",
    materials: [resin, wood], finishes: [satin, matte], dimensions: { width: 320, depth: 25, height: 160, unit: "mm" },
    priceType: "STARTING_FROM", priceAmountMinor: 560000, availability: "MADE_TO_ORDER", leadTime: { minWeeks: 3, maxWeeks: 5 }, workingDraftStatus: "NONE",
    care: "Sample care note: the final location, lettering and finish determine suitable care. Outdoor suitability and mounting details are not established.",
    memory: { occasions: ["family", "celebration"], preservation: "occasion-design", format: "Personal inscription panel",
      sizes: [{ label: "Compact inscription", dimensions: { width: 320, depth: 25, height: 160, unit: "mm" } }, { label: "Wide inscription", dimensions: { width: 420, depth: 30, height: 180, unit: "mm" } }],
      personalization: ["Household wording", "Lettering preference", "Botanical direction"], materialsNote: "Keep household details private during the initial discussion. Confirm the intended location and any botanical inclusion before a real design is agreed." },
  }),
  makeMemory({
    id: "DP107", slug: "first-chapter-baby-keepsake", title: "First Chapter", name: "First Chapter Baby Keepsake", type: "Family keepsake concept", tier: "MEDIUM", category: "baby-keepsakes",
    description: "A fictional display study for a small collection of family memories. First Chapter imagines a quiet arrangement around one meaningful object, with optional wording kept modest. Its sample formats are for an adult-managed display; private details, material suitability and the treatment of irreplaceable items require careful discussion.",
    detail: "First Chapter starts with the idea of choosing one memory rather than displaying everything at once. The fictional composition leaves an open field around a small keepsake, allowing its outline and story to carry the page. An optional initial or date could be discussed privately, but the preview contains no real child identity or document.\n\nThe example is a decorative display concept for adults to manage, not a toy or a product with verified child-safety properties. A real project would need to identify the proposed item, consider whether a copy or substitute is preferable and agree how it could be incorporated. The studio must provide current acceptance and shipping instructions before anything is sent. Sample dimensions and lead times do not establish preservation compatibility, protective performance or a completed design. Every personal detail would need an explicit review before production.",
    materials: [resin, wood], finishes: [satin, matte], dimensions: { width: 240, depth: 60, height: 300, unit: "mm" },
    priceType: "ON_REQUEST", priceAmountMinor: null, availability: "MADE_TO_ORDER", leadTime: { minWeeks: 5, maxWeeks: 8 }, workingDraftStatus: "DRAFT",
    care: "Sample care note: this is an adult-managed decorative display, not a toy. Care and placement guidance require review of the final piece.",
    memory: { occasions: ["new-arrival", "family"], preservation: "keepsakes", format: "Small keepsake display",
      sizes: [{ label: "Single keepsake", dimensions: { width: 240, depth: 60, height: 300, unit: "mm" } }],
      personalization: ["Optional initial", "Optional date", "Private keepsake description"], materialsNote: "Describe the proposed keepsake without publishing personal records. Confirm suitability and current studio instructions before sending any irreplaceable item." },
  }),
...additionalConcepts.filter((p): p is MemoryConcept => p.tier === "MEDIUM"),
];

export const personalConcepts: readonly PersonalConcept[] = [
  makePersonal({
    id: "DP109", slug: "botanical-resin-pendant", title: "Botanical", name: "Botanical Resin Pendant", type: "Pendant concept", tier: "SMALL", category: "jewellery",
    description: "A fictional pendant study that holds a small botanical accent within a simple outline. Botanical explores clear and softly tinted directions at an intimate scale. The sample variants and fixed price describe a visual idea only; the final fitting, material composition and suitability for wearing remain to be confirmed.",
    detail: "Botanical imagines a pendant as a small composition viewed close to the body. A single botanical accent sits within a restrained outline, with either a clear or softly rose-tinted direction around it. The proposed variants change the visual emphasis without suggesting that either colour has already been produced or photographed.\n\nA real enquiry would confirm the intended scale, the fitting and the exact materials of every component. This preview makes no allergy, skin-contact or durability claim, and no chain length or fastening is promised. The sample fixed price and quantity range exist to demonstrate the gifting interface. An optional initial could be discussed as a separate part of the composition, subject to a legibility review. The page keeps its image marked as pending rather than using unrelated jewellery as evidence of an available product.",
    materials: [resin, metal], finishes: [polished, satin], dimensions: { width: 24, depth: 7, height: 34, unit: "mm" },
    priceType: "FIXED", priceAmountMinor: 180000, availability: "READY_TO_SHIP", leadTime: { minWeeks: 1, maxWeeks: 2 }, workingDraftStatus: "NONE",
    care: "Sample care note: confirm the resin, fittings and supplied instructions. No allergy, skin-contact or water-resistance claim is made.",
    personal: { recipients: ["friend", "sibling"], colours: ["clear", "rose"], festivals: ["everyday", "festive"],
      variants: [{ id: "clear-botanical", label: "Clear botanical", colour: "clear" }, { id: "rose-botanical", label: "Rose botanical", colour: "rose" }],
      personalization: ["Optional single initial"], quantity: { min: 1, max: 6 }, giftNote: "A short gift message can be discussed with a future request. Packaging and fittings are not confirmed by this sample." },
  }),
  makePersonal({
    id: "DP111", slug: "thread-of-light-resin-rakhi", title: "Thread of Light", name: "Thread of Light Resin Rakhi", type: "Rakhi concept", tier: "SMALL", category: "festive",
    description: "A fictional rakhi study built around a small resin accent and a considered thread direction. Thread of Light offers amber and green sample variants, with space to discuss an initial. Its seasonal context is a design prompt; timing, fittings and the supplied materials still need individual confirmation.",
    detail: "Thread of Light considers the rakhi as a small object whose central detail can remain quiet. The fictional resin accent is imagined in amber or green, with the thread acting as part of the overall composition rather than a background accessory. An initial could be proposed if the final scale allows it to remain legible.\n\nThe dimensions refer only to the sample centrepiece, not to a confirmed thread length or fastening. A real request would establish those details alongside material composition, packaging and the required date. The preview does not promise festival delivery, stock or suitability for every wearer. Its starting price and small quantity range demonstrate the request interface only. Selecting a variant describes an intention and does not recolour an image or reserve an item. Any final lettering and material choices would need review before a real arrangement was agreed.",
    materials: [resin], finishes: [satin, polished], dimensions: { width: 28, depth: 6, height: 22, unit: "mm" },
    priceType: "STARTING_FROM", priceAmountMinor: 65000, availability: "MADE_TO_ORDER", leadTime: { minWeeks: 2, maxWeeks: 3 }, workingDraftStatus: "IN_REVIEW",
    care: "Sample care note: confirm the thread, fitting and resin composition before use. No wearer-suitability or exposure rating is supplied.",
    personal: { recipients: ["sibling", "family"], colours: ["amber", "green"], festivals: ["rakhi"],
      variants: [{ id: "amber-thread", label: "Amber accent", colour: "amber" }, { id: "green-thread", label: "Green accent", colour: "green" }],
      personalization: ["Optional single initial", "Thread direction to discuss"], quantity: { min: 1, max: 12 }, giftNote: "Discuss the intended festival date and message before agreeing a request. This sample has no promised dispatch date." },
  }),
  makePersonal({
    id: "DP112", slug: "initial-story-keychain", title: "Initial Story", name: "Initial Story Keychain", type: "Keychain concept", tier: "SMALL", category: "accessories",
    description: "A fictional keychain study with a single initial as its point of focus. Initial Story explores a clear or amber resin direction with a simple outline and restrained hardware. The example size, variants and fixed price are for preview; lettering, attachment details and everyday performance are not yet verified.",
    detail: "Initial Story asks how little detail is needed to make an everyday object feel personal. The fictional design places a single initial within a simple resin outline, leaving enough surrounding space for the letter to read clearly. Clear and amber directions offer two visual moods without claiming an exact colour match to a manufactured piece.\n\nThe sample dimensions describe the resin body only. Hardware size, fastening method and suitability for a particular use would need confirmation in a real discussion. This preview does not establish impact resistance or the security of an attachment. A permitted single initial keeps the personalization brief focused, while a separate gift message could accompany a later request. The fixed price and quantity range are fictional interface values. No name or other identifying detail is prefilled, and choosing a variant does not create an enquiry or hold stock.",
    materials: [resin, metal], finishes: [polished, satin], dimensions: { width: 32, depth: 8, height: 50, unit: "mm" },
    priceType: "FIXED", priceAmountMinor: 85000, availability: "READY_TO_SHIP", leadTime: { minWeeks: 1, maxWeeks: 2 }, workingDraftStatus: "NONE",
    care: "Sample care note: the attachment, resin body and final finish need their own guidance. No impact or fastening-strength rating is supplied.",
    personal: { recipients: ["friend", "sibling", "family"], colours: ["clear", "amber"], festivals: ["everyday", "festive"],
      variants: [{ id: "clear-initial", label: "Clear initial", colour: "clear" }, { id: "amber-initial", label: "Amber initial", colour: "amber" }],
      personalization: ["One initial"], quantity: { min: 1, max: 24 }, giftNote: "The proposed initial and a separate gift message would be reviewed before any real request is confirmed." },
  }),
  makePersonal({
    id: "DP113", slug: "chaptermark-flower-bookmark", title: "Chaptermark", name: "Chaptermark Flower Bookmark", type: "Bookmark concept", tier: "SMALL", category: "desk-objects",
    description: "A fictional bookmark study that gives a narrow botanical composition a place between chapters. Chaptermark explores clear and green directions with an optional small initial. Its slim sample dimensions and fixed price are illustrative; the final thickness, edges and suitability for particular books would need their own review.",
    detail: "Chaptermark treats the bookmark as a long, quiet composition. A botanical accent follows the narrow form, leaving space at one end for an optional initial. The clear sample direction emphasizes the imagined inclusion, while green proposes a more tonal relationship between the background and the plant detail. Neither variant is represented by an approved product image yet.\n\nThe listed thickness is a design example, not a verified fit for every binding or paper. A real conversation would consider the edges, flexibility and any tassel or attachment before treating the object as ready to use. No archival compatibility or protection for books is claimed. The sample fixed price and quantity range support a compact gifting presentation. An accompanying message could refer to a favourite reading moment without being printed on the object itself, keeping the proposed personalization modest and legible.",
    materials: [resin], finishes: [satin, polished], dimensions: { width: 30, depth: 3, height: 145, unit: "mm" },
    priceType: "FIXED", priceAmountMinor: 75000, availability: "READY_TO_SHIP", leadTime: { minWeeks: 1, maxWeeks: 2 }, workingDraftStatus: "DRAFT",
    care: "Sample care note: confirm thickness, edge treatment and compatibility with the intended use. No protection or archival claim for books is made.",
    personal: { recipients: ["reader", "friend"], colours: ["clear", "green"], festivals: ["everyday", "festive"],
      variants: [{ id: "clear-chapter", label: "Clear botanical", colour: "clear" }, { id: "green-chapter", label: "Green botanical", colour: "green" }],
      personalization: ["Optional single initial"], quantity: { min: 1, max: 12 }, giftNote: "A separate reading-themed message can accompany a future brief. No printed quotation or decorative attachment is included by default." },
  }),
  makePersonal({
    id: "DP114", slug: "everyday-resin-coaster-set", title: "Everyday", name: "Everyday Resin Coaster Set", type: "Coaster-set concept", tier: "SMALL", category: "home-objects",
    description: "A fictional set of small resin discs intended to bring a repeated colour note to a table. Everyday explores amber and rose sample directions, with four pieces imagined as a group. The example price is for the proposed set; heat performance, surface protection and finish suitability remain unverified.",
    detail: "Everyday studies the rhythm created by repeating a small object across a table. Four imagined discs share one colour direction while allowing modest variation in the resin composition. Amber gives the sample a warmer emphasis; rose proposes a softer alternative. The variants describe a palette for discussion, not existing stock or a promise of identical colour between pieces.\n\nThe dimensions shown refer to one disc, and the fictional fixed price refers to the proposed set of four. An optional initial could be considered only after the scale and finish have been reviewed. This preview establishes no heat resistance, liquid protection or compatibility with a particular tabletop. A real enquiry would need those practical details confirmed before use. Quantity in a future request would count sets, not individual discs, and any packaging or gift message would remain a separate discussion.",
    materials: [resin], finishes: [satin, polished], dimensions: { width: 95, depth: 95, height: 8, unit: "mm" },
    priceType: "FIXED", priceAmountMinor: 240000, availability: "READY_TO_SHIP", leadTime: { minWeeks: 1, maxWeeks: 3 }, workingDraftStatus: "NONE",
    care: "Sample care note: no heat resistance or tabletop protection has been established. Request confirmed suitability and care information for an actual set.",
    personal: { recipients: ["host", "family", "friend"], colours: ["amber", "rose"], festivals: ["everyday", "festive"],
      variants: [{ id: "amber-set", label: "Amber · four-piece set", colour: "amber" }, { id: "rose-set", label: "Rose · four-piece set", colour: "rose" }],
      personalization: ["Optional shared initial"], quantity: { min: 1, max: 6 }, giftNote: "Sample quantity counts sets of four. Dimensions refer to one disc; packaging and a separate gift message would need confirmation." },
  }),
  makePersonal({
    id: "DP120", slug: "little-archive-keepsake-box", title: "Little Archive", name: "Little Archive Keepsake Box", type: "Keepsake-box concept", tier: "SMALL", category: "home-objects",
    description: "A fictional small box that gives a chosen object a place of its own. Little Archive imagines a calm resin lid above a compact body, with clear and green sample directions. Its optional inscription and dimensions are starting points for a gift brief, with construction and storage suitability still unresolved.",
    detail: "Little Archive considers the small ritual of setting something aside. The fictional box pairs a compact body with an imagined resin lid, leaving room for one modest inscription rather than a crowded arrangement. Clear and green directions suggest different relationships between the lid and the object placed beneath it, without claiming a transparent or sealed construction has been resolved.\n\nThe sample dimensions describe the outer envelope, not the usable interior. A real enquiry would need to establish wall thickness, lid fit and the intended contents before making any storage recommendation. The concept has no airtight, protective or archival rating and is not presented as food storage. Its price remains on request because the proposed construction needs discussion. A short inscription and separate gift message could make the brief personal, while all identifying details would remain absent from the public catalogue.",
    materials: [resin, wood], finishes: [satin, matte], dimensions: { width: 110, depth: 85, height: 55, unit: "mm" },
    priceType: "ON_REQUEST", priceAmountMinor: null, availability: "MADE_TO_ORDER", leadTime: { minWeeks: 3, maxWeeks: 5 }, workingDraftStatus: "IN_REVIEW",
    care: "Sample care note: the box has no airtight, archival or food-storage specification. Confirm the construction and intended contents before use.",
    personal: { recipients: ["family", "friend", "host"], colours: ["clear", "green"], festivals: ["everyday", "festive"],
      variants: [{ id: "clear-archive", label: "Clear lid direction", colour: "clear" }, { id: "green-archive", label: "Green lid direction", colour: "green" }],
      personalization: ["Optional short inscription"], quantity: { min: 1, max: 6 }, giftNote: "Discuss the proposed contents and inscription privately. Dimensions show the outer box only; no gift packaging or protective function is promised." },
  }),
...additionalConcepts.filter((p): p is PersonalConcept => p.tier === "SMALL"),
];


const approvedPresentation: Record<string,{title:string;asset:string;scene?:string}> = {
 DP001:{title:'River Channel',asset:'001',scene:'001'},DP013:{title:'Shallow Basin',asset:'003',scene:'003'},DP035:{title:'Narrow Span',asset:'005',scene:'005'},DP048:{title:'Entryway',asset:'009'},DP069:{title:'Lattice Object',asset:'016'},DP085:{title:'Vow',asset:'020'},DP114:{title:'Everyday',asset:'029'}
};
function withApprovedPresentation<T extends Concept>(piece:T):T {
 const p=approvedPresentation[piece.id];if(!p)return piece;
 const src=`/media/product-hero-${p.asset}-4x5.webp`;
 return {...piece,title:p.title,image:src,alt:`${p.title} — supplied AI concept visualization`,width:1122,height:1402,mediaStatus:'CONCEPT_VISUAL',gallery:[{src,alt:`${p.title} — supplied AI concept`,width:1122,height:1402,caption:'AI concept visualization · not completed work'},...(p.scene?[{src:`/media/product-scene-${p.scene}-16x9.webp`,alt:`${p.title} — imagined interior`,width:1672,height:941,caption:'AI concept interior · not a completed commission'}]:[])]};
}

export const concepts: readonly Concept[] = [...furnitureConcepts, ...memoryConcepts, ...personalConcepts].map(withApprovedPresentation);

export function findConcept(slug: string): Concept | undefined {
  const alias:Record<string,string>={"river-channel":"DP001","shallow-basin":"DP013","narrow-span":"DP035","entryway-bench":"DP048","lattice-object":"DP069"};
  return concepts.find((piece) => piece.slug === slug || piece.id === alias[slug]);
}
export function findCollection(slug: string) {
  return collections.find((collection) => collection.slug === slug);
}
export function conceptsForTier<T extends ProductTier>(tier: T): readonly Extract<Concept, { tier: T }>[] {
  return concepts.filter((piece): piece is Extract<Concept, { tier: T }> => piece.tier === tier);
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
  const matching = furnitureConcepts.filter((piece) => (filters.category === "all" || piece.category === filters.category)
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

function paginatedArt<T extends MemoryConcept | PersonalConcept>(matching: T[], raw: CatalogueQuery, sort: TierSort) {
  if (sort === "title-asc") matching.sort((a, b) => a.title.localeCompare(b.title, "en"));
  if (sort === "price-asc") matching.sort((a, b) => {
    if (a.priceAmountMinor === null) return b.priceAmountMinor === null ? 0 : 1;
    if (b.priceAmountMinor === null) return -1;
    return a.priceAmountMinor - b.priceAmountMinor;
  });
  const pageSize = 4;
  const pageCount = Math.max(1, Math.ceil(matching.length / pageSize));
  const rawPage = typeof raw.page === "string" && /^[1-9]\d{0,8}$/.test(raw.page) ? Number(raw.page) : 1;
  const page = Math.min(rawPage, pageCount);
  return { items: matching.slice((page - 1) * pageSize, page * pageSize), total: matching.length, page, pageCount, pageSize };
}

export function queryMemory(raw: CatalogueQuery) {
  const filters: MemoryFilters = {
    occasion: optionValue(raw.occasion, memoryOccasionOptions, "all"),
    preservation: optionValue(raw.preservation, preservationOptions, "all"),
    sort: optionValue(raw.sort, tierSortOptions, "featured"),
  };
  const matching = memoryConcepts.filter((piece) =>
    (filters.occasion === "all" || piece.memory.occasions.includes(filters.occasion))
    && (filters.preservation === "all" || piece.memory.preservation === filters.preservation));
  return { ...paginatedArt(matching, raw, filters.sort), filters };
}

export function queryPersonal(raw: CatalogueQuery) {
  const filters: PersonalFilters = {
    recipient: optionValue(raw.recipient, personalRecipientOptions, "all"),
    colour: optionValue(raw.colour, personalColourOptions, "all"),
    festival: optionValue(raw.festival, personalFestivalOptions, "all"),
    sort: optionValue(raw.sort, tierSortOptions, "featured"),
  };
  const matching = personalConcepts.filter((piece) =>
    (filters.recipient === "all" || piece.personal.recipients.includes(filters.recipient))
    && (filters.colour === "all" || piece.personal.colours.includes(filters.colour))
    && (filters.festival === "all" || piece.personal.festivals.includes(filters.festival)));
  return { ...paginatedArt(matching, raw, filters.sort), filters };
}

function artHref(path: "/memory-art" | "/personal-art", filters: Partial<MemoryFilters> | Partial<PersonalFilters>, keys: readonly string[], page: number) {
  const params = new URLSearchParams();
  for (const key of keys) {
    const value = (filters as Record<string, string | undefined>)[key];
    if (value && value !== "all" && value !== "featured") params.set(key, value);
  }
  if (Number.isSafeInteger(page) && page > 1) params.set("page", String(page));
  return `${path}${params.size ? `?${params.toString()}` : ""}`;
}

export function memoryHref(filters: Partial<MemoryFilters> = {}, page = 1): string {
  return artHref("/memory-art", filters, ["occasion", "preservation", "sort"], page);
}
export function personalHref(filters: Partial<PersonalFilters> = {}, page = 1): string {
  return artHref("/personal-art", filters, ["recipient", "colour", "festival", "sort"], page);
}

export function formatPrice(piece: Pick<Concept, "priceType" | "priceAmountMinor" | "currency">): string {
  if (piece.priceType === "ON_REQUEST" || piece.priceAmountMinor === null) return "Price on request";
  const amount = new Intl.NumberFormat("en-IN", { style: "currency", currency: piece.currency, minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(piece.priceAmountMinor / 100);
  return `${piece.priceType === "STARTING_FROM" ? "From " : ""}${amount}`;
}
