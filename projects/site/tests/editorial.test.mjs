import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const notes=JSON.parse(readFileSync('src/data/selected.json','utf8'));
const escape=text=>text.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');

test('each published note paragraph retains its KB citations and excludes proposals',()=>{
  for(const note of notes){
    const raw=readFileSync('../../kb/research/'+note.path,'utf8');
    const section=raw.match(/## Sourced knowledge\s+([\s\S]*?)(?=\n##|$)/)[1].trim();
    const originals=section.split(/\n\s*\n/);
    const html=readFileSync('dist/knowledge/'+note.slug+'/index.html','utf8');
    const rendered=[...html.matchAll(/<p class="knowledge-text">([\s\S]*?)<\/p>/g)].map(match=>match[1]);
    assert.equal(note.paragraphs.length,originals.length,note.slug);
    assert.equal(rendered.length,originals.length,note.slug);
    note.paragraphs.forEach((paragraph,index)=>{
      const citations=[...new Set([...originals[index].matchAll(/\[\^([^\]]+)\]/g)].map(match=>match[1]))];
      assert.deepEqual(paragraph.sources,citations,note.slug);
      assert.ok(rendered[index].includes(escape(paragraph.text)),note.slug);
      for(const id of citations){
        assert.ok(note.sources.some(source=>source.id===id),`${note.slug}: ${id}`);
        assert.ok(rendered[index].includes(`href="#source-${id}"`),`${note.slug}: ${id}`);
        assert.ok(html.includes(`id="source-${id}"`),`${note.slug}: ${id}`);
      }
    });
    assert.ok(!/Story opportunity|Editorial interpretation|Connect it to action/.test(html),note.slug);
    assert.ok(!html.includes('[^'),note.slug);
    for(const source of note.sources)assert.ok(html.includes(escape(source.inspection)),note.slug);
  }
});

test('source limitations and the unresolved birth date remain visible',()=>{
  const read=path=>readFileSync('dist/'+path+'/index.html','utf8');
  assert.match(read('knowledge/kotpad'),/Indexed Kotpad Handlooms section inspected/);
  assert.match(read('knowledge/chilika'),/direct PDF retrieval failed/);
  assert.ok(!read('knowledge/pakhala').includes('content/tourism/en/the-taste-of-odisha.html'));
  const profile=read('people/samanta-chandrasekhar');
  assert.match(profile,/1835–1904/);assert.match(profile,/11 January 1836/);
  assert.match(profile,/full paper was not reviewed/);
  assert.match(profile,/Draft awaiting Founder review/);
});
