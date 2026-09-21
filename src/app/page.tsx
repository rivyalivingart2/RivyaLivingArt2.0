import { connection } from "next/server";
import { isVisualPreviewAllowed } from "@/lib/preview-mode";
import { Homepage } from "@/components/homepage";
import { BuildHoldingScreen } from "@/components/build-state";

export default async function Home() {
  await connection(); // Read preview policy at request time, never freeze it into a shared static build.
  // Deliver the anchor destinations with the page, so cross-route hash navigation
  // does not run against a streamed loading placeholder before they exist.
  return isVisualPreviewAllowed(process.env) ? <Homepage /> : <BuildHoldingScreen />;
}
