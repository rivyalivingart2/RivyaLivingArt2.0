import {publishedCopy} from '@/lib/published-copy';
import {connection} from "next/server";
import {indexingEnabled,siteOrigin} from "@/lib/site-metadata";
import {publicLocale} from "@/lib/site-settings";
import {localeDir,uiText} from "@/lib/site-settings-model";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { ApplicationFrame } from "@/components/application-frame";
import "./globals.css";

const displayFont = localFont({
  src: [
    { path: "../styles/fonts/instrument-serif-normal-400.woff2", weight: "400", style: "normal" },
    { path: "../styles/fonts/instrument-serif-italic-400.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-instrument",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});
const dataFont = localFont({src: "../styles/fonts/jetbrains-mono-normal-400.woff2", variable: "--font-jetbrains", display: "swap", preload: false});
const bodyFont = localFont({
  src: [
    { path: "../styles/fonts/inter-normal-400.woff2", weight: "400", style: "normal" },
    { path: "../styles/fonts/inter-normal-500.woff2", weight: "500", style: "normal" },
    { path: "../styles/fonts/inter-normal-600.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-inter",
  display: "swap",
  adjustFontFallback: "Arial",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: { default: "RivyaLivingArt — A material-led atelier", template: "%s | RivyaLivingArt" },
  description: "Explore resin furniture, memory art and personal gifts. Choose a piece and share your customization details with the atelier.",
  icons:{icon:[{url:'/brand/favicon.ico',sizes:'any'},{url:'/brand/rivyalivingart-icon-32.png',sizes:'32x32',type:'image/png'}],apple:'/brand/apple-touch-icon.png'}, manifest:'/brand/site.webmanifest',
  robots: { index: indexingEnabled(), follow: indexingEnabled() },
};
export const viewport: Viewport = { 
  width: "device-width", 
  initialScale: 1, 
  viewportFit: "cover", 
    themeColor: "#080a0e",
  colorScheme: "dark" 
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  await connection();
  const locale=await publicLocale();
  const copy=await publishedCopy(locale);
  return <html lang={locale} dir={localeDir(locale)} className={`${displayFont.variable} ${bodyFont.variable} ${dataFont.variable}`}><body><a className="skip-link" href="#main-content">{copy.values.skipMain||uiText(locale,'skipMain')}</a><ApplicationFrame>{children}</ApplicationFrame></body></html>;
}
