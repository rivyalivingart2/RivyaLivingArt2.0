import Link from "next/link";

export function SiteFooter() {
  return <footer className="site-footer">
    <div><p className="footer-brand">RivyaLivingArt</p><p className="muted">Art for the space. Art for the memory. Art for the person.</p></div>
    <div className="footer-meta"><Link href="/studio">Studio development status</Link><span>Visual study · R8-1</span><span>Sample content, not a live catalogue.</span></div>
  </footer>;
}
