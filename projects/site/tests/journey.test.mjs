import test from 'node:test';
import assert from 'node:assert/strict';
import {emptyJourney,parseJourney,validateJourney,loadJourney,persistJourney,addItem,moveItem,groupItems,STORAGE_KEY} from '../src/lib/journey.mjs';
const storage=()=>{const values=new Map();return {getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v)}};
test('saved choices and notes survive round-trip; duplicate saves do not discard edits',()=>{
 const s=storage();let p=addItem(emptyJourney(),'place:chilika');p.title='A slow coastal visit';p.items[0].notes='Ask about boats.\nBring a notebook.';p.items[0].day=2;
 assert.equal(addItem(p,'place:chilika'),p);assert.equal(persistJourney(s,p),true);assert.deepEqual(loadJourney(s).plan,p);assert.deepEqual(parseJourney(JSON.stringify(p)),p);
});
test('reordering stays within a day; unscheduled ideas follow day groups',()=>{
 let p=emptyJourney();for(const id of ['place:a','place:b','place:c','place:d'])p=addItem(p,id);p.items[0].day=2;p.items[1].day=1;p.items[2].day=2;
 const moved=moveItem(p,'place:c',-1);assert.deepEqual(groupItems(moved).map(g=>[g.day,g.items.map(i=>i.id)]),[[1,['place:b']],[2,['place:c','place:a']],[0,['place:d']]]);assert.equal(p.items[0].id,'place:a');
});
test('imports reject invalid versions, oversize, duplicate and malformed items; unknown IDs are kept',()=>{
 for(const value of [{...emptyJourney(),version:2},{...emptyJourney(),items:[{id:'javascript:alert(1)',day:0,notes:''}]},{...emptyJourney(),items:[{id:'place:x',day:31,notes:''}]},{...emptyJourney(),items:[{id:'place:x',day:0,notes:'a'.repeat(3001)}]},{...emptyJourney(),items:[{id:'place:x',day:0,notes:''},{id:'place:x',day:0,notes:''}]}])assert.throws(()=>validateJourney(value));
 assert.throws(()=>parseJourney(' '.repeat(1000001)));assert.throws(()=>parseJourney('{'));
 const p=addItem(emptyJourney(),'place:retired');p.items[0].notes='<img src=x onerror=alert(1)>';const q=parseJourney(JSON.stringify({...p,url:'javascript:bad'}));assert.equal(q.items[0].notes,p.items[0].notes);assert.equal(q.url,undefined);
});
test('corrupt or inaccessible saved data is never silently replaced; quota failures reported',()=>{
 const s=storage();s.setItem(STORAGE_KEY,'broken');assert.equal(loadJourney(s).status,'blocked');assert.equal(s.getItem(STORAGE_KEY),'broken');
 const denied={getItem(){throw Error('blocked')},setItem(){throw Error('quota')}};assert.equal(loadJourney(denied).status,'blocked');assert.equal(persistJourney(denied,emptyJourney()),false);
});
test('maximum collection size protects storage and export',()=>{let p=emptyJourney();for(let i=0;i<100;i++)p=addItem(p,'place:x'+i);assert.throws(()=>addItem(p,'place:overflow'));});

