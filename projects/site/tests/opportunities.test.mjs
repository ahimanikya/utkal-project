import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=path=>readFileSync(path,'utf8');
const data=JSON.parse(read('../../kb/research/collections/tourism-opportunities.json'));
const html=read('dist/opportunities/index.html');
const body=html.match(/<main\b[\s\S]*?<\/main>/)[0];
test('opportunities provides readable guidance and cultural paths without script execution',()=>{
 assert.equal((body.match(/<h1\b/g)||[]).length,1);
 for(const id of ['official-guidance','cultural-reading','contribute'])assert.ok(body.includes(`id="${id}"`));
 for(const card of data.guidance){
  assert.equal(card.application_url,null);
  const rendered=body.match(new RegExp(`<article[^>]+id="${card.id}"[\\s\\S]*?</article>`))[0];
  assert.ok(rendered.includes(card.limit));assert.ok(rendered.includes(card.url));
  assert.doesNotMatch(rendered,/Apply now|Book now|guaranteed benefit/i);
 }
 assert.match(body,/Application route not yet verified/);
 assert.match(body,/Partial document review/);
 assert.match(body,/not confirmed group itineraries or bookable experiences/);
 assert.doesNotMatch(body,/<form\b|<input\b|otiims\.odisha/);
});
test('reading links reuse canonical plans and do not mutate saved journeys',()=>{
 const plans=JSON.parse(read('../../kb/research/destinations/flexible-visit-plans.json')).plans;
 for(const item of data.reading){assert.ok(plans.some(p=>p.starter_id===item.id&&p.href===item.href));assert.ok(body.includes(`href="${item.href}"`));}
 assert.doesNotMatch(read('src/pages/opportunities.astro'),/localStorage|gtag\(|fetch\(|data-save/);
});
test('public contribution, attribution and review extent accompany opportunities',()=>{
 assert.match(body,/Contributions are posted publicly through GitHub Issues/);
 assert.match(body,/identity documents, bank details, guest lists/);
 assert.ok(body.includes('/contribute/?page=%2Fopportunities%2F'));
 assert.match(body,/<details[^>]*><summary[^>]*>Sources, review limits/);
 for(const card of data.guidance){assert.ok(body.includes(card.source_id));assert.ok(body.includes(card.review_extent));}
 const assets=JSON.parse(read('../../kb/research/destinations/regions.json')).assets;
 for(const key of new Set([data.hero,...data.reading.map(r=>r.photo)])){
  assert.ok(body.includes(assets[key].license_url));
  assert.ok(body.includes(assets[key].source.replaceAll('&','&amp;')));
 }
});
test('opportunities is discoverable but held outside the search shortlist',()=>{
 for(const route of ['about','global-connections','explore','contribute'])assert.ok(read(`dist/${route}/index.html`).includes('/opportunities/'));
 const candidate=JSON.parse(read('editions/search-candidate.json')).pages.find(p=>p.route===data.route);
 assert.equal(candidate.decision,'hold');
 assert.match(html,/<meta name="robots" content="noindex,\s*nofollow"/);
});
