import Form from "next/form";
import Link from "next/link";
import { contentKindLabels, contentKinds, isContentKind, type ContentDocumentSummary } from "@/lib/rivya/source/content-contracts";
import styles from "./studio-content.module.css";

type Query = Record<string, string | string[] | undefined>;
const root = "/studio/content";

function contentHref(kind: string, q: string, page = 1) {
  const query = new URLSearchParams();
  if (kind !== "all") query.set("kind", kind);
  if (q) query.set("q", q);
  if (page > 1) query.set("page", String(page));
  return `${root}${query.size ? `?${query}` : ""}`;
}

export function StudioContentHub({ documents, query }: { documents: readonly ContentDocumentSummary[]; query: Query }) {
  const kind = typeof query.kind === "string" && isContentKind(query.kind) ? query.kind : "all";
  const q = typeof query.q === "string" ? query.q.trim().slice(0, 120) : "";
  const invalid = (query.kind !== undefined && query.kind !== "all" && kind === "all") || Array.isArray(query.q);
  const filtered = invalid ? [] : documents.filter((doc) => (kind === "all" || doc.kind === kind) && `${doc.title} ${doc.id} ${doc.slug}`.toLowerCase().includes(q.toLowerCase()));
  const pages = Math.max(1, Math.ceil(filtered.length / 12));
  const requested = typeof query.page === "string" && /^[1-9]\d{0,5}$/.test(query.page) ? Number(query.page) : 1;
  const page = Math.min(requested, pages);
  const rows = filtered.slice((page - 1) * 12, page * 12);
  return <section className={styles.workspace} aria-labelledby="content-title">
    <header className={styles.heading}><div><p className={styles.eyebrow}>Studio / Words & stories</p><h1 id="content-title">The content room.</h1><p>A place for the stories around the objects. Shape a sample draft, then see how it reads.</p></div><span className={styles.count}>{documents.length}<small>source drafts</small></span></header>
    <div className={styles.hubLayout}>
      <aside className={styles.navigator}><p className={styles.eyebrow}>Document library</p><nav aria-label="Content types"><Link href={contentHref("all", q)} aria-current={kind === "all" && !invalid ? "page" : undefined}>All content <span>{documents.length}</span></Link>{contentKinds.map((item) => <Link key={item} href={contentHref(item, q)} aria-current={kind === item && !invalid ? "page" : undefined}>{contentKindLabels[item]}<span>{documents.filter((doc) => doc.kind === item).length}</span></Link>)}</nav><div className={styles.note}><strong>Source drafts</strong><p>Every record is a sample awaiting owner review. There is no published database version.</p></div><details className={styles.planned}><summary>Other content schemas</summary><p>Project stories, collection narratives, navigation and settings remain separate planned editors. The marketing composer does not change catalogue specifications.</p></details></aside>
      <div className={styles.library}>
        <div className={styles.libraryToolbar}><Form action={root} className={styles.search} key={`${kind}:${q}`}><input type="hidden" name="kind" value={kind} /><label htmlFor="content-query">Find a document<input id="content-query" type="search" name="q" maxLength={120} defaultValue={q} placeholder="Search a title or reference…" /></label><button type="submit">Search</button></Form><details className={styles.createMenu}><summary>＋ New local draft</summary><nav aria-label="Create a local draft">{contentKinds.map((item) => <Link key={item} href={`${root}/new?kind=${item}`}>{contentKindLabels[item]}</Link>)}</nav></details></div>
        <div className={styles.resultLine}><p>{filtered.length} source {filtered.length === 1 ? "draft" : "drafts"}{filtered.length > 0 ? ` · Showing ${(page - 1) * 12 + 1}–${Math.min(page * 12, filtered.length)}` : ""}</p>{(kind !== "all" || q || invalid) && <Link href={root}>Clear filters</Link>}</div>
        <div className={styles.documentList}>{rows.map((doc) => <Link href={`${root}/${doc.id}`} key={doc.id} className={styles.document}><span className={styles.documentIcon} aria-hidden="true">{doc.kind === "faq" ? "?" : doc.kind === "testimonial" ? "“" : "¶"}</span><div><p className={styles.documentMeta}>{contentKindLabels[doc.kind]} <span>/</span> {doc.id} <span>/</span> Schema {doc.schemaVersion}</p><h2>{doc.title}</h2><p className={styles.documentDescription}>{doc.description}</p></div><div className={styles.documentStatus}><span>Sample draft</span><small>{doc.mediaState === "PREVIEW_ONLY" ? "Preview image" : doc.mediaState === "PENDING" ? "Media pending" : "Text record"}</small></div><span className={styles.documentArrow} aria-hidden="true">↗</span></Link>)}</div>
        {rows.length === 0 && <div className={styles.empty}><p className={styles.eyebrow}>Room for another idea</p><h2>{invalid ? "That content selection is unavailable." : "No document matches yet."}</h2><p>Try a title, a reference such as DB001, or another content type.</p><Link href={root}>Return to all content →</Link></div>}
        {pages > 1 && <nav aria-label="Content pages" className={styles.pagination}>{page > 1 ? <Link href={contentHref(kind, q, page - 1)}>← Previous</Link> : <span>← Previous</span>}<span>Page {page} of {pages}</span>{page < pages ? <Link href={contentHref(kind, q, page + 1)}>Next →</Link> : <span>Next →</span>}</nav>}
        <div className={styles.note}><strong>Local development workspace</strong><p>New, duplicate and archive actions affect only the open editor. Leaving or reloading discards them. Scheduling, database saving and publishing become available in a later integration phase.</p></div>
      </div>
    </div>
  </section>;
}
