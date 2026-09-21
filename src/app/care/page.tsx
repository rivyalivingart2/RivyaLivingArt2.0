import { CarePage } from "@/components/editorial-pages";
import { publicPreviewMetadata, requirePublicPreview } from "@/lib/public-preview";

export function generateMetadata() {
  return publicPreviewMetadata("Care begins with knowing your piece", "Questions to help request piece-specific material, finish and care information from the studio.");
}

export default async function Page() {
  await requirePublicPreview();
  return <CarePage />;
}
