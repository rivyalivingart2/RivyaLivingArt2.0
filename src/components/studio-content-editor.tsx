"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ContentRichText } from "@/components/content-richtext";
import { ContentSections } from "@/components/content-sections";
import { PageSectionComposer } from "@/components/content-section-editor";
import { MediaAssetFigure } from "@/components/studio-media-figure";
import { MediaPicker } from "@/components/studio-media-picker";
import { TestimonialQuote } from "@/components/testimonial";
import { contentKindLabels, type ContentDocument, type ContentDocumentSummary, type ContentReferences } from "@/lib/content-contracts";
import { contentDifferences, type LocalContentCheckpoint } from "@/lib/content-history";
import { richTextToPlainText, textToRichText } from "@/lib/content-richtext";
import { faqGroups } from "@/lib/faqs";
import { validateContentDocument } from "@/lib/studio-content-validation";
import styles from "./studio-content.module.css";

const RichTextEditor = dynamic(() => import("@/components/content-richtext-editor").then((module) => module.RichTextEditor), { loading: () => <p className={styles.note}>Preparing the local text editor…</p> });
const subscribe = () => () => {};
const clone = (value: ContentDocument): ContentDocument => structuredClone(value);
const sourceLabel = "Source starting draft";
type SaveStatus = "untouched" | "unsaved" | "pending" | "checkpointed" | "failure" | "conflict";
type SaveExample = "normal" | "failure" | "conflict";
type DraftAction = "duplicate" | "archive" | "restore" | "history" | null;
const saveLabels: Record<SaveStatus, string> = {
  untouched: "Source starting draft", unsaved: "Unsaved local changes", pending: "Creating a local checkpoint…",
  checkpointed: "Checkpoint held in this editor", failure: "Simulated checkpoint failure — input retained", conflict: "Simulated version conflict — input retained",
};

function DraftPreview({ document, references }: { document: ContentDocument; references: ContentReferences }) {
  if (document.kind === "page") return <ContentSections sections={document.sections} references={references} />;
  if (document.kind === "testimonial") return <div className={styles.quotePreview}><TestimonialQuote testimonial={{ id: document.id, identity: document.identity, quote: richTextToPlainText(document.body), tier: document.tier, originKind: "DEMO_FIXTURE", demoVersion: 1, contentStatus: "OWNER_REVIEW_DRAFT", label: "Fictional sample — not a customer review." }} /></div>;
  return <article className={styles.readingPreview}>
    <p className="eyebrow">{document.kind === "faq" ? "FAQ / Owner-review draft" : `${document.category} / Sample journal draft`}</p>
    <h2>{document.title || "Untitled local draft"}</h2>
    {document.summary && <p className={styles.standfirst}>{document.summary}</p>}
    {document.cover && <MediaAssetFigure reference={document.cover} assets={references.media} />}
    <ContentRichText value={document.body} products={references.products} assets={references.media} />
    {document.relatedProductIds.length > 0 && <div className={styles.relatedPreview}><p className="eyebrow">Related source concepts</p>{document.relatedProductIds.map((id) => { const product = references.products.find((item) => item.id === id); return product ? <Link key={id} href={`/pieces/${product.slug}`} target="_blank" rel="noopener noreferrer">{product.title} ↗</Link> : <p key={id}>Unavailable product reference: {id}</p>; })}</div>}
  </article>;
}

