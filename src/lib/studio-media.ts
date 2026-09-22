import { concepts, type ProductTier } from "@/lib/catalogue";

/** Usage overrides travel with content; provenance remains on the asset record. */
export type AssetReference = {
  assetId: string;
  alt: string;
  caption: string;
  focalPoint: { x: number; y: number };
};

export type StudioMediaAsset = Readonly<{
  id: string;
  title: string;
  src: string | null;
  width: number;
  height: number;
  bytes: number | null;
  alt: string;
  caption: string;
  tags: readonly string[];
  tier: ProductTier;
  status: "PREVIEW_ONLY" | "PENDING";
  rightsNote: string;
  provenance: string;
  usage: readonly Readonly<{ id: string; label: string; href: string }>[];
  qualityNote: string;
}>;

const initialAssets = {
  DP001: { id: "media-riverline", bytes: 7732 },
  DP013: { id: "media-basin", bytes: 7007 },
} as const;

/** Safe presentation projection of catalogue + docs/assets/initial-media.json.
 * Deliberately excludes original Drive identifiers, private references and prompts.
 * Pending entries are expected product slots, not files or imported assets.
 */
export const studioMediaAssets: readonly StudioMediaAsset[] = concepts.map((product) => {
  const mapped = product.id === "DP001" || product.id === "DP013" ? initialAssets[product.id] : null;
  return {
    id: mapped?.id ?? `media-${product.id.toLowerCase()}`,
    title: `${product.title} · ${mapped ? "concept visual" : "visual slot"}`,
    src: mapped ? product.image : null,
    width: mapped ? product.width : 0,
    height: mapped ? product.height : 0,
    bytes: mapped?.bytes ?? null,
    alt: product.alt,
    caption: mapped ? "Fictional design study, not a completed commission." : "",
    tags: ["concepts", product.id.toLowerCase(), product.category, ...product.materials.map((material) => material.id)],
    tier: product.tier,
    status: mapped ? "PREVIEW_ONLY" : "PENDING",
    rightsNote: mapped
      ? "Reviewed for the labelled R8-1 visual preview only. Production reuse rights and approval remain to be confirmed."
      : "No source supplied or rights review recorded. This slot cannot be selected or published.",
    provenance: mapped
      ? "Owner-supplied Drive collection; AI-generated fictional concept. Original preserved. Bundled AVIF derivative, version 1; source and derivative manifest dated 21 September 2026. No production approver is recorded."
      : "Awaiting an owner-provided source and review. The asset brief is a request, not a generated or imported file.",
    usage: [{ id: `${product.id}:primary`, label: `${product.id} · ${product.name} · primary visual slot`, href: `/pieces/${product.slug}` }],
    qualityNote: mapped
      ? "Small initial preview derivative. A larger reviewed deliverable is required before production."
      : "Dimensions, format, size, derivative version and quality are unknown until a source is supplied.",
  };
});
