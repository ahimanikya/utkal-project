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
business_path=D/'entrepreneurs-businesses.json'
if business_path.exists():
 b=load('entrepreneurs-businesses');orgs={r['id']:r for r in b['organizations']}
 check(len(orgs)==len(b['organizations']),'Duplicate enterprise identity')
 check(b['human_review_claimed'] is False,'Enterprise human review needs named provenance')
 for cid,r in orgs.items():
  canonical(cid,r['source_ids'])
  meta,_=read_concept(ROOT/(cid+'.md')) if (ROOT/(cid+'.md')).exists() else ({},'')
  check(meta.get('type')=='Organization','Enterprise represented as a creative work '+cid)
  if r['metric_status']=='not_established':
   check(all(r.get(k) is None for k in ['odisha_revenue','odisha_jobs','odisha_realised_investment']),'Unknown impact converted to a number '+cid)
 seen_roles=set()
 for r in b['roles']:
  pair=(r['person_id'],r['organization_id'],r['role'])
  check(pair not in seen_roles,'Duplicate enterprise role '+str(pair));seen_roles.add(pair)
  check(r['person_id'] in people,'Unknown business person '+r['person_id'])
  check(r['organization_id'] in orgs,'Unknown enterprise '+r['organization_id'])
  check(bool(r['role']) and bool(r['period_or_scope']),'Missing role period/scope '+str(pair))
  ids=set(r['source_ids']);check(bool(ids) and ids<=sources.keys(),'Unsourced enterprise role '+str(pair))
  if r['person_id'] in people:check(ids<=set(people[r['person_id']]['source_ids']),'Person/role evidence disagreement '+str(pair))
  if r['organization_id'] in orgs:check(ids<=set(orgs[r['organization_id']]['source_ids']),'Company/role evidence disagreement '+str(pair))
 for r in b.get('additional_credits',[]):
  check(r['organization_id'] in orgs and bool(r['name']) and bool(r['role']) and bool(r['source_ids']) and set(r['source_ids'])<=sources.keys(),'Unresolved additional enterprise credit')
public_path=D/'public-service.json'
if public_path.exists():
 public=load('public-service')
 selected=set(public['person_ids'])
 check(len(selected)==len(public['person_ids']) and selected<=people.keys(),'Duplicate or unresolved public-service identity')
 check(public['human_review_claimed'] is False,'Public-service human review needs named provenance')
 role_classes={'constitutional_audit_office','appointed_administrative_office','elected_legislator','constitutional_head_of_state','constitution_making','union_executive_office'}
 for r in public['roles']+public['contributions']+public['source_issues']:
  cid=r['person_id'];ids=set(r['source_ids'])
  check(cid in selected,'Unselected public-service person '+cid)
  check(bool(ids) and ids<=sources.keys(),'Missing public-service evidence '+cid)
  if cid in people:check(ids<=set(people[cid]['source_ids']),'Public-service evidence absent from person '+cid)
 for r in public['roles']:
  check(r['role_class'] in role_classes and bool(r['period']) and bool(r['evidence_status']),'Missing public-office classification or dated scope')
 for r in public['source_issues']:
  check(r['status'] in {'quarantined','resolved_scope'} and bool(r['resolution']),'Unexplained public-service source issue')
rulers_path=D/'rulers-and-dynasties.json'
if rulers_path.exists():
 royal=load('rulers-and-dynasties');selected={r['person_id']:r for r in royal['rulers']}
 check(len(selected)==len(royal['rulers']) and selected.keys()<=people.keys(),'Duplicate or unresolved ruler identity')
 check(royal['human_review_claimed'] is False,'Ruler human review needs named provenance')
 for cid,r in selected.items():
  check(bool(r['period_scope']) and bool(r['dynasty_label']),'Missing ruler period/dynastic scope '+cid)
  check(all(r.get(k) is None for k in ['popularity_measure','territory_area_km2','economic_impact_value']),'Unestablished ruler metric converted to number '+cid)
 for r in royal['rulers']+royal['claims']+royal['source_issues']:
  cid=r['person_id'];ids=set(r['source_ids'])
  check(cid in selected and bool(ids) and ids<=sources.keys(),'Unresolved ruler evidence '+cid)
  if cid in people:check(ids<=set(people[cid]['source_ids']),'Ruler/person evidence disagreement '+cid)
 classes={'royal_claim_via_institutional_catalogue','institutional_heritage_attribution','historical_synthesis_indexed_capture','scholarly_epigraphic_edition'}
 for r in royal['claims']:check(r['evidence_class'] in classes and bool(r['limitation']),'Missing ruler evidence class or limitation')
check(p['human_review_claimed'] is False and e['human_review_claimed'] is False,'Human review needs explicit named provenance')
print(json.dumps({'result':'FAIL' if errors else 'PASS','people':len(people),'works':len(works),'garment_forms':len(e['garment_forms']),'market_observation_refs':len(e['market_observation_refs']),'errors':errors,'scope':'Referential integrity, explicit credits and missing-value semantics; not independent source verification or public approval.'},indent=2))
sys.exit(bool(errors))
