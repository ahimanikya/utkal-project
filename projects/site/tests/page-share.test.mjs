import test from 'node:test';
import assert from 'node:assert/strict';
import {pageShareURL} from '../src/lib/page-share.mjs';
const choices={topics:['All','Food','Places'],regions:['All','Across Odisha','Puri']};
test('Explore sharing preserves the rendered query, filters and order with safe URL encoding',()=>{
 const location=new URL('https://utkalproject.org/explore/?q=stale&token=private#private');
 const state={q:' piṭha & ପିଠା ',topic:'Food',region:'Across Odisha',sort:'title'};
 const result=new URL(pageShareURL(location,state,choices));
 assert.deepEqual([...result.searchParams],[['q','piṭha & ପିଠା'],['topic','Food'],['region','Across Odisha'],['sort','title']]);
 assert.equal(result.hash,'');assert.equal(result.origin,location.origin);
 assert.equal(state.q,' piṭha & ପିଠା ');
});
test('clean and invalid selections stay bounded and do not forward unrelated URL fields',()=>{
 const location=new URL('https://utkalproject.org/explore/?credit=private&topic=Bad#notes');
 assert.equal(pageShareURL(location,{},choices),'https://utkalproject.org/explore/');
 const result=new URL(pageShareURL(location,{q:'x'.repeat(250),topic:'Bad',region:'Unknown',sort:'evil',notes:'private'},choices));
 assert.equal(result.searchParams.get('q').length,200);
 assert.deepEqual([...result.searchParams.keys()],['q']);
});
test('journey, contribution and article links never include query, fragment or selected data',()=>{
 for(const pathname of ['/journey/','/contribute/','/knowledge/chilika/']) {
  const location=new URL('https://utkalproject.org'+pathname+'?notes=private&q=secret#draft');
  assert.equal(pageShareURL(location,{q:'secret',topic:'Food',region:'Puri',sort:'title'},choices),'https://utkalproject.org'+pathname);
 }
});
