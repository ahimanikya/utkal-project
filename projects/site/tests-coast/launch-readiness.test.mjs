import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import sharp from 'sharp';
const read=p=>readFileSync(`dist-coast${p==='/'?'/index.html':p.endsWith('/')?p+'index.html':p}`,'utf8');
const routes=JSON.parse(readFileSync('editions/coast.json','utf8')).routes;
const attributes=tag=>Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(m=>[m[1],m[2]]));
test('responsive image choices resolve in the shipped edition with alt, dimensions and sizes',()=>{
 let responsive=0;
 for(const route of routes)for(const tag of read(route).matchAll(/<img\b[^>]*>/g)){
  const a=attributes(tag[0]);if(!a.srcset)continue;responsive++;assert.ok(a.sizes);assert.match(tag[0],/\salt(?:=|\s|>)/);assert.ok(+a.width>0&&+a.height>0);
  for(const candidate of a.srcset.split(', ')){const [path,width]=candidate.split(' ');assert.match(width,/^\d+w$/);assert.ok(existsSync('dist-coast'+path),route+' '+path);}
  if(a.fetchpriority==='high')assert.notEqual(a.loading,'lazy');
 }
 for(const route of ['/', '/knowledge/chilika/', '/knowledge/konark/', '/destinations/bhubaneswar/', '/visit/places/dhauli/', '/people/pratibha-ray/'])assert.match(read(route),/srcset="[^"]+\/images\/responsive\//,route);
 assert.ok(responsive>0);
});
test('image variants preserve proportions and reduce the mobile delivery size',async()=>{
 const report=JSON.parse(readFileSync('.astro/responsive-image-report.json','utf8'));
 let original=0,mobile=0;
 for(const item of report.images){
  original+=item.original_bytes;mobile+=item.variants[0].bytes;
  const source=await sharp('public'+item.src).metadata();
  for(const v of item.variants){const meta=await sharp('public'+v.src).metadata();assert.equal(meta.width,v.width);assert.equal(meta.height,v.height);assert.ok(meta.width<=source.width);assert.ok(Math.abs(meta.height-meta.width*source.height/source.width)<=1);}
 }
 assert.ok(mobile<original*.5);
});
test('destination contents support the same mobile reading controls as cultural pages',()=>{
 for(const route of ['/knowledge/chilika/','/knowledge/konark/','/destinations/bhubaneswar/','/destinations/puri/']){
  const html=read(route);assert.match(html,/<details class="story-contents-mobile"/);assert.match(html,/<nav class="mag-navigation story-contents-desktop"/);
 }
});
test('practical notes stay inside their guide before the notebook, onward links and credits',()=>{
 const notes=JSON.parse(readFileSync('../../kb/research/destinations/visit-readiness.json','utf8')).notes;
 const expected=notes.flatMap(n=>n.routes);
 for(const route of routes){
  const html=read(route),matches=[...html.matchAll(/id="current-arrangements"/g)];
  assert.equal(matches.length,expected.includes(route)?1:0,route);
  if(!expected.includes(route))continue;
  const position=matches[0].index;
  assert.ok(html.lastIndexOf('<article class="mag-content"',position)>=0,route);
  for(const end of ['id="visit-notebook"','id="connect-visit"','id="collection-onward"','id="sources-credits"','id="sources"']){
   const next=html.indexOf(end);if(next>=0)assert.ok(position<next,route+' '+end);
  }
  assert.match(html,/Official references checked 2026-10-01/);
  assert.match(html,/individual arrangements have not been confirmed locally/);
 }
 assert.equal(expected.length,9);
});
test('normal publication still excludes search activation and held commercial content',()=>{
 assert.equal(existsSync('dist-coast/sitemap.xml'),false);
 for(const route of routes){assert.match(read(route),/<meta name="robots" content="noindex, nofollow"/);assert.doesNotMatch(read(route),/href="\/store\//);}
});
