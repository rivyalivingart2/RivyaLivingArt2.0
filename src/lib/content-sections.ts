import type { ContentReferences } from "@/lib/content-contracts";
import type { AssetReference } from "@/lib/studio-media";

export type SectionType = "hero" | "product-selection" | "category-discovery" | "material-story" | "commission-process" | "three-world-intro" | "project-story" | "testimonial" | "faq" | "journal-selection" | "contact";
export type PageSection = {
  id: string;
  type: SectionType;
  schemaVersion: 1;
  hidden: boolean;
  variant: string;
  fields: {
    heading: string;
    body: string;
    eyebrow?: string;
    href?: string;
    linkLabel?: string;
    referenceIds: string[];
    media?: AssetReference | null;
  };
};
export type SectionReferenceKind = "products" | "articles" | "faqs" | "testimonials";
export type SectionDefinition = Readonly<{
  type: SectionType;
  schemaVersion: 1;
  label: string;
  description: string;
  variants: readonly string[];
  referenceKind?: SectionReferenceKind;
  maxReferences: number;
  allowsMedia: boolean;
  allowsLink: boolean;
  renderer: string;
  migration: "Version 1 only; future versions require a source migration.";
  defaults: Readonly<{ heading: string; body: string; eyebrow: string; href?: string; linkLabel?: string }>;
}>;
const define = (definition: Omit<SectionDefinition, "schemaVersion" | "migration">): SectionDefinition => ({
  ...definition, schemaVersion: 1, migration: "Version 1 only; future versions require a source migration.",
});
export const sectionRegistry: Readonly<Record<SectionType, SectionDefinition>> = {
  hero: define({ type: "hero", label: "Hero", description: "An opening statement and a controlled page link.", variants: ["editorial", "split"], maxReferences: 0, allowsMedia: true, allowsLink: true, renderer: "PublicPageHeader", defaults: { eyebrow: "RivyaLivingArt / A sample direction", heading: "Art for the space.", body: "Collectible furniture and spatial art, explored through labelled fictional studies.", href: "/collectible-design", linkLabel: "Explore collectible design" } }),
  "product-selection": define({ type: "product-selection", label: "Product selection", description: "Catalogue references; specifications and prices stay with each product.", variants: ["grid", "featured"], referenceKind: "products", maxReferences: 6, allowsMedia: false, allowsLink: true, renderer: "ConceptCard", defaults: { eyebrow: "Selected furniture studies", heading: "Objects with presence.", body: "A selection of fictional designs. Dimensions, prices and availability are sample values.", href: "/collectible-design", linkLabel: "Explore the collection" } }),
  "category-discovery": define({ type: "category-discovery", label: "Category discovery", description: "The three fixed collection destinations, with furniture first.", variants: ["cards", "rows"], maxReferences: 0, allowsMedia: false, allowsLink: false, renderer: "WorldIntro", defaults: { eyebrow: "Find your direction", heading: "Begin with the scale.", body: "Furniture leads, with distinct journeys for memory art and personal pieces." } }),
  "material-story": define({ type: "material-story", label: "Material story", description: "Editorial copy paired with a selected library image.", variants: ["text", "split"], maxReferences: 0, allowsMedia: true, allowsLink: true, renderer: "ContentMaterialStory", defaults: { eyebrow: "A visual language", heading: "Grain. Light. Form.", body: "A fictional material direction for owner review. Actual composition, suitability and performance remain to be confirmed for each real piece.", href: "/materials", linkLabel: "Read the material notes" } }),
  "commission-process": define({ type: "commission-process", label: "Commission process", description: "The existing sample brief-planning steps; no invented production promise.", variants: ["steps", "compact"], maxReferences: 0, allowsMedia: false, allowsLink: true, renderer: "ContentPlanningSteps", defaults: { eyebrow: "From idea to brief", heading: "Give the idea a little shape.", body: "A conceptual planning guide, awaiting owner review. This is not a verified fabrication process or production schedule.", href: "/commission", linkLabel: "Try a sample commission" } }),
  "three-world-intro": define({ type: "three-world-intro", label: "Three-world introduction", description: "The shared public introduction to furniture, memory and personal art.", variants: ["cards", "rows"], maxReferences: 0, allowsMedia: false, allowsLink: false, renderer: "WorldIntro", defaults: { eyebrow: "One point of view", heading: "The scale changes. The intention stays personal.", body: "A material-led approach across three distinct scales of expression." } }),
  "project-story": define({ type: "project-story", label: "Project story", description: "A labelled fictional project narrative, never proof of completed client work.", variants: ["text", "split"], maxReferences: 0, allowsMedia: true, allowsLink: true, renderer: "ContentMaterialStory", defaults: { eyebrow: "Fictional project study", heading: "A piece in conversation with a room.", body: "Describe a fictional spatial idea using sample details only. No completed commission, client identity or project result is implied.", href: "/portfolio", linkLabel: "Explore fictional project studies" } }),
  testimonial: define({ type: "testimonial", label: "Testimonial selection", description: "Fictional review fixtures retain their permanent sample label.", variants: ["grid", "featured"], referenceKind: "testimonials", maxReferences: 3, allowsMedia: false, allowsLink: false, renderer: "TestimonialQuote", defaults: { eyebrow: "Layout studies / fictional words", heading: "A space for a perspective.", body: "The words below are fictional sample content, not customer reviews or evidence of completed work." } }),
  faq: define({ type: "faq", label: "FAQ selection", description: "Selected source answers rendered with the public disclosure component.", variants: ["stack"], referenceKind: "faqs", maxReferences: 8, allowsMedia: false, allowsLink: true, renderer: "FaqAnswers", defaults: { eyebrow: "A little clarity", heading: "Before the conversation.", body: "Sample answers awaiting the studio’s review. Real service details require confirmation.", href: "/faq", linkLabel: "Explore all sample answers" } }),
  "journal-selection": define({ type: "journal-selection", label: "Journal selection", description: "Article references preserve each source title and destination.", variants: ["grid", "rows"], referenceKind: "articles", maxReferences: 4, allowsMedia: false, allowsLink: true, renderer: "ContentJournalCard", defaults: { eyebrow: "Notes from a developing atelier", heading: "A closer look.", body: "Fictional editorial drafts, with owner review still to come.", href: "/journal", linkLabel: "Enter the journal" } }),
  contact: define({ type: "contact", label: "Contact invitation", description: "A controlled invitation to an existing public contact journey.", variants: ["closing"], maxReferences: 0, allowsMedia: false, allowsLink: true, renderer: "PublicPageClosing", defaults: { eyebrow: "Continue the conversation", heading: "Begin with a possibility.", body: "Explore a fictional brief for your space, a memory or a personal gift. Nothing is submitted by this preview.", href: "/contact", linkLabel: "Choose a conversation" } }),
};

