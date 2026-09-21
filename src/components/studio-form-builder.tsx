"use client";

import Link from "next/link";
import { useId, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { InquiryInput } from "./inquiry-input";
import { fictionalDemoValues, isInquiryFieldVisible, summarizeInquiry, validateInquiry, type InquiryConfig, type InquiryErrors, type InquiryField, type InquiryValues } from "@/lib/inquiry-schema";
import { hasChoices, hasLength, precedingControllers, protectedContactFields, schemaDependents, studioFieldTypes, studioSchemaIssues } from "@/lib/studio-form-schema";
import fieldStyles from "./inquiry-wizard.module.css";
import styles from "./studio-form-builder.module.css";

const subscribe = () => () => {};
const hydrated = () => true;
const server = () => false;
type Confirmation = { kind: "delete"; field: InquiryField } | { kind: "reset" } | { kind: "example" };

export function StudioFormBuilder({ initialConfig }: { initialConfig: InquiryConfig }) {
  const isHydrated = useSyncExternalStore(subscribe, hydrated, server);
  const [draft, setDraft] = useState(initialConfig);
  const [revision, setRevision] = useState(0);
  const [stepId, setStepId] = useState(initialConfig.steps[0].id);
  const [selectedId, setSelectedId] = useState(initialConfig.steps[0].fields[0]?.id ?? "");
  const [previewStepId, setPreviewStepId] = useState(initialConfig.steps[0].id);
  const [values, setValues] = useState<InquiryValues>({ ...initialConfig.initialValues });
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [announcement, setAnnouncement] = useState("");
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const [newType, setNewType] = useState<InquiryField["type"]>("text");
  const fieldSequence = useRef(0);
  const optionSequence = useRef(0);
  const id = useId();
  const confirmationCancelRef = useRef<HTMLButtonElement>(null);
  const confirmationTriggerRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const originalFields = new Set(initialConfig.steps.flatMap((step) => step.fields.map((field) => field.id)));
  const step = draft.steps.find((item) => item.id === stepId) ?? draft.steps[0];
  const selected = step.fields.find((field) => field.id === selectedId);
  const previewStep = draft.steps.find((item) => item.id === previewStepId) ?? draft.steps[0];
  const issues = studioSchemaIssues(draft);
  const inherited = selected ? originalFields.has(selected.id) : false;
  const fullyProtected = selected ? protectedContactFields.has(selected.id) : false;
  const controllers = selected ? precedingControllers(draft, selected.id) : [];
  const controller = controllers.find((field) => field.id === selected?.visibleWhen?.field);
  const controllerOptions = controller?.type === "checkbox" ? [{ value: "yes", label: "Checked" }] : controller?.options ?? [];
  const productHref = initialConfig.product ? `/preview/studio/products/${initialConfig.product.id}` : "/preview/studio/products";

  function changeDraft(next: InquiryConfig, message?: string) {
    setDraft(next);
    setRevision((current) => current + 1);
    setErrors({});
    setAnnouncement(message ?? "");
  }

  function changeField(fieldId: string, patch: Partial<InquiryField>) {
    changeDraft({ ...draft, steps: draft.steps.map((item) => ({ ...item, fields: item.fields.map((field) => field.id === fieldId ? { ...field, ...patch } : field) })) });
  }

  function selectStep(nextId: string) {
    const next = draft.steps.find((item) => item.id === nextId);
    if (!next) return;
    setStepId(next.id);
    setSelectedId(next.fields[0]?.id ?? "");
    setPreviewStepId(next.id);
    setErrors({});
  }

  function addField() {
    if (step.kind !== "fields" || step.fields.length >= 24) return;
    const existing = new Set(draft.steps.flatMap((item) => item.fields.map((field) => field.id)));
    let fieldId: string;
    do { fieldSequence.current += 1; fieldId = `customQuestion${fieldSequence.current}`; } while (existing.has(fieldId));
    const field: InquiryField = {
      id: fieldId, label: `Custom question ${fieldSequence.current}`, type: newType,
      ...(newType === "select" || newType === "radio" ? { options: [{ value: `choice-${++optionSequence.current}`, label: "First direction" }, { value: `choice-${++optionSequence.current}`, label: "Second direction" }] } : {}),
      ...(["text", "textarea", "email", "tel"].includes(newType) ? { maxLength: newType === "textarea" ? 500 : 120 } : {}),
      ...(newType === "number" ? { min: 0, max: 100000 } : {}),
    };
    changeDraft({ ...draft, steps: draft.steps.map((item) => item.id === step.id ? { ...item, fields: [...item.fields, field] } : item) }, `${field.label} added to this local draft.`);
    setSelectedId(field.id);
    setPreviewStepId(step.id);
  }

  function moveField(fieldId: string, direction: -1 | 1) {
    const index = step.fields.findIndex((field) => field.id === fieldId);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= step.fields.length) return;
    const fields = [...step.fields];
    [fields[index], fields[target]] = [fields[target], fields[index]];
    const next = { ...draft, steps: draft.steps.map((item) => item.id === step.id ? { ...item, fields } : item) };
    if (studioSchemaIssues(next).some((issue) => issue.includes("conditions must use"))) {
      setAnnouncement("Keep a condition's controlling question before its dependent field. No field was moved.");
      return;
    }
    changeDraft(next, `${fields[target].label} moved ${direction === -1 ? "up" : "down"}.`);
  }

  function requestConfirmation(next: Confirmation) {
    confirmationTriggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setConfirmation(next);
    setAnnouncement("");
    requestAnimationFrame(() => confirmationCancelRef.current?.focus());
  }

  function closeConfirmation() {
    setConfirmation(null);
    requestAnimationFrame(() => {
      const trigger = confirmationTriggerRef.current;
      if (trigger?.isConnected) trigger.focus();
      else titleRef.current?.focus();
    });
  }

  function confirmAction() {
    if (!confirmation) return;
    if (confirmation.kind === "reset") {
      setDraft(initialConfig);
      setRevision(0);
      setStepId(initialConfig.steps[0].id);
      setSelectedId(initialConfig.steps[0].fields[0]?.id ?? "");
      setPreviewStepId(initialConfig.steps[0].id);
      setValues({ ...initialConfig.initialValues });
      setErrors({});
      setAnnouncement("The original schema and empty preview values are restored. No stored record was changed.");
    } else if (confirmation.kind === "example") {
      setValues(fictionalDemoValues(draft));
      setErrors({});
      setAnnouncement("Original fictional answers loaded. New custom questions remain empty; acknowledge the local preview yourself.");
    } else {
      const field = confirmation.field;
      if (originalFields.has(field.id) || schemaDependents(draft, field.id).length) {
        setAnnouncement("This field is protected or still used by a condition. Nothing was deleted.");
      } else {
        const fields = step.fields.filter((item) => item.id !== field.id);
        changeDraft({ ...draft, steps: draft.steps.map((item) => item.id === step.id ? { ...item, fields } : item) }, `${field.label} removed from this local draft.`);
        setSelectedId(fields[0]?.id ?? "");
        setValues((current) => Object.fromEntries(Object.entries(current).filter(([key]) => key !== field.id)));
      }
    }
    closeConfirmation();
  }

  function previewSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isHydrated || issues.length) return;
    const nextErrors = validateInquiry(draft, values, previewStep.kind === "review" ? undefined : previewStep.id);
    setErrors(nextErrors);
    setAnnouncement(Object.keys(nextErrors).length ? "Review the preview validation messages. Nothing was submitted." : `${previewStep.kind === "review" ? "All steps" : "This step"} passed local field validation. Nothing was sent or saved.`);
  }

  function updateValue(fieldId: string, value: string) {
    setValues((current) => ({ ...current, [fieldId]: value }));
    setErrors({});
    setAnnouncement("");
  }

  function removeOption(value: string) {
    if (!selected || inherited) return;
    if (schemaDependents(draft, selected.id, value).length) {
      setAnnouncement("That choice is used by a visibility rule. Remove that rule explicitly before deleting its choice.");
      return;
    }
    changeField(selected.id, { options: selected.options?.filter((option) => option.value !== value) });
    if (values[selected.id] === value) updateValue(selected.id, "");
  }

  return <section className={styles.builder} aria-labelledby={`${id}-title`}>
    <header className={styles.heading}>
      <div><p className="eyebrow">Customization · local schema editor</p><h1 id={`${id}-title`} ref={titleRef} tabIndex={-1}>Shape the questions.</h1><p>{initialConfig.product?.name ?? "General commission"} · {initialConfig.mode} journey</p></div>
      <Link href={productHref} className={styles.textLink}>Back to product <span aria-hidden="true">↗</span></Link>
    </header>
    <div className={styles.draftBar}>
      <div><span className={styles.dot} aria-hidden="true" /><strong>Schema v{draft.schemaVersion}</strong><span>{revision ? `Local revision ${revision}` : "Original configuration"}</span></div>
      <button type="button" disabled={!isHydrated || Boolean(confirmation)} onClick={() => requestConfirmation({ kind: "reset" })}>Reset local draft</button>
    </div>
    <p className={styles.notice}>Fictional product configuration. Edits stay in this page and disappear on navigation or reload. The public form and original v1 configuration remain unchanged. Saving, publishing and historical enquiry snapshots belong to the later backend phase.</p>
    <p className={styles.announcement} role="status">{announcement}</p>
    {confirmation && <section className={styles.confirmation} role="alertdialog" aria-labelledby={`${id}-confirm-title`} aria-describedby={`${id}-confirm-copy`} onKeyDown={(event) => { if (event.key === "Escape") { event.preventDefault(); closeConfirmation(); } }}>
      <h2 id={`${id}-confirm-title`}>{confirmation.kind === "reset" ? "Discard this local draft?" : confirmation.kind === "example" ? "Replace preview answers?" : `Remove ${confirmation.field.label}?`}</h2>
      <p id={`${id}-confirm-copy`}>{confirmation.kind === "reset" ? "Your schema edits and preview answers will be cleared. The original source configuration will be restored." : confirmation.kind === "example" ? "Your current preview answers will be replaced by fictional examples. Schema edits are retained." : "This custom question and its local preview answer will be removed. The source configuration is unchanged."}</p>
      <div><button ref={confirmationCancelRef} type="button" onClick={closeConfirmation}>Keep working</button><button type="button" onClick={confirmAction}>{confirmation.kind === "reset" ? "Discard local changes" : confirmation.kind === "example" ? "Use fictional answers" : "Remove custom question"}</button></div>
    </section>}
    <noscript><p className={styles.notice}>JavaScript is required for the local builder. All controls remain disabled, so no preview input can become a browser submission.</p></noscript>
    <div className={styles.workspace}>
      <fieldset className={styles.editor} disabled={!isHydrated || Boolean(confirmation)}>
        <legend className={styles.srOnly}>Form schema editor</legend>
        <div className={styles.editorHeading}><span className="eyebrow">01 · Form structure</span><span>{draft.steps.reduce((total, item) => total + item.fields.length, 0)} fields</span></div>
        <label className={styles.control} htmlFor={`${id}-step`}>Edit step<select id={`${id}-step`} value={step.id} onChange={(event) => selectStep(event.target.value)}>{draft.steps.map((item, index) => <option key={item.id} value={item.id}>{index + 1}. {item.title}</option>)}</select></label>
        <p className={styles.helper}>{step.description}</p>
        <ol className={styles.fieldList}>{step.fields.map((field, index) => <li key={field.id} data-selected={field.id === selectedId || undefined}>
          <button type="button" className={styles.selectField} aria-pressed={field.id === selectedId} onClick={() => setSelectedId(field.id)}><span className={styles.fieldNumber}>{String(index + 1).padStart(2, "0")}</span><span>{field.label || "Untitled question"}<small>{field.type} · {originalFields.has(field.id) ? "included" : "custom"}{field.visibleWhen ? " · conditional" : ""}</small></span></button>
          <div className={styles.reorder}><button type="button" disabled={index === 0} aria-label={`Move ${field.label} up`} onClick={() => moveField(field.id, -1)}>↑</button><button type="button" disabled={index === step.fields.length - 1} aria-label={`Move ${field.label} down`} onClick={() => moveField(field.id, 1)}>↓</button></div>
        </li>)}</ol>
        {step.kind === "review" ? <p className={styles.fixedNote}>The review step uses the public summary renderer and local validation. Its role and position stay fixed.</p> : <div className={styles.addField}>
          <label className={styles.control} htmlFor={`${id}-new-type`}>New custom question<select id={`${id}-new-type`} value={newType} onChange={(event) => setNewType(event.target.value as InquiryField["type"])}>{studioFieldTypes.map((type) => <option key={type} value={type}>{type}</option>)}</select></label>
          <button type="button" disabled={step.fields.length >= 24} onClick={addField}>Add question <span aria-hidden="true">+</span></button>
          {step.fields.length >= 24 && <p className={styles.helper}>This step has reached the local editor limit of 24 fields.</p>}
        </div>}
        {step.reference && <p className={styles.fixedNote}>Reference-image placement is included and fixed. This builder shows its position without selecting or uploading a file.</p>}
        {selected && <section className={styles.inspector} aria-labelledby={`${id}-inspector`}>
          <div className={styles.inspectorTitle}><h2 id={`${id}-inspector`}>Question settings</h2><span>{fullyProtected ? "Protected" : inherited ? "Included" : "Custom"}</span></div>
          <p className={styles.fieldId}>{selected.id} · {selected.type}</p>
          <p className={styles.helper}>{fullyProtected ? "Contact routing and local-preview acknowledgement are protected. They cannot be rewritten, removed or weakened here." : inherited ? "Included tier questions retain their type, choices and validation rules. Edit wording here or add a custom question for a new choice." : "The identifier and type stay stable. Edit the wording, validation and controlled visibility below."}</p>
          <fieldset className={styles.settings} disabled={fullyProtected}>
            <legend className={styles.srOnly}>Question wording</legend>
            <label className={styles.control} htmlFor={`${id}-label`}>Label<input id={`${id}-label`} value={selected.label} maxLength={120} onChange={(event) => changeField(selected.id, { label: event.target.value })} /></label>
            <label className={styles.control} htmlFor={`${id}-hint`}>Guidance<textarea id={`${id}-hint`} rows={3} value={selected.hint ?? ""} maxLength={400} onChange={(event) => changeField(selected.id, { hint: event.target.value })} /></label>
          </fieldset>
          {!inherited && <>
            <label className={styles.check}><input type="checkbox" checked={Boolean(selected.required)} onChange={(event) => changeField(selected.id, { required: event.target.checked })} />Required when visible</label>
            {hasChoices(selected) && <div className={styles.options}><h3>Choices</h3><p className={styles.helper}>Stable choice values keep visibility rules connected. Labels can change.</p>{selected.options?.map((option, index) => <div className={styles.option} key={option.value}>
              <label className={styles.control} htmlFor={`${id}-option-${option.value}`}>Choice {index + 1}<input id={`${id}-option-${option.value}`} maxLength={120} value={option.label} onChange={(event) => changeField(selected.id, { options: selected.options?.map((item) => item.value === option.value ? { ...item, label: event.target.value } : item) })} /><small>{option.value}</small></label>
              <button type="button" disabled={(selected.options?.length ?? 0) <= 1 || schemaDependents(draft, selected.id, option.value).length > 0} aria-label={`Remove choice ${option.label}`} onClick={() => removeOption(option.value)}>×</button>
            </div>)}<button type="button" className={styles.subtleButton} disabled={(selected.options?.length ?? 0) >= 12} onClick={() => changeField(selected.id, { options: [...(selected.options ?? []), { value: `choice-${++optionSequence.current}`, label: "Another direction" }] })}>Add choice +</button><p className={styles.helper}>A choice used by a condition cannot be removed until that condition is explicitly cleared.</p></div>}
            {(selected.type === "number" || hasLength(selected)) && <div className={styles.constraints}>
              <h3>{selected.type === "number" ? "Number range" : "Character limits"}</h3>
              <div className={styles.pair}>{(selected.type === "number" ? ["min", "max"] as const : ["minLength", "maxLength"] as const).map((key) => <label className={styles.control} key={key} htmlFor={`${id}-${key}`}>{key === "min" || key === "minLength" ? "Minimum" : "Maximum"}<input id={`${id}-${key}`} type="number" min={0} max={selected.type === "number" ? 100000 : 2000} step={selected.type === "number" && !selected.integer ? "any" : 1} value={selected[key] ?? ""} onChange={(event) => changeField(selected.id, { [key]: event.target.value === "" ? undefined : Number(event.target.value) })} /></label>)}</div>
              {selected.type === "number" && <label className={styles.check}><input type="checkbox" checked={Boolean(selected.integer)} onChange={(event) => changeField(selected.id, { integer: event.target.checked })} />Whole numbers only</label>}
              <p className={styles.helper}>{selected.type === "number" ? "Non-negative values up to 100,000; the public renderer accepts up to three decimal places." : "Optional bounds from 0 to 2,000 characters."}</p>
            </div>}
            <div className={styles.visibility}><h3>Show this question</h3>
              <label className={styles.control} htmlFor={`${id}-condition`}>Visibility<select id={`${id}-condition`} value={selected.visibleWhen?.field ?? ""} onChange={(event) => {
                const controlling = controllers.find((field) => field.id === event.target.value);
                changeField(selected.id, { visibleWhen: controlling ? { field: controlling.id, value: controlling.type === "checkbox" ? "yes" : controlling.options?.[0]?.value ?? "" } : undefined });
              }}><option value="">Always visible</option>{controllers.map((field) => <option key={field.id} value={field.id}>When {field.label}</option>)}</select></label>
              {selected.visibleWhen && <label className={styles.control} htmlFor={`${id}-condition-value`}>Equals<select id={`${id}-condition-value`} value={selected.visibleWhen.value} onChange={(event) => changeField(selected.id, { visibleWhen: { field: selected.visibleWhen!.field, value: event.target.value } })}>{controllerOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>}
              <p className={styles.helper}>Use an earlier, always-visible choice or checkbox. Rules contain a field and value only. Change to “Always visible” to explicitly clear the rule.</p>
            </div>
            <div className={styles.deleteField}><button type="button" disabled={schemaDependents(draft, selected.id).length > 0} onClick={() => requestConfirmation({ kind: "delete", field: selected })}>Remove custom question</button>{schemaDependents(draft, selected.id).length > 0 && <p className={styles.helper}>Removal blocked: {schemaDependents(draft, selected.id).map((field) => field.label).join(", ")} use this question. Clear their conditions first.</p>}</div>
          </>}
        </section>}
      </fieldset>
      <section className={styles.preview} aria-labelledby={`${id}-preview-title`}>
        <header className={styles.previewHeading}><div><p className="eyebrow">02 · Public field preview</p><h2 id={`${id}-preview-title`}>The visitor’s view.</h2></div><span>Local only</span></header>
        <p className={styles.helper}>The same field components and validation as the public enquiry. Use fictional answers. This focused preview does not send, save or upload anything.</p>
        <div className={styles.previewControls}><label className={styles.control} htmlFor={`${id}-preview-step`}>Preview step<select disabled={!isHydrated || Boolean(confirmation)} id={`${id}-preview-step`} value={previewStep.id} onChange={(event) => { setPreviewStepId(event.target.value); setErrors({}); }}>{draft.steps.map((item, index) => <option key={item.id} value={item.id}>{index + 1}. {item.title}</option>)}</select></label><button type="button" disabled={!isHydrated || Boolean(confirmation)} onClick={() => requestConfirmation({ kind: "example" })}>Use fictional answers</button></div>
        {issues.length > 0 && <div className={styles.schemaIssues} role="status"><h3>Resolve the schema before using the preview</h3><ul>{issues.map((issue) => <li key={issue}>{issue}</li>)}</ul></div>}
        <form noValidate autoComplete="off" onSubmit={previewSubmit}>
          <fieldset className={styles.previewFields} disabled={!isHydrated || Boolean(confirmation) || issues.length > 0}>
            <legend className={styles.srOnly}>Local visitor form preview</legend>
            <header className={styles.stepHeading}><span className="eyebrow">{String(draft.steps.indexOf(previewStep) + 1).padStart(2, "0")} / {String(draft.steps.length).padStart(2, "0")}</span><h3>{previewStep.title}</h3><p>{previewStep.description}</p></header>
            {Object.keys(errors).length > 0 && <div className={styles.validationErrors} role="alert"><h4>Review these sample answers</h4><ul>{Object.entries(errors).map(([fieldId, error]) => <li key={fieldId}>{draft.steps.flatMap((item) => item.fields).find((field) => field.id === fieldId)?.label}: {error}</li>)}</ul></div>}
            {previewStep.kind === "review" ? <div className={styles.summary}><p className={styles.helper}>{draft.reviewNotice}</p>{summarizeInquiry(draft, values).map((section) => <section key={section.id}><h4>{section.title}</h4><dl>{section.items.map((item) => <div key={item.id}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl></section>)}<p className={styles.helper}>Local preview acknowledgement: {values.previewConsent === "yes" ? "confirmed" : "not confirmed"}.</p></div> : <div className={fieldStyles.fieldGrid}>{previewStep.fields.filter((field) => isInquiryFieldVisible(field, values)).map((field) => <InquiryInput key={field.id} field={field} values={values} error={errors[field.id]} inputId={`${id}-visitor-${field.id}`} onChange={updateValue} />)}</div>}
            {previewStep.reference && <aside className={styles.reference}><span aria-hidden="true">↥</span><div><strong>Reference-image position</strong><p>Local builder placeholder. File selection is unavailable here; nothing is uploaded.</p></div></aside>}
            <button type="submit" className={styles.validateButton}>Validate {previewStep.kind === "review" ? "all sample answers" : "this sample step"} <span aria-hidden="true">→</span></button>
          </fieldset>
        </form>
        <details className={styles.schemaSnapshot}><summary>Inspect local schema v{draft.schemaVersion} · revision {revision}</summary><p className={styles.helper}>Schema only. Preview answers are omitted. This is not a saved schema version or a historical enquiry record.</p><pre>{JSON.stringify({ schemaVersion: draft.schemaVersion, localRevision: revision, productId: draft.product?.id ?? null, mode: draft.mode, steps: draft.steps }, null, 2)}</pre></details>
      </section>
    </div>
  </section>;
}
