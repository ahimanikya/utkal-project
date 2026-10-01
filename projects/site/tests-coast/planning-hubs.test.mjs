import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(`dist-coast${p}index.html`,'utf8');
const hubs=['/destinations/','/food/','/things-to-do/','/stay-areas/'];
const catalog=JSON.parse(read('/').match(/id="journey-data"[^>]*>([\s\S]*?)<\/script>/)[1]).catalog;
test('planning hubs expose each published idea once and preserve canonical destinations',()=>{
 for(const [path,kind] of [['/food/','Food'],['/things-to-do/','Experience'],['/stay-areas/','Stay area']]){
  const html=read(path),ids=[...html.matchAll(/data-save-journey="([^"]+)"/g)].map(m=>m[1]);
  const expected=catalog.filter(i=>i.kind===kind);
  assert.deepEqual(ids.toSorted(),expected.map(i=>i.id).toSorted());assert.equal(ids.length,new Set(ids).size);
  for(const i of expected)assert.ok(html.includes(`href="${i.href.replaceAll('&','&amp;')}"`),i.href);
  assert.match(html,/aria-label="Jump to an area"/);assert.match(html,/Sources, photographs/);
 }
 for(const href of ['/destinations/balasore/','/destinations/mayurbhanj/','/knowledge/chilika/','/knowledge/konark/'])assert.ok(read('/destinations/').includes(`href="${href}"`));
 assert.match(read('/stay-areas/'),/Landscape context · not a property photograph/);
 assert.match(read('/things-to-do/'),/object-fit:contain/);
});
test('planning navigation and return links connect hubs, discovery and inner guides',()=>{
 for(const path of [...hubs,'/explore/','/journey-starters/','/']){
  const html=read(path),nav=html.match(/<nav[^>]*aria-label="Plan your visit"[^>]*>([\s\S]*?)<\/nav>/)?.[1];assert.ok(nav,path);
  for(const href of hubs)assert.ok(nav.includes(`href="${href}"`),path+' → '+href);
  const current=[...nav.matchAll(/aria-current="page"/g)];assert.equal(current.length,hubs.includes(path)||path==='/journey-starters/'?1:0);
 }
 for(const [path,back] of [['/destinations/balasore/','/destinations/'],['/food/chhena-poda/','/food/'],['/visit/experiences/mayurbhanj-chhau/','/things-to-do/'],['/visit/stays/similipal-gateways/','/stay-areas/']])assert.ok(read(path).includes(`href="${back}"`),path);
});
