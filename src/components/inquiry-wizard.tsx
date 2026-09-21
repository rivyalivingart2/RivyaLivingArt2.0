"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import {
  fictionalDemoValues,
  isInquiryFieldVisible,
  normalizeInquiryValues,
  summarizeInquiry,
  validateInquiry,
  validateStep,
  type InquiryConfig,
  type InquiryField,
  type InquiryValues,
} from "@/lib/inquiry-schema";
import { Arrow } from "./ui/arrow";
import { InquiryReference } from "./inquiry-reference";
import { InquiryRecovery, InquirySaveFailure } from "./inquiry-recovery";
import styles from "./inquiry-wizard.module.css";

type FieldErrors = Record<string, string>;
type FocusTarget = "heading" | "errors" | { field: string };
type WizardView = "form" | "save-failed" | "receipt";
const subscribeToHydration = () => () => {};
const hydratedSnapshot = () => true;
const serverSnapshot = () => false;

const journeyNotes = {
  commission: {
    title: "A piece begins with a place.",
    note: "Explore scale, material and the setting around the piece. Approximate dimensions are enough for this sample brief.",
    reminder: "Site access, feasibility and a final quotation would be confirmed in a real atelier conversation.",
  },
  preserve: {
    title: "Make room for a memory.",
    note: "Describe the occasion and the objects you imagine preserving. Every material needs individual assessment.",
    reminder: "Do not send flowers or keepsakes. Packing, shipping and suitability guidance need owner approval before a real request.",
  },
  personalize: {
    title: "A small, thoughtful detail.",
    note: "Explore the permitted variants and a personal touch, then bring the example together in a compact brief.",
    reminder: "This sample does not calculate a binding total, reserve a piece or create an order.",
  },
};

function RequiredMark({ required }: { required: boolean }) {
  return <span className={styles.requirement}>{required ? "Required" : "Optional"}</span>;
}

