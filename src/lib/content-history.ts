import type { ContentDocument } from "@/lib/content-contracts";
import { richTextToPlainText } from "@/lib/content-richtext";

export type LocalContentCheckpoint = Readonly<{ id: number; label: string; document: ContentDocument }>;
export type ContentDifference = Readonly<{ label: string; before: string; after: string }>;

/** A readable comparison of browser-memory snapshots, never database revisions. */
export function contentDifferences(before: ContentDocument, after: ContentDocument): ContentDifference[] {
  const result: ContentDifference[] = [];
  const add = (label: string, old: string, next: string) => { if (old !== next) result.push({ label, before: old || "Empty", after: next || "Empty" }); };
  add("Title / question", before.title, after.title);
  add("Slug", before.slug, after.slug);
  add("Summary", before.summary, after.summary);
  if (JSON.stringify(before.body) !== JSON.stringify(after.body)) {
    result.push({ label: "Body / formatting", before: richTextToPlainText(before.body) || "Empty", after: richTextToPlainText(after.body) || "Empty" });
  }
  add("Category", before.kind === "faq" ? before.faqGroup : before.category, after.kind === "faq" ? after.faqGroup : after.category);
  add("Tier", before.tier, after.tier);
  add("SEO title", before.seoTitle, after.seoTitle);
  add("SEO description", before.seoDescription, after.seoDescription);
  add("Related products", before.relatedProductIds.join(", "), after.relatedProductIds.join(", "));
  if (JSON.stringify(before.cover) !== JSON.stringify(after.cover)) {
    const describe = (doc: ContentDocument) => doc.cover ? `${doc.cover.assetId}; alt: ${doc.cover.alt}; caption: ${doc.cover.caption}; focal: ${doc.cover.focalPoint.x}, ${doc.cover.focalPoint.y}` : "No cover";
    add("Cover & usage", describe(before), describe(after));
  }
  add("Draft visibility", before.archived ? "Archived locally" : "Active", after.archived ? "Archived locally" : "Active");
  add("Section order", before.sections.map((section) => section.id).join(" → "), after.sections.map((section) => section.id).join(" → "));
  for (const section of after.sections) {
    const previous = before.sections.find((item) => item.id === section.id);
    const describe = (item: typeof section) => `${item.type} · ${item.hidden ? "hidden" : "visible"} · ${item.variant} · ${item.fields.eyebrow ?? ""} · ${item.fields.heading} · ${item.fields.body} · references: ${item.fields.referenceIds.join(", ")}${item.fields.media ? ` · image: ${item.fields.media.assetId} · ${item.fields.media.alt} · ${item.fields.media.caption} · focal ${item.fields.media.focalPoint.x}, ${item.fields.media.focalPoint.y}` : ""}${item.fields.href ? ` · ${item.fields.linkLabel}: ${item.fields.href}` : ""}`;
    if (!previous) add(`Added section ${section.id}`, "", describe(section));
    else if (JSON.stringify(previous) !== JSON.stringify(section)) add(`Section ${section.id}`, describe(previous), describe(section));
  }
  for (const section of before.sections) if (!after.sections.some((item) => item.id === section.id)) add(`Removed section ${section.id}`, section.fields.heading || section.type, "");
  return result;
}
