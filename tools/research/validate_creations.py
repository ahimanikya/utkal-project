"""Check person/work credits and economic references, not fame or source truth."""
import json,sys
from kb_io import ROOT,read_concept
D=ROOT/'references/data'
def load(n):return json.loads((D/(n+'.json')).read_text())
p=load('people-creations');e=load('creative-economy');sources=load('source-catalog');atlas={o['id']:o for o in load('statistics-atlas')['observations']};errors=[]
def check(ok,msg):
 if not ok:errors.append(msg)
def canonical(cid,ids):
 path=ROOT/(cid+'.md');check(path.is_file(),'Missing concept '+cid)
 check(bool(ids) and set(ids)<=sources.keys(),'Missing evidence source '+cid)
 if path.is_file():
  meta,_=read_concept(path);check(set(ids)<={s['id'] for s in meta.get('sources',[])},'Page/source disagreement '+cid)
people={r['id']:r for r in p['people']};works={r['id']:r for r in p['works']}
check(len(people)==len(p['people']),'Duplicate person')
check(len(works)==len(p['works']),'Duplicate work')
for cid,r in people.items():
 canonical(cid,r['source_ids']);check(bool(r['odisha_connection']['description']),'Missing Odisha connection '+cid)
 check(set(r['odisha_connection']['source_ids'])<=set(r['source_ids']),'Unsourced Odisha connection '+cid)
 for w in r['work_ids']:
  check(w in works,'Unknown work '+w)
  if w in works:check(any(c['person_id']==cid for c in works[w]['creator_links']),'Missing reciprocal credit '+cid)
 for s in r['significance_evidence']:check(bool(s['basis']) and set(s['source_ids'])<=set(r['source_ids']),'Unsourced recognition '+cid)
for cid,r in works.items():
 canonical(cid,r['source_ids'])
 for c in r['creator_links']:
  check(c['person_id'] in people,'Unknown creator '+cid)
  check(bool(c['role']) and set(c['source_ids'])<=set(r['source_ids']),'Unsourced role '+cid)
  if c['person_id'] in people:check(cid in people[c['person_id']]['work_ids'],'Missing person/work link '+cid)
 if r.get('english_access'):check(set(r['english_access']['source_ids'])<=set(r['source_ids']),'Unsourced language '+cid)
for cid in e['textile_tradition_ids']+e['sweet_concept_ids']:check((ROOT/(cid+'.md')).exists(),'Missing product concept '+cid)
for r in e['garment_forms']:check(set(r['source_ids'])<=sources.keys(),'Unknown garment source')
for r in e['market_observation_refs']:
 check(r['dataset']=='statistics-atlas.json' and r['observation_id'] in atlas,'Unresolved market observation')
 check('value' not in r,'Duplicated canonical statistic')
for r in e['sweet_metrics']:
 if r['evidence_status']=='not_established':check(r['value'] is None,'Unknown converted to number '+r['metric'])
check(p['human_review_claimed'] is False and e['human_review_claimed'] is False,'Human review needs explicit named provenance')
print(json.dumps({'result':'FAIL' if errors else 'PASS','people':len(people),'works':len(works),'garment_forms':len(e['garment_forms']),'market_observation_refs':len(e['market_observation_refs']),'errors':errors,'scope':'Referential integrity, explicit credits and missing-value semantics; not independent source verification or public approval.'},indent=2))
sys.exit(bool(errors))
