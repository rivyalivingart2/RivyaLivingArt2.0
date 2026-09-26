import {connection} from "next/server";
import {indexingEnabled} from "@/lib/site-metadata";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { ApplicationFrame } from "@/components/application-frame";
import "./globals.css";

const displayFont = localFont({
  src: [
    { path: "../../public/fonts/instrument-serif-normal-400.ttf", weight: "400", style: "normal" },
    { path: "../../public/fonts/instrument-serif-italic-400.ttf", weight: "400", style: "italic" },
  ],
  variable: "--font-instrument",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});
const dataFont = localFont({src: "../../public/fonts/jetbrains-mono-normal-400.ttf", variable: "--font-jetbrains", display: "swap", preload: false});
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
  robots: { index: indexingEnabled(), follow: indexingEnabled() },
};
export const viewport: Viewport = { 
  width: "device-width", 
  initialScale: 1, 
  viewportFit: "cover", 
  themeColor: "#08111d", 
  colorScheme: "dark" 
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  await connection();
  return <html lang="en" className={`${displayFont.variable} ${bodyFont.variable} ${dataFont.variable}`}><body><a className="skip-link" href="#main-content">Skip to content</a><ApplicationFrame>{children}</ApplicationFrame></body></html>;
}
