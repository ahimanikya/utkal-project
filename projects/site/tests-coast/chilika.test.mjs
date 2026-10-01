import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {buildTourBook,buildTextItinerary,escapeHTML} from '../src/lib/tour-book.mjs';
import {parseBackup} from '../src/lib/journey.mjs';
import {createStarterTrip} from '../src/lib/journey-starters.mjs';
const read=route=>readFileSync('dist-coast'+route+'index.html','utf8');
const html=read('/knowledge/chilika/');
const visible=html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'');
const data=JSON.parse(html.match(/<script[^>]*id="journey-data"[^>]*>([\s\S]*?)<\/script>/)[1]);
const details=JSON.parse(readFileSync('../../kb/research/destinations/details.json','utf8')).records.filter(r=>r.parent==='chilika');
test('Chilika connects all nine guides with its own stay areas',()=>{
 assert.equal(details.length,9);
 for(const r of details){
  const path=`/visit/${r.kind}/${r.slug}/`;
  assert.ok(visible.includes(`href="${path}"`),path);
  const child=read(path).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'');
  assert.ok(child.includes('href="/knowledge/chilika/"'));
  assert.ok(child.includes('id="story-image"'));
  for(const relation of r.related)assert.ok(child.includes(`href="/visit/${relation}/"`));
 }
 assert.ok(!visible.includes('href="/visit/stays/puri-coast/"'));
 assert.match(visible,/local legend/);assert.match(visible,/2023–24|2023-24/);
 assert.ok(visible.includes('Photo sequence, not 360° footage'));
 assert.ok(visible.includes('2026-10-01'));
});
test('saved Chilika details retain practical context and sources in both book formats',()=>{
 for(const r of details){
  const path=`/visit/${r.kind}/${r.slug}/`,item=data.catalog.find(i=>i.href===path);
  assert.ok(item,path);
  const plan={version:1,title:'Chilika review',items:[{id:item.id,day:1,notes:'Keep my own question.'}]};
  const book=buildTourBook(plan,data.catalog),text=buildTextItinerary(plan,data.catalog);
  for(const section of r.sections){assert.ok(book.includes(escapeHTML(section.text)),path);assert.ok(text.includes(section.text),path);}
  for(const source of item.sources){assert.ok(book.includes(escapeHTML(source.url)));assert.ok(text.includes(source.url));}
  if(r.slug==='kalijai')assert.ok(item.sources.some(s=>s.url.includes('79-81.pdf')),'local-belief provenance survives export');
  assert.ok(book.includes('Keep my own question.'));
 }
});
test('each Chilika starter focuses on one gateway and preserves an earlier trip',()=>{
 const original={version:2,activeId:'old',trips:[{id:'old',plan:{version:1,title:'Already planned',items:[{id:'place:konark',day:1,notes:'Do not replace this.'}]}}]};
 const before=structuredClone(original),starters=data.starters.filter(s=>s.id.startsWith('chilika-'));
 assert.equal(starters.length,3);
 for(const starter of starters){
  const next=createStarterTrip(original,'new',starter,data.catalog.map(i=>i.id));
  assert.deepEqual(original,before);assert.deepEqual(next.trips[0],before.trips[0]);
  assert.equal(next.trips[1].plan.items.length,starter.items.length);
  assert.ok(next.trips[1].plan.items.every(i=>i.day===0));
  assert.equal(starter.items.filter(id=>id.startsWith('base:')).length,1);
 }
});
test('an earlier Chilika idea becomes available without losing its day or notes',()=>{
 const original={version:2,activeId:'old',trips:[{id:'old',plan:{version:1,title:'Earlier plan',startDate:'2026-12-12',items:[{id:'place:chilika',day:2,notes:'Ask about boarding.'}]}}]};
 const restored=parseBackup(JSON.stringify(original));assert.deepEqual(restored,original);
 const book=buildTourBook(restored.trips[0].plan,data.catalog);
 assert.ok(book.includes('/knowledge/chilika/'));assert.ok(!book.includes('Unavailable item: place:chilika'));
 assert.ok(book.includes('13 Dec 2026'));assert.ok(book.includes('Ask about boarding.'));
});