function InquiryInput({ field, values, error, inputId, onChange }: {
  field: InquiryField;
  values: InquiryValues;
  error?: string;
  inputId: string;
  onChange: (id: string, value: string) => void;
}) {
  const required = Boolean(field.required || (field.requiredWhen && values[field.requiredWhen.field] === field.requiredWhen.value));
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;
  const describedBy = [field.hint ? hintId : "", error ? errorId : ""].filter(Boolean).join(" ") || undefined;
  const value = values[field.id] ?? "";
  const common = {
    "aria-describedby": describedBy,
    "aria-invalid": error ? true as const : undefined,
    required,
  };
  const notes = <>{field.hint && <p id={hintId} className={styles.hint}>{field.hint}</p>}{error && <p id={errorId} className={styles.fieldError}>{error}</p>}</>;

  if (field.type === "radio") {
    return <fieldset className={`${styles.field} ${styles.fieldWide} ${styles.choiceField}`} aria-describedby={describedBy}>
      <legend>{field.label} <RequiredMark required={required} /></legend>
      <div className={styles.radioOptions}>{field.options?.map((option, index) => <label key={option.value} className={styles.radioOption}>
        <input {...common} id={index === 0 ? inputId : `${inputId}-${index}`} type="radio" name={inputId} value={option.value} checked={value === option.value} onChange={() => onChange(field.id, option.value)} />
        <span>{option.label}</span>
      </label>)}</div>
      {notes}
    </fieldset>;
  }
  if (field.type === "checkbox") {
    return <div className={`${styles.field} ${styles.fieldWide}`}>
      <label className={styles.checkboxLabel} htmlFor={inputId}>
        <input {...common} id={inputId} name={field.id} type="checkbox" checked={value === "yes"} onChange={(event) => onChange(field.id, event.target.checked ? "yes" : "")} />
        <span>{field.label} <RequiredMark required={required} /></span>
      </label>
      {notes}
    </div>;
  }
  return <div className={`${styles.field} ${field.type === "textarea" ? styles.fieldWide : ""}`}>
    <label htmlFor={inputId}>{field.label} <RequiredMark required={required} /></label>
    {field.type === "select" ? <select {...common} id={inputId} name={field.id} value={value} onChange={(event) => onChange(field.id, event.target.value)}>
      <option value="">Choose an option</option>
      {field.options?.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
    </select> : field.type === "textarea" ? <textarea {...common} id={inputId} name={field.id} value={value} rows={4} minLength={field.minLength} maxLength={field.maxLength} placeholder={field.placeholder} onChange={(event) => onChange(field.id, event.target.value)} /> : <input {...common} id={inputId} name={field.id} type={field.type} value={value} min={field.min} max={field.max} step={field.type === "number" ? field.integer ? 1 : "any" : undefined} minLength={field.minLength} maxLength={field.maxLength} placeholder={field.placeholder} autoComplete="off" onChange={(event) => onChange(field.id, event.target.value)} />}
    {notes}
    {field.type === "textarea" && field.maxLength && <span className={styles.characterCount}>{value.length} / {field.maxLength}</span>}
  </div>;
}

export function InquiryWizard({ config }: { config: InquiryConfig }) {
  const isHydrated = useSyncExternalStore(subscribeToHydration, hydratedSnapshot, serverSnapshot);
  const [values, setValues] = useState<InquiryValues>({ ...config.initialValues });
  const [stepIndex, setStepIndex] = useState(0);
  const [furthestStep, setFurthestStep] = useState(0);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [view, setView] = useState<WizardView>("form");
  const [showHandoffExample, setShowHandoffExample] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const [showPlainText, setShowPlainText] = useState(false);
  const [referenceLabel, setReferenceLabel] = useState<string | null>(null);
  const [referenceResetKey, setReferenceResetKey] = useState(0);
  const [referencePending, setReferencePending] = useState(false);
  const [focusRequest, setFocusRequest] = useState(0);
  const [focusTarget, setFocusTarget] = useState<FocusTarget>("heading");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const plainTextRef = useRef<HTMLTextAreaElement>(null);
  const wizardId = useId();
  const step = config.steps[stepIndex];
  const note = journeyNotes[config.mode];
  const summary = summarizeInquiry(config, values);
  const allFields = config.steps.flatMap((item) => item.fields);
  const errorEntries = Object.entries(errors);
  const inputId = (fieldId: string) => `${wizardId}-${fieldId}`;
  const plainText = [
    "RivyaLivingArt — FICTIONAL DEMO SUMMARY",
    "SIMULATED ONLY — NOT SENT OR SAVED",
    config.title,
    config.product ? `Sample concept: ${config.product.name}` : "An open sample brief",
    ...summary.flatMap((section) => ["", section.title, ...section.items.map((item) => `${item.label}: ${item.value}`)]),
    `Local reference: ${referenceLabel || "Not selected"} — never uploaded`,
    "",
    "No enquiry, reservation, quotation or order has been created.",
  ].join("\n");

  useEffect(() => {
    if (!focusRequest) return;
    if (focusTarget === "heading") headingRef.current?.focus();
    else if (focusTarget === "errors") errorRef.current?.focus();
    else document.getElementById(`${wizardId}-${focusTarget.field}`)?.focus();
  }, [focusRequest, focusTarget, wizardId]);

  useEffect(() => {
    if (showPlainText) {
      plainTextRef.current?.focus();
      plainTextRef.current?.select();
    }
  }, [showPlainText]);

  function requestFocus(target: FocusTarget) {
    setFocusTarget(target);
    setFocusRequest((request) => request + 1);
  }

  function updateValue(id: string, value: string) {
    const next = { ...values, [id]: value };
    setValues(next);
    setErrors((previous) => Object.fromEntries(Object.entries(previous).filter(([key]) => key !== id && allFields.some((field) => field.id === key && isInquiryFieldVisible(field, next)))));
    setAnnouncement("");
  }

  function moveTo(index: number) {
    setStepIndex(index);
    setErrors({});
    setView("form");
    setShowHandoffExample(false);
    setAnnouncement("");
    requestFocus("heading");
  }

  function focusField(id: string) {
    const fieldStep = config.steps.findIndex((item) => item.fields.some((field) => field.id === id));
    if (fieldStep >= 0) setStepIndex(fieldStep);
    requestFocus({ field: id });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (referencePending || view !== "form") return;
    const foundErrors = step.kind === "review" ? validateInquiry(config, values) : validateStep(config, stepIndex, values);
    setErrors(foundErrors);
    if (Object.keys(foundErrors).length) {
      requestFocus("errors");
      return;
    }
    if (step.kind === "review") {
      showReceipt();
      return;
    }
    const next = Math.min(stepIndex + 1, config.steps.length - 1);
    setStepIndex(next);
    setFurthestStep((previous) => Math.max(previous, next));
    requestFocus("heading");
  }

  function showReceipt() {
    setValues(normalizeInquiryValues(config, values));
    setView("receipt");
    setCopyStatus("");
    setShowPlainText(false);
    setShowHandoffExample(false);
    requestFocus("heading");
  }

  function exploreFailure() {
    if (referencePending || view !== "form" || step.kind !== "review") return;
    const foundErrors = validateInquiry(config, values);
    setErrors(foundErrors);
    if (Object.keys(foundErrors).length) {
      requestFocus("errors");
      return;
    }
    setView("save-failed");
    setAnnouncement("");
  }

  function retryReceiptSimulation() {
    if (view !== "save-failed") return;
    const foundErrors = validateInquiry(config, values);
    setErrors(foundErrors);
    if (Object.keys(foundErrors).length) {
      setView("form");
      requestFocus("errors");
      return;
    }
    showReceipt();
  }

  function reset(useExample: boolean) {
    setValues(useExample ? fictionalDemoValues(config) : { ...config.initialValues });
    setStepIndex(0);
    setFurthestStep(0);
    setErrors({});
    setView("form");
    setShowHandoffExample(false);
    setCopyStatus("");
    setShowPlainText(false);
    setReferenceLabel(null);
    setReferencePending(false);
    setReferenceResetKey((previous) => previous + 1);
    setAnnouncement(useExample ? "Fictional example loaded. Review each step and choose consent yourself." : "Sample brief cleared. You can begin again.");
    requestFocus("heading");
  }

  async function copySummary() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(plainText);
      setCopyStatus("Demo summary copied to your clipboard.");
    } catch {
      setShowPlainText(true);
      setCopyStatus("Automatic copy is unavailable. Select and copy the text below.");
    }
  }

  function renderSummary(editable: boolean) {
    return <div className={styles.summarySections}>{summary.map((section) => <section className={styles.summarySection} key={section.id}>
      <div className={styles.summaryHeading}><h3>{section.title}</h3>{editable && <button type="button" onClick={() => moveTo(config.steps.findIndex((item) => item.id === section.id))} aria-label={`Edit ${section.title}`}>Edit <span aria-hidden="true">↗</span></button>}</div>
      <dl>{section.items.map((item) => <div key={item.id}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl>
    </section>)}<section className={styles.summarySection}>
      <div className={styles.summaryHeading}><h3>Reference image</h3>{editable && <button type="button" onClick={() => moveTo(config.steps.findIndex((item) => item.reference))}>Edit reference <span aria-hidden="true">↗</span></button>}</div>
      <dl><div><dt>Local preview only</dt><dd>{referenceLabel || "Not selected"}<span className={styles.referenceNote}>Never uploaded or attached to a request.</span></dd></div></dl>
    </section></div>;
  }

  return <><header className={styles.introduction}>
    <p className="eyebrow">RivyaLivingArt · sample enquiry</p>
    <h1>{config.title}</h1>
    <p>{config.introduction}</p>
  </header><div className={`${styles.wizard} ${config.mode === "personalize" ? styles.compact : ""}`}>
    <div className={styles.demoBanner}>
      <div><span className="eyebrow">A sample journey</span><p>Use fictional details and non-sensitive example images. Nothing is sent, uploaded or saved; leaving or reloading clears this brief.</p></div>
      <button type="button" disabled={!isHydrated} className={styles.exampleButton} onClick={() => reset(true)}>Use a fictional example <span aria-hidden="true">↗</span></button>
    </div>
    <aside className={styles.sidebar} aria-label="Your sample journey">
      <p className="eyebrow">{config.mode === "commission" ? "Furniture & spatial art" : config.mode === "preserve" ? "Memory art" : "Personal art"}</p>
      <h2>{note.title}</h2>
      <p className={styles.sidebarCopy}>{note.note}</p>
      <nav aria-label="Brief steps"><ol className={styles.steps}>{config.steps.map((item, index) => <li key={item.id}>
        <button type="button" disabled={!isHydrated || index > furthestStep || view !== "form"} onClick={() => moveTo(index)} aria-current={view === "form" && index === stepIndex ? "step" : undefined}>
          <span className={styles.stepNumber}>{String(index + 1).padStart(2, "0")}</span><span>{item.title}</span>
        </button>
      </li>)}</ol></nav>
      {config.product && <div className={styles.productContext}><span className="eyebrow">Starting with a sample</span><p>{config.product.name}</p><span className={styles.samplePrice}>{config.product.priceLabel}</span><span>Example catalogue information; no quotation.</span></div>}
      <p className={styles.sidebarReminder}>{note.reminder}</p>
    </aside>
    <div className={styles.panel}>
      <p className={styles.liveAnnouncement} role="status">{announcement}</p>
      <noscript><p className={styles.reviewNotice}>JavaScript is needed for this local sample journey. The form stays disabled so no details can be sent through a standard browser submission.</p></noscript>
      <form noValidate onSubmit={handleSubmit} autoComplete="off" hidden={view !== "form"}>
        <fieldset className={styles.formFields} disabled={!isHydrated}>
        <header className={styles.panelHeader}>
          <p className="eyebrow">Step {String(stepIndex + 1).padStart(2, "0")} <span className={styles.progressDivider}>/</span> {String(config.steps.length).padStart(2, "0")}</p>
          {view === "form" && <h2 ref={headingRef} tabIndex={-1}>{step.title}</h2>}
          <p>{step.description}</p>
          <div className={styles.progressTrack} aria-hidden="true"><span style={{ width: `${((stepIndex + 1) / config.steps.length) * 100}%` }} /></div>
        </header>
        {errorEntries.length > 0 && <div className={styles.errorSummary} ref={errorRef} tabIndex={-1} role="alert">
          <h3>Review {errorEntries.length === 1 ? "this detail" : "these details"} before continuing</h3>
          <ul>{errorEntries.map(([id, message]) => <li key={id}><a href={`#${inputId(id)}`} onClick={(event) => { event.preventDefault(); focusField(id); }}>{allFields.find((field) => field.id === id)?.label}: {message}</a></li>)}</ul>
        </div>}
        {step.kind === "review" && <>
          <p className={styles.reviewNotice}>{config.reviewNotice}</p>
          {renderSummary(true)}
          <p className={styles.consentSummary}>Local-demo acknowledgement: <strong>{values.previewConsent === "yes" ? "confirmed" : "not confirmed"}</strong>. This does not authorize contact or a real submission.</p>
        </>}
        <div className={styles.fieldGrid}>{step.fields.filter((field) => isInquiryFieldVisible(field, values)).map((field) => <InquiryInput key={field.id} field={field} values={values} error={errors[field.id]} inputId={inputId(field.id)} onChange={updateValue} />)}</div>
        <div className={styles.referenceWidget} hidden={!step.reference}>
          <InquiryReference onSelectionChange={setReferenceLabel} onPendingChange={setReferencePending} resetKey={referenceResetKey} />
        </div>
        <footer className={styles.formFooter}>
          {stepIndex > 0 ? <button className={styles.backButton} type="button" onClick={() => moveTo(stepIndex - 1)}><span aria-hidden="true">←</span> Back</button> : <span className={styles.requiredNote}>Required fields are marked.</span>}
          <button type="submit" disabled={referencePending} className="button button-primary">{referencePending ? "Reading local image…" : step.kind === "review" ? "Create simulated receipt" : "Continue"}<Arrow /></button>
        </footer>
        <p className={styles.localNote}>Your choices stay in this page only. No real request is created.</p>
        {step.kind === "review" && <aside className={styles.failureDemo} aria-label="Optional recovery example">
          <p className="eyebrow">Optional · recovery example</p>
          <p>Explore how a failed save could look. Your fictional details, reference image and acknowledgement stay in this page, ready to edit or retry.</p>
          <button type="button" disabled={referencePending} className={styles.backButton} onClick={exploreFailure}>Explore a simulated failure <span aria-hidden="true">↗</span></button>
        </aside>}
        </fieldset>
      </form>
      {view === "save-failed" && <InquirySaveFailure onRetry={retryReceiptSimulation} onEdit={() => moveTo(config.steps.length - 1)} focusOnMount />}
      {view === "receipt" && <section className={styles.receipt} aria-label="Simulated receipt">
        <p className="eyebrow">Simulated · not sent or saved</p>
        <h2 ref={headingRef} tabIndex={-1}>Your sample brief,<br /><em>brought together.</em></h2>
        <p className={styles.receiptIntro}>This is a local demonstration of the receipt layout. The atelier has not received anything. No enquiry, reservation, quotation or order exists.</p>
        <div className={styles.receiptState}><span className={styles.receiptSymbol} aria-hidden="true">◇</span><div><strong>Demo summary only</strong><p>Your example choices remain here until you restart, leave or reload the page.</p></div></div>
        {config.product && <p className={styles.receiptProduct}><span>Sample concept</span>{config.product.name}</p>}
        {renderSummary(false)}
        <div className={styles.receiptActions}>
          <button type="button" className="button button-primary" onClick={() => moveTo(config.steps.length - 1)}>Edit sample brief <Arrow /></button>
          <button type="button" className={styles.outlineButton} onClick={copySummary}>Copy demo summary</button>
          <button type="button" className={styles.backButton} onClick={() => reset(false)}>Start again</button>
        </div>
        <p role="status" className={styles.copyStatus}>{copyStatus}</p>
        {showPlainText && <div className={styles.manualCopy}><label htmlFor={`${wizardId}-copy`}>Plain-text demo summary</label><textarea id={`${wizardId}-copy`} ref={plainTextRef} rows={12} readOnly value={plainText} /></div>}
        <p className={styles.localNote}>This sample receipt is not an enquiry or order. Nothing has been sent to the atelier.</p>
        <div className={styles.handoffDemo}>
          {showHandoffExample ? <InquiryRecovery summary={plainText} onEdit={() => moveTo(config.steps.length - 1)} focusOnMount /> : <>
            <p className="eyebrow">Optional · conversation fallback</p>
            <p>See the next-step design for a blocked WhatsApp handoff. This example opens no app or outgoing message.</p>
            <button type="button" className={styles.backButton} onClick={() => setShowHandoffExample(true)}>Explore blocked WhatsApp example <span aria-hidden="true">↗</span></button>
          </>}
        </div>
      </section>}
    </div>
  </div></>;
}
