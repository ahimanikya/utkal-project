import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
import {buildTourBook,buildTextItinerary,escapeHTML} from '../src/lib/tour-book.mjs';
const regions=JSON.parse(readFileSync('../../kb/research/destinations/regions.json','utf8'));
const record=JSON.parse(readFileSync('../../kb/research/destinations/central-details.json','utf8')).records.find(r=>r.slug==='jobra-maritime-museum');
const route='/visit/experiences/jobra-maritime-museum/';
const html=readFileSync('dist'+route+'index.html','utf8');
const catalog=JSON.parse(readFileSync('dist/index.html','utf8').match(/<script[^>]*id="journey-data"[^>]*>([\s\S]*?)<\/script>/)[1]).catalog;
test('Jobra documentary images retain dimensions, rights and dated context',async()=>{
 for(const id of ['jobra-courtyard','jobra-workshop','jobra-boat-display']){
  const a=regions.assets[id],bytes=readFileSync('public'+a.src),m=await sharp(bytes).metadata();
  assert.equal(m.width,a.width);assert.equal(m.height,a.height);
  assert.equal(createHash('sha256').update(bytes).digest('hex'),a.sha256);
  for(const s of [a.source,a.license_url,a.creator,a.caption])assert.ok(html.includes(escapeHTML(s)),s);
  assert.match(html,new RegExp('<img[^>]*src="'+a.src+'"[^>]*srcset='));
 }
 assert.ok(html.includes('max-width: 469px'));
 assert.ok(html.includes('not a photograph of workers building a vessel'));
});
test('Jobra is discoverable and retains a stable saved identity and full portable context',()=>{
 const item=catalog.find(i=>i.id===record.save_id);assert.equal(item.href,route);
 assert.ok(readFileSync('dist/destinations/cuttack/index.html','utf8').includes('href="'+route+'"'));
 assert.ok(readFileSync('dist/things-to-do/index.html','utf8').includes('href="'+route+'"'));
 const plan={version:1,title:'A day in Cuttack',items:[{id:record.save_id,day:1,notes:'Ask about the crane.'}]};
 const book=buildTourBook(plan,catalog),text=buildTextItinerary(plan,catalog);
 for(const s of record.sections)for(const p of [s.text,...(s.paragraphs||[])]){
  assert.ok(html.includes(escapeHTML(p)));assert.ok(book.includes(escapeHTML(p)));assert.ok(text.includes(p));
 }
 for(const id of record.sources)for(const out of [html,book,text])assert.ok(out.includes(regions.sources[id].url));
 assert.ok(text.includes('Ask about the crane.'));
 const illustrated=buildTourBook(plan,catalog,{illustrated:true,images:{[item.photo.src]:'data:image/webp;base64,'+readFileSync('public'+item.photo.src).toString('base64')}});
 assert.ok(illustrated.includes('creativecommons.org/licenses/by-sa/3.0/'));
 assert.ok(illustrated.includes('Gouravmoy Mohanty'));
});
