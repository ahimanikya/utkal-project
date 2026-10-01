"""Validate scoped athlete result records, not factual truth or current eligibility."""
import json,sys
from kb_io import ROOT,read_concept
D=ROOT/'references/data'
def load(n):return json.loads((D/(n+'.json')).read_text())
d=load('sports-achievements');sources=load('source-catalog');people={p['id']:p for p in load('people-creations')['people']};errors=[]
def check(ok,msg):
 if not ok:errors.append(msg)
check(len(d['person_ids'])==len(set(d['person_ids'])),'Duplicate athlete identity')
seen=set()
for cid in d['person_ids']:
 check(cid in people,'Unresolved athlete '+cid)
 if cid in people:
  p=people[cid];check(bool(p['odisha_connection']['source_ids']),'Missing Odisha evidence '+cid)
for o in d['observations']:
 check(o['id'] not in seen,'Duplicate observation '+o['id']);seen.add(o['id'])
 check(o['person_id'] in d['person_ids'],'Unmapped observation person '+o['id'])
 check(bool(o['period']) and bool(o['unit']) and bool(o['stage']) and bool(o['geography']),'Incomplete event scope '+o['id'])
 check(bool(o['source_ids']) and set(o['source_ids'])<=sources.keys(),'Unknown evidence '+o['id'])
 check({x['source_id'] for x in o['locators']}==set(o['source_ids']),'Missing locators '+o['id'])
 check(o['current_rank_claim'] is False,'Historical result converted to current ranking '+o['id'])
 if o['person_id'] in people:check(set(o['source_ids'])<=set(people[o['person_id']]['source_ids']),'Person/result evidence mismatch '+o['id'])
 if 'Paralympic' in o['event']:check(bool(o['classification']),'Missing para event class '+o['id'])
 if o['stage'].startswith('heat'):check('heat' in o['scope_note'].lower(),'Missing heat-rank qualification '+o['id'])
for r in d['disciplinary_context']:
 check(r['person_id'] in people and set(r['source_ids'])<=sources.keys(),'Invalid disciplinary source')
 check(r['current_status'] is None,'Current eligibility needs separate dated evidence')
check(d['human_review_claimed'] is False,'Human review requires named provenance')
print(json.dumps({'result':'FAIL' if errors else 'PASS','athletes':len(d['person_ids']),'sports':len(d['sports']),'observations':len(d['observations']),'errors':errors,'scope':'Identity, event scope, attribution and historical/current separation; not factual certification.'},indent=2))
sys.exit(bool(errors))
