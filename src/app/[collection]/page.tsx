import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { findCollection, conceptsForTier } from "@/lib/catalogue";
import { isVisualPreviewAllowed } from "@/lib/preview-mode";
import { ConceptCard } from "@/components/concept-card";

type Props = { params: Promise<{ collection: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!isVisualPreviewAllowed(process.env)) return { title: "Not found" };
  const collection = findCollection((await params).collection);
  return { title: collection?.label ?? "Not found" };
}
export default async function CollectionPage({ params }: Props) {
  await connection();
  if (!isVisualPreviewAllowed(process.env)) notFound();
  const collection = findCollection((await params).collection);
  if (!collection) notFound();
  const pieces = conceptsForTier(collection.tier);
  return <main id="main-content" className="section collection-page"><p className="eyebrow">{collection.number} / {collection.detail}</p><h1>{collection.title}</h1><p className="page-intro">{collection.description}</p>{pieces.length ? <><p className="muted">{pieces.length} opening concept studies · fictional preview, not inventory</p><div className="concept-grid">{pieces.map((piece, index) => <ConceptCard key={piece.id} piece={piece} index={index} />)}</div></> : <div className="development-note"><strong>This collection is taking shape.</strong><p>Its dedicated imagery and product journey will be added in the next frontend slices. No products are being represented as available yet.</p><Link href="/collectible-design" className="text-link">Explore the furniture studies <span aria-hidden="true">↗</span></Link></div>}</main>;
}
