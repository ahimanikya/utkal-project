#!/usr/bin/env python3
"""Check a Utkal KB alone: live links, metadata, record scope and human authority.
Created for Ahimanikya Satapathy with AI assistance. Standard library only.
"""
import argparse,json,re
from pathlib import Path
from urllib.parse import unquote,urlsplit
ARCHIVES=('references/pre-repair/','history/evidence/initial-capture/','records/evidence/research-import/')
def check(kb):
    kb=kb.resolve(); errors=[]; links=concepts=0
    config=json.loads((kb/'project.json').read_text())
    def need(ok,message):
        if not ok:errors.append(message)
    need(config['artifact_kind'] in {'template','instance'},'Unknown artifact kind')
    need(config['creator']['kind']=='human','Creator authority must be human')
    need((kb/'index.md').read_text().startswith('---\nokf_version: "0.2"\n---'),'Bundle root version missing')
    for p in kb.rglob('*.md'):
        rel=p.relative_to(kb).as_posix()
        if rel.startswith(ARCHIVES):continue
        raw=p.read_text()
        if p.name=='index.md':
            need(p==kb/'index.md' or not raw.startswith('---\n'),f'{rel}: group index has frontmatter')
        elif p.name=='log.md':
            need(not raw.startswith('---\n'),f'{rel}: log has frontmatter')
        else:
            concepts+=1
            header=raw.split('\n---',1)[0]
            need(raw.startswith('---\n') and bool(re.search(r'^type:\s*\S',header,re.M)),f'{rel}: missing concept type')
        for value in re.findall(r'\[[^\]]*\]\(([^)]+)\)',raw):
            value=value.strip('<>');parts=urlsplit(value)
            if parts.scheme or value.startswith('#'):continue
            target=(p.parent/unquote(parts.path)).resolve();links+=1
            need(target.is_relative_to(kb),f'{rel}: internal link escapes bundle: {value}')
            need(target.exists(),f'{rel}: missing link: {value}')
    if config['artifact_kind']=='template':
        people=json.loads((kb/'team/people.json').read_text())
        need(people['human_owner']['kind']=='human','Template owner must be human')
        need(people['human_owner']['full_name']==config['creator']['name'],'Template owner differs from creator')
        need(people['assignments']==[],'Template must not have additional actual assignments')
        definitions=json.loads((kb/'roles/definitions.json').read_text())['definitions']
        for item in definitions:
            need(item['definition_type']=='template' and item['active_assignment'] is False,'Persona definition activated in template')
        seeds=json.loads((kb/'registers/records.json').read_text())
        for name in ['projects','work','decisions','requirements','reviews','releases','sources','relationships']:
            need(seeds[name]==[],f'Instance seed {name} contains real history')
        need((kb/'registers/activity.jsonl').read_text()=='','Instance seed ledger is populated')
        need(config['record_directory']=='maintenance','Template maintenance must be separate from seeds')
    else:
        team=json.loads((kb/'team/assignments.json').read_text())
        human=team['human_owner'];need(human['kind']=='human','Instance human authority missing')
        for a in team['assignments']:
            need(a['kind'] in {'human','persona'},'Unknown assignment type')
            if a['kind']=='persona':
                need(a.get('human_supervisor')==human['full_name'] and not a.get('human_reports'),'Invalid AI supervision or human reporting')
    return {'result':'PASS' if not errors else 'FAIL','concepts':concepts,'local_links':links,'errors':errors,'scope':'Structure and declared authority, not proof of human consent or factual correctness.'}
if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--kb',type=Path,default=Path(__file__).resolve().parents[1]/'kb');args=parser.parse_args()
    try:result=check(args.kb)
    except (OSError,ValueError,KeyError,TypeError) as e:result={'result':'FAIL','errors':[str(e)]}
    print(json.dumps(result,ensure_ascii=False,indent=2));raise SystemExit(result['result']!='PASS')
