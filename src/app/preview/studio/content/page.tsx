import { StudioContentHub } from "@/components/studio-content-hub";
import { publicPreviewMetadata, requirePublicPreview } from "@/lib/public-preview";
import { getContentSummaries } from "@/lib/studio-content-data";

export function generateMetadata() { return publicPreviewMetadata("Content room · Studio demo"); }

export default async function ContentWorkspacePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requirePublicPreview();
  return <StudioContentHub documents={getContentSummaries()} query={await searchParams} />;
}
