import {connection} from "next/server";
import {isVisualPreviewAllowed} from "@/lib/preview-mode";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ApplicationFrame } from "@/components/application-frame";
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

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  await connection();
  return <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}><body><a className="skip-link" href="#main-content">Skip to content</a><ApplicationFrame approved={isVisualPreviewAllowed(process.env)} header={<SiteHeader />} footer={<SiteFooter />}>{children}</ApplicationFrame></body></html>;
}
