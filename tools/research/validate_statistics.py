"""Check statistical scope, references, conversions and comparison arithmetic."""
from collections import Counter, defaultdict
from datetime import date
import json
import math
import sys
from kb_io import ROOT

atlas = json.loads((ROOT / 'references/data/statistics-atlas.json').read_text())
sources = json.loads((ROOT / 'references/data/source-catalog.json').read_text())
errors = []
def check(condition, message):
    if not condition:
        errors.append(message)

observations = {item['id']: item for item in atlas['observations']}
check(len(observations) == len(atlas['observations']), 'Duplicate observation IDs')
readiness = {'hold_conflict', 'needs_source_table_review', 'source_checked_editorial_review_pending'}
required = ('topic', 'metric', 'unit', 'period', 'geography', 'source_id', 'locator',
            'evidence_status', 'definition', 'caveat', 'checked_on', 'publication_readiness')
for key, item in observations.items():
    for field in required:
        check(isinstance(item.get(field), str) and bool(item[field].strip()), f'{key}: missing {field}')
    check(item.get('source_id') in sources, f'{key}: unknown source')
    value = item.get('value')
    check(isinstance(value, (int, float)) and not isinstance(value, bool) and math.isfinite(value), f'{key}: invalid number')
    check(item.get('publication_readiness') in readiness, f'{key}: invalid readiness')
    check(item.get('human_reviewed') is False, f'{key}: human review requires named reviewer and revision provenance')
    try:
        date.fromisoformat(item['checked_on'])
    except (ValueError, KeyError):
        check(False, f'{key}: invalid source-check date')
    if 'source_value' in item:
        check(item.get('source_unit') == 'INR lakh' and item['unit'] == 'INR crore', f'{key}: unsupported conversion')
        check(math.isclose(value, item['source_value'] / 100, abs_tol=1e-8), f'{key}: lakh/crore conversion mismatch')

calculation_ids = [item['id'] for item in atlas['calculations']]
check(len(set(calculation_ids)) == len(calculation_ids), 'Duplicate calculation IDs')
for item in atlas['calculations']:
    key = item['id']
    valid = len(item['inputs']) == 2 and all(x in observations for x in item['inputs'])
    check(valid, f'{key}: invalid inputs')
    if not valid:
        continue
    a, b = [observations[x] for x in item['inputs']]
    for field in ('metric', 'unit', 'geography'):
        check(a[field] == b[field], f'{key}: incompatible {field}')
    check(a['period'] != b['period'], f'{key}: identical comparison periods')
    check(all(x['publication_readiness'] != 'hold_conflict' for x in (a, b)), f'{key}: unresolved conflict in calculation')
    if item['operation'] == 'change_pct' and a['value'] != 0:
        expected = (b['value'] / a['value'] - 1) * 100
        check(item['unit'] == 'percent', f'{key}: wrong change unit')
    elif item['operation'] == 'difference':
        expected = b['value'] - a['value']
        check(item['unit'] == ('percentage points' if a['unit'].startswith('percent') else a['unit']), f'{key}: wrong difference unit')
    else:
        check(False, f'{key}: unsupported operation or zero denominator')
        continue
    check(math.isclose(item['value'], expected, abs_tol=1e-8), f'{key}: arithmetic mismatch')

districts = defaultdict(list)
for item in observations.values():
    if item['id'].startswith('macro-district-'):
        districts[item['geography']].append(item)
check(len(districts) == 30, 'District banking coverage is incomplete')
for geography, records in districts.items():
    check(len(records) == 4, f'{geography}: expected four scoped banking observations')

for geography, records in districts.items():
    current = {x['metric']: x['value'] for x in records if x['period'] == '2026-06-30'}
    if {'Bank deposits', 'Bank advances utilised', 'Credit-deposit ratio'} <= current.keys():
        expected = current['Bank advances utilised'] / current['Bank deposits'] * 100
        check(abs(current['Credit-deposit ratio'] - expected) <= .015, f'{geography}: credit/deposit ratio mismatch')
for suffix, statewide_id, extra in (('-deposit', 'macro-deposit-2026', 0),
                                   ('-advance', 'macro-credit-2026', observations['macro-ridf2026']['value'])):
    total = sum(x['value'] for records in districts.values() for x in records if x['id'].endswith(suffix)) + extra
    if statewide_id in observations:
        check(abs(total - observations[statewide_id]['value']) <= .02, f'{statewide_id}: district aggregate mismatch beyond rounding')

report = {'result': 'FAIL' if errors else 'PASS', 'observations': len(observations),
          'topics': len({x['topic'] for x in observations.values()}), 'districts': len(districts),
          'calculations': len(calculation_ids),
          'readiness': dict(Counter(x['publication_readiness'] for x in observations.values())),
          'errors': errors, 'scope': 'Structure, references and arithmetic; not independent source verification or human editorial review.'}
print(json.dumps(report, indent=2))
sys.exit(bool(errors))
