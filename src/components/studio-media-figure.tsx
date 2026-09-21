import { ConceptImage } from "@/components/concept-image";
import type { AssetReference, StudioMediaAsset } from "@/lib/studio-media";
import styles from "./studio-media.module.css";

/** Only the two reviewed local derivative paths are available in this harness. */
function reviewedSource(asset: StudioMediaAsset) {
  const expected = asset.id === "media-riverline" ? "/media/concepts/riverline.avif" : asset.id === "media-basin" ? "/media/concepts/basin.avif" : null;
  return asset.status === "PREVIEW_ONLY" && expected === asset.src ? expected : null;
}

function percentage(value: number) { return Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 50; }

export function MediaAssetFigure({ reference, assets }: { reference: AssetReference; assets: readonly StudioMediaAsset[] }) {
  const asset = assets.find((entry) => entry.id === reference.assetId);
  const src = asset ? reviewedSource(asset) : null;
  return <figure className={styles.figure}>
    <div className={styles.figureImage}>
      <ConceptImage src={src} alt={reference.alt.trim() || asset?.alt || "Fictional design study; description required"} fill sizes="(max-width: 600px) 90vw, 600px" style={{ objectFit: "cover", objectPosition: `${percentage(reference.focalPoint.x)}% ${percentage(reference.focalPoint.y)}%` }} />
    </div>
    <figcaption>
      <span className={styles.classification}>{src ? "AI concept visualization · preview only" : asset ? "Visual pending · no selectable image" : "Missing media reference · choose an available asset"}</span>
      {reference.caption.trim() && <span>{reference.caption}</span>}
    </figcaption>
  </figure>;
}
