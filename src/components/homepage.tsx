import Link from "next/link";
import { collections, conceptsForTier } from "@/lib/catalogue";
import { ConceptCard } from "@/components/concept-card";
import { ConceptImage } from "@/components/concept-image";
import { Arrow } from "@/components/ui/arrow";
import { JournalSelection } from "@/components/journal";
import styles from "./homepage.module.css";

const directions = [
  { id: "tables", title: "Tables", note: "Gathering, working, living.", detail: "Dining tables, low tables and desks." },
  { id: "seating", title: "Seating", note: "A place within a place.", detail: "Sculptural chairs and considered benches." },
  { id: "consoles", title: "Consoles", note: "The art of an arrival.", detail: "Slender forms for thresholds and quiet walls." },
  { id: "installations", title: "Spatial art", note: "An expression at another scale.", detail: "Wall work, sculpture and architectural studies." },
];

export function Homepage() {
  const concepts = conceptsForTier("LARGE");
  const hero = concepts[0];
  const selected = ["DP001", "DP013", "DP043", "DP035"].flatMap((id) => {
    const piece = concepts.find((concept) => concept.id === id);
    return piece ? [piece] : [];
  });
  return <main id="main-content">
    <section className={`hero ${styles.hero}`} aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow"><span className="small-line" />Resin furniture & spatial art</p>
        <h1 id="hero-title">Not just an object.<br />A different kind<br />of <em>presence.</em></h1>
        <p className="hero-description">Expressive materials. Considered forms.<br />A world of resin art, imagined around you.</p>
        <div className="hero-actions"><Link className="button button-primary" href="/commission">Commission a piece <Arrow /></Link><Link className="text-link" href="/collectible-design">Explore collectible design <span aria-hidden="true">↗</span></Link></div>
        <p className="hero-footnote">01 — Art for the space</p>
      </div>
      <figure className={`hero-media ${styles.heroMedia}`}>
        <ConceptImage src={hero.image} alt={hero.alt} fill preload sizes="(max-width: 600px) 90vw, 560px" />
        <figcaption><span>Riverline</span><span>Dining table · AI concept visualization</span></figcaption>
      </figure>
    </section>
    <div className="material-line" aria-label="Brand themes"><span>Liquid material</span><span aria-hidden="true">·</span><span>Natural expression</span><span aria-hidden="true">·</span><span>Personal meaning</span></div>
    <section className={`section ${styles.discovery}`} aria-labelledby="discovery-title">
      <div className="section-heading"><div><p className="eyebrow">An object. A room. A relationship.</p><h2 id="discovery-title">Find your <em>point of view.</em></h2></div><p className="section-aside">Explore four directions in collectible furniture and spatial art. Every study here is a fictional starting point.</p></div>
      <div className={styles.directionGrid}>{directions.map((direction, index) => <Link href={`/collectible-design?category=${direction.id}`} className={styles.direction} key={direction.id}><span className="eyebrow">0{index + 1} / {direction.note}</span><div><h3>{direction.title}</h3><Arrow /></div><p>{direction.detail}</p></Link>)}</div>
    </section>
    <section id="selected-pieces" className={`section selected-pieces ${styles.selected}`} aria-labelledby="selected-title">
      <div className="section-heading"><div><p className="eyebrow">Selected studies / 01—04</p><h2 id="selected-title">A conversation<br />between <em>form & feeling.</em></h2></div><div className="section-aside"><p>Four perspectives from a growing collection of {concepts.length} fictional studies. From the intimacy of a chair to the presence of a dining table.</p><Link href="/collectible-design" className="text-link">View the collection <Arrow /></Link></div></div>
      <div className={`concept-grid ${styles.selectedGrid}`}>{selected.map((piece, index) => <ConceptCard key={piece.id} piece={piece} index={index} />)}</div>
    </section>
    <section id="atelier" className="section atelier" aria-labelledby="atelier-title">
      <p className="eyebrow">A material-led point of view</p><h2 id="atelier-title">Fluid by nature.<br /><em>Personal by intention.</em></h2>
      <div className="atelier-bottom"><p>RivyaLivingArt brings furniture, memories and personal objects into one artistic language. The scale changes. The attention to how an object feels in your world does not.</p><span className="atelier-note">One atelier.<br />Three scales of expression.</span></div>
      <div className={styles.materialNotes}>
        <article><p className="eyebrow">01 / Grain</p><h3>A natural rhythm.</h3><p>Wood offers a direction to follow: a line, an edge, a pattern that makes each composition feel particular.</p></article>
        <article><p className="eyebrow">02 / Depth</p><h3>Light held in colour.</h3><p>Resin suggests depth and translucency. A physical sample would guide the final tone and finish of a commission.</p></article>
        <article><p className="eyebrow">03 / Form</p><h3>Presence, with purpose.</h3><p>Every concept begins with how a piece sits within a room. Proportion and practical details belong in the same conversation.</p></article>
      </div>
      <p className={styles.materialCaption}>A design narrative for these fictional studies. Materials and construction would require confirmation for a real piece.</p>
      <div className={styles.editorialLinks}><Link className="text-link" href="/about">Our point of view <Arrow /></Link><Link className="text-link" href="/materials">Explore materials <Arrow /></Link><Link className="text-link" href="/portfolio">Fictional design studies <Arrow /></Link></div>
    </section>
    <section className="section worlds" aria-labelledby="worlds-title"><div className="section-heading"><div><p className="eyebrow">Discover your expression</p><h2 id="worlds-title">Three scales.<br /><em>One artistic language.</em></h2></div></div><div className="world-grid">{collections.map((collection) => <Link key={collection.slug} href={`/${collection.slug}`} className="world-card"><span className="eyebrow">{collection.number} / {collection.detail}</span><h3>{collection.title}</h3><p>{collection.description}</p><span className="text-link">{collection.label}<Arrow /></span></Link>)}</div></section>
    <JournalSelection />
    <section id="commission" className="section commission" aria-labelledby="commission-title">
      <p className="eyebrow">Begin with a possibility</p><h2 id="commission-title">Your space.<br />Your story. <em>Your piece.</em></h2>
      <div><p>A table for a gathering place. An object with personal meaning. A direction that begins with you.</p><ol className={styles.briefSteps}><li><strong>The room & the role</strong><span>Where the piece will live, how it will be used and the dimensions you have in mind.</span></li><li><strong>A material direction</strong><span>The grain, colour, form or finish that draws you in. A concept is a conversation starter.</span></li><li><strong>The practical details</strong><span>Location, delivery access and your preferred timeline help shape a considered brief.</span></li></ol><div className="development-note"><strong>Try a sample commissioning brief.</strong><span>Use fictional details to explore the form and simulated receipt. Nothing is sent to the studio.</span><Link href="/commission" className="text-link">Start a demo brief <Arrow /></Link></div></div>
    </section>
  </main>;
}
