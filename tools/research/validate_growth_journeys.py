"""Validate saved growth-journey calculations, sources and evidence-state boundaries."""
from datetime import datetime
import json,math,sys
from kb_io import ROOT
D=json.loads((ROOT/'references/data/growth-journeys.json').read_text())
S=json.loads((ROOT/'references/data/source-catalog.json').read_text())
errors=[]
def check(ok,msg):
 if not ok:errors.append(msg)
O={x['id']:x for x in D['observations']}
check(len(O)==len(D['observations']),'Duplicate observation ID')
for x in O.values():
 check(x['source_id'] in S,x['id']+' missing source')
 check(bool(x['unit']) and bool(x['period']) and bool(x['geography']),x['id']+' missing scope')
 check((ROOT/'journeys'/(x['track']+'.md')).exists(),x['id']+' missing journey')
for track,events in D['timelines'].items():
 for e in events:
  check(e['source_id'] in S,'Timeline source missing')
  check(e['status'] in {'selection','reported_outcome','commissioned','proposal','approval','groundbreaking','forecast'},'Invalid timeline evidence status')
  if e['date']>'2026-09-27' and not e['date'].startswith('FY'):
   check(e['status']=='forecast','Future milestone presented as completed')
for c in D['calculations']:
 check(all(i in O for i in c['inputs']),c['id']+' missing inputs')
 if not all(i in O for i in c['inputs']):continue
 a,b=[O[i] for i in c['inputs']]
 check(a['unit']==b['unit'],c['id']+' incompatible units')
 if c['operation']=='ratio_pct':check(a['period']==b['period'],c['id']+' mismatched snapshot')
 else:check(a['period_type']==b['period_type']=='calendar_year',c['id']+' mismatched full-year comparison')
 x,y=a['value'],b['value'];expected={'ratio_pct':lambda:x/y*100,'difference':lambda:x-y,'ratio':lambda:x/y,'change_pct':lambda:(x/y-1)*100}[c['operation']]()
 check(math.isclose(c['value'],expected,abs_tol=1e-8),c['id']+' arithmetic mismatch')
check(O['SC04']['value']+O['SC06']['value']==107,'City project totals mismatch')
check(O['SC05']['value']+O['SC07']['value']==104,'City completion totals mismatch')
check(O['RE01']['evidence_status']=='installed_capacity','Rare-earth capacity misclassified')
check(all(x['evidence_status']!='reported_inflow' for x in O.values() if x['track']=='semiconductors'),'Semiconductor proposal treated as FDI')
check(O['FD04']['period_type']=='partial_calendar_year','2026 partial period lost')
component=sum(O[k]['value'] for k in ['FD01','FD02','FD03','FD04','FD05'])
check(math.isclose(O['FD06']['value']-component,.01,abs_tol=1e-8),'Reported FDI rounding discrepancy changed')
report={'checked_at':datetime.now().astimezone().isoformat(timespec='seconds'),'result':'PASS' if not errors else 'FAIL','observations':len(O),'derived_calculations':len(D['calculations']),'timeline_events':sum(len(x) for x in D['timelines'].values()),'errors':errors,'scope':'Sources, units, period comparability, arithmetic and evidence-state safeguards; no independent verification of reported outcomes.'}
print(json.dumps(report,indent=2));sys.exit(bool(errors))
