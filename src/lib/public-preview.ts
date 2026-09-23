import type { Metadata } from "next";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { isVisualPreviewAllowed } from "@/lib/preview-mode";
import { isPublicWebsiteAvailable } from "@/lib/public-website";

/** Request-time public website boundary; retained name for existing route adapters. */
export async function requirePublicPreview(): Promise<void> {
  await connection();
  if (!isPublicWebsiteAvailable(process.env)) notFound();
}

/** Development-only system presentations remain unavailable in production. */
export async function requireVisualPreview(): Promise<void> {
  await connection();
  if (!isVisualPreviewAllowed(process.env)) notFound();
}

/** No fictional content metadata or invented production canonical in live mode. */
export function publicPreviewMetadata(title: string, description?: string): Metadata {
  if (!isPublicWebsiteAvailable(process.env)) return { title: "Not found", robots: { index: false, follow: false } };
  return { title, description, robots: { index: false, follow: false } };
}
