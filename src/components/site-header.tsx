"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Arrow } from "@/components/ui/arrow";

const links = [
  { href: "/collectible-design", label: "Collectible design" },
  { href: "/memory-art", label: "Memory art" },
  { href: "/personal-art", label: "Personal art & gifts" },
  { href: "/#atelier", label: "The atelier" },
] as const;

/** Text fallback, not a reproduction of the owner's logo artwork. */
export function Wordmark() {
  return <span className="wordmark"><span>RIVYA</span><span className="wordmark-sub">LIVING ART</span></span>;
}

export function SiteHeader() {
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const previousOverflow = useRef<string | null>(null);
  function restoreScroll() {
    if (previousOverflow.current !== null) {
      document.body.style.overflow = previousOverflow.current;
      previousOverflow.current = null;
    }
  }
  function closeMenu() {
    dialog.current?.close();
    restoreScroll();
  }
  function openMenu() {
    if (!dialog.current || dialog.current.open) return;
    previousOverflow.current = document.body.style.overflow;
    dialog.current.showModal();
    document.body.style.overflow = "hidden";
  }
  useEffect(() => {
    dialog.current?.close();
    restoreScroll();
    return restoreScroll;
  }, [pathname]);

  return <header className="site-header">
    <Link href="/" className="brand-link" aria-label="RivyaLivingArt home"><Wordmark /></Link>
    <nav className="desktop-nav" aria-label="Main navigation">{links.map((link) => <Link key={link.href} href={link.href} aria-current={pathname === link.href ? "page" : undefined}>{link.label}</Link>)}</nav>
    <Link href="/#commission" className="header-cta">Commission a piece <Arrow /></Link>
    <button ref={trigger} className="menu-trigger" type="button" onClick={openMenu} aria-haspopup="dialog" aria-controls="mobile-navigation"><span>Menu</span><span className="menu-lines" aria-hidden="true" /></button>
    <dialog ref={dialog} id="mobile-navigation" className="mobile-navigation" aria-labelledby="mobile-nav-heading" onClose={() => { restoreScroll(); trigger.current?.focus(); }} onClick={(event) => { if (event.target === event.currentTarget) closeMenu(); }}>
      <div className="mobile-panel">
        <div className="mobile-panel-top"><h2 id="mobile-nav-heading" className="eyebrow">Explore RivyaLivingArt</h2><button type="button" className="close-menu" onClick={closeMenu} autoFocus>Close <span aria-hidden="true">×</span></button></div>
        <nav aria-label="Mobile navigation">{links.map((link, index) => <Link key={link.href} href={link.href} onClick={closeMenu}><span className="eyebrow">0{index + 1}</span>{link.label}<Arrow /></Link>)}</nav>
        <Link href="/#commission" className="button button-primary" onClick={closeMenu}>Commission a piece <Arrow /></Link>
        <p className="muted">Furniture. Memory. Personal meaning.</p>
      </div>
    </dialog>
  </header>;
}
