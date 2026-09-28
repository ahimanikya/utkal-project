"""Offline search across the saved visitor index and its area relationships."""
import argparse,json
from pathlib import Path
ROOT=(Path(__file__).resolve().parents[2]/'kb/research')
p=argparse.ArgumentParser(description=__doc__)
p.add_argument('query',nargs='?',default='')
p.add_argument('--json',action='store_true',dest='as_json')
a=p.parse_args()
d=json.loads((ROOT/'references/data/visitor-index.json').read_text())
q=a.query.casefold()
records={x['id']:x for group in ['foods','heritage','facilities'] for x in d[group]}
def match(r):
 return q in ' '.join(str(r.get(k,'')) for k in ['id','name','geography','location_text','category','scope']).casefold()
def children(area):
 return area['heritage_ids']+[f['food_id'] for f in area['food_links']]+area['facility_ids']
areas=[x for x in d['areas'] if match(x) or any(match(records[k]) for k in children(x))]
ids={k for x in areas for k in children(x)}
selected=[r for id,r in records.items() if id in ids or match(r)]
result={'as_of':d['as_of'],'query':a.query,'areas':areas,'records':selected,'scope':d['scope']}
if a.as_json:print(json.dumps(result,ensure_ascii=False,indent=2))
else:
 print(f'Visitor index | source collection as of {d["as_of"]}')
 print(d['scope'])
 for area in areas:
  print('\n'+area['name']+' — '+area['scope'])
  for id in children(area):
   r=records[id];status=r.get('evidence_status')
   print('  '+r['name']+(' ['+status.replace('_',' ')+']' if status else '')+' | '+id)
 unlinked=[r for r in selected if r['id'] not in ids]
 if unlinked:
  print('\nAdditional matching records')
  for r in unlinked:print('  '+r['name']+' | '+r['id'])
 if not areas and not unlinked:print('No saved matches. This is a coverage gap, not proof of absence.')
 print('\nCurrent availability and measured travel routes are not established by this seed index.')
