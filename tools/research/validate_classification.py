"""Validate editorial subject coverage and explained page links, not factual causation."""
import json,re,sys
from pathlib import Path
from kb_io import ROOT,read_concept
errors=[]
def check(ok,msg):
    if not ok: errors.append(msg)
def load(name):return json.loads((ROOT/'references/data'/name).read_text())
d=load('content-classification.json');atlas=load('statistics-atlas.json')
subjects={s['id'] for s in d['subjects']}
check(len(subjects)==len(d['subjects']),'Duplicate subject ID')
for s in d['subjects']:
    check(bool(re.fullmatch('[a-z][a-z0-9-]*',s['id'])),'Invalid subject ID')
    check((ROOT/(s['hub']+'.md')).is_file(),'Missing subject hub: '+s['id'])
concepts={c['concept_id']:c for c in d['concepts']}
check(len(concepts)==len(d['concepts']),'Duplicate classified concept')
for cid,c in concepts.items():
    p=ROOT/(cid+'.md');check(p.is_file(),'Missing concept: '+cid)
    memberships=[c['primary_subject']]+c['secondary_subjects']
    check(set(memberships)<=subjects,cid+': unknown subject')
    check(len(memberships)==len(set(memberships)),cid+': duplicate subject')
    check(c['classification_basis']=='editorial_scope',cid+': unexpected classification basis')
    check(c['publication_status']=='not_determined_by_classification',cid+': classification changes publication status')
    if p.is_file():
        meta,_=read_concept(p)
        check(meta['type']==c['content_type'],cid+': content type mismatch')
        if 'subjects' in meta: check(meta['subjects']==memberships,cid+': page subjects disagree')
topics={o['topic'] for o in atlas['observations']}
check(topics==set(d['observation_topics']),'Atlas topics and classification mappings differ')
for topic,subject in d['observation_topics'].items():
    cid='statistics/'+re.sub(r'[^a-z0-9]+','-',topic.lower()).strip('-')
    check(cid in concepts,topic+': no classified page')
    check(subject in subjects,topic+': unknown subject')
    if cid in concepts:check(concepts[cid]['primary_subject']==subject,topic+': mapping disagrees with concept')
pairs=set()
for r in d['relationships']:
    pair=(r['from'],r['to']);check(pair not in pairs,'Duplicate relationship: '+str(pair));pairs.add(pair)
    check(pair[0]!=pair[1],'Self relationship: '+str(pair))
    check(all(x in concepts for x in pair),'Unclassified relationship endpoint: '+str(pair))
    check(r['type']=='related_reading' and r['basis']=='editorial_context','Unexpected relationship meaning: '+str(pair))
    check(bool(r['explanation'].strip()),'Missing relationship explanation: '+str(pair))
    p=ROOT/(r['from']+'.md')
    if p.is_file():
        _,body=read_concept(p)
        targets={(p.parent/link.split('#')[0]).resolve() for link in re.findall(r'\]\(([^)]+)\)',body) if not re.match(r'[a-z]+:',link)}
        check((ROOT/(r['to']+'.md')).resolve() in targets,'Page link missing: '+str(pair))
        check(r['explanation'] in body,'Page explanation missing: '+str(pair))
report={'result':'FAIL' if errors else 'PASS','subject_families':len(subjects),'classified_concepts':len(concepts),'atlas_topics':len(topics),'atlas_observations':len(atlas['observations']),'explained_relationships':len(pairs),'errors':errors,'scope':'Editorial subject IDs, topic coverage and agreement with related-reading links; not source verification, causation or publication approval.'}
print(json.dumps(report,ensure_ascii=False,indent=2));sys.exit(bool(errors))
