#!/usr/bin/env python3
"""Validate seasonal food references and evidence boundaries, not cultural accuracy."""
from pathlib import Path
import json
from kb_io import ROOT
K=ROOT;D=K/'references/data'
r=json.loads((D/'seasonal-food-calendar.json').read_text());cat=json.loads((D/'source-catalog.json').read_text());errors=[]
def check(ok,msg):
 if not ok:errors.append(msg)
check(len({e['id'] for e in r['entries']})==len(r['entries']),'Duplicate seasonal identity')
for e in r['entries']:
 check(e['evidence_status'] in {'documented_association','provisional_indexed_association'},'Unknown evidence class')
 check(e['source_ids'] and all(s in cat for s in e['source_ids']),'Missing source identity')
 check(bool(e['source_locator']) and bool(e['geography']),'Missing locator or geography scope')
 for p in e['food_paths']:check((K/(p+'.md')).is_file(),'Missing canonical food '+p)
 if e['gregorian_date'] is not None:check(e.get('calendar_source') and e['occurrence_year'],'Date requires year and evidence')
 if e['venue_ids'] or e['current_serving_availability'] is not None:check(e.get('serving_evidence'),'Serving claim lacks evidence')
 check(e['visitor_access'] is None and e['host_consent'] is None and e['local_review'] is None,'Unestablished access, consent or review')
for f in r['failed_fetches']:check(f['status']=='unavailable','Failure reclassified')
check(r['human_review_claimed'] is False and r['fieldwork_conducted'] is False,'Unestablished review/fieldwork')
print(json.dumps({'result':'FAIL' if errors else 'PASS','errors':errors,'selected_observances':len(r['entries']),'provisional_associations':sum(e['evidence_status']=='provisional_indexed_association' for e in r['entries']),'scope':'Reference and evidence-boundary consistency only.'},indent=2))
raise SystemExit(bool(errors))
