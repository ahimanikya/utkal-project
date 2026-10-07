import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {emptyLibrary,addItem,parseBackup,removeWithUndo} from '../src/lib/journey.mjs';
import {createStarterTrip} from '../src/lib/journey-starters.mjs';
import {selectedStoryTrail,storyTrailPhotos} from '../src/lib/story-trails.mjs';
import {buildTourBook,buildTextItinerary} from '../src/lib/tour-book.mjs';
import {collectBookImages} from '../src/lib/book-images.mjs';
const read=route=>readFileSync('dist'+route+'index.html','utf8');
const data=JSON.parse(read('/journey/').match(/id="journey-data"[^>]*>(.*?)<\/script>/s)[1]);
const starter=data.starters.find(s=>s.id==='odisha-three-tastes');
test('food collection creates a separate unscheduled journey and preserves older plans',()=>{
 const before=emptyLibrary();before.trips[0].plan=addItem(before.trips[0].plan,'place:konark');before.trips[0].plan.items[0].notes='Existing notes';const old=structuredClone(before);
 const lib=createStarterTrip(before,'food-test',starter,data.catalog.map(i=>i.id));assert.deepEqual(before,old);assert.deepEqual(lib.trips[0],old.trips[0]);assert.equal(lib.trips[1].plan.items.length,3);assert.ok(lib.trips[1].plan.items.every(i=>i.day===0));assert.deepEqual(parseBackup(JSON.stringify(lib)),lib);
 const plan=removeWithUndo(lib.trips[1].plan,'food:konark-machha-besara').plan;const trail=selectedStoryTrail(plan,data.trails);assert.equal(trail.chapters.length,2);assert.ok(!trail.chapters.some(c=>c.ideas.includes('food:konark-machha-besara')));
});
test('illustrated food book includes selected stories and credits without private notes',async()=>{
 const plan=createStarterTrip(emptyLibrary(),'food-test',starter,data.catalog.map(i=>i.id)).trips[1].plan;plan.items[0].notes='PRIVATE_SENTINEL';
 const imageData=await collectBookImages(plan,data.catalog,async()=>({data:'data:image/png;base64,AAAA',bytes:3}),{additionalPhotos:storyTrailPhotos(plan,data.trails)});
 const opts={trails:data.trails,images:imageData.images,illustrated:true,includePersonalNotes:false};const book=buildTourBook(plan,data.catalog,opts),text=buildTextItinerary(plan,data.catalog,opts);
 for(const title of ['Dalma','Dahibara','Machha']){assert.ok(book.includes(title));assert.ok(text.includes(title));}for(const credit of ['Subhashish Panigrahi','Kumarnihar','creativecommons.org/licenses/by-sa/'])assert.ok(book.includes(credit));assert.ok(!book.includes('PRIVATE_SENTINEL'));assert.ok(!text.includes('PRIVATE_SENTINEL'));
});
test('food hub and article connections expose the collection with honest route boundaries',()=>{
 const html=read('/food/');for(const slug of ['dalma','dahibara-aloodum','machha-besara','three-tastes','everyday','fire-cooking'])assert.ok(html.includes('href="/food/'+slug+'/"'));
 const trail=read('/food/three-tastes/');assert.equal((trail.match(/<h1\b/g)||[]).length,1);assert.ok(trail.includes('not a suggested one-day route'));assert.ok(trail.includes('data-journey-starter="odisha-three-tastes"'));assert.ok(read('/contribute/').includes('value="/food/three-tastes/"'));
});
