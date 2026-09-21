import type { Metadata, Viewport } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "RivyaLivingArt — A material-led atelier", template: "%s | RivyaLivingArt" },
  description: "A furniture-first visual study for RivyaLivingArt. Collectible design, memory art and personal objects.",
  robots: { index: false, follow: false },
};
export const viewport: Viewport = { themeColor: "#101713", colorScheme: "dark" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><a className="skip-link" href="#main-content">Skip to content</a><div className="preview-notice">Development preview <span aria-hidden="true">/</span> Concept imagery & sample content. Not a live offer.</div><SiteHeader />{children}<SiteFooter /></body></html>;
}
