import { MaterialsPage } from "@/components/editorial-pages";
import { publicPreviewMetadata, requirePublicPreview } from "@/lib/public-preview";

export function generateMetadata() {
  return publicPreviewMetadata("A language of materials", "Explore wood, resin, metal and mineral as visual directions for fictional design studies.");
}

export default async function Page() {
  await requirePublicPreview();
  return <MaterialsPage />;
}
