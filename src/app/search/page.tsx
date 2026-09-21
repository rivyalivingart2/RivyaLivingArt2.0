import type { CatalogueQuery } from "@/lib/catalogue";
import { Suspense } from "react";
import { PageLoading } from "@/components/page-loading";
import { requirePublicPreview, publicPreviewMetadata } from "@/lib/public-preview";
import { CatalogueSearch } from "@/components/catalogue-search";

export function generateMetadata() { return publicPreviewMetadata("Search the sample collections", "Explore fictional furniture, memory art and personal gifts in the protected preview."); }

export default async function SearchPage({ searchParams }: { searchParams: Promise<CatalogueQuery> }) {
  await requirePublicPreview();
  return <Suspense fallback={<PageLoading variant="collection" />}><SearchContent searchParams={searchParams} /></Suspense>;
}

async function SearchContent({ searchParams }: { searchParams: Promise<CatalogueQuery> }) {
  return <CatalogueSearch query={await searchParams} />;
}
