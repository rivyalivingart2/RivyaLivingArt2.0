"use client";

import Link from "next/link";
import { RootErrorPresentation } from "@/components/system-state";
import styles from "./global-error.module.css";

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="en" className={styles.document}>
      <head><title>A moment of pause | RivyaLivingArt</title><meta name="robots" content="noindex, nofollow" /><meta name="viewport" content="width=device-width, initial-scale=1" /><meta name="theme-color" content="#101713" /></head>
      <body className={styles.body}>
        <a className={styles.skipLink} href="#main-content">Skip to content</a>
        <header className={styles.header}><Link href="/" prefetch={false}>RivyaLivingArt</Link><span>A material-led atelier</span></header>
        <main id="main-content"><RootErrorPresentation onRetry={reset} /></main>
        <footer className={styles.footer}>Art for the space. Art for the memory. Art for the person.</footer>
      </body>
    </html>
  );
}
