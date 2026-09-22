"use client";

import { Node } from "@tiptap/core";
import { Fragment, Slice, type Node as ProseMirrorNode } from "@tiptap/pm/model";
import { EditorContent, NodeViewWrapper, ReactNodeViewRenderer, useEditor, useEditorState, type NodeViewProps } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useId, useRef, useState } from "react";
import { MediaAssetFigure } from "@/components/studio-media-figure";
import { MediaPicker } from "@/components/studio-media-picker";
import { safeRichTextHref, type RichTextProduct, type RichTextValue } from "@/lib/content-richtext";
import type { AssetReference, StudioMediaAsset } from "@/lib/studio-media";
import styles from "./content-richtext.module.css";

function mediaReference(attrs: Record<string, unknown>): AssetReference {
  const point = attrs.focalPoint as { x?: unknown; y?: unknown } | undefined;
  return { assetId: typeof attrs.assetId === "string" ? attrs.assetId : "", alt: typeof attrs.alt === "string" ? attrs.alt : "", caption: typeof attrs.caption === "string" ? attrs.caption : "", focalPoint: { x: typeof point?.x === "number" ? point.x : 50, y: typeof point?.y === "number" ? point.y : 50 } };
}

function MediaNodeView({ node, extension, selected }: NodeViewProps) {
  return <NodeViewWrapper className={`${styles.node} ${selected ? styles.selected : ""}`} contentEditable={false}>
    <MediaAssetFigure reference={mediaReference(node.attrs)} assets={extension.options.assets} />
    <span className={styles.nodeHint}>Media reference · select this block, then “Image & caption” to edit its usage.</span>
  </NodeViewWrapper>;
}

function ProductNodeView({ node, extension, selected }: NodeViewProps) {
  const product = (extension.options.products as readonly RichTextProduct[]).find((item) => item.id === node.attrs.productId);
  return <NodeViewWrapper className={`${styles.product} ${styles.node} ${selected ? styles.selected : ""}`} contentEditable={false}>
    <span>Product reference · {node.attrs.productId}</span><strong>{product?.title ?? "Missing product — replace this reference"}</strong><span className={styles.nodeHint}>The public renderer resolves the current product title and route from its ID.</span>
  </NodeViewWrapper>;
}

const MediaAssetNode = Node.create<{ assets: readonly StudioMediaAsset[] }>({
  name: "mediaAsset", group: "block", atom: true, selectable: true,
  addOptions: () => ({ assets: [] }),
  addAttributes: () => ({ assetId: { default: "" }, alt: { default: "" }, caption: { default: "" }, focalPoint: { default: { x: 50, y: 50 } } }),
  // Clipboard HTML cannot create trusted asset IDs. Insertion uses our picker.
  parseHTML: () => [],
  renderHTML: ({ node }) => ["figure", { "data-type": "mediaAsset" }, ["span", {}, "Media reference"], ["figcaption", {}, String(node.attrs.caption ?? "")]],
  addNodeView: () => ReactNodeViewRenderer(MediaNodeView),
});

const ProductReferenceNode = Node.create<{ products: readonly RichTextProduct[] }>({
  name: "productReference", group: "block", atom: true, selectable: true,
  addOptions: () => ({ products: [] }),
  addAttributes: () => ({ productId: { default: "" } }),
  parseHTML: () => [],
  renderHTML: ({ node }) => ["aside", { "data-type": "productReference" }, `Product reference: ${String(node.attrs.productId ?? "")}`],
  addNodeView: () => ReactNodeViewRenderer(ProductNodeView),
});

function sanitizePastedSlice(slice: Slice): Slice {
  function clean(node: ProseMirrorNode): ProseMirrorNode {
    const marks = node.marks.flatMap((mark) => {
      if (mark.type.name === "bold" || mark.type.name === "italic") return [mark.type.create()];
      const href = mark.type.name === "link" ? safeRichTextHref(mark.attrs.href) : null;
      return href ? [mark.type.create({ href, target: null, rel: "noopener noreferrer", class: null, title: null })] : [];
    });
    if (node.isText) return node.mark(marks);
    const children: ProseMirrorNode[] = [];
    node.content.forEach((child) => children.push(clean(child)));
    const attrs = node.type.name === "orderedList" ? { start: Number.isInteger(node.attrs.start) && node.attrs.start > 0 && node.attrs.start <= 9999 ? node.attrs.start : 1, type: null } : node.attrs;
    return node.type.create(attrs, Fragment.fromArray(children), marks);
  }
  const nodes: ProseMirrorNode[] = [];
  slice.content.forEach((node) => nodes.push(clean(node)));
  return new Slice(Fragment.fromArray(nodes), slice.openStart, slice.openEnd);
}

