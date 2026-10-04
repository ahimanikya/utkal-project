import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createStarterTrip} from '../src/lib/journey-starters.mjs';
import {emptyLibrary,addItem} from '../src/lib/journey.mjs';
const read=r=>readFileSync(`dist/${r}/index.html`,'utf8');
const data=JSON.parse(readFileSync('../../kb/research/destinations/regions.json','utf8'));
const starters=JSON.parse(readFileSync('../../kb/research/journey-starters.json','utf8')).starters;
test('coastal guide connections preserve the existing Puri and Konark choices',()=>{
 const city=read('destinations/puri'),konark=read('knowledge/konark'),craft=read('visit/places/raghurajpur');
 for(const href of ['/food/puri-coast/#maha-prasad','/visit/stays/puri-coast/','/journey-starters/#city-craft-coast'])assert.ok(city.includes(`href="${href}"`));
 for(const href of ['/food/puri-coast/#machha-besara','/food/puri-coast/#chingudi','/journey-starters/#city-craft-coast'])assert.ok(konark.includes(`href="${href}"`));
 assert.ok(craft.includes('href="/knowledge/kotpad/"'),'Preserve craft reading connection when removing the duplicate ending');
 for(const [r,id] of [['visit/stays/puri','base:konark-puri'],['visit/stays/konark','base:konark-local'],['visit/stays/puri-coast','stay:puri']])assert.ok(read(r).includes(`data-save-journey="${id}"`));
});
test('the shared meal pattern keeps every paragraph and save identity for both regional guides',()=>{
 for(const slug of ['bhubaneswar','puri-coast']){
  const g=JSON.parse(readFileSync(`../../kb/research/food/${slug}.json`,'utf8')),out=read('food/'+slug);
  for(const s of g.sections){assert.ok(out.includes(s.text));assert.ok(out.includes(s.question));if(s.save_id)assert.ok(out.includes(`data-save-journey="${s.save_id}"`));for(const id of s.source_ids)assert.ok(out.includes(g.sources[id].url));}
  assert.ok(out.includes(g.photo_context));assert.ok(read('explore').includes(`/food/${slug}/`));assert.ok(read('contribute').includes(`/food/${slug}/`));
 }
});
test('Raghurajpur image provenance and historical limits survive the published draft',()=>{
 const a=data.assets['raghurajpur-artisan'],page=read('visit/places/raghurajpur');
 assert.equal(createHash('sha256').update(readFileSync('public'+a.src)).digest('hex'),a.sha256);
 for(const value of [a.creator,a.license_url,a.source,'2018','name is not supplied','December 2005','2019'])assert.ok(page.includes(value));
 assert.ok(page.includes('mag-cover--contain'));assert.ok(page.includes(data.sources['raghurajpur-history'].url));
});
test('new coastal starter preserves earlier city plans and starts all eight ideas unscheduled',()=>{
 const s=starters.find(s=>s.id==='city-craft-coast');assert.equal(s.items.length,8);
 const ids=[...read('journey').matchAll(/data-save-journey="([^"]+)"/g)].map(m=>m[1]);
 const library=emptyLibrary();library.trips[0].plan=addItem(library.trips[0].plan,'stay:puri');library.trips[0].plan.items[0].notes='Keep the existing address';library.trips[0].plan.startDate='2026-12-12';
 const before=structuredClone(library),next=createStarterTrip(library,'coast',s,ids);assert.deepEqual(library,before);assert.deepEqual(next.trips[0],before.trips[0]);assert.equal(next.trips[1].plan.items.length,8);assert.ok(next.trips[1].plan.items.every(i=>i.day===0&&i.notes===''));
});
