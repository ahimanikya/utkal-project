import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {buildTourBook,buildTextItinerary,escapeHTML} from '../src/lib/tour-book.mjs';
const notebooks=JSON.parse(readFileSync('../../kb/research/destinations/visit-notebooks.json','utf8')).notebooks;
const home=readFileSync('dist/index.html','utf8');
const catalog=JSON.parse(home.match(/<script[^>]*id="journey-data"[^>]*>([\s\S]*?)<\/script>/)[1]).catalog;
test('planning references survive page rendering and both portable formats for all seven guides',()=>{
 for(const note of notebooks){
  const html=readFileSync('dist'+note.route+'index.html','utf8');
  const plan={version:1,title:'Reference check',items:[{id:note.save_id,day:1,notes:''}]};
  const book=buildTourBook(plan,catalog),text=buildTextItinerary(plan,catalog);
  assert.ok(note.planning_review.remaining.length>0);
  for(const source of note.planning_sources){
   assert.ok(html.includes(escapeHTML(source.url)),note.route+' page source');
   assert.ok(html.includes('Planning reference checked '+source.checked_on));
   assert.ok(book.includes(escapeHTML(source.url)),note.route+' HTML source');
   assert.ok(text.includes(source.url),note.route+' text source');
  }
  assert.ok(book.includes(escapeHTML(note.prepare)));
  assert.ok(text.includes(note.prepare));
 }
});
test('portable print style lets the user choose A4 or Letter and preserves long Odia notes',()=>{
 const note=('A slow day in Odisha. '.repeat(100))+' ଓଡ଼ିଶା END-OF-NOTE';
 const book=buildTourBook({version:1,title:'Print check',items:[{id:'place:konark',day:1,notes:note}]},catalog);
 assert.match(book,/@page\{size:auto;margin:18mm\}/);
 assert.match(readFileSync('src/pages/journey.astro','utf8'),/@page\{size:auto;margin:18mm\}/);
 assert.ok(book.includes(escapeHTML(note)));
 assert.match(book,/break-after:avoid/);
 assert.match(book,/break-inside:avoid/);
});
