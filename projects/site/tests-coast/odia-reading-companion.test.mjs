import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const read=path=>readFileSync('dist-coast'+path+'index.html','utf8');
test('public reading companion retains four ideas, three chapters, credit and a noindex boundary',()=>{
 const page=read('/literature/reading-journey/'),data=JSON.parse(page.match(/id="journey-data"[^>]*>(.*?)<\/script>/s)[1]);
 const starter=data.starters.find(s=>s.id==='odia-reading'),trail=data.trails.find(t=>t.starter_id==='odia-reading');assert.equal(starter.items.length,4);assert.equal(trail.chapters.length,3);assert.equal(starter.story_trail,trail.starter_id);
 for(const c of trail.chapters){assert.ok(existsSync('dist-coast'+c.photo.src));for(const id of c.ideas){const entry=data.catalog.find(e=>e.id===id);assert.ok(entry);assert.ok(read(entry.href).includes('href="/literature/reading-journey/"'));}}
 assert.match(page,/name="robots" content="noindex/);assert.ok(page.includes('no fresh source verification'));assert.ok(page.includes('not an identified Sarala Mahabharata manuscript'));assert.ok(read('/literature/').includes('href="/literature/reading-journey/"'));
});
