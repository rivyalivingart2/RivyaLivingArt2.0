import Link from "next/link";
import { formatPrice, memoryOccasionOptions, preservationOptions, type MemoryConcept } from "@/lib/catalogue";
import { ProductGallery } from "@/components/product-gallery";
import { ArtRelated, ArtSampleNotice, dimensionText } from "@/components/art-detail-common";
import styles from "./art-detail.module.css";

export function MemoryDetail({ piece }: { piece: MemoryConcept }) {
  const { memory } = piece;
  const occasion = memory.occasions.map((value) => memoryOccasionOptions.find((option) => option.value === value)?.label).join(" · ");
  const preservation = preservationOptions.find((option) => option.value === memory.preservation)?.label;
  return <main id="main-content" className={`section ${styles.page} ${styles.memoryPage}`}>
    <nav aria-label="Breadcrumb" className={styles.breadcrumb}><Link className="text-link" href="/memory-art">← Memory art</Link><span aria-hidden="true">/</span><span aria-current="page">{piece.title}</span></nav>
    <div className={styles.memoryIntro}>
      <div className={styles.memoryGallery}><ProductGallery key={piece.id} title={piece.title} gallery={piece.gallery} /></div>
      <div className={styles.memoryCopy}>
        <p className="eyebrow">{piece.type} / {piece.id}</p>
        <h1>{piece.title}</h1>
        <p className={styles.summary}>{piece.description}</p>
        <ArtSampleNotice />
        <dl className={styles.memoryFacts}>
          <div><dt>Occasion</dt><dd>{occasion}</dd></div>
          <div><dt>Preservation direction</dt><dd>{preservation}</dd></div>
          <div><dt>Sample format</dt><dd>{memory.format}</dd></div>
          <div><dt>Material direction</dt><dd>{piece.materials.map((material) => material.label).join(" · ")}</dd></div>
        </dl>
        <div className={styles.priceRow}><div><span>Demo pricing</span><p>{formatPrice(piece)}</p></div><div><span>Example lead time</span><p>{piece.leadTime.minWeeks}–{piece.leadTime.maxWeeks} weeks</p></div></div>
        <a href="#guidance" className={`button button-primary ${styles.mainAction}`}>Preserve Your Memory <span aria-hidden="true">↗</span></a>
        <p className={styles.ctaNote}>Explore what a preservation brief could include. The request form is planned; this preview sends nothing.</p>
      </div>
    </div>
    <section className={styles.memoryStory} aria-labelledby="memory-story">
      <div><p className="eyebrow">The memory behind the object</p><h2 id="memory-story">A story,<br /><em>considered.</em></h2></div>
      <div className={styles.storyCopy}><p className={styles.storyLabel}>Fictional design narrative</p>{piece.detail.split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
    </section>
    <section className={styles.memoryOptions} aria-labelledby="memory-options">
      <div><p className="eyebrow">Finding the right proportion</p><h2 id="memory-options">Sample size options</h2><p className={styles.sectionNote}>Dimensions describe the proposed object. The materials you hope to include would need an individual review.</p></div>
      <div><ul className={styles.sizeList}>{memory.sizes.map((size) => <li key={size.label}><h3>{size.label}</h3><p>{dimensionText(size.dimensions)}</p><span>Width × depth × height · sample only</span></li>)}</ul><p className={styles.materialsNote}>{memory.materialsNote}</p></div>
    </section>
    <section id="guidance" className={styles.memoryGuidance} aria-labelledby="memory-guidance">
      <div><p className="eyebrow">Preservation guidance / preview</p><h2 id="memory-guidance">Before you send<br /><em>a keepsake.</em></h2><p className={styles.sectionNote}>Begin with a conversation about the object and the story it carries. No enquiry is created here.</p></div>
      <div className={styles.disclosures}>
        <details open><summary>A personal starting point <span aria-hidden="true">+</span></summary><div className={styles.disclosure}><p>Sample customization directions for {piece.title}:</p><ul>{memory.personalization.map((item) => <li key={item}>{item}</li>)}</ul><p>These are discussion prompts. Please do not share names, dates, photos or other private material in this preview.</p></div></details>
        <details open><summary>Physical materials & the studio <span aria-hidden="true">+</span></summary><div className={styles.disclosure}><p>Before sending flowers, paper or objects, ask the studio to review their condition and confirm suitability, timing, packaging and a current delivery address. This preview provides no shipping instructions or acceptance guarantee.</p><p>A future brief can record the occasion, proposed format and size, the materials available and your preferred timing. The owner must confirm the preservation process and feasibility.</p></div></details>
        <details><summary>Care & preservation <span aria-hidden="true">+</span></summary><div className={styles.disclosure}><p>{piece.care}</p><p>Example timing: {piece.leadTime.minWeeks}–{piece.leadTime.maxWeeks} weeks. Material condition, design review and the agreed process may affect a real schedule.</p></div></details>
      </div>
    </section>
    <ArtRelated piece={piece} />
  </main>;
}
