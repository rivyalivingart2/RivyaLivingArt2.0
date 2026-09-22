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

const initialAssets:Record<string,{id:string;bytes:number;width:number;height:number}> = {"DP001": {"id": "media-riverline", "bytes": 170072, "width": 1122, "height": 1402}, "DP013": {"id": "media-basin", "bytes": 327458, "width": 1122, "height": 1402}, "DP035": {"id": "media-dp035", "bytes": 190200, "width": 1122, "height": 1402}, "DP048": {"id": "media-dp048", "bytes": 335506, "width": 1122, "height": 1402}, "DP069": {"id": "media-dp069", "bytes": 203782, "width": 1122, "height": 1402}, "DP085": {"id": "media-dp085", "bytes": 197232, "width": 1122, "height": 1402}, "DP114": {"id": "media-dp114", "bytes": 225128, "width": 1122, "height": 1402}};

/** Safe presentation projection of catalogue + docs/assets/initial-media.json.
 * Deliberately excludes original Drive identifiers, private references and prompts.
 * Pending entries are expected product slots, not files or imported assets.
 */
export const studioMediaAssets: readonly StudioMediaAsset[] = concepts.map((product) => {
  const mapped = initialAssets[product.id] ?? null;
  return {
    id: mapped?.id ?? `media-${product.id.toLowerCase()}`,
    title: `${product.title} · ${mapped ? "concept visual" : "visual slot"}`,
    src: mapped ? product.image : null,
    width: mapped?.width ?? 0,
    height: mapped?.height ?? 0,
    bytes: mapped?.bytes ?? null,
    alt: product.alt,
    caption: mapped ? "Fictional design study, not a completed commission." : "",
    tags: ["concepts", product.id.toLowerCase(), product.category, ...product.materials.map((material) => material.id)],
    tier: product.tier,
    status: mapped ? "PREVIEW_ONLY" : "PENDING",
    rightsNote: mapped
      ? "Reused from the owner-approved Site concept presentation. Public-repository and production distribution permission remain to be confirmed."
      : "No source supplied or rights review recorded. This slot cannot be selected or published.",
    provenance: mapped
      ? "Preserved approved Sites source derivative; AI-generated fictional concept. Exact WebP bytes and dimensions inspected. Approval covers this Site design, not public-repository or production reuse."
      : "Awaiting an owner-provided source and review. The asset brief is a request, not a generated or imported file.",
    usage: [{ id: `${product.id}:primary`, label: `${product.id} · ${product.name} · primary visual slot`, href: `/pieces/${product.slug}` }],
    qualityNote: mapped
      ? "Approved Site derivative at its original dimensions; no recolouring or replacement imagery."
      : "Dimensions, format, size, derivative version and quality are unknown until a source is supplied.",
  };
});
