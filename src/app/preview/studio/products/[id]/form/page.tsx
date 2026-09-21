import { notFound } from "next/navigation";
import { StudioFormBuilder } from "@/components/studio-form-builder";
import { concepts } from "@/lib/catalogue";
import { buildInquiryConfig } from "@/lib/inquiry";
import { requirePublicPreview } from "@/lib/public-preview";
import { studioProductMetadata } from "@/lib/studio-preview";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) { return studioProductMetadata((await params).id, "Customization form"); }

export default async function StudioProductFormPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePublicPreview();
  const { id } = await params;
  const product = concepts.find((piece) => piece.id === id);
  if (!product) notFound();
  const mode = product.tier === "LARGE" ? "commission" : product.tier === "MEDIUM" ? "preserve" : "personalize";
  return <StudioFormBuilder key={product.id} initialConfig={buildInquiryConfig(product, mode)} />;
}
