import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {emptyLibrary,addItem,parseBackup} from '../src/lib/journey.mjs';
import {buildTourBook,buildTextItinerary,escapeHTML} from '../src/lib/tour-book.mjs';
const foods=JSON.parse(readFileSync('../../kb/research/food/collection.json','utf8'));
const html=readFileSync('dist/journey/index.html','utf8');
const {catalog}=JSON.parse(html.match(/id="journey-data"[^>]*>(.*?)<\/script>/s)[1]);
test('published food introductions stay consistent across saved cards and portable reading',()=>{
 for(const food of foods.pages){
  const matches=catalog.filter(item=>item.id===food.save_id);assert.equal(matches.length,1,food.save_id);
  const item=matches[0];assert.equal(item.area,food.planning_area||food.area);assert.equal(item.title,food.title);assert.equal(item.summary,food.lead);assert.equal(item.href,`/food/${food.slug}/`);
  const plan=addItem(emptyLibrary().trips[0].plan,food.save_id);
  const book=buildTourBook(plan,catalog),text=buildTextItinerary(plan,catalog);
  assert.ok(book.includes(escapeHTML(food.title)));assert.ok(book.includes(escapeHTML(food.lead)));
  assert.ok(text.includes(food.title));assert.ok(text.includes(food.lead));
  assert.ok(item.access);assert.ok(item.sources.length);assert.ok(item.practical.length);
 }
});
test('old food IDs restore notes, day and ordering while resolving to current story titles',()=>{
 const lib=emptyLibrary();const ids=['food:bhubaneswar-dalma','food:cuttack-dahibara','food:konark-machha-besara','food:konark-chhena-poda','food:baripada-mudhi-mansa','food:chandipur-seafood'];
 for(const id of ids)lib.trips[0].plan=addItem(lib.trips[0].plan,id);
 lib.trips[0].plan.items.forEach((item,i)=>{item.notes='Existing note '+i;item.day=i+1;});
 const restored=parseBackup(JSON.stringify(lib));assert.deepEqual(restored,lib);
 const before=JSON.stringify(restored);const book=buildTourBook(restored.trips[0].plan,catalog,{includePersonalNotes:true});
 assert.equal(JSON.stringify(restored),before);
 for(const [i,id] of ids.entries()){assert.ok(book.includes('Existing note '+i));assert.ok(book.includes(escapeHTML(foods.pages.find(p=>p.save_id===id).title)));}
 assert.equal(addItem(restored.trips[0].plan,ids[0]).items.length,ids.length);
});
