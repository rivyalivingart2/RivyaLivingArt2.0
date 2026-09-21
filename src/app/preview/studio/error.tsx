"use client";

import { SystemState } from "@/components/system-state";

export default function StudioPreviewError({ reset }: { reset: () => void }) {
  return <SystemState kind="error" compact headingLevel={1} title="This Studio view couldn’t open." description="Try this view again. Local draft work may be lost when an interrupted editor resets; no source fixture or live record was changed." onRetry={reset} actionHref="/preview/studio" actionLabel="Back to the Studio overview" />;
}
