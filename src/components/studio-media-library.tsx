"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import type { AssetReference, StudioMediaAsset } from "@/lib/studio-media";
import { StudioMediaBrowser } from "./studio-media-browser";
import { MediaAssetFigure } from "./studio-media-figure";
import { MediaPicker } from "./studio-media-picker";
import styles from "./studio-media.module.css";

const subscribeToHydration = () => () => {};
const clientHydrated = () => true;
const serverHydrated = () => false;

export function StudioMediaLibrary({ assets }: { assets: readonly StudioMediaAsset[] }) {
  const hydrated = useSyncExternalStore(subscribeToHydration, clientHydrated, serverHydrated);
  const [selectedId, setSelectedId] = useState<string | null>(assets[0]?.id ?? null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [example, setExample] = useState<AssetReference | null>(null);
  const selected = assets.find((asset) => asset.id === selectedId);
  const mapped = assets.filter((asset) => asset.status === "PREVIEW_ONLY").length;
  return <section className={styles.library} aria-labelledby="media-library-title">
    <header className={styles.header}><div><p className={styles.eyebrow}>Studio / Media</p><h1 id="media-library-title">A considered image library.</h1><p>Demo media records · source review and production approval remain separate.</p></div><button className={styles.secondary} type="button" disabled={!hydrated} onClick={() => setPickerOpen(true)}>Open shared picker <span aria-hidden="true">↗</span></button></header>
    <div className={styles.summary}><span className={styles.badge}>Demo dataset</span><span><strong>{mapped}</strong> preview derivatives</span><span><strong>{assets.length - mapped}</strong> expected visual slots</span><span>No production-approved assets</span></div>
    <div className={styles.integrationNote}><div><h2>Owner media, with a traceable source.</h2><p>This source library contains public concept derivatives and expected product slots. Private customer attachments are excluded. Upload, replacement, approval and deletion require the later authenticated storage integration.</p></div><button type="button" className={styles.secondary} disabled aria-describedby="media-upload-note">Upload unavailable</button><span id="media-upload-note" className={styles.srOnly}>Upload is not connected to storage in this frontend presentation.</span></div>
    <noscript><p className={styles.note}>JavaScript is required for local filters and the media picker. All controls remain disabled until the presentation is ready.</p></noscript>
    <div className={styles.libraryLayout}>
      <StudioMediaBrowser assets={assets} selectedId={selectedId} onChoose={(asset) => setSelectedId(asset.id)} disabled={!hydrated} allowPending />
      <aside className={styles.assetDetail} aria-labelledby="media-detail-title">
        {selected ? <><p className={styles.eyebrow}>{selected.id}</p><h2 id="media-detail-title">{selected.title}</h2><span className={styles.badge}>{selected.status === "PREVIEW_ONLY" ? "Preview only · not production approved" : "Expected slot · no source supplied"}</span>
          <MediaAssetFigure reference={{ assetId: selected.id, alt: selected.alt, caption: selected.caption, focalPoint: { x: 50, y: 50 } }} assets={assets} />
          <dl className={styles.facts}><div><dt>Dimensions</dt><dd>{selected.width && selected.height ? `${selected.width} × ${selected.height} px` : "Not available"}</dd></div><div><dt>File size</dt><dd>{selected.bytes === null ? "No file" : `${selected.bytes.toLocaleString("en-IN")} bytes · AVIF`}</dd></div><div><dt>Classification</dt><dd>{selected.status === "PREVIEW_ONLY" ? "AI-generated fictional concept" : "Unfilled concept visual slot"}</dd></div><div><dt>Collection tier</dt><dd>{selected.tier}</dd></div><div><dt>Prefix</dt><dd>concepts / {selected.tier.toLowerCase()}</dd></div><div><dt>Production approver</dt><dd>Not recorded</dd></div></dl>
          <section className={styles.detailSection}><h3>Rights & source</h3><p>{selected.rightsNote}</p><p>{selected.provenance}</p></section>
          <section className={styles.detailSection}><h3>Quality</h3><p>{selected.qualityNote}</p></section>
          <section className={styles.detailSection}><h3>Default description</h3><p>{selected.alt || "Alternative text will be authored when an image is supplied."}</p><p>Default focal point: horizontal 50%, vertical 50%. Each draft placement may override this without changing the source asset.</p></section>
          <section className={styles.detailSection}><h3>Tags</h3><ul className={styles.tags}>{selected.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul></section>
          <section className={styles.detailSection}><h3>Source references · {selected.usage.length}</h3><p>Known product-slot assignments. Local editor placements are not persisted in this report.</p><ul className={styles.usageLinks}>{selected.usage.map((entry) => <li key={entry.id}><Link href={entry.href}>{entry.label} <span aria-hidden="true">↗</span></Link></li>)}</ul></section>
          <div className={styles.deleteBlock}><button type="button" className={styles.secondary} disabled aria-describedby="media-delete-note">{selected.usage.length ? "Removal blocked · referenced" : "Deletion unavailable"}</button><p id="media-delete-note">{selected.usage.length ? "This asset or expected slot is referenced by source content. Resolve those references before requesting removal in the future connected library." : "Deletion requires the later authenticated storage integration."}</p></div>
        </> : <div className={styles.empty}><h2 id="media-detail-title">Choose a media record</h2><p>Source details and usage references will appear here.</p></div>}
      </aside>
    </div>
    {example && <section className={styles.example} aria-labelledby="media-local-example"><div><p className={styles.eyebrow}>Local placement example</p><h2 id="media-local-example">Your selected usage</h2><p>The picker returned this reference in this tab only. Source asset metadata and public pages have not changed. Reloading or leaving this page clears it.</p><button type="button" className={styles.textButton} onClick={() => setExample(null)}>Clear local example</button></div><MediaAssetFigure reference={example} assets={assets} /></section>}
    {pickerOpen && <MediaPicker assets={assets} value={example} onSelect={setExample} onClose={() => setPickerOpen(false)} />}
  </section>;
}
