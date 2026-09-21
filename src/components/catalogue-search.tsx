import Link from "next/link";
import Form from "next/form";
import { concepts, type CatalogueQuery } from "@/lib/catalogue";
import { searchCatalogue, searchHref, searchTierOptions } from "@/lib/catalogue-search";
import { ConceptCard } from "@/components/concept-card";
import { PublicPageClosing, PublicPageHeader, PublicSampleNotice } from "@/components/public-page";
import styles from "./catalogue-search.module.css";

export function CatalogueSearch({ query }: { query: CatalogueQuery }) {
  const result = searchCatalogue(query);
  return <main id="main-content" className={styles.page}>
    <PublicPageHeader eyebrow="Across the collections" title="Find a starting point." intro="A shape, a material, a small detail. Explore the sample catalogue across furniture, memory art and personal gifts." />
    <Form action="/search" className={styles.form} key={`${result.term}:${result.tier}`}>
      <div><label htmlFor="catalogue-search">What are you drawn to?</label><input id="catalogue-search" name="q" type="search" maxLength={80} defaultValue={result.term} placeholder="Try table, resin or keepsake" /></div>
      <div><label htmlFor="catalogue-search-tier">Collection</label><select id="catalogue-search-tier" name="tier" defaultValue={result.tier}>{searchTierOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></div>
      <button type="submit" className="button button-primary">Find sample pieces <span aria-hidden="true">↗</span></button>
    </Form>
    <div className={styles.suggestions}><span>Or begin with</span>{["table", "wood", "flower", "gift"].map((term) => <Link key={term} href={searchHref(term, "all")}>{term}</Link>)}</div>
    <PublicSampleNotice>Search covers the {concepts.length} fictional source concepts currently in this preview. Prices, availability, dimensions and imagery are sample information; these are not live products.</PublicSampleNotice>
    {result.shortened && <p className={styles.searchNote}>Your search was shortened to the preview limit of 80 characters.</p>}
    <section aria-labelledby="search-results-heading">
      <div className={styles.resultsHeading}>
        <div><p className="eyebrow">{result.total} sample {result.total === 1 ? "result" : "results"}</p><h2 id="search-results-heading">{result.term ? <>For “{result.term}”</> : "The current studies."}</h2></div>
        <div><p>{result.total ? `${result.first}–${result.last} of ${result.total}${result.tier === "all" ? " · furniture appears first" : ""}` : "No matching studies"}</p>{(result.term || result.tier !== "all") && <Link className="text-link" href="/search">Clear search & filters <span aria-hidden="true">↗</span></Link>}</div>
      </div>
      {result.total ? <div className={styles.grid}>{result.items.map((piece, index) => <ConceptCard key={piece.id} piece={piece} index={result.first + index - 1} />)}</div>
        : <div className={styles.empty}><p className="eyebrow">A different direction</p><h3>No sample pieces matched.</h3><p>Try one material or object, such as “resin” or “table”, or open all three collections. The full catalogue is still taking shape.</p><Link className="button button-primary" href="/search">Explore all sample pieces <span aria-hidden="true">↗</span></Link></div>}
      {result.pages > 1 && <nav className={styles.pagination} aria-label="Search result pages">
        {result.page > 1 ? <Link href={searchHref(result.term, result.tier, result.page - 1)}>← Previous</Link> : <span />}
        <span aria-current="page">Page {result.page} of {result.pages}</span>
        {result.page < result.pages ? <Link href={searchHref(result.term, result.tier, result.page + 1)}>Next →</Link> : <span />}
      </nav>}
    </section>
    <PublicPageClosing title="Still finding your direction?" description="The sample commission brief can begin with an idea, even when a particular piece has not been chosen." href="/commission" label="Explore a commission brief" />
  </main>;
}
