"""Check linked visitor data for referential and evidence-state consistency.

Does not authenticate external sources or establish current operation.
"""
import json,sys
from datetime import datetime,date
from kb_io import ROOT,concepts
D=json.loads((ROOT/'references/data/visitor-index.json').read_text())
C={c['id']:c for c in concepts()}
S=json.loads((ROOT/'references/data/source-catalog.json').read_text())
errors=[]
def check(ok,msg):
 if not ok:errors.append(msg)
def valid_date(v,label):
 if v is None:return
 try:date.fromisoformat(v)
 except ValueError:errors.append(label+' invalid date')
all_ids=[]
for group in ['areas','foods','heritage','facilities']:
 for r in D[group]:
  all_ids.append(r['id'])
  check(r['id'] in C,'Missing concept: '+r['id'])
  for key in r.get('source_ids',[]):check(key in S,'Unknown source: '+key)
  if group!='areas':
   check(bool(r.get('source_ids')),'Missing evidence: '+r['id'])
   check(set(r['source_ids'])<=set(s['id'] for s in C.get(r['id'],{}).get('sources',[])),'Export/source metadata mismatch: '+r['id'])
check(len(all_ids)==len(set(all_ids)),'Duplicate entity ID')
F={r['id']:r for r in D['foods']};H={r['id']:r for r in D['heritage']};V={r['id']:r for r in D['facilities']};A={r['id']:r for r in D['areas']}
relations=0
for a in A.values():
 for id in a['heritage_ids']:
  check(id in H,'Unknown heritage link: '+id)
  if id in H:check(H[id]['area_id']==a['id'],'Heritage reciprocal link mismatch: '+id)
  relations+=1
 for f in a['food_links']:
  check(f['food_id'] in F,'Unknown food link: '+f['food_id'])
  check(f['relationship'] in {'place_association','regional_pairing'},'Unqualified food relationship')
  if f['food_id'] in F:check(a['id'] in F[f['food_id']]['area_ids'],'Food reciprocal link mismatch')
  check(bool(f['note']),'Missing relationship scope')
  relations+=1
 for id in a['facility_ids']:
  check(id in V,'Unknown facility link: '+id)
  if id in V:check(a['id'] in V[id]['area_ids'],'Facility reciprocal link mismatch')
  relations+=1
for f in F.values():
 for aid in f['area_ids']:
  check(aid in A,'Unknown food area')
  if aid in A:check(f['id'] in [x['food_id'] for x in A[aid]['food_links']],'Unmirrored food area')
 check(not f['confirmed_venue_ids'],'Seed contains unsupported serving-venue link: '+f['id'])
for h in H.values():
 check(h['area_id'] in A,'Unknown heritage area')
 if h['area_id'] in A:check(h['id'] in A[h['area_id']]['heritage_ids'],'Unmirrored heritage area')
for f in V.values():
 for aid in f['area_ids']:
  check(aid in A,'Unknown facility area')
  if aid in A:check(f['id'] in A[aid]['facility_ids'],'Unmirrored facility area')
 check(f['evidence_status'] in {'official_listing','historically_documented','documented_in_saved_source'},'Invalid evidence state')
 check(f['available_now'] is None,'Unsupported availability assertion: '+f['id'])
 for key in ['coordinates','distance_km','travel_minutes','accessibility_audit','operating_hours','prices']:
  check(f[key] is None,'Seed includes unsupported operational field '+key+': '+f['id'])
 for key in ['last_source_check','last_record_review','review_after','source_document_date']:valid_date(f[key],f['id']+' '+key)
 if f['evidence_status']=='historically_documented':check(bool(f['source_document_date']),'Historical record missing source date')
 if f['evidence_status']=='documented_in_saved_source':check(f['last_source_check'] is None,'Import masquerades as new source check')
 if f['heritage_id']:
  check(f['heritage_id'] in H,'Unknown facility parent')
  check(f['heritage_relationship']=='onsite','Missing onsite scope')
  relations+=1
check(D['okf_version']=='0.2','Unexpected KB format')
report={'checked_at':datetime.now().astimezone().isoformat(timespec='seconds'),'result':'PASS' if not errors else 'FAIL','counts':{k:len(D[k]) for k in ['areas','foods','heritage','facilities']},'relationship_checks':relations,'errors':errors,'scope':'Local references, provenance linkage and seed evidence-state controls; not source accuracy or current operation.'}
print(json.dumps(report,ensure_ascii=False,indent=2))
sys.exit(bool(errors))
