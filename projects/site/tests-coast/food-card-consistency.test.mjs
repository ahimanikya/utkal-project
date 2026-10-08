import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
test('coastal saved food cards use the published article introduction with stable IDs',()=>{
 const {catalog}=JSON.parse(readFileSync('dist-coast/journey/index.html','utf8').match(/id="journey-data"[^>]*>(.*?)<\/script>/s)[1]);
 const foods=JSON.parse(readFileSync('../../kb/research/food/collection.json','utf8'));
 for(const food of foods.pages){const matches=catalog.filter(i=>i.id===food.save_id);assert.equal(matches.length,1);assert.equal(matches[0].area,food.planning_area||food.area);assert.equal(matches[0].title,food.title);assert.equal(matches[0].summary,food.lead);assert.equal(matches[0].href,`/food/${food.slug}/`);}
});
