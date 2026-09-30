#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import json
import subprocess
import sys
from pathlib import Path

EXPECTED_HEAD = "0678a8dfb4df7ad140e0e7182742f897444af390"
EXPECTED_BLOBS = {
    "src/components/shop/product-card.tsx": "f8c782dfffc9adba021fd287da0307f205e31285",
    "src/lib/shop-editorial.ts": "81fca191639f46216588f79710c527945ea663cf",
    "src/lib/reviewed-journal.json": "45c1bfe11b616d6f25e344729db18fda016560a2",
    "tests/release-contracts.test.mjs": "45f4514838b539acaf403630569020ec8731bde7",
    "src/components/studio/catalogue-editor.tsx": "9f1228100c0b5adde889710a746d0aa62f69a805",
    "src/components/studio/media-library.tsx": "beec1965cb81e23d50964e15c78b87f5f130bdc5",
    "src/components/studio/workspace.module.css": "63789cc9d42206e1b687db6d1a12f0d49308df94",
    "src/components/shop/shop-site.tsx": "e57061c6f8c8ab8ee498cc83def9480c2818d6b2",
    "src/components/rivya/studio.tsx": "0a077ceb22ec4d25a4760c29e2e361c93b8ba082",
    "src/app/resin-art-chennai/page.tsx": "751da841a4a4b76ba775911bbeb3336502e3bf3e",
    "src/app/resin-art-delhi/page.tsx": "8ebbb50c54287a2013a9aba47cf94b2f5d878add",
    "src/app/resin-art-mumbai/page.tsx": "05721d545f73fb2ff04c1e965431c9f40a064f88",
    "src/app/resin-art-pune/page.tsx": "1113233f06444377100cd823b14a9bffa8f4bed8",
    "src/app/varmala-preservation/page.tsx": "9beae4e50fcd9275fa54e3e8aeca42f60012cbbd",
    "src/app/workshops/page.tsx": "99b9ba1f0a3a557cc152e488fb550ec7b9dd852c",
}

DELETE_ROUTES = [
    "src/app/resin-art-chennai/page.tsx",
    "src/app/resin-art-delhi/page.tsx",
    "src/app/resin-art-mumbai/page.tsx",
    "src/app/resin-art-pune/page.tsx",
    "src/app/varmala-preservation/page.tsx",
    "src/app/workshops/page.tsx",
]


def run(*args: str) -> str:
    return subprocess.check_output(args, text=True).strip()


def fail(msg: str) -> None:
    raise SystemExit(f"ERROR: {msg}")


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        fail(f"{label}: expected exactly one match, found {count}")
    return text.replace(old, new, 1)


def remove_between(text: str, start: str, end: str, label: str) -> str:
    i = text.find(start)
    if i < 0:
        fail(f"{label}: start marker missing")
    j = text.find(end, i + len(start))
    if j < 0:
        fail(f"{label}: end marker missing")
    return text[:i] + text[j:]


def verify_repo(root: Path) -> None:
    if not (root / ".git").exists():
        fail(f"{root} is not a Git checkout")
    head = run("git", "-C", str(root), "rev-parse", "HEAD")
    if head != EXPECTED_HEAD:
        fail(f"expected HEAD {EXPECTED_HEAD}, found {head}")
    status = run("git", "-C", str(root), "status", "--porcelain")
    if status:
        fail("working tree is not clean; refusing to mix changes")
    for rel, expected in EXPECTED_BLOBS.items():
        p = root / rel
        if not p.exists():
            fail(f"required current-head file missing: {rel}")
        actual = run("git", "-C", str(root), "hash-object", rel)
        if actual != expected:
            fail(f"{rel} blob mismatch: expected {expected}, found {actual}")


def edit_product_card(root: Path) -> None:
    p = root / "src/components/shop/product-card.tsx"
    s = p.read_text(encoding="utf-8")
    s = replace_once(
        s,
        "export type CardProduct = Pick<ShopProduct, 'id' | 'slug' | 'name' | 'subtitle' | 'category' | 'tier' | 'material' | 'image' | 'imageAlt' | 'imagePosition'> & { price?: { mode: 'request' } | { mode: 'fixed' | 'starting'; amount: number; sample: true } };",
        "export type CardProduct = Pick<ShopProduct, 'id' | 'slug' | 'name' | 'subtitle' | 'category' | 'tier' | 'material' | 'image' | 'imageAlt' | 'imagePosition' | 'price'>;",
        "product-card CardProduct",
    )
    s = replace_once(
        s,
        "function formatPrice(price: { mode: 'request' } | { mode: 'fixed' | 'starting'; amount: number; sample: true }) {",
        "function formatPrice(price: ShopProduct['price']) {",
        "product-card formatPrice",
    )
    p.write_text(s, encoding="utf-8")


def edit_unapproved_content(root: Path) -> None:
    p = root / "src/lib/shop-editorial.ts"
    s = p.read_text(encoding="utf-8")
    start = " '/workshops':{title:'Learn the craft.'"
    end = " '/process':{title:'A piece, shaped together.'"
    i = s.find(start)
    j = s.find(end)
    if i < 0 or j < 0 or j <= i:
        fail("shop-editorial unapproved page block markers not found")
    s = s[:i] + s[j:]
    p.write_text(s, encoding="utf-8")

    p = root / "src/lib/reviewed-journal.json"
    data = json.loads(p.read_text(encoding="utf-8"))
    ids = [x.get("id") for x in data]
    for article_id in ("DB037", "DB038", "DB039"):
        if ids.count(article_id) != 1:
            fail(f"expected one {article_id} article, found {ids.count(article_id)}")
    data = [x for x in data if x.get("id") not in {"DB037", "DB038", "DB039"}]
    if len(data) != 36:
        fail(f"expected 36 reviewed articles after removal, found {len(data)}")
    p.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    p = root / "tests/release-contracts.test.mjs"
    s = p.read_text(encoding="utf-8")
    s = replace_once(
        s,
        "assert.equal(baselineContent.length,57);assert.equal(baselineContent.filter(d=>d.kind==='article').length,39);",
        "assert.equal(baselineContent.length,48);assert.equal(baselineContent.filter(d=>d.kind==='article').length,36);",
        "release-contract content counts",
    )
    p.write_text(s, encoding="utf-8")

    for rel in DELETE_ROUTES:
        (root / rel).unlink()


