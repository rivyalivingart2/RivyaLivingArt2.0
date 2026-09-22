/** Server presentation adapter. Pass one config to the client; never the full catalogue. */
import {
  categoryOptions, formatPrice, memoryOccasionOptions, personalColourOptions,
  type Concept, type FurnitureConcept, type MemoryConcept, type PersonalConcept,
} from "@/lib/rivya/source/catalogue";
import type { InquiryConfig, InquiryField, InquiryMode, InquiryProductSnapshot, InquiryStep, InquiryValues } from "@/lib/rivya/source/inquiry-schema";

// These are bounded visual-preview defaults, not studio policies or production validation.
// Reference bytes stay in the current browser tab; a future private upload adapter is separate.
const previewLimits = {
  referenceMaxBytes: 5 * 1024 * 1024,
  referenceMaxCount: 1,
  referenceTypes: ["image/jpeg", "image/png", "image/webp"],
} as const;
const reviewNotice = "This is a fictional preview. Creating a demo summary does not save an enquiry, send a message, reserve stock or confirm a price. Only use sample details; the local draft disappears when this page is left or reloaded.";

function productSnapshot(piece: Concept | undefined): InquiryProductSnapshot | null {
  if (!piece) return null;
  return {
    id: piece.id, slug: piece.slug, title: piece.title, name: piece.name, tier: piece.tier,
    demoVersion: piece.demoVersion, priceType: piece.priceType, priceAmountMinor: piece.priceAmountMinor,
    currency: piece.currency, priceLabel: formatPrice(piece),
    leadTime: { minWeeks: piece.leadTime.minWeeks, maxWeeks: piece.leadTime.maxWeeks },
  };
}

const contactFields: readonly InquiryField[] = [
  { id: "contactName", label: "Sample name", type: "text", required: true, minLength: 2, maxLength: 80, placeholder: "Demo Visitor", hint: "Use a fictional label, not a real person's details." },
  { id: "contactMethod", label: "Example contact method", type: "radio", required: true, options: [{ value: "email", label: "Email" }, { value: "phone", label: "Phone" }] },
  { id: "contactEmail", label: "Sample email", type: "email", maxLength: 160, visibleWhen: { field: "contactMethod", value: "email" }, requiredWhen: { field: "contactMethod", value: "email" }, placeholder: "visitor@example.invalid", hint: "An .invalid address cannot receive mail. Nothing is sent from this preview." },
  { id: "contactPhone", label: "Sample phone", type: "tel", maxLength: 30, visibleWhen: { field: "contactMethod", value: "phone" }, requiredWhen: { field: "contactMethod", value: "phone" }, placeholder: "+00 0000000000", hint: "Use the non-contactable example +00 0000000000. There is no calling or messaging action." },
  { id: "previewConsent", label: "I am using fictional details and understand this is a local preview.", type: "checkbox", required: true, hint: "Preview acknowledgement only. This is not the final business privacy-consent wording." },
];
const initialContact: InquiryValues = { contactName: "", contactMethod: "email", contactEmail: "", contactPhone: "", previewConsent: "" };
const demoContact: InquiryValues = { contactName: "Demo Visitor", contactMethod: "email", contactEmail: "visitor@example.invalid", contactPhone: "+00 0000000000", previewConsent: "" };
const reviewStep: InquiryStep = {
  id: "review", title: "Review your sample brief", kind: "review", fields: [],
  description: "Check the choices and edit any step before creating a clearly labelled local demo summary.",
};
function contactStep(reference: boolean): InquiryStep {
  return { id: "contact", title: "Sample contact & acknowledgement", kind: "fields", fields: contactFields, reference,
    description: "Use fictional contact details. Any reference stays only in this browser tab and is never uploaded." };
}
function finishField(piece: Concept | undefined): InquiryField {
  return { id: "finishId", label: "Finish direction", type: "select", required: true,
    options: [{ value: "discuss", label: "To discuss" }, ...(piece?.finishes.map((finish) => ({ value: finish.id, label: finish.label })) ?? [])],
    hint: "A sample preference only. No finish is confirmed for manufacture." };
}
function valuesForSteps(steps: readonly InquiryStep[], supplied: InquiryValues): InquiryValues {
  return Object.fromEntries(steps.flatMap((step) => step.fields.map((field) => [field.id, supplied[field.id] ?? ""])));
}
function config(
  mode: InquiryMode, piece: Concept | undefined, title: string, introduction: string,
  steps: readonly InquiryStep[], initialValues: InquiryValues, demoValues: InquiryValues,
): InquiryConfig {
  return { schemaVersion: 1, mode, product: productSnapshot(piece), title, introduction, steps,
    initialValues: valuesForSteps(steps, { ...initialContact, ...initialValues }),
    demoValues: valuesForSteps(steps, { ...demoContact, ...demoValues, previewConsent: "" }),
    limits: previewLimits, reviewNotice };
}

