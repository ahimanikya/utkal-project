import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
test('metadata audits distinguish document titles from accessible SVG titles',()=>{
 const result=execFileSync('python3',['-c',`
import ast
from pathlib import Path
from html.parser import HTMLParser
for name in ['audit-coast.py','audit-discovery.py','audit-search-shortlist.py']:
 tree=ast.parse((Path('tools')/name).read_text())
 definition=next(n for n in tree.body if isinstance(n,ast.ClassDef) and n.name=='Page')
 scope={'HTMLParser':HTMLParser}
 exec(compile(ast.Module(body=[definition],type_ignores=[]),name,'exec'),scope)
 doc=scope['Page']()
 doc.feed('<html><head><title>Tarakasi</title></head><body><svg><title>Frame and infill</title></svg></body></html>')
 if name=='audit-coast.py':
  assert len(doc.document_titles)==1
  missing=scope['Page']();missing.feed('<html><head></head><body><svg><title>Diagram only</title></svg></body></html>')
  assert len(missing.document_titles)==0
  duplicate=scope['Page']();duplicate.feed('<head><title>One</title><title>Two</title></head>')
  assert len(duplicate.document_titles)==2
 else:
  assert doc.title=='Tarakasi',name
print('PASS')
`],{encoding:'utf8'});
 assert.match(result,/PASS/);
});
