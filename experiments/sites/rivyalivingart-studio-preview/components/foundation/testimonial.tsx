import { DEMO_TESTIMONIAL_LABEL, type TestimonialRecord } from "@/lib/rivya/source/testimonials";
import styles from "./testimonial.module.css";

const worldLabels: Record<TestimonialRecord["tier"], string> = {
  LARGE: "Collectible design",
  MEDIUM: "Memory art",
  SMALL: "Personal art",
};

/** Shared fixture renderer. The fixed disclosure cannot be edited with quote copy. */
export function TestimonialQuote({ testimonial }: { testimonial: TestimonialRecord }) {
  return <figure className={styles.quote}>
    <p className={styles.label}>{DEMO_TESTIMONIAL_LABEL}</p>
    <blockquote><p>{testimonial.quote}</p></blockquote>
    <figcaption>
      <span className={styles.identity}>{testimonial.identity}</span>
      <span className={styles.context}>{worldLabels[testimonial.tier]} · {testimonial.id}</span>
    </figcaption>
  </figure>;
}
