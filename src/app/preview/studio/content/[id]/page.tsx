import { notFound } from "next/navigation";
import { StudioContentEditor } from "@/components/studio-content-editor";
import { isVisualPreviewAllowed } from "@/lib/preview-mode";
import { publicPreviewMetadata, requirePublicPreview } from "@/lib/public-preview";
import { getContentDocument, getContentReferences, getContentSummaries } from "@/lib/studio-content-data";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  if (!isVisualPreviewAllowed(process.env)) return publicPreviewMetadata("Not found");
  const document = getContentDocument((await params).id);
  return publicPreviewMetadata(document ? `${document.title} · Content draft · Studio demo` : "Not found");
}

export default async function ContentDocumentPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePublicPreview();
  const document = getContentDocument((await params).id);
  if (!document) notFound();
  return <StudioContentEditor key={document.id} initialDocument={document} documents={getContentSummaries()} references={getContentReferences()} />;
}
