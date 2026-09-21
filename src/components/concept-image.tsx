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
  onError?: () => void;
};

function ImageWithFallback({ src, alt, width, height, fill, sizes, preload, className, style, onError }: Props) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return <div className={`${styles.fallback} ${fill ? styles.fill : ""}`} role="img" aria-label={failed ? "Image unavailable — the concept preview could not load" : "Demo concept — visual pending"}>
      <span className={styles.mark} aria-hidden="true" />
      <span>{failed ? "Image unavailable" : "Visual pending"}</span>
      <span className={styles.caption}>{failed ? "Sample concept · preview could not load" : "Demo concept · imagery to follow"}</span>
    </div>;
  }
  return <Image src={src} alt={alt} width={width} height={height} fill={fill} sizes={sizes} preload={preload} unoptimized className={className} style={style} onError={() => { setFailed(true); onError?.(); }} />;
}

/** Source changes reset the error state; no external image service is required. */
export function ConceptImage(props: Props) {
  return <ImageWithFallback key={props.src ?? "missing-image"} {...props} />;
}
