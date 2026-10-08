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
const starter=data.starters.find(s=>s.id==='odia-reading');
const ids=['reading:people/gangadhar-meher','reading:people/bhima-bhoi','reading:people/sarala-das','reading:people/fakir-mohan-senapati'];
test('Odia companion preserves existing starter identities and older saved journeys',()=>{
 assert.deepEqual(starter.items,ids);
 const old=emptyLibrary();old.trips[0].plan=addItem(old.trips[0].plan,'place:konark');old.trips[0].plan.items[0].notes='Keep existing travel notes';const before=structuredClone(old);
 const library=createStarterTrip(old,'reading-test',starter,data.catalog.map(x=>x.id));assert.deepEqual(old,before);assert.deepEqual(library.trips[0],before.trips[0]);assert.ok(library.trips[1].plan.items.every(x=>x.day===0));assert.deepEqual(parseBackup(JSON.stringify(library)),library);
 let plan=library.trips[1].plan;assert.equal(selectedStoryTrail(plan,data.trails).chapters.length,3);
 plan=removeWithUndo(plan,ids[0]).plan;assert.equal(selectedStoryTrail(plan,data.trails).chapters.length,3);
 plan=removeWithUndo(plan,ids[2]).plan;assert.equal(selectedStoryTrail(plan,data.trails).chapters.length,2);assert.ok(!selectedStoryTrail(plan,data.trails).chapters.some(c=>c.id==='pattern-and-epic'));
});
test('portable reading companion uses reading prompts, credited images and private-note controls',async()=>{
 const plan=createStarterTrip(emptyLibrary(),'reading-test',starter,data.catalog.map(x=>x.id)).trips[1].plan;plan.items[0].notes='PRIVATE_READING_SENTINEL';
 const images=await collectBookImages(plan,data.catalog,async()=>({data:'data:image/png;base64,AAAA',bytes:3}),{additionalPhotos:storyTrailPhotos(plan,data.trails)});
 const opts={trails:data.trails,images:images.images,illustrated:true,includePersonalNotes:false};const book=buildTourBook(plan,data.catalog,opts),text=buildTextItinerary(plan,data.catalog,opts);
 assert.ok(book.includes('Read with a question'));assert.ok(text.includes('Read with a question:'));assert.ok(!book.includes('PRIVATE_READING_SENTINEL'));assert.ok(!text.includes('PRIVATE_READING_SENTINEL'));
 for(const title of ['Gangadhar Meher','Bhima Bhoi','Sarala Das','Fakir Mohan Senapati']){assert.ok(book.includes(title));assert.ok(text.includes(title));}
 assert.ok(book.includes('not an identified Sarala Mahabharata manuscript'));assert.ok(book.includes('creativecommons.org/'));assert.ok(book.includes('Sahitya Akademi'));
 assert.ok(buildTourBook(plan,data.catalog,{...opts,includePersonalNotes:true}).includes('PRIVATE_READING_SENTINEL'));
 const trail=data.trails.find(t=>t.starter_id==='odia-reading');for(const chapter of trail.chapters)assert.ok(book.includes(chapter.photo.creator));
});
test('reading doors connect to a single-heading collection with source scope intact',()=>{
 const page=read('/literature/reading-journey/');assert.equal((page.match(/<h1\b/g)||[]).length,1);assert.ok(page.includes('not a chronology'));assert.ok(page.includes('data-journey-starter="odia-reading"'));
 for(const path of ['/literature/','/languages/odia/','/people/gangadhar-meher/','/people/bhima-bhoi/','/people/sarala-das/','/people/fakir-mohan-senapati/','/explore/','/journey-starters/'])assert.ok(read(path).includes('href="/literature/reading-journey/"'),path);
 assert.ok(read('/contribute/').includes('value="/literature/reading-journey/"'));
});
