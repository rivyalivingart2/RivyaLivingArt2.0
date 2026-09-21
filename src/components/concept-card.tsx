import Link from "next/link";
import Image from "next/image";
import type { Concept } from "@/lib/catalogue";
import { Arrow } from "@/components/ui/arrow";

export function ConceptCard({ piece, index = 0 }: { piece: Concept; index?: number }) {
  return <article className="concept-card"><Link className="concept-link" href={`/pieces/${piece.slug}`}>
    <div className="concept-image"><Image src={piece.image} alt={piece.alt} fill unoptimized sizes="(max-width: 760px) 92vw, 46vw" /><span className="image-index">0{index + 1}</span><span className="concept-label">AI concept</span></div>
    <div className="concept-heading"><div><p className="eyebrow">{piece.type}</p><h3>{piece.title}</h3></div><Arrow /></div><span className="text-link">Explore the study</span>
  </Link></article>;
}
