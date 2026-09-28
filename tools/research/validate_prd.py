"""Check PRD history integrity and traceability; not approval or feature testing."""
from pathlib import Path
import hashlib,json,re,sys
from kb_io import ROOT,read_concept
errors=[]
def check(ok,message):
 if not ok: errors.append(message)
def data(rel): return json.loads((ROOT/rel).read_text())
def ids(doc): return re.findall(r'^#### ([A-Z]+-\d{3}) — ',doc,re.M)
reg=data('references/data/prd-version-register.json')
versions=reg['versions']
check(len({v['version'] for v in versions})==len(versions),'Duplicate PRD version')
check(sum(v['version']==reg['current_version'] for v in versions)==1,'Current version missing/duplicated')
meta,body=read_concept(ROOT/reg['current_document'])
current=data(reg['current_requirements'])
check(meta['document_version']==current['prd_version']==reg['current_version'],'Current version mismatch')
known_adrs=set(re.findall(r'ADR-\d{3}',(ROOT/'technology/decisions.md').read_text()))
seen_ids=set()
for v in versions:
 for field,hashfield in [('snapshot','snapshot_sha256'),('requirements_snapshot','requirements_sha256')]:
  p=ROOT/v[field]
  check(p.is_file(),'Missing snapshot: '+v[field])
  if p.is_file():check(hashlib.sha256(p.read_bytes()).hexdigest()==v[hashfield],'Snapshot changed: '+v[field])
 sm,sb=read_concept(ROOT/v['snapshot']); sr=data(v['requirements_snapshot'])
 check(sm['document_version']==sr['prd_version']==v['version'],'Snapshot version mismatch: '+v['version'])
 rs=sr['requirements'];rid=[r['id'] for r in rs]
 check(len(rid)==len(set(rid)),'Duplicate requirement ID: '+v['version'])
 check(set(ids(sb))==set(rid),'Snapshot narrative/register IDs differ: '+v['version'])
 for r in rs:
  check(bool(re.fullmatch(r'[A-Z]+-\d{3}',r['id'])),'Invalid requirement ID')
  check(r['phase'] in sr['phase_definitions'],r['id']+': invalid phase')
  check(r['basis'] in sr['basis_definitions'],r['id']+': invalid basis')
  check(bool(r['requirement']) and bool(r['acceptance_criteria']) and all(isinstance(x,str) and x.strip() for x in r['acceptance_criteria']),r['id']+': missing requirement/acceptance')
  check(set(r['adr'])<=known_adrs,r['id']+': unknown ADR')
 check(set(v['added_requirement_ids'])<=set(rid),'Registry addition missing in snapshot')
 check(not (set(v['added_requirement_ids']) & seen_ids),'Previously used requirement ID marked newly added')
 check(set(v['changed_requirement_ids'])<=set(rid),'Changed ID missing in snapshot')
 seen_ids.update(rid)
 if v['version']==reg['current_version']:
  check(current==sr,'Current requirements differ from version snapshot; create a new version for changes')
check(set(ids(body))=={r['id'] for r in current['requirements']},'Current narrative/register IDs differ')
report={'result':'FAIL' if errors else 'PASS','prd_version':reg['current_version'],'preserved_versions':len(versions),'requirements':len(current['requirements']),'phase_counts':{p:sum(r['phase']==p for r in current['requirements']) for p in current['phase_definitions']},'errors':errors,'scope':'Requirement IDs, phase/basis/ADR references, version pointers and snapshot checksums; not feature acceptance, formal approval or factual certification.'}
print(json.dumps(report,ensure_ascii=False,indent=2));sys.exit(bool(errors))
