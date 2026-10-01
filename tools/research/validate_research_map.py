"""Check research-map references and queue coverage, not semantic equivalence."""
import json,sys
from kb_io import ROOT
D=ROOT/'references/data';m=json.loads((D/'research-map.json').read_text());q=json.loads((D/'research-queue.json').read_text());errors=[]
def check(ok,msg):
    if not ok:errors.append(msg)
ids=[r['id'] for r in m['records']]
check(len(ids)==len(set(ids)),'Duplicate mapped record ID')
check(len(ids)==m['counts_at_audit_start']['records_mapped'],'Inventory count mismatch')
tasks={r['task_id']:r for r in m['task_reuse']}
check(len(tasks)==len(m['task_reuse']),'Duplicate task mapping')
check(set(tasks)=={t['id'] for t in q['tasks']},'Unmapped or obsolete task IDs')
for t in q['tasks']:
    if t['id'] not in tasks:continue
    r=tasks[t['id']];saved=t.get('reuse_before_research',{})
    for field in ['source_records','project_records']:check(saved.get(field)==r[field],'Queue/map mismatch '+t['id']+' '+field)
    check(r['remaining_scope']==t['done_when'],'Completion criteria drift '+t['id'])
    for path in r['source_records']:check((ROOT/path).is_file(),'Missing reuse record '+path)
for r in m['records']:
    if r.get('source_path'):check((ROOT/r['source_path']).is_file(),'Missing mapped source '+r['source_path'])
for r in m['reviewed_entity_overlaps']:check(r['research_id'] in ids,'Unmapped overlap '+r['research_id'])
catalog=json.loads((D/'source-catalog.json').read_text())
for r in m['shared_publications']:check(set(r['source_ids'])<=catalog.keys(),'Missing shared-publication source ID')
print(json.dumps({'result':'FAIL' if errors else 'PASS','records':len(ids),'tasks':len(tasks),'reviewed_overlaps':len(m['reviewed_entity_overlaps']),'errors':errors,'scope':'Inventory references and reuse coverage; not factual equivalence, source freshness or publication approval.'},indent=2))
sys.exit(bool(errors))
