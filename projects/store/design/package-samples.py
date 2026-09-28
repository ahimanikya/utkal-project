"""Regenerate product sheets, asset manifest and portable review ZIP after artwork build."""
from pathlib import Path
import json,hashlib,zipfile,datetime
s=Path(__file__).resolve().parents[1];k=s/'kb';spec=json.loads((k/'specs/sample-specifications-v3.json').read_text())
for row in spec['products']:
 text=f'''---
type: Product specification
title: "{row['name']} sample sheet v3"
---

# {row['name']} sample sheet v3

{row['code']} · Proposed for review, not an order.

Base: {row['base']}

Product: {row['proposal']}

Artwork canvas: {row['size'][0]} × {row['size'][1]} mm, proposed.

Placement: {row['placement']}

Process: {row['process']}

Supplier confirms: {row['confirm']}

Sample request: {row['sample']}

Quote: supplier / SKU / MOQ / 25, 50, 100-unit prices / setup / sample / lead time / taxes / shipping / defects. Quote bands are not orders.

[Current pack context](sample-pack-v3.md).
'''
 (k/'specs'/('sheet-'+row['id']+'-v3.md')).write_text(text)
assets={}
for p in sorted((s/'public/artwork/sea-and-stone-v3').iterdir()):assets['artwork/'+p.name]=p.read_bytes()
for p in sorted((k/'specs').glob('sheet-*-v3.md')):assets['product-sheets/'+p.name]=p.read_text().replace('(sample-pack-v3.md)','(../README.md)').encode()
assets['source-art/cup-graphical-wrap.png']=(s/'public/images/sea-and-stone-v3/cup-graphical-wrap.png').read_bytes()
assets['specifications.json']=(k/'specs/sample-specifications-v3.json').read_bytes()
readme=(k/'specs/sample-pack-v3.md').read_text().replace('(sample-specifications-v3.json)','(specifications.json)').replace('[the generation record](../records/graphical-cup-prompts-v3.json)','the generation record retained in the project KB').replace('[Exact refinement prompts](../records/brand-refinements-v3-prompts.json)','Exact refinement prompts retained in the project KB')
readme=readme.replace('[Premium bottle generation prompts](../records/premium-bottle-prompts-v3.json)','Premium bottle generation prompts retained in the project KB')
assets['README.md']=readme.encode();assets['FONT-LICENCE.txt']=(s/'public/fonts/OFL.txt').read_bytes()
manifest={'version':'3.1-review','status':'Not approved for manufacture','credit':spec['credit'],'assets':[{'path':name,'sha256':hashlib.sha256(data).hexdigest()} for name,data in assets.items()]}
assets['manifest.json']=(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n').encode()
(k/'records/sample-pack-v3-assets.json').write_bytes(assets['manifest.json'])
with zipfile.ZipFile(s/'public/artwork/utkal-sample-pack-v3.zip','w',zipfile.ZIP_DEFLATED) as z:
 for name,data in assets.items():z.writestr(name,data)
print('Packaged',len(assets),'portable files with relative links and SHA-256 manifest.')
