"""Validate candidate identities and submission safeguards, not GI eligibility."""
import json,sys
from kb_io import ROOT
x=json.loads((ROOT/'references/data/gi-opportunities.json').read_text());errors=[]
def ck(v,m):
 if not v:errors.append(m)
cs=x['candidates'];ids=[c['id'] for c in cs];apps={int(a['Application Number']):a for a in x['application_checks']}
ck(len(ids)==len(set(ids)),'Duplicate candidate ID')
for c in cs:
 ck(all((ROOT/p).is_file() for p in c['reuse_paths']),'Missing reuse page '+c['id'])
 ck(not c['ready_to_file'] and not c['filed_by_utkal'],'Premature filing claim '+c['id'])
 ck(not c['producer_mandate_received'] and not c['eligible_applicant_confirmed'],'Invented applicant '+c['id'])
 ck(c['sales'] is None and c['export_value'] is None,'Unsupported economics '+c['id'])
ck(all(v is False for v in x['controls'].values()),'Evidence safeguard changed')
ck(all(apps[i]['Status']=='Registered' for i in x['indian_comparator_ids']),'Unregistered comparator promoted')
ck(apps[682]['Status']=='withdrawn' and apps[594]['Status']=='Registered','Gamocha application identities conflated')
ck(apps[2117]['Status']=='New Application','Manikapatna filing status drift')
ck(apps[805]['Status']==apps[797]['Status']=='Examination','Palm-leaf applications status drift')
ck(any(c['id']=='GI-C002' and c['research_stage']=='identity_unresolved' for c in cs),'User name ambiguity lost')
ck(bool(x['registry_screen']['absence_meaning']),'Bounded search limitation lost')
print(json.dumps({'result':'FAIL' if errors else 'PASS','candidate_leads':len(cs),'comparators':len(x['indian_comparator_ids']),'ready_to_file':sum(c['ready_to_file'] for c in cs),'errors':errors,'scope':'Identity and stage safeguards, not eligibility, producer mandate or legal clearance.'},indent=2));sys.exit(bool(errors))
