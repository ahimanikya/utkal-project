"""Validate graph references, claim qualification and numeric derivations offline.

This scoped integrity check is not historical verification or a full RDF reasoner.
"""
import json,math,sys
from datetime import datetime,timezone
from kb_io import ROOT
from query_maritime import query

errors=[]
def check(ok,message):
    if not ok:errors.append(message)
g=json.loads((ROOT/'references/data/maritime-links.jsonld').read_text())
nodes={x['@id']:x for x in g['@graph']}
check(len(nodes)==len(g['@graph']),'Duplicate graph node IDs')
claims=[n for n in nodes.values() if n.get('@type')=='rdf:Statement']
allowed={'archaeological_finding','archaeometric_inference','historical_interpretation','cultural_commemoration','institutional_event','reported_statistic','derived_statistic','research_lead','disputed_interpretation','geographic_context'}
for c in claims:
    for field in ['rdf:subject','rdf:object']:
        check(c[field]['@id'] in nodes,c['@id']+' unresolved '+field)
    check(c.get('evidenceKind') in allowed,c['@id']+' unknown evidence class')
    check(bool(c.get('limitation')) and bool(c.get('period')),c['@id']+' missing scope or period')
    check((ROOT/c['conceptPath']).exists(),c['@id']+' missing supporting concept')
    check(bool(c.get('prov:wasDerivedFrom')),c['@id']+' missing source')
    for s in c.get('prov:wasDerivedFrom',[]):check(s['@id'] in nodes,c['@id']+' unresolved source')
    if c.get('observation'):check(c['observation']['@id'] in nodes,c['@id']+' unresolved observation')
m=json.loads((ROOT/'references/data/maritime-metrics.json').read_text())['observations']
by_id={x['id']:x for x in m};calcs=0
for x in m:
    if not x.get('calculation'):continue
    v=[by_id[i]['value'] for i in x['inputs']]
    expected={'percentage_change':lambda:(v[1]/v[0]-1)*100,'cagr':lambda:((v[1]/v[0])**(1/x['elapsed_years'])-1)*100,'sum':lambda:sum(v)}[x['calculation']]()
    check(math.isclose(expected,x['value'],abs_tol=1e-9),x['id']+' calculation mismatch');calcs+=1
check(round(by_id['M12']['value']/by_id['M10']['value']*100,2)==by_id['M13']['value'],'Coastal percentage mismatch');calcs+=1
for c in claims:
    if c.get('observation'):
        obs=nodes[c['observation']['@id']];rec=by_id[obs['metricId']]
        check(obs['schema:value']==rec['value'] and obs['schema:unitText']==rec['unit'],c['@id']+' graph/dataset mismatch')
for id in ['M05','M06','M07','M08']:check(by_id[id].get('conversion_to_country_value_allowed') is False,id+' destination conversion guard missing')
check(bool(query('China')),'China query empty');check(bool(query('Paradip')),'Paradip query empty')
check(all(x[0]['evidenceKind']=='archaeological_finding' for x in query(kind='archaeological_finding')),'Evidence filter wrong')
out={'checked_at':datetime.now(timezone.utc).isoformat(timespec='seconds'),'result':'PASS' if not errors else 'FAIL','graph_nodes':len(nodes),'qualified_relationships':len(claims),'numeric_observations':len(m),'arithmetic_checks':calcs,'local_queries_checked':['China','Paradip','archaeological_finding'],'errors':errors,'scope':'Internal references, explicit evidence classes, metric/graph equality and arithmetic; no certification of historical claims.'}
print(json.dumps(out,indent=2));sys.exit(bool(errors))
