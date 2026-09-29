import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync,readdirSync,statSync} from 'node:fs';
import {resolve,dirname,join} from 'node:path';
const root=resolve('dist');
const files=readdirSync(root,{recursive:true}).filter(f=>statSync(join(root,f)).isFile());
const pages=files.filter(f=>f.endsWith('.html'));
const read=f=>readFileSync(join(root,f),'utf8');
test('all built local links, assets and fragment targets resolve',()=>{
  const details=JSON.parse(readFileSync('../../kb/research/destinations/details.json','utf8'));
  assert.equal(pages.length,14+details.records.length);
  for(const file of pages){
    const html=read(file);
    for(const [,raw] of html.matchAll(/(?:href|src)="([^"]+)"/g)){
      if(!raw||raw.includes('${')||/^(https?:|mailto:|data:|\/\/)/.test(raw))continue;
      const url=new URL(raw.replaceAll('&amp;','&'),'https://preview.invalid/'+file);
      let path=decodeURIComponent(url.pathname).replace(/^\//,'');
      if(!path||path.endsWith('/'))path+='index.html';
      assert.ok(existsSync(join(root,path)),`${file}: missing ${path}`);
      if(url.hash&&path.endsWith('.html')){
        const id=decodeURIComponent(url.hash.slice(1));
        assert.ok(read(path).includes(`id="${id}"`),`${file}: missing fragment ${id}`);
      }
    }
  }
});
test('the preview exports only selected research and preserves citations and draft state',()=>{
  const notes=JSON.parse(readFileSync('src/data/selected.json','utf8'));
  assert.deepEqual(notes.map(x=>x.slug),['chilika','konark','kotpad','pakhala','boita-bandana']);
  for(const note of notes){
    const html=read('knowledge/'+note.slug+'/index.html');
    assert.match(html,/Editorial draft/);
    assert.ok(note.text.length>40);
    for(const source of note.sources){assert.match(source.resource,/^https:\/\//);assert.ok(html.includes(source.resource.replaceAll('&','&amp;'))||html.includes(source.resource));}
  }
  assert.ok(!files.some(f=>/^(kb|registers|history|research)\//.test(f)));
  assert.ok(!files.includes('utkal.config.json'));
});
test('preview stays unindexed and ships no remote scripts or live submission endpoint',()=>{
  for(const file of pages){
    const html=read(file);
    assert.match(html,/<meta name="robots" content="noindex, nofollow"/);
    assert.ok(!/<script[^>]+src="https?:/.test(html),file);
    assert.ok(!/googletagmanager|google-analytics|firebaseio/.test(html),file);
  }
  assert.ok(!/<form\b/.test(read('contribute/index.html')));
  assert.match(read('robots.txt'),/Disallow: \//);
});
test('brand assets, original fonts and their licences are included',()=>{
  for(const path of ['assets/book-boat-v1.png','assets/coast-illustration-v1.png','fonts/NotoSerifOriya-Bold.ttf','fonts/NotoSansOriya-Bold.ttf','fonts/OFL.txt','fonts/OFL-NotoSansOriya.txt'])assert.ok(existsSync(join(root,path)),path);
  const html=read('brand-review/index.html');
  assert.ok(html.includes('ମାଙ୍କଡ଼ା ପଥର')&&html.includes('ଉତ୍କଳ'));
  assert.ok(!html.includes('Kankada'));
});

test('main website excludes the unpublished Store collection and links',()=>{
  assert.ok(!files.some(f=>/^(utkal-store|store|artwork)\//.test(f)));
  for(const file of pages) assert.ok(!/Utkal Store|utkal-store|localhost:4323|127\.0\.0\.1:4323/i.test(read(file)),file);
});
