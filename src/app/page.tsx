import { connection } from "next/server";
import { isPublicWebsiteAvailable } from "@/lib/public-website";
import { Homepage } from "@/components/homepage";
import { BuildHoldingScreen } from "@/components/build-state";

export default async function Home() {
  await connection(); // Read preview policy at request time, never freeze it into a shared static build.
  // Deliver the anchor destinations with the page, so cross-route hash navigation
  // does not run against a streamed loading placeholder before they exist.
  return isPublicWebsiteAvailable(process.env) ? <Homepage /> : <BuildHoldingScreen />;
}