export function createPageSection(type: SectionType, id: string): PageSection {
  const definition = sectionRegistry[type];
  return { id, type, schemaVersion: 1, hidden: false, variant: definition.variants[0], fields: { ...definition.defaults, referenceIds: [], ...(definition.allowsMedia ? { media: null } : {}) } };
}

/** Local internal paths only. This composer never constructs external contact URLs from a draft. */
export function safeSectionHref(value: string | undefined): string | undefined {
  if (!value || value.length > 300 || !/^\/(?!\/)[a-zA-Z0-9/_?#=&.%+-]*$/.test(value) || /%(?:2f|5c|0[ad])/i.test(value)) return undefined;
  return value;
}

export function sectionReferenceOptions(type: SectionType, references: ContentReferences): { id: string; label: string }[] {
  switch (sectionRegistry[type]?.referenceKind) {
    case "products": return references.products.map((item) => ({ id: item.id, label: `${item.title} · ${item.tier}` }));
    case "articles": return references.articles.map((item) => ({ id: item.id, label: item.title }));
    case "faqs": return references.faqs.map((item) => ({ id: item.id, label: item.question }));
    case "testimonials": return references.testimonials.map((item) => ({ id: item.id, label: `${item.identity} · ${item.tier}` }));
    default: return [];
  }
}

export function validatePageSections(sections: readonly PageSection[], references: ContentReferences, options: { furnitureFirst?: boolean } = {}): string[] {
  const errors: string[] = [];
  if (sections.length > 20) errors.push("Page sections: keep at most 20 blocks.");
  if (!sections.some((section) => !section.hidden)) errors.push("Page sections: show at least one section.");
  const seen = new Set<string>();
  sections.forEach((section, index) => {
    const label = `Section ${index + 1} (${section.id})`;
    const definition = sectionRegistry[section.type];
    if (!Object.hasOwn(sectionRegistry, section.type) || section.schemaVersion !== 1) { errors.push(`${label}: unsupported section type or version; replace this block with an approved template.`); return; }
    if (Object.keys(section).some((key) => !["id", "type", "schemaVersion", "hidden", "variant", "fields"].includes(key))) errors.push(`${label}: remove unsupported block properties.`);
    if (!section.fields || typeof section.fields !== "object" || typeof section.fields.heading !== "string" || typeof section.fields.body !== "string" || !Array.isArray(section.fields.referenceIds) || section.fields.referenceIds.some((id) => typeof id !== "string")) {
      errors.push(`${label}: the block fields do not match this template; replace it with an approved template.`);
      return;
    }
    if (Object.keys(section.fields).some((key) => !["heading", "body", "eyebrow", "href", "linkLabel", "referenceIds", "media"].includes(key))) errors.push(`${label}: remove unsupported template fields.`);
    if (!/^[a-zA-Z0-9_-]{1,100}$/.test(section.id) || seen.has(section.id)) errors.push(`${label}: assign a unique, stable section ID.`);
    seen.add(section.id);
    if (!definition.variants.includes(section.variant)) errors.push(`${label}: choose an approved variant.`);
    if (!section.fields.heading.trim() || section.fields.heading.length > 140) errors.push(`${label}: enter a heading of 1–140 characters.`);
    if (!section.fields.body.trim() || section.fields.body.length > 1800) errors.push(`${label}: enter body copy of 1–1,800 characters.`);
    if ((section.fields.eyebrow?.length ?? 0) > 90) errors.push(`${label}: shorten the eyebrow to 90 characters.`);
    if (section.fields.href && (!definition.allowsLink || !safeSectionHref(section.fields.href))) errors.push(`${label}: choose a valid internal page link.`);
    if (section.fields.href && (!section.fields.linkLabel?.trim() || section.fields.linkLabel.length > 80)) errors.push(`${label}: add a link label of 1–80 characters.`);
    if (section.type === "contact" && !section.fields.href) errors.push(`${label}: add the contact invitation destination.`);
    const ids = section.fields.referenceIds;
    const available = new Set(sectionReferenceOptions(section.type, references).map((item) => item.id));
    if (ids.length > definition.maxReferences) errors.push(`${label}: select at most ${definition.maxReferences} references.`);
    if (definition.referenceKind && !ids.length) errors.push(`${label}: select at least one ${definition.referenceKind} reference.`);
    if (new Set(ids).size !== ids.length) errors.push(`${label}: remove duplicate references.`);
    ids.forEach((id) => { if (!available.has(id)) errors.push(`${label}: reference ${id} is unavailable; remove it or select a current record.`); });
    if (section.fields.media) {
      const asset = references.media.find((item) => item.id === section.fields.media?.assetId);
      if (asset && (asset.status !== "PREVIEW_ONLY" || !asset.src)) errors.push(`${label}: selected media has no reviewed preview image; select an available asset or clear it.`);
      if (!section.fields.media.caption.trim() || section.fields.media.caption.length > 500) errors.push(`${label}: add a media caption of 1–500 characters.`);
      if (section.fields.media.alt.length > 300) errors.push(`${label}: shorten image alt text to 300 characters.`);
      if (![section.fields.media.focalPoint.x, section.fields.media.focalPoint.y].every((value) => Number.isFinite(value) && value >= 0 && value <= 100)) errors.push(`${label}: choose a focal point within the image bounds.`);
      if (!definition.allowsMedia) errors.push(`${label}: this template does not accept media.`);
      if (!references.media.some((asset) => asset.id === section.fields.media?.assetId)) errors.push(`${label}: selected media is unavailable; select another asset or clear the reference.`);
      if (!section.fields.media.alt.trim()) errors.push(`${label}: add usage-specific image alt text.`);
    }
  });
  if (options.furnitureFirst) {
    const visible = sections.filter((section) => !section.hidden);
    if (visible[0]?.type !== "hero" || visible[0]?.fields.href !== "/collectible-design") errors.push("Homepage hierarchy: keep a visible opening hero linked to /collectible-design.");
    const firstSelection = visible.find((section) => section.type === "product-selection");
    if (!firstSelection || !firstSelection.fields.referenceIds.length || firstSelection.fields.referenceIds.some((id) => references.products.find((product) => product.id === id)?.tier !== "LARGE")) errors.push("Homepage hierarchy: the first product selection must contain LARGE furniture references only.");
    if (!visible.some((section) => section.type === "three-world-intro" || section.type === "category-discovery")) errors.push("Homepage hierarchy: retain a visible three-world introduction or category discovery section.");
  }
  return errors;
}

export function extractSectionReferences(sections: readonly PageSection[]) {
  const found = { products: new Set<string>(), articles: new Set<string>(), faqs: new Set<string>(), testimonials: new Set<string>(), media: new Set<string>() };
  for (const section of sections) {
    const kind = Object.hasOwn(sectionRegistry, section.type) ? sectionRegistry[section.type].referenceKind : undefined;
    if (kind) section.fields.referenceIds.forEach((id) => found[kind].add(id));
    if (section.fields.media) found.media.add(section.fields.media.assetId);
  }
  return { productIds: [...found.products], articleIds: [...found.articles], faqIds: [...found.faqs], testimonialIds: [...found.testimonials], mediaIds: [...found.media] };
}
