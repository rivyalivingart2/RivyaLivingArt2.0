"use client";

import Form from "next/form";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ConceptImage } from "@/components/concept-image";
import { formatPrice, type CatalogueQuery, type Concept } from "@/lib/catalogue";
import {
  queryStudioCatalogue, studioCatalogueHref, studioDraftLabels, studioDraftOptions,
  studioMediaOptions, studioPriceLabels, studioSortOptions, studioTierOptions,
  type StudioCatalogueResult,
} from "@/lib/studio-catalogue";
import styles from "./studio-products.module.css";

type Props = { products: readonly Concept[]; query: CatalogueQuery };

export function StudioProducts({ products, query }: Props) {
  const result = queryStudioCatalogue(products, query);
  // Changing the URL query/page remounts local selection and staged review state.
  const scopeKey = JSON.stringify([result.filters, result.page, result.items.map((piece) => piece.id)]);
  return <ProductWorkspace key={scopeKey} result={result} sourceTotal={products.length} />;
}

function ProductWorkspace({ result, sourceTotal }: { result: StudioCatalogueResult; sourceTotal: number }) {
  const { filters, items } = result;
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [staged, setStaged] = useState<readonly string[]>([]);
  const [confirmation, setConfirmation] = useState<readonly string[] | null>(null);
  const [message, setMessage] = useState("");
  const confirmationRef = useRef<HTMLElement>(null);
  const stageButtonRef = useRef<HTMLButtonElement>(null);
  const selectPageRef = useRef<HTMLInputElement>(null);
  const allSelected = items.length > 0 && items.every((piece) => selected.includes(piece.id));
  const first = (result.page - 1) * result.pageSize;
  const confirmedProducts = items.filter((piece) => confirmation?.includes(piece.id));

  useEffect(() => {
    if (selectPageRef.current) selectPageRef.current.indeterminate = selected.length > 0 && !allSelected;
  }, [selected, allSelected]);
  useEffect(() => { if (confirmation) confirmationRef.current?.focus(); }, [confirmation]);

  function selectRow(id: string) {
    setSelected((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id]);
    setConfirmation(null);
    setMessage("");
  }

  function cancelConfirmation() {
    setConfirmation(null);
    stageButtonRef.current?.focus();
  }

  function stageReview() {
    const names = confirmedProducts.map((piece) => `${piece.id} ${piece.title}`).join(", ");
    setStaged((current) => [...new Set([...current, ...confirmedProducts.map((piece) => piece.id)])]);
    setMessage(`Review staged locally for ${names}. No record was saved or sent for review. Refreshing or changing filters clears this staging.`);
    setConfirmation(null);
    stageButtonRef.current?.focus();
  }

  function rowCheckbox(piece: Concept, presentation: "table" | "card") {
    return <label className={styles.checkbox}>
      <input id={`${presentation}-${piece.id}`} type="checkbox" checked={selected.includes(piece.id)} onChange={() => selectRow(piece.id)} aria-label={`Select ${piece.id} ${piece.title}`} />
      {presentation === "card" && <span>Select {piece.id}</span>}
    </label>;
  }

  function productIdentity(piece: Concept) {
    return <Link className={styles.identity} href={`/studio/products/${piece.id}`}>
      <span className={styles.thumbnail}><ConceptImage src={piece.image} alt={piece.alt} fill compact sizes="64px" /></span>
      <span><strong>{piece.title}</strong><span>{piece.id} · {piece.type}</span></span>
    </Link>;
  }

  function productStatus(piece: Concept) {
    return <div className={styles.statuses}>
      <span className={styles.demoBadge}>Demo visible</span>
      <span className={styles.draftBadge} data-status={piece.workingDraftStatus}>{studioDraftLabels[piece.workingDraftStatus]}</span>
      {staged.includes(piece.id) && <span className={styles.stagedBadge}>Review staged locally</span>}
    </div>;
  }

  function mediaStatus(piece: Concept) {
    return <><span>{piece.mediaStatus === "CONCEPT_VISUAL" ? "Concept visual" : "Visual pending"}</span><small>Rights approval unverified</small></>;
  }

  function price(piece: Concept) {
    return <><span className={styles.money}>{formatPrice(piece)}</span><small>{studioPriceLabels[piece.priceType]}</small></>;
  }

  return <section className={styles.workspace} aria-labelledby="studio-products-heading">
    <header className={styles.heading}>
      <div><p className="eyebrow">Catalogue / Demo dataset</p><h1 id="studio-products-heading">Products<span>{sourceTotal}</span></h1><p>Furniture, memories and personal objects. Every record here is a labelled source fixture.</p></div>
      <Link className={styles.primaryAction} href="/studio/products/new"><span aria-hidden="true">+</span> Create local draft</Link>
    </header>

    <div className={styles.notice}><span className={styles.noticeMark} aria-hidden="true" /><p><strong>Demo workspace.</strong> Visibility and draft labels describe source fixtures, not a live catalogue. Rights and owners have not been approved. Local staging disappears when you leave, refresh or change filters.</p></div>

    <Form action="/studio/products" className={styles.filters}>
      <label className={styles.search}>Search products<input type="search" name="q" defaultValue={filters.q} maxLength={120} placeholder="Title, fixture ID or object type" autoComplete="off" /></label>
      <label>Tier<select name="tier" defaultValue={filters.tier}>{studioTierOptions.map((item) => <option value={item.value} key={item.value}>{item.label}</option>)}</select></label>
      <label>Working draft<select name="draft" defaultValue={filters.draft}>{studioDraftOptions.map((item) => <option value={item.value} key={item.value}>{item.label}</option>)}</select></label>
      <label>Media<select name="media" defaultValue={filters.media}>{studioMediaOptions.map((item) => <option value={item.value} key={item.value}>{item.label}</option>)}</select></label>
      <label>Sort<select name="sort" defaultValue={filters.sort}>{studioSortOptions.map((item) => <option value={item.value} key={item.value}>{item.label}</option>)}</select></label>
      <button type="submit" className={styles.filterButton}>Apply filters</button>
      <Link href="/studio/products" className={styles.reset}>Reset</Link>
    </Form>

    <div className={styles.resultBar}>
      <p role="status">{result.total ? `${first + 1}–${Math.min(first + result.pageSize, result.total)} of ${result.total} matching products` : "No matching products"}</p>
      <span>Source fixtures · {result.pageSize} per page</span>
    </div>

    {items.length > 0 ? <>
      <div className={styles.selectionBar}>
        <label className={styles.checkbox}><input ref={selectPageRef} type="checkbox" checked={allSelected} onChange={() => { setSelected(allSelected ? [] : items.map((piece) => piece.id)); setConfirmation(null); setMessage(""); }} /><span>Select this page ({items.length})</span></label>
        <p>{selected.length} selected on page {result.page}. Selection never includes other pages.</p>
        <button ref={stageButtonRef} type="button" disabled={selected.length === 0} onClick={() => setConfirmation([...selected])}>Stage local review</button>
      </div>

      {confirmation && <section className={styles.confirmation} ref={confirmationRef} tabIndex={-1} aria-labelledby="bulk-review-heading">
        <p className="eyebrow">Confirm selected records</p><h2 id="bulk-review-heading">Stage a local review?</h2>
        <p>Only these {confirmedProducts.length} records on page {result.page} will receive a temporary review marker. Their source status will stay visible.</p>
        <ul>{confirmedProducts.map((piece) => <li key={piece.id}><span>{piece.id}</span> {piece.title}</li>)}</ul>
        <div><button type="button" onClick={stageReview}>Confirm local staging</button><button type="button" onClick={cancelConfirmation}>Cancel</button></div>
        <p className={styles.finePrint}>This does not save, publish, archive, notify a reviewer or change the catalogue.</p>
      </section>}
      <p className={styles.localMessage} role="status">{message}</p>

      <div className={styles.tableScroll} role="region" aria-label="Demo products table, scroll horizontally for all columns" tabIndex={0}>
        <table className={styles.table}>
          <caption className={styles.srOnly}>Demo products. Select only records on this page. Each sample price is displayed in INR from its stored minor-unit amount.</caption>
          <thead><tr><th scope="col"><span className={styles.srOnly}>Select</span></th><th scope="col">Product</th><th scope="col">Tier</th><th scope="col">Visibility / draft</th><th scope="col">Media / rights</th><th scope="col">Sample price</th><th scope="col">Lead time</th><th scope="col">Owner</th></tr></thead>
          <tbody>{items.map((piece) => <tr key={piece.id} data-selected={selected.includes(piece.id) || undefined}>
            <td>{rowCheckbox(piece, "table")}</td><th scope="row">{productIdentity(piece)}</th><td><span className={styles.tier} data-tier={piece.tier}>{piece.tier}</span></td><td>{productStatus(piece)}</td><td>{mediaStatus(piece)}</td><td>{price(piece)}</td><td className={styles.lead}>{piece.leadTime.minWeeks}–{piece.leadTime.maxWeeks} weeks<small>Sample estimate</small></td><td><span className={styles.owner}>Unassigned</span></td>
          </tr>)}</tbody>
        </table>
      </div>

      <ul className={styles.mobileCards} aria-label="Demo products">{items.map((piece) => <li key={piece.id} data-selected={selected.includes(piece.id) || undefined}>
        <div className={styles.cardTop}>{rowCheckbox(piece, "card")}<span className={styles.tier} data-tier={piece.tier}>{piece.tier}</span></div>
        {productIdentity(piece)}{productStatus(piece)}
        <dl><div><dt>Sample price</dt><dd>{price(piece)}</dd></div><div><dt>Lead time</dt><dd>{piece.leadTime.minWeeks}–{piece.leadTime.maxWeeks} weeks</dd></div><div><dt>Media / rights</dt><dd>{mediaStatus(piece)}</dd></div><div><dt>Owner</dt><dd>Unassigned</dd></div></dl>
      </li>)}</ul>
    </> : <div className={styles.empty}><span aria-hidden="true">↗</span><h2>No products match this view.</h2><p>Try a shorter title, remove a filter or return to the complete demo catalogue.</p><Link href="/studio/products">View all demo products</Link></div>}

    <footer className={styles.pagination}>
      <p>Page {result.page} of {result.pageCount}</p>
      <nav aria-label="Studio product pages">
        {result.page > 1 ? <Link rel="prev" href={studioCatalogueHref(filters, result.page - 1)}>← Previous</Link> : <span aria-disabled="true">← Previous</span>}
        {result.page < result.pageCount ? <Link rel="next" href={studioCatalogueHref(filters, result.page + 1)}>Next →</Link> : <span aria-disabled="true">Next →</span>}
      </nav>
    </footer>
  </section>;
}
