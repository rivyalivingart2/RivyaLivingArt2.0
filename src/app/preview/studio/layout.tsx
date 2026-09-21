import { StudioShell } from "@/components/studio-shell";
import { requirePublicPreview } from "@/lib/public-preview";

export default async function StudioPreviewLayout({ children }: { children: React.ReactNode }) {
  await requirePublicPreview();
  return <StudioShell>{children}</StudioShell>;
}
