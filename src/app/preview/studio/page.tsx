import { StudioOverview } from "@/components/studio-overview";
import { concepts } from "@/lib/catalogue";
import { faqs } from "@/lib/faqs";
import { journalArticles } from "@/lib/journal";
import { publicPreviewMetadata, requirePublicPreview } from "@/lib/public-preview";
import { buildStudioOverviewData } from "@/lib/studio-overview";

export function generateMetadata() { return publicPreviewMetadata("Studio overview · Demo", "A fixture-derived view of the RivyaLivingArt catalogue and its content gaps."); }

export default async function StudioOverviewPage() {
  await requirePublicPreview();
  return <StudioOverview data={buildStudioOverviewData(concepts, journalArticles.length, faqs.length)} />;
}
