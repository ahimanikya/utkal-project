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
# Recompute portal counts from preserved publisher IDs, never from place-name guesses.
for capture in h.get('portal_snapshots', []):
 path=D/capture['path'];check(path.is_file(),'Missing portal snapshot')
 if not path.is_file():continue
 snapshot=json.loads(path.read_text());flat=[]
 for obj in snapshot['raw_response']['data']:
  district=obj['district']
  for obj2 in district['clusters']:
   cluster=obj2['cluster']
   for obj3 in cluster['destinations']:
    destination=obj3['destination']
    for obj4 in destination['blocks']:
     block=obj4['block']
     for obj5 in block['gps']:
      gp=obj5['gp'];flat.append({'district_id':district['districtId'],'district_name':district['districtName'],'cluster_id':cluster['clusterId'],'cluster_name':cluster['clusterName'],'destination_id':destination['destinationId'],'destination_name':destination['destinationName'],'block_id':block['blockId'],'block_name':block['blockName'],'gp_id':gp['gpId'],'gp_name':gp['gpName']})
 check(flat==snapshot['rows'],'Normalized portal rows differ from original hierarchy')
 counts={key:len({r[key+'_id'] for r in flat}) for key in ['district','cluster','destination','block','gp']}
 check(counts==snapshot['counts'],'Portal distinct-ID counts mismatch')
 check(snapshot['source_id'] in s,'Unknown portal source')
 for key,oid in zip(['district','cluster','destination','block','gp'],capture['observation_ids']):
  check(oid in rows,'Missing portal atlas observation '+oid)
  if oid not in rows:continue
  row=rows[oid];check(row['value']==counts[key],oid+': count mismatch')
  check(row['project_stage']=='portal_configuration_snapshot',oid+': portal count misclassified as outcome')
  check(row['source_id']==snapshot['source_id'],oid+': source mismatch')
 for calculation in a['calculations']:
  check(not set(calculation['inputs']) & set(capture['observation_ids']),calculation['id']+': portal coverage must not enter growth calculation')
print(json.dumps({'result':'FAIL' if errors else 'PASS','homestay_observations':len(ids),'unknown_outcome_metrics':sum(m['status']=='not_established' for m in h['outcome_metrics']),'arithmetic_checks':2,'errors':errors,'scope':'Stage and qualifier fields, register references, conflict holds and policy arithmetic; not legal certification, source authentication or proof of demand.'},indent=2));sys.exit(bool(errors))
