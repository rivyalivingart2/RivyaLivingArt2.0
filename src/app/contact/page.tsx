import { ContactPage } from "@/components/editorial-pages";
import { publicPreviewMetadata, requirePublicPreview } from "@/lib/public-preview";

export function generateMetadata() {
  return publicPreviewMetadata("Begin a conversation", "Choose a sample furniture, memory-art or personal-gifting brief. Verified contact channels are awaiting owner input.");
}

export default async function Page() {
  await requirePublicPreview();
  return <ContactPage />;
}
