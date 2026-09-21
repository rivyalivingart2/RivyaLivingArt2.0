import Link from "next/link";
import styles from "./system-state.module.css";

export type SystemStateKind = "not-found" | "error" | "unavailable" | "empty";

type SystemStateProps = {
  kind: SystemStateKind;
  title?: string;
  description?: string;
  eyebrow?: string;
  onRetry?: () => void;
  retryLabel?: string;
  actionHref?: string;
  actionLabel?: string;
  compact?: boolean;
  demo?: boolean;
};

const content: Record<SystemStateKind, { eyebrow: string; title: string; description: string }> = {
  "not-found": {
    eyebrow: "404 / A different direction",
    title: "This piece of the story isn’t here.",
    description: "The address may have changed, or this part of the atelier is still taking shape. There are other ways to explore.",
  },
  error: {
    eyebrow: "A moment of pause",
    title: "The page couldn’t load.",
    description: "Try opening this page again, or return to the atelier. If you were completing a form, this page cannot confirm its status.",
  },
  unavailable: {
    eyebrow: "A pause in the collection",
    title: "This piece is unavailable.",
    description: "This piece is not currently open for an enquiry. Explore the collection for another direction, or visit contact for the available ways to reach the atelier.",
  },
  empty: {
    eyebrow: "Room for another direction",
    title: "Nothing here just yet.",
    description: "Try a broader selection or explore the collection. A quieter view can be the start of a different discovery.",
  },
};

/** Original decorative line study; independent of the catalogue or an asset service. */
function SculptureStudy() {
  return (
    <div className={styles.artwork} aria-hidden="true">
      <svg viewBox="0 0 520 430" fill="none" focusable="false">
        <ellipse cx="263" cy="365" rx="183" ry="27" className={styles.shadow} />
        <path d="M151 193 363 167 350 217 167 242Z" className={styles.top} />
        <path d="m151 193 16 49 183-25 13-50-51 6c-23 3-40 25-63 29-31 5-67-13-98-9Z" className={styles.resin} />
        <path d="m175 241 40-5-10 121-37-8Z" className={styles.base} />
        <path d="m310 223 32-4 18 119-37 9Z" className={styles.base} />
        <path d="m160 204 186-24M164 219l180-25M167 232l177-24" className={styles.contour} />
        <path d="M114 121c49-49 92-70 145-64 84 9 125 70 130 126M401 219c-1 48-27 85-49 103M105 174c-18 55-4 114 26 148" className={styles.orbit} />
        <path d="M80 362h364M259 28v17M65 224h17M435 225h17" className={styles.guide} />
        <circle cx="379" cy="108" r="4" className={styles.point} />
      </svg>
      <span className={styles.artworkCaption}>A study in balance</span>
    </div>
  );
}

/** Owns a section so it can be composed inside a page or a labelled state study. */
export function SystemState({ kind, title, description, eyebrow, onRetry, retryLabel = "Try again", actionHref = "/", actionLabel = "Back to RivyaLivingArt", compact = false, demo = false }: SystemStateProps) {
  const defaults = content[kind];
  const heading = title ?? defaults.title;
  const Heading = compact ? "h2" : "h1";

  return (
    <section className={`${styles.state} ${compact ? styles.compact : ""}`} aria-label={heading}>
      <div className={styles.copy}>
        {demo && <p className={styles.demo}>Visual state study · simulated</p>}
        <p className={styles.eyebrow}>{eyebrow ?? defaults.eyebrow}</p>
        <Heading className={styles.heading}>{heading}</Heading>
        <p className={styles.description}>{description ?? defaults.description}</p>
        <div className={styles.actions}>
          {onRetry && <button className={styles.primary} type="button" onClick={onRetry}>{retryLabel}<span aria-hidden="true">↻</span></button>}
          <Link className={onRetry ? styles.secondary : styles.primary} href={actionHref} prefetch={false}>{actionLabel}<span aria-hidden="true">↗</span></Link>
        </div>
        <nav className={styles.destinations} aria-label="Explore the atelier">
          <Link href="/collectible-design" prefetch={false}>Collectible design<span aria-hidden="true">↗</span></Link>
          <Link href="/contact" prefetch={false}>Contact<span aria-hidden="true">↗</span></Link>
        </nav>
      </div>
      <SculptureStudy />
    </section>
  );
}

/** Shares the root-error composition with the protected visual state study. */
export function RootErrorPresentation({ onRetry, compact = false, demo = false }: { onRetry?: () => void; compact?: boolean; demo?: boolean }) {
  return <SystemState kind="error" eyebrow="RivyaLivingArt / A moment of pause" title="The atelier couldn’t open." description="Please try opening the page again. If the interruption continues, return home and choose another direction. This screen cannot confirm the status of any form." onRetry={onRetry} compact={compact} demo={demo} />;
}
