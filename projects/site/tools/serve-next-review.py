"""Loopback-only review server for the second large visitor-planning batch."""
from pathlib import Path
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
SITE=Path(__file__).resolve().parents[1]
HUB=SITE.parents[1]/'kb/records/evidence/next-210-2026-09-30/index.html'
class Handler(SimpleHTTPRequestHandler):
 def __init__(self,*args,**kwargs):super().__init__(*args,directory=str(SITE/'dist-coast'),**kwargs)
 def do_GET(self):
  if self.path.split('?')[0]=='/__review/':
   data=HUB.read_bytes();self.send_response(200);self.send_header('Content-Type','text/html; charset=utf-8');self.send_header('Content-Length',str(len(data)));self.end_headers();self.wfile.write(data)
  else:super().do_GET()
 def end_headers(self):self.send_header('Cache-Control','no-store');super().end_headers()
ThreadingHTTPServer(('127.0.0.1',4349),Handler).serve_forever()
