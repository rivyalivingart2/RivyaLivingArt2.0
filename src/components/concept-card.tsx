import Link from "next/link";
import { formatPrice, type Concept } from "@/lib/catalogue";
import { Arrow } from "@/components/ui/arrow";
import { ConceptImage } from "@/components/concept-image";
import styles from "./concept-card.module.css";

export function ConceptCard({ piece, index = 0 }: { piece: Concept; index?: number }) {
  return (
    <article className={`concept-card ${styles.card}`}>
      <Link className="concept-link" href={`/pieces/${piece.slug}`}>
        <div className="concept-image">
          <ConceptImage src={piece.image} alt={piece.alt} fill sizes="(max-width: 760px) 90vw, 44vw" />
          <span className="image-index">{String(index + 1).padStart(2, "0")}</span>
          <span className="concept-label">{piece.image ? "AI concept" : "Sample study"}</span>
        </div>
        <div className="concept-heading">
          <div><p className="eyebrow">{piece.type}</p><h3>{piece.title}</h3></div>
          <Arrow />
        </div>
        <div className={styles.facts}>
          <p>{piece.materials.map((material) => material.label).join(" · ")}</p>
          <p>{piece.dimensions.width} × {piece.dimensions.depth} × {piece.dimensions.height} mm</p>
          <p>{piece.edition.label}</p>
        </div>
        <div className={styles.bottom}>
          <div><span className={styles.sampleLabel}>Sample specification &amp; price</span><p>{formatPrice(piece)}</p></div>
          <span className={`text-link ${styles.explore}`}>Explore the study</span>
        </div>
      </Link>
    </article>
  );
}
