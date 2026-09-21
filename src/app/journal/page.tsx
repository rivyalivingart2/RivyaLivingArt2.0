import { JournalIndex } from "@/components/journal";
import { Suspense } from "react";
import { PageLoading } from "@/components/page-loading";
import { publicPreviewMetadata, requirePublicPreview } from "@/lib/public-preview";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export function generateMetadata() {
  return publicPreviewMetadata("The journal", "Sample journal drafts on collectible furniture, materials, spaces and commissioning.");
}

export default async function JournalPage({ searchParams }: Props) {
  await requirePublicPreview();
  return <Suspense fallback={<PageLoading variant="article" />}><JournalContent searchParams={searchParams} /></Suspense>;
}

async function JournalContent({ searchParams }: Props) {
  return <JournalIndex searchParams={await searchParams} />;
}
