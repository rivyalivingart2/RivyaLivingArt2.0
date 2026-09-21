import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { findConcept } from "@/lib/catalogue";
import { isVisualPreviewAllowed } from "@/lib/preview-mode";

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
  return <main id="main-content" className="section piece-page"><div className="piece-media"><Image src={piece.image} alt={piece.alt} width={piece.width} height={piece.height} unoptimized /></div><div className="piece-copy"><Link className="text-link" href="/collectible-design">← Collectible design</Link><p className="eyebrow">{piece.type} / {piece.id}</p><h1>{piece.title}</h1><p>{piece.description}</p><dl className="piece-facts"><div><dt>Classification</dt><dd>Fictional design study</dd></div><div><dt>Visual</dt><dd>AI-generated concept</dd></div><div><dt>Specifications</dt><dd>Not verified or offered</dd></div></dl><div className="development-note"><strong>Concept, not catalogue inventory.</strong><span>No price, lead time or manufacturing claim is implied. This opening page demonstrates the visual direction; the full detail and enquiry flow follow later.</span></div><Link href="/#commission" className="button button-primary">About commissioning <span aria-hidden="true">↗</span></Link></div></main>;
}