function commissionConfig(piece: FurnitureConcept | undefined): InquiryConfig {
  const steps: readonly InquiryStep[] = [
    { id: "project", title: "The piece & its purpose", kind: "fields",
      description: "Start with how a fictional object or project would be used. A confirmed design is not needed to explore the brief.",
      fields: [
        { id: "projectType", label: "Project type", type: "select", required: true, options: [...categoryOptions.filter((option) => option.value !== "all"), { value: "bespoke", label: "Another bespoke direction" }] },
        { id: "intendedUse", label: "Intended use", type: "textarea", required: true, minLength: 10, maxLength: 800, placeholder: "A fictional dining space for a small gathering.", hint: "Describe the role of the piece using sample project information." },
      ] },
    { id: "design", title: "Scale & material direction", kind: "fields",
      description: "Enter proposed dimensions only if useful. They are ideas for discussion, not verified fabrication dimensions.",
      fields: [
        { id: "dimensionUnit", label: "Dimension unit", type: "select", required: true, options: [{ value: "mm", label: "Millimetres (mm)" }, { value: "cm", label: "Centimetres (cm)" }, { value: "in", label: "Inches (in)" }] },
        { id: "width", label: "Proposed width", type: "number", min: 0.1, max: 100000, maxLength: 12, hint: "Optional; use the selected unit. Preview accepts 0.1–100,000 units." },
        { id: "depth", label: "Proposed depth", type: "number", min: 0.1, max: 100000, maxLength: 12 },
        { id: "height", label: "Proposed height", type: "number", min: 0.1, max: 100000, maxLength: 12 },
        { id: "materialDirection", label: "Material direction", type: "textarea", maxLength: 400, placeholder: piece?.materials.map((material) => material.label).join(" with ") ?? "Wood with a restrained resin detail", hint: "Describe an impression; material suitability still requires studio review." },
        finishField(piece),
      ] },
    { id: "practical", title: "The setting & practical details", kind: "fields",
      description: "Outline access and timing with fictional information. Do not enter an actual address, project plan or other private material.",
      fields: [
        { id: "location", label: "Sample location", type: "text", required: true, minLength: 2, maxLength: 120, placeholder: "Demo city / indoor setting" },
        { id: "siteAccess", label: "Site access notes", type: "textarea", required: true, minLength: 5, maxLength: 500, placeholder: "Fictional ground-floor room; access dimensions still to discuss." },
        { id: "timing", label: "Preferred timing", type: "text", maxLength: 120, placeholder: "Flexible; a sample brief for a future season", hint: "A preference, not an agreed delivery date." },
        { id: "budget", label: "Optional budget direction", type: "text", maxLength: 120, placeholder: "To discuss after reviewing the design", hint: "Advisory text only. No quote or price is calculated." },
      ] },
    contactStep(true), reviewStep,
  ];
  return config("commission", piece, piece ? `A brief for ${piece.title}.` : "A commission, considered.",
    "Explore a furniture or spatial-art brief with fictional details. Materials, feasibility, installation and price require a future studio conversation.",
    steps, { projectType: piece?.category ?? "bespoke", dimensionUnit: "mm", finishId: "discuss" },
    { projectType: piece?.category ?? "tables", intendedUse: "A fictional indoor gathering space with a quiet material focal point.", dimensionUnit: "mm",
      width: String(piece?.dimensions.width ?? 1800), depth: String(piece?.dimensions.depth ?? 850), height: String(piece?.dimensions.height ?? 750),
      materialDirection: piece?.materials.map((material) => material.label).join(" and ") ?? "Wood and resin", finishId: piece?.finishes[0]?.id ?? "discuss",
      location: "Demo city / indoor setting", siteAccess: "Fictional ground-floor access; doorway measurements remain to be discussed.", timing: "Flexible sample timing", budget: "To discuss after reviewing the design" });
}

