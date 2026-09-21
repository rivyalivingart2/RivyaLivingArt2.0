import type { Concept, ProductTier } from "@/lib/catalogue";

export type StudioOverviewData = Readonly<{
  total: number;
  drafts: number;
  inReview: number;
  pendingVisuals: number;
  conceptVisuals: number;
  tiers: readonly Readonly<{ tier: ProductTier; label: string; count: number; drafts: number; pendingVisuals: number }>[];
  attention: readonly Readonly<{ id: string; title: string; tier: ProductTier; issue: string }>[];
  content: readonly Readonly<{ label: string; count: number; target: number; href: string }>[];
}>;

/** Pure fixture aggregation; deliberately has no operational or financial totals. */
export function buildStudioOverviewData(products: readonly Concept[], articles: number, faqAnswers: number): StudioOverviewData {
  const tiers = [
    { tier: "LARGE", label: "Furniture & spatial art" },
    { tier: "MEDIUM", label: "Memory art" },
    { tier: "SMALL", label: "Personal art & gifts" },
  ] as const;
  return {
    total: products.length,
    drafts: products.filter((product) => product.workingDraftStatus === "DRAFT").length,
    inReview: products.filter((product) => product.workingDraftStatus === "IN_REVIEW").length,
    pendingVisuals: products.filter((product) => product.mediaStatus === "VISUAL_PENDING").length,
    conceptVisuals: products.filter((product) => product.mediaStatus === "CONCEPT_VISUAL").length,
    tiers: tiers.map((item) => {
      const group = products.filter((product) => product.tier === item.tier);
      return { ...item, count: group.length, drafts: group.filter((product) => product.workingDraftStatus !== "NONE").length, pendingVisuals: group.filter((product) => product.mediaStatus === "VISUAL_PENDING").length };
    }),
    attention: products.filter((product) => product.workingDraftStatus === "IN_REVIEW" || product.mediaStatus === "VISUAL_PENDING")
      .slice(0, 5).map((product) => ({ id: product.id, title: product.name, tier: product.tier, issue: product.workingDraftStatus === "IN_REVIEW" ? "Sample draft in review" : "Visual still needed" })),
    content: [
      { label: "Product concepts", count: products.length, target: 120, href: "/preview/studio/products" },
      { label: "Article drafts", count: articles, target: 36, href: "/journal" },
      { label: "FAQ drafts", count: faqAnswers, target: 42, href: "/faq" },
    ],
  };
}
