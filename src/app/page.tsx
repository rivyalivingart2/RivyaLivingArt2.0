import { connection } from "next/server";
import { Suspense } from "react";
import { isVisualPreviewAllowed } from "@/lib/preview-mode";
import { Homepage } from "@/components/homepage";
import { BuildHoldingScreen } from "@/components/build-state";
import { PageLoading } from "@/components/page-loading";

async function PreviewHome() {
  await connection(); // Read preview policy at request time, never freeze it into a shared static build.
  return isVisualPreviewAllowed(process.env) ? <Homepage /> : <BuildHoldingScreen />;
}

export default function Home() {
  // Stream only this known route. A root loading boundary commits HTTP 200 before
  // dynamic collection/product pages can reject unknown or disabled fixture slugs.
  return <Suspense fallback={<PageLoading />}><PreviewHome /></Suspense>;
}
