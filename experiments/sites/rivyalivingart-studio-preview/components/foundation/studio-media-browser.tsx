"use client";

import { useId, useState } from "react";
import { ConceptImage } from "@/components/foundation/concept-image";
import type { StudioMediaAsset } from "@/lib/rivya/source/studio-media";
import styles from "./studio-media.module.css";

export function StudioMediaBrowser({ assets, selectedId, onChoose, disabled, allowPending = false }: { assets: readonly StudioMediaAsset[]; selectedId: string | null; onChoose: (asset: StudioMediaAsset) => void; disabled: boolean; allowPending?: boolean }) {
  const id = useId();
  const [query, setQuery] = useState("");
  const [tier, setTier] = useState("all");
  const [status, setStatus] = useState("all");
  const [usage, setUsage] = useState("all");
  const filtered = assets.filter((asset) => (tier === "all" || asset.tier === tier) && (status === "all" || asset.status === status)
    && (usage === "all" || (usage === "in-use" ? asset.usage.length > 0 : asset.usage.length === 0))
    && [asset.id, asset.title, ...asset.tags, ...asset.usage.map((entry) => entry.label)].join(" ").toLowerCase().includes(query.trim().toLowerCase()));
  const activeFilters = query || tier !== "all" || status !== "all" || usage !== "all";
  return <div className={styles.browser}>
    <fieldset className={styles.filters} disabled={disabled}>
      <legend className={styles.srOnly}>Find media assets and expected visual slots</legend>
      <label className={styles.search} htmlFor={`${id}-search`}>Search assets<input id={`${id}-search`} type="search" value={query} placeholder="Name, ID, tag or usage…" maxLength={160} onChange={(event) => setQuery(event.target.value)} /></label>
      <label htmlFor={`${id}-tier`}>Collection tier<select id={`${id}-tier`} value={tier} onChange={(event) => setTier(event.target.value)}><option value="all">All tiers</option><option value="LARGE">LARGE · Furniture</option><option value="MEDIUM">MEDIUM · Memory</option><option value="SMALL">SMALL · Personal</option></select></label>
      <label htmlFor={`${id}-status`}>Rights / source<select id={`${id}-status`} value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">All source states</option><option value="PREVIEW_ONLY">Preview only</option><option value="PENDING">Source pending</option></select></label>
      <label htmlFor={`${id}-usage`}>Source usage<select id={`${id}-usage`} value={usage} onChange={(event) => setUsage(event.target.value)}><option value="all">All references</option><option value="in-use">Referenced slots</option><option value="unused">Unreferenced assets</option></select></label>
    </fieldset>
    <div className={styles.resultBar}><p role="status">{filtered.length} of {assets.length} asset records</p>{activeFilters && <button className={styles.textButton} disabled={disabled} type="button" onClick={() => { setQuery(""); setTier("all"); setStatus("all"); setUsage("all"); }}>Clear filters</button>}</div>
    {filtered.length ? <ul className={styles.assetGrid}>{filtered.map((asset) => <li key={asset.id}>
      <button type="button" className={styles.assetCard} aria-pressed={selectedId === asset.id} disabled={disabled || (!allowPending && asset.status === "PENDING")} onClick={() => onChoose(asset)} aria-label={`${allowPending ? "Inspect" : "Choose"} ${asset.title}${asset.status === "PENDING" ? " — source pending" : " — preview only"}`}>
        <span className={styles.thumbnail}><ConceptImage src={asset.status === "PREVIEW_ONLY" ? asset.src : null} alt={asset.alt} fill sizes="(max-width: 600px) 40vw, 220px" style={{ objectFit: "cover" }} compact /></span>
        <span className={styles.assetText}><span className={styles.assetTitle}>{asset.title}</span><span className={styles.assetMeta}>{asset.tier} <span aria-hidden="true">·</span> {asset.status === "PENDING" ? "Source pending" : "Preview only"}</span><span className={styles.assetId}>{asset.id}</span></span>
      </button>
    </li>)}</ul> : <div className={styles.empty}><p>No matching media records.</p><p>Change the filters to find a concept visual or an expected product slot.</p></div>}
  </div>;
}
