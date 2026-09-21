import { notFound } from "next/navigation";
import { PortfolioDetail } from "@/components/portfolio";
import { findPortfolioStudy } from "@/lib/portfolio";
import { isVisualPreviewAllowed } from "@/lib/preview-mode";
import { publicPreviewMetadata, requirePublicPreview } from "@/lib/public-preview";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  if (!isVisualPreviewAllowed(process.env)) return { title: "Not found" };
  const study = findPortfolioStudy((await params).slug);
  return study ? publicPreviewMetadata(`${study.title} — fictional design study`, study.excerpt) : { title: "Not found" };
}

export default async function PortfolioStudyPage({ params }: Props) {
  await requirePublicPreview();
  const study = findPortfolioStudy((await params).slug);
  if (!study) notFound();
  return <PortfolioDetail study={study} />;
}
