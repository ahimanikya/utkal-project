"""Build versioned, consistent vector proofs and sample sheets. No vendor release implied."""
from pathlib import Path
import json, re, copy, hashlib, zipfile, base64, io
from PIL import Image as PILImage
import xml.etree.ElementTree as ET
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.lib.utils import simpleSplit
from reportlab.graphics.shapes import Drawing, Group, Rect, Circle, Line, Image
from reportlab.graphics.svgpath import SvgPath
from reportlab.graphics import renderPDF
ROOT=Path(__file__).resolve().parents[1]; SITE=ROOT.parent/'site'
SPEC=json.loads((ROOT/'kb/specs/sample-specifications-v3.json').read_text())
LETTERS=json.loads((SITE/'design/wordmark-outlines.json').read_text())
CUP_IMAGE=ROOT/'public/images/sea-and-stone-v3/cup-graphical-wrap.png'
CUP_PHOTO=ROOT/'public/images/sea-and-stone-v3/cup-prominent-utkal.png'
OUT=ROOT/'public/artwork/sea-and-stone-v3'; OUT.mkdir(parents=True,exist_ok=True)
PDF=ROOT/'output/pdf';PDF.mkdir(parents=True,exist_ok=True)
SEA='#1D4658';EARTH='#91462F';IVORY='#F2E6D0';STRAW='#C1A263';BLACK='#232423'
NS='{http://www.w3.org/2000/svg}'
master=ET.parse(SITE/'public/assets/brand-v3/symbol-colour.svg').getroot()
base=[c for c in master if c.tag.split('}')[-1] in ['g','path']]
def symbol(sail=EARTH,hull=SEA):
 children=copy.deepcopy(base)
 for node in children:
  for e in node.iter():
   if e.get('fill')==EARTH:e.set('fill',sail)
   elif e.get('fill')==SEA:e.set('fill',hull)
 return ''.join(ET.tostring(c,encoding='unicode').replace('ns0:','').replace(':ns0','') for c in children)
def shaped(d,x,y,scale,colour):
 bx,by,_,_=d['bounds']
 return f'<g fill="{colour}" transform="translate({x} {y}) scale({scale}) translate({-bx} {-by})">'+''.join(f'<path d="{p}"/>' for p in d['paths'])+'</g>'
def word(key,x,y,w,colour):return shaped(LETTERS[key],x,y,w/LETTERS[key]['bounds'][2],colour)
def wave(x,y,w,colour,stroke=1.2):
 return f'<path d="M{x} {y} q{w/8} -4 {w/4} 0 t{w/4} 0 t{w/4} 0 t{w/4} 0" stroke="{colour}" stroke-width="{stroke}" fill="none"/>'
def svg(body,w,h,title,physical=False):
 unit='mm' if physical else ''
 return f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}{unit}" height="{h}{unit}" viewBox="0 0 {w} {h}"><title>{title}</title><desc>Sea and Stone v3. Outlined lettering and shared emblem where used; Story Cup is a raster illustration. Founder review candidate; not approved for manufacture.</desc>{body}</svg>'
raster=base64.b64encode(CUP_IMAGE.read_bytes()).decode('ascii')
cup_art=f'<image x="0" y="0" width="200" height="85" href="data:image/png;base64,{raster}"/>'+word('store',64,2,72,SEA)
body={
 'tshirt-odia':'<g transform="translate(40 8)">'+symbol(IVORY,EARTH)+'</g>'+word('odia',36,153,168,IVORY)+wave(53,235,134,STRAW,2.4)+wave(53,246,134,STRAW,2.4),
 'jhula-english':'<path d="M15 12H265M15 288H265" stroke="'+EARTH+'" stroke-width="3"/><circle cx="233" cy="58" r="16" fill="'+EARTH+'"/><g transform="translate(60 28)">'+symbol(SEA,SEA)+'</g>'+word('store',28,182,224,SEA)+wave(26,250,228,SEA,2)+wave(26,263,228,SEA,2),
 'cup-english':cup_art,
 'bottle-odia':'<g transform="translate(10 8) scale(.3125)">'+symbol(IVORY,EARTH)+'</g>'+word('odia',6,64,58,IVORY)+wave(6,126,58,STRAW,1)+wave(6,133,58,STRAW,1)+'<path d="M6 142H64" stroke="'+EARTH+'" stroke-width="1"/>'}
