"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
import styles from "./concept-image.module.css";

type Props = {
  src: string | null;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  preload?: boolean;
  className?: string;
  style?: CSSProperties;
  compact?: boolean;
  onError?: () => void;
  onLoad?: () => void;
};

/** Presentation only: safe inside a linked card or thumbnail button. */
export function MediaFallback({ reason, fill = false, compact = false }: { reason: "pending" | "failed"; fill?: boolean; compact?: boolean }) {
  const failed = reason === "failed";
  return <div className={`${styles.fallback} ${fill ? styles.fill : ""} ${compact ? styles.compact : ""}`} role="img" aria-label={failed ? "Image unavailable — the concept preview could not load" : "Demo concept — visual pending; no approved image supplied"}>
    <span className={styles.mark} aria-hidden="true" />
    <span>{failed ? "Image unavailable" : "Visual pending"}</span>
    <span className={styles.caption}>{failed ? "The sample image could not load. The concept details remain available." : "Demo concept · approved imagery to follow"}</span>
  </div>;
}

function ImageWithFallback({ src, alt, width, height, fill, sizes, preload, className, style, compact, onError, onLoad }: Props) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return <MediaFallback reason={failed ? "failed" : "pending"} fill={fill} compact={compact} />;
  }
  return <Image src={src} alt={alt} width={width} height={height} fill={fill} sizes={sizes} preload={preload} unoptimized className={className} style={style} onError={() => { setFailed(true); onError?.(); }} onLoad={(event) => { if (event.currentTarget.naturalWidth > 0) onLoad?.(); }} />;
}

/** Source changes reset the error state; no external image service is required. */
export function ConceptImage(props: Props) {
  return <ImageWithFallback key={props.src ?? "missing-image"} {...props} />;
}
