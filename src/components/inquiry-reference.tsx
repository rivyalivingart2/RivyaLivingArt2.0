"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import styles from "./inquiry-reference.module.css";

type InquiryReferenceProps = {
  onSelectionChange: (label: string | null) => void;
  onPendingChange?: (pending: boolean) => void;
  resetKey: number;
};

type Preview = {
  file: File;
  url: string;
  width: number;
  height: number;
};

const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function matchesImageType(bytes: Uint8Array, type: string) {
  if (type === "image/jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (type === "image/png") return [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((byte, index) => bytes[index] === byte);
  return bytes.length >= 12 &&
    String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
    String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
}

// A new key clears the native file input and releases any previous object URL.
export function InquiryReference({ resetKey, onSelectionChange, onPendingChange }: InquiryReferenceProps) {
  return <ReferenceInput key={resetKey} onSelectionChange={onSelectionChange} onPendingChange={onPendingChange} />;
}

function ReferenceInput({ onSelectionChange, onPendingChange }: Pick<InquiryReferenceProps, "onSelectionChange" | "onPendingChange">) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(null);
  const selectionVersion = useRef(0);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [error, setError] = useState("");
  const [decoding, setDecoding] = useState(false);

  useEffect(() => () => {
    selectionVersion.current += 1;
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    objectUrlRef.current = null;
  }, []);

  function clearSelection() {
    selectionVersion.current += 1;
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    objectUrlRef.current = null;
    setPreview(null);
    setDecoding(false);
    onPendingChange?.(false);
    onSelectionChange(null);
  }

  async function chooseReference(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    if (!file) return;
    clearSelection();
    setError("");
    const version = selectionVersion.current;

    if (!ACCEPTED_TYPES.has(file.type) || file.size === 0 || file.size > MAX_BYTES) {
      setError("Choose a JPEG, PNG or WebP image that is larger than 0 bytes and no more than 5 MiB.");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setDecoding(true);
    onPendingChange?.(true);
    try {
      const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
      if (version !== selectionVersion.current) return;
      if (!matchesImageType(bytes, file.type)) throw new Error("Image type does not match its contents.");

      const url = URL.createObjectURL(file);
      objectUrlRef.current = url;
      const decoded = new window.Image();
      decoded.src = url;
      await decoded.decode();
      if (version !== selectionVersion.current) return;
      if (!decoded.naturalWidth || !decoded.naturalHeight) throw new Error("Image has no readable dimensions.");

      setPreview({ file, url, width: decoded.naturalWidth, height: decoded.naturalHeight });
      onSelectionChange(file.name);
      setDecoding(false);
      onPendingChange?.(false);
    } catch {
      if (version !== selectionVersion.current) return;
      clearSelection();
      setError("This file could not be read as a supported image. Choose another JPEG, PNG or WebP.");
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeReference() {
    clearSelection();
    setError("");
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.focus();
    }
  }

  return <section className={styles.reference} aria-labelledby={`${id}-heading`}>
    <div className={styles.heading}>
      <h3 id={`${id}-heading`}>A visual note</h3>
      <span>Optional / local preview</span>
    </div>
    <p id={`${id}-help`} className={styles.help}>Choose one safe, fictional reference image. It stays in this open page and is never uploaded or saved. Please do not choose private customer photographs.</p>
    <label className={styles.label} htmlFor={`${id}-file`}>Sample reference image</label>
    <input
      ref={inputRef}
      id={`${id}-file`}
      className={styles.input}
      type="file"
      accept="image/jpeg,image/png,image/webp"
      aria-describedby={`${id}-help ${id}-limit${error ? ` ${id}-error` : ""}`}
      aria-invalid={Boolean(error)}
      onChange={chooseReference}
    />
    <p id={`${id}-limit`} className={styles.limit}>JPEG, PNG or WebP · one image · up to 5 MiB. This is a preview limit.</p>
    <p className={styles.status} role="status">{decoding ? "Reading your image on this device…" : preview ? "Local preview ready. Nothing has been uploaded." : "No reference image selected."}</p>
    {error && <p id={`${id}-error`} className={styles.error} role="alert">{error}</p>}
    {preview && <figure className={styles.preview}>
      <Image src={preview.url} alt="Your selected fictional reference" width={preview.width} height={preview.height} unoptimized className={styles.image} />
      <figcaption>
        <div><strong>{preview.file.name}</strong><span>{(preview.file.size / (1024 * 1024)).toFixed(2)} MiB · local only</span></div>
        <button type="button" onClick={removeReference}>Remove reference</button>
      </figcaption>
    </figure>}
  </section>;
}
