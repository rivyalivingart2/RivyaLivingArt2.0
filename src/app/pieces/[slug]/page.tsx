import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { findConcept, formatPrice, relatedConcepts } from "@/lib/catalogue";
import { isVisualPreviewAllowed } from "@/lib/preview-mode";
import { ConceptCard } from "@/components/concept-card";
import { FinishOptions } from "@/components/finish-options";
import { ProductGallery } from "@/components/product-gallery";
import { MemoryDetail } from "@/components/memory-detail";
import { PersonalDetail } from "@/components/personal-detail";
import styles from "./piece.module.css";

type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Do not leak concept names through metadata in a live/disabled environment.
  if (!isVisualPreviewAllowed(process.env)) return { title: "Not found" };
  return { title: findConcept((await params).slug)?.title ?? "Not found" };
}

export default async function PiecePage({ params }: Props) {
  await connection();
  if (!isVisualPreviewAllowed(process.env)) notFound();
  const piece = findConcept((await params).slug);
  if (!piece) notFound();
  if (piece.tier === "MEDIUM") return <MemoryDetail piece={piece} />;
  if (piece.tier === "SMALL") return <PersonalDetail piece={piece} />;
  const related = relatedConcepts(piece);
  const dimensions = piece.dimensions;

  return <main id="main-content" className={`section ${styles.page}`}>
    <nav aria-label="Breadcrumb" className={styles.breadcrumb}><Link className="text-link" href="/collectible-design">← Collectible design</Link><span aria-hidden="true">/</span><span aria-current="page">{piece.title}</span></nav>
    <div className={styles.intro}>
      <ProductGallery key={piece.id} title={piece.title} gallery={piece.gallery} />
      <div className={styles.copy}>
        <p className="eyebrow">{piece.type} / {piece.id}</p>
        <h1>{piece.title}</h1>
        <p className={styles.summary}>{piece.description}</p>
        <div className={styles.sampleNotice}><span className={styles.sampleDot} aria-hidden="true" /><p>Fictional sample design. All specifications, prices, finishes and lead times below are examples for this preview.</p></div>
        <div className={styles.pricing}><div><span className={styles.smallLabel}>Demo pricing</span><p>{formatPrice(piece)}</p></div><div><span className={styles.smallLabel}>Example lead time</span><p>{piece.leadTime.minWeeks}–{piece.leadTime.maxWeeks} weeks</p></div></div>
        <dl className={styles.quickFacts}>
          <div><dt>Sample dimensions</dt><dd>{dimensions.width.toLocaleString("en-IN")} × {dimensions.depth.toLocaleString("en-IN")} × {dimensions.height.toLocaleString("en-IN")} {dimensions.unit}<span>Width × depth × height</span></dd></div>
          <div><dt>Material direction</dt><dd>{piece.materials.map((material) => material.label).join(" · ")}</dd></div>
          <div><dt>Edition study</dt><dd>{piece.edition.label}</dd></div>
          <div><dt>Sample availability</dt><dd>{piece.availability === "MADE_TO_ORDER" ? "Made-to-order example" : "Ready-to-ship example"}<span>Demo state · not live stock</span></dd></div>
        </dl>
        <FinishOptions key={piece.id} finishes={piece.finishes} />
        <Link href={{ pathname: "/commission", query: { piece: piece.slug } }} className={`button button-primary ${styles.commission}`}>Explore commissioning {piece.title}<span aria-hidden="true">↗</span></Link>
        <p className={styles.ctaNote}>Try a commissioning brief with fictional details. This local demo sends nothing to the studio and reserves no piece.</p>
      </div>
    </div>
    <section className={styles.story} aria-labelledby="piece-story">
      <div><p className="eyebrow">The idea behind the form</p><h2 id="piece-story">A material<br /><em>conversation.</em></h2></div>
      <div className={styles.storyCopy}><p className={styles.storyLabel}>Fictional design narrative</p>{piece.detail.split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
    </section>
    <section className={styles.specifications} aria-labelledby="piece-details">
      <div><p className="eyebrow">For a considered commission</p><h2 id="piece-details">The details<br />to discuss.</h2><p className={styles.specIntro}>These examples help frame a conversation. Actual measurements, materials, price and feasibility need confirmation for an individual commission.</p></div>
      <div className={styles.accordions}>
        <details open><summary>Dimensions & materials <span aria-hidden="true">+</span></summary><div className={styles.disclosure}><dl><div><dt>Width</dt><dd>{dimensions.width.toLocaleString("en-IN")} {dimensions.unit}</dd></div><div><dt>Depth</dt><dd>{dimensions.depth.toLocaleString("en-IN")} {dimensions.unit}</dd></div><div><dt>Height</dt><dd>{dimensions.height.toLocaleString("en-IN")} {dimensions.unit}</dd></div><div><dt>Sample materials</dt><dd>{piece.materials.map((material) => material.label).join(", ")}</dd></div></dl><p>Example dimensions only. Weight, structural performance and verified fabrication specifications have not been supplied.</p></div></details>
        <details><summary>Delivery & site access <span aria-hidden="true">+</span></summary><div className={styles.disclosure}><p>{piece.installation}</p><p>Sample lead-time range: {piece.leadTime.minWeeks}–{piece.leadTime.maxWeeks} weeks. This is not a delivery commitment.</p></div></details>
        <details><summary>Care & handling <span aria-hidden="true">+</span></summary><div className={styles.disclosure}><p>{piece.care}</p></div></details>
        <details><summary>Shaping your brief <span aria-hidden="true">+</span></summary><div className={styles.disclosure}><p>For a future conversation, consider how the object will be used, your proposed dimensions, preferred materials and finish, location, site access and timing. References can help describe your intention.</p><p>Manufacturing and installation suitability require owner review. No specification download or 3D model is supplied for this study.</p></div></details>
      </div>
    </section>
    {related.length > 0 && <section className={styles.related} aria-labelledby="related-heading"><div className="section-heading"><div><p className="eyebrow">Continue the collection</p><h2 id="related-heading">In conversation<br />with {piece.title}.</h2></div><Link href="/collectible-design" className="text-link">View all sample pieces <span aria-hidden="true">↗</span></Link></div><div className={styles.relatedGrid}>{related.map((item, index) => <ConceptCard key={item.id} piece={item} index={index} />)}</div></section>}
  </main>;
}
