import Link from "next/link";
import { formatPrice, memoryOccasionOptions, preservationOptions, type Concept, type MemoryConcept, type PersonalConcept } from "@/lib/catalogue";
import { Arrow } from "@/components/ui/arrow";
import { ConceptImage } from "@/components/concept-image";
import styles from "./concept-card.module.css";

export function ConceptCard({ piece, index = 0 }: { piece: Concept; index?: number }) {
  if (piece.tier === "MEDIUM") return <MemoryProductCard piece={piece} index={index} />;
  if (piece.tier === "SMALL") return <PersonalArtProductCard piece={piece} />;
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

export function MemoryProductCard({ piece, index = 0 }: { piece: MemoryConcept; index?: number }) {
  const headingId = `memory-${piece.id}`;
  const occasion = piece.memory.occasions.map((value) => memoryOccasionOptions.find((option) => option.value === value)?.label).join(" · ");
  const preservation = preservationOptions.find((option) => option.value === piece.memory.preservation)?.label;
  return (
    <article className={`${styles.card} ${styles.memoryCard}`} data-tier="memory">
      <Link className={`concept-link ${styles.memoryLink}`} href={`/pieces/${piece.slug}`} aria-labelledby={headingId}>
        <div className={`concept-image ${styles.memoryImage}`}>
          <ConceptImage src={piece.image} alt={piece.alt} fill sizes="(max-width: 760px) 90vw, 44vw" />
          <span className="image-index">{String(index + 1).padStart(2, "0")}</span>
          <span className="concept-label">Sample study</span>
        </div>
        <div className={styles.memoryHeading}>
          <div><p className="eyebrow">{occasion}</p><h3 id={headingId}>{piece.name}</h3></div>
          <Arrow />
        </div>
      </Link>
      <p className={styles.memoryStory}>{piece.description}</p>
      <dl className={styles.memoryFacts}>
        <div><dt>Preservation</dt><dd>{preservation}</dd></div>
        <div><dt>Sample sizes<br />(W × D × H)</dt><dd>{piece.memory.sizes.map((size) => `${size.label} · ${size.dimensions.width} × ${size.dimensions.depth} × ${size.dimensions.height} mm`).join(" / ")}</dd></div>
        <div><dt>Personal details</dt><dd>{piece.memory.personalization.length ? piece.memory.personalization.join(" · ") : "Format discussion"}</dd></div>
      </dl>
      <div className={styles.memoryBottom}>
        <div><span className={styles.sampleLabel}>Sample specification &amp; price</span><p>{formatPrice(piece)}</p></div>
        <Link href={{ pathname: "/preserve", query: { piece: piece.slug } }} className="text-link" aria-label={`Preserve Your Memory — ${piece.name}`}>Preserve Your Memory <Arrow /></Link>
      </div>
    </article>
  );
}

export function PersonalArtProductCard({ piece }: { piece: PersonalConcept }) {
  const headingId = `personal-${piece.id}`;
  return (
    <article className={`${styles.card} ${styles.personalCard}`} data-tier="personal">
      <Link className={`concept-link ${styles.personalLink}`} href={`/pieces/${piece.slug}`} aria-labelledby={headingId}>
        <div className={`concept-image ${styles.personalImage}`}>
          <ConceptImage src={piece.image} alt={piece.alt} fill sizes="(max-width: 380px) 90vw, (max-width: 1000px) 44vw, 22vw" />
          <span className="concept-label">Sample study</span>
        </div>
        <div className={styles.personalHeading}><p className="eyebrow">{piece.type}</p><h3 id={headingId}>{piece.name}</h3></div>
      </Link>
      <div className={styles.personalFacts}>
        <p><span>Sample variants</span>{piece.personal.variants.map((variant) => variant.label).join(" · ")}</p>
        <p><span>Personal details</span>{piece.personal.personalization.length ? piece.personal.personalization.join(" · ") : "Choose a variant"}</p>
      </div>
      <div className={styles.personalBottom}>
        <div><span className={styles.sampleLabel}>Sample price</span><p>{formatPrice(piece)}</p></div>
        <Link href={{ pathname: "/personalize", query: { piece: piece.slug, ...(piece.personal.variants[0] ? { variant: piece.personal.variants[0].id } : {}) } }} className="text-link" aria-label={`Personalize & Enquire — ${piece.name}`}>Personalize &amp; Enquire <Arrow /></Link>
      </div>
    </article>
  );
}
