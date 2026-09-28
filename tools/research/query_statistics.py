"""Search scoped statistical observations with standard-library Python."""
import argparse
import json
from kb_io import ROOT

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    for field in ('query', 'topic', 'geography', 'source', 'readiness'):
        parser.add_argument('--' + field, default='')
    parser.add_argument('--limit', type=int, default=10)
    parser.add_argument('--json', action='store_true')
    args = parser.parse_args()
    if args.limit < 1:
        parser.error('--limit must be positive')
    atlas = json.loads((ROOT / 'references/data/statistics-atlas.json').read_text())
    matches = []
    for item in atlas['observations']:
        filters = ((args.topic, item['topic']), (args.geography, item['geography']),
                   (args.source, item['source_id']), (args.readiness, item['publication_readiness']),
                   (args.query, json.dumps(item, ensure_ascii=False)))
        if all(term.casefold() in value.casefold() for term, value in filters):
            matches.append(item)
    selected = matches[:args.limit]
    if args.json:
        print(json.dumps({'matched': len(matches), 'shown': len(selected), 'observations': selected}, indent=2, ensure_ascii=False))
    else:
        print(f'{len(matches)} matches; showing {len(selected)}')
        for item in selected:
            print(f"\n{item['id']}: {item['metric']} — {item['value']:,} {item['unit']}")
            print(f"  {item['geography']} | {item['period']} | {item['publication_readiness']}")
            print(f"  Definition: {item['definition']}\n  Caveat: {item['caveat']}")
            print(f"  Source: {item['source_id']} | {item['locator']}")

if __name__ == '__main__':
    main()
