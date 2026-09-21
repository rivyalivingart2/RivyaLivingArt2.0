"use client";

import { useId, useState } from "react";
import type { PersonalConcept } from "@/lib/catalogue";
import styles from "./art-detail.module.css";

type Props = Pick<PersonalConcept["personal"], "variants" | "personalization" | "quantity" | "giftNote">;

export function PersonalChoices({ variants, personalization, quantity, giftNote }: Props) {
  const [selectedId, setSelectedId] = useState(variants[0]?.id ?? "");
  const groupId = useId();
  const selected = variants.find((variant) => variant.id === selectedId);
  return <div className={styles.choices}>
    <fieldset className={styles.variantFieldset} aria-describedby={`${groupId}-note`}>
      <legend>Sample variant</legend>
      <div className={styles.variantOptions}>{variants.map((variant) => <label key={variant.id}><input type="radio" name={groupId} value={variant.id} checked={selectedId === variant.id} onChange={() => setSelectedId(variant.id)} /><span>{variant.label}</span></label>)}</div>
    </fieldset>
    <p className={styles.selection} aria-live="polite">Preview selection: {selected?.label ?? "No variant supplied"}</p>
    <p id={`${groupId}-note`} className={styles.ctaNote}>Selection is not saved and resets on reload. Sample price and imagery do not change.</p>
    <a href="#guidance" className={`button button-primary ${styles.mainAction}`}>Personalize &amp; Enquire <span aria-hidden="true">↗</span></a>
    <p className={styles.ctaNote}>Review the ideas below. The request form is planned; this preview sends nothing.</p>
    <section id="guidance" className={styles.personalGuidance} aria-labelledby="personal-guidance">
      <p className="eyebrow">Personalization guidance / preview</p>
      <h2 id="personal-guidance">A gift, made personal.</h2>
      <p className={styles.selectedBrief}>Selected sample variant: <strong>{selected?.label ?? "No variant supplied"}</strong></p>
      <ul>{personalization.map((item) => <li key={item}>{item}</li>)}</ul>
      <p className={styles.quantity}>Example quantity range: {quantity.min}–{quantity.max}. Confirm quantity and availability with the studio.</p>
      <p>{giftNote}</p>
      <p className={styles.guidanceFootnote}>No personal details are collected, no request is saved and no WhatsApp message is sent in this preview.</p>
    </section>
  </div>;
}
