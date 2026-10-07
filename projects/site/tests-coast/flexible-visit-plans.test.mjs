import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const plans=JSON.parse(readFileSync('../../kb/research/destinations/flexible-visit-plans.json','utf8')).plans;
const read=route=>readFileSync('dist-coast'+route+'index.html','utf8');
const payload=html=>JSON.parse(html.match(/id="journey-data"[^>]*>(.*?)<\/script>/s)[1]);
test('three flexible plans ship with matching shared journey data, photographs and retained search boundaries',()=>{
 const data=payload(read('/journey/'));
 for(const p of plans){
  const html=read(p.href);assert.deepEqual(payload(html),data);assert.match(html,/name="robots" content="noindex/);
  const s=data.starters.find(s=>s.id===p.starter_id);assert.equal(s.items.length,3);assert.equal(s.story_trail,p.starter_id);
  for(const c of data.trails.find(t=>t.starter_id===p.starter_id).chapters)assert.ok(existsSync('dist-coast'+c.photo.src));
  assert.ok(read('/journey-starters/').includes('href="'+p.href+'"'));
 }
});
