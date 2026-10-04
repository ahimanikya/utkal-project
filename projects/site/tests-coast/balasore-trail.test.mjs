import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
test('Balasore illustrated trail and shared book data survive the public-edition build',()=>{
 const page=readFileSync('dist-coast/journey-starters/balasore/index.html','utf8');
 const payload=html=>JSON.parse(html.match(/id="journey-data"[^>]*>(.*?)<\/script>/s)[1]);
 const data=payload(page),trail=data.trails.find(t=>t.starter_id==='northern-stories');assert.equal(trail.chapters.length,3);
 for(const route of ['/journey/','/stories/bhubaneswar-fresco/'])assert.deepEqual(payload(readFileSync('dist-coast'+route+'index.html','utf8')),data);
 for(const chapter of trail.chapters){assert.ok(existsSync('dist-coast'+chapter.photo.src));for(const id of chapter.ideas){const entry=data.catalog.find(i=>i.id===id);assert.ok(readFileSync('dist-coast'+entry.href.split('#')[0]+'index.html','utf8').includes('href="/journey-starters/balasore/"'));}}
 assert.equal(data.starters.find(s=>s.id===trail.starter_id).story_trail,trail.starter_id);
 assert.ok(readFileSync('dist-coast/journey-starters/index.html','utf8').includes('href="/journey-starters/balasore/"'));
 assert.match(page,/name="robots" content="noindex/);
});
