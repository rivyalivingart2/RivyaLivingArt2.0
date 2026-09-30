from __future__ import annotations

import importlib.util
import json
import tempfile
from pathlib import Path

SCRIPT = Path(__file__).with_name('apply-approved-local-implementation.py')
spec = importlib.util.spec_from_file_location('impl', SCRIPT)
impl = importlib.util.module_from_spec(spec)
assert spec.loader
spec.loader.exec_module(impl)


def write(root: Path, rel: str, text: str) -> None:
    p = root / rel
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(text, encoding='utf-8')


def read(root: Path, rel: str) -> str:
    return (root / rel).read_text(encoding='utf-8')


def test_product_card(root: Path) -> None:
    rel = 'src/components/shop/product-card.tsx'
    write(root, rel, """import type {ShopProduct} from '@/lib/shop-model';
export type CardProduct = Pick<ShopProduct, 'id' | 'slug' | 'name' | 'subtitle' | 'category' | 'tier' | 'material' | 'image' | 'imageAlt' | 'imagePosition'> & { price?: { mode: 'request' } | { mode: 'fixed' | 'starting'; amount: number; sample: true } };
function formatPrice(price: { mode: 'request' } | { mode: 'fixed' | 'starting'; amount: number; sample: true }) {
 if (!price) return 'Price on request';
 return 'x';
}
""")
    impl.edit_product_card(root)
    s = read(root, rel)
    assert "'imagePosition' | 'price'" in s
    assert "function formatPrice(price: ShopProduct['price'])" in s


def test_content(root: Path) -> None:
    write(root, 'src/lib/shop-editorial.ts', """export const shopPages={
 '/workshops':{title:'Learn the craft.'},
 '/resin-art-mumbai':{},
 '/varmala-preservation':{},
 '/process':{title:'A piece, shaped together.'}
};
""")
    docs = [{'id': f'DB{i:03d}', 'title': f'x{i}'} for i in range(1, 40)]
    write(root, 'src/lib/reviewed-journal.json', json.dumps(docs))
    write(root, 'tests/release-contracts.test.mjs', "assert.equal(baselineContent.length,57);assert.equal(baselineContent.filter(d=>d.kind==='article').length,39);\n")
    for rel in impl.DELETE_ROUTES:
        write(root, rel, 'route')
    impl.edit_unapproved_content(root)
    s = read(root, 'src/lib/shop-editorial.ts')
    assert '/workshops' not in s and '/process' in s
    data = json.loads(read(root, 'src/lib/reviewed-journal.json'))
    assert len(data) == 36 and not ({'DB037','DB038','DB039'} & {d['id'] for d in data})
    assert 'baselineContent.length,48' in read(root, 'tests/release-contracts.test.mjs')
    assert all(not (root / rel).exists() for rel in impl.DELETE_ROUTES)


def test_fake_ui(root: Path) -> None:
    write(root, 'src/components/studio/catalogue-editor.tsx', """const x=1;
 const [showCsv, setShowCsv]=useState(false);
const y=2;
   {showCsv && (
    <div>fake csv</div>
   )}

  </>
 );
}
""")
    write(root, 'src/components/studio/media-library.tsx', """ const [showUpload, setShowUpload]=useState(false);
 return <><div className={s.heading}><div><h1>The public image collection.</h1><p>Descriptions, framing and provenance for approved product imagery.</p></div>
    <button
      disabled={busy}
      onClick={()=>setShowUpload(true)}
      className={s.button} style={{marginLeft:'auto'}}
    >Upload Asset</button>
</div><p role="status" className={s.status}>{message}</p>
   {showUpload && (
    <div>fake upload</div>
   )}

  </>;
}
""")
    write(root, 'src/components/studio/workspace.module.css', """.x{}
.modalOverlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(4px); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 24px; }
.modalContent { background: #0e1927; padding: 32px; border: 1px solid rgba(255,255,255,0.1); width: 100%; box-shadow: 0 10px 40px rgba(0,0,0,0.5); }
""")
    impl.remove_fake_import_and_upload(root)
    assert 'showCsv' not in read(root, 'src/components/studio/catalogue-editor.tsx')
    assert 'showUpload' not in read(root, 'src/components/studio/media-library.tsx')
    assert 'Upload Asset' not in read(root, 'src/components/studio/media-library.tsx')
    css = read(root, 'src/components/studio/workspace.module.css')
    assert '.modalOverlay' not in css and '.modalContent' not in css


