"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { Arrow } from "./ui/arrow";
import styles from "./inquiry-recovery.module.css";

type InquiryRecoveryProps = {
  summary: string;
  onEdit?: () => void;
  focusOnMount?: boolean;
};

/** A visual handoff example. No messaging destination or transport is invoked. */
export function InquiryRecovery({ summary, onEdit, focusOnMount = false }: InquiryRecoveryProps) {
  const id = useId();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [copyStatus, setCopyStatus] = useState("");
  const [copying, setCopying] = useState(false);
  const [manualCopy, setManualCopy] = useState(false);

  useEffect(() => {
    if (focusOnMount || retryCount > 0) headingRef.current?.focus();
  }, [focusOnMount, retryCount]);

  useEffect(() => {
    if (manualCopy) {
      textRef.current?.focus();
      textRef.current?.select();
    }
  }, [manualCopy]);

  async function copySummary() {
    if (copying) return;
    setCopying(true);
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(summary);
      setCopyStatus("Demo summary copied. Nothing has been sent to the atelier.");
    } catch {
      setManualCopy(true);
      setCopyStatus("Automatic copy is unavailable. Select and copy the plain text below.");
      textRef.current?.focus();
      textRef.current?.select();
    } finally {
      setCopying(false);
    }
  }

  return <section className={styles.recovery} aria-labelledby={`${id}-heading`}>
    <p className="eyebrow">Simulated WhatsApp fallback · nothing sent or saved</p>
    <h3 id={`${id}-heading`} ref={headingRef} tabIndex={-1}>When the conversation<br /><em>cannot open.</em></h3>
    <p className={styles.introduction}>This demonstrates a blocked handoff. WhatsApp has not been opened, and no message or enquiry exists. Your demo summary remains in this page.</p>
    <div className={styles.state}>
      <span className={styles.symbol} aria-hidden="true">↗</span>
      <div><strong>{retryCount > 0 ? "The retry example is still blocked" : "Blocked handoff example"}</strong><p>{retryCount > 0 ? "The local retry changes only this display. No browser window, message or saved request was created." : "You can copy the demo summary, explore a retry, or return to your brief."}</p></div>
    </div>
    <div className={styles.actions}>
      <button type="button" className="button button-primary" disabled={copying} onClick={copySummary}>{copying ? "Copying demo summary…" : "Copy demo summary"}<Arrow /></button>
      <button type="button" className={styles.outlineButton} onClick={() => setRetryCount((count) => count + 1)}>Retry handoff simulation</button>
      {onEdit && <button type="button" className={styles.textButton} onClick={onEdit}>Return to sample brief <span aria-hidden="true">↗</span></button>}
      <Link className={styles.textButton} href="/contact">Atelier contact options <span aria-hidden="true">↗</span></Link>
    </div>
    <p className={styles.status} role="status">{copyStatus}</p>
    {manualCopy && <div className={styles.manualCopy}>
      <label htmlFor={`${id}-summary`}>Plain-text demo summary</label>
      <textarea id={`${id}-summary`} ref={textRef} readOnly value={summary} rows={10} />
    </div>}
    <p className={styles.note}>Copying is optional and places the fictional summary on your device clipboard. Visiting another page clears an unsaved brief. A future live handoff must follow a successful save; opening WhatsApp alone never confirms an order.</p>
  </section>;
}

type InquirySaveFailureProps = {
  onRetry?: () => void;
  onEdit?: () => void;
  focusOnMount?: boolean;
};

/** The containing form owns the draft, so entering this state cannot clear it. */
export function InquirySaveFailure({ onRetry, onEdit, focusOnMount = false }: InquirySaveFailureProps) {
  const id = useId();
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (focusOnMount) headingRef.current?.focus();
  }, [focusOnMount]);

  return <section className={styles.recovery} aria-labelledby={`${id}-heading`}>
    <p className="eyebrow">Simulated save failure · no real save attempted</p>
    <h2 id={`${id}-heading`} ref={headingRef} tabIndex={-1}>A pause,<br /><em>not a lost brief.</em></h2>
    <p className={styles.introduction}>This is the failed-save layout. Nothing was sent or saved, and no receipt or reference number has been issued.</p>
    <div className={styles.state}>
      <span className={styles.symbol} aria-hidden="true">!</span>
      <div><strong>Your example stays in this open page</strong><p>Your entered details, local reference and acknowledgement are preserved. Leaving or reloading clears this unsaved example.</p></div>
    </div>
    <div className={styles.actions}>
      {onRetry && <button type="button" className="button button-primary" onClick={onRetry}>Retry receipt simulation <Arrow /></button>}
      {onEdit && <button type="button" className={styles.outlineButton} onClick={onEdit}>Edit sample brief</button>}
      <Link className={styles.textButton} href="/contact">Atelier contact options <span aria-hidden="true">↗</span></Link>
    </div>
    <p className={styles.note}>Retrying here displays one local simulated receipt. It does not create a database record or open WhatsApp. A real failed save must be resolved before a live message handoff.</p>
  </section>;
}
