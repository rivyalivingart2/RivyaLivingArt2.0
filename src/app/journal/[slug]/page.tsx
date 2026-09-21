import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JournalArticlePage } from "@/components/journal";
import { findJournalArticle } from "@/lib/journal";
import { isVisualPreviewAllowed } from "@/lib/preview-mode";
import { publicPreviewMetadata, requirePublicPreview } from "@/lib/public-preview";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!isVisualPreviewAllowed(process.env)) return publicPreviewMetadata("Not found");
  const article = findJournalArticle((await params).slug);
  return publicPreviewMetadata(article?.title ?? "Not found", article?.excerpt);
}

export default async function ArticlePage({ params }: Props) {
  await requirePublicPreview();
  const article = findJournalArticle((await params).slug);
  if (!article) notFound();
  return <JournalArticlePage article={article} />;
}
