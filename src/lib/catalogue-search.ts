import { concepts, type CatalogueQuery, type Concept, type ProductTier } from "@/lib/catalogue";

export type SearchTier = "all" | ProductTier;
export const searchTierOptions = [
  { value: "all", label: "All three collections" },
  { value: "LARGE", label: "Collectible design" },
  { value: "MEDIUM", label: "Memory art" },
  { value: "SMALL", label: "Personal art & gifts" },
] as const;
const PAGE_SIZE = 9;
const tierOrder = { LARGE: 0, MEDIUM: 1, SMALL: 2 } as const;

function single(value: string | string[] | undefined): string {
  return typeof value === "string" ? value : "";
}
function searchable(value: string) {
  return value.normalize("NFKD").replace(/\p{M}/gu, "").toLocaleLowerCase("en-IN");
}

/** Isolated source search. This adapter will be replaced by published-product reads. */
export function searchCatalogue(query: CatalogueQuery) {
  const raw = single(query.q).trim().replace(/\s+/g, " ");
  const term = Array.from(raw).slice(0, 80).join("");
  const requestedTier = single(query.tier);
  const tier: SearchTier = searchTierOptions.some((option) => option.value === requestedTier) ? requestedTier as SearchTier : "all";
  const words = searchable(term).split(" ").filter(Boolean);
  const matches = concepts.filter((piece) => {
    if (piece.contentStatus !== "DEMO_VISIBLE" || (tier !== "all" && piece.tier !== tier)) return false;
    const collection = searchTierOptions.find((option) => option.value === piece.tier)?.label ?? "";
    const haystack = searchable([piece.id, piece.name, piece.title, piece.type, piece.description, piece.category.replaceAll("-", " "), collection, ...piece.materials.map((material) => material.label)].join(" "));
    return words.every((word) => haystack.includes(word));
  }).sort((a, b) => tierOrder[a.tier] - tierOrder[b.tier]);
  const pages = Math.max(1, Math.ceil(matches.length / PAGE_SIZE));
  const rawPage = single(query.page);
  const requestedPage = /^\d{1,5}$/.test(rawPage) ? Number(rawPage) : 1;
  const page = Math.min(pages, Math.max(1, requestedPage));
  const offset = (page - 1) * PAGE_SIZE;
  return {
    term, tier, page, pages, total: matches.length, shortened: Array.from(raw).length > 80,
    items: matches.slice(offset, offset + PAGE_SIZE) as readonly Concept[],
    first: matches.length ? offset + 1 : 0, last: Math.min(offset + PAGE_SIZE, matches.length),
  };
}

export function searchHref(term: string, tier: SearchTier, page = 1) {
  const query = new URLSearchParams();
  if (term) query.set("q", term);
  if (tier !== "all") query.set("tier", tier);
  if (page > 1) query.set("page", String(page));
  return `/search${query.size ? `?${query}` : ""}`;
}
