import type { Concept, MaterialId, MemoryOccasion, PersonalColour, PersonalFestival, PersonalRecipient, PreservationType, PriceType, ProductTier } from "@/lib/catalogue";

/** Editable strings retain incomplete input; this is not a persisted product schema. */
export type StudioProductDraft = {
  tier: ProductTier | "";
  name: string; title: string; slug: string; type: string; description: string; detail: string; care: string;
  finishes: { id: string; label: string; description: string }[];
  materials: MaterialId[]; width: string; depth: string; height: string;
  priceType: PriceType; priceAmountMinor: string; minWeeks: string; maxWeeks: string;
  availability: Concept["availability"]; stage: "DRAFT" | "IN_REVIEW";
  large: { category: string; editionType: "BESPOKE" | "EDITION"; editionLabel: string; installation: string };
  medium: { category: string; preservation: PreservationType | ""; occasions: MemoryOccasion[]; format: string; sizes: { label: string; width: string; depth: string; height: string }[]; personalization: string; materialsNote: string };
  small: { category: string; recipients: PersonalRecipient[]; colours: PersonalColour[]; festivals: PersonalFestival[]; variants: { id: string; label: string; colour: PersonalColour }[]; personalization: string; minQuantity: string; maxQuantity: string; giftNote: string };
};

export const studioTierPresentation = {
  LARGE: { label: "Large · collectible design", collection: "Collectible design", slug: "collectible-design", card: "Furniture proportions, material and edition", detail: "Spatial dimensions, edition and installation", cta: "Discuss a commission", required: "Category, edition description and installation notes" },
  MEDIUM: { label: "Medium · memory art", collection: "Memory art", slug: "memory-art", card: "Occasion, preservation type and format", detail: "Preservation, sizes and personalization", cta: "Preserve a memory", required: "Category, preservation, occasion, format, at least one size and material notes" },
  SMALL: { label: "Small · personal art", collection: "Personal art & gifts", slug: "personal-art", card: "Variant, colour and gifting occasion", detail: "Variants, recipient and quantity choices", cta: "Make it personal", required: "Category, recipient, colour, occasion, a variant, quantity range and gift notes" },
} as const;

export const studioTierCategories = {
  LARGE: [{ value: "tables", label: "Tables & desks" }, { value: "seating", label: "Seating" }, { value: "consoles", label: "Consoles" }, { value: "installations", label: "Art & installations" }],
  MEDIUM: [{ value: "flower-preservation", label: "Flower preservation" }, { value: "preservation-clocks", label: "Preservation clocks" }, { value: "ceremony-trays", label: "Ceremony trays" }, { value: "invitation-memories", label: "Invitation memories" }, { value: "nameplates", label: "Nameplates" }, { value: "baby-keepsakes", label: "Baby keepsakes" }],
  SMALL: [{ value: "jewellery", label: "Jewellery" }, { value: "festive", label: "Festive" }, { value: "accessories", label: "Accessories" }, { value: "desk-objects", label: "Desk objects" }, { value: "home-objects", label: "Home objects" }],
} as const;

export function createStudioProductDraft(product?: Concept): StudioProductDraft {
  const draft: StudioProductDraft = {
    tier: product?.tier ?? "", name: product?.name ?? "", title: product?.title ?? "", slug: product?.slug ?? "", type: product?.type ?? "",
    description: product?.description ?? "", detail: product?.detail ?? "", care: product?.care ?? "", materials: product ? product.materials.map((item) => item.id) : [],
    finishes: product ? product.finishes.map((finish) => ({ ...finish })) : [{ id: "", label: "", description: "" }],
    width: product ? String(product.dimensions.width) : "", depth: product ? String(product.dimensions.depth) : "", height: product ? String(product.dimensions.height) : "",
    priceType: product?.priceType ?? "ON_REQUEST", priceAmountMinor: product?.priceAmountMinor == null ? "" : String(product.priceAmountMinor),
    minWeeks: product ? String(product.leadTime.minWeeks) : "", maxWeeks: product ? String(product.leadTime.maxWeeks) : "",
    availability: product?.availability ?? "MADE_TO_ORDER", stage: product?.workingDraftStatus === "IN_REVIEW" ? "IN_REVIEW" : "DRAFT",
    large: { category: "", editionType: "BESPOKE", editionLabel: "", installation: "" },
    medium: { category: "", preservation: "", occasions: [], format: "", sizes: [{ label: "", width: "", depth: "", height: "" }], personalization: "", materialsNote: "" },
    small: { category: "", recipients: [], colours: [], festivals: [], variants: [{ id: "", label: "", colour: "clear" }], personalization: "", minQuantity: "1", maxQuantity: "1", giftNote: "" },
  };
  if (product?.tier === "LARGE") draft.large = { category: product.category, editionType: product.edition.type, editionLabel: product.edition.label, installation: product.installation };
  if (product?.tier === "MEDIUM") draft.medium = {
    category: product.category, preservation: product.memory.preservation, occasions: [...product.memory.occasions], format: product.memory.format,
    sizes: product.memory.sizes.map((size) => ({ label: size.label, width: String(size.dimensions.width), depth: String(size.dimensions.depth), height: String(size.dimensions.height) })),
    personalization: product.memory.personalization.join("\n"), materialsNote: product.memory.materialsNote,
  };
  if (product?.tier === "SMALL") draft.small = {
    category: product.category, recipients: [...product.personal.recipients], colours: [...product.personal.colours], festivals: [...product.personal.festivals],
    variants: product.personal.variants.map((variant) => ({ ...variant })), personalization: product.personal.personalization.join("\n"),
    minQuantity: String(product.personal.quantity.min), maxQuantity: String(product.personal.quantity.max), giftNote: product.personal.giftNote,
  };
  return draft;
}

