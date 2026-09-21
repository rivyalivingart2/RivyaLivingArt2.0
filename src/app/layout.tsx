import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

const displayFont = localFont({
  src: [
    { path: "../styles/fonts/cormorant-garamond-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../styles/fonts/cormorant-garamond-latin-400-italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-cormorant",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});
const bodyFont = localFont({
  src: [
    { path: "../styles/fonts/dm-sans-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../styles/fonts/dm-sans-latin-500-normal.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "RivyaLivingArt — A material-led atelier", template: "%s | RivyaLivingArt" },
  description: "A furniture-first visual study for RivyaLivingArt. Collectible design, memory art and personal objects.",
  robots: { index: false, follow: false },
};
export const viewport: Viewport = { themeColor: "#101713", colorScheme: "dark" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}><body><a className="skip-link" href="#main-content">Skip to content</a><div className="preview-notice">Development preview <span aria-hidden="true">/</span> Concept imagery & sample content. Not a live offer.</div><SiteHeader />{children}<SiteFooter /></body></html>;
}
