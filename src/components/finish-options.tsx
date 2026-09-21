"use client";

import { useId, useState } from "react";
import type { Concept } from "@/lib/catalogue";
import styles from "./finish-options.module.css";

export function FinishOptions({ finishes }: { finishes: Concept["finishes"] }) {
  const [selectedId, setSelectedId] = useState(finishes[0]?.id);
  const id = useId();
  const selected = finishes.find((finish) => finish.id === selectedId);
  if (!selected) return null;
  return <fieldset className={styles.fieldset} aria-describedby={`${id}-note`}>
    <legend>Explore a finish preference <span>Sample options</span></legend>
    <div className={styles.options}>{finishes.map((finish) => <label key={finish.id} className={styles.option}>
      <input type="radio" name={`${id}-finish`} value={finish.id} checked={selectedId === finish.id} onChange={() => setSelectedId(finish.id)} />
      <span>{finish.label}</span>
    </label>)}</div>
    <p className={styles.description} aria-live="polite" aria-atomic="true">{selected.label}: {selected.description}</p>
    <p id={`${id}-note`} className={styles.note}>An example preference only. The concept image stays unchanged; your selection is not saved or submitted.</p>
  </fieldset>;
}
