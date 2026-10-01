"""Check homestay evidence stages, conflicts and policy arithmetic; not legal validation."""
import json,sys,math
from kb_io import ROOT
D=ROOT/'references/data'
a=json.loads((D/'statistics-atlas.json').read_text());h=json.loads((D/'homestay-research.json').read_text());s=json.loads((D/'source-catalog.json').read_text());rows={r['id']:r for r in a['observations']};errors=[]
def check(ok,msg):
 if not ok:errors.append(msg)
ids=h['observation_ids'];check(len(ids)==len(set(ids)),'Duplicate homestay observation')
check(set(ids)=={r['id'] for r in a['observations'] if r['topic']=='Homestays'},'Homestay register and atlas differ')
for i in ids:
 check(i in rows,'Missing observation: '+i)
 if i not in rows:continue
 r=rows[i];check(r['source_id'] in s,i+': unknown source');check(r.get('project_stage') in h['measure_stages'],i+': unknown stage');check(r.get('value_qualifier') in {'exact','approximately','more_than','maximum','minimum'},i+': missing numeric qualifier')
 check(bool(r.get('price_basis')),i+': missing price basis')
for conflict in h['unresolved']:
 if conflict['status']=='hold_conflict':
  for i in conflict['observation_ids']:check(rows[i]['publication_readiness']=='hold_conflict',i+': unresolved value not held')
for m in h['outcome_metrics']:
 if m['status']=='not_established':check(m['value'] is None,m['metric']+': unknown must be null')
 else:check(bool(m.get('observation_ids')) and all(i in rows for i in m['observation_ids']),m['metric']+': measured outcome needs observation references')
tranches=[rows['homestay-tranche-'+x] for x in ['cod','year1','year2','year3']]
check(all(r['unit']=='percent of sanctioned incentive' and r['project_stage']=='policy_rule' for r in tranches),'Tranche denominator or stage changed')
check(math.isclose(sum(r['value'] for r in tranches),100),'2025 policy tranches do not sum to 100%')
check(math.isclose(rows['homestay-room-subsidy']['value']*rows['homestay-room-cap']['value'],rows['homestay-unit-subsidy']['value']),'2025 per-room and total incentive caps inconsistent')
check(rows['homestay-nidhi-rural2025']['project_stage']=='registry_stock','NIDHI registry misclassified')
for c in a['calculations']:
 if set(c['inputs']) & set(ids):
  for i in c['inputs']:check(rows[i].get('project_stage') not in {'target','policy_rule','policy_ceiling','budget_earmark'},c['id']+': plan/ceiling used in outcome growth')
print(json.dumps({'result':'FAIL' if errors else 'PASS','homestay_observations':len(ids),'unknown_outcome_metrics':sum(m['status']=='not_established' for m in h['outcome_metrics']),'arithmetic_checks':2,'errors':errors,'scope':'Stage and qualifier fields, register references, conflict holds and policy arithmetic; not legal certification, source authentication or proof of demand.'},indent=2));sys.exit(bool(errors))
