import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createStarterTrip} from '../src/lib/journey-starters.mjs';
import {emptyLibrary,addItem} from '../src/lib/journey.mjs';
import {buildTourBook} from '../src/lib/tour-book.mjs';
const read=p=>readFileSync('dist-coast'+p+'index.html','utf8');
const data=JSON.parse(readFileSync('../../kb/research/culture/textile-stories.json'));
const journey=JSON.parse(read('/').match(/id="journey-data"[^>]*>([\s\S]*?)<\/script>/)[1]);
test('Tasar separates recorded material, museum display, geography and current visit arrangements',()=>{
 const html=read('/textiles/tasar/');
 for(const t of ['Rasulpur (Gopalpur) in Jajpur','distinct from Gopalpur-on-Sea in Ganjam','Museum display, not a working workshop','29 October 2018','2 February 2020','not independently identified','does not establish an ahimsa or cruelty-free process'])assert.ok(html.includes(t),t);
 const p=data.pages.find(p=>p.slug==='tasar');assert.equal(p.sections.filter(s=>s.photo).length,2);
 for(const id of ['tasar-host-plants','weaving-clusters','weaving-centres','tasar-processing','tasar-museum'])assert.ok(html.includes(data.sources[id].url));
 assert.ok(read('/textiles/').includes('href="/textiles/tasar/"'));
 assert.ok(!read('/textiles/').includes('These three stories'));
 for(const path of ['/destinations/mayurbhanj/','/languages/districts/jajapur/','/languages/districts/mayurbhanj/','/textiles/khandua/','/knowledge/kotpad/'])assert.ok(read(path).includes('href="/textiles/tasar/"'),path);
});
test('expanded starter keeps older saved trips intact and exports Tasar provenance and care questions',()=>{
 const old=emptyLibrary();old.trips[0].plan=addItem(old.trips[0].plan,'reading:textiles/khandua');old.trips[0].plan.items[0].notes='Ask about the poem';const before=structuredClone(old);
 const starter=journey.starters.find(s=>s.id==='woven-in-odisha');const next=createStarterTrip(old,'tasar-review',starter,journey.catalog.map(i=>i.id));
 assert.deepEqual(old,before);assert.deepEqual(next.trips[0],before.trips[0]);assert.equal(next.trips[1].plan.items.length,5);
 const tasar=journey.catalog.find(i=>i.id==='reading:textiles/tasar');assert.ok(tasar);assert.equal(tasar.photo.creator,'Kritzolina');assert.ok(tasar.sources.some(s=>s.url.includes('important-handloom-clusters')));
 const book=buildTourBook(next.trips[1].plan,journey.catalog);for(const t of ['Tasar · the silk before the sari','Gopalpur-on-Sea','fibre composition','possible colour transfer','museum display'])assert.ok(book.includes(t),t);
 assert.equal(journey.catalog.filter(i=>i.id==='reading:textiles/tasar').length,1);
});
