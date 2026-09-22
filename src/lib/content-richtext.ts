import type { JSONContent } from "@tiptap/core";

/** Version 1 uses the reviewed Tiptap node names, never stored HTML. */
export type RichTextValue = JSONContent;
export type RichTextProduct = { id: string; title: string; slug: string };

export function emptyRichText(): RichTextValue {
  return { type: "doc", content: [{ type: "paragraph" }] };
}

export function textToRichText(paragraphs: readonly string[]): RichTextValue {
  return { type: "doc", content: paragraphs.length ? paragraphs.map((text) => ({ type: "paragraph", ...(text ? { content: [{ type: "text", text }] } : {}) })) : [{ type: "paragraph" }] };
}

/** Reject protocol-relative, executable, obscured and malformed destinations. */
export function safeRichTextHref(value: unknown): string | null {
  if (typeof value !== "string" || !value || value.length > 2048 || /[\s\\\u0000-\u001f\u007f-\u009f]/u.test(value)) return null;
  if (value.startsWith("/")) return value.startsWith("//") ? null : value;
  if (!/^(https?:\/\/|mailto:|tel:)/i.test(value)) return null;
  try {
    const url = new URL(value);
    if ((url.protocol === "https:" || url.protocol === "http:") && url.hostname) return value;
    if ((url.protocol === "mailto:" || url.protocol === "tel:") && url.pathname) return value;
  } catch { return null; }
  return null;
}

export function richTextToPlainText(value: RichTextValue): string {
  function visit(node: JSONContent, depth: number): string {
    if (depth > 16 || !node || typeof node !== "object") return "";
    if (node.type === "text") return typeof node.text === "string" ? node.text : "";
    if (node.type === "hardBreak") return "\n";
    if (node.type === "mediaAsset") return typeof node.attrs?.caption === "string" ? node.attrs.caption : "";
    if (node.type === "productReference") return typeof node.attrs?.productId === "string" ? `[${node.attrs.productId}]` : "";
    return Array.isArray(node.content) ? node.content.map((child) => visit(child, depth + 1)).join(["doc", "blockquote", "bulletList", "orderedList", "listItem"].includes(node.type ?? "") ? "\n" : "") : "";
  }
  return visit(value, 0).trim();
}

const inlineNodes = new Set(["text", "hardBreak"]);
const blockNodes = new Set(["paragraph", "heading", "blockquote", "bulletList", "orderedList", "mediaAsset", "productReference"]);
const allowedNodes = new Set(["doc", "listItem", ...inlineNodes, ...blockNodes]);
const allowedAttributes: Record<string, readonly string[]> = {
  heading: ["level"], orderedList: ["start", "type"], mediaAsset: ["assetId", "alt", "caption", "focalPoint"], productReference: ["productId"],
};

/** Local authoring feedback. A future write service must enforce this again. */
export function validateRichText(value: RichTextValue, references: { productIds: readonly string[]; mediaIds: readonly string[] }): string[] {
  const issues = new Set<string>();
  const products = new Set(references.productIds);
  const media = new Set(references.mediaIds);
  let nodeCount = 0;
  let textLength = 0;
  function visit(node: JSONContent, parent: string | null, depth: number) {
    nodeCount += 1;
    if (depth > 16 || nodeCount > 2000) { issues.add("Rich text exceeds the supported document size or nesting depth."); return; }
    if (!node || typeof node !== "object" || !allowedNodes.has(node.type ?? "")) { issues.add("Rich text contains an unsupported node."); return; }
    const type = node.type!;
    if ((parent === null && type !== "doc") || (parent !== null && type === "doc")) issues.add("Rich text must have one document root.");
    if ((parent === "paragraph" || parent === "heading") && !inlineNodes.has(type)) issues.add("Paragraphs and headings can contain only text and line breaks.");
    if ((parent === "bulletList" || parent === "orderedList") && type !== "listItem") issues.add("Lists can contain only list items.");
    if (["doc", "blockquote", "listItem"].includes(parent ?? "") && !blockNodes.has(type)) issues.add("Rich text has an invalid block structure.");
    const attrs = node.attrs ?? {};
    if (Object.keys(attrs).some((key) => !(allowedAttributes[type] ?? []).includes(key))) issues.add("Rich text contains unsupported attributes.");
    if (type === "heading" && attrs.level !== 2 && attrs.level !== 3) issues.add("Article headings must use level 2 or level 3.");
    if (type === "orderedList" && (attrs.start !== undefined && (!Number.isInteger(attrs.start) || attrs.start < 1 || attrs.start > 9999))) issues.add("Numbered lists need a start between 1 and 9999.");
    if (type === "orderedList" && attrs.type != null && attrs.type !== "1") issues.add("Only decimal numbered lists are supported.");
    if (type === "text") {
      if (typeof node.text !== "string" || !node.text) issues.add("Text nodes must contain text.");
      else textLength += node.text.length;
    } else if (node.text !== undefined) issues.add("Only text nodes can contain a text value.");
    if (type === "mediaAsset") {
      if (typeof attrs.assetId !== "string" || !media.has(attrs.assetId)) issues.add("Resolve a missing media reference in rich text.");
      if (typeof attrs.alt !== "string" || !attrs.alt.trim() || attrs.alt.length > 320) issues.add("Rich-text images need meaningful alt text of at most 320 characters.");
      if (typeof attrs.caption !== "string" || attrs.caption.length > 600) issues.add("Rich-text captions must contain at most 600 characters.");
      if (!attrs.focalPoint || typeof attrs.focalPoint !== "object" || [attrs.focalPoint.x, attrs.focalPoint.y].some((coordinate) => typeof coordinate !== "number" || !Number.isFinite(coordinate) || coordinate < 0 || coordinate > 100)) issues.add("Rich-text image focal points must be between 0 and 100.");
    }
    if (type === "productReference" && (typeof attrs.productId !== "string" || !products.has(attrs.productId))) issues.add("Resolve a missing product reference in rich text.");
    if (node.marks && type !== "text") issues.add("Formatting marks belong on text only.");
    for (const mark of node.marks ?? []) {
      if (!["bold", "italic", "link"].includes(mark.type)) { issues.add("Rich text contains unsupported formatting."); continue; }
      if (mark.type === "link") {
        if (!safeRichTextHref(mark.attrs?.href)) issues.add("Links must use a safe http, https, mailto, tel or local /path destination.");
        if (Object.keys(mark.attrs ?? {}).some((key) => !["href", "target", "rel", "class", "title"].includes(key)) || mark.attrs?.class != null || (mark.attrs?.target != null && mark.attrs.target !== "_blank")) issues.add("Link styling and custom targets are unsupported.");
      } else if (Object.keys(mark.attrs ?? {}).length) issues.add("Text formatting cannot contain custom attributes.");
    }
    if ((inlineNodes.has(type) || type === "mediaAsset" || type === "productReference") && node.content?.length) issues.add("Text, image and product-reference nodes cannot contain nested content.");
    if (type === "listItem" && node.content?.[0]?.type !== "paragraph") issues.add("Each list item must begin with a paragraph.");
    if (node.content !== undefined && !Array.isArray(node.content)) { issues.add("Rich text content must be a node list."); return; }
    for (const child of node.content ?? []) visit(child, type, depth + 1);
  }
  visit(value, null, 0);
  if (textLength > 100000) issues.add("Rich text exceeds the 100,000-character authoring limit.");
  return [...issues];
}
