import { concepts, type ProductTier } from "@/lib/rivya/source/catalogue";

import {suppliedProductMedia} from './supplied-media';

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
const primaryMediaAssets: readonly StudioMediaAsset[] = concepts.map((product) => {
  const supplied = suppliedProductMedia[product.id]?.primary;
  const mapped = supplied ? {id: `media-${product.id.toLowerCase()}`, ...supplied} : initialAssets[product.id] ?? null;
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
      ? "Owner authorized website integration and publication of these concept derivatives to the specified GitHub repository and Vercel on 23 September 2026."
      : "No source supplied or rights review recorded. This slot cannot be selected or published.",
    provenance: mapped
      ? "Owner-supplied AI concept derivative. Imported bytes, dimensions and source mapping are recorded in the repository asset manifest."
      : "Awaiting an owner-provided source and review. The asset brief is a request, not a generated or imported file.",
    usage: [{ id: `${product.id}:primary`, label: `${product.id} · ${product.name} · primary visual slot`, href: `/pieces/${product.slug}` }],
    qualityNote: mapped
      ? "Supplied web derivative at its original dimensions; no recolouring or replacement imagery."
      : "Dimensions, format, size, derivative version and quality are unknown until a source is supplied.",
  };
});

/** Detail views share catalogue IDs and remain selectable in the Studio media picker. */
export const suppliedDetailAssets: readonly StudioMediaAsset[] = concepts.flatMap(product => {
 const detail=suppliedProductMedia[product.id]?.detail;
 if(!detail)return [];
 const primary=primaryMediaAssets.find(asset=>asset.usage.some(use=>use.id===product.id+':primary'))!;
 return [{...primary,id:'media-'+product.id.toLowerCase()+'-detail',title:product.title+' · matching detail',src:detail.src,width:detail.width,height:detail.height,bytes:detail.bytes,alt:product.title+' — matching detail, AI concept',tags:[...primary.tags,'detail'],usage:[{id:product.id+':detail',label:product.title+' · detail view',href:'/pieces/'+product.slug}]}];
});

export const studioMediaAssets: readonly StudioMediaAsset[] = [...primaryMediaAssets,...suppliedDetailAssets];
