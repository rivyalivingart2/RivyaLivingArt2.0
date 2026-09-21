import Link from "next/link";

export function BuildHoldingScreen({ studio = false }: { studio?: boolean }) {
  return <main id="main-content" className="holding-page"><span className="eyebrow">RivyaLivingArt · In development</span><h1>{studio ? "The working side of the atelier." : "An atelier taking shape."}</h1><p>{studio ? "The custom Studio and staff sign-in have not been connected. There is no login form here and no staff or customer data is exposed." : "This first visual build is not a live catalogue. The owner review is available only in the explicitly configured preview environment."}</p><Link className="text-link" href="/">Return to the website <span aria-hidden="true">↗</span></Link></main>;
}
