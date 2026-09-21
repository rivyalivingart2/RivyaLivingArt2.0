import { ContactPage } from "@/components/editorial-pages";
import { publicPreviewMetadata, requirePublicPreview } from "@/lib/public-preview";

export function generateMetadata() {
  return publicPreviewMetadata("Begin a conversation", "Explore sample furniture, memory-art or personal-gifting briefs, or use the supplied studio contact details for a real conversation.");
}

export default async function Page() {
  await requirePublicPreview();
  return <ContactPage />;
}
