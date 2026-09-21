import type { ReactNode } from "react";
import Link from "next/link";
import { Arrow } from "@/components/ui/arrow";
import styles from "./public-page.module.css";

export function PublicPageHeader({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children?: ReactNode }) {
  return <header className={styles.header}>
    <p className="eyebrow"><span className="small-line" />{eyebrow}</p>
    <h1>{title}</h1>
    <p className={styles.intro}>{intro}</p>
    {children}
  </header>;
}

export function PublicSampleNotice({ children }: { children?: ReactNode }) {
  return <div className={styles.notice}><span className="eyebrow">Sample content / owner-review draft</span><div>{children ?? "This is a fictional editorial study for the development preview. It is not approved business information or a live offer."}</div></div>;
}

export function PublicPageClosing({ title, description, href, label }: { title: string; description: string; href: string; label: string }) {
  return <section className={styles.closing}>
    <div><p className="eyebrow">Continue the conversation</p><h2>{title}</h2><p>{description}</p></div>
    <Link className="button button-primary" href={href}>{label}<Arrow /></Link>
  </section>;
}
