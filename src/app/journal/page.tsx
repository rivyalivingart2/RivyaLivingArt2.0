import { JournalIndex } from "@/components/journal";
import { publicPreviewMetadata, requirePublicPreview } from "@/lib/public-preview";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export function generateMetadata() {
  return publicPreviewMetadata("The journal", "Sample journal drafts on collectible furniture, materials, spaces and commissioning.");
}

export default async function JournalPage({ searchParams }: Props) {
  await requirePublicPreview();
  return <JournalIndex searchParams={await searchParams} />;
}
