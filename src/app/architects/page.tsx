import { ArchitectsPage } from "@/components/editorial-pages";
import { publicPreviewMetadata, requirePublicPreview } from "@/lib/public-preview";

export function generateMetadata() {
  return publicPreviewMetadata("For architects & interior designers", "Prepare a fictional project brief around a room, a material direction and the practical requirements of a space.");
}

export default async function Page() {
  await requirePublicPreview();
  return <ArchitectsPage />;
}
