import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { conceptsForTier, findConcept, type CatalogueQuery, type Concept } from "@/lib/catalogue";
import { buildInquiryConfig } from "@/lib/inquiry";
import type { InquiryMode } from "@/lib/inquiry-schema";
import { isVisualPreviewAllowed } from "@/lib/preview-mode";
import { InquiryWizard } from "@/components/inquiry-wizard";
import { Arrow } from "@/components/ui/arrow";
import styles from "./inquiry-entry.module.css";

const journeys = {
  commission: { tier: "LARGE", collection: "/collectible-design", label: "Collectible design", title: "Begin a commission study" },
  preserve: { tier: "MEDIUM", collection: "/memory-art", label: "Memory art", title: "A place for your story." },
  personalize: { tier: "SMALL", collection: "/personal-art", label: "Personal art & gifts", title: "A little more personal." },
} as const;

export function inquiryMetadata(mode: InquiryMode): Metadata {
  if (!isVisualPreviewAllowed(process.env)) return { title: "Not found" };
  return { title: `${journeys[mode].title} — Sample journey`, robots: { index: false, follow: false } };
}

/** Explicit malformed selections never fall back to a different sample product. */
function selectedConcept(mode: InquiryMode, query: CatalogueQuery): { piece: Concept | undefined; variant: string | undefined } {
  const { piece: slug, variant } = query;
  if (Array.isArray(slug) || Array.isArray(variant)) notFound();
  if (variant !== undefined && mode !== "personalize") notFound();
  if (slug === undefined) {
    if (variant !== undefined) notFound();
    return { piece: undefined, variant: undefined };
  }
  const piece = findConcept(slug);
  if (!piece || piece.tier !== journeys[mode].tier) notFound();
  if (variant !== undefined && (piece.tier !== "SMALL" || !piece.personal.variants.some((option) => option.id === variant))) notFound();
  return { piece, variant };
}

function InquiryPicker({ mode }: { mode: "preserve" | "personalize" }) {
  const journey = journeys[mode];
  const pieces = conceptsForTier(journey.tier);
  return <section className={styles.picker} aria-labelledby="inquiry-picker-title">
    <div className={styles.intro}>
      <p className="eyebrow">{journey.label} / A sample enquiry</p>
      <h1 id="inquiry-picker-title">{journey.title}</h1>
      <p>{mode === "preserve"
        ? "Start with a form that feels right for the memory. Each study has its own format, size and personal details to explore."
        : "Choose a small object, then explore its colour, personal details and gifting notes."}</p>
      <p className={styles.notice}>Fictional samples only. These forms make a local demo summary; nothing is sent or saved. Use invented details and safe sample references.</p>
    </div>
    <div className={styles.grid}>
      {pieces.map((piece, index) => <Link className={styles.card} key={piece.id} href={`/${mode}?piece=${encodeURIComponent(piece.slug)}`}>
        <div className={styles.cardTop}><span className="eyebrow">{String(index + 1).padStart(2, "0")} / Demo concept</span><Arrow /></div>
        <p className={styles.type}>{piece.type}</p>
        <h2>{piece.title}</h2>
        <p className={styles.description}>{piece.description}</p>
        <span className={styles.action}>{mode === "preserve" ? "Explore this preservation brief" : "Personalize this sample"}</span>
      </Link>)}
    </div>
  </section>;
}

export async function InquiryEntry({ mode, searchParams }: { mode: InquiryMode; searchParams: Promise<CatalogueQuery> }) {
  await connection();
  if (!isVisualPreviewAllowed(process.env)) notFound();
  const { piece, variant } = selectedConcept(mode, await searchParams);
  const journey = journeys[mode];
  return <main id="main-content" className={styles.page}>
    <nav className={styles.breadcrumb} aria-label="Breadcrumb">
      <Link href={journey.collection}>{journey.label}</Link><span aria-hidden="true">/</span>
      {piece ? <><Link href={`/pieces/${piece.slug}`}>{piece.title}</Link><span aria-hidden="true">/</span></> : null}
      <span aria-current="page">Sample enquiry</span>
    </nav>
    {!piece && mode !== "commission"
      ? <InquiryPicker mode={mode} />
      : <InquiryWizard key={`${mode}:${piece?.id ?? "bespoke"}:${variant ?? "default"}`} config={buildInquiryConfig(piece, mode, variant)} />}
  </main>;
}
