import type { CatalogueQuery, Concept } from "@/lib/rivya/source/catalogue";

export const studioTierOptions = [
  { value: "all", label: "All tiers" },
  { value: "LARGE", label: "Large · furniture" },
  { value: "MEDIUM", label: "Medium · memory art" },
  { value: "SMALL", label: "Small · personal art" },
] as const;
export const studioDraftOptions = [
  { value: "all", label: "All working drafts" },
  { value: "NONE", label: "No working draft" },
  { value: "DRAFT", label: "Draft" },
  { value: "IN_REVIEW", label: "In review" },
] as const;
export const studioMediaOptions = [
  { value: "all", label: "All media states" },
  { value: "CONCEPT_VISUAL", label: "Concept visual" },
  { value: "VISUAL_PENDING", label: "Visual pending" },
] as const;
export const studioSortOptions = [
  { value: "id-asc", label: "Fixture ID" },
  { value: "title-asc", label: "Title · A–Z" },
  { value: "title-desc", label: "Title · Z–A" },
  { value: "price-asc", label: "Sample price · low to high" },
  { value: "lead-asc", label: "Lead time · shortest first" },
] as const;

export type StudioCatalogueFilters = Readonly<{
  q: string;
  tier: (typeof studioTierOptions)[number]["value"];
  draft: (typeof studioDraftOptions)[number]["value"];
  media: (typeof studioMediaOptions)[number]["value"];
  sort: (typeof studioSortOptions)[number]["value"];
}>;

function option<T extends string>(value: CatalogueQuery[string], choices: readonly { value: T }[], fallback: T): T {
  return typeof value === "string" ? choices.find((choice) => choice.value === value)?.value ?? fallback : fallback;
}

/** Bounded source-fixture querying. The later database adapter must perform this on the server. */
export function queryStudioCatalogue(products: readonly Concept[], raw: CatalogueQuery) {
  const filters: StudioCatalogueFilters = {
    q: typeof raw.q === "string" ? raw.q.slice(0, 120).trim().replace(/\s+/g, " ") : "",
    tier: option(raw.tier, studioTierOptions, "all"),
    draft: option(raw.draft, studioDraftOptions, "all"),
    media: option(raw.media, studioMediaOptions, "all"),
    sort: option(raw.sort, studioSortOptions, "id-asc"),
  };
  const search = filters.q.toLocaleLowerCase("en");
  const matching = products.filter((piece) =>
    (!search || `${piece.id} ${piece.title} ${piece.name} ${piece.type}`.toLocaleLowerCase("en").includes(search))
    && (filters.tier === "all" || piece.tier === filters.tier)
    && (filters.draft === "all" || piece.workingDraftStatus === filters.draft)
    && (filters.media === "all" || piece.mediaStatus === filters.media));
  matching.sort((a, b) => {
    let order = 0;
    if (filters.sort === "title-asc") order = a.title.localeCompare(b.title, "en");
    if (filters.sort === "title-desc") order = b.title.localeCompare(a.title, "en");
    if (filters.sort === "price-asc") {
      if (a.priceAmountMinor === null) order = b.priceAmountMinor === null ? 0 : 1;
      else if (b.priceAmountMinor === null) order = -1;
      else order = a.priceAmountMinor - b.priceAmountMinor;
    }
    if (filters.sort === "lead-asc") order = a.leadTime.minWeeks - b.leadTime.minWeeks || a.leadTime.maxWeeks - b.leadTime.maxWeeks;
    return order || a.id.localeCompare(b.id, "en", { numeric: true });
  });
  const pageSize = 8;
  const pageCount = Math.max(1, Math.ceil(matching.length / pageSize));
  const requestedPage = typeof raw.page === "string" && /^[1-9]\d{0,8}$/.test(raw.page) ? Number(raw.page) : 1;
  const page = Math.min(requestedPage, pageCount);
  return { filters, page, pageCount, pageSize, total: matching.length, items: matching.slice((page - 1) * pageSize, page * pageSize) };
}

export type StudioCatalogueResult = ReturnType<typeof queryStudioCatalogue>;

export function studioCatalogueHref(filters: Partial<StudioCatalogueFilters> = {}, page = 1): string {
  const params = new URLSearchParams();
  const q = filters.q?.slice(0, 120).trim();
  if (q) params.set("q", q);
  for (const key of ["tier", "draft", "media", "sort"] as const) {
    const value = filters[key];
    if (value && value !== "all" && value !== "id-asc") params.set(key, value);
  }
  if (Number.isSafeInteger(page) && page > 1) params.set("page", String(page));
  return `/studio/products${params.size ? `?${params.toString()}` : ""}`;
}

export const studioDraftLabels: Record<Concept["workingDraftStatus"], string> = {
  NONE: "No working draft", DRAFT: "Draft", IN_REVIEW: "In review",
};
export const studioPriceLabels: Record<Concept["priceType"], string> = {
  ON_REQUEST: "On request", STARTING_FROM: "Starting from", FIXED: "Fixed sample price",
};