# Schematic object fronts embed exactly the same artwork as the downloadable print files.
proofs={
 'tee':'<path d="M95 20L145 20L160 36L208 52L242 119L198 142L179 113V317H61V113L42 142L-2 119L32 52L80 36Z" fill="'+BLACK+'"/><path d="M95 20Q120 59 145 20" fill="none" stroke="#55534d" stroke-width="5"/><g transform="translate(60 111) scale(.5)">'+body['tshirt-odia']+'</g>',
 'bag':'<path d="M76 96V51Q120 -13 164 51V96" fill="none" stroke="#b7986c" stroke-width="18"/><rect x="27" y="88" width="186" height="236" rx="5" fill="#c7a16d"/><path d="M38 103H202" stroke="#b7986c" fill="none"/><g transform="translate(50 118) scale(.5)">'+body['jhula-english']+'</g>',
 'bottle':''.join('<g transform="translate('+str(x)+' 0)"><path d="M95 28V17Q120 -4 145 17V28" fill="none" stroke="'+colour+'" stroke-width="10"/><rect x="78" y="27" width="84" height="25" rx="6" fill="'+colour+'"/><rect x="83" y="52" width="74" height="5" fill="#a5a8a5"/><path d="M84 57H156Q180 64 180 87V305Q180 327 161 327H79Q60 327 60 305V87Q60 64 84 57Z" fill="'+colour+'"/><g transform="translate(78 123) scale(1.2)">'+body['bottle-odia']+'</g></g>' for x,colour in [(0,BLACK),(245,SEA)]),
 'cup':f'<image x="0" y="0" width="400" height="225" href="data:image/png;base64,{base64.b64encode(CUP_PHOTO.read_bytes()).decode("ascii")}"/>'}

for row in SPEC['products']:
 art=row['art'];w,h=row['size']
 (OUT/(art+'.svg')).write_text(svg(body[art],w,h,row['name']+' print artwork v3',True))
 (OUT/(art+'-placement.svg')).write_text(svg(proofs[row['diagram']],400 if row['diagram']=='cup' else 490 if row['diagram']=='bottle' else 245,225 if row['diagram']=='cup' else 345,row['name']+' exact-artwork placement schematic'))
# Minimal SVG renderer for the controlled primitives used by these versioned artworks.
def drawing(path):
 root=ET.parse(path).getroot();_,_,w,h=map(float,root.get('viewBox').split())
 def node(e,style):
  tag=e.tag.split('}')[-1];style={**style,**{k:e.get(k) for k in ['fill','stroke','stroke-width'] if e.get(k) is not None}}
  def col(s):return None if s in [None,'none'] else HexColor(s)
  kw={'fillColor':col(style.get('fill','#000000')),'strokeColor':col(style.get('stroke')),'strokeWidth':float(style.get('stroke-width',1))}
  if tag in ['g','svg']:
   ob=Group()
   for c in e:
    child=node(c,style)
    if child is not None:ob.add(child)
  elif tag=='path':ob=SvgPath(e.get('d'),**kw)
  elif tag=='rect':ob=Rect(float(e.get('x',0)),float(e.get('y',0)),float(e.get('width')),float(e.get('height')),rx=float(e.get('rx',0)),ry=float(e.get('rx',0)),**kw)
  elif tag=='image':ob=Image(float(e.get('x',0)),float(e.get('y',0)),float(e.get('width')),float(e.get('height')),PILImage.open(io.BytesIO(base64.b64decode(e.get('href').split(',',1)[1]))));g=Group();g.translate(0,2*float(e.get('y',0))+float(e.get('height')));g.scale(1,-1);g.add(ob);ob=g
  elif tag=='circle':ob=Circle(float(e.get('cx')),float(e.get('cy')),float(e.get('r')),**kw)
  else:return None
  tr=e.get('transform','')
  if tr:
   g=Group();g.add(ob)
   for op,values in re.findall(r'(translate|scale)\(([^)]+)\)',tr):
    vals=[float(v) for v in re.split('[, ]+',values.strip())]
    if op=='translate':g.translate(vals[0],vals[1] if len(vals)>1 else 0)
    else:g.scale(vals[0],vals[1] if len(vals)>1 else vals[0])
   ob=g
  return ob
 d=Drawing(w,h);g=Group();g.translate(0,h);g.scale(1,-1);g.add(node(root,{}));d.add(g);return d
