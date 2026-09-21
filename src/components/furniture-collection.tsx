import Link from "next/link";
import Form from "next/form";
import { ConceptCard } from "@/components/concept-card";
import { SystemState } from "@/components/system-state";
import { Arrow } from "@/components/ui/arrow";
import {
  catalogueHref,
  categoryOptions,
  materialOptions,
  queryFurniture,
  sizeOptions,
  sortOptions,
} from "@/lib/catalogue";
import styles from "./furniture-collection.module.css";

type SearchParams = Record<string, string | string[] | undefined>;

const categoryNotes: Record<string, string> = {
  tables: "Gathering, working, living.",
  seating: "A sculptural place to pause.",
  consoles: "An arrival, thoughtfully framed.",
  installations: "Presence beyond the everyday.",
};

export function FurnitureCollection({ searchParams }: { searchParams: SearchParams }) {
  const result = queryFurniture(searchParams);
  const { filters } = result;
  const first = (result.page - 1) * result.pageSize;
  const firstPageLink = Math.max(1, Math.min(result.page - 1, result.pageCount - 2));
  const visiblePages = Array.from({ length: Math.min(3, result.pageCount) }, (_, index) => firstPageLink + index);
  const filtered = filters.category !== "all" || filters.material !== "all" || filters.size !== "all";

  return (
    <main id="main-content" className={`section collection-page ${styles.page}`}>
      <header className={styles.introduction}>
        <div>
          <p className="eyebrow">01 / Furniture &amp; spatial art</p>
          <h1>Art for the space.</h1>
          <p className={styles.introCopy}>Expressive grain. Quiet silhouettes. Resin that catches the light. Explore furniture studies shaped around the way a space feels.</p>
        </div>
        <div className={styles.introAside}>
          <span className="eyebrow">The collectible studies</span>
          <p>From a room&apos;s centrepiece to its smallest considered corner.</p>
          <span className={styles.demoNotice}>Demo collection — sample content and concept imagery. Not a live offer.</span>
        </div>
      </header>

      <nav aria-label="Furniture categories" className={styles.categories}>
        {categoryOptions.filter((option) => option.value !== "all").map((category, index) => (
          <Link
            key={category.value}
            href={`${catalogueHref({ category: category.value })}#collection-results`}
            aria-current={filters.category === category.value ? "true" : undefined}
            className={styles.category}
          >
            <span className={styles.categoryTop}><span className="eyebrow">0{index + 1}</span><Arrow /></span>
            <span className={styles.categoryName}>{category.label}</span>
            <span className={styles.categoryNote}>{categoryNotes[category.value]}</span>
          </Link>
        ))}
      </nav>

      <section id="collection-results" aria-labelledby="collection-heading" className={styles.results}>
        <div className={styles.resultsHeading}>
          <div><p className="eyebrow">A study in form &amp; material</p><h2 id="collection-heading">The collection</h2></div>
          <p className={styles.sampleNote}>Dimensions, finishes and prices are fictional examples for this preview.</p>
        </div>

        <details className={styles.filterPanel} open>
          <summary>Refine the collection <span aria-hidden="true" /></summary>
          <Form
            key={JSON.stringify(filters)}
            action="/collectible-design#collection-results"
            className={styles.filters}
          >
            <label>Category<select name="category" defaultValue={filters.category}>{categoryOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
            <label>Material<select name="material" defaultValue={filters.material}>{materialOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
            <label>Size<select name="size" defaultValue={filters.size}>{sizeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
            <label>Sort by<select name="sort" defaultValue={filters.sort}>{sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
            <button className="button button-primary" type="submit">Apply filters <Arrow /></button>
          </Form>
        </details>

        <div className={styles.resultSummary}>
          <p role="status">{result.total > 0 ? `Showing ${first + 1}–${Math.min(first + result.pageSize, result.total)} of ${result.total} studies` : "No matching studies"}</p>
          {(filtered || filters.sort !== "featured") && <Link className="text-link" href="/collectible-design#collection-results">Reset filters <span aria-hidden="true">↗</span></Link>}
        </div>

        {result.items.length > 0 ? (
          <div className="concept-grid">
            {result.items.map((piece, index) => <ConceptCard key={piece.id} piece={piece} index={first + index} />)}
          </div>
        ) : (
          <SystemState kind="empty" compact title="No studies match this combination." description="Try another material or a broader size. This growing sample collection shows only a small part of the possible directions." actionHref="/collectible-design#collection-results" actionLabel="View all studies" />
        )}

        {result.pageCount > 1 && (
          <nav aria-label="Collection pages" className={styles.pagination}>
            {result.page > 1 ? <Link href={`${catalogueHref(filters, result.page - 1)}#collection-results`} rel="prev">← Previous</Link> : <span aria-disabled="true">← Previous</span>}
            <div className={styles.pageNumbers}>{visiblePages.map((page) => <Link key={page} href={`${catalogueHref(filters, page)}#collection-results`} aria-label={`Page ${page}`} aria-current={result.page === page ? "page" : undefined}>{page}</Link>)}</div>
            {result.page < result.pageCount ? <Link href={`${catalogueHref(filters, result.page + 1)}#collection-results`} rel="next">Next →</Link> : <span aria-disabled="true">Next →</span>}
          </nav>
        )}
      </section>

      <section className={styles.commission} aria-labelledby="collection-commission-heading">
        <div><p className="eyebrow">Your space. Your starting point.</p><h2 id="collection-commission-heading">A piece with a place in mind.</h2></div>
        <div><p>A room, a material, a particular feeling. Explore a sample commissioning brief with fictional details.</p><Link className="text-link" href="/commission">Explore commissioning <Arrow /></Link></div>
      </section>
    </main>
  );
}
