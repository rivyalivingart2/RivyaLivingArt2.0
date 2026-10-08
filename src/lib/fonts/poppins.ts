import localFont from "next/font/local";

// Optional section typography. Import only where Poppins is intentionally used.
export const poppins = localFont({
  src: [
    { path: "../../../public/fonts/poppins-normal-400.ttf", weight: "400", style: "normal" },
    { path: "../../../public/fonts/poppins-normal-600.ttf", weight: "600", style: "normal" },
  ],
  variable: "--font-poppins",
  display: "swap",
  preload: false,
  fallback: ["Arial", "sans-serif"],
});
