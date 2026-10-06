import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {buildTourBook,buildTextItinerary,escapeHTML} from '../src/lib/tour-book.mjs';
const html=readFileSync('dist/visit/places/raghurajpur/index.html','utf8');
const home=readFileSync('dist/index.html','utf8');
const catalog=JSON.parse(home.match(/<script[^>]*id="journey-data"[^>]*>([\s\S]*?)<\/script>/)[1]).catalog;
const record=JSON.parse(readFileSync('../../kb/research/destinations/central-details.json','utf8')).records.find(r=>r.slug==='raghurajpur');
test('Raghurajpur connects the brush photograph to the opening and retains its original credit',()=>{
 const opening=html.slice(html.indexOf('id="detail-section-1"'),html.indexOf('id="detail-section-2"'));
 assert.ok(opening.includes('pattachitra-making'));
 assert.ok(opening.indexOf('<figure')<opening.indexOf(escapeHTML(record.sections[0].text)));
 assert.match(opening,/loading="lazy"/);
 assert.match(opening,/srcset=/);
 assert.ok(html.includes('Sumit Surai'));
 assert.ok(html.includes('Raghurajpur_Artist.JPG'));
 assert.ok(html.includes('creativecommons.org/licenses/by-sa/4.0/'));
 assert.equal((html.match(/id="detail-section-/g)||[]).length,8);
});
test('saved Raghurajpur carries culture, season and sources into both portable formats',()=>{
 const plan={version:1,title:'A painted story',items:[{id:'place:raghurajpur',day:1,notes:'Ask before photographing.'}]};
 const book=buildTourBook(plan,catalog),text=buildTextItinerary(plan,catalog);
 for(const section of record.sections){
  for(const paragraph of [section.text,...(section.paragraphs||[])]){
   assert.ok(html.includes(escapeHTML(paragraph)));
   assert.ok(book.includes(escapeHTML(paragraph)),section.heading+' HTML book');
   assert.ok(text.includes(paragraph),section.heading+' text book');
  }
 }
 for(const url of ['https://www.incredibleindia.gov.in/en/rural-tourism/raghurajpur','https://www.srjan.com/achievements_Guru_Kelucharan_Mohapatra.php']){
  for(const output of [html,book,text])assert.ok(output.includes(url));
 }
 assert.ok(text.includes('Ask before photographing.'));
});
