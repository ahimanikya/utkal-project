import test from 'node:test';
import assert from 'node:assert/strict';
import {buildTourBook,buildTextItinerary,escapeHTML} from '../src/lib/tour-book.mjs';
import {selectBookPlan} from '../src/lib/journey-ready.mjs';
import questions from '../../../kb/research/destinations/visit-questions.json' with {type:'json'};
const catalog=questions.guides.map(g=>({id:g.save_id,title:g.title,href:g.route,kind:'Place',area:g.title,summary:'PUBLIC SUMMARY '+g.id,checked:'2026-09-30',sources:[],visitQuestions:g.questions}));
const reminder=(text,done=false,id='r')=>({id,text,done});
const base=()=>({version:1,title:'A portable journey',items:[{id:'place:konark',day:1,notes:'PRIVATE ITEM ONE'},{id:'place:puri',day:2,notes:'PRIVATE ITEM TWO'}],dayNotes:[{day:1,title:'PRIVATE TITLE',notes:'PRIVATE DAY'}],reminders:[reminder('PRIVATE REMINDER')]});
const cases=[
 ['open reminder',p=>p,1],
 ['completed reminder',p=>({...p,reminders:[reminder('PRIVATE COMPLETE',true)]}),1],
 ['Odia and accented text',p=>({...p,reminders:[reminder('PRIVATE ଓଡ଼ିଶା · café')]}),1],
 ['hostile HTML text',p=>({...p,reminders:[reminder('PRIVATE </li><script>alert(1)</script><img src=x onerror=bad()>')]}),1],
 ['multiline reminder',p=>({...p,reminders:[reminder('PRIVATE line one\nline two\nline three')]}),1],
 ['maximum reminder length',p=>({...p,reminders:[reminder('PRIVATE '+'x'.repeat(492))]}),1],
 ['unavailable saved idea',p=>({...p,items:[...p.items,{id:'old:outside',day:1,notes:'PRIVATE OLD NOTE'}]}),1],
 ['day with notes and no stops',p=>({...p,dayNotes:[...p.dayNotes,{day:3,title:'PRIVATE PAUSE',notes:'PRIVATE READ'}]}),3],
 ['ideas for later',p=>({...p,items:[...p.items,{id:'place:raghurajpur',day:0,notes:'PRIVATE LATER'}]}),0],
 ['retained checklist IDs',p=>({...p,checklist:['transport','retired-prompt']}),1],
 ['forty reminder boundary',p=>({...p,reminders:Array.from({length:40},(_,i)=>reminder('PRIVATE ROW '+i,i%2===0,'r'+i))}),1],
 ['legacy plan without reminders',p=>{delete p.reminders;return p;},1]
];
const modes=[['HTML whole private',true,true,false],['HTML whole shareable',true,false,false],['text whole private',false,true,false],['text whole shareable',false,false,false],['HTML selected day',true,true,true],['text selected day',false,true,true]];
let id=85;
for(const [name,adjust,day] of cases)for(const [mode,html,includePersonalNotes,scoped] of modes)test(`R216-${id++} ${name} — ${mode}`,()=>{
 const original=adjust(base()),before=JSON.stringify(original),plan=selectBookPlan(original,scoped?day:'all');
 const output=(html?buildTourBook:buildTextItinerary)(plan,catalog,{includePersonalNotes,generatedAt:'2026-09-30'}),format=html?escapeHTML:v=>v;
 for(const r of plan.reminders||[])assert.equal(output.includes(format(r.text)),includePersonalNotes);
 for(const n of plan.dayNotes||[])for(const t of [n.title,n.notes])assert.equal(output.includes(format(t)),includePersonalNotes);
 for(const i of original.items){const kept=plan.items.some(j=>j.id===i.id);assert.equal(output.includes(format(i.notes)),kept&&includePersonalNotes);const entry=catalog.find(e=>e.id===i.id);if(entry)for(const q of entry.visitQuestions)assert.equal(output.includes(format(q.text)),kept);}
 assert.equal(JSON.stringify(original),before);
 if(html){assert.ok(!output.includes('<script>'));assert.ok(!output.includes('<img src=x'));assert.ok(output.includes("default-src 'none'"));}
 if(plan.reminders?.length&&includePersonalNotes)assert.ok(output.includes('Done')||output.includes('To check'));
});
assert.equal(id,157);
