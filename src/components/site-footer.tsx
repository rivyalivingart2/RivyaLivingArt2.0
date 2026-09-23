import Link from "next/link";
import { isVisualPreviewAllowed } from "@/lib/preview-mode";
import styles from "./site-footer.module.css";

const groups = [
  { title: "The collections", links: [
    { href: "/collectible-design", label: "Collectible design" },
    { href: "/memory-art", label: "Memory art" },
    { href: "/personal-art", label: "Personal art & gifts" },
    { href: "/search", label: "Find a sample piece" },
  ] },
  { title: "The atelier", links: [
    { href: "/about", label: "Our point of view" },
    { href: "/process", label: "The design process" },
    { href: "/materials", label: "Material directions" },
    { href: "/care", label: "Care conversations" },
    { href: "/portfolio", label: "Design studies" },
  ] },
  { title: "Notes & conversations", links: [
    { href: "/journal", label: "The journal" },
    { href: "/faq", label: "Questions & answers" },
    { href: "/architects", label: "Architects & designers" },
    { href: "/commission", label: "Commission a piece" },
    { href: "/contact", label: "Contact" },
  ] },
] as const;

export function SiteFooter() {
  if (isVisualPreviewAllowed(process.env)) return <footer className={styles.footer}>
    <div className={styles.grid}>
      <div className={styles.brand}><Link href="/" className={styles.wordmark}>RivyaLivingArt</Link><p>Art for the space.<br />Art for the memory.<br />Art for the person.</p><span>Furniture first. Meaning at every scale.</span></div>
      {groups.map((group) => <nav key={group.title} aria-label={group.title}><h2>{group.title}</h2>{group.links.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}</nav>)}
    </div>
    <div className={styles.meta}><p>Development preview · Fictional concepts and owner-review editorial drafts.</p><Link href="/preview/states">Interface state studies <span aria-hidden="true">↗</span></Link></div>
  </footer>;
  return <footer className="site-footer">
    <div><p className="footer-brand">RivyaLivingArt</p><p className="muted">Art for the space. Art for the memory. Art for the person.</p></div>
    <div className="footer-meta"><span>Furniture &amp; spatial art</span><span>Sample content, not a live catalogue.</span></div>
  </footer>;
}
