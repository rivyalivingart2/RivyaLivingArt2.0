import Link from "next/link";
import type { ReactNode } from "react";
import { MediaAssetFigure } from "@/components/studio-media-figure";
import { safeRichTextHref, type RichTextProduct, type RichTextValue } from "@/lib/content-richtext";
import type { AssetReference, StudioMediaAsset } from "@/lib/studio-media";
import styles from "./content-richtext.module.css";

/** Shared public/Studio renderer: plain React nodes, never raw HTML. */
export function ContentRichText({ value, products = [], assets = [] }: { value: RichTextValue; products?: readonly RichTextProduct[]; assets?: readonly StudioMediaAsset[] }) {
  const productIndex = new Map(products.map((product) => [product.id, product]));
  function render(node: RichTextValue, key: string, depth: number): ReactNode {
    if (!node || typeof node !== "object" || depth > 16) return <p className={styles.warning} key={key}>This content needs a supported document structure.</p>;
    const children = Array.isArray(node.content) ? node.content.map((child, index) => render(child, `${key}-${index}`, depth + 1)) : null;
    if (node.type === "text") {
      let text: ReactNode = typeof node.text === "string" ? node.text : "";
      for (const [index, mark] of (node.marks ?? []).entries()) {
        if (mark.type === "bold") text = <strong key={`${key}-mark-${index}`}>{text}</strong>;
        if (mark.type === "italic") text = <em key={`${key}-mark-${index}`}>{text}</em>;
        if (mark.type === "link") {
          const href = safeRichTextHref(mark.attrs?.href);
          text = href ? <a href={href} key={`${key}-mark-${index}`} rel="noopener noreferrer">{text}</a> : <span key={`${key}-mark-${index}`} className={styles.warning}>{text} [unavailable link]</span>;
        }
      }
      return <span key={key}>{text}</span>;
    }
    switch (node.type) {
      case "doc": return <div key={key}>{children}</div>;
      case "paragraph": return <p key={key}>{children ?? <br />}</p>;
      case "heading": return node.attrs?.level === 3 ? <h3 key={key}>{children}</h3> : node.attrs?.level === 2 ? <h2 key={key}>{children}</h2> : <p className={styles.warning} key={key}>Unsupported heading. {children}</p>;
      case "hardBreak": return <br key={key} />;
      case "blockquote": return <blockquote key={key}>{children}</blockquote>;
      case "bulletList": return <ul key={key}>{children}</ul>;
      case "orderedList": return <ol key={key} start={Number.isInteger(node.attrs?.start) && node.attrs!.start > 0 && node.attrs!.start <= 9999 ? node.attrs!.start : 1}>{children}</ol>;
      case "listItem": return <li key={key}>{children}</li>;
      case "mediaAsset": {
        const attrs = node.attrs ?? {};
        const reference: AssetReference = { assetId: typeof attrs.assetId === "string" ? attrs.assetId : "", alt: typeof attrs.alt === "string" ? attrs.alt : "", caption: typeof attrs.caption === "string" ? attrs.caption : "", focalPoint: { x: typeof attrs.focalPoint?.x === "number" ? attrs.focalPoint.x : 50, y: typeof attrs.focalPoint?.y === "number" ? attrs.focalPoint.y : 50 } };
        return <MediaAssetFigure key={key} reference={reference} assets={assets} />;
      }
      case "productReference": {
        const product = productIndex.get(node.attrs?.productId);
        return product && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(product.slug) ? <aside key={key} className={styles.product}><span>Referenced demo study · {product.id}</span><Link href={`/pieces/${product.slug}`}>{product.title}<span aria-hidden="true"> ↗</span></Link></aside> : <p key={key} className={styles.warning}>Product reference unavailable. Choose an existing study in the editor.</p>;
      }
      default: return <p key={key} className={styles.warning}>Unsupported content block. Edit this draft before publication.</p>;
    }
  }
  return <div className={styles.prose}>{render(value, "rich-text", 0)}</div>;
}
