import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
test('public trail finder links five in-edition stories with shared planning data and no indexing expansion',()=>{
 const page=readFileSync('dist-coast/journey-starters/index.html','utf8');
 const getData=html=>JSON.parse(html.match(/id="journey-data"[^>]*>(.*?)<\/script>/s)[1]);
 const data=getData(page),comparison=JSON.parse(readFileSync('../../kb/research/trail-comparison.json'));
 assert.equal((page.match(/<article[^>]*data-trail-card/g)||[]).length,5);
 assert.ok(page.indexOf('id="find-your-trail"')<page.indexOf('id="stone-sea-makers"'));
 for(const c of comparison.trails){const trail=data.trails.find(t=>t.starter_id===c.trail_id);assert.ok(trail);assert.ok(page.includes('href="'+trail.href+'"'));assert.ok(existsSync('dist-coast'+trail.chapters[0].photo.src));const [path,fragment]=trail.href.split('#');const target=readFileSync('dist-coast'+path+'index.html','utf8');if(fragment)assert.ok(target.includes('id="'+fragment+'"'));assert.deepEqual(getData(target),data);}
 assert.match(page,/name="robots" content="noindex/);
 assert.deepEqual(getData(readFileSync('dist-coast/journey/index.html','utf8')),data);
});
