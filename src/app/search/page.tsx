import type { CatalogueQuery } from "@/lib/catalogue";
import { requirePublicPreview, publicPreviewMetadata } from "@/lib/public-preview";
import { CatalogueSearch } from "@/components/catalogue-search";

export function generateMetadata() { return publicPreviewMetadata("Search the sample collections", "Explore fictional furniture, memory art and personal gifts in the protected preview."); }

export default async function SearchPage({ searchParams }: { searchParams: Promise<CatalogueQuery> }) {
  await requirePublicPreview();
  return <CatalogueSearch query={await searchParams} />;
}
