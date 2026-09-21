import Link from "next/link";
import { Arrow } from "@/components/ui/arrow";
import { editorialWorlds } from "@/lib/editorial";
import type { FaqRecord } from "@/lib/faqs";
import type { ArticleReference } from "@/lib/content-contracts";
import faqStyles from "./craft-faq.module.css";
import styles from "./content-sections.module.css";

/** Shared with the public About page. The order and destinations are code-owned. */
export function WorldIntro({ variant = "cards" }: { variant?: string }) {
  return <div className={styles.worlds} data-variant={variant}>{editorialWorlds.map((world) => <article className={styles.world} key={world.number}>
    <p className="eyebrow">{world.number} / {world.scale}</p><h3>{world.title}</h3><p>{world.description}</p><Link href={world.href} className="text-link">{world.label}<Arrow /></Link>
  </article>)}</div>;
}

/** Native disclosure used by both public FAQ pages and controlled draft sections. */
export function FaqAnswers({ items, idPrefix = "" }: { items: readonly FaqRecord[]; idPrefix?: string }) {
  return <div className={faqStyles.answers}>{items.map((item) => <details id={`${idPrefix}${item.id}`} key={item.id} className={faqStyles.answer}>
    <summary><span className={faqStyles.question}>{item.question}</span><span className={faqStyles.toggle} aria-hidden="true" /></summary>
    <div className={faqStyles.answerBody}>
      <p className={faqStyles.draftLabel}>Sample answer · owner review pending</p><p>{item.answer}</p>
      {item.previewNote && <p className={faqStyles.previewNote}><strong>In this preview</strong>{item.previewNote}</p>}
      {item.references.length > 0 && <ul className={faqStyles.references} aria-label="Related pages">{item.references.map((reference) => <li key={reference.href}><Link href={reference.href}>{reference.label}<span aria-hidden="true">↗</span></Link></li>)}</ul>}
    </div>
  </details>)}</div>;
}

/** Lightweight source reference; no article bodies travel with a section picker. */
export function JournalReferenceCard({ article }: { article: ArticleReference }) {
  return <article className={styles.journalCard}><p className="eyebrow">{article.category} / {article.id}</p><h3><Link href={`/journal/${article.slug}`}>{article.title}</Link></h3><p>{article.excerpt}</p><p className={styles.sampleLabel}>Sample editorial draft · owner review pending</p><Link className="text-link" href={`/journal/${article.slug}`}>Read the draft <Arrow /></Link></article>;
}
