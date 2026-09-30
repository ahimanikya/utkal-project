"""Loopback review; synthetic import controls are served only on a dedicated test route."""
from pathlib import Path
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
import argparse
SITE=Path(__file__).resolve().parents[1]
EVIDENCE=SITE.parents[1]/'kb/records/evidence/ready-216-2026-09-30'
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--port',type=int,default=4350)
args=parser.parse_args()
class Handler(SimpleHTTPRequestHandler):
 def __init__(self,*a,**k):super().__init__(*a,directory=str(SITE/'dist-coast'),**k)
 def do_GET(self):
  path=self.path.split('?')[0]
  if path=='/__review/':data=(EVIDENCE/'index.html').read_bytes()
  elif path=='/__import-test/':
   page=(SITE/'dist-coast/journey/index.html').read_text()
   data=page.replace('</body>',(EVIDENCE/'import-fixture.html').read_text()+'</body>').encode()
  else:return super().do_GET()
  self.send_response(200);self.send_header('Content-Type','text/html; charset=utf-8');self.send_header('Content-Length',str(len(data)));self.end_headers();self.wfile.write(data)
 def end_headers(self):self.send_header('Cache-Control','no-store');super().end_headers()
ThreadingHTTPServer(('127.0.0.1',args.port),Handler).serve_forever()
