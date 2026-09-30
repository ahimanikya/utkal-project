import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createStarterTrip} from '../src/lib/journey-starters.mjs';
import {emptyLibrary,addItem,persistLibrary} from '../src/lib/journey.mjs';
import {matchesDiscovery} from '../src/lib/discovery.mjs';
const starters=JSON.parse(readFileSync('../../kb/research/journey-starters.json','utf8')).starters;
const catalogIds=[...readFileSync('dist/journey/index.html','utf8').matchAll(/data-save-journey="([^"]+)"/g)].map(m=>m[1]);
test('all published starter selections resolve to actual saveable catalogue IDs',()=>{
 for(const starter of starters){const result=createStarterTrip(emptyLibrary(),starter.id,starter,catalogIds);assert.equal(result.trips[1].plan.items.length,starter.items.length);assert.ok(result.trips[1].plan.items.every(i=>i.day===0&&i.notes===''));}
});
test('starting a collection preserves existing dates, notes and independent objects',()=>{
 const library=emptyLibrary();library.trips[0].plan=addItem(library.trips[0].plan,'place:chilika');library.trips[0].plan.startDate='2026-12-01';library.trips[0].plan.items[0].notes='Keep this note';
 const before=structuredClone(library),result=createStarterTrip(library,'new',starters[0],catalogIds);
 assert.deepEqual(library,before);assert.deepEqual(result.trips[0],before.trips[0]);assert.equal(result.activeId,'new');assert.equal(result.trips[1].plan.startDate,undefined);
 result.trips[0].plan.items[0].notes='Changed later';assert.equal(library.trips[0].plan.items[0].notes,'Keep this note');
});
test('invalid starters and full libraries cannot silently alter saved collections',()=>{
 const library=emptyLibrary(),before=JSON.stringify(library);
 for(const invalid of [null,{title:'Empty',items:[]},{title:'Missing',items:['place:unknown']},{title:'Duplicate',items:['place:chilika','place:chilika']}])assert.throws(()=>createStarterTrip(library,'new',invalid,catalogIds));
 assert.equal(JSON.stringify(library),before);
 const full={version:2,activeId:'t0',trips:Array.from({length:10},(_,i)=>({id:'t'+i,plan:library.trips[0].plan}))};assert.throws(()=>createStarterTrip(full,'new',starters[0],catalogIds));assert.equal(full.trips.length,10);
});
test('failed persistence leaves the prior library intact and the complete candidate exportable',()=>{
 const original=emptyLibrary(),saved=JSON.stringify(original);let value=saved;
 const storage={getItem:()=>value,setItem:()=>{throw new Error('quota exceeded');}};
 const candidate=createStarterTrip(original,'new',starters[0],catalogIds);
 assert.equal(persistLibrary(storage,candidate),false);assert.equal(value,saved);assert.equal(original.trips.length,1);assert.equal(JSON.parse(JSON.stringify(candidate)).trips.length,2);
});
test('the three city aliases work with topic and area filters while preserving Odia marks',()=>{
 const aliases=JSON.parse(readFileSync('../../kb/research/discovery-aliases.json','utf8')).entries;
 for(const [slug,title] of [['bhubaneswar','Bhubaneswar'],['puri','Puri'],['cuttack','Cuttack']]){
  const names=aliases[`/destinations/${slug}/`],entry={label:title,aliases:names,category:'Places',regions:[title]};assert.ok(names?.length);
  assert.ok(matchesDiscovery(entry,{q:names[0],topic:'Places',region:title}));assert.ok(!matchesDiscovery(entry,{q:names[0],topic:'Food',region:title}));
 }
});
