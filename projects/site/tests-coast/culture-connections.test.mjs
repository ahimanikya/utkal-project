import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const data=JSON.parse(readFileSync('../../kb/research/voices/culture-trails.json','utf8'));
const scope=JSON.parse(readFileSync('editions/coast.json','utf8'));
const read=path=>readFileSync('dist-coast'+path+'index.html','utf8');
test('public pages expose contextual trails, credited images and available reading links only',()=>{
 for(const trail of data.trails){
  for(const path of trail.show_on){
   if(!scope.routes.includes(path))continue;
   const html=read(path);assert.ok(html.includes(`id="${trail.id}"`),path+' '+trail.id);
   assert.ok(html.includes(trail.image_credit.creator));assert.ok(html.includes(trail.image_credit.license_url));
   assert.match(html,/Reading-trail sources &(?:amp;)? image credits/);
   assert.ok(html.includes('need separate confirmation'));
   assert.ok(existsSync('dist-coast'+trail.image));
   assert.ok(!html.includes('href="/stories/culture-trails/"'));
   for(const link of trail.links){
    assert.ok(html.includes(`href="${link.href}"`),path+' '+link.href);
    const [route,fragment]=link.href.split('#');assert.ok(scope.routes.includes(route));if(fragment)assert.ok(read(route).includes(`id="${fragment}"`));
   }
  }
 }
 assert.ok(!existsSync('dist-coast/stories/culture-trails/index.html'));
});
