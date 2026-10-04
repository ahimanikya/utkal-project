import test from 'node:test';
import assert from 'node:assert/strict';
import {DAY_OUTLINE,addDayOutline,journeyDayCards,journeyNextStep} from '../src/lib/journey-coach.mjs';
import {parseBackup,emptyLibrary,LIBRARY_KEY} from '../src/lib/journey.mjs';
import {setDayNote,shiftPlannedDays,dayChangeUndo,undoDayChange} from '../src/lib/day-planner.mjs';
import {selectBookPlan} from '../src/lib/journey-ready.mjs';
import {buildTourBook,buildTextItinerary} from '../src/lib/tour-book.mjs';
import {saveLibraryChecked,storageSnapshot} from '../src/lib/journey-storage.mjs';
const plan=()=>({version:1,title:'A personal Odisha journey',items:[{id:'place:one',day:1,notes:'PRIVATE ITEM'},{id:'place:old',day:0,notes:'Keep this old idea'}]});
const catalog=[{id:'place:one',title:'A public place',kind:'Place',area:'Cuttack',summary:'A public description',href:'/destinations/cuttack/',sources:[]}];
test('next-step guidance handles empty, unscheduled, planned and open-question states without claiming verification',()=>{
 const empty={version:1,title:'Start',items:[]};assert.equal(journeyNextStep(empty).href,'/journey-starters/#find-your-trail');
 assert.match(journeyNextStep({...plan(),items:plan().items.map(i=>({...i,day:0}))}).title,/anchor/);
 assert.match(journeyNextStep(plan()).text,/1 idea is still for later/);
 const scheduled={...plan(),items:plan().items.map(i=>({...i,day:1})),reminders:[{id:'pickup',text:'PRIVATE PICKUP',done:false}]};
 assert.equal(journeyNextStep(scheduled).href,'#personal-reminders');
 scheduled.reminders[0].done=true;const step=journeyNextStep(scheduled);assert.equal(step.href,'#take-journey');assert.match(step.text,/do not verify arrangements/);
 assert.equal(journeyNextStep(setDayNote(empty,2,'Pause','Read')).href,'#take-journey');
});
test('day outlines append without overwriting notes, stay idempotent and round-trip in existing backups',()=>{
 const original=setDayNote(plan(),1,'PRIVATE TITLE','PRIVATE NOTES ଓଡ଼ିଶା'),before=structuredClone(original),next=addDayOutline(original,1);
 assert.equal(next.dayNotes[0].notes,'PRIVATE NOTES ଓଡ଼ିଶା\n\n'+DAY_OUTLINE);assert.equal(next.dayNotes[0].title,'PRIVATE TITLE');assert.deepEqual(next.items,original.items);
 assert.deepEqual(original,before);assert.deepEqual(addDayOutline(next,1),next);assert.deepEqual(parseBackup(JSON.stringify(next)),next);
});
test('invalid days and oversized outlines fail atomically without truncating private writing',()=>{
 const original=setDayNote(plan(),1,'Keep','x'.repeat(1990)),before=structuredClone(original);
 assert.throws(()=>addDayOutline(original,1),/not enough room/);assert.deepEqual(original,before);
 for(const day of [0,31,-1,1.5,'1'])assert.throws(()=>addDayOutline(plan(),day),/Choose a day/);
});
test('outline shifts and undo retain the full day, while selected-day and shared exports obey note privacy',()=>{
 const before=setDayNote(plan(),1,'PRIVATE TITLE','PRIVATE NOTES'),outlined=addDayOutline(before,1),shifted=shiftPlannedDays(outlined,2);
 assert.equal(shifted.dayNotes[0].day,3);assert.equal(shifted.items[0].day,3);assert.deepEqual(undoDayChange(outlined,dayChangeUndo(before,outlined)),before);
 const selected=selectBookPlan(shifted,3);
 for(const build of [buildTourBook,buildTextItinerary]){
  const personal=build(selected,catalog),shared=build(selected,catalog,{includePersonalNotes:false});
  assert.ok(personal.includes('Your days at a glance'));assert.ok(personal.includes('Still to confirm:'));assert.ok(personal.includes('PRIVATE NOTES'));
  for(const privateText of ['PRIVATE TITLE','PRIVATE NOTES','PRIVATE ITEM','My day outline'])assert.ok(!shared.includes(privateText),privateText);
  assert.ok(!personal.includes('place:old'));assert.ok(shared.includes('A public place'));
 }
 const unsafe=buildTourBook(setDayNote(plan(),1,'<img src=x onerror=bad()>','notes'),catalog);assert.ok(!unsafe.includes('<img src=x'));assert.ok(unsafe.includes('&lt;img'));
});
test('day overview keeps empty and unavailable ideas visible, limits preview length and omits private titles on request',()=>{
 const p=setDayNote(plan(),2,'PRIVATE QUIET','Pause');p.items.push(...[2,3,4,5].map(n=>({id:'place:item'+n,day:1,notes:''})));
 const cards=journeyDayCards(p,catalog);assert.deepEqual(cards.map(c=>c.day),[1,2,0]);assert.equal(cards[0].count,5);assert.equal(cards[0].ideas.length,3);assert.equal(cards[0].more,2);
 assert.equal(cards[1].count,0);assert.equal(cards[1].title,'PRIVATE QUIET');assert.match(cards[2].ideas[0],/Unavailable idea/);
 assert.ok(journeyDayCards(p,catalog,{includePersonalNotes:false}).every(c=>c.title===''));assert.equal(p.dayNotes[0].title,'PRIVATE QUIET');
});
test('outline saves respect a newer tab and preserve a complete exportable in-memory candidate',()=>{
 const library=emptyLibrary();library.trips[0].plan=plan();let raw=JSON.stringify(library);
 const storage={getItem:key=>key===LIBRARY_KEY?raw:null,setItem(_key,value){raw=value;}};const baseline=storageSnapshot(storage);
 const candidate=structuredClone(library);candidate.trips[0].plan=addDayOutline(candidate.trips[0].plan,1);
 const newer=structuredClone(library);newer.trips[0].plan.title='NEWER TAB';raw=JSON.stringify(newer);
 assert.equal(saveLibraryChecked(storage,candidate,baseline).status,'conflict');assert.deepEqual(JSON.parse(raw),newer);assert.ok(parseBackup(JSON.stringify(candidate)).trips[0].plan.dayNotes[0].notes.includes(DAY_OUTLINE));
});
