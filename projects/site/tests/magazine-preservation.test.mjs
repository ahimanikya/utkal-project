import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>JSON.parse(readFileSync('../../kb/research/'+p,'utf8'));
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
test('magazine migration preserves every food and author paragraph, section and reading link',()=>{
 const food=read('food/collection.json').pages.find(p=>p.slug==='chhena-poda');
 const person=read('voices/collection.json').pages.find(p=>p.path==='people/gopinath-mohanty');
 for(const [page,path] of [[food,'food/chhena-poda'],[person,person.path]]){
  const html=readFileSync('dist/'+path+'/index.html','utf8');
  for(const section of page.sections){
   assert.ok(html.includes(`id="${section.id}"`),section.id);
   for(const p of section.paragraphs){assert.ok(html.includes(escape(p.text)),p.text);if(p.source_ids.length)assert.ok(html.includes(`data-source-ids="${p.source_ids.join(' ')}"`));}
  }
  for(const link of page.external_links||[])assert.ok(html.includes(`href="${link.href}"`));
 }
});
test('destination magazine configuration resolves stable content identities and preserves all experience text',()=>{
 const layouts=read('stories/magazine-layouts.json');
 for(const [slug,layout] of Object.entries(layouts)){
  const d=read('destinations/'+slug+'.json');
  assert.ok(d.foods.some(f=>f.id===layout.foodLead));
  for(const [id,ref] of Object.entries(layout.experienceImages)){assert.ok(d.experiences.some(e=>e.id===id));assert.ok(d.visuals[ref]);}
  const html=readFileSync('dist/knowledge/'+slug+'/index.html','utf8');
  for(const item of [...d.experiences,...d.foods,...d.bases]){assert.ok(html.includes(escape(item.text)));assert.ok(html.includes(`data-save-journey="${item.id}"`));}
 }
});
