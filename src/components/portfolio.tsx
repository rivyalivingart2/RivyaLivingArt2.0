import Link from "next/link";
import { ConceptCard } from "@/components/concept-card";
import { ConceptImage } from "@/components/concept-image";
import { PublicPageClosing, PublicPageHeader, PublicSampleNotice } from "@/components/public-page";
import { Arrow } from "@/components/ui/arrow";
import { portfolioConcepts, portfolioPrimaryConcept, portfolioStudies, type PortfolioStudy } from "@/lib/portfolio";
import styles from "./portfolio.module.css";

function StudyVisual({ study, index, detail = false }: { study: PortfolioStudy; index: number; detail?: boolean }) {
  const piece = portfolioPrimaryConcept(study);
  return <figure className={detail ? styles.detailVisual : styles.visual}>
    <div className={styles.imageFrame}>
      <ConceptImage src={piece?.image ?? null} alt={piece?.alt ?? "Demo concept — visual pending"} fill sizes={detail ? "(max-width: 760px) 91vw, 70vw" : "(max-width: 760px) 91vw, 48vw"} style={{ objectFit: "contain" }} />
      <span className={styles.visualIndex}>{String(index + 1).padStart(2, "0")}</span>
      <span className={styles.visualLabel}>{piece?.image ? "AI object concept" : "Visual pending"}</span>
    </div>
    <figcaption>{piece?.image ? `${piece.title} concept reference · not a photograph of an installed project` : "Fictional design study · no project photograph or approved visual is available"}</figcaption>
  </figure>;
}

export function PortfolioIndex() {
  return <main id="main-content" className={`section ${styles.page}`}>
    <PublicPageHeader eyebrow="Portfolio / design studies" title="Objects in conversation with a space." intro="Three fictional briefs explore how a material, a room or a memory might begin a design conversation. They show the questions behind an idea, with furniture and spatial art at the centre." />
    <PublicSampleNotice>Fictional design studies, not delivered client projects. No real commission, customer or installation is represented.</PublicSampleNotice>
    <div className={styles.studies}>
      {portfolioStudies.map((study, index) => <article className={styles.study} key={study.id} aria-labelledby={`study-${study.id}`}>
        <Link href={`/portfolio/${study.slug}`} className={styles.visualLink} aria-label={`Read ${study.title}`}><StudyVisual study={study} index={index} /></Link>
        <div className={styles.studyCopy}>
          <p className="eyebrow">Fictional study {String(index + 1).padStart(2, "0")} / {study.tier === "LARGE" ? "Collectible design" : "Memory art"}</p>
          <h2 id={`study-${study.id}`}><Link href={`/portfolio/${study.slug}`}>{study.title}</Link></h2>
          <p className={styles.excerpt}>{study.excerpt}</p>
          <p className={styles.focus}>{study.focus}</p>
          <Link className="text-link" href={`/portfolio/${study.slug}`}>Read the design brief <Arrow /></Link>
        </div>
      </article>)}
    </div>
    <PublicPageClosing title="A space of your own in mind?" description="Explore the local commission demo using fictional details. It gathers a design brief in this browser; nothing is sent to the studio." href="/commission" label="Explore a commission brief" />
  </main>;
}

export function PortfolioDetail({ study }: { study: PortfolioStudy }) {
  const index = portfolioStudies.findIndex((item) => item.id === study.id);
  const related = portfolioConcepts(study);
  const primary = portfolioPrimaryConcept(study);
  const isMemory = study.tier === "MEDIUM";
  const inquiryRoute = isMemory ? "/preserve" : "/commission";
  const inquiryHref = primary ? `${inquiryRoute}?piece=${encodeURIComponent(primary.slug)}` : inquiryRoute;
  const otherStudies = portfolioStudies.filter((item) => item.id !== study.id);

  return <main id="main-content" className={`section ${styles.page}`}>
    <nav aria-label="Breadcrumb" className={styles.breadcrumb}><Link className="text-link" href="/portfolio">← Design studies</Link><span aria-hidden="true">/</span><span aria-current="page">Study {String(index + 1).padStart(2, "0")}</span></nav>
    <PublicPageHeader eyebrow={`Fictional design study / ${study.tier === "LARGE" ? "Collectible design" : "Memory art"}`} title={study.title} intro={study.subtitle} />
    <PublicSampleNotice>Fictional concept brief, not a delivered project. All objects and proposed arrangements are sample design directions.</PublicSampleNotice>
    <StudyVisual study={study} index={index} detail />
    <section className={styles.brief} aria-labelledby="study-brief">
      <div><p className="eyebrow">The imagined starting point</p><h2 id="study-brief">A brief,<br /><em>still open.</em></h2><p className={styles.focus}>{study.focus}</p></div>
      <div className={styles.body}><p className={styles.lead}>{study.brief}</p><p className={styles.caption}>This study has no real client, project location or completion date.</p></div>
    </section>
    <section className={styles.questions} aria-labelledby="spatial-questions">
      <div><p className="eyebrow">Before a drawing becomes a decision</p><h2 id="spatial-questions">Questions for<br />the setting.</h2></div>
      <ol>{study.spatialQuestions.map((question, questionIndex) => <li key={question}><span aria-hidden="true">{String(questionIndex + 1).padStart(2, "0")}</span><p>{question}</p></li>)}</ol>
    </section>
    {study.sections.map((section, sectionIndex) => <section className={styles.narrative} key={section.heading} aria-labelledby={`narrative-${sectionIndex}`}>
      <h2 id={`narrative-${sectionIndex}`}>{section.heading}</h2>
      <div className={styles.body}>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
    </section>)}
    <section className={styles.material} aria-labelledby="study-material">
      <p className="eyebrow">A proposed material direction</p><h2 id="study-material">An impression to discuss.</h2><p>{study.materialDirection}</p><Link href="/materials" className="text-link">Read the material notes <Arrow /></Link>
    </section>
    <section className={styles.openQuestions} aria-labelledby="still-to-resolve">
      <div><p className="eyebrow">The brief remains unfinished</p><h2 id="still-to-resolve">What a real project<br />would need.</h2></div>
      <div><ul>{study.openQuestions.map((question) => <li key={question}>{question}</li>)}</ul><p className={styles.reviewNote}>{study.ownerReviewNote}</p></div>
    </section>
    {related.length > 0 && <section className={styles.related} aria-labelledby="study-concepts">
      <div className="section-heading"><div><p className="eyebrow">The objects behind the idea</p><h2 id="study-concepts">Explore the sample studies.</h2></div><Link className="text-link" href={isMemory ? "/memory-art" : "/collectible-design"}>View the collection <Arrow /></Link></div>
      <div className={styles.relatedGrid}>{related.map((piece, pieceIndex) => <ConceptCard key={piece.id} piece={piece} index={pieceIndex} />)}</div>
    </section>}
    <PublicPageClosing title={isMemory ? "Begin with a memory." : "Begin with your own questions."} description="Use fictional details to explore a local inquiry brief. This demonstration sends nothing, saves no request and makes no commitment." href={inquiryHref} label={isMemory ? "Explore a preservation brief" : "Explore a commission brief"} />
    <nav className={styles.moreStudies} aria-label="More design studies">{otherStudies.map((item) => <Link key={item.id} href={`/portfolio/${item.slug}`}><span className="eyebrow">Another fictional study</span><span>{item.title}</span><Arrow /></Link>)}</nav>
  </main>;
}
