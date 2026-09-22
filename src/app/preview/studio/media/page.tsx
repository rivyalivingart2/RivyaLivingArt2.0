import { StudioMediaLibrary } from "@/components/studio-media-library";
import { publicPreviewMetadata, requirePublicPreview } from "@/lib/public-preview";
import { studioMediaAssets } from "@/lib/studio-media";

export function generateMetadata() { return publicPreviewMetadata("Media library · Studio demo"); }

export default async function MediaWorkspacePage() {
  await requirePublicPreview();
  return <StudioMediaLibrary assets={studioMediaAssets} />;
}
