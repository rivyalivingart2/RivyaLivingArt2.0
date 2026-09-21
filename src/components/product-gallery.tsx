"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import type { Concept } from "@/lib/catalogue";
import { ConceptImage } from "@/components/concept-image";
import styles from "./product-gallery.module.css";

type ImageState = "loading" | "loaded" | "failed";

export function ProductGallery({ title, gallery }: { title: string; gallery: Concept["gallery"] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [imageStates, setImageStates] = useState<Record<string, ImageState>>({});
  const [attempts, setAttempts] = useState<Record<string, number>>({});
  const [zoomState, setZoomState] = useState<ImageState>("loading");
  const [zoomAttempt, setZoomAttempt] = useState(0);
  const active = gallery[activeIndex];
  const activeState = active ? imageStates[active.src] ?? "loading" : null;
  const activeAttempt = active ? attempts[active.src] ?? 0 : 0;
  const canZoom = Boolean(active && activeState === "loaded");
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
    setZoomState("loading");
    setZoomAttempt(0);
    setZoomOpen(true);
  }

  function onClose() {
    setZoomOpen(false);
    document.body.style.overflow = previousOverflow.current;
    trigger.current?.focus({ preventScroll: true });
    window.scrollTo(previousScroll.current.x, previousScroll.current.y);
  }

  function containFocus(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== "Tab" || event.altKey || event.ctrlKey || event.metaKey) return;
    const controls = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>("button:not(:disabled)"));
    const first = controls[0];
    const last = controls.at(-1);
    if (!first || !last) return;
    if (event.shiftKey && (document.activeElement === first || !controls.includes(document.activeElement as HTMLButtonElement))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (document.activeElement === last || !controls.includes(document.activeElement as HTMLButtonElement))) {
      event.preventDefault();
      first.focus();
    }
  }

  function markImage(src: string, state: ImageState) {
    setImageStates((states) => ({ ...states, [src]: state }));
  }

  function selectImage(index: number) {
    if (index === activeIndex || !gallery[index]) return;
    markImage(gallery[index].src, "loading");
    setActiveIndex(index);
  }

  function retryImage() {
    if (!active || activeState === "loading") return;
    markImage(active.src, "loading");
    // Remount the same supplied source. Never append cache-busting parameters,
    // substitute another product's image, or retry automatically.
    setAttempts((values) => ({ ...values, [active.src]: (values[active.src] ?? 0) + 1 }));
  }

  function retryZoom() {
    if (zoomState === "loading") return;
    setZoomState("loading");
    setZoomAttempt((attempt) => attempt + 1);
  }

  return <div className={styles.gallery}>
    <figure>
      <div className={styles.frame} aria-busy={activeState === "loading"}>
        <ConceptImage key={`${active?.src ?? "pending"}:${activeAttempt}`} src={active?.src ?? null} alt={active?.alt ?? "Visual pending"} fill sizes="(max-width: 900px) 90vw, 48vw" onError={() => active && markImage(active.src, "failed")} onLoad={() => active && markImage(active.src, "loaded")} />
        {active && <span className={styles.badge}>AI concept · preview image</span>}
        {active && <button ref={trigger} type="button" className={styles.zoomTrigger} onClick={openZoom} disabled={!canZoom} aria-haspopup="dialog">{activeState === "loading" ? "Loading image…" : "View image"} <span aria-hidden="true">↗</span></button>}
      </div>
      <figcaption className={styles.caption}>
        <span>{active?.caption ?? "Imagery for this fictional study is still pending. The sample specifications below do not describe a verified product."}</span>
        {active && <span className={styles.resolution}>Low-resolution concept preview · {active.width} × {active.height} px. Additional views are not yet supplied.</span>}
      </figcaption>
    </figure>
    {active && (activeState === "failed" || activeAttempt > 0) && <div className={styles.recovery}>
      <p role="status">{activeState === "failed" ? "This preview could not load. You can retry it or continue reading the concept details." : activeState === "loading" ? "Trying the same preview image again…" : "The preview is available again. You can open it above."}</p>
      <button type="button" onClick={retryImage} aria-disabled={activeState === "loading"}>{activeState === "loaded" ? "Reload image" : "Retry image"}</button>
    </div>}
    {gallery.length > 1 && <div className={styles.thumbnails} aria-label="Choose a gallery image">{gallery.map((item, index) => <button type="button" key={item.src} onClick={() => selectImage(index)} aria-pressed={index === activeIndex} aria-label={`Show image ${index + 1}: ${item.caption}`}><ConceptImage key={`${item.src}:${attempts[item.src] ?? 0}`} src={item.src} alt="" width={80} height={100} compact /><span className={styles.thumbnailNumber}>{index + 1}</span></button>)}</div>}
    <dialog ref={zoom} className={styles.zoom} aria-labelledby={headingId} onClose={onClose} onKeyDown={containFocus}>
      <div className={styles.zoomHeader}><h2 id={headingId}>{title} — concept image</h2><button ref={closeButton} type="button" onClick={() => zoom.current?.close()}>Close <span aria-hidden="true">×</span></button></div>
      {zoomOpen && active && <div className={styles.zoomImage} aria-busy={zoomState === "loading"}><ConceptImage key={`${active.src}:zoom:${zoomAttempt}`} src={active.src} alt={active.alt} width={active.width} height={active.height} style={{ maxWidth: `min(100%, ${active.width}px)`, maxHeight: "65dvh", width: "auto", height: "auto", objectFit: "contain" }} onError={() => setZoomState("failed")} onLoad={() => setZoomState("loaded")} /></div>}
      {zoomOpen && (zoomState !== "loaded" || zoomAttempt > 0) && <div className={styles.recovery}>
        <p role="status">{zoomState === "failed" ? "The enlarged preview could not load. Retry this image, or close the view to return to the concept." : zoomState === "loading" ? "Loading the enlarged preview…" : "The enlarged preview is available again."}</p>
        {(zoomState === "failed" || zoomAttempt > 0) && <button type="button" onClick={retryZoom} aria-disabled={zoomState === "loading"}>{zoomState === "loaded" ? "Reload enlarged image" : "Retry enlarged image"}</button>}
      </div>}
      <p className={styles.zoomCaption}>AI-generated concept. This is the same low-resolution preview, shown within its original pixel dimensions.</p>
    </dialog>
  </div>;
}