function memoryPersonalizationFields(piece: MemoryConcept): readonly InquiryField[] {
  return piece.memory.personalization.map((label, index) => {
    const id = `memoryPersonalization${index}`;
    if (/date/i.test(label)) return { id, label, type: "date" as const, hint: "Optional calendar date. Use a fictional date; no timezone conversion is applied." };
    if (/private|review/i.test(label)) return { id, label, type: "textarea" as const, maxLength: 400, hint: "Describe a fictional reference only. Do not enter a real document or private record." };
    return { id, label, type: "text" as const, maxLength: /initial/i.test(label) ? 1 : 160,
      pattern: /initial/i.test(label) ? "initial" as const : undefined,
      hint: "Optional sample direction. Exact wording and feasibility require a future review." };
  });
}

function preservationConfig(piece: MemoryConcept): InquiryConfig {
  const personalFields = memoryPersonalizationFields(piece);
  const sizes = piece.memory.sizes.map((size, index) => ({ value: `size-${index}`, label: `${size.label} · ${size.dimensions.width} × ${size.dimensions.depth} × ${size.dimensions.height} ${size.dimensions.unit}` }));
  const steps: readonly InquiryStep[] = [
    { id: "memory", title: "The memory & its form", kind: "fields",
      description: "Choose a sample occasion and format, then explore only the personalization offered by this concept.",
      fields: [
        { id: "occasion", label: "Occasion", type: "select", required: true, options: memoryOccasionOptions.filter((option) => option.value !== "all" && piece.memory.occasions.includes(option.value)) },
        { id: "format", label: "Format", type: "select", required: true, options: [{ value: "concept-format", label: piece.memory.format }] },
        { id: "size", label: "Sample size", type: "select", required: true, options: sizes },
        finishField(piece), ...personalFields,
      ] },
    { id: "materials", title: "The materials & their story", kind: "fields", reference: true,
      description: "Before sending any real flowers, paper or keepsakes, ask the studio to confirm suitability and current instructions. Nothing can be sent through this preview.",
      fields: [
        { id: "materialsDescription", label: "Sample materials description", type: "textarea", required: true, minLength: 10, maxLength: 800, placeholder: "Fictional flowers from an imagined celebration; condition not assessed.", hint: piece.memory.materialsNote },
        { id: "story", label: "A little about the story", type: "textarea", maxLength: 600, placeholder: "A fictional moment to mark with a quiet keepsake.", hint: "Keep names, documents and identifying information fictional." },
        { id: "timing", label: "Preferred timing", type: "text", maxLength: 120, hint: "A discussion point, not a preservation or delivery guarantee." },
      ] },
    contactStep(false), reviewStep,
  ];
  const personalizationExamples = Object.fromEntries(personalFields.map((field) => [field.id,
    field.type === "date" ? "2026-09-21" : field.pattern === "initial" ? "A" : /names|wording/i.test(field.label) ? "Demo wording" : "A fictional, restrained design direction"]));
  return config("preserve", piece, `A memory brief for ${piece.title}.`,
    "Explore the shape of a preservation or celebration brief. Physical materials, design confirmation and the studio process need individual review; these are sample choices only.",
    steps, { occasion: piece.memory.occasions[0] ?? "", format: "concept-format", size: sizes[0]?.value ?? "", finishId: "discuss" },
    { occasion: piece.memory.occasions[0] ?? "", format: "concept-format", size: sizes[0]?.value ?? "", finishId: piece.finishes[0]?.id ?? "discuss", ...personalizationExamples,
      materialsDescription: "A fictional keepsake composition for this sample brief; the actual materials and their condition would require studio review.", story: "A fictional family celebration, described without personal records or identifying details.", timing: "Flexible sample timing" });
}

