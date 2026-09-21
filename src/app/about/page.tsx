import { AboutPage } from "@/components/editorial-pages";
import { publicPreviewMetadata, requirePublicPreview } from "@/lib/public-preview";

export function generateMetadata() {
  return publicPreviewMetadata("About RivyaLivingArt", "A sample editorial introduction to furniture, memory art and personal objects, connected by a material-led point of view.");
}

export default async function Page() {
  await requirePublicPreview();
  return <AboutPage />;
}
