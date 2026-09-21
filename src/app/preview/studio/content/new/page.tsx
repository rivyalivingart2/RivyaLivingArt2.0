import { notFound } from "next/navigation";
import { StudioContentEditor } from "@/components/studio-content-editor";
import { isContentKind } from "@/lib/content-contracts";
import { publicPreviewMetadata, requirePublicPreview } from "@/lib/public-preview";
import { getContentReferences, getContentSummaries, newContentDocument } from "@/lib/studio-content-data";

export function generateMetadata() { return publicPreviewMetadata("New local content draft · Studio demo"); }

export default async function NewContentPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requirePublicPreview();
  const kind = (await searchParams).kind ?? "page";
  if (typeof kind !== "string" || !isContentKind(kind)) notFound();
  return <StudioContentEditor key={`new-${kind}`} initialDocument={newContentDocument(kind)} documents={getContentSummaries()} references={getContentReferences()} />;
}
