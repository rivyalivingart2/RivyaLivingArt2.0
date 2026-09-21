/** Pure local authoring feedback; the later server write service must enforce it again. */
import type { ContentDocument, ContentIssue, ContentReferences } from "@/lib/content-contracts";
import { richTextToPlainText, validateRichText, type RichTextValue } from "@/lib/content-richtext";
import { safeSectionHref, validatePageSections } from "@/lib/content-sections";
import type { AssetReference } from "@/lib/studio-media";

const testimonialLabel = "Fictional sample — not a customer review.";
const categories = ["Spaces", "Materials", "Commissioning"] as const;
const faqGroups = ["commissioning", "materials-customization", "memory-preservation", "personal-gifting", "enquiries-quotations", "delivery-care", "privacy-demo"] as const;

export function validateContentDocument(document: ContentDocument, references: ContentReferences): ContentIssue[] {
  const issues: ContentIssue[] = [];
  const add = (field: string, message: string, severity: ContentIssue["severity"] = "error") => issues.push({ field, severity, message });
  if (!["page", "article", "faq", "testimonial"].some((kind) => kind === document.kind)) add("title", "Choose a supported content type.");
  if (document.schemaVersion !== 1) add("title", "This editor supports content schema version 1 only.");
  if (document.originKind !== "DEMO_FIXTURE" || document.contentStatus !== "OWNER_REVIEW_DRAFT") add("title", "Local content must retain its demo provenance and owner-review draft state.");
  if (!document.title.trim() || document.title.length > 160) add("title", "Enter a title of 1–160 characters.");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(document.slug) || document.slug.length > 160) add("slug", "Use a slug of at most 160 lowercase letters, numbers and single hyphens.");
  if (document.summary.length > 1200) add("summary", "Keep the summary within 1,200 characters.");
  if (document.kind === "article" && !document.summary.trim()) add("summary", "Add an article summary for the journal list.");
  if (document.sourceRoute !== null && !safeSectionHref(document.sourceRoute)) add("slug", "The source reference must remain a safe internal route.");
  if (document.seoTitle.length > 160) add("seoTitle", "Keep the SEO title within 160 characters.");
  else if (document.seoTitle.length > 70) add("seoTitle", "A shorter SEO title may be easier to read in a search result.", "warning");
  if (document.seoDescription.length > 600) add("seoDescription", "Keep the SEO description within 600 characters.");
  else if (document.seoDescription.length > 180) add("seoDescription", "Consider a more concise search description. Its display length varies by search service.", "warning");
  if (!["LARGE", "MEDIUM", "SMALL"].some((tier) => tier === document.tier)) add("tier", "Choose an existing product tier.");
  if (!categories.some((category) => category === document.category)) add("category", "Choose an existing journal category.");
  if (!faqGroups.some((group) => group === document.faqGroup)) add("faqGroup", "Choose an existing FAQ group.");

  const productIds = new Set(references.products.map((product) => product.id));
  if (document.relatedProductIds.length > 6) add("relatedProductIds", "Select at most six related products.");
  if (new Set(document.relatedProductIds).size !== document.relatedProductIds.length) add("relatedProductIds", "Remove duplicate product references.");
  for (const id of document.relatedProductIds) {
    if (!productIds.has(id)) add("relatedProductIds", `Product ${id} is unavailable. Remove it or select a current reference.`);
  }
  if (document.kind === "article" && references.articles.some((article) => article.id !== document.id && article.slug === document.slug)) add("slug", "Another source article uses this slug. Choose a distinct local draft slug.");

  for (const message of validateRichText(document.body, { productIds: [...productIds], mediaIds: references.media.map((asset) => asset.id) })) add("body", message);
  if (document.kind !== "page" && !richTextToPlainText(document.body).trim()) add("body", document.kind === "faq" ? "Add the sample answer." : document.kind === "testimonial" ? "Add the fictional quote." : "Add the article body.");

  const reviewedMedia = new Set<string>();
  function inspectMedia(reference: AssetReference, field: string) {
    const asset = references.media.find((item) => item.id === reference.assetId);
    if (!asset || asset.status === "PENDING" || !asset.src) add(field, "This media reference has no usable preview file. Clear it or choose a supplied concept visual.");
    if (!reference.alt.trim() || reference.alt.length > 320) add(field, "Add usage-specific alt text of 1–320 characters.");
    if (reference.caption.length > 600) add(field, "Keep the image caption within 600 characters.");
    if (!reference.focalPoint || [reference.focalPoint.x, reference.focalPoint.y].some((point) => !Number.isFinite(point) || point < 0 || point > 100)) add(field, "Image focal coordinates must be between 0 and 100.");
    if (asset?.status === "PREVIEW_ONLY" && !reviewedMedia.has(asset.id)) {
      add(field, `${asset.title} is cleared only for the labelled concept preview. Production rights and approval remain unverified.`, "warning");
      reviewedMedia.add(asset.id);
    }
  }
  if (document.cover) {
    if (document.kind === "faq" || document.kind === "testimonial") add("cover", "FAQ answers and fictional testimonials do not use cover images in this schema.");
    inspectMedia(document.cover, "cover");
  }

  if (document.kind === "page") {
    for (const message of validatePageSections(document.sections, references, { furnitureFirst: document.id === "CP001" || document.sourceRoute === "/" })) add("sections", message);
    for (const block of document.sections) if (block.fields.media) inspectMedia(block.fields.media, "sections");
    add("sections", "This is a composer starting draft. Local changes do not replace the source website or its current public presentation.", "warning");
  } else if (document.sections.length) add("sections", "Marketing page sections belong to page documents only.");

  function inspectBody(node: RichTextValue, depth = 0) {
    if (!node || typeof node !== "object" || depth > 16) return;
    if (node.type === "mediaAsset" && node.attrs) {
      const attrs = node.attrs;
      if (typeof attrs.assetId === "string" && typeof attrs.alt === "string" && typeof attrs.caption === "string" && attrs.focalPoint && typeof attrs.focalPoint === "object") inspectMedia({ assetId: attrs.assetId, alt: attrs.alt, caption: attrs.caption, focalPoint: attrs.focalPoint }, "body");
    }
    if (document.kind === "testimonial" && (node.type === "mediaAsset" || node.type === "productReference" || node.marks?.some((mark) => mark.type === "link"))) add("body", "Keep fictional testimonial quotes text-only, without images, links or embedded product references.");
    if (Array.isArray(node.content)) for (const child of node.content) inspectBody(child, depth + 1);
  }
  inspectBody(document.body);

  if (document.kind === "testimonial") {
    const source = references.testimonials.find((item) => item.id === document.id);
    if ((source && document.identity !== source.identity) || !/^Demo Reviewer (?:\d{2}|— local draft)$/.test(document.identity)) add("identity", "Retain the fixed fictional reviewer identity. This is not a real customer record.");
    if (document.summary !== testimonialLabel) add("summary", "Keep the permanent fictional-sample label unchanged.");
    add("body", "Fictional testimonials cannot become genuine customer reviews. A real review requires a separately collected, approved record.", "warning");
  }
  return issues.filter((issue, index) => issues.findIndex((candidate) => candidate.field === issue.field && candidate.severity === issue.severity && candidate.message === issue.message) === index);
}
