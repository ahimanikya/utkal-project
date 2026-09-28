"""Local retrieval; no network calls or external dependencies."""
import argparse, re, unicodedata
from kb_io import concepts

def normal(s):
    return unicodedata.normalize('NFKD',s).casefold()

def search(query,section=None,limit=10):
    words=re.findall(r'\w+',normal(query))
    if not words: return []
    found=[]
    for c in concepts():
        if section and c['id'].split('/')[0]!=section: continue
        title=normal(c['title']+' '+' '.join(c.get('aliases',[])))
        tags=normal(' '.join(c.get('tags',[])))
        body=normal(c['body'])
        if not all(w in title+' '+tags+' '+body for w in words): continue
        score=sum(12*(w in title)+4*(w in tags)+min(body.count(w),4) for w in words)
        if c['id'].startswith('sources/'): score-=8
        found.append((score,c))
    return [c for _,c in sorted(found,key=lambda pair:(-pair[0],pair[1]['title']))[:limit]]

if __name__=='__main__':
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('query');p.add_argument('--section');p.add_argument('--limit',type=int,default=10)
    a=p.parse_args()
    results=search(a.query,a.section,a.limit)
    for c in results:
        print(c['title']+'\n  '+c['path']+'\n  '+c['description'])
        if c.get('evidence_status'): print('  Evidence: '+c['evidence_status'])
        if c.get('stale_after'): print('  Scheduled review: '+c['stale_after'][:10])
        print()
    if not results: print('No matching saved concepts. Try another spelling or a broader term.')