INKS={'Sea':SEA,'Laterite':EARTH,'Ivory':IVORY,'Straw':STRAW}
path=PDF/'utkal-product-sheets-v3.pdf'; c=canvas.Canvas(str(path),pagesize=(595.276,841.89));c.setTitle('Utkal Store - Sea and Stone sample sheets v3');c.setAuthor('Ahimanikya Satapathy / AI-assisted design')
def text(t,x,y,size=9,font='Helvetica',colour=SEA):c.setFillColor(HexColor(colour));c.setFont(font,size);c.drawString(x,y,t)
def wrapped(t,x,y,width,size=9,leading=12,font='Helvetica',colour='#333333'):
 lines=simpleSplit(t,font,size,width)
 for line in lines:text(line,x,y,size,font,colour);y-=leading
 return y
for i,row in enumerate(SPEC['products']):
 c.setFillColor(HexColor('#FBF6EC'));c.rect(0,0,595.276,841.89,fill=1,stroke=0)
 text('UTKAL STORE  /  SEA & STONE',35,805,11,'Helvetica-Bold');text('SAMPLE DEVELOPMENT / v3',365,805,9,'Helvetica-Bold',EARTH)
 text(row['name'],35,769,26,'Times-Bold');text(row['code']+'  |  '+row['language']+' artwork  |  28 September 2026',35,748,9)
 c.setStrokeColor(HexColor(EARTH));c.line(35,735,560,735)
 text('ILLUSTRATIVE TWO-VIEW RENDER' if row['diagram']=='cup' else 'SHARED-ARTWORK PLACEMENT',35,718,8,'Helvetica-Bold');text('ILLUSTRATED WRAP  /  NOT TO SCALE' if row['diagram']=='cup' else 'FLAT PRINT FILE  /  NOT TO SCALE',297,718,8,'Helvetica-Bold')
 d=drawing(OUT/(row['art']+'-placement.svg'));scale=min(220/d.width,230/d.height);d.scale(scale,scale);renderPDF.draw(d,c,35+(220-d.width*scale)/2,470)
 bg=BLACK if row['diagram']=='tee' else BLACK if row['diagram']=='bottle' else '#c7a16d' if row['diagram']=='bag' else '#fffaf1'
 c.setFillColor(HexColor(bg));c.roundRect(293,482,267,213,6,fill=1,stroke=0)
 d=drawing(OUT/(row['art']+'.svg'));sc=min(243/d.width,185/d.height);d.scale(sc,sc);renderPDF.draw(d,c,305+(243-d.width*sc)/2,496+(185-d.height*sc)/2)
 text('Canvas: '+str(row['size'][0])+' x '+str(row['size'][1])+' mm (proposed)',297,467,9)
 x=297
 for name in row['inks']:
  c.setFillColor(HexColor(INKS[name]));c.rect(x,447,9,9,fill=1,stroke=0);text(name,x+13,448,8);x+=78
 text('Raster illustration: about 244 ppi at 200 x 85 mm.' if row['diagram']=='cup' else 'RGB references; supplier must match physical ink/finish.',297,433,8,colour='#655f55')
 y=409
 for label,value in [('BASE',row['base']),('PROPOSED PRODUCT',row['proposal']),('PLACEMENT',row['placement']),('PROCESS TO QUOTE',row['process']),('SUPPLIER TO CONFIRM',row['confirm']),('SAMPLE REQUEST',row['sample'])]:
  text(label,35,y,8,'Helvetica-Bold',EARTH);end=wrapped(value,154,y,405,9,12);y=end-12
 c.setStrokeColor(HexColor('#cbbb9e'));c.line(35,y+1,560,y+1)
 y-=13
 y=wrapped('Quote fields: supplier / blank SKU / MOQ / 25, 50 and 100-unit prices / setup / sample cost / lead time / taxes / shipping. Quote bands are not an order.',35,y,525,8.5,11)
 if row['diagram']=='cup':
  y-=8;y=wrapped('Story source: Ministry of Culture / PIB, 6 Feb 2025, release 2100365. Maritime memory and the boat ritual are sourced; the illustrated sequence is imaginative, not a literal reconstruction.',35,y,525,8,10)
 text('FOUNDER REVIEW CANDIDATE - NOT APPROVED FOR MANUFACTURE',35,49,8,'Helvetica-Bold',EARTH)
 text('Creative direction: Ahimanikya Satapathy. AI-assisted development. Noto font credit retained.',35,35,7.5,colour='#655f55')
 text(str(i+1)+' / 4',533,35,8)
 if y<65:raise ValueError('Sheet content exceeds footer area: '+row['id']+' '+str(y))
 c.showPage()
c.save()
# Website download is byte-identical to the printable deliverable.
(OUT/'utkal-product-sheets-v3.pdf').write_bytes(path.read_bytes())
print('Built 3 shared-emblem designs, 1 illustrated cup wrap, 4 placement proofs and 4-page PDF: '+str(path))
