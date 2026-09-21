import type { ReactNode } from "react";
import Form from "next/form";
import Link from "next/link";
import { MemoryProductCard, PersonalArtProductCard } from "@/components/concept-card";
import { Arrow } from "@/components/ui/arrow";
import {
  memoryHref, memoryOccasionOptions, personalColourOptions, personalFestivalOptions,
  personalHref, personalRecipientOptions, preservationOptions, queryMemory, queryPersonal,
  tierSortOptions, type CatalogueQuery,
} from "@/lib/catalogue";
import styles from "./art-collections.module.css";

type FilterField = Readonly<{
  name: string; label: string; value: string;
  options: readonly Readonly<{ value: string; label: string }>[];
}>;

function CollectionFilters({ action, fields }: { action: string; fields: readonly FilterField[] }) {
  return (
    <details className={styles.filterPanel} open>
      <summary>Refine the collection <span aria-hidden="true" /></summary>
      <Form key={JSON.stringify(fields.map((field) => field.value))} action={action} className={styles.filters}>
        {fields.map((field) => (
          <label key={field.name}>{field.label}
            <select name={field.name} defaultValue={field.value}>
              {field.options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
        ))}
        <button type="submit" className="button button-primary">Apply filters <Arrow /></button>
      </Form>
    </details>
  );
}

function CollectionResults({ heading, base, total, page, pageSize, pageCount, filtered, href, filters, children, emptyCopy }: {
  heading: string; base: string; total: number; page: number; pageSize: number; pageCount: number;
  filtered: boolean; href: (page: number) => string; filters: ReactNode; children: ReactNode; emptyCopy: string;
}) {
  const first = (page - 1) * pageSize;
  const firstPageLink = Math.max(1, Math.min(page - 1, pageCount - 2));
  const visiblePages = Array.from({ length: Math.min(3, pageCount) }, (_, index) => firstPageLink + index);
  return (
    <section id="collection-results" aria-labelledby="collection-heading" className={styles.results}>
      <div className={styles.resultsHeading}>
        <h2 id="collection-heading">{heading}</h2>
        <p>Demo collection — sample sizes, options and prices. No live offers or available stock.</p>
      </div>
      {filters}
      <div className={styles.resultSummary}>
        <p role="status">{total ? `Showing ${first + 1}–${Math.min(first + pageSize, total)} of ${total} studies` : "No matching studies"}</p>
        {filtered && <Link className="text-link" href={`${base}#collection-results`}>Reset filters <span aria-hidden="true">↗</span></Link>}
      </div>
      {total ? children : (
        <div className={styles.emptyState}>
          <p className="eyebrow">Another way to begin</p>
          <h3>No studies match this combination.</h3>
          <p>{emptyCopy}</p>
          <Link href={`${base}#collection-results`} className="button">View all studies <Arrow /></Link>
        </div>
      )}
      {pageCount > 1 && (
        <nav aria-label="Collection pages" className={styles.pagination}>
          {page > 1 ? <Link href={`${href(page - 1)}#collection-results`} rel="prev">← Previous</Link> : <span aria-disabled="true">← Previous</span>}
          <div className={styles.pageNumbers}>{visiblePages.map((number) => <Link key={number} href={`${href(number)}#collection-results`} aria-label={`Page ${number}`} aria-current={page === number ? "page" : undefined}>{number}</Link>)}</div>
          {page < pageCount ? <Link href={`${href(page + 1)}#collection-results`} rel="next">Next →</Link> : <span aria-disabled="true">Next →</span>}
        </nav>
      )}
    </section>
  );
}

export function MemoryCollection({ searchParams }: { searchParams: CatalogueQuery }) {
  const result = queryMemory(searchParams);
  const { filters } = result;
  return (
    <main id="main-content" className={`section collection-page ${styles.page}`} data-collection="memory">
      <header className={styles.memoryIntroduction}>
        <div>
          <p className="eyebrow">02 / Preservation &amp; celebration</p>
          <h1>Art for the memory.</h1>
          <p className={styles.introCopy}>A flower from a day you return to. A small detail with a long story. Explore keepsake studies that begin with what matters to you.</p>
        </div>
        <div className={styles.memoryAside}>
          <p>The things we keep.<br /><em>The stories they carry.</em></p>
          <span>Fictional concept studies for a future guided preservation journey.</span>
        </div>
      </header>

      <ol className={styles.memoryJourney} aria-label="Considering a memory piece">
        <li><span aria-hidden="true">01</span><div><h2>Begin with a story</h2><p>An occasion, a flower or a keepsake that holds meaning.</p></div></li>
        <li><span aria-hidden="true">02</span><div><h2>Explore its form</h2><p>Consider a frame, a quiet object or a celebration piece.</p></div></li>
        <li><span aria-hidden="true">03</span><div><h2>Review before sending</h2><p>Suitability and studio instructions must be confirmed first.</p></div></li>
      </ol>

      <CollectionResults
        {...result} heading="The memory collection" base="/memory-art"
        filtered={filters.occasion !== "all" || filters.preservation !== "all" || filters.sort !== "featured"}
        href={(page) => memoryHref(filters, page)}
        emptyCopy="Try another occasion or preservation type. These first sample studies are only the beginning of the collection."
        filters={<CollectionFilters action="/memory-art#collection-results" fields={[
          { name: "occasion", label: "Occasion", value: filters.occasion, options: memoryOccasionOptions },
          { name: "preservation", label: "Preservation", value: filters.preservation, options: preservationOptions },
          { name: "sort", label: "Sort by", value: filters.sort, options: tierSortOptions },
        ]} />}
      >
        <div className={styles.memoryGrid}>{result.items.map((piece, index) => <MemoryProductCard key={piece.id} piece={piece} index={(result.page - 1) * result.pageSize + index} />)}</div>
      </CollectionResults>

      <aside className={styles.memoryNote} aria-labelledby="memory-note-heading">
        <p className="eyebrow">A thoughtful first step</p>
        <h2 id="memory-note-heading">Your story comes first.</h2>
        <p>Each study has its own preservation guidance and sample personalization options. Begin there before preparing any physical materials. A concept does not establish suitability, shipping instructions or a preservation guarantee.</p>
      </aside>
    </main>
  );
}

export function PersonalArtCollection({ searchParams }: { searchParams: CatalogueQuery }) {
  const result = queryPersonal(searchParams);
  const { filters } = result;
  return (
    <main id="main-content" className={`section collection-page ${styles.page} ${styles.personalPage}`} data-collection="personal">
      <header className={styles.personalIntroduction}>
        <div>
          <p className="eyebrow">03 / Objects &amp; personal gifts</p>
          <h1>Art for the person.</h1>
          <p className={styles.introCopy}>A considered gift. An everyday companion. Explore small objects through colour, character and the details that make them personal.</p>
        </div>
        <div className={styles.personalAside}><p>Small gestures,<br /><em>particular details.</em></p><span>Sample variants and personalization directions, ready to explore.</span></div>
      </header>

      <nav aria-label="Gifts by recipient" className={styles.recipients}>
        <span className="eyebrow">A thought for</span>
        {personalRecipientOptions.filter((option) => option.value !== "all").map((option) => (
          <Link key={option.value} href={`${personalHref({ recipient: option.value })}#collection-results`} aria-current={filters.recipient === option.value ? "true" : undefined}>{option.label} <Arrow /></Link>
        ))}
      </nav>

      <CollectionResults
        {...result} heading="The gifting collection" base="/personal-art"
        filtered={filters.recipient !== "all" || filters.colour !== "all" || filters.festival !== "all" || filters.sort !== "featured"}
        href={(page) => personalHref(filters, page)}
        emptyCopy="Try a different recipient, colour or occasion. More personal objects will join these first sample studies."
        filters={<CollectionFilters action="/personal-art#collection-results" fields={[
          { name: "recipient", label: "Recipient", value: filters.recipient, options: personalRecipientOptions },
          { name: "colour", label: "Colour", value: filters.colour, options: personalColourOptions },
          { name: "festival", label: "Festival", value: filters.festival, options: personalFestivalOptions },
          { name: "sort", label: "Sort by", value: filters.sort, options: tierSortOptions },
        ]} />}
      >
        <div className={styles.personalGrid}>{result.items.map((piece) => <PersonalArtProductCard key={piece.id} piece={piece} />)}</div>
      </CollectionResults>

      <aside className={styles.personalNote} aria-labelledby="personal-note-heading">
        <div><p className="eyebrow">Choose the details</p><h2 id="personal-note-heading">A little more personal.</h2></div>
        <p>Each object has its own sample variants and permitted personal details. Explore its guidance to see the possibilities; availability and any real request will need a studio discussion.</p>
      </aside>
    </main>
  );
}
