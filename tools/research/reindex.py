"""Rebuild the convenience search export after Markdown edits."""
import json
from kb_io import ROOT,concepts

if __name__=='__main__':
    entries=list(concepts())
    (ROOT/'search-index.json').write_text(json.dumps(entries,ensure_ascii=False,indent=2),encoding='utf-8')
    print(f'Indexed {len(entries)} concepts.')
