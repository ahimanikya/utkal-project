"""Serve a frozen local coastal candidate and its separate review desk."""
from pathlib import Path
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlsplit
import argparse, hashlib, json
SITE = Path(__file__).resolve().parents[1]
EVIDENCE = SITE.parents[1] / 'kb/records/evidence/launch-readiness-2026-09-30'
CANDIDATE = SITE / '.release-candidates/coast-2026-09-30-rc1'
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--port', type=int, default=4353)
parser.add_argument('--check', action='store_true', help='Verify the frozen candidate without starting a server')
parser.add_argument('--candidate', type=Path, default=CANDIDATE)
args = parser.parse_args()
CANDIDATE = args.candidate.resolve()
manifest = json.loads((EVIDENCE / 'candidate-manifest.json').read_text())
expected = {f['path']: f['sha256'] for f in manifest['files']}
actual = {p.relative_to(CANDIDATE).as_posix(): hashlib.sha256(p.read_bytes()).hexdigest()
          for p in CANDIDATE.rglob('*') if p.is_file()}
if actual != expected:
    raise SystemExit('Candidate differs from the reviewed manifest. Restore the exact snapshot or prepare a new review.')
if args.check:
    print(f"Verified {len(actual)} candidate files against the reviewed manifest.")
    raise SystemExit(0)
class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=str(CANDIDATE), **kw)
    def do_GET(self):
        path = urlsplit(self.path).path
        allowed = {'/__review/': 'index.html', '/__review/books/': 'books.html'}
        for name in ('downloaded-book.html', 'downloaded-photo-book.html', 'downloaded-shareable-book.html', 'downloaded-itinerary.txt'):
            allowed['/__review/' + name] = name
        if path not in allowed:
            return super().do_GET()
        file = EVIDENCE / allowed[path]
        data = file.read_bytes()
        self.send_response(200)
        self.send_header('Content-Type', ('text/plain' if file.suffix == '.txt' else 'text/html') + '; charset=utf-8')
        self.send_header('Content-Length', str(len(data)))
        self.end_headers()
        self.wfile.write(data)
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()
ThreadingHTTPServer(('127.0.0.1', args.port), Handler).serve_forever()
