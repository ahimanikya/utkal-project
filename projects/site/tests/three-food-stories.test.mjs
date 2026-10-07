import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {emptyLibrary,addItem,parseBackup} from '../src/lib/journey.mjs';
import {buildTourBook,buildTextItinerary,escapeHTML} from '../src/lib/tour-book.mjs';
const read=route=>readFileSync('dist'+route+'index.html','utf8');
const data=JSON.parse(read('/journey/').match(/id="journey-data"[^>]*>(.*?)<\/script>/s)[1]);
const foods=JSON.parse(readFileSync('../../kb/research/food/collection.json','utf8'));
for(const [slug,id,old,anchor] of [['dalma','food:bhubaneswar-dalma','bhubaneswar','dalma'],['dahibara-aloodum','food:cuttack-dahibara','cuttack','dahibara'],['machha-besara','food:konark-machha-besara','puri-coast','machha-besara']]){
 test(slug+' retains saved identity and regional anchors while opening the full story',()=>{
  const matches=data.catalog.filter(i=>i.id===id);assert.equal(matches.length,1);assert.equal(matches[0].href,'/food/'+slug+'/');
  assert.ok(read('/food/'+old+'/').includes('id="'+anchor+'"'));assert.ok(read('/food/'+old+'/').includes('href="/food/'+slug+'/"'));
  const lib=emptyLibrary();lib.trips[0].plan=addItem(lib.trips[0].plan,id);lib.trips[0].plan.items[0].notes='My existing food note';assert.deepEqual(parseBackup(JSON.stringify(lib)),lib);
  assert.equal(addItem(lib.trips[0].plan,id).items.length,1);
 });
 test(slug+' carries sourced reading and photo credits into the portable book',()=>{
  const p=foods.pages.find(p=>p.slug===slug),plan=addItem(emptyLibrary().trips[0].plan,id);plan.items[0].notes='PRIVATE_SENTINEL';
  const item=data.catalog.find(i=>i.id===id);assert.equal(item.photo.src,foods.assets[p.hero].src);
  const book=buildTourBook(plan,data.catalog,{includePersonalNotes:false}),text=buildTextItinerary(plan,data.catalog,{includePersonalNotes:false});
  for(const section of p.sections){assert.ok(book.includes(escapeHTML(section.title)));assert.ok(text.includes(section.title));}
  assert.ok(!book.includes('PRIVATE_SENTINEL'));assert.ok(item.sources.length>0);
  const html=read('/food/'+slug+'/');assert.ok(html.includes(item.photo.license_url));assert.ok(html.includes(item.photo.creator));assert.ok(html.includes('data-save-journey="'+id+'"'));
 });
}
