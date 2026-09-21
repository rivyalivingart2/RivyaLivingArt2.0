import { StudioProductEditor } from "@/components/studio-product-editor";
import { publicPreviewMetadata, requirePublicPreview } from "@/lib/public-preview";

export function generateMetadata() { return publicPreviewMetadata("New local product draft · Studio demo"); }

export default async function NewStudioProductPage() {
  await requirePublicPreview();
  return <StudioProductEditor />;
}
