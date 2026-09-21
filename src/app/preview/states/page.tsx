import { StateGallery } from "@/components/state-gallery";
import { publicPreviewMetadata, requirePublicPreview } from "@/lib/public-preview";

export function generateMetadata() {
  return publicPreviewMetadata("Interface state studies", "Simulated loading, recovery and empty-state designs for the protected development preview.");
}

export default async function StateStudiesPage() {
  await requirePublicPreview();
  return <StateGallery />;
}
