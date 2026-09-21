import Link from "next/link";

export default function NotFound() {
  return <main id="main-content" className="holding-page"><span className="eyebrow">404 / A different direction</span><h1>This piece of the story<br />isn’t here.</h1><p>The address may have changed, or this part of the atelier is still taking shape.</p><Link className="button button-primary" href="/">Back to RivyaLivingArt <span aria-hidden="true">↗</span></Link></main>;
}
