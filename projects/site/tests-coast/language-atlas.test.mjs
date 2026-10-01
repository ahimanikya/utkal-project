import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
const read=path=>readFileSync('dist-coast'+path+'index.html','utf8');
const data=JSON.parse(readFileSync('../../kb/research/voices/population-2011.json'));
test('atlas is discoverable with a complete server-rendered table and accessible source definitions',()=>{
 const html=read('/languages/atlas/');assert.match(html,/Census 2011/);assert.match(html,/noindex, nofollow/);
 assert.equal((html.match(/scope="row"/g)||[]).length,30);assert.match(html,/3,47,12,170/);
 assert.match(html,/historical snapshot/);assert.match(html,/Census language groups/);assert.match(html,/Individual mother-tongue entries/);
 assert.match(html,/aria-live="polite"/);assert.match(html,/Not separately listed/);
 for(const source of Object.values(data.sources))assert.ok(html.includes(source.url));
 for(const path of ['/languages/','/explore/'])assert.ok(read(path).includes('href="/languages/atlas/"'));
 const embedded=JSON.parse(html.match(/id="language-atlas-data"[^>]*>([\s\S]*?)<\/script>/)[1]);assert.equal(Object.keys(embedded.areas).length,31);
 assert.equal(embedded.areas['000'].rows['015043'].values[0],31507158);
});
test('language stories link their exact Census entries and show historical rather than current counts',()=>{
 for(const [slug,p] of Object.entries(data.profiles)){
  const html=read('/languages/'+slug+'/');assert.ok(html.includes('/languages/atlas/?language='+p.code));assert.match(html,/id="population"/);
  assert.match(html,/not everyone who can speak the language today/);assert.match(html,/Census 2011/);
 }
 assert.match(read('/languages/kuvi/'),/Do not substitute the whole group/);
 assert.match(read('/languages/saora/'),/Census label is Savara/);
});
