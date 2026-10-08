import test from 'node:test';
import assert from 'node:assert/strict';
import {isReadingCollection,journeyGuidance} from '../src/lib/journey-reading.mjs';
import {journeyNextStep,addDayOutline,READING_OUTLINE} from '../src/lib/journey-coach.mjs';
import {parseBackup} from '../src/lib/journey.mjs';
import {buildTourBook} from '../src/lib/tour-book.mjs';
const entries=[{id:'reading:writer',kind:'Reading',title:'Writer',href:'/people/sarala-das/',sources:[]},{id:'place:shore',kind:'Place',title:'Shore',href:'/knowledge/chilika/',sources:[]}];
const reading=()=>({version:1,title:'My books',startDate:'2026-12-01',items:[{id:'reading:writer',day:0,notes:'PRIVATE edition note'}],checklist:['transport'],dayNotes:[{day:2,title:'PRIVATE day',notes:'PRIVATE passage'}]});
test('reading classification requires every saved idea to be known Reading; names and ID prefixes confer no mode',()=>{
 const p=reading();assert.equal(isReadingCollection(p,entries),true);
 for(const items of [[],[...p.items,{id:'place:shore',day:0,notes:''}],[...p.items,{id:'reading:missing',day:0,notes:''}]])assert.equal(isReadingCollection({...p,items},entries),false);
 assert.equal(isReadingCollection(p),false);assert.equal(isReadingCollection(p,[{id:'reading:writer',kind:'Place'}]),false);
});
test('reading guidance keeps dates optional, surfaces personal reminders, and never changes the plan while switching contexts',()=>{
 const p=reading(),before=structuredClone(p),mixed={...p,items:[...p.items,{id:'place:shore',day:1,notes:''}]};
 assert.equal(journeyNextStep(p,entries).href,'#take-journey');assert.match(journeyNextStep(p,entries).text,/Dates are optional/);
 assert.equal(journeyNextStep({...p,reminders:[{id:'edition',text:'Find edition',done:false}]},entries).href,'#personal-reminders');
 assert.match(journeyGuidance(p,entries).checklist,/optional/);assert.match(journeyGuidance(mixed,entries).date,/travel/);assert.match(journeyNextStep(mixed,entries).title,/Decide/);
 assert.deepEqual(journeyGuidance(p,entries),journeyGuidance(before,entries));assert.deepEqual(p,before);assert.deepEqual(parseBackup(JSON.stringify(p)),before);
});
test('reading outlines append to private day notes, are idempotent and survive backups without leaking to shared books',()=>{
 const p=reading(),before=structuredClone(p),next=addDayOutline(p,2,{reading:true});
 assert.equal(next.dayNotes[0].notes,'PRIVATE passage\n\n'+READING_OUTLINE);assert.deepEqual(addDayOutline(next,2,{reading:true}),next);assert.deepEqual(p,before);assert.deepEqual(parseBackup(JSON.stringify(next)),next);
 const own=buildTourBook(next,entries),shared=buildTourBook(next,entries,{includePersonalNotes:false});assert.ok(own.includes('My reading outline'));for(const secret of ['PRIVATE passage','PRIVATE day','PRIVATE edition note','My reading outline'])assert.ok(!shared.includes(secret));
 assert.throws(()=>addDayOutline({...p,dayNotes:[{day:2,title:'Keep',notes:'x'.repeat(1990)}]},2,{reading:true}),/not enough room/);
});
