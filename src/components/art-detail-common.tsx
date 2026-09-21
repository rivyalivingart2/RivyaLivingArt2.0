import Link from "next/link";
import { relatedConcepts, type Concept, type Dimensions } from "@/lib/catalogue";
import { ConceptCard } from "@/components/concept-card";
import styles from "./art-detail.module.css";

export function dimensionText(dimensions: Dimensions) {
  return `${dimensions.width.toLocaleString("en-IN")} × ${dimensions.depth.toLocaleString("en-IN")} × ${dimensions.height.toLocaleString("en-IN")} ${dimensions.unit}`;
}

export function ArtSampleNotice() {
  return <p className={styles.sampleNotice}>Fictional sample design. Materials, sizes, prices, options and lead times are examples for this preview.</p>;
}

export function ArtRelated({ piece }: { piece: Concept }) {
  const related = relatedConcepts(piece);
  if (related.length === 0) return null;
  const isMemory = piece.tier === "MEDIUM";
  return <section className={styles.related} aria-labelledby="related-heading">
    <div className="section-heading"><div><p className="eyebrow">Continue the collection</p><h2 id="related-heading">{isMemory ? "Other ways to remember." : "Small objects. More possibilities."}</h2></div><Link className="text-link" href={isMemory ? "/memory-art" : "/personal-art"}>Explore {isMemory ? "memory art" : "personal art"} <span aria-hidden="true">↗</span></Link></div>
    <div className={isMemory ? styles.memoryRelated : styles.personalRelated}>{related.map((item, index) => <ConceptCard key={item.id} piece={item} index={index} />)}</div>
  </section>;
}