def remove_fake_import_and_upload(root: Path) -> None:
    p = root / "src/components/studio/catalogue-editor.tsx"
    s = p.read_text(encoding="utf-8")
    s = replace_once(s, " const [showCsv, setShowCsv]=useState(false);\n", "", "catalogue fake CSV state")
    start = "\n   {showCsv && (\n"
    end = "\n\n  </>\n );\n}"
    i = s.find(start)
    j = s.find(end, i + 1)
    if i < 0 or j < 0:
        fail("catalogue fake CSV modal markers missing")
    s = s[:i] + s[j:]
    p.write_text(s, encoding="utf-8")

    p = root / "src/components/studio/media-library.tsx"
    s = p.read_text(encoding="utf-8")
    s = replace_once(s, " const [showUpload, setShowUpload]=useState(false);\n", "", "media fake upload state")
    header_old = ''' return <><div className={s.heading}><div><h1>The public image collection.</h1><p>Descriptions, framing and provenance for approved product imagery.</p></div>
    <button
      disabled={busy}
      onClick={()=>setShowUpload(true)}
      className={s.button} style={{marginLeft:'auto'}}
    >Upload Asset</button>
</div><p role="status" className={s.status}>'''
    header_new = ''' return <><div className={s.heading}><div><h1>The public image collection.</h1><p>Descriptions, framing and provenance for approved product imagery.</p></div></div><p role="status" className={s.status}>'''
    s = replace_once(s, header_old, header_new, "media fake upload trigger")
    start = "\n   {showUpload && (\n"
    end = "\n\n  </>;\n}"
    i = s.find(start)
    j = s.find(end, i + 1)
    if i < 0 or j < 0:
        fail("media fake upload modal markers missing")
    s = s[:i] + s[j:]
    p.write_text(s, encoding="utf-8")

    p = root / "src/components/studio/workspace.module.css"
    s = p.read_text(encoding="utf-8")
    for line in [
        ".modalOverlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(4px); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 24px; }\n",
        ".modalContent { background: #0e1927; padding: 32px; border: 1px solid rgba(255,255,255,0.1); width: 100%; box-shadow: 0 10px 40px rgba(0,0,0,0.5); }\n",
    ]:
        s = replace_once(s, line, "", "unused fake modal CSS")
    p.write_text(s, encoding="utf-8")


def restore_order_only_whatsapp(root: Path) -> None:
    p = root / "src/components/shop/shop-site.tsx"
    s = p.read_text(encoding="utf-8")
    start = "\n<div className={s.provenanceStrip}"
    end = "\n<p className={s.help} style={{ marginTop: '16px' }}>"
    i = s.find(start)
    j = s.find(end, i + 1)
    if i < 0 or j < 0:
        fail("PDP direct-chat/provenance block markers missing")
    replacement = "\n<div className={s.actions}><Link className={button()} href={`/pieces/${product.slug}/customize`}>Customize this piece ↗</Link></div>"
    s = s[:i] + replacement + s[j:]
    p.write_text(s, encoding="utf-8")


def remove_fabricated_analytics(root: Path) -> None:
    p = root / "src/components/rivya/studio.tsx"
    s = p.read_text(encoding="utf-8")
    s = replace_once(
        s,
        "import {Menu,ArrowUpRight,ChevronRight,LayoutDashboard,Package,FileText,Image,MessageSquare,Settings,History,SlidersHorizontal,Users,Upload,Trash2,Layers,BarChart} from 'lucide-react';",
        "import {Menu,ArrowUpRight,ChevronRight,LayoutDashboard,Package,FileText,Image,MessageSquare,Settings,History,SlidersHorizontal,Users,Upload,Trash2,Layers} from 'lucide-react';",
        "analytics icon import",
    )
    s = replace_once(s, ",['analytics','Analytics',BarChart]", "", "analytics nav item")
    s = replace_once(s, "   else if(section==='analytics')view=<StudioAnalytics/>;\n", "", "analytics route branch")
    marker = "\nfunction StudioAnalytics() {"
    i = s.find(marker)
    if i < 0:
        fail("StudioAnalytics function missing")
    trailing = s[i:]
    if "function " in trailing[len(marker):] and trailing.rfind("function ") > 0:
        fail("StudioAnalytics is not the final function; refusing broad truncation")
    s = s[:i].rstrip() + "\n"
    p.write_text(s, encoding="utf-8")


def main() -> None:
    if len(sys.argv) != 2:
        fail("usage: apply-approved-local-implementation.py /absolute/path/to/RivyaLivingArt2.0")
    root = Path(sys.argv[1]).resolve()
    verify_repo(root)
    edit_product_card(root)
    edit_unapproved_content(root)
    remove_fake_import_and_upload(root)
    restore_order_only_whatsapp(root)
    remove_fabricated_analytics(root)
    print("Approved local implementation applied.")
    print(run("git", "-C", str(root), "status", "--short"))


if __name__ == "__main__":
    main()
