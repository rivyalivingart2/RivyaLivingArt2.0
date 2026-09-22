"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { createPortal } from "react-dom";
import type { AssetReference, StudioMediaAsset } from "@/lib/studio-media";
import { StudioMediaBrowser } from "./studio-media-browser";
import { MediaAssetFigure } from "./studio-media-figure";
import styles from "./studio-media.module.css";

const subscribeToHydration = () => () => {};
const clientHydrated = () => true;
const serverHydrated = () => false;

export function MediaPicker({ assets, value, onSelect, onClose }: { assets: readonly StudioMediaAsset[]; value?: AssetReference | null; onSelect: (value: AssetReference) => void; onClose: () => void }) {
  const hydrated = useSyncExternalStore(subscribeToHydration, clientHydrated, serverHydrated);
  const id = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const errorsRef = useRef<HTMLDivElement>(null);
  const [draft, setDraft] = useState<AssetReference | null>(() => value ? { ...value, focalPoint: { ...value.focalPoint } } : null);
  const [error, setError] = useState("");
  const selected = assets.find((asset) => asset.id === draft?.assetId);

  useEffect(() => {
    if (!hydrated) return;
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const dialog = dialogRef.current;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    if (dialog && !dialog.open) dialog.showModal();
    return () => { if (dialog?.open) dialog.close(); document.documentElement.style.overflow = previousOverflow; if (trigger?.isConnected) trigger.focus(); };
  }, [hydrated]);

  useEffect(() => { if (error) errorsRef.current?.focus(); }, [error]);

  function choose(asset: StudioMediaAsset) {
    if (asset.status !== "PREVIEW_ONLY" || !asset.src) return;
    setDraft({ assetId: asset.id, alt: asset.alt, caption: asset.caption, focalPoint: { x: 50, y: 50 } });
    setError("");
  }

  function apply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft || selected?.status !== "PREVIEW_ONLY" || !selected.src) { setError("Choose one of the available preview visuals first."); return; }
    if (!draft.alt.trim() || !draft.caption.trim()) { setError("Add both alternative text and a usage caption before applying this media reference."); return; }
    if (draft.alt.trim().length > 300 || draft.caption.trim().length > 500) { setError("Keep alternative text within 300 characters and the caption within 500."); return; }
    if (![draft.focalPoint.x, draft.focalPoint.y].every((coordinate) => Number.isFinite(coordinate) && coordinate >= 0 && coordinate <= 100)) { setError("Choose a focal point within the image bounds."); return; }
    onSelect({ ...draft, alt: draft.alt.trim(), caption: draft.caption.trim(), focalPoint: { ...draft.focalPoint } });
    onClose();
  }

  if (!hydrated) return null;
  return createPortal(<dialog className={styles.dialog} ref={dialogRef} aria-labelledby={`${id}-title`} aria-describedby={`${id}-description`} onCancel={(event) => { event.preventDefault(); onClose(); }}>
    <header className={styles.dialogHeader}><div><p className={styles.eyebrow}>Shared media picker</p><h2 id={`${id}-title`}>Choose a concept visual</h2><p id={`${id}-description`}>This inserts a reference into your local draft. These preview-only concepts require a separate production rights review.</p></div><button type="button" className={styles.close} onClick={onClose} aria-label="Close media picker">×</button></header>
    <div className={styles.pickerLayout}>
      <StudioMediaBrowser assets={assets} selectedId={draft?.assetId ?? null} onChoose={choose} disabled={!hydrated} />
      <form className={styles.usageEditor} noValidate onSubmit={apply}>
        <fieldset className={styles.controls} disabled={!hydrated}><legend className={styles.srOnly}>Media usage in the current local draft</legend>
          <h3>Usage in this draft</h3><p className={styles.muted}>Alternative text, caption and focal point belong to this placement. Asset provenance and rights remain unchanged.</p>
          {error && <div className={styles.error} role="alert" tabIndex={-1} ref={errorsRef}>{error}</div>}
          {selected && draft ? <>
            <p className={styles.selectedName}>{selected.title}</p>
            <MediaAssetFigure reference={draft} assets={assets} />
            <label className={styles.field} htmlFor={`${id}-alt`}>Alternative text <span aria-hidden="true">*</span><textarea id={`${id}-alt`} value={draft.alt} required maxLength={300} rows={3} onChange={(event) => setDraft({ ...draft, alt: event.target.value })} /></label>
            <label className={styles.field} htmlFor={`${id}-caption`}>Usage caption <span aria-hidden="true">*</span><textarea id={`${id}-caption`} value={draft.caption} required maxLength={500} rows={3} onChange={(event) => setDraft({ ...draft, caption: event.target.value })} /></label>
            <div className={styles.focalFields}><label className={styles.field} htmlFor={`${id}-x`}>Horizontal focal point · {draft.focalPoint.x}%<input id={`${id}-x`} type="range" min={0} max={100} step={1} value={draft.focalPoint.x} onChange={(event) => setDraft({ ...draft, focalPoint: { ...draft.focalPoint, x: Number(event.target.value) } })} /></label><label className={styles.field} htmlFor={`${id}-y`}>Vertical focal point · {draft.focalPoint.y}%<input id={`${id}-y`} type="range" min={0} max={100} step={1} value={draft.focalPoint.y} onChange={(event) => setDraft({ ...draft, focalPoint: { ...draft.focalPoint, y: Number(event.target.value) } })} /></label></div>
            <p className={styles.note}>{selected.rightsNote} The visible AI concept label is always retained.</p>
          </> : <div className={styles.empty}><span className={styles.emptyMark} aria-hidden="true">+</span><p>Choose an available image to describe its use.</p><p>Pending slots are visible for planning and cannot be inserted.</p></div>}
          <div className={styles.actions}><button className={styles.primary} type="submit" disabled={!selected || selected.status !== "PREVIEW_ONLY"}>Use in local draft</button><button className={styles.secondary} type="button" onClick={onClose}>Cancel</button></div>
        </fieldset>
      </form>
    </div>
  </dialog>, document.body);
}
