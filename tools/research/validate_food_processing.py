"""Validate evidence-stage separation and reuse in the processing checkpoint."""
from kb_io import ROOT
import json,math
D=ROOT/'references/data';x=json.loads((D/'food-processing-series.json').read_text());a=json.loads((D/'statistics-atlas.json').read_text());obs={o['id']:o for o in a['observations']};cal={c['id']:c for c in a['calculations']};errors=[]
def check(ok,msg):
 if not ok:errors.append(msg)
check(not set(x['new_observation_ids'])&set(x['reused_observation_ids']),'New/reused observations overlap')
for key in x['new_observation_ids']+x['reused_observation_ids']:check(key in obs,'Missing observation '+key)
for s in x['series']:
 rows=[obs[i] for i in s['observation_ids']]
 check(all(all(o[f]==rows[0][f] for f in ['unit','metric','geography','source_id']) for o in rows),'Incompatible series '+s['id'])
 check(s['kind'] in ['procurement','turnover'],'Unverified processing output promoted')
 for o in rows:
  check(o.get('price_basis') and o.get('period_coverage'),'Missing scope metadata')
  if s['kind']=='procurement':check(o['publication_readiness']=='needs_source_table_review','Indexed extract promoted without facsimile review')
for cid in x['calculation_ids']:
 c=cal[cid];u,v=[obs[i] for i in c['inputs']];check(math.isclose(c['value'],(v['value']/u['value']-1)*100,abs_tol=1e-8),'Arithmetic mismatch '+cid)
for metric in ['area','production','yield']:
 rows=[obs[i] for i in x['reused_observation_ids'] if i.startswith('rice-series-'+metric+'-') or (metric=='yield' and i=='rice-yield2024')]
 check(len(rows)==12 and sorted(int(o['period'][:4]) for o in rows)==list(range(2012,2024)),'Rice historical years lost '+metric)
check(all(v is False for v in x['controls'].values()),'Evidence-stage separation lost')
check(all(v is None for v in x['unknowns'].values()),'Unknown output or margin invented')
check(x['documented_mechanism']['award_verified'] is False and x['documented_mechanism']['actual_quantity'] is None,'Tender promoted to completed output')
print(json.dumps(dict(result='FAIL' if errors else 'PASS',new_observations=len(x['new_observation_ids']),reused_observations=len(x['reused_observation_ids']),errors=errors,scope='Reuse, arithmetic and evidence-stage controls; not human review.'),indent=2));raise SystemExit(bool(errors))