def test_whatsapp(root: Path) -> None:
    write(root, 'src/components/shop/shop-site.tsx', """before
<div className={s.provenanceStrip} style={{ display: 'flex' }}>
  <span>hardcoded claims</span>
</div>
<div className={s.actions}><a href="https://wa.me/918320404132">Chat with the artist</a></div>
<p className={s.help} style={{ marginTop: '16px' }}>Complete this piece</p>
after
""")
    impl.restore_order_only_whatsapp(root)
    s = read(root, 'src/components/shop/shop-site.tsx')
    assert 'wa.me' not in s and 'hardcoded claims' not in s
    assert 'Customize this piece ↗' in s
    assert 'Complete this piece' in s


def test_analytics(root: Path) -> None:
    write(root, 'src/components/rivya/studio.tsx', """import {Menu,ArrowUpRight,ChevronRight,LayoutDashboard,Package,FileText,Image,MessageSquare,Settings,History,SlidersHorizontal,Users,Upload,Trash2,Layers,BarChart} from 'lucide-react';
const modules=[['overview','Overview',LayoutDashboard],['analytics','Analytics',BarChart]] as const;
function X(){}
   else if(section==='analytics')view=<StudioAnalytics/>;
function StudioAnalytics() {
 return <>fabricated benchmark</>;
}
""")
    impl.remove_fabricated_analytics(root)
    s = read(root, 'src/components/rivya/studio.tsx')
    assert 'BarChart' not in s and 'analytics' not in s and 'fabricated benchmark' not in s
    assert 'function X(){}' in s


def test_safety_guard() -> None:
    import subprocess
    with tempfile.TemporaryDirectory() as td:
        root = Path(td)
        subprocess.check_call(['git','init','-q',str(root)])
        subprocess.check_call(['git','-C',str(root),'config','user.email','qa@example.invalid'])
        subprocess.check_call(['git','-C',str(root),'config','user.name','QA'])
        rel='guard.txt'
        write(root, rel, 'guarded\n')
        subprocess.check_call(['git','-C',str(root),'add',rel])
        subprocess.check_call(['git','-C',str(root),'commit','-qm','fixture'])
        old_head, old_blobs = impl.EXPECTED_HEAD, impl.EXPECTED_BLOBS
        try:
            impl.EXPECTED_HEAD = subprocess.check_output(['git','-C',str(root),'rev-parse','HEAD'], text=True).strip()
            impl.EXPECTED_BLOBS = {rel: subprocess.check_output(['git','-C',str(root),'hash-object',rel], text=True).strip()}
            impl.verify_repo(root)
            write(root, rel, 'dirty\n')
            try:
                impl.verify_repo(root)
            except SystemExit as exc:
                assert 'working tree is not clean' in str(exc)
            else:
                raise AssertionError('dirty tree was not rejected')
        finally:
            impl.EXPECTED_HEAD, impl.EXPECTED_BLOBS = old_head, old_blobs


def main() -> None:
    with tempfile.TemporaryDirectory() as td:
        root = Path(td)
        test_product_card(root)
    with tempfile.TemporaryDirectory() as td:
        root = Path(td)
        test_content(root)
    with tempfile.TemporaryDirectory() as td:
        root = Path(td)
        test_fake_ui(root)
    with tempfile.TemporaryDirectory() as td:
        root = Path(td)
        test_whatsapp(root)
    with tempfile.TemporaryDirectory() as td:
        root = Path(td)
        test_analytics(root)
    test_safety_guard()
    print('PASS: all transformation and safety-guard fixture tests')


if __name__ == '__main__':
    main()
