"use client";

import type { InquiryField, InquiryValues } from "@/lib/rivya/source/inquiry-schema";
import styles from "./inquiry-wizard.module.css";

function RequiredMark({ required }: { required: boolean }) {
  return <span className={styles.requirement}>{required ? "Required" : "Optional"}</span>;
}

export function InquiryInput({ field, values, error, inputId, onChange, syntheticOnly=false }: {
  syntheticOnly?:boolean;
  field: InquiryField;
  values: InquiryValues;
  error?: string;
  inputId: string;
  onChange: (id: string, value: string) => void;
}) {
  const privateField=['contactName','contactEmail','contactPhone'].includes(field.id)||field.type==='email'||field.type==='tel';
  if(syntheticOnly&&privateField)return <div className={styles.field}><label htmlFor={inputId}>{field.label} · fixed fictional example</label><input id={inputId} readOnly value={values[field.id]||field.placeholder||'Fictional example only'}/><p className={styles.hint}>This design does not accept real customer details.</p></div>;
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
