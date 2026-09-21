import { notFound } from "next/navigation";
import { StudioProductEditor } from "@/components/studio-product-editor";
import { concepts } from "@/lib/catalogue";
import { requirePublicPreview } from "@/lib/public-preview";
import { studioProductMetadata } from "@/lib/studio-preview";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) { return studioProductMetadata((await params).id, "Product draft"); }

export default async function StudioProductPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePublicPreview();
  const { id } = await params;
  const product = concepts.find((piece) => piece.id === id);
  if (!product) notFound();
  return <StudioProductEditor key={product.id} product={product} />;
}
