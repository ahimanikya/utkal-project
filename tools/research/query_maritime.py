"""Find source-qualified relationships in the saved maritime JSON-LD graph."""
import argparse,json
from kb_io import ROOT

def query(term='',kind=None):
    data=json.loads((ROOT/'references/data/maritime-links.jsonld').read_text())
    nodes={n['@id']:n for n in data['@graph']}
    result=[]
    for edge in data['@graph']:
        if edge.get('@type')!='rdf:Statement':continue
        if kind and edge['evidenceKind']!=kind:continue
        left=nodes[edge['rdf:subject']['@id']]['schema:name']
        right=nodes[edge['rdf:object']['@id']]['schema:name']
        if term.casefold() not in (left+' '+right).casefold():continue
        result.append((edge,left,right,nodes))
    return result

if __name__=='__main__':
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('term',nargs='?',default='');p.add_argument('--kind')
    a=p.parse_args()
    matches=query(a.term,a.kind)
    for e,left,right,nodes in matches:
        predicate=e['rdf:predicate']['@id'].split(':')[-1]
        print(f'{left} -> {predicate} -> {right}')
        print(f"  Evidence: {e['evidenceKind']} | Period: {e['period']}")
        if e.get('observation'):
            n=nodes[e['observation']['@id']]
            print(f"  Observation: {n['schema:value']} {n['schema:unitText']}")
        print('  Scope: '+e['limitation'])
        print('  KB: '+e['conceptPath'])
        for src in e['prov:wasDerivedFrom']:print('  Source: '+src['@id'])
        print()
    if not matches:print('No saved relationship matches. Missing research is not a zero-value observation.')
