import type { Metadata } from "next";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { isVisualPreviewAllowed } from "@/lib/preview-mode";

/** Request-time boundary for sample editorial routes; never a staff-auth substitute. */
export async function requirePublicPreview(): Promise<void> {
  await connection();
  if (!isVisualPreviewAllowed(process.env)) notFound();
}

/** No fictional content metadata or invented production canonical in live mode. */
export function publicPreviewMetadata(title: string, description?: string): Metadata {
  if (!isVisualPreviewAllowed(process.env)) return { title: "Not found", robots: { index: false, follow: false } };
  return { title, description, robots: { index: false, follow: false } };
}
