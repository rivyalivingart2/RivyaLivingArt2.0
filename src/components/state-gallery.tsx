"use client";

import Link from "next/link";
import { useState } from "react";
import { MediaFallback } from "@/components/concept-image";
import { InquiryRecovery, InquirySaveFailure } from "@/components/inquiry-recovery";
import { PageLoading, type LoadingVariant } from "@/components/page-loading";
import { RootErrorPresentation, SystemState, type SystemStateKind } from "@/components/system-state";
import styles from "./state-gallery.module.css";

const stateChoices = [
  { id: "not-found", label: "Page not found", note: "The shared 404 presentation. This gallery stays on a valid preview route; it does not imitate an HTTP 404." },
  { id: "error", label: "Page interruption", note: "The route error presentation. Here, retry changes local example feedback; actual route boundaries use their reset callback." },
  { id: "root-error", label: "Atelier interruption", note: "The root error composition also has a standalone dark document in the application. This is the embedded presentation." },
  { id: "empty", label: "No matching studies", note: "The collection empty state keeps a clear route back to all studies. Filters on the real collection pages use this same component." },
  { id: "unavailable", label: "Unavailable piece", note: "A future unavailable-item presentation. None of the current fictional records has been changed to unavailable." },
  { id: "loading-collection", label: "Collection loading", note: "Static skeleton study. The live collection uses this fallback only for actual pending content after route validation." },
  { id: "loading-piece", label: "Piece loading", note: "Static detail-page skeleton. Current fixture details render directly; no artificial waiting has been added." },
  { id: "loading-article", label: "Story loading", note: "Static editorial skeleton. The journal index uses the shared fallback for actual pending content after its preview guard." },
  { id: "loading-form", label: "Form loading", note: "Static form skeleton for a future data-backed form. Current local forms do not pretend to load a remote service." },
  { id: "loading-page", label: "Page loading", note: "Static general-page skeleton. The real header progress line follows the framework’s navigation state without a timer or invented percentage." },
  { id: "media-pending", label: "Visual awaiting artwork", note: "The labelled placeholder for a study without approved media. This is a content gap, not a running image request." },
  { id: "media-failed", label: "Image unavailable", note: "The failed-image presentation, rendered without a broken network request. Actual product galleries can retry their selected source." },
  { id: "save-failed", label: "Brief save interrupted", note: "An explicit failed-save simulation. The real sample forms preserve entered values and the mounted local reference when this example is opened." },
  { id: "handoff-blocked", label: "WhatsApp handoff blocked", note: "A simulated handoff with optional clipboard copying. No WhatsApp window, message transport, database record or request reference is created." },
] as const;

type StateChoice = typeof stateChoices[number]["id"];
const fictionalSummary = "RivyaLivingArt — fictional interface study\nA sample furniture brief for an imaginary reading room.\nNo enquiry, order or saved request exists.";

export function StateGallery() {
  const [selected, setSelected] = useState<StateChoice>("not-found");
  const [feedback, setFeedback] = useState("");
  const [receiptShown, setReceiptShown] = useState(false);
  const choice = stateChoices.find((item) => item.id === selected)!;

  function changeState(next: StateChoice) {
    setSelected(next);
    setFeedback("");
    setReceiptShown(false);
  }

  function retryPresentation() {
    setFeedback("Retry interaction previewed. No page failure was triggered and no network request was made.");
  }

  function presentation() {
    if (selected.startsWith("loading-")) return <PageLoading variant={selected.slice(8) as LoadingVariant} embedded demo />;
    if (selected === "root-error") return <RootErrorPresentation compact demo onRetry={retryPresentation} />;
    if (selected === "media-pending" || selected === "media-failed") return <div className={styles.mediaStudy}><MediaFallback reason={selected === "media-pending" ? "pending" : "failed"} fill /></div>;
    if (selected === "handoff-blocked") return <InquiryRecovery summary={fictionalSummary} />;
    if (selected === "save-failed") return receiptShown ? <section className={styles.receipt} aria-label="Simulated receipt example">
      <p className="eyebrow">Demo receipt · nothing saved or sent</p><h2>The example can continue.</h2>
      <p>This is one local receipt presentation. No real request reference, reservation or message exists.</p>
      <button type="button" className="button" onClick={() => { setReceiptShown(false); setFeedback("Failed-save example restored."); }}>Reset failed-save example</button>
    </section> : <InquirySaveFailure onRetry={() => { setReceiptShown(true); setFeedback("One simulated receipt is shown. No record was saved."); }} />;
    return <SystemState kind={selected as SystemStateKind} compact demo
      onRetry={selected === "error" ? retryPresentation : undefined}
      actionHref={selected === "empty" || selected === "unavailable" ? "/collectible-design" : "/"}
      actionLabel={selected === "empty" ? "View all studies" : selected === "unavailable" ? "Explore other studies" : "Back to RivyaLivingArt"}
      title={selected === "empty" ? "No studies match this combination." : undefined} />;
  }

  return <main id="main-content" className={styles.page}>
    <header className={styles.header}><p className="eyebrow">Development preview / Interface studies</p><h1>A considered<br /><em>way forward.</em></h1><p>Loading, empty views and interruptions are part of the experience. Explore the shared designs and their recovery choices.</p></header>
    <aside className={styles.notice}><strong>Simulated presentations · no live operation</strong><p>This gallery displays interface source for review. It does not perform testing, cause real errors or establish that these states have passed browser QA. Loading examples are static. Clipboard copying is optional and uses fictional text only.</p></aside>
    <div className={styles.controls}>
      <label htmlFor="state-study">Choose a state<select id="state-study" value={selected} onChange={(event) => changeState(event.target.value as StateChoice)}>{stateChoices.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
      <p id="state-description">{choice.note}</p>
    </div>
    <div className={styles.stage} key={selected} aria-describedby="state-description">{presentation()}</div>
    <p className={styles.feedback} role="status">{feedback}</p>
    <nav className={styles.destinations} aria-label="Explore the sample journeys"><p>See the states in context</p><Link href="/collectible-design">Collection & filters <span aria-hidden="true">↗</span></Link><Link href="/commission">Sample commission brief <span aria-hidden="true">↗</span></Link><Link href="/contact">Contact options <span aria-hidden="true">↗</span></Link></nav>
  </main>;
}
