"""Create lossless WOFF2 delivery files; requires fonttools[woff]. Originals stay intact."""
from pathlib import Path
import hashlib, json
from fontTools.ttLib import TTFont
root = Path(__file__).resolve().parents[2]
rows = []
for source in sorted((root / 'projects/design-system/fonts').glob('*.ttf')):
    target = source.with_suffix('.woff2')
    original = TTFont(source, recalcTimestamp=False)
    original.flavor = 'woff2'
    original.save(target)
    decoded = TTFont(target, recalcTimestamp=False)
    assert original.getBestCmap() == decoded.getBestCmap()
    assert original.getGlyphOrder() == decoded.getGlyphOrder()
    assert [(a.axisTag, a.minValue, a.defaultValue, a.maxValue) for a in original['fvar'].axes] == [(a.axisTag, a.minValue, a.defaultValue, a.maxValue) for a in decoded['fvar'].axes]
    for table in ['GSUB', 'GPOS', 'name']:
        assert original[table].compile(original) == decoded[table].compile(decoded), table
    rows.append({'source': str(source.relative_to(root)), 'delivery': str(target.relative_to(root)), 'source_bytes':source.stat().st_size, 'delivery_bytes':target.stat().st_size, 'source_sha256':hashlib.sha256(source.read_bytes()).hexdigest(), 'delivery_sha256':hashlib.sha256(target.read_bytes()).hexdigest(), 'glyphs':len(original.getGlyphOrder()), 'checks':'Character map, glyph order, variable axes, GSUB, GPOS and naming tables preserved; no subsetting.'})
(root / 'kb/records/evidence/editorial-readiness-2026-09-30/fonts.json').write_text(json.dumps(rows,indent=2)+'\n')
print('Font bytes:',sum(x['source_bytes'] for x in rows),'→',sum(x['delivery_bytes'] for x in rows))
