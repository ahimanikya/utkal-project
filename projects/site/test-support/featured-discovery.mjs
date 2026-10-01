import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const json=path=>JSON.parse(readFileSync(path,'utf8'));
export function checkFeaturedDiscovery(directory){
 const read=route=>readFileSync(directory+route+'index.html','utf8');
 test('homepage presents three illustrated entry points with retained photograph credits',()=>{
  const home=read('/');
  const selection=json('../../kb/research/featured-stories.json').entries;
  assert.deepEqual(selection.map(e=>e.href),['/knowledge/chilika/','/food/odisha-rasagola/','/people/subhas-chandra-bose/']);
  const cards=home.match(/<div class="story-card-grid"[\s\S]*?<\/section>/)?.[0];
  assert.ok(cards);assert.equal((cards.match(/<article[ >]/g)||[]).length,3);
  const credits=home.match(/<details[^>]*><summary[^>]*>Story photograph credits<\/summary>[\s\S]*?<\/details>/)?.[0];
  assert.ok(credits);
  for(const {href} of selection){
   const card=cards.match(new RegExp('<article[^>]*>(?:(?!<article)[\\s\\S])*?href="'+href+'"[\\s\\S]*?<\\/article>'))?.[0];
   assert.ok(card,href);assert.match(card,/<img[^>]+srcset=/);assert.match(read(href),/<h1[ >]/);
  }
  const food=json('../../kb/research/food/collection.json'),bose=json('../../kb/research/people/subhas-chandra-bose.json'),chilika=json('../../kb/research/stories/narratives/chilika.json');
  for(const asset of [chilika.image,food.assets[food.pages.find(p=>p.slug==='odisha-rasagola').hero],bose.assets[bose.hero]])
   for(const credit of [asset.source,asset.creator,asset.license_url])assert.ok(credits.includes(credit),credit);
 });
 test('a photographed building is not framed as a portrait, while literary portraits remain contained',()=>{
  const home=read('/'),explore=read('/explore/');
  const bose=json('../../kb/research/people/subhas-chandra-bose.json');
  const filename=bose.assets[bose.hero].src.split('/').pop();
  for(const html of [home,explore]){
   const image=[...html.matchAll(/<img\b[^>]*>/g)].map(m=>m[0]).find(img=>img.includes(filename));
   assert.ok(image,filename);assert.ok(!image.includes('-portrait'));
  }
  assert.match(explore,/<img[^>]*class="[^"]*explore-portrait/);
 });
 test('food reading connects to childhood, the museum and another Odisha sweet',()=>{
  const cuttack=read('/food/cuttack/');
  for(const href of ['/people/subhas-chandra-bose/','/visit/experiences/cuttack-netaji/'])assert.ok(cuttack.includes(`href="${href}"`));
  assert.ok(read('/food/odisha-rasagola/').includes('href="/food/chhena-poda/"'));
 });
}
