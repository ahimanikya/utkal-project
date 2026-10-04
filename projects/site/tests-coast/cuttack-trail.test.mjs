import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
test('Cuttack trail ships with photos and the same book payload in standard and Fresco layouts',()=>{
 const page=readFileSync('dist-coast/journey-starters/cuttack/index.html','utf8');
 const payload=html=>JSON.parse(html.match(/id="journey-data"[^>]*>(.*?)<\/script>/s)[1]);
 const data=payload(page),trail=data.trails.find(t=>t.starter_id==='cuttack-silver-stories');assert.equal(trail.chapters.length,4);
 for(const route of ['/journey/','/stories/bhubaneswar-fresco/'])assert.deepEqual(payload(readFileSync('dist-coast'+route+'index.html','utf8')),data);
 for(const chapter of trail.chapters)assert.ok(existsSync('dist-coast'+chapter.photo.src));
 assert.equal(data.starters.find(s=>s.id===trail.starter_id).story_trail,trail.starter_id);
 assert.ok(readFileSync('dist-coast/journey-starters/index.html','utf8').includes('href="/journey-starters/cuttack/"'));
 assert.match(page,/name="robots" content="noindex/);
});
