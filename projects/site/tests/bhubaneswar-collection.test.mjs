import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createStarterTrip} from '../src/lib/journey-starters.mjs';
import {emptyLibrary,addItem} from '../src/lib/journey.mjs';
const read=route=>readFileSync(`dist/${route}/index.html`,'utf8');
const starters=JSON.parse(readFileSync('../../kb/research/journey-starters.json','utf8')).starters;
const cityStarter=starters.find(s=>s.id==='bhubaneswar-stone-painted-streets');
const ids=[...read('journey').matchAll(/data-save-journey="([^"]+)"/g)].map(m=>m[1]);
test('city, discovery and corrections reach all three guides with the existing saved identities',()=>{
 const city=read('destinations/bhubaneswar');
 for(const [route,id] of [['visit/places/mukteswar','place:mukteswar'],['visit/stays/bhubaneswar','stay:bhubaneswar'],['food/bhubaneswar','food:bhubaneswar-dalma']]){
  assert.ok(city.includes(`href="/${route}/${route.startsWith('food')?'#dalma':''}"`));
  assert.ok(read(route).includes(`data-save-journey="${id}"`));
  assert.ok(read('explore').includes(`/${route}/`));
  assert.ok(read('contribute').includes(`/${route}/`));
  assert.ok(read(route).includes('href="/destinations/bhubaneswar/"'));
 }
 for(const id of ['place-mukteswar','food-bhubaneswar-dalma','stay-bhubaneswar'])assert.ok(city.includes(`id="${id}"`));
});
test('food and stay guides retain useful distinctions, onward routes and credited photography',()=>{
 const food=read('food/bhubaneswar'),stay=read('visit/stays/bhubaneswar'),temple=read('visit/places/mukteswar');
 for(const route of ['/knowledge/pakhala/','/food/chhena-poda/','/visit/places/mukteswar/','/visit/stays/bhubaneswar/'])assert.ok(food.includes(`href="${route}"`));
 for(const text of ['Old Town / Ekamra','Janpath and the central city','An arrival-focused base','Transport to plan','not an accommodation'])assert.ok(stay.includes(text));
 for(const text of ['Andrew Moore','creativecommons.org/licenses/by-sa/2.0/','mag-cover--contain','mukteswar-torana.jpg'])assert.ok(temple.includes(text));
 assert.ok(food.includes('photographed in Puri'));
});
test('expanded city starter leaves a previously saved three-item city plan, dates and notes intact',()=>{
 const library=emptyLibrary();
 for(const id of ['place:bhubaneswar','place:dhauli','experience:bhubaneswar-fresco'])library.trips[0].plan=addItem(library.trips[0].plan,id);
 library.trips[0].plan.startDate='2026-12-12';library.trips[0].plan.items[0].notes='Keep lunch unhurried';library.trips[0].plan.items[0].day=1;
 const before=structuredClone(library),after=createStarterTrip(library,'expanded-city',cityStarter,ids);
 assert.deepEqual(library,before);assert.deepEqual(after.trips[0],before.trips[0]);
 assert.equal(after.trips[1].plan.items.length,6);assert.ok(after.trips[1].plan.items.every(i=>i.day===0&&i.notes===''));assert.equal(after.trips[1].plan.startDate,undefined);
});
