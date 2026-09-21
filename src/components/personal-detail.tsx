import Link from "next/link";
import { formatPrice, personalFestivalOptions, personalRecipientOptions, type PersonalConcept } from "@/lib/catalogue";
import { ProductGallery } from "@/components/product-gallery";
import { PersonalChoices } from "@/components/personal-choices";
import { ArtRelated, ArtSampleNotice, dimensionText } from "@/components/art-detail-common";
import styles from "./art-detail.module.css";

export function PersonalDetail({ piece }: { piece: PersonalConcept }) {
  const { personal } = piece;
  const recipients = personal.recipients.map((value) => personalRecipientOptions.find((option) => option.value === value)?.label).join(" · ");
  const occasions = personal.festivals.map((value) => personalFestivalOptions.find((option) => option.value === value)?.label).join(" · ");
  return <main id="main-content" className={`section ${styles.page} ${styles.personalPage}`}>
    <nav aria-label="Breadcrumb" className={styles.breadcrumb}><Link className="text-link" href="/personal-art">← Personal art &amp; gifts</Link><span aria-hidden="true">/</span><span aria-current="page">{piece.title}</span></nav>
    <div className={styles.personalIntro}>
      <div className={styles.personalGallery}><ProductGallery key={piece.id} title={piece.title} gallery={piece.gallery} /><p className={styles.galleryNote}>An everyday object, with room for an individual detail.</p></div>
      <div className={styles.personalCopy}>
        <p className="eyebrow">{piece.type} / {piece.id}</p>
        <h1>{piece.title}</h1>
        <p className={styles.personalSummary}>{piece.description}</p>
        <ArtSampleNotice />
        <div className={styles.personalPrice}><div><span>Demo pricing</span><p>{formatPrice(piece)}</p></div><div><span>Example lead time</span><p>{piece.leadTime.minWeeks}–{piece.leadTime.maxWeeks} weeks</p></div></div>
        <dl className={styles.personalFacts}>
          <div><dt>For</dt><dd>{recipients}</dd></div>
          <div><dt>Occasion</dt><dd>{occasions}</dd></div>
          <div><dt>Sample size</dt><dd>{dimensionText(piece.dimensions)}<span>Width × depth × height</span></dd></div>
        </dl>
        <PersonalChoices key={piece.id} slug={piece.slug} variants={personal.variants} personalization={personal.personalization} quantity={personal.quantity} giftNote={personal.giftNote} />
      </div>
    </div>
    <section className={styles.personalDetails} aria-labelledby="personal-details">
      <div><p className="eyebrow">A closer look</p><h2 id="personal-details">The little details.</h2><div className={styles.personalStory}><p className={styles.storyLabel}>Fictional design narrative</p>{piece.detail.split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div></div>
      <div className={styles.disclosures}>
        <details open><summary>Materials & finish <span aria-hidden="true">+</span></summary><div className={styles.disclosure}><p>Sample material direction: {piece.materials.map((material) => material.label).join(" · ")}.</p><p>Sample finish directions: {piece.finishes.map((finish) => finish.label).join(" · ")}. Actual appearance and suitability require confirmation.</p></div></details>
        <details><summary>Care & everyday use <span aria-hidden="true">+</span></summary><div className={styles.disclosure}><p>{piece.care}</p></div></details>
        <details><summary>Gifting & availability <span aria-hidden="true">+</span></summary><div className={styles.disclosure}><p>{piece.availability === "MADE_TO_ORDER" ? "Made-to-order example" : "Ready-to-ship example"} · demo state, not live stock.</p><p>Confirm packaging, personalization, quantity, timing and the final price before any real request. This collection has no checkout or payment flow.</p></div></details>
      </div>
    </section>
    <ArtRelated piece={piece} />
  </main>;
}
