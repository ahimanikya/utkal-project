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
specs=x.get('specification_comparisons',[])
ck({v['application_number'] for v in specs}=={584,655},'Original specification identities incomplete')
for v in specs:
 ck(v['evidence_class']=='advertised_applicant_specification','Source class lost')
 ck((ROOT/('sources/'+v['source_id']+'.md')).is_file(),'Missing specification source')
 ck(not v['recipe_ready'] and not v['place_link_independently_verified'] and not v['current_enforcement_verified'],'Unverified specification promoted')
holds={v['id']:v for v in x.get('specification_holds',[])}
ck(holds.get('GI-HOLD-SILAO-FAT',{}).get('status')=='conflicted','Ingredient conflict lost')
ck(holds.get('GI-HOLD-GOA-UTENSIL',{}).get('status')=='quarantined','Utensil wording hold lost')
ck(holds.get('GI-HOLD-GOA-ECONOMICS',{}).get('status')=='excluded_from_quantitative_comparison','Economic scope hold lost')
tx=x.get('textile_comparison',{})
ck(tx.get('application_number')==594,'Textile application identity lost')
ck({v['publication_date'] for v in tx.get('editions',[])}=={'2019-10-24','2022-08-12'},'Textile edition history lost')
ck(not tx.get('puri_specification_established',True) and not tx.get('current_enforcement_verified',True),'Comparator promoted to Puri specification or current enforcement')
for v in tx.get('editions',[]):ck((ROOT/('sources/'+v['source_id']+'.md')).is_file(),'Missing textile source')
lead=next(c for c in cs if c['id']=='GI-C004')['identity_leads'][0]
ck(not lead['confirmed_match_to_user_candidate'] and lead['technical_specification'] is None,'Reported local lead promoted')
ck(holds.get('GI-HOLD-GAMOSA-ANAKATA',{}).get('status')=='conflicted','Textile dimension conflict lost')
print(json.dumps({'result':'FAIL' if errors else 'PASS','candidate_leads':len(cs),'comparators':len(x['indian_comparator_ids']),'original_specifications':len(specs)+1,'textile_editions':len(tx['editions']),'specification_holds':len(holds),'ready_to_file':sum(c['ready_to_file'] for c in cs),'errors':errors,'scope':'Identity and stage safeguards, not eligibility, producer mandate or legal clearance.'},indent=2));sys.exit(bool(errors))
