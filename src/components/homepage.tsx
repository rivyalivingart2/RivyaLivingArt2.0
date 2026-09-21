import Link from "next/link";
import Image from "next/image";
import { collections, concepts } from "@/lib/catalogue";
import { ConceptCard } from "@/components/concept-card";
import { Arrow } from "@/components/ui/arrow";

export function Homepage() {
  const hero = concepts[0];
  return <main id="main-content">
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-copy"><p className="eyebrow"><span className="small-line" />Resin furniture & spatial art</p><h1 id="hero-title">Not just an object.<br />A different kind<br />of <em>presence.</em></h1><p className="hero-description">Expressive materials. Considered forms.<br />A world of resin art, imagined around you.</p><div className="hero-actions"><Link className="button button-primary" href="/collectible-design">Explore collectible design <Arrow /></Link><Link className="text-link" href="#commission">Commission a piece <span aria-hidden="true">↗</span></Link></div><p className="hero-footnote">01 — Art for the space</p></div>
      <figure className="hero-media"><Image src={hero.image} alt={hero.alt} fill unoptimized preload sizes="(max-width: 900px) 100vw, 56vw" /><figcaption><span>Riverline</span><span>Dining table · AI concept visualization</span></figcaption></figure>
    </section>
    <div className="material-line" aria-label="Brand themes"><span>Liquid material</span><span aria-hidden="true">·</span><span>Natural expression</span><span aria-hidden="true">·</span><span>Personal meaning</span></div>
    <section id="selected-pieces" className="section selected-pieces" aria-labelledby="selected-title"><div className="section-heading"><div><p className="eyebrow">01 / Selected studies</p><h2 id="selected-title">A conversation<br />between <em>form & feeling.</em></h2></div><div className="section-aside"><p>Discover the opening furniture studies. Each is a fictional design concept, not a live offer or a completed commission.</p><Link href="/collectible-design" className="text-link">View the collection <Arrow /></Link></div></div><div className="concept-grid">{concepts.map((piece, index) => <ConceptCard key={piece.id} piece={piece} index={index} />)}</div></section>
    <section id="atelier" className="section atelier" aria-labelledby="atelier-title"><p className="eyebrow">A material-led point of view</p><h2 id="atelier-title">Fluid by nature.<br /><em>Personal by intention.</em></h2><div className="atelier-bottom"><p>RivyaLivingArt brings furniture, memories and personal objects into one artistic language. The scale changes. The attention to how an object feels in your world does not.</p><span className="atelier-note">One atelier.<br />Three scales of expression.</span></div></section>
    <section className="section worlds" aria-labelledby="worlds-title"><div className="section-heading"><div><p className="eyebrow">Discover your expression</p><h2 id="worlds-title">Three scales.<br /><em>One artistic language.</em></h2></div></div><div className="world-grid">{collections.map((collection) => <Link key={collection.slug} href={`/${collection.slug}`} className="world-card"><span className="eyebrow">{collection.number} / {collection.detail}</span><h3>{collection.title}</h3><p>{collection.description}</p><span className="text-link">{collection.label}<Arrow /></span></Link>)}</div></section>
    <section id="commission" className="section commission" aria-labelledby="commission-title"><p className="eyebrow">Begin with a possibility</p><h2 id="commission-title">Your space.<br />Your story. <em>Your piece.</em></h2><div><p>A table for a gathering place. An object with personal meaning. A direction that begins with you.</p><div className="development-note"><strong>Enquiry flow is in development.</strong><span>This preview does not send WhatsApp messages or collect personal information. The saved-request flow will be connected after the visual review.</span></div></div></section>
  </main>;
}
