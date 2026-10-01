"""Check collection references and prevent unsupported evidence-stage promotion.

Does not authenticate sources, establish operation, or approve publication.
"""
import json
import re
import sys
from pathlib import Path
from kb_io import ROOT, read_concept

data = ROOT / 'references/data'
register = json.loads((data / 'collections.json').read_text())
catalog = json.loads((data / 'source-catalog.json').read_text())
classification = json.loads((data / 'content-classification.json').read_text())
classified = {x['concept_id']: x for x in classification['concepts']}
datasets = {name: {o['id']: o for o in json.loads((data / name).read_text())['observations']}
            for name in ['statistics-atlas.json', 'growth-journeys.json', 'debrigarh-livelihoods.json']}
errors = []
def check(condition, message):
    if not condition:
        errors.append(message)

def resolve(ref, label):
    record = datasets.get(ref.get('dataset'), {}).get(ref.get('observation_id'))
    check(record is not None, label + ': unresolved observation')
    if record:
        check(record.get('source_id') in catalog, label + ': missing source')
        check(record.get('publication_readiness') != 'hold_conflict', label + ': quarantined evidence cannot headline a card')
    check('value' not in ref, label + ': duplicated observation value')
    return record

def body_for(cid):
    path = ROOT / (cid + '.md')
    check(path.is_file(), cid + ': missing page')
    return read_concept(path) if path.is_file() else ({}, '')

check(register.get('human_review_claimed') is False, 'Unexpected human-review claim')
collections = register['collections']
check(len({c['concept_id'] for c in collections}) == len(collections), 'Duplicate collection')
for c in collections:
    cid = c['concept_id']; meta, body = body_for(cid)
    check(cid in classified, cid + ': missing classification')
    check(meta.get('subjects') == c['subjects'], cid + ': subject mismatch')
    check(c['publication_status'] == 'draft_editorial_review_pending', cid + ': unsupported publication status')
    targets = {(ROOT / (cid + '.md')).parent.joinpath(link.split('#')[0]).resolve()
               for link in re.findall(r'\]\(([^)]+)\)', body) if not re.match(r'[a-z]+:', link)}
    for member in c['member_concepts']:
        check((ROOT / (member + '.md')).is_file(), cid + ': missing member ' + member)
        check((ROOT / (member + '.md')).resolve() in targets, cid + ': member is not linked ' + member)
    for ref in c['evidence_refs']:
        resolve(ref, cid)

# These categories describe evidence, not a mandatory sequence of project stages.
allowed = {
    'planned': lambda o: o.get('project_stage') == 'target',
    'approved': lambda o: o.get('evidence_status') == 'approval',
    'installed_capacity': lambda o: o.get('evidence_status') == 'installed_capacity',
    'reported_completion': lambda o: o.get('evidence_status') == 'reported_outcome' and o.get('track') == 'smart-cities',
    'reported_activity': lambda o: o.get('evidence_class') == 'attributed_secondary_reporting',
}
cards = register['progress_cards']
check(len({c['id'] for c in cards}) == len(cards), 'Duplicate progress card ID')
for c in cards:
    _, body = body_for(c['concept_id'])
    heading = '## ' + c['title'] + '\n'
    check(heading in body, c['id'] + ': heading missing')
    section = body.split(heading, 1)[-1].split('\n## ', 1)[0]
    check('Status: **' + c['stage'].replace('_', ' ') + '**.' in section, c['id'] + ': stage differs from page')
    check(c['stage'] in allowed, c['id'] + ': stage needs an explicit evidence rule')
    check(c['interpretation'] in section, c['id'] + ': interpretation missing')
    check(c['unestablished'] and all(x in section for x in c['unestablished']), c['id'] + ': unknown outcomes hidden')
    check(c['publication_status'] == 'draft_editorial_review_pending', c['id'] + ': unsupported publication status')
    for ref in c['evidence_refs']:
        o = resolve(ref, c['id'])
        if not o:
            continue
        check(c['stage'] in allowed and allowed[c['stage']](o), c['id'] + ': source does not support stage')
        qualifier = {'more_than': 'More than ', 'approximately': 'Approximately ',
                     'minimum': 'At least ', 'maximum': 'Up to '}.get(o.get('value_qualifier'), '')
        expected = f"**{qualifier}{o['value']:,} {o['unit']}** — {o['metric']}. {o['period']}; {o['geography']}.[^{o['source_id']}]"
        check(expected in section, c['id'] + ': value, qualifier, period, geography or source has drifted')

rows = datasets['statistics-atlas.json']
prefix = 'regional-bargarh-population-'
check(rows[prefix + 'total-2011']['value'] == rows[prefix + 'rural-2011']['value'] + rows[prefix + 'urban-2011']['value'],
      'Bargarh settlement counts do not reconcile')
report = {'result': 'FAIL' if errors else 'PASS', 'collections_and_profiles': len(collections),
          'progress_cards': len(cards), 'errors': errors,
          'scope': 'Collection links, observation references, stage compatibility, public-card data agreement and one settlement reconciliation; not independent source verification or publication approval.'}
print(json.dumps(report, indent=2)); sys.exit(bool(errors))
