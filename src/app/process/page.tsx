import { ProcessPage } from "@/components/editorial-pages";
import { publicPreviewMetadata, requirePublicPreview } from "@/lib/public-preview";

export function generateMetadata() {
  return publicPreviewMetadata("From a possibility to a considered brief", "A conceptual guide to preparing a furniture, preservation or gifting brief; the real studio process awaits owner review.");
}

export default async function Page() {
  await requirePublicPreview();
  return <ProcessPage />;
}
