import type { Concept } from "@/lib/catalogue";
import type { PageSection } from "@/lib/content-sections";
import type { RichTextValue } from "@/lib/content-richtext";
import type { FaqGroupId, FaqRecord } from "@/lib/faqs";
import type { JournalCategory } from "@/lib/journal";
import type { AssetReference, StudioMediaAsset } from "@/lib/studio-media";
import type { TestimonialRecord } from "@/lib/testimonials";

export const contentKinds = ["page", "article", "faq", "testimonial"] as const;
export type ContentKind = typeof contentKinds[number];
export const contentKindLabels: Record<ContentKind, string> = {
  page: "Pages", article: "Journal", faq: "FAQs", testimonial: "Testimonials",
};

export type ArticleReference = Readonly<{
  id: string; slug: string; title: string; excerpt: string; category: JournalCategory;
}>;

/** Only public-safe fixture references cross the Studio client boundary. */
export type ContentReferences = Readonly<{
  products: readonly Concept[];
  articles: readonly ArticleReference[];
  faqs: readonly FaqRecord[];
  testimonials: readonly TestimonialRecord[];
  media: readonly StudioMediaAsset[];
}>;

export type ContentDocument = {
  id: string;
  kind: ContentKind;
  schemaVersion: 1;
  title: string;
  slug: string;
  summary: string;
  body: RichTextValue;
  sections: PageSection[];
  cover: AssetReference | null;
  relatedProductIds: string[];
  category: JournalCategory;
  faqGroup: FaqGroupId;
  identity: string;
  tier: "LARGE" | "MEDIUM" | "SMALL";
  seoTitle: string;
  seoDescription: string;
  sourceRoute: string | null;
  originKind: "DEMO_FIXTURE";
  contentStatus: "OWNER_REVIEW_DRAFT";
  archived: boolean;
};

export type ContentDocumentSummary = Readonly<{
  id: string; kind: ContentKind; title: string; slug: string;
  description: string; mediaState: "PREVIEW_ONLY" | "PENDING" | "NOT_REQUIRED";
  sourceRoute: string | null; schemaVersion: 1;
}>;

export type ContentIssue = Readonly<{
  field: string; severity: "error" | "warning"; message: string;
}>;

export function isContentKind(value: string): value is ContentKind {
  return contentKinds.some((kind) => kind === value);
}