export type StudioDraftErrors = Record<string, string>;
const whole = (value: string, min = 1) => /^\d+$/.test(value) && Number.isSafeInteger(Number(value)) && Number(value) >= min;

/** Frontend feedback only. Real server validation is part of the backend phase. */
export function validateStudioProductDraft(draft: StudioProductDraft): StudioDraftErrors {
  const errors: StudioDraftErrors = {};
  const required = (key: string, value: string, label: string) => { if (!value.trim()) errors[key] = `Enter ${label}.`; };
  if (!draft.tier) errors.tier = "Choose and confirm a product tier.";
  required("name", draft.name, "the full product name"); required("title", draft.title, "a short display title");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(draft.slug)) errors.slug = "Use lowercase letters, numbers and single hyphens.";
  required("type", draft.type, "a product type"); required("description", draft.description, "a short description"); required("detail", draft.detail, "the detail-page description");
  required("care", draft.care, "sample care notes");
  if (!draft.finishes.length) errors.finishes = "Add at least one finish direction.";
  draft.finishes.forEach((finish, index) => {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(finish.id) || draft.finishes.some((other, otherIndex) => otherIndex !== index && other.id === finish.id)) errors[`finishes.${index}.id`] = "Use a unique lowercase finish ID with single hyphens.";
    required(`finishes.${index}.label`, finish.label, "a finish label");
    required(`finishes.${index}.description`, finish.description, "a finish description");
  });
  if (!draft.materials.length) errors.materials = "Choose at least one material.";
  for (const key of ["width", "depth", "height"] as const) if (!whole(draft[key])) errors[key] = "Enter a positive whole number in millimetres.";
  if (draft.priceType !== "ON_REQUEST" && !whole(draft.priceAmountMinor)) errors.priceAmountMinor = "Enter a positive whole amount in paise (₹1 = 100 paise).";
  if (!whole(draft.minWeeks, 0)) errors.minWeeks = "Enter a whole number of weeks, zero or more.";
  if (!whole(draft.maxWeeks, 0) || Number(draft.maxWeeks) < Number(draft.minWeeks)) errors.maxWeeks = "Enter whole weeks equal to or greater than the minimum.";
  if (draft.tier) {
    const key = draft.tier === "LARGE" ? "large" : draft.tier === "MEDIUM" ? "medium" : "small";
    if (!studioTierCategories[draft.tier].some((category) => category.value === draft[key].category)) errors[`${key}.category`] = "Choose a category for this tier.";
  }
  if (draft.tier === "LARGE") {
    required("large.editionLabel", draft.large.editionLabel, "an edition description"); required("large.installation", draft.large.installation, "installation and site notes");
  }
  if (draft.tier === "MEDIUM") {
    const memory = draft.medium;
    if (!memory.preservation) errors["medium.preservation"] = "Choose a preservation type.";
    if (!memory.occasions.length) errors["medium.occasions"] = "Choose at least one occasion.";
    required("medium.format", memory.format, "a display format"); required("medium.materialsNote", memory.materialsNote, "preservation material notes");
    if (!memory.sizes.length) errors["medium.sizes"] = "Add at least one size.";
    memory.sizes.forEach((size, index) => {
      required(`medium.sizes.${index}.label`, size.label, "a size label");
      for (const key of ["width", "depth", "height"] as const) if (!whole(size[key])) errors[`medium.sizes.${index}.${key}`] = "Enter positive whole millimetres.";
    });
  }
  if (draft.tier === "SMALL") {
    const personal = draft.small;
    for (const key of ["recipients", "colours", "festivals"] as const) if (!personal[key].length) errors[`small.${key}`] = `Choose at least one ${key === "festivals" ? "gifting occasion" : key === "colours" ? "colour" : "recipient"}.`;
    if (!personal.variants.length) errors["small.variants"] = "Add at least one variant.";
    personal.variants.forEach((variant, index) => {
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(variant.id) || personal.variants.some((other, otherIndex) => otherIndex !== index && other.id === variant.id)) errors[`small.variants.${index}.id`] = "Use a unique lowercase variant ID with single hyphens.";
      required(`small.variants.${index}.label`, variant.label, "a variant label");
      if (!personal.colours.includes(variant.colour)) errors[`small.variants.${index}.colour`] = "Include this colour in the selected product colours.";
    });
    if (!whole(personal.minQuantity)) errors["small.minQuantity"] = "Enter a positive whole quantity.";
    if (!whole(personal.maxQuantity) || Number(personal.maxQuantity) < Number(personal.minQuantity)) errors["small.maxQuantity"] = "Enter a whole quantity at least as large as the minimum.";
    required("small.giftNote", personal.giftNote, "gifting and packaging notes");
  }
  return errors;
}

export function studioDraftPrice(draft: StudioProductDraft): string {
  if (draft.priceType === "ON_REQUEST") return "Price on request";
  if (!whole(draft.priceAmountMinor)) return "Add a sample price";
  const amount = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(Number(draft.priceAmountMinor) / 100);
  return `${draft.priceType === "STARTING_FROM" ? "From " : ""}${amount}`;
}
