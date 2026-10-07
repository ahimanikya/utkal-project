import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {emptyLibrary,addItem,parseBackup,removeWithUndo} from '../src/lib/journey.mjs';
import {createStarterTrip} from '../src/lib/journey-starters.mjs';
import {selectedStoryTrail,storyTrailPhotos} from '../src/lib/story-trails.mjs';
import {buildTourBook,buildTextItinerary,escapeHTML} from '../src/lib/tour-book.mjs';
import {collectBookImages} from '../src/lib/book-images.mjs';
const plans=JSON.parse(readFileSync('../../kb/research/destinations/flexible-visit-plans.json','utf8')).plans;
const read=route=>readFileSync('dist'+route+'index.html','utf8');
const data=JSON.parse(read('/journey/').match(/id="journey-data"[^>]*>(.*?)<\/script>/s)[1]);
for(const p of plans){
 test(p.title+' creates a separate unscheduled plan without changing saved notes',()=>{
  const s=data.starters.find(s=>s.id===p.starter_id);assert.equal(s.items.length,3);
  const old=emptyLibrary();old.trips[0].plan=addItem(old.trips[0].plan,'place:konark');old.trips[0].plan.items[0].notes='Keep my existing plan';const before=structuredClone(old);
  const lib=createStarterTrip(old,p.slug,s,data.catalog.map(x=>x.id));assert.deepEqual(old,before);assert.deepEqual(lib.trips[0],before.trips[0]);assert.deepEqual(parseBackup(JSON.stringify(lib)),lib);
  const plan=lib.trips[1].plan;assert.ok(plan.items.every(i=>i.day===0));assert.equal(selectedStoryTrail(plan,data.trails).chapters.length,3);
  const shorter=removeWithUndo(plan,s.items[1]).plan;assert.equal(selectedStoryTrail(shorter,data.trails).chapters.length,2);
  assert.ok(!selectedStoryTrail(shorter,data.trails).chapters.some(c=>c.ideas.includes(s.items[1])));
 });
 test(p.title+' exports credited chapters and preparation while excluding private notes',async()=>{
  const s=data.starters.find(s=>s.id===p.starter_id),plan=createStarterTrip(emptyLibrary(),p.slug,s,data.catalog.map(x=>x.id)).trips[1].plan;
  plan.items=plan.items.map(i=>({...i,notes:'PRIVATE_SENTINEL'}));
  const collected=await collectBookImages(plan,data.catalog,async()=>({data:'data:image/png;base64,AAAA',bytes:3}),{additionalPhotos:storyTrailPhotos(plan,data.trails)});
  const options={trails:data.trails,illustrated:true,images:collected.images,includePersonalNotes:false};
  const book=buildTourBook(plan,data.catalog,options),text=buildTextItinerary(plan,data.catalog,options);
  for(const c of p.chapters)for(const output of [book,text]){assert.ok(output.includes(escapeHTML(c.title))||output.includes(c.title));assert.ok(output.includes(escapeHTML(c.prompt))||output.includes(c.prompt));assert.ok(!output.includes('PRIVATE_SENTINEL'));}
  for(const c of data.trails.find(t=>t.starter_id===p.starter_id).chapters){assert.ok(book.includes(c.photo.creator));assert.ok(book.includes(c.photo.license_url));}
  for(const item of p.preparation)assert.ok(book.includes(escapeHTML(item.text)));
 });
 test(p.title+' links the stories, plan, contribution form and printable journey',()=>{
  const html=read(p.href);assert.equal((html.match(/<h1\b/g)||[]).length,1);assert.equal((html.match(new RegExp('data-journey-starter="'+p.starter_id+'"','g'))||[]).length,1);
  const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length);
  assert.ok(read('/journey-starters/').includes('href="'+p.href+'"'));
  assert.ok(read('/contribute/').includes('value="'+p.href+'"'));
  for(const c of p.chapters)for(const id of c.ideas){const i=data.catalog.find(x=>x.id===id);assert.ok(html.includes('href="'+i.href+'"'));}
  assert.ok(html.includes('Every idea begins unscheduled'));assert.ok(html.includes('illustrated book'));
 });
}
