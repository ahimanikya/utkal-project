import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {emptyJourney,addItem} from '../src/lib/journey.mjs';
import {buildTourBook,buildTextItinerary} from '../src/lib/tour-book.mjs';
const story=JSON.parse(readFileSync('../../kb/research/stories/narratives/maritime-memory.json'));
test('public maritime reading item has the same portable evidence and separate museum choice',()=>{
 const html=readFileSync('dist-coast/stories/maritime-memory/index.html','utf8');
 const data=JSON.parse(html.match(/id="journey-data"[^>]*>(.*?)<\/script>/s)[1]);
 const item=data.catalog.find(x=>x.id===story.save_id);assert.equal(item.kind,'Reading');assert.equal(item.href,story.href);
 assert.ok(data.catalog.some(x=>x.id===story.visit.save_id));assert.ok(html.includes('data-save-journey="'+story.save_id+'"'));assert.ok(html.includes('museum visit is a separate choice'));
 const plan=addItem(emptyJourney(),story.save_id),book=buildTourBook(plan,data.catalog),text=buildTextItinerary(plan,data.catalog);
 for(const s of story.sources){assert.ok(book.includes(s.note));assert.ok(text.includes(s.note));}
 assert.ok(book.includes('not a scheduled visit'));assert.equal(item.photo.caption,story.hero_caption);
 assert.equal(JSON.parse(readFileSync('editions/search-candidate.json')).pages.find(page=>page.route===story.href).decision,'hold');
});
