"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, type KeyboardEvent, type ReactNode } from "react";
import styles from "./studio-shell.module.css";

const studioRoot = "/preview/studio";
const navigationGroups = [
  {
    label: "Workspace",
    links: [{ label: "Overview", href: studioRoot, icon: "overview", planned: false }],
  },
  {
    label: "Create & curate",
    links: [
      { label: "Catalogue", href: `${studioRoot}/products`, icon: "catalogue", planned: false },
      { label: "Content", href: `${studioRoot}/modules/content`, icon: "content", planned: true },
      { label: "Media", href: `${studioRoot}/modules/media`, icon: "media", planned: true },
    ],
  },
  {
    label: "Operations",
    links: [
      { label: "Inquiries", href: `${studioRoot}/modules/inquiries`, icon: "inquiries", planned: true },
      { label: "Imports & exports", href: `${studioRoot}/modules/imports`, icon: "imports", planned: true },
    ],
  },
  {
    label: "Administration",
    links: [{ label: "Settings", href: `${studioRoot}/modules/settings`, icon: "settings", planned: true }],
  },
] as const;

type NavigationIconName = typeof navigationGroups[number]["links"][number]["icon"];

function NavigationIcon({ name }: { name: NavigationIconName }) {
  const shapes: Record<NavigationIconName, ReactNode> = {
    overview: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    catalogue: <><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="M3 8v8l9 5 9-5V8M12 13v8" /></>,
    content: <><rect x="5" y="3" width="14" height="18" rx="1" /><path d="M9 8h6M9 12h6M9 16h4" /></>,
    media: <><rect x="3" y="4" width="18" height="16" rx="1" /><circle cx="8" cy="9" r="1.5" /><path d="m4 18 6-6 4 4 3-3 4 4" /></>,
    inquiries: <><path d="M4 4h16v12H9l-5 4V4Z" /><path d="M8 8h8M8 12h5" /></>,
    imports: <><path d="M8 3v13m-4-4 4 4 4-4M16 21V8m-4 4 4-4 4 4" /></>,
    settings: <><path d="M4 6h16M4 12h16M4 18h16" /><path d="M8 3v6M16 9v6M10 15v6" /></>,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{shapes[name]}</svg>;
}

function StudioNavigation({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return <nav aria-label="Studio navigation" className={styles.navigation}>
    {navigationGroups.map((group) => <div key={group.label} className={styles.navigationGroup}>
      <p className={styles.groupLabel}>{group.label}</p>
      <ul>{group.links.map((link) => {
        const active = pathname === link.href || (link.href !== studioRoot && pathname.startsWith(`${link.href}/`));
        return <li key={link.href}><Link href={link.href} onClick={onNavigate} className={styles.navigationLink} aria-current={active ? "page" : undefined}>
          <NavigationIcon name={link.icon} /><span>{link.label}</span>{link.planned && <span className={styles.planned}>Planned</span>}
        </Link></li>;
      })}</ul>
    </div>)}
  </nav>;
}

function currentSection(pathname: string) {
  if (pathname === `${studioRoot}/products/new`) return { parent: "Catalogue", current: "New sample product" };
  if (pathname.startsWith(`${studioRoot}/products/`)) return { parent: "Catalogue", current: "Product editor" };
  if (pathname === `${studioRoot}/products`) return { parent: "Workspace", current: "Catalogue" };
  for (const group of navigationGroups) {
    for (const link of group.links) {
      if (pathname === link.href) return { parent: "Workspace", current: link.label };
    }
  }
  return { parent: "Workspace", current: "Studio preview" };
}

export function StudioShell({ children }: Readonly<{ children: ReactNode }>) {
  const pathname = usePathname();
  const disclosure = useRef<HTMLDetailsElement>(null);
  const summary = useRef<HTMLElement>(null);
  const desktopNavigation = useRef<HTMLDivElement>(null);
  const section = currentSection(pathname);

  function closeNavigation() {
    if (disclosure.current) disclosure.current.open = false;
  }

  function navigateFromDisclosure() {
    closeNavigation();
    // Keep keyboard focus on a visible control while the next route resolves.
    summary.current?.focus({ preventScroll: true });
  }

  function handleNavigationKey(event: KeyboardEvent<HTMLDetailsElement>) {
    if (event.key === "Escape" && event.currentTarget.open) {
      event.preventDefault();
      closeNavigation();
      summary.current?.focus();
    }
  }

  useEffect(() => {
    // Native disclosure has no modal focus trap and never locks page scrolling.
    // Close it after route changes, including navigation from browser history.
    if (disclosure.current?.open) {
      if (disclosure.current.contains(document.activeElement)) summary.current?.focus({ preventScroll: true });
      disclosure.current.open = false;
    }
  }, [pathname]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1001px)");
    function onBreakpointChange() {
      if (!desktop.matches) return;
      if (disclosure.current?.contains(document.activeElement)) {
        const activeLink = desktopNavigation.current?.querySelector<HTMLElement>('a[aria-current="page"]');
        const firstLink = desktopNavigation.current?.querySelector<HTMLElement>("a");
        (activeLink ?? firstLink)?.focus({ preventScroll: true });
      }
      if (disclosure.current) disclosure.current.open = false;
    }
    desktop.addEventListener("change", onBreakpointChange);
    return () => desktop.removeEventListener("change", onBreakpointChange);
  }, []);

  return <div className={styles.shell}>
    <aside className={styles.sidebar} aria-label="Studio workspace">
      <Link href={studioRoot} className={styles.brand} aria-label="RivyaLivingArt Studio overview"><span>RivyaLivingArt</span><strong>Studio</strong><span className={styles.brandCaption}>A place to shape the collection.</span></Link>
      <div className={styles.sidebarLabel}><span className={styles.statusDot} aria-hidden="true" />Visual preview</div>
      <div ref={desktopNavigation}><StudioNavigation pathname={pathname} /></div>
      <div className={styles.sidebarFooter}><p>Demo data<br /><span>No staff session</span></p><Link href="/">View the website <span aria-hidden="true">↗</span></Link></div>
    </aside>

    <div className={styles.workspace}>
      <header className={styles.topbar}>
        <div className={styles.breadcrumb}><span>{section.parent}</span><span aria-hidden="true">/</span><strong>{section.current}</strong></div>
        <div className={styles.topbarActions}><span className={styles.demoBadge}>Demo workspace</span><Link href={`${studioRoot}/products/new`} className={styles.createLink}><span aria-hidden="true">＋</span> New sample product</Link></div>
      </header>

      <details ref={disclosure} className={styles.mobileNavigation} onKeyDown={handleNavigationKey}>
        <summary ref={summary}><span><span className={styles.mobileBrand}>RivyaLivingArt Studio</span><span className={styles.mobileSection}>{section.current}</span></span><span className={styles.menuLabel}>Navigation <span className={styles.chevron} aria-hidden="true">⌄</span></span></summary>
        <div className={styles.mobilePanel}><StudioNavigation pathname={pathname} onNavigate={navigateFromDisclosure} /><div className={styles.mobileFooter}><span>Demo data · No staff session</span><Link href="/" onClick={navigateFromDisclosure}>View the website ↗</Link></div></div>
      </details>

      <div className={styles.previewBanner}><span className={styles.previewLabel}>Studio visual preview</span><p>Local edits are temporary and are lost when you leave an editor or reload. Nothing is saved or published.</p></div>
      <main id="main-content" className={styles.content} tabIndex={-1}>{children}</main>
      <footer className={styles.workspaceFooter}><span>RivyaLivingArt · Custom Studio in development</span><span>Demo data · No staff session</span></footer>
    </div>
  </div>;
}
