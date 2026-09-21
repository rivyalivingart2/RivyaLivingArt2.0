/** Source-only fixtures for R8-1. No database, offer, review or inventory claim. */
export type ProductTier = "LARGE" | "MEDIUM" | "SMALL";
export type CollectionSlug = "collectible-design" | "memory-art" | "personal-art";
export type Concept = Readonly<{
  id: string; slug: string; title: string; type: string; tier: ProductTier;
  description: string; image: string; alt: string; width: number; height: number;
  originKind: "DEMO_FIXTURE"; priceType: "ON_REQUEST";
}>;

export const collections = [
  { slug: "collectible-design", number: "01", label: "Collectible design", title: "Art for the space.", detail: "Furniture & spatial art", description: "Sculptural tables, considered seating and statement objects. A material-led expression for the spaces you call your own.", tier: "LARGE" },
  { slug: "memory-art", number: "02", label: "Memory art", title: "Art for the memory.", detail: "Preservation & celebration", description: "A moment, a flower, a personal story. A quieter collection centred on the things you choose to remember.", tier: "MEDIUM" },
  { slug: "personal-art", number: "03", label: "Personal art & gifts", title: "Art for the person.", detail: "Objects & personal gifts", description: "Small-scale expressions with a personal point of view. Thoughtful objects, made meaningful through detail.", tier: "SMALL" },
] as const;

export const concepts: readonly Concept[] = [
  { id: "DP001", slug: "riverline-live-edge-dining-table", title: "Riverline", type: "Dining table concept", tier: "LARGE", description: "A fictional dining-table study in the meeting of flowing blue resin and expressive wood grain. Its long silhouette explores the relationship between a functional surface and a sculptural centrepiece.", image: "/media/concepts/riverline.avif", alt: "AI concept of a live-edge dining table with a blue resin river in a dark interior", width: 560, height: 700, originKind: "DEMO_FIXTURE", priceType: "ON_REQUEST" },
  { id: "DP013", slug: "basin-shallow-pour-coffee-table", title: "Basin", type: "Coffee table concept", tier: "LARGE", description: "A fictional coffee-table study in low profiles, organic edges and translucent material. This concept is a visual starting point, not a manufactured product or a verified specification.", image: "/media/concepts/basin.avif", alt: "AI-generated resin and wood coffee-table concept in a softly lit interior", width: 480, height: 600, originKind: "DEMO_FIXTURE", priceType: "ON_REQUEST" },
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