import {readFileSync} from 'node:fs';
test('save entrypoints and print recovery controls ship in the static site',()=>{
 const page=readFileSync('dist/journey/index.html','utf8');
 for(const id of ['journey-items','journey-print','export-journey','import-journey','journey-recovery'])assert.ok(page.includes(`id="${id}"`));
 const ids=[...page.matchAll(/data-save-journey="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length);assert.ok(ids.includes('food:pakhala')&&ids.includes('place:chilika'));
 for(const route of ['knowledge/chilika','knowledge/konark','knowledge/pakhala','visit/places/mangalajodi','visit/experiences/kalijai-crossing','visit/stays/konark','languages/santali'])assert.ok(readFileSync(`dist/${route}/index.html`,'utf8').includes('data-save-journey='));
});
test('the maximum valid Unicode notes still round-trip within the backup limit',()=>{let p=emptyJourney();for(let i=0;i<100;i++)p=addItem(p,'place:x'+i);p.items.forEach(i=>i.notes='ଅ'.repeat(3000));assert.deepEqual(parseJourney(JSON.stringify(p)),p);});

import {LIBRARY_KEY,loadLibrary,persistLibrary,emptyLibrary,validateLibrary,parseBackup,addTrip,removeTrip,dayLabel,validDate} from '../src/lib/journey.mjs';
test('legacy migration preserves all notes, order and original storage without writing during load',()=>{
 const s=storage();const legacy=addItem(emptyJourney(),'place:chilika');legacy.items[0].notes='Keep this note';legacy.items[0].day=3;s.setItem(STORAGE_KEY,JSON.stringify(legacy));
 const loaded=loadLibrary(s);assert.equal(loaded.migrated,true);assert.deepEqual(loaded.library.trips[0].plan,legacy);assert.equal(s.getItem(LIBRARY_KEY),null);
 assert.equal(persistLibrary(s,loaded.library),true);assert.equal(s.getItem(STORAGE_KEY),JSON.stringify(legacy));assert.deepEqual(loadLibrary(s).library,loaded.library);
});
test('trips stay independent across add, change, delete, reload and backup round-trip',()=>{
 let lib=emptyLibrary();lib.trips[0].plan=addItem(lib.trips[0].plan,'place:chilika');lib=addTrip(lib,'second',{version:1,title:'Konark weekend',startDate:'2027-01-01',items:[]});
 lib.trips[1].plan=addItem(lib.trips[1].plan,'place:konark');assert.equal(lib.trips[0].plan.items[0].id,'place:chilika');assert.equal(lib.activeId,'second');assert.deepEqual(parseBackup(JSON.stringify(lib)),lib);
 const s=storage();persistLibrary(s,lib);assert.deepEqual(loadLibrary(s).library,lib);lib=removeTrip(lib,'second');assert.equal(lib.activeId,'first');assert.throws(()=>removeTrip(lib,'first'));
});
test('collection imports and corrupt v2 storage cannot silently replace a legacy plan',()=>{
 for(const value of [{version:9},{...emptyLibrary(),activeId:'missing'},{...emptyLibrary(),trips:[]},{...emptyLibrary(),trips:[...emptyLibrary().trips,...emptyLibrary().trips]}])assert.throws(()=>validateLibrary(value));
 const s=storage();s.setItem(STORAGE_KEY,JSON.stringify(emptyJourney()));s.setItem(LIBRARY_KEY,'bad');assert.equal(loadLibrary(s).status,'blocked');assert.equal(s.getItem(LIBRARY_KEY),'bad');
 let lib=emptyLibrary();for(let i=1;i<10;i++)lib=addTrip(lib,'trip-'+i);assert.throws(()=>addTrip(lib,'eleventh'));
 const denied={getItem(){throw Error('blocked');},setItem(){throw Error('quota');}};assert.equal(loadLibrary(denied).status,'blocked');assert.equal(persistLibrary(denied,lib),false);
});
test('calendar labels handle leap days, month/year boundaries and leave unplanned ideas undated',()=>{
 assert.equal(validDate('2027-02-29'),false);assert.equal(validDate('2028-02-29'),true);assert.equal(validDate('2026-04-31'),false);assert.equal(validDate(''),true);
 assert.match(dayLabel({startDate:'2028-02-28'},2),/29 Feb 2028/);assert.match(dayLabel({startDate:'2027-12-31'},2),/1 Jan 2028/);assert.equal(dayLabel({startDate:'2027-12-31'},0),'Ideas for later');assert.equal(dayLabel({},3),'Day 3');
 assert.throws(()=>parseBackup(JSON.stringify({...emptyJourney(),startDate:'2026-13-01'})));
});
