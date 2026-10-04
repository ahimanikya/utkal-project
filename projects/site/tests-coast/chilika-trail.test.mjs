import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
test('Chilika trail is retained in the public edition with shared book data and guide return paths',()=>{
 const page=readFileSync('dist-coast/journey-starters/chilika/index.html','utf8');
 const data=JSON.parse(page.match(/id="journey-data"[^>]*>(.*?)<\/script>/s)[1]);
 const trail=data.trails.find(t=>t.starter_id==='chilika-island');assert.equal(trail.chapters.length,4);
 for(const path of ['/journey/','/stories/bhubaneswar-fresco/']){
  const html=readFileSync('dist-coast'+path+'index.html','utf8');assert.deepEqual(JSON.parse(html.match(/id="journey-data"[^>]*>(.*?)<\/script>/s)[1]),data);
 }
 for(const chapter of trail.chapters){assert.ok(existsSync('dist-coast'+chapter.photo.src));for(const id of chapter.ideas){const entry=data.catalog.find(i=>i.id===id);assert.ok(entry,id);assert.ok(readFileSync('dist-coast'+entry.href.split('#')[0]+'index.html','utf8').includes('href="/journey-starters/chilika/"'));}}
 for(const id of ['chilika-birds','chilika-island','chilika-satapada'])assert.equal(data.starters.find(s=>s.id===id).story_trail,'chilika-island');
 assert.ok(readFileSync('dist-coast/journey-starters/index.html','utf8').includes('href="/journey-starters/chilika/"'));
 assert.ok(page.includes('name="robots" content="noindex, nofollow"')||page.includes('name="robots" content="noindex'));
});
