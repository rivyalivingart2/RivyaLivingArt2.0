import Link from "next/link";
import { ConceptCard } from "@/components/concept-card";
import { PublicPageHeader, PublicPageClosing } from "@/components/public-page";
import { FaqAnswers, JournalReferenceCard, WorldIntro } from "@/components/content-section-public-parts";
import { MediaAssetFigure } from "@/components/studio-media-figure";
import { TestimonialQuote } from "@/components/testimonial";
import { Arrow } from "@/components/ui/arrow";
import type { ContentReferences } from "@/lib/content-contracts";
import { planningSteps } from "@/lib/editorial";
import { safeSectionHref, sectionReferenceOptions, sectionRegistry, type PageSection } from "@/lib/content-sections";
import styles from "./content-sections.module.css";

function SectionLink({ section }: { section: PageSection }) {
  const href = safeSectionHref(section.fields.href);
  return href && section.fields.linkLabel?.trim() ? <Link className="text-link" href={href}>{section.fields.linkLabel}<Arrow /></Link> : null;
}

/** Code-owned renderers consume data only; draft JSON never becomes HTML, CSS or executable code. */
export function ContentSections({ sections, references }: { sections: readonly PageSection[]; references: ContentReferences }) {
  return <div className={styles.surface}>{sections.filter((section) => !section.hidden).map((section) => {
    if (!Object.hasOwn(sectionRegistry, section.type) || section.schemaVersion !== 1) return <div key={section.id} className={styles.unavailable}>Unsupported section. Replace it with an approved template in the editor.</div>;
    const definition = sectionRegistry[section.type];
    const { fields } = section;
    const options = sectionReferenceOptions(section.type, references);
    const missing = fields.referenceIds.filter((id) => !options.some((option) => option.id === id));
    const heading = <div className={styles.sectionHeading}><p className="eyebrow">{fields.eyebrow}</p><h2>{fields.heading}</h2><p>{fields.body}</p></div>;
    let content;
    switch (section.type) {
      case "hero": content = <div className={styles.hero} data-split={section.variant === "split" && Boolean(fields.media)}><PublicPageHeader eyebrow={fields.eyebrow ?? "RivyaLivingArt"} title={fields.heading} intro={fields.body} headingLevel={2}><SectionLink section={section} /></PublicPageHeader>{fields.media && <MediaAssetFigure assets={references.media} reference={fields.media} />}</div>; break;
      case "product-selection": content = <>{heading}<div className={styles.productGrid} data-variant={section.variant}>{fields.referenceIds.flatMap((id) => { const piece = references.products.find((item) => item.id === id); return piece ? [<ConceptCard key={piece.id} piece={piece} idPrefix={`section-${section.id}-`} />] : []; })}</div><SectionLink section={section} /></>; break;
      case "category-discovery":
      case "three-world-intro": content = <>{heading}<WorldIntro variant={section.variant} /></>; break;
      case "material-story":
      case "project-story": content = <div className={styles.story} data-split={section.variant === "split" && Boolean(fields.media)}><div>{heading}<p className={styles.sampleLabel}>{section.type === "project-story" ? "Fictional project study — not a completed commission." : "Sample material direction — composition and suitability require owner confirmation."}</p><SectionLink section={section} /></div>{fields.media && <MediaAssetFigure assets={references.media} reference={fields.media} />}</div>; break;
      case "commission-process": content = <>{heading}<ol className={styles.steps} data-variant={section.variant}>{planningSteps.map((step) => <li key={step.number}><span>{step.number}</span><div><h3>{step.title}</h3><p>{step.body}</p>{section.variant !== "compact" && <blockquote>{step.question}</blockquote>}</div></li>)}</ol><SectionLink section={section} /></>; break;
      case "testimonial": content = <>{heading}<div className={styles.quoteGrid} data-variant={section.variant}>{fields.referenceIds.flatMap((id) => { const testimonial = references.testimonials.find((item) => item.id === id); return testimonial ? [<TestimonialQuote key={testimonial.id} testimonial={testimonial} />] : []; })}</div></>; break;
      case "faq": content = <>{heading}<FaqAnswers idPrefix={`section-${section.id}-`} items={fields.referenceIds.flatMap((id) => { const item = references.faqs.find((faq) => faq.id === id); return item ? [item] : []; })} /><SectionLink section={section} /></>; break;
      case "journal-selection": content = <>{heading}<div className={styles.journalGrid} data-variant={section.variant}>{fields.referenceIds.flatMap((id) => { const article = references.articles.find((item) => item.id === id); return article ? [<JournalReferenceCard key={article.id} article={article} />] : []; })}</div><SectionLink section={section} /></>; break;
      case "contact": content = safeSectionHref(fields.href) && fields.linkLabel?.trim() ? <PublicPageClosing title={fields.heading} description={fields.body} href={safeSectionHref(fields.href)!} label={fields.linkLabel} /> : <>{heading}<p className={styles.unavailable}>Add a valid internal destination and link label in this section.</p></>; break;
    }
    return <section key={section.id} className={styles.section} data-section-type={section.type} aria-label={fields.heading || definition.label}>{content}{definition.referenceKind && !fields.referenceIds.length && <p className={styles.unavailable}>Choose a {definition.referenceKind} reference in this section’s editor.</p>}{missing.length > 0 && <p className={styles.unavailable}>Unavailable references: {missing.join(", ")}. Remove or replace them in this section’s editor.</p>}</section>;
  })}</div>;
}
