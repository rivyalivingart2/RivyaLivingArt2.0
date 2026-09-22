"use client";

import {useOptionalDemo} from '@/lib/rivya/demo-state';
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { ConceptImage } from "@/components/foundation/concept-image";
import { materialOptions, memoryOccasionOptions, personalColourOptions, personalFestivalOptions, personalRecipientOptions, preservationOptions, type Concept, type ProductTier } from "@/lib/rivya/source/catalogue";
import { createStudioProductDraft, studioDraftPrice, studioTierCategories, studioTierPresentation, validateStudioProductDraft, type StudioDraftErrors, type StudioProductDraft } from "@/lib/rivya/source/studio-product-draft";
import styles from "./studio-product-editor.module.css";

type FieldProps = { name: string; label: string; value: string; onChange: (value: string) => void; errors: StudioDraftErrors; required?: boolean; hint?: string; multiline?: boolean; numeric?: boolean; options?: readonly { value: string; label: string }[] };
const fieldId = (name: string) => `product-${name.replaceAll(".", "-")}`;

function Field({ name, label, value, onChange, errors, required, hint, multiline, numeric, options }: FieldProps) {
  const id = fieldId(name);
  const description = [hint && `${id}-hint`, errors[name] && `${id}-error`].filter(Boolean).join(" ") || undefined;
  const shared = { id, name, value, required, "aria-invalid": Boolean(errors[name]), "aria-describedby": description };
  return <div className={styles.field}>
    <label htmlFor={id}>{label}{required && <span aria-hidden="true"> *</span>}</label>
    {options ? <select {...shared} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}</select>
      : multiline ? <textarea {...shared} rows={4} maxLength={10000} onChange={(event) => onChange(event.target.value)} />
        : <input {...shared} type="text" inputMode={numeric ? "numeric" : undefined} maxLength={numeric ? 16 : 240} onChange={(event) => onChange(event.target.value)} />}
    {hint && <p id={`${id}-hint`} className={styles.hint}>{hint}</p>}
    {errors[name] && <p id={`${id}-error`} className={styles.error}>{errors[name]}</p>}
  </div>;
}

function Choices<T extends string>({ name, label, value, options, onChange, errors }: { name: string; label: string; value: readonly T[]; options: readonly { value: T; label: string }[]; onChange: (value: T[]) => void; errors: StudioDraftErrors }) {
  const id = fieldId(name);
  return <fieldset className={styles.choices} id={id} tabIndex={-1} aria-describedby={errors[name] ? `${id}-error` : undefined} aria-invalid={Boolean(errors[name])}>
    <legend>{label} <span aria-hidden="true">*</span></legend>
    <div>{options.map((option) => <label key={option.value}><input type="checkbox" checked={value.includes(option.value)} onChange={(event) => onChange(event.target.checked ? [...value, option.value] : value.filter((item) => item !== option.value))} />{option.label}</label>)}</div>
    {errors[name] && <p id={`${id}-error`} className={styles.error}>{errors[name]}</p>}
  </fieldset>;
}

const tiers: ProductTier[] = ["LARGE", "MEDIUM", "SMALL"];
const subscribeToHydration = () => () => {};
const clientHydrated = () => true;
const serverHydrated = () => false;

/** Local authoring presentation. Applying a draft never mutates source fixtures. */
export function StudioProductEditor({ product }: { product?: Concept }) {
  return <ProductDraftEditor key={product?.id ?? "new-local-product"} product={product} />;
}

