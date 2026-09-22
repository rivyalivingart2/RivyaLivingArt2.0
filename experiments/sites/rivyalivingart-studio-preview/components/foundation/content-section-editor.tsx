"use client";

import { useEffect, useId, useRef, useState } from "react";
import { MediaPicker } from "@/components/foundation/studio-media-picker";
import type { ContentReferences } from "@/lib/rivya/source/content-contracts";
import { createPageSection, sectionReferenceOptions, sectionRegistry, validatePageSections, type PageSection, type SectionType } from "@/lib/rivya/source/content-sections";
import styles from "./content-section-editor.module.css";

type PendingAction = { id: string; action: "duplicate" | "remove" };

export function PageSectionComposer({ sections, onChange, references, disabled = false, furnitureFirst = false }: {
  sections: readonly PageSection[];
  onChange: (sections: PageSection[]) => void;
  references: ContentReferences;
  disabled?: boolean;
  furnitureFirst?: boolean;
}) {
  const instance = useId();
  const [newType, setNewType] = useState<SectionType>("product-selection");
  const [pending, setPending] = useState<PendingAction | null>(null);
  const [mediaSection, setMediaSection] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const confirmation = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const errors = validatePageSections(sections, references, { furnitureFirst });
  const firstProductId = sections.find((section) => !section.hidden && section.type === "product-selection")?.id;
  const visibleWorldIds = sections.filter((section) => !section.hidden && (section.type === "three-world-intro" || section.type === "category-discovery")).map((section) => section.id);
  const selectedMediaSection = sections.find((section) => section.id === mediaSection);

  useEffect(() => { if (pending) confirmation.current?.focus(); }, [pending]);

  function update(id: string, patch: Partial<PageSection>) {
    if (disabled) return;
    onChange(sections.map((section) => section.id === id ? { ...section, ...patch } : section));
  }
  function updateFields(section: PageSection, fields: Partial<PageSection["fields"]>) {
    update(section.id, { fields: { ...section.fields, ...fields } });
  }
  function move(index: number, direction: -1 | 1) {
    if (disabled) return;
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= sections.length || (furnitureFirst && (index === 0 || nextIndex === 0))) return;
    const next = [...sections];
    [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
    onChange(next);
    setMessage(`${sectionRegistry[next[nextIndex].type]?.label ?? "Section"} moved to position ${nextIndex + 1}.`);
  }
  function ask(action: PendingAction) {
    trigger.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setPending(action);
  }
  function dismiss() {
    setPending(null);
    trigger.current?.focus();
  }
  function confirm() {
    if (!pending || disabled) return;
    const index = sections.findIndex((section) => section.id === pending.id);
    if (index < 0) { dismiss(); return; }
    if (pending.action === "remove") {
      onChange(sections.filter((section) => section.id !== pending.id));
      setMessage(`Section ${index + 1} removed from this local draft.`);
    } else if (sections.length < 20) {
      const copy = structuredClone(sections[index]);
      copy.id = `section-${crypto.randomUUID()}`;
      const next = [...sections];
      next.splice(index + 1, 0, copy);
      onChange(next);
      setMessage(`Section ${index + 1} duplicated with a new stable block ID.`);
    }
    setPending(null);
    list.current?.focus();
  }
  function add() {
    if (disabled || sections.length >= 20) return;
    onChange([...sections, createPageSection(newType, `section-${crypto.randomUUID()}`)]);
    setMessage(`${sectionRegistry[newType].label} added. Review its copy and required references.`);
  }

  return <div className={styles.composer}>
    <div className={styles.intro}><div><p className={styles.eyebrow}>Controlled page composition</p><h2>Build the story in sections</h2><p>Choose from registered public components. Changes belong to this local draft. Catalogue values and source records stay with their references.</p></div><span className={styles.count}>{sections.length} / 20 sections</span></div>
    {furnitureFirst && <p className={styles.note}>Homepage structure keeps the opening furniture hero, first furniture selection and a three-world introduction visible. The first selection accepts LARGE furniture only.</p>}
    <div className={styles.addBar}><label htmlFor={`${instance}-new`}>Section template<select id={`${instance}-new`} value={newType} disabled={disabled || sections.length >= 20} onChange={(event) => setNewType(event.target.value as SectionType)}>{Object.values(sectionRegistry).map((definition) => <option key={definition.type} value={definition.type}>{definition.label}</option>)}</select></label><button type="button" className={styles.primary} disabled={disabled || sections.length >= 20} onClick={add}>Add section</button><p>{sectionRegistry[newType].description}</p></div>
    <p className={styles.status} role="status">{message}</p>
    {pending && <div className={styles.confirmation} tabIndex={-1} ref={confirmation} onKeyDown={(event) => { if (event.key === "Escape") { event.preventDefault(); dismiss(); } }}>
      <p className={styles.eyebrow}>Confirm local draft change</p><h3>{pending.action === "remove" ? "Remove this section?" : "Duplicate this section?"}</h3><p>{sections.find((section) => section.id === pending.id)?.fields.heading || pending.id}</p><p>{pending.action === "remove" ? "This removes the block from the current draft. Existing local checkpoints and public source content are unchanged." : "The duplicate gets a new block ID and retains the same references. It does not duplicate products, articles or assets."}</p><div className={styles.actions}><button type="button" className={styles.primary} onClick={confirm} disabled={disabled}>{pending.action === "remove" ? "Remove from local draft" : "Create local duplicate"}</button><button type="button" className={styles.secondary} onClick={dismiss}>Cancel</button></div>
    </div>}
    <div className={styles.blockList} ref={list} tabIndex={-1}>
      {sections.length === 0 && <p className={styles.empty}>A little room for a story. Add an approved section above to begin.</p>}
      {sections.map((section, index) => {
        if (!Object.hasOwn(sectionRegistry, section.type) || section.schemaVersion !== 1) return <div className={styles.block} key={section.id}><p className={styles.error}>Unsupported block. Remove it and choose an approved template.</p><button type="button" className={styles.secondary} disabled={disabled} onClick={() => ask({ id: section.id, action: "remove" })}>Remove unsupported section</button></div>;
        const definition = sectionRegistry[section.type];
        const fieldId = `${instance}-${section.id}`;
        const required = furnitureFirst && (!section.hidden && ((index === 0 && section.type === "hero") || section.id === firstProductId || (visibleWorldIds.length === 1 && visibleWorldIds.includes(section.id))));
        const available = sectionReferenceOptions(section.type, references);
        const selectedIds = new Set(section.fields.referenceIds);
        const missing = section.fields.referenceIds.filter((id) => !available.some((option) => option.id === id));
        const sectionErrors = errors.filter((error) => error.startsWith(`Section ${index + 1} (${section.id}):`));
        return <details className={styles.block} key={section.id} id={`section-${section.id}`} open={sections.length <= 3 ? true : undefined}>
          <summary><span className={styles.number}>{String(index + 1).padStart(2, "0")}</span><span><strong>{section.fields.heading || definition.label}</strong><small>{definition.label} · v{section.schemaVersion}{section.hidden ? " · Hidden" : ""}{required ? " · Required structure" : ""}</small></span><span className={styles.disclosure} aria-hidden="true">+</span></summary>
          <fieldset className={styles.blockBody} disabled={disabled}><legend className={styles.srOnly}>{definition.label} settings</legend>
            <div className={styles.blockMeta}><code>{section.id}</code><span>{definition.renderer}</span></div>
            <div className={styles.toolbar}><button type="button" className={styles.secondary} disabled={index === 0 || (furnitureFirst && index === 1)} onClick={() => move(index, -1)} aria-label={`Move ${definition.label} section ${index + 1} up`}>↑ Move up</button><button type="button" className={styles.secondary} disabled={index === sections.length - 1 || (furnitureFirst && index === 0)} onClick={() => move(index, 1)} aria-label={`Move ${definition.label} section ${index + 1} down`}>↓ Move down</button><button type="button" className={styles.secondary} disabled={sections.length >= 20} onClick={() => ask({ id: section.id, action: "duplicate" })}>Duplicate</button><button type="button" className={styles.secondary} disabled={required} onClick={() => update(section.id, { hidden: !section.hidden })}>{section.hidden ? "Show section" : "Hide section"}</button><button type="button" className={styles.quiet} disabled={required} onClick={() => ask({ id: section.id, action: "remove" })}>Remove</button></div>
            <div className={styles.twoColumns}><label className={styles.field} htmlFor={`${fieldId}-eyebrow`}>Eyebrow<input id={`${fieldId}-eyebrow`} maxLength={90} value={section.fields.eyebrow ?? ""} onChange={(event) => updateFields(section, { eyebrow: event.target.value })} /></label><label className={styles.field} htmlFor={`${fieldId}-variant`}>Approved variant<select id={`${fieldId}-variant`} value={section.variant} onChange={(event) => update(section.id, { variant: event.target.value })}>{definition.variants.map((variant) => <option key={variant} value={variant}>{variant}</option>)}</select></label></div>
            <label className={styles.field} htmlFor={`${fieldId}-heading`}>Heading <span aria-hidden="true">*</span><input id={`${fieldId}-heading`} maxLength={140} required value={section.fields.heading} onChange={(event) => updateFields(section, { heading: event.target.value })} /></label>
            <label className={styles.field} htmlFor={`${fieldId}-body`}>Body <span aria-hidden="true">*</span><textarea id={`${fieldId}-body`} maxLength={1800} required rows={4} value={section.fields.body} onChange={(event) => updateFields(section, { body: event.target.value })} /></label>
            {definition.allowsLink && <div className={styles.twoColumns}><label className={styles.field} htmlFor={`${fieldId}-href`}>Internal page link<input id={`${fieldId}-href`} maxLength={300} placeholder="/collectible-design" value={section.fields.href ?? ""} disabled={furnitureFirst && index === 0 && section.type === "hero"} onChange={(event) => updateFields(section, { href: event.target.value })} /></label><label className={styles.field} htmlFor={`${fieldId}-link-label`}>Link label<input id={`${fieldId}-link-label`} maxLength={80} value={section.fields.linkLabel ?? ""} onChange={(event) => updateFields(section, { linkLabel: event.target.value })} /></label></div>}
            {definition.referenceKind && <fieldset className={styles.references}><legend>Choose {definition.referenceKind} · {section.fields.referenceIds.length} / {definition.maxReferences}</legend><p>Referenced records keep their own source fields. Selection order determines the preview order.</p><div className={styles.referenceList}>{available.map((option) => {
              const selected = selectedIds.has(option.id);
              const furnitureExcluded = furnitureFirst && section.id === firstProductId && definition.referenceKind === "products" && references.products.find((product) => product.id === option.id)?.tier !== "LARGE";
              return <label key={option.id}><input type="checkbox" checked={selected} disabled={!selected && (section.fields.referenceIds.length >= definition.maxReferences || furnitureExcluded)} onChange={() => updateFields(section, { referenceIds: selected ? section.fields.referenceIds.filter((id) => id !== option.id) : [...section.fields.referenceIds, option.id] })} /><span>{option.label}<small>{option.id}{furnitureExcluded ? " · First selection is furniture only" : ""}</small></span></label>;
            })}</div>{missing.map((id) => <div className={styles.missing} key={id}><span>Unavailable: {id}</span><button className={styles.secondary} type="button" onClick={() => updateFields(section, { referenceIds: section.fields.referenceIds.filter((referenceId) => referenceId !== id) })}>Remove reference</button></div>)}</fieldset>}
            {definition.allowsMedia && <div className={styles.media}><div><strong>Shared media reference</strong><p>{section.fields.media ? `${section.fields.media.assetId} · ${section.fields.media.alt}` : "No image selected. The text layout remains available."}</p></div><div className={styles.actions}><button type="button" className={styles.secondary} onClick={() => setMediaSection(section.id)}>{section.fields.media ? "Change image or usage" : "Choose image"}</button>{section.fields.media && <button type="button" className={styles.quiet} onClick={() => updateFields(section, { media: null })}>Clear reference</button>}</div></div>}
            {sectionErrors.length > 0 && <div className={styles.errors}><strong>Review this section</strong><ul>{sectionErrors.map((error) => <li key={error}>{error.split(": ").slice(1).join(": ")}</li>)}</ul></div>}
          </fieldset>
        </details>;
      })}
    </div>
    {errors.some((error) => error.startsWith("Homepage hierarchy:")) && <div className={styles.errors}><strong>Restore the required homepage structure</strong><ul>{errors.filter((error) => error.startsWith("Homepage hierarchy:")).map((error) => <li key={error}>{error.replace("Homepage hierarchy: ", "")}</li>)}</ul></div>}
    {selectedMediaSection && <MediaPicker assets={references.media} value={selectedMediaSection.fields.media} onSelect={(media) => updateFields(selectedMediaSection, { media })} onClose={() => setMediaSection(null)} />}
  </div>;
}
