"""Create smaller common-script Inter files, retaining the original for other glyphs.

Development-only: FontTools 4.61.1 with Brotli. No runtime dependency or font upgrade.
The disjoint CSS ranges in layout.tsx retain the original font's entire coverage.
"""
import hashlib
import json
import re
from pathlib import Path
from fontTools import subset
from fontTools.pens.recordingPen import DecomposingRecordingPen
from fontTools.ttLib import TTFont

RANGES = [(0, 0x24F), (0x300, 0x36F), (0x1E00, 0x1EFF), (0x2000, 0x206F),
          (0x20A0, 0x20CF), (0x2100, 0x214F), (0x2190, 0x21FF),
          (0x2212, 0x2212), (0x2300, 0x23FF), (0x2500, 0x27FF),
          (0xFEFF, 0xFEFF), (0xFFFD, 0xFFFD)]
common = {cp for start, end in RANGES for cp in range(start, end + 1)}

def css_ranges(points):
    spans = []
    for point in sorted(points):
        if spans and point == spans[-1][1] + 1:
            spans[-1][1] = point
        else:
            spans.append([point, point])
    return ",".join(f"U+{a:04X}" if a == b else f"U+{a:04X}-{b:04X}" for a, b in spans)

# Do not advertise absent characters: that would download Inter unnecessarily
# for Hindi/Gujarati, whose native fallback is intentionally unchanged.
original_points = set(TTFont("src/styles/fonts/inter-normal-400.woff2").getBestCmap())
extended = original_points - common
assert not (extended & common)
assert (original_points & common) | extended == original_points
css = [css_ranges(common), css_ranges(extended)]
layout = Path("src/app/layout.tsx")
text = layout.read_bytes().decode("utf8")
index = iter(css)
text, replacements = re.subn(r'(prop: "unicode-range", value: ")[^"]*(")', lambda m: m[1] + next(index) + m[2], text)
assert replacements == 2

def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def outline(font, name):
    glyphs = font.getGlyphSet()
    pen = DecomposingRecordingPen(glyphs)
    glyphs[name].draw(pen)
    return pen.value

rows = []
for weight in (400, 500, 600):
    source = Path(f"src/styles/fonts/inter-normal-{weight}.woff2")
    target = Path(f"src/styles/fonts/inter-common-{weight}.woff2")
    original = TTFont(source)
    assert set(original.getBestCmap()) == original_points
    options = subset.Options()
    options.notdef_outline = True
    options.layout_features = ["*"]
    options.glyph_names = True
    options.name_IDs = ["*"]
    options.name_legacy = True
    options.name_languages = ["*"]
    font = TTFont(source)
    tool = subset.Subsetter(options=options)
    tool.populate(unicodes=common)
    tool.subset(font)
    font.flavor = "woff2"
    font.save(target)
    result = TTFont(target)
    expected = {cp: glyph for cp, glyph in original.getBestCmap().items() if cp in common}
    assert result.getBestCmap() == expected
    # Retain shapes and spacing for every included character and layout-closure glyph.
    for glyph in result.getGlyphOrder():
        assert result["hmtx"].metrics[glyph] == original["hmtx"].metrics[glyph]
        assert outline(result, glyph) == outline(original, glyph)
    for table, fields in {"head": ["unitsPerEm"], "hhea": ["ascent", "descent", "lineGap"],
                          "OS/2": ["sTypoAscender", "sTypoDescender", "sTypoLineGap", "sxHeight", "sCapHeight"]}.items():
        for field in fields:
            assert getattr(result[table], field) == getattr(original[table], field)
    rows.append({"weight": weight, "source": source.as_posix(), "target": target.as_posix(),
                 "sourceBytes": source.stat().st_size, "targetBytes": target.stat().st_size,
                 "sourceSha256": digest(source), "targetSha256": digest(target),
                 "originalCodepoints": len(original.getBestCmap()), "commonCodepoints": len(expected),
                 "retainedGlyphs": len(result.getGlyphOrder()),
                 "outlinesAndHorizontalAndVerticalMetrics": "unchanged for all retained glyphs",
                 "otherCodepoints": "Original full font remains available under complementary unicode-range"})
report = {"license": "public/fonts/licenses/inter-OFL.txt", "method": "FontTools 4.61.1; preserve layout-feature closure, hints, names, outlines and metrics; no original font modified", "ranges": RANGES, "commonCssRange": css[0], "extendedCssRange": css[1], "completeOriginalCoverage": True, "disjointCssRanges": True, "files": rows}
layout.write_bytes(text.encode("utf8"))
Path("docs/redesign/old-design-migration-2026-10-08/m10-font-split.json").write_text(json.dumps(report, indent=2) + "\n", encoding="utf8")
print(json.dumps({"beforeBytes": sum(r["sourceBytes"] for r in rows), "commonBytes": sum(r["targetBytes"] for r in rows), "files": rows}))
