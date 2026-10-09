"""Verify WOFF2 compression preserves the existing licensed Inter fonts."""
import hashlib
import json
from pathlib import Path
from fontTools.ttLib import TTFont

rows = []
for weight in (400, 500, 600):
    source = Path(f"public/fonts/inter-normal-{weight}.ttf")
    target = Path(f"src/styles/fonts/inter-normal-{weight}.woff2")
    original, compressed = TTFont(source), TTFont(target)
    assert original.getBestCmap() == compressed.getBestCmap()
    assert original.getGlyphOrder() == compressed.getGlyphOrder()
    assert original["hmtx"].metrics == compressed["hmtx"].metrics
    rows.append({
        "weight": weight, "source": str(source), "target": str(target),
        "sourceBytes": source.stat().st_size, "targetBytes": target.stat().st_size,
        "sourceSha256": hashlib.sha256(source.read_bytes()).hexdigest(),
        "targetSha256": hashlib.sha256(target.read_bytes()).hexdigest(),
        "cmapGlyphOrderHorizontalMetrics": "unchanged",
    })
report = {
    "license": "public/fonts/licenses/inter-OFL.txt",
    "method": "FontTools 4.61.1 WOFF2 compression only, no subsetting or new runtime dependency",
    "files": rows,
}
Path("docs/redesign/old-design-migration-2026-10-08/m2-fonts.json").write_text(json.dumps(report, indent=2) + "\n", encoding="utf8")
print("Inter 400/500/600 character maps, glyph order and horizontal metrics unchanged.")
