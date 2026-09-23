import {connection} from "next/server";
import {isPublicWebsiteAvailable} from "@/lib/public-website";
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
  description: "Explore resin furniture, memory art and personal gifts. Choose a piece and share your customization details with the atelier.",
  icons:{icon:[{url:'/brand/favicon.ico',sizes:'any'},{url:'/brand/rivyalivingart-icon-32.png',sizes:'32x32',type:'image/png'}],apple:'/brand/apple-touch-icon.png'}, manifest:'/brand/site.webmanifest',
  robots: { index: (process.env.SITE_INDEXABLE==='true'&&(process.env.RIVYA_ENV==='production'||process.env.VERCEL_ENV==='production')), follow: (process.env.SITE_INDEXABLE==='true'&&(process.env.RIVYA_ENV==='production'||process.env.VERCEL_ENV==='production')) },
};
export const viewport: Viewport = { themeColor: "#0b1728", colorScheme: "dark" };

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  await connection();
  return <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}><body><a className="skip-link" href="#main-content">Skip to content</a><ApplicationFrame approved={isPublicWebsiteAvailable(process.env)} header={<SiteHeader />} footer={<SiteFooter />}>{children}</ApplicationFrame></body></html>;
}
