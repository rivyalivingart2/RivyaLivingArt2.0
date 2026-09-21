import Form from "next/form";
import Link from "next/link";
import { concepts } from "@/lib/catalogue";
import { articleWordCount, journalArticles, journalCategoryOptions, readMinutes, type JournalArticle } from "@/lib/journal";
import { ConceptCard } from "@/components/concept-card";
import { PublicPageHeader, PublicPageClosing, PublicSampleNotice } from "@/components/public-page";
import { ReadingProgress } from "@/components/reading-progress";
import { Arrow } from "@/components/ui/arrow";
import styles from "./journal.module.css";

type SearchParams = Record<string, string | string[] | undefined>;
const pageSize = 4;

function journalHref(category = "all", query = "", page = 1) {
  const parameters = new URLSearchParams();
  if (category !== "all") parameters.set("category", category);
  if (query) parameters.set("q", query);
  if (page > 1) parameters.set("page", String(page));
  return `/journal${parameters.size ? `?${parameters}` : ""}#journal-results`;
}

function sampleDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T12:00:00Z`));
}

function JournalCover({ article, featured = false }: { article: JournalArticle; featured?: boolean }) {
  return <div className={`${styles.cover} ${featured ? styles.featuredCover : ""}`} data-category={article.category} aria-hidden="true">
    <span className={styles.coverIndex}>{article.id.replace("DB", "")}</span>
    <div className={styles.coverForm}><span /><span /><span /></div>
    <div className={styles.coverCaption}><span>RivyaLivingArt / Journal</span><span>Editorial image pending</span></div>
  </div>;
}

function ArticleMeta({ article }: { article: JournalArticle }) {
  return <p className={styles.meta}><span>{article.category}</span><span aria-hidden="true">/</span><span>{readMinutes(article)} min read</span><span aria-hidden="true">/</span><span>Sample draft</span></p>;
}

export function JournalCard({ article }: { article: JournalArticle }) {
  return <article className={styles.card}>
    <Link href={`/journal/${article.slug}`} className={styles.cardLink}>
      <JournalCover article={article} />
      <div className={styles.cardCopy}><ArticleMeta article={article} /><h3>{article.title}</h3><p>{article.excerpt}</p><span className="text-link">Read the draft <Arrow /></span></div>
    </Link>
  </article>;
}

export function JournalSelection() {
  return <section className={`section ${styles.selection}`} aria-labelledby="home-journal-heading">
    <div className={styles.sectionHeading}><div><p className="eyebrow">Notes from a developing atelier</p><h2 id="home-journal-heading">A closer look.</h2></div><Link href="/journal" className="text-link">Enter the journal <Arrow /></Link></div>
    <p className={styles.selectionNotice}>Sample editorial drafts — fictional authorship, with owner review still to come.</p>
    <div className={styles.selectionGrid}>{journalArticles.slice(0, 3).map((article) => <JournalCard key={article.id} article={article} />)}</div>
  </section>;
}

export function JournalIndex({ searchParams }: { searchParams: SearchParams }) {
  const rawCategory = searchParams.category;
  const category = typeof rawCategory === "string" && journalCategoryOptions.some((item) => item.value === rawCategory) ? rawCategory : "all";
  const query = typeof searchParams.q === "string" ? searchParams.q.trim().slice(0, 120) : "";
  const invalidSelection = (rawCategory !== undefined && rawCategory !== "all" && category === "all") || Array.isArray(searchParams.q);
  const filtered = invalidSelection ? [] : journalArticles.filter((article) => (category === "all" || article.category === category) && (!query || `${article.title} ${article.excerpt} ${article.category}`.toLowerCase().includes(query.toLowerCase())));
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const rawPage = searchParams.page;
  const requestedPage = typeof rawPage === "string" && /^[1-9]\d{0,5}$/.test(rawPage) ? Number(rawPage) : 1;
  const page = Math.min(requestedPage, pageCount);
  const start = (page - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);
  const featured = category === "all" && !query && page === 1 ? items[0] : undefined;
  const cards = featured ? items.slice(1) : items;

  return <main id="main-content" className={styles.page}>
    <PublicPageHeader eyebrow="The journal / Notes from a developing atelier" title="A closer look." intro="On objects, the spaces around them and the questions that begin a commission. Reading for a more considered home." />
    <PublicSampleNotice>Sample editorial drafts for this preview. Authors and dates are demo labels; the studio has not approved these articles as published guidance.</PublicSampleNotice>
    <section id="journal-results" aria-labelledby="journal-heading" className={styles.indexSection}>
      <div className={styles.indexHeading}><div><p className="eyebrow">Ideas worth spending time with</p><h2 id="journal-heading">The reading room</h2></div><p>{journalArticles.length} sample articles<br />A journal taking shape.</p></div>
      <nav aria-label="Journal categories" className={styles.categories}>
        <Link href={journalHref("all", query)} aria-current={category === "all" && !invalidSelection ? "page" : undefined}>All notes</Link>
        {journalCategoryOptions.map((item) => <Link key={item.value} href={journalHref(item.value, query)} aria-current={category === item.value ? "page" : undefined}>{item.label}</Link>)}
      </nav>
      <Form action="/journal#journal-results" className={styles.search} key={`${category}:${query}`}>
        {category !== "all" && <input type="hidden" name="category" value={category} />}
        <label htmlFor="journal-query">Find a note<input id="journal-query" type="search" name="q" defaultValue={query} maxLength={120} placeholder="Try materials, scale or commission" /></label>
        <button className="button" type="submit">Search journal <Arrow /></button>
      </Form>
      <div className={styles.resultLine}><p>{filtered.length ? `Showing ${start + 1}–${Math.min(start + pageSize, filtered.length)} of ${filtered.length} sample articles` : "No matching sample articles"}</p>{(category !== "all" || query || invalidSelection) && <Link className="text-link" href="/journal#journal-results">Clear filters</Link>}</div>
      {featured && <article className={styles.featured}>
        <Link href={`/journal/${featured.slug}`} className={styles.featuredLink}>
          <JournalCover article={featured} featured />
          <div className={styles.featuredCopy}><p className="eyebrow">The opening note</p><ArticleMeta article={featured} /><h3>{featured.title}</h3><p>{featured.excerpt}</p><span className="text-link">Read the draft <Arrow /></span></div>
        </Link>
      </article>}
      {cards.length > 0 && <div className={styles.grid}>{cards.map((article) => <JournalCard key={article.id} article={article} />)}</div>}
      {filtered.length === 0 && <div className={styles.empty}><p className="eyebrow">A little room to explore</p><h3>{invalidSelection ? "That selection is not available." : "No note matches this search yet."}</h3><p>Try a broader word, choose another category or return to all six sample articles.</p><Link className="button" href="/journal#journal-results">Browse all notes <Arrow /></Link></div>}
      {pageCount > 1 && <nav aria-label="Journal pages" className={styles.pagination}>
        {page > 1 ? <Link href={journalHref(category, query, page - 1)} aria-label="Previous journal page">← Previous</Link> : <span aria-disabled="true">← Previous</span>}
        <div>{Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => <Link key={number} href={journalHref(category, query, number)} aria-current={page === number ? "page" : undefined} aria-label={`Journal page ${number}`}>{number}</Link>)}</div>
        {page < pageCount ? <Link href={journalHref(category, query, page + 1)} aria-label="Next journal page">Next →</Link> : <span aria-disabled="true">Next →</span>}
      </nav>}
    </section>
    <PublicPageClosing title="From reading to imagining." description="Explore furniture studies, then shape a fictional commission brief around the questions that matter to your space." href="/collectible-design" label="Explore collectible design" />
  </main>;
}

export function JournalArticlePage({ article }: { article: JournalArticle }) {
  const relatedProducts = article.relatedProductIds.flatMap((id) => {
    const piece = concepts.find((item) => item.id === id);
    return piece ? [piece] : [];
  });
  const relatedArticles = [...journalArticles.filter((item) => item.id !== article.id && item.category === article.category), ...journalArticles.filter((item) => item.id !== article.id && item.category !== article.category)].slice(0, 2);

  return <main id="main-content" className={styles.page}>
    <ReadingProgress articleId="journal-reading-body" />
    <nav aria-label="Breadcrumb" className={styles.breadcrumb}><Link className="text-link" href="/journal">← The journal</Link><span aria-hidden="true">/</span><span>{article.category}</span></nav>
    <article>
      <header className={styles.articleHeader}>
        <ArticleMeta article={article} /><h1>{article.title}</h1><p className={styles.standfirst}>{article.excerpt}</p>
        <div className={styles.byline}><p><span>Demo author</span>{article.author}</p><p><span>Sample date</span><time dateTime={article.sampleDate}>{sampleDate(article.sampleDate)}</time></p><p><span>Draft length</span>{articleWordCount(article).toLocaleString("en-IN")} words</p></div>
      </header>
      <PublicSampleNotice>Fictional editorial draft — not a published studio article. Sample author and date, with owner review still required. Product references below are demo studies.</PublicSampleNotice>
      <div className={styles.articleLayout}>
        <aside className={styles.contents}><nav aria-label="Article contents"><p className="eyebrow">In this note</p><ol>{article.sections.map((section) => <li key={section.id}><a href={`#${section.id}`}>{section.heading}</a></li>)}</ol></nav><p className={styles.contentsNote}>A few quiet minutes.<br />A more considered starting point.</p></aside>
        <div className={styles.prose} id="journal-reading-body">
          {article.sections.map((section) => <section key={section.id} id={section.id} aria-labelledby={`${section.id}-heading`}><h2 id={`${section.id}-heading`}>{section.heading}</h2>{section.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}{section.checklist && <ul>{section.checklist.map((item) => <li key={item}>{item}</li>)}</ul>}</section>)}
          <div className={styles.reviewNote}><p className="eyebrow">Before this draft can be published</p><ul>{article.reviewNotes.map((note) => <li key={note}>{note}</li>)}</ul><p>Editorial imagery is pending; no process photograph or completed client project is implied.</p></div>
        </div>
      </div>
    </article>
    {relatedProducts.length > 0 && <section className={styles.related} aria-labelledby="journal-products-heading"><div className={styles.sectionHeading}><div><p className="eyebrow">Ideas in three dimensions</p><h2 id="journal-products-heading">Studies in conversation.</h2></div><p>Fictional designs to accompany this note. All specifications and prices are samples.</p></div><div className={styles.productGrid}>{relatedProducts.map((piece, index) => <ConceptCard key={piece.id} piece={piece} index={index} />)}</div></section>}
    {relatedArticles.length > 0 && <section className={styles.related} aria-labelledby="journal-related-heading"><div className={styles.sectionHeading}><div><p className="eyebrow">Another page to turn</p><h2 id="journal-related-heading">Keep reading.</h2></div><Link className="text-link" href="/journal">All journal notes <Arrow /></Link></div><div className={styles.grid}>{relatedArticles.map((item) => <JournalCard key={item.id} article={item} />)}</div></section>}
    <PublicPageClosing title="Give an idea a little space." description="Use the sample commission journey to explore dimensions, materials and the practical questions behind a bespoke piece. Nothing is sent or saved." href="/commission" label="Try a commission brief" />
  </main>;
}