function ProductDraftEditor({ product }: { product?: Concept }) {
  const hydrated = useSyncExternalStore(subscribeToHydration, clientHydrated, serverHydrated);
  const localDemo=useOptionalDemo();
  const [draft, setDraft] = useState<StudioProductDraft>(() => {try{const data=localDemo?.state.drafts[product?.id||"LOCAL-product"]?.data;return data?JSON.parse(data):createStudioProductDraft(product)}catch{return createStudioProductDraft(product)}});
  const [snapshot, setSnapshot] = useState<StudioProductDraft>(() => {try{const data=localDemo?.state.drafts[product?.id||"LOCAL-product"]?.data;return data?JSON.parse(data):createStudioProductDraft(product)}catch{return createStudioProductDraft(product)}});
  const localVersion=useRef(localDemo?.state.drafts[product?.id||"LOCAL-product"]?.revision||0);
  const [hasApplied, setHasApplied] = useState(false);
  const [errors, setErrors] = useState<StudioDraftErrors>({});
  const [pendingTier, setPendingTier] = useState<ProductTier | null>(null);
  const [notice, setNotice] = useState("");
  const confirmationRef = useRef<HTMLDivElement>(null);
  const errorsRef = useRef<HTMLDivElement>(null);
  const tierRef = useRef<HTMLSelectElement>(null);
  const dirty = JSON.stringify(draft) !== JSON.stringify(snapshot);
  const presentation = draft.tier ? studioTierPresentation[draft.tier] : null;
  const proposed = pendingTier ? studioTierPresentation[pendingTier] : null;
  const proposedPrefix = pendingTier === "LARGE" ? "large." : pendingTier === "MEDIUM" ? "medium." : "small.";
  const proposedFieldIssues = pendingTier ? Object.keys(validateStudioProductDraft({ ...draft, tier: pendingTier })).filter((key) => key.startsWith(proposedPrefix)).length : 0;
  const tierFacts = draft.tier === "LARGE"
    ? [{ label: "Edition", value: draft.large.editionLabel || "Add an edition description" }, { label: "Site notes", value: draft.large.installation || "Add installation notes" }]
    : draft.tier === "MEDIUM"
      ? [{ label: "Format", value: draft.medium.format || "Add a display format" }, { label: "Size studies", value: draft.medium.sizes.map((size) => size.label || "Unlabelled size").join(" · ") }]
      : draft.tier === "SMALL"
        ? [{ label: "Variants", value: draft.small.variants.map((variant) => variant.label || "Unlabelled variant").join(" · ") }, { label: "Quantity", value: `${draft.small.minQuantity || "—"}–${draft.small.maxQuantity || "—"} pieces` }]
        : [];

  useEffect(() => { if (pendingTier) confirmationRef.current?.focus(); }, [pendingTier]);
  useEffect(() => { if (Object.keys(errors).length) errorsRef.current?.focus(); }, [errors]);

  function base<K extends keyof StudioProductDraft>(key: K, value: StudioProductDraft[K]) { setDraft((current) => ({ ...current, [key]: value })); setNotice(""); }
  function large<K extends keyof StudioProductDraft["large"]>(key: K, value: StudioProductDraft["large"][K]) { setDraft((current) => ({ ...current, large: { ...current.large, [key]: value } })); setNotice(""); }
  function medium<K extends keyof StudioProductDraft["medium"]>(key: K, value: StudioProductDraft["medium"][K]) { setDraft((current) => ({ ...current, medium: { ...current.medium, [key]: value } })); setNotice(""); }
  function small<K extends keyof StudioProductDraft["small"]>(key: K, value: StudioProductDraft["small"][K]) { setDraft((current) => ({ ...current, small: { ...current.small, [key]: value } })); setNotice(""); }
  function apply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pendingTier) { confirmationRef.current?.focus(); return; }
    const nextErrors = validateStudioProductDraft(draft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) { setNotice("Resolve the highlighted fields before applying this local draft."); return; }
    const result=localDemo?.save(product?.id||"LOCAL-product",draft,localVersion.current);
    if(result&&!result.ok){setNotice(result.reason||"Local checkpoint failed. Your input is retained.");return}
    if(result?.revision)localVersion.current=result.revision;
    setSnapshot(draft);setHasApplied(true);setNotice("Synthetic draft checkpointed locally. See the storage banner for whether it survives leaving this tab. No database write or publication.");
  }
  function resolveTier(confirm: boolean) {
    if (confirm && pendingTier) { base("tier", pendingTier); setErrors({}); setNotice("Tier changed locally. Previous tier fields are retained in this tab; review the new required fields."); }
    setPendingTier(null); tierRef.current?.focus();
  }

  return <section className={styles.editor} aria-labelledby="product-editor-title">
    <header className={styles.header}>
      <div><p className={styles.eyebrow}>Catalogue / {product?.id ?? "New local draft"}</p><h1 id="product-editor-title">{product ? "Edit product study" : "Create a product study"}</h1><p>Demo authoring · checkpointed drafts resume in this browser when storage is available. Unsaved input is temporary.</p></div>
      <Link href="/studio/products" className={styles.link}>Back to products <span aria-hidden="true">↗</span></Link>
    </header>
    <div className={styles.documentBar}><span className={styles.badge}>Demo dataset</span><span>{product ? `Source: ${product.id} · ${product.contentStatus === "DEMO_VISIBLE" ? "visible in demo" : "source fixture"}` : "No source record created"}</span><span className={styles.draftStatus}>{dirty ? "Unapplied local changes" : hasApplied ? "Local snapshot applied" : "No local changes"}</span></div>
    <noscript><p className={styles.errorSummary}>This local product editor requires JavaScript. Draft controls are disabled because there is no server submission or save destination.</p></noscript>
    <div className={styles.layout}>
      <form className={styles.form} noValidate onSubmit={apply}>
        <fieldset className={styles.controls} disabled={!hydrated}><legend className={styles.visuallyHidden}>Local product draft</legend>
        {Object.keys(errors).length > 0 && <div className={styles.errorSummary} ref={errorsRef} tabIndex={-1} role="alert"><h2>Review {Object.keys(errors).length} {Object.keys(errors).length === 1 ? "field" : "fields"}</h2><ul>{Object.entries(errors).map(([key, message]) => <li key={key}><a href={`#${fieldId(key)}`}>{message}</a></li>)}</ul></div>}
        <section className={styles.panel} aria-labelledby="tier-heading"><div className={styles.panelHeading}><span>01</span><div><h2 id="tier-heading">Collection & tier</h2><p>The tier shapes the card, detail page and enquiry journey.</p></div></div>
          <div className={styles.field}><label htmlFor="product-tier">Product tier <span aria-hidden="true">*</span></label><select id="product-tier" ref={tierRef} value={draft.tier} required aria-invalid={Boolean(errors.tier)} aria-describedby={errors.tier ? "product-tier-error" : "product-tier-hint"} onChange={(event) => { const value = event.target.value; if (tiers.includes(value as ProductTier) && value !== draft.tier) setPendingTier(value as ProductTier); }}><option value="" disabled>Choose a collection tier</option>{tiers.map((tier) => <option key={tier} value={tier}>{studioTierPresentation[tier].label}</option>)}</select><p className={styles.hint} id="product-tier-hint">Changing a tier requires confirmation. Every tier keeps its own local field values.</p>{errors.tier && <p className={styles.error} id="product-tier-error">{errors.tier}</p>}</div>
          {proposed && <div className={styles.confirmation} ref={confirmationRef} tabIndex={-1} role="region" aria-labelledby="tier-confirm-title"><p className={styles.eyebrow}>Review tier change</p><h3 id="tier-confirm-title">Move this draft to {proposed.collection}?</h3><dl><div><dt>Collection</dt><dd>/{proposed.slug}</dd></div><div><dt>Card</dt><dd>{proposed.card}</dd></div><div><dt>Detail page</dt><dd>{proposed.detail}</dd></div><div><dt>Primary action</dt><dd>{proposed.cta}</dd></div><div><dt>Required next</dt><dd>{proposed.required}</dd></div><div><dt>Retained values</dt><dd>{proposedFieldIssues ? `${proposedFieldIssues} field ${proposedFieldIssues === 1 ? "needs" : "items need"} attention in this tier.` : "This tier’s retained fields satisfy current local field requirements."}</dd></div></dl><p>Existing values in all three tiers remain in memory. Complete the confirmed tier’s required fields before applying the draft. Public pages retain their source content.</p><div className={styles.actions}><button type="button" className={styles.primary} onClick={() => resolveTier(true)}>Confirm tier change</button><button type="button" className={styles.secondary} onClick={() => resolveTier(false)}>Keep current tier</button></div></div>}
        </section>

        <section className={styles.panel} aria-labelledby="identity-heading"><div className={styles.panelHeading}><span>02</span><div><h2 id="identity-heading">Product identity</h2><p>Required fields are marked with an asterisk.</p></div></div>
          <Field name="name" label="Full product name" value={draft.name} onChange={(value) => base("name", value)} errors={errors} required />
          <div className={styles.twoColumns}><Field name="title" label="Short display title" value={draft.title} onChange={(value) => base("title", value)} errors={errors} required /><Field name="type" label="Product type" value={draft.type} onChange={(value) => base("type", value)} errors={errors} required /></div>
          <Field name="slug" label="URL slug" value={draft.slug} onChange={(value) => base("slug", value)} errors={errors} required hint="Lowercase words with hyphens. Route creation and duplicate-slug checks await the backend." />
          <Field name="description" label="Short description" value={draft.description} onChange={(value) => base("description", value)} errors={errors} multiline required />
          <Field name="detail" label="Detail-page description" value={draft.detail} onChange={(value) => base("detail", value)} errors={errors} multiline required hint="Write sample content as a fictional design study, without implying a completed commission." />
          <Field name="care" label="Sample care notes" value={draft.care} onChange={(value) => base("care", value)} errors={errors} multiline required hint="Draft guidance only. Owner-approved care instructions and verified material performance remain pending." />
          <Choices name="materials" label="Materials" value={draft.materials} options={materialOptions.filter((option) => option.value !== "all")} onChange={(value) => base("materials", value)} errors={errors} />
          <div className={styles.repeatGroup} id="product-finishes"><h3>Finish directions <span aria-hidden="true">*</span></h3><p className={styles.hint}>Shared by every tier. Editing these local options leaves source finishes unchanged.</p>{errors.finishes && <p className={styles.error}>{errors.finishes}</p>}
            {draft.finishes.map((finish, index) => <fieldset key={index} className={styles.repeated}><legend>Finish {index + 1}</legend><div className={styles.twoColumns}><Field name={`finishes.${index}.id`} label="Finish ID" value={finish.id} onChange={(value) => base("finishes", draft.finishes.map((item, row) => row === index ? { ...item, id: value } : item))} errors={errors} required /><Field name={`finishes.${index}.label`} label="Finish label" value={finish.label} onChange={(value) => base("finishes", draft.finishes.map((item, row) => row === index ? { ...item, label: value } : item))} errors={errors} required /></div><Field name={`finishes.${index}.description`} label="Finish description" value={finish.description} onChange={(value) => base("finishes", draft.finishes.map((item, row) => row === index ? { ...item, description: value } : item))} errors={errors} multiline required /><button type="button" className={styles.quiet} disabled={draft.finishes.length === 1} onClick={() => base("finishes", draft.finishes.filter((_, row) => row !== index))}>Remove finish {index + 1}</button></fieldset>)}
            <button type="button" className={styles.secondary} disabled={draft.finishes.length >= 12} onClick={() => base("finishes", [...draft.finishes, { id: "", label: "", description: "" }])}>Add finish direction</button>
          </div>
          <div className={styles.threeColumns}>{(["width", "depth", "height"] as const).map((key) => <Field key={key} name={key} label={`${key[0].toUpperCase()}${key.slice(1)} · mm`} value={draft[key]} onChange={(value) => base(key, value)} numeric errors={errors} required />)}</div>
        </section>

        <section className={styles.panel} aria-labelledby="specific-heading"><div className={styles.panelHeading}><span>03</span><div><h2 id="specific-heading">{presentation ? `${presentation.collection} fields` : "Tier-specific fields"}</h2><p>Inactive tier values remain in this local draft.</p></div></div>
          {!draft.tier && <p className={styles.empty}>Choose and confirm a tier to begin these fields.</p>}
          {draft.tier === "LARGE" && <>
            <Field name="large.category" label="Furniture category" value={draft.large.category} onChange={(value) => large("category", value)} errors={errors} required options={[{ value: "", label: "Choose a category" }, ...studioTierCategories.LARGE]} />
            <div className={styles.twoColumns}><Field name="large.editionType" label="Edition type" value={draft.large.editionType} onChange={(value) => large("editionType", value as StudioProductDraft["large"]["editionType"])} errors={errors} options={[{ value: "BESPOKE", label: "Bespoke" }, { value: "EDITION", label: "Edition" }]} required /><Field name="large.editionLabel" label="Edition description" value={draft.large.editionLabel} onChange={(value) => large("editionLabel", value)} errors={errors} required /></div>
            <Field name="large.installation" label="Installation & site notes" value={draft.large.installation} onChange={(value) => large("installation", value)} errors={errors} multiline required hint="Sample access, assembly and delivery considerations; no service promise." />
          </>}
          {draft.tier === "MEDIUM" && <>
            <div className={styles.twoColumns}><Field name="medium.category" label="Memory-art category" value={draft.medium.category} onChange={(value) => medium("category", value)} errors={errors} required options={[{ value: "", label: "Choose a category" }, ...studioTierCategories.MEDIUM]} /><Field name="medium.preservation" label="Preservation type" value={draft.medium.preservation} onChange={(value) => medium("preservation", value as StudioProductDraft["medium"]["preservation"])} errors={errors} required options={[{ value: "", label: "Choose a preservation type" }, ...preservationOptions.filter((option) => option.value !== "all")]} /></div>
            <Choices name="medium.occasions" label="Occasions" value={draft.medium.occasions} options={memoryOccasionOptions.filter((option) => option.value !== "all")} onChange={(value) => medium("occasions", value)} errors={errors} />
            <Field name="medium.format" label="Display format" value={draft.medium.format} onChange={(value) => medium("format", value)} errors={errors} required />
            <div className={styles.repeatGroup} id="product-medium-sizes"><h3>Available size studies <span aria-hidden="true">*</span></h3><p className={styles.hint}>Size options are separate from the base product dimensions above.</p>{errors["medium.sizes"] && <p className={styles.error}>{errors["medium.sizes"]}</p>}
              {draft.medium.sizes.map((size, index) => <fieldset key={index} className={styles.repeated}><legend>Size {index + 1}</legend><Field name={`medium.sizes.${index}.label`} label="Size label" value={size.label} onChange={(value) => medium("sizes", draft.medium.sizes.map((item, row) => row === index ? { ...item, label: value } : item))} errors={errors} required /><div className={styles.threeColumns}>{(["width", "depth", "height"] as const).map((key) => <Field key={key} name={`medium.sizes.${index}.${key}`} label={`${key[0].toUpperCase()}${key.slice(1)} · mm`} value={size[key]} onChange={(value) => medium("sizes", draft.medium.sizes.map((item, row) => row === index ? { ...item, [key]: value } : item))} errors={errors} numeric required />)}</div><button className={styles.quiet} type="button" disabled={draft.medium.sizes.length === 1} onClick={() => medium("sizes", draft.medium.sizes.filter((_, row) => row !== index))}>Remove size {index + 1}</button></fieldset>)}
              <button className={styles.secondary} type="button" disabled={draft.medium.sizes.length >= 12} onClick={() => medium("sizes", [...draft.medium.sizes, { label: "", width: "", depth: "", height: "" }])}>Add size study</button>
            </div>
            <Field name="medium.personalization" label="Personalization choices" value={draft.medium.personalization} onChange={(value) => medium("personalization", value)} errors={errors} multiline hint="One choice per line. Leave empty when this study offers no personalization." />
            <Field name="medium.materialsNote" label="Preservation material notes" value={draft.medium.materialsNote} onChange={(value) => medium("materialsNote", value)} errors={errors} multiline required />
          </>}
          {draft.tier === "SMALL" && <>
            <Field name="small.category" label="Personal-art category" value={draft.small.category} onChange={(value) => small("category", value)} errors={errors} required options={[{ value: "", label: "Choose a category" }, ...studioTierCategories.SMALL]} />
            <Choices name="small.recipients" label="Recipients" value={draft.small.recipients} options={personalRecipientOptions.filter((option) => option.value !== "all")} onChange={(value) => small("recipients", value)} errors={errors} />
            <Choices name="small.colours" label="Product colours" value={draft.small.colours} options={personalColourOptions.filter((option) => option.value !== "all")} onChange={(value) => small("colours", value)} errors={errors} />
            <Choices name="small.festivals" label="Gifting occasions" value={draft.small.festivals} options={personalFestivalOptions.filter((option) => option.value !== "all")} onChange={(value) => small("festivals", value)} errors={errors} />
            <div className={styles.repeatGroup} id="product-small-variants"><h3>Variant studies <span aria-hidden="true">*</span></h3>{errors["small.variants"] && <p className={styles.error}>{errors["small.variants"]}</p>}
              {draft.small.variants.map((variant, index) => <fieldset className={styles.repeated} key={index}><legend>Variant {index + 1}</legend><div className={styles.twoColumns}><Field name={`small.variants.${index}.id`} label="Variant ID" value={variant.id} onChange={(value) => small("variants", draft.small.variants.map((item, row) => row === index ? { ...item, id: value } : item))} errors={errors} required /><Field name={`small.variants.${index}.label`} label="Variant label" value={variant.label} onChange={(value) => small("variants", draft.small.variants.map((item, row) => row === index ? { ...item, label: value } : item))} errors={errors} required /></div><Field name={`small.variants.${index}.colour`} label="Variant colour" value={variant.colour} onChange={(value) => small("variants", draft.small.variants.map((item, row) => row === index ? { ...item, colour: value as StudioProductDraft["small"]["colours"][number] } : item))} errors={errors} required options={personalColourOptions.filter((option) => option.value !== "all")} /><button className={styles.quiet} type="button" disabled={draft.small.variants.length === 1} onClick={() => small("variants", draft.small.variants.filter((_, row) => row !== index))}>Remove variant {index + 1}</button></fieldset>)}
              <button className={styles.secondary} type="button" disabled={draft.small.variants.length >= 12} onClick={() => small("variants", [...draft.small.variants, { id: "", label: "", colour: draft.small.colours[0] ?? "clear" }])}>Add variant study</button>
            </div>
            <Field name="small.personalization" label="Personalization choices" value={draft.small.personalization} onChange={(value) => small("personalization", value)} errors={errors} multiline hint="One choice per line. Leave empty when no personalization is offered." />
            <div className={styles.twoColumns}><Field name="small.minQuantity" label="Minimum quantity" value={draft.small.minQuantity} onChange={(value) => small("minQuantity", value)} errors={errors} numeric required /><Field name="small.maxQuantity" label="Maximum quantity" value={draft.small.maxQuantity} onChange={(value) => small("maxQuantity", value)} errors={errors} numeric required /></div>
            <Field name="small.giftNote" label="Gifting & packaging notes" value={draft.small.giftNote} onChange={(value) => small("giftNote", value)} errors={errors} multiline required />
          </>}
        </section>

        <section className={styles.panel} aria-labelledby="commercial-heading"><div className={styles.panelHeading}><span>04</span><div><h2 id="commercial-heading">Sample price & timing</h2><p>Draft values are illustrative, with no live offer or inventory claim.</p></div></div>
          <div className={styles.twoColumns}><Field name="priceType" label="Price type" value={draft.priceType} onChange={(value) => base("priceType", value as StudioProductDraft["priceType"])} errors={errors} required options={[{ value: "ON_REQUEST", label: "On request" }, { value: "STARTING_FROM", label: "Starting from" }, { value: "FIXED", label: "Fixed sample price" }]} />{draft.priceType !== "ON_REQUEST" && <Field name="priceAmountMinor" label="Amount · INR paise" value={draft.priceAmountMinor} onChange={(value) => base("priceAmountMinor", value)} errors={errors} numeric required hint="₹1 = 100 paise. ₹1,500 = 150000 paise." />}</div>
          {draft.priceType === "ON_REQUEST" && <p className={styles.hint}>Any previous amount stays in this draft but is excluded from the displayed price while “On request” is selected.</p>}
          <div className={styles.twoColumns}><Field name="minWeeks" label="Lead time · minimum weeks" value={draft.minWeeks} onChange={(value) => base("minWeeks", value)} errors={errors} numeric required /><Field name="maxWeeks" label="Lead time · maximum weeks" value={draft.maxWeeks} onChange={(value) => base("maxWeeks", value)} errors={errors} numeric required /></div>
          <div className={styles.twoColumns}><Field name="availability" label="Sample availability" value={draft.availability} onChange={(value) => base("availability", value as StudioProductDraft["availability"])} errors={errors} required options={[{ value: "MADE_TO_ORDER", label: "Made to order" }, { value: "READY_TO_SHIP", label: "Ready to ship · fictional" }]} /><Field name="stage" label="Local draft stage" value={draft.stage} onChange={(value) => base("stage", value as StudioProductDraft["stage"])} errors={errors} required options={[{ value: "DRAFT", label: "Draft" }, { value: "IN_REVIEW", label: "In review · local label" }]} /></div>
          <p className={styles.hint}>Changing the draft stage sends no review request and grants no publication or rights approval.</p>
        </section>
        <div className={styles.applyBar}><div><strong>{dirty ? "Unapplied changes" : hasApplied ? "Local snapshot ready" : "Ready to edit"}</strong><p>No database save. Applied drafts remain in this browser where storage is available.</p></div><div className={styles.actions}><button className={styles.secondary} type="button" disabled={!dirty || Boolean(pendingTier)} onClick={() => { setDraft(snapshot); setErrors({}); setNotice("Unapplied changes reverted to the local snapshot in this tab."); }}>Revert local changes</button><button className={styles.primary} type="submit">Apply local draft</button></div><p className={styles.status} role="status">{notice}</p></div>
        </fieldset>
      </form>

      <aside className={styles.preview} aria-labelledby="draft-preview-title"><div className={styles.previewHeader}><p className={styles.eyebrow}>Current draft</p><h2 id="draft-preview-title">Storefront summary</h2><p>Reflects local fields; public routes keep their source fixtures.</p></div><div className={styles.previewMedia}><ConceptImage src={product?.image ?? null} alt={product?.alt ?? "Demo product study with an approved visual pending"} fill sizes="(max-width: 1000px) 90vw, 320px" compact /><span>Demo concept</span></div><div className={styles.previewBody}><p className={styles.eyebrow}>{presentation?.collection ?? "Collection not selected"}</p><h3>{draft.title.trim() || "Untitled study"}</h3><p className={styles.previewType}>{draft.type || "Add a product type"}</p><p className={styles.previewDescription}>{draft.description || "A description of this fictional study will appear here."}</p><strong className={styles.price}>{studioDraftPrice(draft)}</strong><dl><div><dt>Dimensions</dt><dd>{draft.width || "—"} × {draft.depth || "—"} × {draft.height || "—"} mm</dd></div><div><dt>Lead time</dt><dd>{draft.minWeeks || "—"}–{draft.maxWeeks || "—"} sample weeks</dd></div><div><dt>Card variant</dt><dd>{presentation?.card ?? "Choose a tier"}</dd></div>{tierFacts.map((fact) => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}<div><dt>Draft stage</dt><dd>{draft.stage === "DRAFT" ? "Draft" : "In review · local only"}</dd></div></dl><p className={styles.previewCta}>{presentation?.cta ?? "Choose a tier for its enquiry action"}<span aria-hidden="true">↗</span></p><p className={styles.hint}>CTA appearance only. No live enquiry or draft route is created.</p></div>
        <div className={styles.previewNotes}><h3>Media & source</h3><p>{product?.image ? "Existing AI concept visualization. Text edits do not alter the image or establish rights approval." : "Approved product imagery is still pending. No media is uploaded by this editor."}</p><p>{product ? `${product.id} remains an immutable source fixture. Local tier or slug changes do not rewrite its public route.` : "This draft has no record ID, public URL or form schema until persistence is implemented."}</p>{product && <Link className={styles.link} href={`/pieces/${product.slug}`}>View source public study <span aria-hidden="true">↗</span></Link>}{product && <><Link className={styles.link} href={`/studio/products/${product.id}/form`}>Open source form builder <span aria-hidden="true">↗</span></Link><p>Opening another page discards this editor’s local draft; the builder starts from the source product.</p></>}</div>
      </aside>
    </div>
  </section>;
}
