"use client";

import { SystemState } from "@/components/system-state";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main id="main-content"><SystemState kind="error" onRetry={reset} /></main>;
}
