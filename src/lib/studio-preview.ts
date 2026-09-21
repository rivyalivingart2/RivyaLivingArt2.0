import { concepts } from "@/lib/catalogue";
import { isVisualPreviewAllowed } from "@/lib/preview-mode";
import { publicPreviewMetadata } from "@/lib/public-preview";

/** Resolve sample metadata only after the same environment guard as the page. */
export function studioProductMetadata(id: string, surface: string) {
  if (!isVisualPreviewAllowed(process.env)) return publicPreviewMetadata("Not found");
  const product = concepts.find((piece) => piece.id === id);
  return publicPreviewMetadata(product ? `${product.title} · ${surface} · Studio demo` : "Not found");
}