/** Mounted document only. The parent remounts with a revision key on restore. */
export function RichTextEditor({ value, onChange, products, assets, disabled = false }: { value: RichTextValue; onChange: (value: RichTextValue) => void; products: readonly RichTextProduct[]; assets: readonly StudioMediaAsset[]; disabled?: boolean }) {
  const id = useId();
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkValue, setLinkValue] = useState("");
  const [linkIssue, setLinkIssue] = useState("");
  const [mediaOpen, setMediaOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);
  const [productId, setProductId] = useState(products[0]?.id ?? "");
  const [notice, setNotice] = useState("");
  const linkInput = useRef<HTMLInputElement>(null);
  const productInput = useRef<HTMLSelectElement>(null);
  const linkButton = useRef<HTMLButtonElement>(null);
  const mediaButton = useRef<HTMLButtonElement>(null);
  const productButton = useRef<HTMLButtonElement>(null);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] }, code: false, codeBlock: false, horizontalRule: false, strike: false, underline: false,
        link: { autolink: false, openOnClick: false, linkOnPaste: false, protocols: ["http", "https", "mailto", "tel"], defaultProtocol: "https", isAllowedUri: (url) => Boolean(safeRichTextHref(url)), HTMLAttributes: { target: null, rel: "noopener noreferrer", class: null } },
      }),
      MediaAssetNode.configure({ assets }), ProductReferenceNode.configure({ products }),
    ],
    content: value,
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    editable: !disabled,
    editorProps: { attributes: { class: styles.document, role: "textbox", "aria-label": "Rich text draft", "aria-multiline": "true", "aria-describedby": `${id}-hint` }, transformPasted: sanitizePastedSlice },
    onUpdate: ({ editor: current }) => onChange(current.getJSON()),
  });
  const active = useEditorState({ editor, selector: ({ editor: current }) => current ? ({
    bold: current.isActive("bold"), italic: current.isActive("italic"), paragraph: current.isActive("paragraph"), h2: current.isActive("heading", { level: 2 }), h3: current.isActive("heading", { level: 3 }), bullet: current.isActive("bulletList"), numbered: current.isActive("orderedList"), quote: current.isActive("blockquote"), link: current.isActive("link"), media: current.isActive("mediaAsset"), product: current.isActive("productReference"), undo: current.can().undo(), redo: current.can().redo(),
  }) : null });
  const unavailable = !editor || disabled;
  useEffect(() => { editor?.setEditable(!disabled, false); }, [editor, disabled]);
  useEffect(() => { if (linkOpen) linkInput.current?.focus(); }, [linkOpen]);
  useEffect(() => { if (productOpen) productInput.current?.focus(); }, [productOpen]);

  function closeLink() { setLinkOpen(false); setLinkIssue(""); linkButton.current?.focus(); }
  function applyLink() {
    if (!editor || disabled) return;
    if (editor.state.selection.empty && !editor.isActive("link")) { setLinkIssue("Select the words to link in the document, then apply this destination."); return; }
    const href = safeRichTextHref(linkValue.trim());
    if (!href) { setLinkIssue("Enter an http, https, mailto, tel or local /path link. Relative hostnames, spaces and executable protocols are not accepted."); linkInput.current?.focus(); return; }
    editor.chain().focus().extendMarkRange("link").setLink({ href, target: null, rel: "noopener noreferrer", class: null, title: null }).run();
    closeLink(); setNotice("Link applied to the selected text in this local draft.");
  }
  function chooseMedia(reference: AssetReference) {
    if (!editor || disabled) return;
    if (editor.isActive("mediaAsset")) editor.chain().focus().updateAttributes("mediaAsset", reference).run();
    else editor.chain().focus().insertContent({ type: "mediaAsset", attrs: reference }).run();
    setMediaOpen(false); mediaButton.current?.focus(); setNotice("Media reference applied locally. Its source rights and concept label are retained.");
  }
  function applyProduct() {
    if (!editor || disabled || !products.some((product) => product.id === productId)) return;
    if (editor.isActive("productReference")) editor.chain().focus().updateAttributes("productReference", { productId }).run();
    else editor.chain().focus().insertContent({ type: "productReference", attrs: { productId } }).run();
    setProductOpen(false); productButton.current?.focus(); setNotice("Product reference applied locally; catalogue fields stay in their source record.");
  }

  return <div className={styles.editor}>
    <div className={styles.toolbar} role="group" aria-label="Rich text formatting">
      <button type="button" disabled={unavailable} aria-pressed={active?.paragraph ?? false} onClick={() => editor?.chain().focus().setParagraph().run()}>Paragraph</button>
      <button type="button" disabled={unavailable} aria-pressed={active?.h2 ?? false} onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>Heading 2</button>
      <button type="button" disabled={unavailable} aria-pressed={active?.h3 ?? false} onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}>Heading 3</button>
      <button type="button" disabled={unavailable} aria-pressed={active?.bold ?? false} onClick={() => editor?.chain().focus().toggleBold().run()}><strong>Bold</strong></button>
      <button type="button" disabled={unavailable} aria-pressed={active?.italic ?? false} onClick={() => editor?.chain().focus().toggleItalic().run()}><em>Italic</em></button>
      <button type="button" disabled={unavailable} aria-pressed={active?.bullet ?? false} onClick={() => editor?.chain().focus().toggleBulletList().run()}>Bullet list</button>
      <button type="button" disabled={unavailable} aria-pressed={active?.numbered ?? false} onClick={() => editor?.chain().focus().toggleOrderedList().run()}>Numbered list</button>
      <button type="button" disabled={unavailable} aria-pressed={active?.quote ?? false} onClick={() => editor?.chain().focus().toggleBlockquote().run()}>Quote</button>
      <button type="button" ref={linkButton} disabled={unavailable} aria-pressed={active?.link ?? false} aria-expanded={linkOpen} aria-controls={`${id}-link`} onClick={() => { setLinkValue(editor?.getAttributes("link").href ?? ""); setLinkIssue(""); setLinkOpen((open) => !open); setProductOpen(false); }}>Link</button>
      <button type="button" ref={mediaButton} disabled={unavailable || !assets.length} aria-pressed={active?.media ?? false} aria-haspopup="dialog" onClick={() => { setMediaOpen(true); setLinkOpen(false); setProductOpen(false); }}>Image & caption</button>
      <button type="button" ref={productButton} disabled={unavailable || !products.length} aria-pressed={active?.product ?? false} aria-expanded={productOpen} aria-controls={`${id}-product`} onClick={() => { const currentId = editor?.getAttributes("productReference").productId; if (products.some((product) => product.id === currentId)) setProductId(currentId); setProductOpen((open) => !open); setLinkOpen(false); }}>Product reference</button>
      <button type="button" disabled={unavailable || !active?.undo} onClick={() => editor?.chain().focus().undo().run()}>Undo</button>
      <button type="button" disabled={unavailable || !active?.redo} onClick={() => editor?.chain().focus().redo().run()}>Redo</button>
    </div>
    {linkOpen && <fieldset id={`${id}-link`} className={styles.panel} disabled={unavailable} onKeyDown={(event) => { if (event.key === "Escape") { event.stopPropagation(); closeLink(); } }}>
      <legend>Link selected text</legend><label htmlFor={`${id}-href`}>Destination</label><input ref={linkInput} id={`${id}-href`} type="text" value={linkValue} maxLength={2048} placeholder="/furniture or https://…" aria-invalid={Boolean(linkIssue)} aria-describedby={`${id}-link-help`} onChange={(event) => { setLinkValue(event.target.value); setLinkIssue(""); }} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); applyLink(); } }} />
      <p id={`${id}-link-help`}>{linkIssue || "Select the text to link before opening this panel. Links do not open inside the editor."}</p>
      <div className={styles.actions}><button type="button" onClick={applyLink}>Apply link</button><button type="button" disabled={!active?.link} onClick={() => { editor?.chain().focus().extendMarkRange("link").unsetLink().run(); closeLink(); setNotice("Link removed from this local draft."); }}>Remove link</button><button type="button" onClick={closeLink}>Cancel</button></div>
    </fieldset>}
    {productOpen && <fieldset id={`${id}-product`} className={styles.panel} disabled={unavailable} onKeyDown={(event) => { if (event.key === "Escape") { event.stopPropagation(); setProductOpen(false); productButton.current?.focus(); } }}>
      <legend>Reference a catalogue study</legend><label htmlFor={`${id}-product-id`}>Product record</label><select ref={productInput} id={`${id}-product-id`} value={productId} onChange={(event) => setProductId(event.target.value)}>{products.map((product) => <option key={product.id} value={product.id}>{product.id} · {product.title}</option>)}</select><p>Store its stable ID. Titles, routes, price and specifications remain owned by the catalogue.</p><div className={styles.actions}><button type="button" onClick={applyProduct}>Apply reference</button><button type="button" onClick={() => { setProductOpen(false); productButton.current?.focus(); }}>Cancel</button></div>
    </fieldset>}
    <div className={styles.editingSurface}>{editor ? <EditorContent editor={editor} /> : <p className={styles.loading}>The local text editor starts when JavaScript is ready.</p>}</div>
    <p className={styles.hint} id={`${id}-hint`}>Local rich text · headings, lists, quotes, safe links and referenced media/products. Changes stay in this tab. Shift + Enter adds a line break. Select an image or product block and press Delete to remove it.</p>
    <p className={styles.status} role="status">{notice}</p>
    {mediaOpen && !disabled && <MediaPicker assets={assets} value={editor?.isActive("mediaAsset") ? mediaReference(editor.getAttributes("mediaAsset")) : null} onSelect={chooseMedia} onClose={() => { setMediaOpen(false); mediaButton.current?.focus(); }} />}
  </div>;
}
