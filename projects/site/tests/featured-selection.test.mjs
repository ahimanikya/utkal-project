import test from 'node:test';
import assert from 'node:assert/strict';
import {chooseStoryTrio,cleanStoryHistory,validateStorySelection,odishaDay} from '../src/lib/featured-selection.mjs';
const pool=['place','taste','life'].flatMap(slot=>Array.from({length:10},(_,i)=>({href:`/${slot}/${i}/`,slot,regions:[i%2?'North':'South'],preferred_months:[]})));
const options={day:'2026-10-04',random:()=>0};
test('trios retain all three roles and avoid the last six visits when space permits',()=>{
 let history=[];
 for(let i=0;i<20;i++){
  const picked=chooseStoryTrio(pool,{...options,history});
  assert.deepEqual(picked.map(e=>e.slot),['place','taste','life']);
  for(const e of picked)assert.ok(!history.includes(e.href));
  history=cleanStoryHistory([...picked.map(e=>e.href),...history],pool);
  assert.ok(history.length<=18);
 }
});
test('every pool member is reachable with random selection',()=>{
 const reached=new Set();
 for(let i=0;i<100;i++) for(const e of chooseStoryTrio(pool,{...options,random:()=>i/100})) reached.add(e.href);
 assert.equal(reached.size,30);
});
test('active editorial pin overrides freshness, with inclusive expiry and scheduled start',()=>{
 const pins=[{slot:'life',href:'/life/9/',starts:'2026-10-04',expires:'2026-10-05'}];
 validateStorySelection(pool,pins);
 const get=day=>chooseStoryTrio(pool,{...options,day,pins,history:['/life/9/']})[2].href;
 assert.equal(get('2026-10-04'),'/life/9/');assert.equal(get('2026-10-05'),'/life/9/');
 assert.notEqual(get('2026-10-03'),'/life/9/');assert.notEqual(get('2026-10-06'),'/life/9/');
});
test('invalid, unbounded, ineligible and conflicting pins fail validation',()=>{
 for(const pins of [
 [{slot:'life',href:'/life/0/'}],
 [{slot:'life',href:'/life/0/',expires:'2026-02-30'}],
 [{slot:'life',href:'/private/',expires:'2026-10-04'}],
 [{slot:'life',href:'/life/0/',starts:'2026-10-05',expires:'2026-10-04'}],
 [{slot:'life',href:'/life/0/',expires:'2026-10-05'},{slot:'life',href:'/life/1/',starts:'2026-10-05',expires:'2026-10-06'}],
 ])assert.throws(()=>validateStorySelection(pool,pins));
});
test('seasonal and regional preferences influence selection without excluding other stories',()=>{
 const small=[{href:'/p/',slot:'place',regions:['South']},{href:'/a/',slot:'taste',regions:['North']},{href:'/b/',slot:'taste',regions:['South'],preferred_months:[10]},{href:'/l/',slot:'life'}];
 assert.equal(chooseStoryTrio(small,{...options,random:()=>0.2})[1].href,'/b/');
 assert.equal(chooseStoryTrio(small,{...options,random:()=>0})[1].href,'/a/');
});
test('old and corrupt stored history is sanitized and bounded',()=>{
 assert.deepEqual(cleanStoryHistory({x:1},pool),[]);
 assert.deepEqual(cleanStoryHistory(['/removed/',null,2,'/place/1/','/place/1/','/taste/1/'],pool,1),['/place/1/']);
});
test('a small exhausted pool still supplies each role',()=>{
 const small=pool.filter(e=>e.href.endsWith('/0/'));
 assert.equal(chooseStoryTrio(small,{...options,history:small.map(e=>e.href)}).length,3);
});
test('calendar boundaries use Odisha time',()=>{
 assert.equal(odishaDay(new Date('2026-10-04T18:29:59Z')),'2026-10-04');
 assert.equal(odishaDay(new Date('2026-10-04T18:30:00Z')),'2026-10-05');
});
