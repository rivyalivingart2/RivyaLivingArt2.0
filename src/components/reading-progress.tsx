"use client";

import { useEffect, useRef } from "react";
import styles from "./reading-progress.module.css";

/** Scroll updates touch the progress element, without rerendering article content. */
export function ReadingProgress({ articleId }: { articleId: string }) {
  const wrapper = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLProgressElement>(null);

  useEffect(() => {
    const article = document.getElementById(articleId);
    const container = wrapper.current;
    const indicator = progress.current;
    if (!article || !container || !indicator) return;
    let frame = 0;

    const measure = () => {
      frame = 0;
      const bounds = article.getBoundingClientRect();
      const viewport = window.innerHeight;
      const inset = Math.min(64, viewport * 0.1);
      const range = bounds.height - viewport + inset * 2;
      // Short notes need no progress bar; long notes finish when their end is visible.
      container.hidden = range <= 0 || bounds.top >= viewport || bounds.bottom <= 0;
      indicator.value = range > 0 ? Math.round(Math.max(0, Math.min(1, (inset - bounds.top) / range)) * 100) : 100;
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(measure);
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(article);
    observer.observe(document.body);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    schedule();
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.cancelAnimationFrame(frame);
    };
  }, [articleId]);

  return <div className={styles.readingProgress} ref={wrapper} hidden><span>Reading progress</span><progress ref={progress} max={100} value={0} aria-label="Reading progress" /></div>;
}
