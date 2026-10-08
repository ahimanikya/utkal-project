import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {selectCultureTrails} from '../src/lib/culture-trails.mjs';
const data=JSON.parse(readFileSync('../../kb/research/voices/culture-trails.json','utf8'));
test('cultural trails require every destination, respect context and leave canonical evidence intact',()=>{
 const before=JSON.stringify(data);
 assert.equal(selectCultureTrails(data.trails,{all:true}).length,3);
 assert.deepEqual(selectCultureTrails(data.trails,{path:'/literature/'}).map(t=>t.id),['chilika-poetry','balasore-fiction']);
 assert.deepEqual(selectCultureTrails(data.trails,{path:'/unrelated/'}),[]);
 const held=selectCultureTrails(data.trails,{all:true,allowsPage:href=>!href.startsWith('/languages/santali/')});
 assert.deepEqual(held.map(t=>t.id),['chilika-poetry','balasore-fiction']);
 assert.equal(JSON.stringify(data),before);
});
test('full edition retains all cultural trails and their resolved reading anchors',()=>{
 const hub=readFileSync('dist/stories/culture-trails/index.html','utf8');
 for(const trail of data.trails){
  assert.ok(hub.includes(`id="${trail.id}"`));
  for(const link of trail.links){const [path,fragment]=link.href.split('#');const page=readFileSync('dist'+path+'index.html','utf8');if(fragment)assert.ok(page.includes(`id="${fragment}"`),link.href);}
 }
});
