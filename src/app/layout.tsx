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
// Common text uses smaller files; the complementary face retains every other
// original character. Only the complete face supplies the metric fallback.
const commonBodyFont = localFont({
  src: [
    { path: "../styles/fonts/inter-common-400.woff2", weight: "400", style: "normal" },
    { path: "../styles/fonts/inter-common-500.woff2", weight: "500", style: "normal" },
    { path: "../styles/fonts/inter-common-600.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-inter-common",
  display: "swap",
  adjustFontFallback: false,
  // Let critical styles and the hero load first; CSS still requests these same faces.
  preload: false,
  declarations: [{ prop: "unicode-range", value: "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0300-036F,U+2000-206F,U+20A0-20CF,U+2161,U+2190-21FF,U+2212,U+2215,U+2304,U+2318,U+25B7,U+25C7,U+26A0,U+2713,U+FEFF,U+FFFD" }],
});
const bodyFont = localFont({
  src: [
    { path: "../styles/fonts/inter-normal-400.woff2", weight: "400", style: "normal" },
    { path: "../styles/fonts/inter-normal-500.woff2", weight: "500", style: "normal" },
    { path: "../styles/fonts/inter-normal-600.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-inter",
  display: "swap",
  adjustFontFallback: "Arial",
  preload: false,
  declarations: [{ prop: "unicode-range", value: "U+0100-0130,U+0132-0148,U+014A-0151,U+0154-01C3,U+01C5-0254,U+0256-027B,U+027E-0284,U+0286-0290,U+0292-02A4,U+02A6-02BA,U+02BD-02C5,U+02C7-02D9,U+02DB,U+02DD-02FF,U+0374-0376,U+037A-037F,U+0384-038A,U+038C,U+038E-03A1,U+03A3-03D7,U+03DC-03DD,U+03F0-03F6,U+03F9-03FA,U+03FC-0479,U+0480-049D,U+04A0-04FF,U+052F,U+0E3F,U+1D00,U+1D0D,U+1D1B,U+1D43,U+1D47-1D49,U+1D4D,U+1D4F-1D50,U+1D52,U+1D56-1D58,U+1D5B,U+1D62-1D65,U+1D9C,U+1DA0,U+1DBB,U+1DBF-1DF5,U+1DFC-1E9B,U+1E9D-1F15,U+1F18-1F1D,U+1F20-1F45,U+1F48-1F4D,U+1F50-1F57,U+1F59,U+1F5B,U+1F5D,U+1F5F-1F7D,U+1F80-1FB4,U+1FB6-1FC4,U+1FC6-1FD3,U+1FD6-1FDB,U+1FDD-1FEF,U+1FF2-1FF4,U+1FF6-1FFE,U+2070-2071,U+2074-208E,U+2090-209C,U+20DB-20DE,U+20E8,U+20F0,U+2100-2101,U+2103,U+2105-2106,U+2109,U+2113,U+2116-2117,U+211E-2122,U+2126,U+212A-212B,U+212E,U+2132,U+213B,U+214D,U+2150-2160,U+2162-217F,U+2183-2186,U+2189,U+2202,U+2205-2206,U+220F,U+2211,U+221A,U+221E,U+222B,U+2236,U+2248,U+2260,U+2264-2265,U+2295-2298,U+2303,U+2305,U+2325-2327,U+232B,U+2380,U+2387,U+238B,U+23CE-23CF,U+2423,U+2460-2468,U+24B6-24CF,U+24EA,U+25A0-25A2,U+25AA,U+25B2-25B3,U+25B6,U+25BA-25BD,U+25C0-25C1,U+25C4-25C6,U+25CA-25CB,U+25CF,U+25E6,U+25EF,U+2600,U+2605-2606,U+263C,U+2661,U+2665,U+2717,U+2756,U+2764,U+2780-2788,U+27EF,U+27F5-27FA,U+2913,U+2A38,U+2B06,U+2B12-2B13,U+2B1C,U+2B24,U+2C7C,U+2C7F,U+2DFF,U+2E18,U+A69F,U+A7FF,U+A92E,U+E000,U+E002-E05E,U+E06A-E0BD,U+E0C8-E0CC,U+E0DC-E0E6,U+E0F3-E0F5,U+E106,U+E109-E10A,U+E10C-E10F,U+E111-E113,U+E117-E118,U+E121-E122,U+E124,U+E12A-E15E,U+E163,U+E1C3,U+E1D2-E1DF,U+E1E1-E2DC,U+EE01-EE07,U+EE09-EE0A,U+EE0C-EE12,U+EE14,U+EE17,U+EE1D-EE45,U+EE47-EE84,U+EE87-EED6,U+EED8-EEE1,U+F6C3,U+1F12F-1F149,U+1F16A-1F16B,U+1F850,U+1F852" }],
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
  return <html lang={locale} dir={localeDir(locale)} className={`${displayFont.variable} ${commonBodyFont.variable} ${bodyFont.variable} ${dataFont.variable}`}><body><a className="skip-link" href="#main-content">{copy.values.skipMain||uiText(locale,'skipMain')}</a><ApplicationFrame>{children}</ApplicationFrame></body></html>;
}
