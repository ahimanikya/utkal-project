import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
import {buildTourBook,buildTextItinerary,escapeHTML} from '../src/lib/tour-book.mjs';
const regions=JSON.parse(readFileSync('../../kb/research/destinations/regions.json','utf8'));
const record=JSON.parse(readFileSync('../../kb/research/destinations/central-details.json','utf8')).records.find(r=>r.slug==='cuttack-filigree');
const html=readFileSync('dist/visit/experiences/cuttack-filigree/index.html','utf8');
const catalog=JSON.parse(readFileSync('dist/index.html','utf8').match(/<script[^>]*id="journey-data"[^>]*>([\s\S]*?)<\/script>/)[1]).catalog;
test('Tarakasi photographs retain accurate dimensions, rights and lazy responsive rendering',async()=>{
 for(const id of ['tarakasi-wirework','tarakasi-chandi-medha']){
  const asset=regions.assets[id],bytes=readFileSync('public'+asset.src),meta=await sharp(bytes).metadata();
  assert.equal(meta.width,asset.width);assert.equal(meta.height,asset.height);
  assert.equal(createHash('sha256').update(bytes).digest('hex'),asset.sha256);
  const tag=html.match(new RegExp('<img[^>]*src="'+asset.src+'"[^>]*>'))?.[0];
  assert.ok(tag);assert.match(tag,/loading="lazy"/);assert.match(tag,/srcset=/);
  for(const text of [asset.source,asset.license_url,asset.creator])assert.ok(html.includes(escapeHTML(text)));
 }
 assert.ok(html.includes('26 September 2009'));
 assert.ok(html.includes('not a listing for this year'));
});
test('explanatory structure drawing is accessible and separate from documentary photographs',()=>{
 assert.ok(html.includes('aria-labelledby="filigree-title filigree-desc"'));
 assert.equal((html.match(/id="filigree-title"/g)||[]).length,1);
 assert.ok(html.includes('not a traditional design or a making sequence'));
 assert.ok(!html.includes('seventy'));
});
test('Tarakasi reading and source context survive saved tour-book export',()=>{
 const plan={version:1,title:'Cuttack craft',items:[{id:'experience:cuttack-filigree',day:1,notes:'Ask who designed the piece.'}]};
 const book=buildTourBook(plan,catalog),text=buildTextItinerary(plan,catalog);
 for(const section of record.sections)for(const p of [section.text,...(section.paragraphs||[])]){
  assert.ok(html.includes(escapeHTML(p)));assert.ok(book.includes(escapeHTML(p)));assert.ok(text.includes(p));
 }
 for(const id of record.sources)for(const output of [book,text])assert.ok(output.includes(regions.sources[id].url));
});
