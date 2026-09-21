import { StudioProducts } from "@/components/studio-products";
import { concepts, type CatalogueQuery } from "@/lib/catalogue";
import { publicPreviewMetadata, requirePublicPreview } from "@/lib/public-preview";

export function generateMetadata() { return publicPreviewMetadata("Studio products · Demo"); }

export default async function StudioProductsPage({ searchParams }: { searchParams: Promise<CatalogueQuery> }) {
  await requirePublicPreview();
  return <StudioProducts products={concepts} query={await searchParams} />;
}
