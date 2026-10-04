import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateJourney,emptyLibrary,parseBackup,duplicateTrip,removeWithUndo} from '../src/lib/journey.mjs';
import {createStarterTrip} from '../src/lib/journey-starters.mjs';
import {selectedStoryTrail,storyTrailPhotos} from '../src/lib/story-trails.mjs';
import {selectBookPlan} from '../src/lib/journey-ready.mjs';
import {buildTourBook,buildTextItinerary} from '../src/lib/tour-book.mjs';
import {collectBookImages} from '../src/lib/book-images.mjs';
const trail=JSON.parse(readFileSync('../../kb/research/destinations/stone-sea-trail.json'));
const regions=JSON.parse(readFileSync('../../kb/research/destinations/regions.json'));
const photos=['mukteswar-torana','raghurajpur-artisan','puri-beach'];
trail.chapters=trail.chapters.map((c,i)=>({...c,photo:regions.assets[photos[i]]}));
const starter=JSON.parse(readFileSync('../../kb/research/journey-starters.json')).starters.find(s=>s.id===trail.starter_id);
const entries=starter.items.map(id=>({id,title:id,summary:'A selected idea',href:'/destinations/puri/',sources:[]}));
const library=createStarterTrip(emptyLibrary(),'trail',starter,starter.items),plan=library.trips[1].plan;
test('new trail identity survives JSON, duplication and edits while legacy plans stay unchanged',()=>{
 assert.equal(plan.storyTrail,trail.starter_id);assert.deepEqual(parseBackup(JSON.stringify(library)),library);
 assert.equal(duplicateTrip(library,'trail','copy').trips[2].plan.storyTrail,trail.starter_id);
 assert.equal(removeWithUndo(plan,starter.items[0]).plan.storyTrail,trail.starter_id);
 const old={version:1,title:'Stone, sea and makers',items:[]};assert.deepEqual(validateJourney(old),old);assert.equal(selectedStoryTrail(old,[trail]),null);
 for(const id of ['https://example.com','<script>',{},'a'.repeat(81)])assert.throws(()=>validateJourney({...plan,storyTrail:id}));
 assert.equal(selectedStoryTrail({...plan,storyTrail:'unknown'},[trail]),null);
});
test('day exports and removed stops only carry matching chapters, without private notes in shared copies',()=>{
 const edited=structuredClone(plan);edited.items=edited.items.map(i=>({...i,day:i.id==='place:raghurajpur'?2:1,notes:'PRIVATE_NOTE'}));
 const day=selectBookPlan(edited,2),html=buildTourBook(day,entries,{trails:[trail],includePersonalNotes:false}),txt=buildTextItinerary(day,entries,{trails:[trail],includePersonalNotes:false});
 for(const out of [html,txt]){assert.ok(out.includes(trail.chapters[1].title));assert.ok(!out.includes(trail.chapters[0].title));assert.ok(!out.includes(trail.chapters[2].title));assert.ok(!out.includes('PRIVATE_NOTE'));assert.ok(out.includes(trail.chapters[1].prompt));}
 assert.equal(selectedStoryTrail({...plan,items:[]},[trail]),null);
});
test('all three documentary photos and credits embed offline within existing limits; failed images preserve text',async()=>{
 const image='data:image/png;base64,AAAA';const result=await collectBookImages(plan,entries,async()=>({data:image,bytes:3}),{additionalPhotos:storyTrailPhotos(plan,[trail])});
 assert.equal(Object.keys(result.images).length,3);
 const book=buildTourBook(plan,entries,{trails:[trail],images:result.images,illustrated:true});
 assert.equal((book.match(/<img /g)||[]).length,3);
 for(const c of trail.chapters){assert.ok(book.includes(c.photo.creator));assert.ok(book.includes(c.photo.license_url));assert.ok(book.includes(c.prompt));}
 const failed=await collectBookImages(plan,entries,async()=>{throw Error('offline');},{additionalPhotos:storyTrailPhotos(plan,[trail])});assert.equal(failed.skipped.length,3);
 const fallback=buildTourBook(plan,entries,{trails:[trail],images:failed.images,illustrated:true,omittedImages:3});assert.ok(fallback.includes('3 photographs could not be included'));assert.ok(fallback.includes(trail.chapters[0].title));assert.ok(!fallback.includes('<img '));
 const hostile=structuredClone(trail);hostile.chapters[0].text='<script>alert(1)</script>';hostile.sources=[{url:'javascript:alert(1)',title:'bad'}];
 const safe=buildTourBook(plan,entries,{trails:[hostile]});assert.ok(safe.includes('&lt;script&gt;'));assert.ok(!safe.includes('href="javascript:'));
});
