"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type ApplicationFrameProps = Readonly<{
  children: ReactNode;
  header: ReactNode;
  footer: ReactNode;
  approved?: boolean;
}>;

/** Presentation only: every Studio route still needs its server-side preview guard. */
export function ApplicationFrame({ children, header, footer, approved=false }: ApplicationFrameProps) {
  const pathname = usePathname();
  const isStudioPreview = pathname === "/preview/studio" || pathname.startsWith("/preview/studio/");

  if (isStudioPreview || (approved && pathname !== "/studio")) return children;

  return <>
    <div className="preview-notice">Development preview <span aria-hidden="true">/</span> Concept imagery &amp; sample content. Not a live offer.</div>
    {header}
    {children}
    {footer}
  </>;
}
