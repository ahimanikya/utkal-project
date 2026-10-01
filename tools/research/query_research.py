"""Search the cross-workspace research map before repeating research."""
import argparse,json
from kb_io import ROOT
p=argparse.ArgumentParser(description=__doc__)
p.add_argument('query',nargs='?',default='')
p.add_argument('--json',action='store_true',dest='as_json')
a=p.parse_args();d=json.loads((ROOT/'references/data/research-map.json').read_text())
terms=a.query.casefold().split()
def match(row):
    text=json.dumps(row,ensure_ascii=False).casefold()
    return all(t in text for t in terms)
result={'snapshot':d['project_revision'],'scope':d['scope'],'records':[r for r in d['records'] if match(r)],'tasks':[r for r in d['task_reuse'] if match(r)],'shared_publications':[r for r in d['shared_publications'] if match(r)]}
if a.as_json:print(json.dumps(result,ensure_ascii=False,indent=2))
else:
    for r in result['records']:print(r['id']+' | '+r['title']+' | '+r.get('project_path',''))
    for r in result['tasks']:print(r['task_id']+' | '+r['title']+' | reuse existing records before browsing')
    print('Dated inventory; verify scope and freshness before reuse.')
