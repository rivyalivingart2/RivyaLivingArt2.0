import { PortfolioIndex } from "@/components/portfolio";
import { publicPreviewMetadata, requirePublicPreview } from "@/lib/public-preview";

export function generateMetadata() {
  return publicPreviewMetadata("Portfolio — fictional design studies", "Fictional furniture, spatial and memory-art briefs for the RivyaLivingArt preview.");
}

export default async function PortfolioPage() {
  await requirePublicPreview();
  return <PortfolioIndex />;
}