function personalConfig(piece: PersonalConcept, initialVariant: string | undefined): InquiryConfig {
  const variants = piece.personal.variants.map((variant) => ({ value: variant.id, label: `${variant.label} · ${personalColourOptions.find((option) => option.value === variant.colour)?.label ?? variant.colour}` }));
  const requestedVariant = initialVariant ?? "";
  const selectedVariant = variants.some((variant) => variant.value === requestedVariant) ? requestedVariant : variants[0]?.value ?? "";
  const personalFields: readonly InquiryField[] = piece.personal.personalization.map((label, index) => ({
    id: `personalization${index}`, label, type: "text", required: !/^optional/i.test(label) && /initial/i.test(label),
    maxLength: /initial/i.test(label) ? 1 : 80, pattern: /initial/i.test(label) ? "initial" : undefined,
    hint: /initial/i.test(label) ? "Use one fictional letter or number. The sample initial is A." : "A sample direction only; wording and feasibility need confirmation.",
  }));
  const steps: readonly InquiryStep[] = [
    { id: "personalize", title: "The object & personal details", kind: "fields",
      description: "Build a compact fictional gift brief. Quantity and options describe a request, not a purchase or stock reservation.",
      fields: [
        { id: "variantId", label: "Sample variant & colour", type: "radio", required: true, options: variants, hint: "Variant selection does not recolour the image or add a configured surcharge." },
        ...personalFields,
        { id: "quantity", label: piece.id === "DP114" ? "Quantity of four-piece sets" : "Sample quantity", type: "number", required: true, integer: true, min: piece.personal.quantity.min, max: piece.personal.quantity.max, maxLength: 3, hint: `Preview range: ${piece.personal.quantity.min}–${piece.personal.quantity.max}. ${piece.personal.giftNote}` },
        { id: "giftWrap", label: "Discuss gift wrapping", type: "checkbox", hint: "An optional request only. Packaging, availability and cost are not confirmed." },
        { id: "giftMessage", label: "Optional gift message", type: "textarea", maxLength: 240, placeholder: "A little something for a fictional celebration." },
        { id: "notes", label: "Additional sample notes", type: "textarea", maxLength: 500, hint: "No tax, delivery charge, discount or final total is calculated." },
      ] },
    contactStep(true), reviewStep,
  ];
  const personalizationExamples = Object.fromEntries(personalFields.map((field) => [field.id, field.pattern === "initial" ? "A" : "A fictional design direction"]));
  return config("personalize", piece, `Make ${piece.title} personal.`,
    "Explore a sample variant, permitted personalization and quantity, then review a local gift brief. There is no checkout, payment or WhatsApp handoff in this preview.",
    steps, { variantId: selectedVariant, quantity: String(piece.personal.quantity.min), giftWrap: "" },
    { variantId: selectedVariant, quantity: String(piece.personal.quantity.min), ...personalizationExamples, giftWrap: "yes", giftMessage: "A small fictional gift, chosen with care.", notes: "Please discuss sample packaging and timing; no reservation is requested." });
}

/** Only commission supports an unselected general project; other modes need one validated product. */
export function buildInquiryConfig(piece: Concept | undefined, mode: InquiryMode, initialVariant?: string): InquiryConfig {
  if (mode === "commission" && (!piece || piece.tier === "LARGE")) return commissionConfig(piece);
  if (mode === "preserve" && piece?.tier === "MEDIUM") return preservationConfig(piece);
  if (mode === "personalize" && piece?.tier === "SMALL") return personalConfig(piece, initialVariant);
  throw new Error("The selected study does not match this inquiry journey.");
}
