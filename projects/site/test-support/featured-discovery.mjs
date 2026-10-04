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
  const visible=home.replace(/<template\b[^>]*>[\s\S]*?<\/template>/g,'');
  const cards=visible.match(/<div class="story-card-grid"[\s\S]*?<\/section>/)?.[0];
  assert.ok(cards);assert.equal((cards.match(/<article[ >]/g)||[]).length,3);
  const credits=home.match(/<details[^>]*><summary[^>]*>Image credits<\/summary>[\s\S]*?<\/details>/)?.[0];
  assert.ok(credits);
  for(const {href} of selection){
   const card=cards.match(new RegExp('<article[^>]*>(?:(?!<article)[\\s\\S])*?href="'+href+'"[\\s\\S]*?<\\/article>'))?.[0];
   assert.ok(card,href);assert.match(card,/<img[^>]+srcset=/);assert.match(read(href),/<h1[ >]/);
  }
  const food=json('../../kb/research/food/collection.json'),bose=json('../../kb/research/people/subhas-chandra-bose.json'),chilika=json('../../kb/research/stories/narratives/chilika.json');
  for(const asset of [chilika.image,food.assets[food.pages.find(p=>p.slug==='odisha-rasagola').hero],bose.assets[bose.hero]])
   for(const credit of [asset.source,asset.creator,asset.license_url])assert.ok(credits.includes(credit),credit);
 });
 test('changing stories have complete inert cards, credit templates and published destinations',()=>{
  const home=read('/');
  const config=json('../../kb/research/featured-stories.json');
  const templates=[...home.matchAll(/<template\b[^>]*data-story-template="([^"]+)"[^>]*>([\s\S]*?)<\/template>/g)];
  const options=JSON.parse(home.match(/<script[^>]*data-story-options[^>]*>([\s\S]*?)<\/script>/)[1]);
  assert.equal(templates.length,30);
  assert.equal(options.pool.length,30);
  assert.equal(options.themes.length,12);
  for(const theme of options.themes) {
   assert.ok(theme.preferred.length);
   for(const href of theme.preferred)assert.ok(options.pool.some(e=>e.href===href));
  }
  assert.deepEqual(options.pins,config.pins);
  for(const slot of ['place','taste','life'])assert.equal(options.pool.filter(e=>e.slot===slot).length,10);
  for(const [,href,template] of templates){
   assert.ok(options.pool.some(e=>e.href===href));
   assert.equal((template.match(/<article[ >]/g)||[]).length,1);
   assert.match(template,/<img\b/);
   assert.match(template,/data-story-credit/);
   const intro=config.pool.find(e=>e.href===href).intro;
   assert.ok(intro && template.includes(intro.replaceAll('&','&amp;')),href+' intro');
   assert.match(read(href),/<h1[ >]/);
   for(const [,src] of template.matchAll(/<img[^>]*src="([^"?]+)"/g))
    assert.ok(readFileSync(directory+src).length>0,src);
  }
  assert.match(home,/data-another-beginning[^>]*hidden/);
  assert.match(home,/data-featured-credits/);
  assert.match(home,/aria-live="polite"/);
 });
 test('every featured story offers a specific onward story and a journey link',()=>{
  const config=json('../../kb/research/featured-stories.json');
  for(const {href} of config.pool){
   const html=read(href);
   assert.ok(html.includes('href="/journey/"'),href+' journey');
   assert.ok(html.includes('data-save-journey'),href+' save');
   const links=[...html.matchAll(/href="(\/(?:knowledge|destinations|visit|food|people|crafts|textiles|literature|stories)\/[^"#?]+\/)"/g)].map(m=>m[1]).filter(link=>link!==href);
   assert.ok(links.length,href+' onward story');
   for(const link of new Set(links))assert.match(read(link),/<h1[ >]/);
  }
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
