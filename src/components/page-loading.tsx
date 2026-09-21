import Link from "next/link";
import styles from "./page-loading.module.css";

export type LoadingVariant = "collection" | "piece" | "article" | "form" | "page";

const labels: Record<LoadingVariant, string> = {
  collection: "Opening the collection…",
  piece: "Opening the piece…",
  article: "Opening the story…",
  form: "Preparing the form…",
  page: "Opening the atelier…",
};

function TextLines({ short = false }: { short?: boolean }) {
  return <div className={styles.lines}><div className={styles.line} /><div className={styles.line} />{!short && <div className={`${styles.line} ${styles.shortLine}`} />}</div>;
}

function Skeleton({ variant }: { variant: LoadingVariant }) {
  if (variant === "collection") return <><div className={styles.title} /><TextLines short /><div className={styles.filters}><span /><span /><span /></div><div className={styles.cards}>{[0, 1, 2].map((item) => <div key={item}><div className={styles.cardMedia} /><div className={styles.cardTitle} /><TextLines short /></div>)}</div></>;
  if (variant === "piece") return <div className={styles.piece}><div className={styles.pieceMedia} /><div><div className={styles.kicker} /><div className={styles.title} /><TextLines /><div className={styles.facts}>{[0, 1, 2, 3].map((item) => <div key={item}><span /><span /></div>)}</div><div className={styles.button} /></div></div>;
  if (variant === "form") return <div className={styles.form}><div className={styles.kicker} /><div className={styles.title} /><TextLines short /><div className={styles.steps}><span /><span /><span /></div><div className={styles.fields}>{[0, 1, 2, 3].map((item) => <div key={item}><div className={styles.fieldLabel} /><div className={styles.field} /></div>)}</div><div className={styles.button} /></div>;
  if (variant === "article") return <div className={styles.article}><div className={styles.kicker} /><div className={styles.title} /><TextLines short /><div className={styles.articleMedia} /><div className={styles.articleText}><TextLines /><TextLines /><TextLines /></div></div>;
  return <><div className={styles.kicker} /><div className={styles.title} /><TextLines /><div className={styles.pageMedia} /></>;
}

/** Render only below route/preview validation; a root loading boundary can turn a 404 into a streamed 200. */
export function PageLoading({ variant = "page", embedded = false, demo = false }: { variant?: LoadingVariant; embedded?: boolean; demo?: boolean }) {
  const Wrapper = embedded ? "section" : "main";
  return (
    <Wrapper id={embedded ? undefined : "main-content"} className={`${styles.loading} ${embedded ? styles.embedded : ""} ${demo ? styles.demo : ""}`} aria-label={demo ? `${variant} loading study` : labels[variant]}>
      {demo ? <p className={styles.status}>Static loading study · no work is pending</p> : <p className={styles.status} role="status">{labels[variant]}</p>}
      {!demo && <div className={styles.pending} aria-hidden="true"><span /></div>}
      <div className={styles.skeleton} aria-busy={demo ? undefined : true} aria-hidden="true"><Skeleton variant={variant} /></div>
      {!demo && <Link className={styles.returnLink} href="/" prefetch={false}>Return to the atelier <span aria-hidden="true">↗</span></Link>}
    </Wrapper>
  );
}
