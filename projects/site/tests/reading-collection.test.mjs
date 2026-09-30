import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const packet=JSON.parse(readFileSync('../../kb/research/destinations/coastal-reading-collection.json','utf8'));
const starters=JSON.parse(readFileSync('../../kb/research/journey-starters.json','utf8')).starters;
test('the five-story reading path stays traversable, identifies the current chapter and ends at the visitor journey',()=>{
 const starter=starters.find(s=>packet.starter_href.endsWith('#'+s.id));
 assert.deepEqual(packet.chapters.map(c=>c.save_id),starter.items.slice(0,5));
 for(const [index,chapter] of packet.chapters.entries()){
  const page=readFileSync(`dist${chapter.href}index.html`,'utf8');
  assert.equal((page.match(/id="collection-onward"/g)||[]).length,1);
  const end=page.slice(page.indexOf('id="collection-onward"'));
  const nav=end.match(/<nav\b[^>]*aria-label="City, craft and coast chapters"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
  assert.ok(nav);assert.equal((nav.match(/aria-current="page"/g)||[]).length,1);
  for(const c of packet.chapters)assert.ok(nav.includes(`href="${c.href}"`));
  assert.ok(nav.includes(`href="${chapter.href}" aria-current="page"`));
  assert.ok(end.includes(`href="${packet.chapters[index+1]?.href||'/journey/'}"`));
  assert.ok(end.includes(`href="${packet.starter_href}"`));assert.ok(end.includes(packet.description));
  if(index<4){assert.ok(end.includes('Photograph credit'));assert.ok(end.includes('creativecommons.org/'));}
  if(chapter.href.includes('/visit/'))assert.ok(page.includes('id="connect-visit"'),'Preserve older deep links');
  assert.ok(!page.includes('id="related-discovery-heading"'),'One ending, not another recommendation block after it');
 }
 const other=readFileSync('dist/visit/places/mukteswar/index.html','utf8');
 assert.ok(other.includes('id="connect-visit"'));assert.ok(!other.includes('id="collection-onward"'));
});
