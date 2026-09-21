"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import type { Concept } from "@/lib/catalogue";
import { ConceptImage } from "@/components/concept-image";
import styles from "./product-gallery.module.css";

export function ProductGallery({ title, gallery }: { title: string; gallery: Concept["gallery"] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [failedSources, setFailedSources] = useState<readonly string[]>([]);
  const active = gallery[activeIndex];
  const canZoom = active && !failedSources.includes(active.src);
  const zoom = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const previousOverflow = useRef("");
  const previousScroll = useRef({ x: 0, y: 0 });
  const headingId = useId();

  useEffect(() => {
    const dialog = zoom.current;
    return () => {
      if (dialog?.open) document.body.style.overflow = previousOverflow.current;
    };
  }, []);

  function openZoom() {
    if (!canZoom || zoom.current?.open) return;
    previousScroll.current = { x: window.scrollX, y: window.scrollY };
    previousOverflow.current = document.body.style.overflow;
    zoom.current?.showModal();
    document.body.style.overflow = "hidden";
    setZoomOpen(true);
  }

  function onClose() {
    setZoomOpen(false);
    document.body.style.overflow = previousOverflow.current;
    trigger.current?.focus({ preventScroll: true });
    window.scrollTo(previousScroll.current.x, previousScroll.current.y);
  }

  function containFocus(event: KeyboardEvent<HTMLDialogElement>) {
    // The close button is the dialog's only interactive control.
    if (event.key === "Tab" && !event.altKey && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();
      closeButton.current?.focus();
    }
  }

  function markFailed(src: string) {
    setFailedSources((sources) => sources.includes(src) ? sources : [...sources, src]);
  }

  return <div className={styles.gallery}>
    <figure>
      <div className={styles.frame}>
        <ConceptImage src={active?.src ?? null} alt={active?.alt ?? "Visual pending"} fill sizes="(max-width: 900px) 90vw, 48vw" onError={() => active && markFailed(active.src)} />
        {active && <span className={styles.badge}>AI concept · preview image</span>}
        {canZoom && <button ref={trigger} type="button" className={styles.zoomTrigger} onClick={openZoom} aria-haspopup="dialog">View image <span aria-hidden="true">↗</span></button>}
      </div>
      <figcaption className={styles.caption}>
        <span>{active?.caption ?? "Imagery for this fictional study is still pending. The sample specifications below do not describe a verified product."}</span>
        {active && <span className={styles.resolution}>Low-resolution concept preview · {active.width} × {active.height} px. Additional views are not yet supplied.</span>}
      </figcaption>
    </figure>
    {gallery.length > 1 && <div className={styles.thumbnails} aria-label="Choose a gallery image">{gallery.map((item, index) => <button type="button" key={item.src} onClick={() => setActiveIndex(index)} aria-pressed={index === activeIndex} aria-label={`Show image ${index + 1}: ${item.caption}`}><ConceptImage src={item.src} alt="" width={80} height={100} /><span>{index + 1}</span></button>)}</div>}
    <dialog ref={zoom} className={styles.zoom} aria-labelledby={headingId} onClose={onClose} onKeyDown={containFocus}>
      <div className={styles.zoomHeader}><h2 id={headingId}>{title} — concept image</h2><button ref={closeButton} type="button" onClick={() => zoom.current?.close()}>Close <span aria-hidden="true">×</span></button></div>
      {zoomOpen && active && <div className={styles.zoomImage}><ConceptImage src={active.src} alt={active.alt} width={active.width} height={active.height} style={{ maxWidth: `min(100%, ${active.width}px)`, maxHeight: "65dvh", width: "auto", height: "auto", objectFit: "contain" }} onError={() => markFailed(active.src)} /></div>}
      <p className={styles.zoomCaption}>AI-generated concept. This is the same low-resolution preview, shown within its original pixel dimensions.</p>
    </dialog>
  </div>;
}
