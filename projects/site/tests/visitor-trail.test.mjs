import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {createStarterTrip} from '../src/lib/journey-starters.mjs';
import {emptyLibrary,addItem} from '../src/lib/journey.mjs';
const trail=JSON.parse(readFileSync('../../kb/research/destinations/stone-sea-trail.json','utf8'));
const starter=JSON.parse(readFileSync('../../kb/research/journey-starters.json','utf8')).starters.find(s=>s.id===trail.starter_id);
const page=readFileSync('dist/journey-starters/index.html','utf8');
const catalog=JSON.parse(page.match(/id="journey-data"[^>]*>(.*?)<\/script>/s)[1]).catalog;
const regions=JSON.parse(readFileSync('../../kb/research/destinations/regions.json','utf8'));
test('illustrated trail connects every saved idea to a real guide and back to the trail',()=>{
 assert.deepEqual(trail.chapters.flatMap(c=>c.ideas),starter.items);
 for(const id of starter.items){
  const item=catalog.find(i=>i.id===id);assert.ok(item,`Missing ${id}`);
  assert.ok(page.includes(`href="${item.href}"`),item.href);
  const [path,fragment]=item.href.split('#'),file=`dist${path}index.html`;
  assert.ok(existsSync(file),file);const guide=readFileSync(file,'utf8');
  if(fragment)assert.ok(guide.includes(`id="${fragment}"`),fragment);
  assert.ok(guide.includes('href="/journey-starters/#stone-sea-makers"'),path);
 }
 assert.equal((page.match(/id="stone-sea-makers"/g)||[]).length,1);
 assert.equal((page.match(/data-journey-starter="stone-sea-makers"/g)||[]).length,1);
 assert.ok(page.includes('id="starter-status-stone-sea-makers"'));
});
test('revised starter leaves an earlier five-stop journey, dates and notes intact',()=>{
 const original=emptyLibrary();const previous=['place:bhubaneswar','place:dhauli','place:puri','place:raghurajpur','place:puri-beach'];
 for(const id of previous)original.trips[0].plan=addItem(original.trips[0].plan,id);
 original.trips[0].plan.startDate='2026-12-02';original.trips[0].plan.items[1].day=2;original.trips[0].plan.items[1].notes='Keep Dhauli and my own arrangements';
 const snapshot=structuredClone(original),next=createStarterTrip(original,'revisited',starter,catalog.map(i=>i.id));
 assert.deepEqual(original,snapshot);assert.deepEqual(next.trips[0],snapshot.trips[0]);
 assert.deepEqual(next.trips[1].plan.items.map(i=>i.id),starter.items);
 assert.ok(next.trips[1].plan.items.every(i=>i.day===0&&i.notes===''));
});
test('documentary photographs retain dates, identity limits and licensed source credits',()=>{
 for(const key of ['mukteswar-torana','raghurajpur-artisan','puri-beach']){
  const image=regions.assets[key];for(const value of [image.src,image.creator,image.source,image.license_url,image.caption])assert.ok(page.includes(value),value);
 }
 for(const source of trail.sources)assert.ok(page.includes(source.url));
 assert.ok(page.includes('current arrangements remain to be confirmed'));
});