export function StudioContentEditor({ initialDocument, documents, references }: { initialDocument: ContentDocument; documents: readonly ContentDocumentSummary[]; references: ContentReferences }) {
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const [draft, setDraft] = useState(() => clone(initialDocument));
  const [history, setHistory] = useState<LocalContentCheckpoint[]>([]);
  const [selectedCheckpoint, setSelectedCheckpoint] = useState(0);
  const [status, setStatus] = useState<SaveStatus>("untouched");
  const [saveExample, setSaveExample] = useState<SaveExample>("normal");
  const [autosave, setAutosave] = useState(true);
  const [view, setView] = useState<"edit" | "preview" | "history">("edit");
  const [previewSource, setPreviewSource] = useState<"draft" | "source">("draft");
  const [canvas, setCanvas] = useState("fit");
  const [mediaOpen, setMediaOpen] = useState(false);
  const [action, setAction] = useState<DraftAction>(null);
  const [editorGeneration, setEditorGeneration] = useState(0);
  const [notice, setNotice] = useState("");
  const nextCheckpoint = useRef(1);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastDraft = useRef(draft);
  const hasLocalChanges = JSON.stringify(initialDocument) !== JSON.stringify(draft) || history.length > 0;
  const hasUncheckpointedChanges = JSON.stringify(history.at(-1)?.document ?? initialDocument) !== JSON.stringify(draft);
  const settledStatus: SaveStatus = hasUncheckpointedChanges ? "unsaved" : history.length ? "checkpointed" : "untouched";
  const effectiveCheckpoint = history.some((item) => item.id === selectedCheckpoint) ? selectedCheckpoint : 0;
  const checkpointExpired = selectedCheckpoint !== 0 && effectiveCheckpoint === 0;
  const issues = validateContentDocument(draft, references);
  const errors = issues.filter((issue) => issue.severity === "error");
  const selected = effectiveCheckpoint === 0 ? initialDocument : history.find((item) => item.id === effectiveCheckpoint)!.document;
  const differences = contentDifferences(selected, draft);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  useEffect(() => {
    if (!hasLocalChanges) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [hasLocalChanges]);

  function cancelPending() { if (timer.current) clearTimeout(timer.current); timer.current = null; }
  function checkpoint(value: ContentDocument, example = saveExample) {
    cancelPending();
    setStatus("pending");
    // A real browser-memory snapshot with explicit failure/conflict examples; no network request.
    timer.current = setTimeout(() => {
      timer.current = null;
      if (example !== "normal") { setStatus(example); return; }
      const id = nextCheckpoint.current++;
      const snapshot = { id, label: `Local checkpoint ${id}`, document: clone(value) };
      setHistory((current) => [...current, snapshot].slice(-12));
      setStatus("checkpointed");
    }, 900);
  }
  function change(value: ContentDocument) {
    lastDraft.current = value;
    setDraft(value);
    setNotice("");
    cancelPending();
    if (autosave) checkpoint(value); else setStatus("unsaved");
  }
  function patch(value: Partial<ContentDocument>) { change({ ...lastDraft.current, ...value }); }
  function confirmAction() {
    if (action === "duplicate") {
      change({ ...clone(draft), id: `LOCAL-${draft.kind}-${crypto.randomUUID()}`, title: `${draft.title} — copy`, slug: `${draft.slug}-copy`, sourceRoute: null, archived: false });
      setNotice("A separate local copy is open. The source library is unchanged; this copy disappears when you leave.");
    } else if (action === "archive" || action === "restore") {
      patch({ archived: action === "archive" });
      setNotice(action === "archive" ? "Draft archived in this editor only. Source records and public pages are unchanged." : "Local draft restored. Nothing was written to a database.");
    } else if (action === "history") {
      change(clone(selected));
      setEditorGeneration((current) => current + 1);
      setNotice("The selected snapshot is now a new local draft. The original checkpoint is unchanged.");
    }
    setAction(null);
  }

  return <section className={styles.workspace} aria-labelledby="document-title">
    <header className={styles.editorHeading}><div><Link href="/preview/studio/content" className={styles.back}>← Content room</Link><p className={styles.eyebrow}>{contentKindLabels[draft.kind]} / {draft.id} / Schema {draft.schemaVersion}</p><h1 id="document-title">{draft.title || "Untitled local draft"}</h1><p>Sample content · Owner review required{draft.archived ? " · Archived locally" : ""}</p></div><div className={styles.editorActions}><button type="button" disabled={!hydrated} onClick={() => setAction("duplicate")}>Duplicate locally</button><button type="button" disabled={!hydrated} onClick={() => setAction(draft.archived ? "restore" : "archive")}>{draft.archived ? "Restore local draft" : "Archive locally"}</button><button type="button" className={styles.primaryButton} disabled={!hydrated || status === "pending"} onClick={() => checkpoint(draft)}>Hold local checkpoint</button></div></header>
    <div className={styles.saveBar}><p role="status" data-status={status}><span className={styles.statusDot} aria-hidden="true" />{saveLabels[status]}</p><label><input type="checkbox" checked={autosave} disabled={!hydrated} onChange={(event) => { const enabled = event.target.checked; setAutosave(enabled); cancelPending(); if (enabled && hasUncheckpointedChanges) checkpoint(draft); else setStatus(settledStatus); }} /> Local autosave</label><span>Memory only · Latest 12 checkpoints · Lost on exit</span></div>
    {action && <div className={styles.confirmation} role="group" aria-labelledby="draft-action-title"><h2 id="draft-action-title">{action === "history" ? "Restore this snapshot as a new local draft?" : action === "duplicate" ? "Open a temporary copy of this draft?" : action === "archive" ? "Archive this draft in the open editor?" : "Restore this local draft?"}</h2><p>Current editor state will change. The source library, existing snapshots and public pages stay intact.</p><div><button type="button" onClick={confirmAction}>Confirm {action === "history" ? "snapshot restore" : action}</button><button type="button" onClick={() => setAction(null)}>Cancel</button></div></div>}
    {notice && <p className={styles.notice} role="status">{notice}</p>}
    {(status === "failure" || status === "conflict") && <div className={styles.confirmation}><h2>{status === "failure" ? "Checkpoint failure example" : "Version conflict example"}</h2><p>{status === "failure" ? "This example did not create a checkpoint. Your current input is still here." : "No remote version exists in this frontend. Compare a local checkpoint with your retained draft to explore how a future conflict would be presented."}</p><div><button type="button" onClick={() => { setSaveExample("normal"); checkpoint(draft, "normal"); }}>Retry as a normal local checkpoint</button>{status === "conflict" && <button type="button" onClick={() => setView("history")}>Compare local history</button>}</div></div>}
    <div className={styles.editorTabs} aria-label="Editor views">{(["edit", "preview", "history"] as const).map((item) => <button key={item} type="button" aria-pressed={view === item} onClick={() => setView(item)}>{item === "edit" ? "Write & arrange" : item === "preview" ? "Layout preview" : `History (${history.length})`}</button>)}</div>
    <div className={styles.editorLayout} data-view={view}>
      <aside className={styles.editorSidebar}><details><summary>In this collection <span>{documents.filter((doc) => doc.kind === draft.kind).length}</span></summary><nav aria-label="Other source documents">{documents.filter((doc) => doc.kind === draft.kind).map((doc) => <Link key={doc.id} href={`/preview/studio/content/${doc.id}`} aria-current={doc.id === initialDocument.id ? "page" : undefined}><small>{doc.id}</small>{doc.title}</Link>)}</nav></details><div className={styles.note}><strong>Temporary editor</strong><p>Leaving this editor discards its drafts and checkpoints. Source pages open separately so you can keep editing here.</p>{initialDocument.sourceRoute && <Link target="_blank" rel="noopener noreferrer" href={initialDocument.sourceRoute}>Open source page ↗</Link>}</div><details className={styles.simulation}><summary>Save-state examples</summary><label>Local checkpoint outcome<select value={saveExample} disabled={!hydrated} onChange={(event) => { cancelPending(); setSaveExample(event.target.value as SaveExample); setStatus(settledStatus); }}><option value="normal">Normal local snapshot</option><option value="failure">Simulated failure</option><option value="conflict">Simulated version conflict</option></select></label><p>The chosen example applies to local checkpoint attempts while it is selected. No database, autosave service or other editor is connected.</p></details></aside>
      <div className={styles.writingPanel} hidden={view !== "edit"}>
        <fieldset className={styles.fieldset} disabled={!hydrated || draft.archived}><legend>{draft.kind === "faq" ? "Question & answer" : draft.kind === "testimonial" ? "Fictional quote" : "Document details"}</legend><label htmlFor="content-title-field">{draft.kind === "faq" ? "Question" : "Title"}<input id="content-title-field" maxLength={160} value={draft.title} onChange={(event) => patch({ title: event.target.value })} /></label>
          {(draft.kind === "article" || draft.kind === "page") && <><label htmlFor="content-slug">Slug<input id="content-slug" maxLength={100} value={draft.slug} onChange={(event) => patch({ slug: event.target.value })} /></label><p className={styles.fieldHint}>Local route proposal. Editing this field does not rename a source route.</p></>}
          <label htmlFor="content-summary">{draft.kind === "faq" ? "Adjacent preview / owner-review note" : "Summary / standfirst"}<textarea id="content-summary" readOnly={draft.kind === "testimonial"} rows={3} maxLength={600} value={draft.summary} onChange={(event) => patch({ summary: event.target.value })} /></label>
          {draft.kind === "article" && <label htmlFor="content-category">Journal category<select id="content-category" value={draft.category} onChange={(event) => patch({ category: event.target.value as ContentDocument["category"] })}><option>Spaces</option><option>Materials</option><option>Commissioning</option></select></label>}
          {draft.kind === "faq" && <label htmlFor="content-faq-group">FAQ group<select id="content-faq-group" value={draft.faqGroup} onChange={(event) => patch({ faqGroup: event.target.value as ContentDocument["faqGroup"] })}>{faqGroups.map((group) => <option key={group.id} value={group.id}>{group.label}</option>)}</select></label>}
          {draft.kind === "testimonial" && <><div className={styles.note}><strong>Fictional sample — not a customer review.</strong><p>Identity: {draft.identity}. This disclosure and demo provenance cannot be removed. No rating, verified status or customer location is collected.</p></div><label htmlFor="content-tier">Collection tier<select id="content-tier" value={draft.tier} onChange={(event) => patch({ tier: event.target.value as ContentDocument["tier"] })}><option value="LARGE">Furniture & spatial art</option><option value="MEDIUM">Memory art</option><option value="SMALL">Personal art & gifts</option></select></label><label htmlFor="content-body">Fictional quote<textarea id="content-body" rows={6} maxLength={1200} value={(draft.body.content ?? []).map((paragraph) => (paragraph.content ?? []).map((node) => node.text ?? "").join("")).join("\n")} onChange={(event) => patch({ body: textToRichText([event.target.value]) })} /></label></>}
        </fieldset>
        {draft.kind === "page" ? <div id="content-sections"><PageSectionComposer sections={draft.sections} onChange={(sections) => patch({ sections })} references={references} disabled={!hydrated || draft.archived} furnitureFirst={initialDocument.id === "CP001"} /></div> : draft.kind !== "testimonial" && <section id="content-body" className={styles.bodyEditor} aria-labelledby="body-editor-title"><h2 id="body-editor-title">{draft.kind === "faq" ? "Answer" : "Article body"}</h2><RichTextEditor key={`${editorGeneration}:${draft.kind}`} value={draft.body} onChange={(body) => patch({ body })} products={references.products} assets={references.media} disabled={!hydrated || draft.archived} /></section>}
        {(draft.kind === "article" || draft.kind === "page") && <fieldset className={styles.fieldset} disabled={!hydrated || draft.archived}><legend>Media & references</legend><div id="content-cover"><h2 className={styles.smallHeading}>{draft.kind === "page" ? "Search / share image" : "Cover image"}</h2>{draft.kind === "page" && <p className={styles.fieldHint}>Local metadata image. Edit each page section to change its displayed hero or story image.</p>}{draft.cover ? <><MediaAssetFigure reference={draft.cover} assets={references.media} /><div className={styles.inlineActions}><button type="button" onClick={() => setMediaOpen(true)}>Edit image selection</button><button type="button" onClick={() => patch({ cover: null })}>Remove cover reference</button></div></> : <div className={styles.emptyMedia}><p>No cover selected. Pending media stays visibly pending.</p><button type="button" onClick={() => setMediaOpen(true)}>Choose preview media</button></div>}</div>{draft.kind === "article" && <details id="content-references" className={styles.productOptions}><summary>Related source products ({draft.relatedProductIds.length})</summary><p>Choose references. Titles, pricing and specifications come from the catalogue.</p>{references.products.map((product) => <label key={product.id}><input type="checkbox" checked={draft.relatedProductIds.includes(product.id)} onChange={(event) => patch({ relatedProductIds: event.target.checked ? [...draft.relatedProductIds, product.id] : draft.relatedProductIds.filter((id) => id !== product.id) })} />{product.id} · {product.title}</label>)}</details>}</fieldset>}
        {(draft.kind === "article" || draft.kind === "page") && <fieldset className={styles.fieldset} disabled={!hydrated || draft.archived}><legend>Search presentation</legend><label htmlFor="content-seo-title">SEO title<input id="content-seo-title" value={draft.seoTitle} maxLength={70} onChange={(event) => patch({ seoTitle: event.target.value })} /></label><label htmlFor="content-seo-description">SEO description<textarea id="content-seo-description" value={draft.seoDescription} rows={3} maxLength={180} onChange={(event) => patch({ seoDescription: event.target.value })} /></label><p className={styles.fieldHint}>Preview routes remain noindex. These local fields do not change live metadata.</p><div className={styles.searchPreview} aria-label="Local search appearance"><p>RivyaLivingArt · {draft.slug}</p><h3>{draft.seoTitle || draft.title || "Untitled local draft"}</h3><p>{draft.seoDescription || draft.summary || "Add a local search description."}</p></div></fieldset>}
      </div>
      <section className={styles.previewPanel} hidden={view === "history"} aria-labelledby="layout-preview-title"><header className={styles.previewHeader}><div><p className={styles.eyebrow}>Reading the page</p><h2 id="layout-preview-title">Layout preview</h2></div><label>Canvas width<select value={canvas} onChange={(event) => setCanvas(event.target.value)}><option value="fit">Fit available space</option><option value="390">Mobile · 390 px</option><option value="768">Tablet · 768 px</option><option value="1200">Desktop · 1200 px</option></select></label><label>Displayed content<select value={previewSource} onChange={(event) => setPreviewSource(event.target.value as "draft" | "source")}><option value="draft">Current local draft</option><option value="source">Source starting draft</option></select></label></header><p className={styles.previewLabel}>{previewSource === "source" ? sourceLabel : "Local draft preview — unpublished"}. {draft.kind === "page" ? "Composer starting layout; the existing source page is available separately." : "Fictional sample content."} Preview links open separately. Fixed-width canvases scroll inside this panel.</p><div className={styles.canvasScroll} tabIndex={0} aria-label="Scrollable layout preview" onClickCapture={(event) => { const link = event.target instanceof Element ? event.target.closest("a") : null; if (link && !link.getAttribute("href")?.startsWith("#")) { link.setAttribute("target", "_blank"); link.setAttribute("rel", "noopener noreferrer"); } }}><div className={styles.canvas} style={{ width: canvas === "fit" ? "100%" : `${canvas}px` }}><DraftPreview document={previewSource === "source" ? initialDocument : draft} references={references} /></div></div></section>
      <section className={styles.historyPanel} hidden={view !== "history"} aria-labelledby="history-title"><p className={styles.eyebrow}>Local revision presentation</p><h2 id="history-title">A draft in stages.</h2><p>Snapshots are held only in this mounted editor. They are not database revisions or published versions. Compare a snapshot with your current draft; restoring makes a new editable draft.</p><label>Compare from<select value={effectiveCheckpoint} onChange={(event) => setSelectedCheckpoint(Number(event.target.value))}><option value={0}>{sourceLabel}</option>{history.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>{checkpointExpired && <p role="status">The previously selected checkpoint aged out of the latest 12. The comparison now shows the source starting draft, as selected above.</p>}<p>{differences.length} changed {differences.length === 1 ? "field" : "fields"} against the current local draft.</p>{differences.length > 0 ? <div className={styles.differences}>{differences.map((difference, index) => <article key={`${difference.label}:${index}`}><h3>{difference.label}</h3><div><section><h4>Selected snapshot</h4><p>{difference.before}</p></section><section><h4>Current draft</h4><p>{difference.after}</p></section></div></article>)}</div> : <div className={styles.empty}><p>No difference from the selected snapshot. Formatting-only edits are identified in the body field.</p></div>}<button type="button" disabled={!hydrated || differences.length === 0} onClick={() => setAction("history")}>Restore selected snapshot as a draft</button></section>
    </div>
    <section className={styles.validation} id="content-validation" aria-labelledby="content-validation-title"><div><p className={styles.eyebrow}>Draft review</p><h2 id="content-validation-title">{errors.length ? `${errors.length} fields need attention` : "No blocking draft field issues"}</h2><p>Local checkpoints can retain unfinished fields. Field validation does not approve this content for publication.</p></div>{issues.length > 0 && <ul>{issues.map((issue, index) => <li key={`${issue.field}:${index}`} data-severity={issue.severity}><strong>{issue.severity === "error" ? "Fix" : "Review"} · {issue.field}</strong><span>{issue.message}</span></li>)}</ul>}<div className={styles.publishBoundary}><button type="button" disabled>Publish unavailable</button><button type="button" disabled>Schedule unavailable</button><p>Requires the reviewed backend, permissions, durable revisions and approved content/media. All fixtures remain labelled demo drafts.</p></div></section>
    {mediaOpen && <MediaPicker assets={references.media} value={draft.cover} onSelect={(cover) => { patch({ cover }); setMediaOpen(false); }} onClose={() => setMediaOpen(false)} />}
  </section>;
}
